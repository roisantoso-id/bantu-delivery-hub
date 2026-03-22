'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { statusConfig } from '@/lib/constants'
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  MapPin,
  FileText,
  Clock,
  Loader2,
  Send,
} from 'lucide-react'
import {
  getOpportunityDetail,
  addOpportunityNote,
  type OpportunityDetail,
} from '../actions'

const L = {
  title: '商机详情',
  back: '返回列表',
  customer: '客户信息',
  assignment: '执行信息',
  activity: '操作日志',
  interactions: '互动记录',
  basicInfo: '基本信息',
  addNote: '添加备注',
  send: '提交',
  notePlaceholder: '输入备注内容...',
  loading: '加载中...',
  notFound: '商机不存在',
  executor: '执行人',
  assignedBy: '指派人',
  assignedAt: '指派时间',
  notAssigned: '未指派',
  serviceType: '服务类型',
  amount: '预估金额',
  expectedClose: '预计完成',
  destination: '目的地',
  travelDate: '出行日期',
  requirements: '需求说明',
  notes: '备注',
  phone: '电话',
  email: '邮箱',
  wechat: '微信',
  level: '客户等级',
  noLogs: '暂无操作日志',
  noInteractions: '暂无互动记录',
}

const actionTypeLabels: Record<string, { label: string; bg: string; text: string }> = {
  FORM: { label: '表单', bg: 'bg-[#dbeafe]', text: 'text-[#1d4ed8]' },
  MATCH: { label: '匹配', bg: 'bg-[#fef3c7]', text: 'text-[#b45309]' },
  STAGE_CHANGE: { label: '阶段变更', bg: 'bg-[#d1fae5]', text: 'text-[#047857]' },
  NOTE: { label: '备注', bg: 'bg-[#f3f4f6]', text: 'text-[#374151]' },
  QUOTE: { label: '报价', bg: 'bg-[#ede9fe]', text: 'text-[#6d28d9]' },
  CREATE: { label: '创建', bg: 'bg-[#e0f2fe]', text: 'text-[#0369a1]' },
}

