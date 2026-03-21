'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from 'recharts'
import { 
  GripVertical, 
  AlertTriangle, 
  Clock, 
  Zap, 
  TrendingUp,
  CheckCircle2,
  Users,
  Timer
} from 'lucide-react'

// 待指派商机数据 (stageId = 'P7', 未分配)
const unassignedOpportunities = [
  {
    id: 'OPP-240321-001',
    serviceType: '签证申请',
    expectedAmount: 28000,
    waitingDays: 2,
    customerName: '北京科技有限公司',
  },
  {
    id: 'OPP-240320-002',
    serviceType: '公司注册',
    expectedAmount: 45000,
    waitingDays: 3,
    customerName: '上海贸易集团',
  },
  {
    id: 'OPP-240319-003',
    serviceType: '税务咨询',
    expectedAmount: 15000,
    waitingDays: 4,
    customerName: '深圳创新科技',
  },
  {
    id: 'OPP-240318-004',
    serviceType: '工作许可',
    expectedAmount: 32000,
    waitingDays: 5,
    customerName: '广州进出口公司',
  },
]

// 团队成员数据
const teamMembers = [
  {
    id: 1,
    name: '李明',
    avatar: '',
    initials: '李',
    expertise: ['签证', '工作许可'],
    currentLoad: 12,
    capacity: 20,
  },
  {
    id: 2,
    name: '王芳',
    avatar: '',
    initials: '王',
    expertise: ['公司注册', '税务'],
    currentLoad: 8,
    capacity: 15,
  },
  {
    id: 3,
    name: '张伟',
    avatar: '',
    initials: '张',
    expertise: ['签证', '税务咨询'],
    currentLoad: 17,
    capacity: 18,
  },
  {
    id: 4,
    name: '陈静',
    avatar: '',
    initials: '陈',
    expertise: ['公司注册', '工作许可'],
    currentLoad: 5,
    capacity: 20,
  },
]

// 本周交付数据
const weeklyDeliveryData = [
  { day: '周一', completed: 8, target: 10 },
  { day: '周二', completed: 12, target: 10 },
  { day: '周三', completed: 9, target: 10 },
  { day: '周四', completed: 11, target: 10 },
  { day: '周五', completed: 7, target: 10 },
  { day: '周六', completed: 4, target: 5 },
  { day: '周日', completed: 2, target: 3 },
]

// 平均交付耗时趋势
const deliveryTimeData = [
  { week: 'W1', avgDays: 4.2 },
  { week: 'W2', avgDays: 3.8 },
  { week: 'W3', avgDays: 3.5 },
  { week: 'W4', avgDays: 3.2 },
]

const chartConfig = {
  completed: {
    label: '完成数',
    color: '#2563eb',
  },
  target: {
    label: '目标',
    color: '#e5e7eb',
  },
  avgDays: {
    label: '平均天数',
    color: '#16a34a',
  },
}

// 负载进度条
function LoadBar({ current, capacity }: { current: number; capacity: number }) {
  const percentage = (current / capacity) * 100
  const isOverloaded = percentage > 80
  const barColor = isOverloaded ? 'bg-[#dc2626]' : percentage > 60 ? 'bg-[#d97706]' : 'bg-[#16a34a]'
  
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1 bg-[#f3f4f6] rounded-full overflow-hidden">
        <div 
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className={`text-[10px] font-mono whitespace-nowrap ${isOverloaded ? 'text-[#dc2626]' : 'text-[#6b7280]'}`}>
        {current}/{capacity}
      </span>
    </div>
  )
}

