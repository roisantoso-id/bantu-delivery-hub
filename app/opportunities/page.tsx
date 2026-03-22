'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { statusConfig, serviceTypeLabels } from '@/lib/constants'
import {
  Target,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
} from 'lucide-react'
import {
  getOpportunities,
  getOpportunityStats,
  type OpportunityListItem,
  type OpportunityStats,
  type OpportunityFilters,
} from './actions'

const L = {
  title: '商机管理',
  total: '全部商机',
  active: '进行中',
  won: '已成交',
  lost: '已流失',
  unassigned: '未指派',
  searchPlaceholder: '搜索商机编号或客户名...',
  allStatus: '全部状态',
  allService: '全部类型',
  colCode: '商机编号',
  colCustomer: '客户名称',
  colService: '服务类型',
  colStatus: '状态',
  colAmount: '预估金额',
  colExecutor: '执行人',
  colCreated: '创建时间',
  colActions: '操作',
  viewDetail: '查看',
  loading: '加载中...',
  noData: '暂无商机数据',
  items: '条',
  notAssigned: '未指派',
}

const serviceTypeOptions = Object.entries(serviceTypeLabels).map(([value, label]) => ({ value, label }))
const statusOptions = [
  { value: 'active', label: '进行中' },
  { value: 'won', label: '已成交' },
  { value: 'lost', label: '已流失' },
]

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function formatAmount(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`
}

export default function OpportunitiesPage() {
  const user = useAuth()
  const [items, setItems] = useState<OpportunityListItem[]>([])
  const [stats, setStats] = useState<OpportunityStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<OpportunityFilters>({ page: 1, pageSize: 20 })
  const [search, setSearch] = useState('')

  const loadData = useCallback(async (f: OpportunityFilters) => {
    setLoading(true)
    try {
      const [result, statsResult] = await Promise.all([
        getOpportunities(f),
        getOpportunityStats(),
      ])
      setItems(result.items)
      setTotal(result.total)
      setStats(statsResult)
    } catch (err) {
      console.error('Failed to load opportunities:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    loadData(filters)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = (patch: Partial<OpportunityFilters>) => {
    const next = { ...filters, ...patch, page: patch.page ?? 1 }
    setFilters(next)
    loadData(next)
  }

  const handleSearch = () => {
    applyFilters({ search: search || undefined })
  }

  const totalPages = Math.ceil(total / (filters.pageSize ?? 20))

  if (!mounted) return null

  return (
    <DashboardLayout title={L.title} userName={user?.name}>
      <div className="flex flex-col h-full gap-3">
        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-2 flex-shrink-0">
          <StatCard
            icon={<Target className="w-3.5 h-3.5 text-[#2563eb]" />}
            iconBg="bg-[#eff6ff]"
            label={L.total}
            value={stats?.total ?? '-'}
          />
          <StatCard
            icon={<TrendingUp className="w-3.5 h-3.5 text-[#1d4ed8]" />}
            iconBg="bg-[#dbeafe]"
            label={L.active}
            value={stats?.active ?? '-'}
          />
          <StatCard
            icon={<CheckCircle2 className="w-3.5 h-3.5 text-[#047857]" />}
            iconBg="bg-[#d1fae5]"
            label={L.won}
            value={stats?.won ?? '-'}
          />
          <StatCard
            icon={<XCircle className="w-3.5 h-3.5 text-[#dc2626]" />}
            iconBg="bg-[#fee2e2]"
            label={L.lost}
            value={stats?.lost ?? '-'}
          />
          <StatCard
            icon={<AlertCircle className="w-3.5 h-3.5 text-[#b45309]" />}
            iconBg="bg-[#fef3c7]"
            label={L.unassigned}
            value={stats?.unassigned ?? '-'}
          />
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9ca3af]" />
            <input
              type="text"
              placeholder={L.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full h-8 pl-7 pr-2 text-[12px] border border-[#e5e7eb] rounded-sm bg-white focus:outline-none focus:border-[#2563eb]"
            />
          </div>
          <FilterSelect
            value={filters.status ?? ''}
            placeholder={L.allStatus}
            options={statusOptions}
            onChange={(v) => applyFilters({ status: v || undefined })}
          />
          <FilterSelect
            value={filters.serviceType ?? ''}
            placeholder={L.allService}
            options={serviceTypeOptions}
            onChange={(v) => applyFilters({ serviceType: v || undefined })}
          />
        </div>

        {/* Data Table */}
        <div className="flex-1 bg-white border border-[#e5e7eb] rounded-sm overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f9fafb] sticky top-0">
                <tr className="border-b border-[#e5e7eb]">
                  <th className="px-3 py-2 text-[11px] font-medium text-[#6b7280]">{L.colCode}</th>
                  <th className="px-3 py-2 text-[11px] font-medium text-[#6b7280]">{L.colCustomer}</th>
                  <th className="px-3 py-2 text-[11px] font-medium text-[#6b7280]">{L.colService}</th>
                  <th className="px-3 py-2 text-[11px] font-medium text-[#6b7280]">{L.colStatus}</th>
                  <th className="px-3 py-2 text-[11px] font-medium text-[#6b7280]">{L.colAmount}</th>
                  <th className="px-3 py-2 text-[11px] font-medium text-[#6b7280]">{L.colExecutor}</th>
                  <th className="px-3 py-2 text-[11px] font-medium text-[#6b7280]">{L.colCreated}</th>
                  <th className="px-3 py-2 text-[11px] font-medium text-[#6b7280]">{L.colActions}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Loader2 className="w-4 h-4 animate-spin text-[#9ca3af]" />
                        <span className="text-[12px] text-[#9ca3af]">{L.loading}</span>
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[12px] text-[#9ca3af]">
                      {L.noData}
                    </td>
                  </tr>
                ) : (
                  items.map((opp) => {
                    const status = statusConfig[opp.status]
                    return (
                      <tr key={opp.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors">
                        <td className="px-3 py-2">
                          <Link
                            href={`/opportunities/${opp.id}`}
                            className="font-mono text-[12px] text-[#2563eb] hover:underline"
                          >
                            {opp.opportunityCode}
                          </Link>
                        </td>
                        <td className="px-3 py-2 text-[12px] text-[#111827] max-w-[160px] truncate">
                          {opp.customerName}
                        </td>
                        <td className="px-3 py-2 text-[12px] text-[#6b7280]">
                          {opp.serviceTypeLabel}
                        </td>
                        <td className="px-3 py-2">
                          {status && (
                            <span className={`px-1.5 py-0.5 text-[10px] rounded-sm ${status.bg} ${status.text}`}>
                              {status.label}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 font-mono text-[12px] text-[#111827]">
                          {formatAmount(opp.estimatedAmount, opp.currency)}
                        </td>
                        <td className="px-3 py-2 text-[12px]">
                          {opp.executorName ? (
                            <span className="text-[#111827]">{opp.executorName}</span>
                          ) : (
                            <span className="text-[#9ca3af]">{L.notAssigned}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px] text-[#6b7280]">
                          {formatDate(opp.createdAt)}
                        </td>
                        <td className="px-3 py-2">
                          <Link
                            href={`/opportunities/${opp.id}`}
                            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-[#2563eb] hover:bg-[#eff6ff] rounded-sm transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            {L.viewDetail}
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 0 && (
            <div className="flex items-center justify-between px-3 py-2 border-t border-[#e5e7eb] bg-[#f9fafb] flex-shrink-0">
              <span className="text-[11px] text-[#6b7280]">
                共 {total} {L.items}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => applyFilters({ page: (filters.page ?? 1) - 1 })}
                  disabled={(filters.page ?? 1) <= 1}
                  className="p-1 text-[#6b7280] hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-[#374151] font-mono px-2">
                  {filters.page ?? 1} / {totalPages || 1}
                </span>
                <button
                  onClick={() => applyFilters({ page: (filters.page ?? 1) + 1 })}
                  disabled={(filters.page ?? 1) >= totalPages}
                  className="p-1 text-[#6b7280] hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ icon, iconBg, label, value }: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-[#e5e7eb] rounded-sm">
      <div className={`w-7 h-7 flex items-center justify-center ${iconBg} rounded-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-[#6b7280]">{label}</p>
        <p className="text-[18px] font-semibold text-[#111827] font-mono leading-tight">{value}</p>
      </div>
    </div>
  )
}

function FilterSelect({ value, placeholder, options, onChange }: {
  value: string
  placeholder: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 px-2 text-[12px] border border-[#e5e7eb] rounded-sm bg-white text-[#374151] focus:outline-none focus:border-[#2563eb] min-w-[100px]"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