const interactionTypeLabels: Record<string, string> = {
  NOTE: '备注',
  CALL: '电话',
  VISIT: '拜访',
  MEETING: '会议',
  EMAIL: '邮件',
  STAGE_CHANGE: '阶段变更',
  SYSTEM: '系统',
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function formatDate(iso: string | null) {
  if (!iso) return '-'
  const d = new Date(iso)
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

export default function OpportunityDetailPage() {
  const user = useAuth()
  const params = useParams()
  const id = params.id as string

  const [detail, setDetail] = useState<OpportunityDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadDetail()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadDetail() {
    setLoading(true)
    try {
      const data = await getOpportunityDetail(id)
      setDetail(data)
    } catch (err) {
      console.error('Failed to load opportunity detail:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddNote() {
    if (!noteText.trim() || !user || !detail) return
    setSubmitting(true)
    try {
      await addOpportunityNote(detail.id, user.id, user.organizationId, noteText.trim())
      setNoteText('')
      await loadDetail()
    } catch (err) {
      console.error('Failed to add note:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!mounted) return null

  if (loading) {
    return (
      <DashboardLayout title={L.title} userName={user?.name}>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-5 h-5 animate-spin text-[#6b7280]" />
        </div>
      </DashboardLayout>
    )
  }

  if (!detail) {
    return (
      <DashboardLayout title={L.title} userName={user?.name}>
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <p className="text-[14px] text-[#6b7280]">{L.notFound}</p>
          <Link href="/opportunities" className="text-[12px] text-[#2563eb] hover:underline">
            {L.back}
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const status = statusConfig[detail.status]

  return (
    <DashboardLayout title={L.title} userName={user?.name}>
      <div className="flex flex-col h-full gap-3 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-white border border-[#e5e7eb] rounded-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/opportunities" className="flex items-center gap-1 text-[12px] text-[#6b7280] hover:text-[#2563eb]">
              <ArrowLeft className="w-3.5 h-3.5" />
              {L.back}
            </Link>
            <span className="text-[#e5e7eb]">|</span>
            <span className="font-mono text-[14px] font-semibold text-[#111827]">{detail.opportunityCode}</span>
            <span className="text-[13px] text-[#374151]">{detail.customer.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] rounded-sm bg-[#d1fae5] text-[#047857]">
              P7-交付
            </span>
            {status && (
              <span className={`px-2 py-0.5 text-[11px] rounded-sm ${status.bg} ${status.text}`}>
                {status.label}
              </span>
            )}
          </div>
        </div>

        {/* Main Content - 2 columns */}
        <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
          {/* Left column: Info + Customer + Assignment */}
          <div className="col-span-5 flex flex-col gap-3">
            {/* Basic Info */}
            <div className="bg-white border border-[#e5e7eb] rounded-sm">
              <div className="px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
                <span className="text-[12px] font-medium text-[#374151]">{L.basicInfo}</span>
              </div>
              <div className="p-3 space-y-2.5">
                <InfoRow icon={<FileText className="w-3.5 h-3.5" />} label={L.serviceType} value={detail.serviceTypeLabel} />
                <InfoRow icon={<FileText className="w-3.5 h-3.5" />} label={L.amount} value={`${detail.currency} ${detail.estimatedAmount.toLocaleString()}`} />
                <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label={L.expectedClose} value={formatDate(detail.expectedCloseDate)} />
                {detail.destination && (
                  <InfoRow icon={<MapPin className="w-3.5 h-3.5" />} label={L.destination} value={detail.destination} />
                )}
                {detail.travelDate && (
                  <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label={L.travelDate} value={formatDate(detail.travelDate)} />
                )}
                {detail.requirements && (
                  <div className="pt-1">
                    <p className="text-[10px] text-[#6b7280] mb-1">{L.requirements}</p>
                    <p className="text-[12px] text-[#374151] leading-relaxed">{detail.requirements}</p>
                  </div>
                )}
                {detail.notes && (
                  <div className="pt-1">
                    <p className="text-[10px] text-[#6b7280] mb-1">{L.notes}</p>
                    <p className="text-[12px] text-[#374151] leading-relaxed">{detail.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white border border-[#e5e7eb] rounded-sm">
              <div className="px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
                <span className="text-[12px] font-medium text-[#374151]">{L.customer}</span>
              </div>
              <div className="p-3 space-y-2.5">
                <InfoRow icon={<User className="w-3.5 h-3.5" />} label={detail.customer.customerId} value={detail.customer.customerName} />
                {detail.customer.phone && (
                  <InfoRow icon={<Phone className="w-3.5 h-3.5" />} label={L.phone} value={detail.customer.phone} />
                )}
                {detail.customer.email && (
                  <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label={L.email} value={detail.customer.email} />
                )}
                {detail.customer.wechat && (
                  <InfoRow icon={<MessageSquare className="w-3.5 h-3.5" />} label={L.wechat} value={detail.customer.wechat} />
                )}
                {detail.customer.level && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#6b7280]">{L.level}</span>
                    <span className="px-1.5 py-0.5 text-[10px] bg-[#fef3c7] text-[#b45309] rounded-sm">
                      {detail.customer.level}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Assignment */}
            <div className="bg-white border border-[#e5e7eb] rounded-sm">
              <div className="px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
                <span className="text-[12px] font-medium text-[#374151]">{L.assignment}</span>
              </div>
              <div className="p-3 space-y-2.5">
                <InfoRow icon={<User className="w-3.5 h-3.5" />} label={L.executor} value={detail.executor?.name ?? L.notAssigned} />
                {detail.assignedBy && (
                  <InfoRow icon={<User className="w-3.5 h-3.5" />} label={L.assignedBy} value={detail.assignedBy.name} />
                )}
                {detail.executor && (
                  <InfoRow icon={<Clock className="w-3.5 h-3.5" />} label={L.assignedAt} value={formatDateTime(detail.executor.assignedAt)} />
                )}
              </div>
            </div>
          </div>

          {/* Right column: Activity + Interactions + Add Note */}
          <div className="col-span-7 flex flex-col gap-3">
            {/* Action Logs */}
            <div className="bg-white border border-[#e5e7eb] rounded-sm flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb] flex-shrink-0">
                <span className="text-[12px] font-medium text-[#374151]">{L.activity}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {detail.actionLogs.length === 0 ? (
                  <p className="text-[12px] text-[#9ca3af] text-center py-4">{L.noLogs}</p>
                ) : (
                  <div className="space-y-3">
                    {detail.actionLogs.map((log) => {
                      const typeConfig = actionTypeLabels[log.actionType]
                      return (
                        <div key={log.id} className="flex gap-2.5">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-[#d1d5db] mt-1.5" />
                            <div className="flex-1 w-[1px] bg-[#e5e7eb]" />
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex items-center gap-2 mb-0.5">
                              {typeConfig && (
                                <span className={`px-1 py-0.5 text-[9px] rounded-sm ${typeConfig.bg} ${typeConfig.text}`}>
                                  {typeConfig.label}
                                </span>
                              )}
                              <span className="text-[11px] text-[#374151]">{log.actionLabel}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-[#9ca3af]">
                              <span>{log.operatorName}</span>
                              <span>{formatDateTime(log.timestamp)}</span>
                            </div>
                            {log.remark && (
                              <p className="mt-1 text-[11px] text-[#6b7280]">{log.remark}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Interactions */}
            <div className="bg-white border border-[#e5e7eb] rounded-sm max-h-[240px] flex flex-col overflow-hidden">
              <div className="px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb] flex-shrink-0">
                <span className="text-[12px] font-medium text-[#374151]">{L.interactions}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {detail.interactions.length === 0 ? (
                  <p className="text-[12px] text-[#9ca3af] text-center py-4">{L.noInteractions}</p>
                ) : (
                  <div className="space-y-2">
                    {detail.interactions.map((i) => (
                      <div key={i.id} className="flex gap-2 px-2 py-1.5 rounded-sm hover:bg-[#f9fafb]">
                        <span className="px-1 py-0.5 text-[9px] bg-[#f3f4f6] text-[#374151] rounded-sm h-fit flex-shrink-0">
                          {interactionTypeLabels[i.type] ?? i.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-[#374151] break-words">{i.content}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#9ca3af]">
                            <span>{i.operatorName}</span>
                            <span>{formatDateTime(i.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Add Note */}
            <div className="bg-white border border-[#e5e7eb] rounded-sm px-3 py-2 flex-shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={L.notePlaceholder}
                  rows={2}
                  className="flex-1 text-[12px] border border-[#e5e7eb] rounded-sm px-2 py-1.5 resize-none focus:outline-none focus:border-[#2563eb]"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || submitting}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] bg-[#2563eb] text-white rounded-sm hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  {L.send}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#9ca3af]">{icon}</span>
      <span className="text-[10px] text-[#6b7280] min-w-[60px]">{label}</span>
      <span className="text-[12px] text-[#111827]">{value}</span>
    </div>
  )
}
