'use client'

import { useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, UserCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// 模拟统计数据
const stats = [
  { 
    label: '当前在办', 
    value: 12, 
    unit: '件',
    icon: Clock, 
    bgColor: 'bg-[#eff6ff]',
    iconColor: 'text-[#2563eb]',
  },
  { 
    label: '本月已完成', 
    value: 45, 
    unit: '件',
    icon: CheckCircle2, 
    bgColor: 'bg-[#f0fdf4]',
    iconColor: 'text-[#16a34a]',
  },
  { 
    label: '异常卡点', 
    value: 2, 
    unit: '件',
    icon: AlertTriangle, 
    bgColor: 'bg-[#fef2f2]',
    iconColor: 'text-[#dc2626]',
    highlight: true,
  },
]

// 模拟待办任务数据
const tasks = [
  { 
    id: 'OPP-240315-001', 
    customer: '深圳市腾飞科技有限公司', 
    serviceType: '签证服务',
    progress: { current: 2, total: 5 },
    status: 'pending' as const,
    expectedDate: '2026-03-25',
  },
  { 
    id: 'OPP-240314-012', 
    customer: '广州华创贸易有限公司', 
    serviceType: '公司注册',
    progress: { current: 3, total: 6 },
    status: 'in_progress' as const,
    expectedDate: '2026-03-28',
  },
  { 
    id: 'OPP-240313-008', 
    customer: '北京创新互联网科技有限公司', 
    serviceType: '许可证办理',
    progress: { current: 1, total: 4 },
    status: 'blocked' as const,
    expectedDate: '2026-03-22',
  },
  { 
    id: 'OPP-240312-003', 
    customer: '上海恒达进出口有限公司', 
    serviceType: '签证服务',
    progress: { current: 4, total: 5 },
    status: 'in_progress' as const,
    expectedDate: '2026-03-24',
  },
  { 
    id: 'OPP-240311-019', 
    customer: '杭州智联网络科技有限公司', 
    serviceType: '税务登记',
    progress: { current: 0, total: 3 },
    status: 'pending' as const,
    expectedDate: '2026-03-30',
  },
  { 
    id: 'OPP-240310-007', 
    customer: '成都云端数据服务有限公司', 
    serviceType: '公司注册',
    progress: { current: 2, total: 8 },
    status: 'blocked' as const,
    expectedDate: '2026-03-21',
  },
]

const statusConfig = {
  pending: { label: '待处理', bg: 'bg-[#fef3c7]', text: 'text-[#b45309]' },
  in_progress: { label: '进行中', bg: 'bg-[#dbeafe]', text: 'text-[#1d4ed8]' },
  blocked: { label: '已卡点', bg: 'bg-[#fee2e2]', text: 'text-[#dc2626]' },
}

export default function DashboardPage() {
  const user = useAuth()
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  return (
    <DashboardLayout
      title="大盘概览"
      userName={user?.name}
      isSupervisor={true}
    >
      <div className="space-y-4">
        {/* 用户信息卡片 */}
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

        {/* 顶部统计卡片 - 3列 */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white border rounded-sm p-3 ${
                stat.highlight ? 'border-[#fca5a5]' : 'border-[#e5e7eb]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[#6b7280]">{stat.label}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-[22px] font-semibold font-mono ${
                      stat.highlight ? 'text-[#dc2626]' : 'text-[#111827]'
                    }`}>
                      {stat.value}
                    </span>
                    <span className="text-[11px] text-[#9ca3af]">{stat.unit}</span>
                  </div>
                </div>
                <div className={`size-9 rounded-sm flex items-center justify-center ${stat.bgColor}`}>
                  <stat.icon className={`size-4 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 待办任务列表 */}
        <div className="bg-white border border-[#e5e7eb] rounded-sm">
          <div className="px-3 py-2 border-b border-[#e5e7eb] flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-[#111827]">待办任务</h2>
            <span className="text-[11px] text-[#6b7280]">共 {tasks.length} 项待办</span>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#e5e7eb] hover:bg-transparent">
                <TableHead className="h-8 text-[11px] font-medium text-[#6b7280] px-3">商机编号</TableHead>
                <TableHead className="h-8 text-[11px] font-medium text-[#6b7280] px-3">客户名称</TableHead>
                <TableHead className="h-8 text-[11px] font-medium text-[#6b7280] px-3">服务类型</TableHead>
                <TableHead className="h-8 text-[11px] font-medium text-[#6b7280] px-3">当前进度</TableHead>
                <TableHead className="h-8 text-[11px] font-medium text-[#6b7280] px-3">状态</TableHead>
                <TableHead className="h-8 text-[11px] font-medium text-[#6b7280] px-3">预计完成</TableHead>
                <TableHead className="h-8 text-[11px] font-medium text-[#6b7280] px-3 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => {
                const status = statusConfig[task.status]
                const isOverdue = task.expectedDate < today
                
                return (
                  <TableRow 
                    key={task.id} 
                    className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]"
                  >
                    <TableCell className="py-2 px-3">
                      <span className="text-[12px] font-mono text-[#2563eb]">{task.id}</span>
                    </TableCell>
                    <TableCell className="py-2 px-3">
                      <span className="text-[13px] text-[#111827] truncate max-w-[180px] block">
                        {task.customer}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-3">
                      <span className="text-[12px] text-[#6b7280]">{task.serviceType}</span>
                    </TableCell>
                    <TableCell className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-[#e5e7eb] rounded-sm overflow-hidden">
                          <div 
                            className="h-full bg-[#2563eb] rounded-sm"
                            style={{ width: `${(task.progress.current / task.progress.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-[#6b7280]">
                          {task.progress.current}/{task.progress.total}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 px-3">
                      <span className={`inline-flex text-[10px] px-1.5 py-0.5 rounded-sm ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-3">
                      <span className={`text-[12px] font-mono ${
                        isOverdue && task.status !== 'blocked' ? 'text-[#dc2626]' : 'text-[#6b7280]'
                      }`}>
                        {task.expectedDate}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-3 text-right">
                      <a 
                        href={`/workbench/${task.id}`}
                        className="inline-flex items-center gap-1 h-7 px-2 text-[11px] font-medium text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-sm transition-colors"
                      >
                        进入工作台
                        <ArrowRight className="size-3" />
                      </a>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}
