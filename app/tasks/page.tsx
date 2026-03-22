'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Briefcase, Clock, AlertTriangle, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react'

// 模拟当前用户的任务数据 (基于 Opportunity + assigneeId)
const myTasks = [
  {
    id: 'opp-1',
    opportunityCode: 'OPP-240315-001',
    customerName: '张伟',
    serviceType: 'VISA',
    serviceTypeLabel: '签证服务',
    currentNode: '材料审核中',
    stageId: 'P6',
    lastUpdatedAt: '2026-03-20T10:30:00',
    priority: 'HIGH',
    status: 'active',
  },
  {
    id: 'opp-2',
    opportunityCode: 'OPP-240315-002',
    customerName: '李明',
    serviceType: 'COMPANY_REGISTRATION',
    serviceTypeLabel: '公司注册',
    currentNode: '等待移民局批复',
    stageId: 'P7',
    lastUpdatedAt: '2026-03-19T14:20:00',
    priority: 'MEDIUM',
    status: 'active',
  },
  {
    id: 'opp-3',
    opportunityCode: 'OPP-240314-003',
    customerName: '王芳',
    serviceType: 'TAX_SERVICES',
    serviceTypeLabel: '税务服务',
    currentNode: '客户补充材料',
    stageId: 'P6',
    lastUpdatedAt: '2026-03-18T09:00:00',
    priority: 'HIGH',
    status: 'blocked',
  },
  {
    id: 'opp-4',
    opportunityCode: 'OPP-240312-004',
    customerName: '赵强',
    serviceType: 'PERMIT_SERVICES',
    serviceTypeLabel: '许可证服务',
    currentNode: '交付完成确认',
    stageId: 'P7',
    lastUpdatedAt: '2026-03-21T08:45:00',
    priority: 'LOW',
    status: 'active',
  },
  {
    id: 'opp-5',
    opportunityCode: 'OPP-240310-005',
    customerName: '孙丽',
    serviceType: 'VISA',
    serviceTypeLabel: '签证服务',
    currentNode: '移民局审核中',
    stageId: 'P7',
    lastUpdatedAt: '2026-03-17T16:00:00',
    priority: 'MEDIUM',
    status: 'active',
  },
]

// 个人提醒数据 (Interaction mentions + blocked items)
const reminders = [
  {
    id: 'rem-1',
    type: 'blocked',
    opportunityCode: 'OPP-240314-003',
    customerName: '王芳',
    message: '客户护照已过期，需通知客户补充有效护照',
    createdAt: '2026-03-18T09:00:00',
  },
  {
    id: 'rem-2',
    type: 'mention',
    opportunityCode: 'OPP-240315-001',
    customerName: '张伟',
    message: '@交付专员 客户询问进度，请尽快反馈',
    createdAt: '2026-03-20T11:30:00',
    from: '销售李磊',
  },
  {
    id: 'rem-3',
    type: 'mention',
    opportunityCode: 'OPP-240315-002',
    customerName: '李明',
    message: '@交付专员 客户催促加急，能否优先处理？',
    createdAt: '2026-03-19T15:00:00',
    from: '销售王静',
  },
]

const priorityConfig = {
  HIGH: { label: '高', className: 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]' },
  MEDIUM: { label: '中', className: 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]' },
  LOW: { label: '低', className: 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]' },
}

const statusConfig = {
  active: { label: '进行中', className: 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]' },
  blocked: { label: '已卡点', className: 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]' },
}

