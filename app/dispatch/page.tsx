'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, LineChart, Line } from 'recharts'
import {
  Clock,
  Zap,
  TrendingUp,
  CheckCircle2,
  Users,
  Timer,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import {
  getExecutors,
  getUnassignedOpportunities,
  assignOpportunity,
  type Executor,
  type UnassignedOpportunity,
} from './actions'

// Labels
const L = {
  unassignedPool: '待指派池',
  teamLoad: '资源矩阵',
  stats: '进度统计',
  pending: '待指派',
  weekComplete: '本周完成率',
  avgTime: '平均耗时',
  teamTotal: '团队负荷',
  items: '件',
  days: '天',
  assignTo: '指派给...',
  overloaded: '满载',
  idle: '空闲',
  busy: '繁忙',
  waitDays: '已等待',
  day: '天',
  weeklyDelivery: '本周交付',
  timeTrend: '耗时趋势',
  noData: '暂无数据',
  loading: '加载中...',
}

// Mock chart data (统计图表后续接入真实数据)
const weeklyData = [
  { day: '周一', completed: 8 },
  { day: '周二', completed: 12 },
  { day: '周三', completed: 9 },
  { day: '周四', completed: 11 },
  { day: '周五', completed: 7 },
]

const timeData = [
  { week: 'W1', days: 4.2 },
  { week: 'W2', days: 3.8 },
  { week: 'W3', days: 3.5 },
  { week: 'W4', days: 3.2 },
]

const chartConfig = {
  completed: { label: '完成', color: '#2563eb' },
  days: { label: '天数', color: '#16a34a' },
}

// Urgency icon component
function UrgencyIcon({ level }: { level: 'high' | 'medium' | 'low' }) {
  if (level === 'high') return <Zap className="w-3 h-3 text-[#b91c1c]" />
  if (level === 'medium') return <Clock className="w-3 h-3 text-[#b45309]" />
  return <Clock className="w-3 h-3 text-[#6b7280]" />
}

// Thin load bar
function LoadBar({ current, capacity }: { current: number; capacity: number }) {
  const pct = capacity > 0 ? (current / capacity) * 100 : 0
  const color = pct > 80 ? 'bg-[#b91c1c]' : pct > 60 ? 'bg-[#b45309]' : 'bg-[#15803d]'
  return (
    <div className="flex items-center gap-1.5 w-full">
      <div className="flex-1 h-[3px] bg-[#e5e7eb] rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className={`text-[10px] font-mono ${pct > 80 ? 'text-[#b91c1c]' : 'text-[#6b7280]'}`}>
        {current}/{capacity}
      </span>
    </div>
  )
}

// Hover dropdown for quick assign
function QuickAssignDropdown({
  oppId,
  executors,
  onAssign,
}: {
  oppId: string
  executors: Executor[]
  onAssign: (oppId: string, executorId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const available = executors.filter(
    (m) => m.capacity > 0 && (m.currentLoad / m.capacity) < 0.9
  )

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 h-5 px-1.5 text-[10px] text-[#6b7280] hover:text-[#2563eb] hover:bg-[#eff6ff] rounded-sm transition-colors"
      >
        {L.assignTo}
        <ChevronDown className="w-2.5 h-2.5" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-0.5 w-32 bg-white border border-[#e5e7eb] rounded-sm z-10">
          {available.length === 0 ? (
            <div className="px-2 py-1.5 text-[11px] text-[#9ca3af]">无可用人员</div>
          ) : (
            available.map((m) => (
              <button
                key={m.id}
                onClick={() => { onAssign(oppId, m.id); setOpen(false) }}
                className="w-full px-2 py-1.5 text-left text-[11px] text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
              >
                <span>{m.name}</span>
                <span className="font-mono text-[9px] text-[#9ca3af]">{m.currentLoad}/{m.capacity}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function DispatchPage() {
  const user = useAuth()
  const [hoveredOpp, setHoveredOpp] = useState<string | null>(null)
  const [executors, setExecutors] = useState<Executor[]>([])
  const [opportunities, setOpportunities] = useState<UnassignedOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    async function loadData() {
      try {
        const [execs, opps] = await Promise.all([
          getExecutors(),
          getUnassignedOpportunities(),
        ])
        setExecutors(execs)
        setOpportunities(opps)
      } catch (err) {
        console.error('Failed to load dispatch data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleAssign = async (oppId: string, executorId: string) => {
    if (!user) return
    try {
      // 找到商机对应的组织ID（从执行人的角度，用第一个组织）
      await assignOpportunity(oppId, executorId, user.id, '')
      // 刷新数据
      const [execs, opps] = await Promise.all([
        getExecutors(),
        getUnassignedOpportunities(),
      ])
      setExecutors(execs)
      setOpportunities(opps)
    } catch (err) {
      console.error('Assign failed:', err)
    }
  }

  const totalCompleted = weeklyData.reduce((s, d) => s + d.completed, 0)
  const avgTime = timeData[timeData.length - 1].days

  const teamLoadTotal = useMemo(() => ({
    current: executors.reduce((s, m) => s + m.currentLoad, 0),
    capacity: executors.reduce((s, m) => s + m.capacity, 0),
  }), [executors])

  if (!mounted) return null

  return (
    <DashboardLayout title={'资源调度'} userName={user?.name}>
      <div className="flex flex-col h-full gap-3">
        {/* Top stats row - 4 cards */}
        <div className="grid grid-cols-4 gap-2 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-[#e5e7eb] rounded-sm">
            <div className="w-7 h-7 flex items-center justify-center bg-[#fef2f2] rounded-sm">
              <Clock className="w-3.5 h-3.5 text-[#b91c1c]" />
            </div>
            <div>
              <p className="text-[10px] text-[#6b7280]">{L.pending}</p>
              <p className="text-[18px] font-semibold text-[#111827] font-mono leading-tight">
                {loading ? '-' : opportunities.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-[#e5e7eb] rounded-sm">
            <div className="w-7 h-7 flex items-center justify-center bg-[#f0fdf4] rounded-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
            </div>
            <div>
              <p className="text-[10px] text-[#6b7280]">{L.weekComplete}</p>
              <p className="text-[18px] font-semibold text-[#111827] font-mono leading-tight">87%</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-[#e5e7eb] rounded-sm">
            <div className="w-7 h-7 flex items-center justify-center bg-[#eff6ff] rounded-sm">
              <Timer className="w-3.5 h-3.5 text-[#2563eb]" />
            </div>
            <div>
              <p className="text-[10px] text-[#6b7280]">{L.avgTime}</p>
              <p className="text-[18px] font-semibold text-[#111827] font-mono leading-tight">{avgTime}{L.days}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-[#e5e7eb] rounded-sm">
            <div className="w-7 h-7 flex items-center justify-center bg-[#fefce8] rounded-sm">
              <Users className="w-3.5 h-3.5 text-[#a16207]" />
            </div>
            <div>
              <p className="text-[10px] text-[#6b7280]">{L.teamTotal}</p>
              <p className="text-[18px] font-semibold text-[#111827] font-mono leading-tight">
                {loading ? '-' : `${teamLoadTotal.current}/${teamLoadTotal.capacity}`}
              </p>
            </div>
          </div>
        </div>

        {/* Main content - 3 columns */}
        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
          {/* Left: Unassigned Pool */}
          <div className="col-span-3 flex flex-col bg-white border border-[#e5e7eb] rounded-sm overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-between">
              <span className="text-[12px] font-medium text-[#374151]">{L.unassignedPool}</span>
              <span className="px-1 py-0.5 text-[9px] font-mono bg-[#fef2f2] text-[#b91c1c] rounded-sm border border-[#fecaca]">
                {loading ? '-' : opportunities.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-4 h-4 animate-spin text-[#9ca3af]" />
                  <span className="ml-1.5 text-[11px] text-[#9ca3af]">{L.loading}</span>
                </div>
              ) : opportunities.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-[11px] text-[#9ca3af]">
                  {L.noData}
                </div>
              ) : (
                opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    onMouseEnter={() => setHoveredOpp(opp.id)}
                    onMouseLeave={() => setHoveredOpp(null)}
                    className="px-2.5 py-2 border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] text-[#2563eb] font-medium">{opp.opportunityCode}</span>
                      <UrgencyIcon level={opp.urgency} />
                    </div>
                    <div className="text-[10px] text-[#374151] truncate mb-0.5">{opp.customerName}</div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#6b7280]">{opp.serviceType}</span>
                      <span className="font-mono text-[#6b7280]">{L.waitDays}{opp.waitingDays}{L.day}</span>
                    </div>
                    {hoveredOpp === opp.id && (
                      <div className="mt-1.5 pt-1.5 border-t border-[#e5e7eb]">
                        <QuickAssignDropdown
                          oppId={opp.id}
                          executors={executors}
                          onAssign={handleAssign}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Middle: Team Resource Matrix */}
          <div className="col-span-6 flex flex-col bg-white border border-[#e5e7eb] rounded-sm overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-between">
              <span className="text-[12px] font-medium text-[#374151]">{L.teamLoad}</span>
              <div className="flex items-center gap-2 text-[9px] text-[#9ca3af]">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#15803d] rounded-full" />{L.idle}</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#b45309] rounded-full" />{L.busy}</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#b91c1c] rounded-full" />{L.overloaded}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2.5">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-4 h-4 animate-spin text-[#9ca3af]" />
                  <span className="ml-1.5 text-[11px] text-[#9ca3af]">{L.loading}</span>
                </div>
              ) : executors.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-[11px] text-[#9ca3af]">
                  {L.noData}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {executors
                    .sort((a, b) => (a.currentLoad / a.capacity) - (b.currentLoad / b.capacity))
                    .map((member) => {
                      const pct = member.capacity > 0 ? (member.currentLoad / member.capacity) * 100 : 0
                      const borderColor = pct > 80 ? 'border-l-[#b91c1c]' : pct > 60 ? 'border-l-[#b45309]' : 'border-l-[#15803d]'
                      return (
                        <div
                          key={member.id}
                          className={`p-2.5 border border-[#e5e7eb] rounded-sm border-l-2 ${borderColor} bg-white`}
                        >
                          <div className="flex items-start gap-2">
                            <Avatar className="w-8 h-8 rounded-sm border border-[#e5e7eb] flex-shrink-0">
                              <AvatarImage src="" />
                              <AvatarFallback className="rounded-sm text-[10px] bg-[#f3f4f6] text-[#374151]">
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[12px] font-medium text-[#111827]">{member.name}</span>
                                {pct > 80 && (
                                  <span className="px-1 py-0.5 text-[8px] bg-[#fef2f2] text-[#b91c1c] rounded-sm border border-[#fecaca]">
                                    {L.overloaded}
                                  </span>
                                )}
                              </div>
                              {member.expertise.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-1.5">
                                  {member.expertise.map((exp) => (
                                    <span key={exp} className="px-1 py-0.5 text-[8px] bg-[#f3f4f6] text-[#4b5563] rounded-sm border border-[#e5e7eb]">
                                      {exp}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <LoadBar current={member.currentLoad} capacity={member.capacity} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Stats charts */}
          <div className="col-span-3 flex flex-col bg-white border border-[#e5e7eb] rounded-sm overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-[#e5e7eb] bg-[#f9fafb] flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-[#15803d]" />
              <span className="text-[12px] font-medium text-[#374151]">{L.stats}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2.5">
              {/* Weekly delivery chart */}
              <div className="mb-3">
                <p className="text-[10px] text-[#6b7280] mb-1.5">{L.weeklyDelivery}</p>
                <ChartContainer config={chartConfig} className="h-[90px] w-full">
                  <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completed" fill="#2563eb" radius={[1, 1, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>

              {/* Time trend chart */}
              <div className="mb-3">
                <p className="text-[10px] text-[#6b7280] mb-1.5">{L.timeTrend}</p>
                <ChartContainer config={chartConfig} className="h-[80px] w-full">
                  <LineChart data={timeData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af' }} domain={[0, 'auto']} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="days" stroke="#15803d" strokeWidth={1.5} dot={{ r: 2, fill: '#15803d' }} />
                  </LineChart>
                </ChartContainer>
              </div>

              {/* Summary stats */}
              <div className="pt-2 border-t border-[#e5e7eb] space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#6b7280]">{L.weekComplete}</span>
                  <span className="font-mono text-[#111827]">{totalCompleted}{L.items}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#6b7280]">{L.avgTime}</span>
                  <span className="font-mono text-[#111827]">{avgTime}{L.days}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
