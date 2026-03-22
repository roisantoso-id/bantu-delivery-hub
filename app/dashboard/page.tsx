'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { statusConfig } from '@/lib/constants'
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCircle,
  Target,
  Users,
  Loader2,
  Eye,
} from 'lucide-react'
import {
  getDashboardStats,
  getRecentOpportunities,
  getTeamWorkload,
  type DashboardStats,
  type DashboardOpportunity,
  type TeamMemberLoad,
} from './actions'

function formatDate(iso: string | null) {
  if (!iso) return '-'
  const d = new Date(iso)
  return `${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

export default function DashboardPage() {
  const user = useAuth()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [opportunities, setOpportunities] = useState<DashboardOpportunity[]>([])
  const [teamLoad, setTeamLoad] = useState<TeamMemberLoad[]>([])

  const isPM = useMemo(() => {
    if (!user) return false
    return user.roleCodes.includes('pm') || user.roleCodes.includes('admin')
  }, [user])

  useEffect(() => {
    setMounted(true)
    async function load() {
      try {
        const [s, opps, team] = await Promise.all([
          getDashboardStats(),
          getRecentOpportunities(10),
          isPM ? getTeamWorkload() : Promise.resolve([]),
        ])
        setStats(s)
        setOpportunities(opps)
        setTeamLoad(team)
      } catch (err) {
        console.error('Failed to load dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isPM])

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  if (!mounted) return null

  return (
    <DashboardLayout title="大盘概览" userName={user?.name}>
      <div className="space-y-4">
        {/* User Info */}
        {user && (
          <div className="bg-white border border-[#e5e7eb] rounded-sm p-4 flex items-center gap-4">
            <div className="size-10 rounded-full bg-[#eff6ff] flex items-center justify-center">
              <UserCircle className="size-5 text-[#2563eb]" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-[#111827]">
                你好，{user.name}
              </p>
              <p className="text-[12px] text-[#6b7280] mt-0.5">
                {user.email}
                <span className="mx-1.5">·</span>
                {user.roleCodes.map((code) => (
                  <span
                    key={code}
                    className="inline-flex text-[10px] px-1.5 py-0.5 rounded-sm bg-[#eff6ff] text-[#2563eb] mr-1"
                  >
                    {code}
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className={`grid ${isPM ? 'grid-cols-4' : 'grid-cols-3'} gap-3`}>
          <StatCard
            icon={<Clock className="size-4 text-[#2563eb]" />}
            iconBg="bg-[#eff6ff]"
            label="当前在办"
            value={loading ? '-' : stats?.activeOpportunities ?? 0}
            unit="件"
          />
          <StatCard
            icon={<CheckCircle2 className="size-4 text-[#16a34a]" />}
            iconBg="bg-[#f0fdf4]"
            label="本月已完成"
            value={loading ? '-' : stats?.completedThisMonth ?? 0}
            unit="件"
          />
          <StatCard
            icon={<AlertTriangle className="size-4 text-[#dc2626]" />}
            iconBg="bg-[#fef2f2]"
            label="未指派"
            value={loading ? '-' : stats?.unassigned ?? 0}
            unit="件"
            highlight={!!stats && stats.unassigned > 0}
          />
          {isPM && (
            <StatCard
              icon={<Target className="size-4 text-[#b45309]" />}
              iconBg="bg-[#fef3c7]"
              label="管道总额"
              value={loading ? '-' : `${((stats?.totalPipelineAmount ?? 0) / 1000000).toFixed(1)}M`}
              unit={stats?.currency ?? 'IDR'}
            />
          )}
        </div>

        {/* PM: Team Workload */}
        {isPM && teamLoad.length > 0 && (
          <div className="bg-white border border-[#e5e7eb] rounded-sm">
            <div className="px-3 py-2 border-b border-[#e5e7eb] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#6b7280]" />
              <span className="text-[13px] font-semibold text-[#111827]">团队负载</span>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-4 gap-2">
                {teamLoad.map((member) => {
                  const pct = member.capacity > 0 ? (member.currentLoad / member.capacity) * 100 : 0
                  const barColor = pct > 80 ? 'bg-[#b91c1c]' : pct > 60 ? 'bg-[#b45309]' : 'bg-[#15803d]'
                  return (
                    <div key={member.id} className="flex items-center gap-2 px-2 py-1.5 border border-[#e5e7eb] rounded-sm">
                      <div className="w-6 h-6 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[10px] font-medium text-[#374151]">
                        {member.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#111827] truncate">{member.name}</span>
                          <span className="text-[10px] font-mono text-[#6b7280]">{member.currentLoad}/{member.capacity}</span>
                        </div>
                        <div className="h-[3px] bg-[#e5e7eb] rounded-full overflow-hidden mt-1">
                          <div className={`h-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Recent Opportunities */}
        <div className="bg-white border border-[#e5e7eb] rounded-sm">
          <div className="px-3 py-2 border-b border-[#e5e7eb] flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-[#111827]">
              {isPM ? '最近商机' : '待办任务'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#6b7280]">
                共 {loading ? '-' : opportunities.length} 项
              </span>
              {isPM && (
                <Link href="/opportunities" className="text-[11px] text-[#2563eb] hover:underline">
                  查看全部
                </Link>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-4 h-4 animate-spin text-[#9ca3af]" />
              <span className="ml-1.5 text-[12px] text-[#9ca3af]">加载中...</span>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-[12px] text-[#9ca3af]">
              暂无数据
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-[#f9fafb]">
                <tr className="border-b border-[#e5e7eb]">
                  <th className="h-8 text-[11px] font-medium text-[#6b7280] px-3">商机编号</th>
                  <th className="h-8 text-[11px] font-medium text-[#6b7280] px-3">客户名称</th>
                  <th className="h-8 text-[11px] font-medium text-[#6b7280] px-3">服务类型</th>
                  <th className="h-8 text-[11px] font-medium text-[#6b7280] px-3">执行人</th>
                  <th className="h-8 text-[11px] font-medium text-[#6b7280] px-3">预计完成</th>
                  <th className="h-8 text-[11px] font-medium text-[#6b7280] px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => {
                  const isOverdue = opp.expectedCloseDate && opp.expectedCloseDate.split('T')[0] < today
                  return (
                    <tr key={opp.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                      <td className="py-2 px-3">
                        <Link
                          href={`/opportunities/${opp.id}`}
                          className="text-[12px] font-mono text-[#2563eb] hover:underline"
                        >
                          {opp.opportunityCode}
                        </Link>
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-[12px] text-[#111827] truncate max-w-[180px] block">
                          {opp.customerName}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[12px] text-[#6b7280]">
                        {opp.serviceTypeLabel}
                      </td>
                      <td className="py-2 px-3 text-[12px]">
                        {opp.executorName ? (
                          <span className="text-[#111827]">{opp.executorName}</span>
                        ) : (
                          <span className="text-[#9ca3af]">未指派</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`text-[12px] font-mono ${isOverdue ? 'text-[#dc2626]' : 'text-[#6b7280]'}`}>
                          {formatDate(opp.expectedCloseDate)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <Link
                          href={isPM ? `/opportunities/${opp.id}` : `/workbench/${opp.id}`}
                          className="inline-flex items-center gap-1 h-7 px-2 text-[11px] font-medium text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-sm transition-colors"
                        >
                          {isPM ? (
                            <>
                              <Eye className="size-3" />
                              查看
                            </>
                          ) : (
                            <>
                              进入工作台
                              <ArrowRight className="size-3" />
                            </>
                          )}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ icon, iconBg, label, value, unit, highlight }: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string | number
  unit: string
  highlight?: boolean
}) {
  return (
    <div className={`bg-white border rounded-sm p-3 ${highlight ? 'border-[#fca5a5]' : 'border-[#e5e7eb]'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-[#6b7280]">{label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-[22px] font-semibold font-mono ${highlight ? 'text-[#dc2626]' : 'text-[#111827]'}`}>
              {value}
            </span>
            <span className="text-[11px] text-[#9ca3af]">{unit}</span>
          </div>
        </div>
        <div className={`size-9 rounded-sm flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