// 快速指派弹窗
function AssignDialog({ 
  opportunity, 
  onClose, 
  onAssign 
}: { 
  opportunity: typeof unassignedOpportunities[0] | null
  onClose: () => void
  onAssign: (oppId: string, memberId: number) => void
}) {
  const [selectedMember, setSelectedMember] = useState<number | null>(null)

  if (!opportunity) return null

  return (
    <Dialog open={!!opportunity} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-4 rounded-sm border border-[#e5e7eb] shadow-none">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-[14px] font-medium">快速指派</DialogTitle>
          <div className="flex items-center gap-2 text-[12px] text-[#6b7280]">
            <span className="font-mono text-[#2563eb]">{opportunity.id}</span>
            <span>·</span>
            <span>{opportunity.serviceType}</span>
          </div>
        </DialogHeader>
        
        <div className="py-2">
          <p className="text-[11px] text-[#6b7280] mb-2">选择交付专员:</p>
          <div className="flex flex-col gap-1.5">
            {teamMembers.map((member) => {
              const percentage = (member.currentLoad / member.capacity) * 100
              const isOverloaded = percentage > 80
              
              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-sm border transition-colors text-left ${
                    selectedMember === member.id 
                      ? 'border-[#2563eb] bg-[#eff6ff]' 
                      : 'border-[#e5e7eb] hover:border-[#d1d5db]'
                  } ${isOverloaded ? 'opacity-60' : ''}`}
                >
                  <Avatar className="w-7 h-7 rounded-sm border border-[#e5e7eb]">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="rounded-sm text-[10px] bg-[#f3f4f6] text-[#374151]">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#111827]">{member.name}</span>
                      <span className={`text-[10px] font-mono ${isOverloaded ? 'text-[#dc2626]' : 'text-[#6b7280]'}`}>
                        {member.currentLoad}/{member.capacity}
                      </span>
                    </div>
                    <div className="flex gap-1 mt-0.5">
                      {member.expertise.map((exp) => (
                        <span key={exp} className="text-[9px] text-[#6b7280]">{exp}</span>
                      ))}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            className="h-7 px-3 text-[11px] rounded-sm border-[#e5e7eb]"
          >
            取消
          </Button>
          <Button 
            size="sm"
            disabled={!selectedMember}
            onClick={() => {
              if (selectedMember) {
                onAssign(opportunity.id, selectedMember)
                onClose()
              }
            }}
            className="h-7 px-3 text-[11px] rounded-sm bg-[#2563eb] hover:bg-[#1d4ed8]"
          >
            确认指派
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function DispatchPage() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<typeof unassignedOpportunities[0] | null>(null)

  const handleAssign = (oppId: string, memberId: number) => {
    const member = teamMembers.find(m => m.id === memberId)
    console.log(`已将商机 ${oppId} 指派给 ${member?.name}`)
  }

  // 统计数据
  const totalCompleted = weeklyDeliveryData.reduce((sum, d) => sum + d.completed, 0)
  const totalTarget = weeklyDeliveryData.reduce((sum, d) => sum + d.target, 0)
  const completionRate = Math.round((totalCompleted / totalTarget) * 100)
  const latestAvgDays = deliveryTimeData[deliveryTimeData.length - 1].avgDays

  return (
    <DashboardLayout title="资源调度" userName="张三" isSupervisor={true}>
      <div className="flex flex-col gap-4">
        {/* 全局进度概览 - 顶部统计卡片 */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-white border border-[#e5e7eb] rounded-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 flex items-center justify-center bg-[#fef2f2] rounded-sm">
                <Clock className="w-3.5 h-3.5 text-[#dc2626]" />
              </div>
              <span className="text-[11px] text-[#6b7280]">待指派</span>
            </div>
            <p className="text-[20px] font-semibold text-[#111827] font-mono">{unassignedOpportunities.length}</p>
          </div>
          
          <div className="p-3 bg-white border border-[#e5e7eb] rounded-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 flex items-center justify-center bg-[#f0fdf4] rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
              </div>
              <span className="text-[11px] text-[#6b7280]">本周完成率</span>
            </div>
            <p className="text-[20px] font-semibold text-[#111827] font-mono">{completionRate}%</p>
          </div>
          
          <div className="p-3 bg-white border border-[#e5e7eb] rounded-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 flex items-center justify-center bg-[#eff6ff] rounded-sm">
                <Timer className="w-3.5 h-3.5 text-[#2563eb]" />
              </div>
              <span className="text-[11px] text-[#6b7280]">平均交付耗时</span>
            </div>
            <p className="text-[20px] font-semibold text-[#111827] font-mono">{latestAvgDays}天</p>
          </div>
          
          <div className="p-3 bg-white border border-[#e5e7eb] rounded-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 flex items-center justify-center bg-[#fefce8] rounded-sm">
                <Users className="w-3.5 h-3.5 text-[#ca8a04]" />
              </div>
              <span className="text-[11px] text-[#6b7280]">团队总负载</span>
            </div>
            <p className="text-[20px] font-semibold text-[#111827] font-mono">
              {teamMembers.reduce((sum, m) => sum + m.currentLoad, 0)}/{teamMembers.reduce((sum, m) => sum + m.capacity, 0)}
            </p>
          </div>
        </div>

        {/* 主体区域 - 左右布局 */}
        <div className="grid grid-cols-3 gap-4" style={{ height: 'calc(100vh - 240px)' }}>
          {/* 左侧：待指派池 */}
          <div className="flex flex-col bg-white border border-[#e5e7eb] rounded-sm overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
              <h2 className="text-[13px] font-medium text-[#111827]">待指派池</h2>
              <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#fef2f2] text-[#dc2626] rounded-sm border border-[#fecaca]">
                {unassignedOpportunities.length} 件
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="flex flex-col gap-1.5">
                {unassignedOpportunities.map((opp) => (
                  <button
                    key={opp.id}
                    onClick={() => setSelectedOpportunity(opp)}
                    className="flex items-start gap-2 p-2 bg-white border border-[#e5e7eb] rounded-sm hover:border-[#2563eb] hover:bg-[#fafafa] transition-colors text-left"
                  >
                    <GripVertical className="w-3 h-3 text-[#d1d5db] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="font-mono text-[11px] text-[#2563eb] font-medium">
                          {opp.id}
                        </span>
                        <span className="text-[10px] text-[#6b7280]">{opp.serviceType}</span>
                      </div>
                      <p className="text-[12px] text-[#111827] truncate mb-0.5">{opp.customerName}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#111827]">
                          ¥{opp.expectedAmount.toLocaleString()}
                        </span>
                        <span className={`text-[10px] ${opp.waitingDays > 3 ? 'text-[#dc2626]' : 'text-[#6b7280]'}`}>
                          已等待 {opp.waitingDays} 天
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="px-3 py-1.5 border-t border-[#e5e7eb] bg-[#f9fafb]">
              <p className="text-[10px] text-[#9ca3af]">点击卡片快速指派</p>
            </div>
          </div>

          {/* 中间：团队负载监控 */}
          <div className="flex flex-col bg-white border border-[#e5e7eb] rounded-sm overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
              <h2 className="text-[13px] font-medium text-[#111827]">团队负载监控</h2>
              <span className="text-[10px] text-[#6b7280]">{teamMembers.length} 名成员</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="flex flex-col gap-2">
                {teamMembers
                  .sort((a, b) => (a.currentLoad / a.capacity) - (b.currentLoad / b.capacity))
                  .map((member) => {
                    const percentage = (member.currentLoad / member.capacity) * 100
                    const isOverloaded = percentage > 80
                    const statusColor = isOverloaded ? 'border-l-[#dc2626]' : percentage > 60 ? 'border-l-[#d97706]' : 'border-l-[#16a34a]'
                    
                    return (
                      <div 
                        key={member.id}
                        className={`p-2.5 border border-[#e5e7eb] rounded-sm border-l-2 ${statusColor}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <Avatar className="w-8 h-8 rounded-sm border border-[#e5e7eb]">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="rounded-sm text-[11px] bg-[#f3f4f6] text-[#374151]">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[13px] font-medium text-[#111827]">{member.name}</span>
                              {isOverloaded && (
                                <span className="px-1 py-0.5 text-[9px] bg-[#fef2f2] text-[#dc2626] rounded-sm border border-[#fecaca]">
                                  已满载
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mb-1.5">
                              {member.expertise.map((exp) => (
                                <span 
                                  key={exp}
                                  className="px-1 py-0.5 text-[9px] bg-[#f3f4f6] text-[#4b5563] rounded-sm border border-[#e5e7eb]"
                                >
                                  {exp}
                                </span>
                              ))}
                            </div>
                            <LoadBar current={member.currentLoad} capacity={member.capacity} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
            <div className="px-3 py-1.5 border-t border-[#e5e7eb] bg-[#f9fafb]">
              <div className="flex items-center gap-3 text-[9px] text-[#9ca3af]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#16a34a] rounded-full"></span> 空闲
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#d97706] rounded-full"></span> 繁忙
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#dc2626] rounded-full"></span> 满载
                </span>
              </div>
            </div>
          </div>

          {/* 右侧：全局进度图表 */}
          <div className="flex flex-col bg-white border border-[#e5e7eb] rounded-sm overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
              <h2 className="text-[13px] font-medium text-[#111827]">全局进度概览</h2>
              <TrendingUp className="w-3.5 h-3.5 text-[#16a34a]" />
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {/* 本周交付完成数 */}
              <div className="mb-4">
                <p className="text-[11px] text-[#6b7280] mb-2">本周每日交付完成</p>
                <ChartContainer config={chartConfig} className="h-[120px] w-full">
                  <BarChart data={weeklyDeliveryData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="target" fill="#e5e7eb" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="completed" fill="#2563eb" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>

              {/* 平均交付耗时趋势 */}
              <div>
                <p className="text-[11px] text-[#6b7280] mb-2">平均交付耗时趋势 (天)</p>
                <ChartContainer config={chartConfig} className="h-[100px] w-full">
                  <LineChart data={deliveryTimeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="week" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      domain={[0, 'auto']}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="avgDays" 
                      stroke="#16a34a" 
                      strokeWidth={1.5}
                      dot={{ r: 3, fill: '#16a34a' }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>

              {/* 统计摘要 */}
              <div className="mt-4 pt-3 border-t border-[#e5e7eb]">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">本周完成</span>
                    <span className="font-mono text-[#111827]">{totalCompleted} 件</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">目标</span>
                    <span className="font-mono text-[#111827]">{totalTarget} 件</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">完成率</span>
                    <span className={`font-mono ${completionRate >= 100 ? 'text-[#16a34a]' : 'text-[#d97706]'}`}>
                      {completionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">耗时趋势</span>
                    <span className="font-mono text-[#16a34a]">↓ 改善中</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速指派弹窗 */}
      <AssignDialog 
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        onAssign={handleAssign}
      />
    </DashboardLayout>
  )
}