export default function TasksPage() {
  const user = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 统计数据
  const totalInProgress = myTasks.filter(t => t.status === 'active' || t.status === 'blocked').length
  const highPriorityCount = myTasks.filter(t => t.priority === 'HIGH').length
  const currentLoad = totalInProgress
  const maxCapacity = 20
  const loadPercentage = (currentLoad / maxCapacity) * 100

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${hours}:${minutes}`
  }



  return (
    <DashboardLayout title="我的办件" userName={user?.name}>
      <div className="flex flex-col gap-4">
        {/* 顶部统计卡片 */}
        <div className="grid grid-cols-3 gap-3">
          {/* 我负责的在办件 */}
          <div className="bg-white border border-[#e5e7eb] rounded-sm p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-sm bg-[#eff6ff] flex items-center justify-center">
                <Briefcase className="size-3.5 text-[#2563eb]" />
              </div>
              <span className="text-[12px] text-[#6b7280]">我负责的在办件</span>
            </div>
            <div className="text-2xl font-semibold text-[#111827] font-mono">
              {totalInProgress}
              <span className="text-[12px] font-normal text-[#9ca3af] ml-1">件</span>
            </div>
          </div>

          {/* 今日需跟进 */}
          <div className="bg-white border border-[#e5e7eb] rounded-sm p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-sm bg-[#fffbeb] flex items-center justify-center">
                <Clock className="size-3.5 text-[#d97706]" />
              </div>
              <span className="text-[12px] text-[#6b7280]">今日需跟进</span>
            </div>
            <div className="text-2xl font-semibold text-[#d97706] font-mono">
              {highPriorityCount}
              <span className="text-[12px] font-normal text-[#9ca3af] ml-1">件</span>
            </div>
          </div>

          {/* 负载状态 */}
          <div className="bg-white border border-[#e5e7eb] rounded-sm p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-sm bg-[#f3f4f6] flex items-center justify-center">
                <AlertTriangle className="size-3.5 text-[#6b7280]" />
              </div>
              <span className="text-[12px] text-[#6b7280]">负载状态</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-[#111827] font-mono">
                {currentLoad}/{maxCapacity}
              </span>
              <div className="flex-1 h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    loadPercentage > 80 ? 'bg-[#dc2626]' : loadPercentage > 60 ? 'bg-[#d97706]' : 'bg-[#2563eb]'
                  }`}
                  style={{ width: `${loadPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 主内容区：任务列表 + 提醒侧栏 */}
        <div className="grid grid-cols-[1fr_280px] gap-4">
          {/* 任务列表 */}
          <div className="bg-white border border-[#e5e7eb] rounded-sm">
            <div className="px-3 py-2 border-b border-[#e5e7eb]">
              <h2 className="text-[13px] font-medium text-[#111827]">我的任务列表</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[11px] text-[#6b7280] font-medium h-8 px-3">商机编号</TableHead>
                  <TableHead className="text-[11px] text-[#6b7280] font-medium h-8 px-3">客户名</TableHead>
                  <TableHead className="text-[11px] text-[#6b7280] font-medium h-8 px-3">服务类型</TableHead>
                  <TableHead className="text-[11px] text-[#6b7280] font-medium h-8 px-3">当前节点</TableHead>
                  <TableHead className="text-[11px] text-[#6b7280] font-medium h-8 px-3">上次更新</TableHead>
                  <TableHead className="text-[11px] text-[#6b7280] font-medium h-8 px-3">优先级</TableHead>
                  <TableHead className="text-[11px] text-[#6b7280] font-medium h-8 px-3">状态</TableHead>
                  <TableHead className="text-[11px] text-[#6b7280] font-medium h-8 px-3 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myTasks.map((task) => {
                  const priority = priorityConfig[task.priority as keyof typeof priorityConfig]
                  const status = statusConfig[task.status as keyof typeof statusConfig]
                  
                  return (
                    <TableRow
                      key={task.id}
                      className="cursor-pointer hover:bg-[#f9fafb]"
                      onClick={() => window.location.href = `/workbench/${task.id}`}
                    >
                      <TableCell className="text-[13px] text-[#2563eb] font-mono px-3 py-2">
                        {task.opportunityCode}
                      </TableCell>
                      <TableCell className="text-[13px] text-[#111827] px-3 py-2">
                        {task.customerName}
                      </TableCell>
                      <TableCell className="text-[13px] text-[#6b7280] px-3 py-2">
                        {task.serviceTypeLabel}
                      </TableCell>
                      <TableCell className="text-[13px] text-[#111827] px-3 py-2">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                          {task.currentNode}
                        </span>
                      </TableCell>
                      <TableCell className="text-[12px] text-[#6b7280] font-mono px-3 py-2">
                        {formatDateTime(task.lastUpdatedAt)}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <span className={`inline-flex items-center h-5 px-1.5 text-[10px] font-medium rounded-sm border ${priority.className}`}>
                          {priority.label}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <span className={`inline-flex items-center h-5 px-1.5 text-[10px] font-medium rounded-sm border ${status.className}`}>
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-right">
                        <a
                          href={`/workbench/${task.id}`}
                          className="inline-flex items-center gap-1 h-7 px-2 text-[11px] font-medium text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-sm transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          处理
                          <ArrowRight className="size-3" />
                        </a>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* 个人提醒区 */}
          <div className="bg-white border border-[#e5e7eb] rounded-sm">
            <div className="px-3 py-2 border-b border-[#e5e7eb]">
              <h2 className="text-[13px] font-medium text-[#111827]">个人提醒</h2>
            </div>
            <div className="p-2 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-2 rounded-sm border cursor-pointer hover:bg-[#f9fafb] transition-colors ${
                    reminder.type === 'blocked'
                      ? 'border-[#fecaca] bg-[#fef2f2]'
                      : 'border-[#e5e7eb] bg-white'
                  }`}
                  onClick={() => window.location.href = `/workbench/${reminder.id}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {reminder.type === 'blocked' ? (
                      <AlertCircle className="size-3 text-[#dc2626]" />
                    ) : (
                      <MessageSquare className="size-3 text-[#2563eb]" />
                    )}
                    <span className="text-[11px] font-mono text-[#2563eb]">
                      {reminder.opportunityCode}
                    </span>
                    <span className="text-[11px] text-[#6b7280]">
                      {reminder.customerName}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#374151] leading-relaxed line-clamp-2">
                    {reminder.message}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    {reminder.type === 'mention' && (
                      <span className="text-[10px] text-[#9ca3af]">来自: {reminder.from}</span>
                    )}
                    {reminder.type === 'blocked' && (
                      <span className="text-[10px] text-[#dc2626] font-medium">卡点</span>
                    )}
                    <span className="text-[10px] text-[#9ca3af] ml-auto font-mono">
                      {formatDateTime(reminder.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
