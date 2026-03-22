'use client'

import { useState, useRef } from 'react'
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
  ChevronDown
} from 'lucide-react'

// Labels
const L = {
  unassignedPool: '\u5F85\u6307\u6D3E\u6C60',
  teamLoad: '\u8D44\u6E90\u77E9\u9635',
  stats: '\u8FDB\u5EA6\u7EDF\u8BA1',
  pending: '\u5F85\u6307\u6D3E',
  weekComplete: '\u672C\u5468\u5B8C\u6210\u7387',
  avgTime: '\u5E73\u5747\u8017\u65F6',
  teamTotal: '\u56E2\u961F\u8D1F\u8F7D',
  items: '\u4EF6',
  days: '\u5929',
  assignTo: '\u6307\u6D3E\u7ED9...',
  overloaded: '\u6EE1\u8F7D',
  idle: '\u7A7A\u95F2',
  busy: '\u7E41\u5FD9',
  waitDays: '\u5DF2\u7B49\u5F85',
  day: '\u5929',
  weeklyDelivery: '\u672C\u5468\u4EA4\u4ED8',
  timeTrend: '\u8017\u65F6\u8D8B\u52BF',
}

// Mock data
const unassignedOpportunities = [
  { id: 'OPP-240321-001', serviceType: '\u7B7E\u8BC1', expectedAmount: 28000, waitingDays: 2, urgency: 'high' as const },
  { id: 'OPP-240320-002', serviceType: '\u516C\u53F8\u6CE8\u518C', expectedAmount: 45000, waitingDays: 3, urgency: 'medium' as const },
  { id: 'OPP-240319-003', serviceType: '\u7A0E\u52A1', expectedAmount: 15000, waitingDays: 4, urgency: 'high' as const },
  { id: 'OPP-240318-004', serviceType: '\u5DE5\u4F5C\u8BB8\u53EF', expectedAmount: 32000, waitingDays: 5, urgency: 'low' as const },
  { id: 'OPP-240317-005', serviceType: '\u7B7E\u8BC1', expectedAmount: 18000, waitingDays: 6, urgency: 'high' as const },
]

const teamMembers = [
  { id: 1, name: '\u674E\u660E', initials: '\u674E', expertise: ['\u7B7E\u8BC1', '\u5DE5\u4F5C\u8BB8\u53EF'], currentLoad: 12, capacity: 20 },
  { id: 2, name: '\u738B\u82B3', initials: '\u738B', expertise: ['\u516C\u53F8\u6CE8\u518C', '\u7A0E\u52A1'], currentLoad: 8, capacity: 15 },
  { id: 3, name: '\u5F20\u4F1F', initials: '\u5F20', expertise: ['\u7B7E\u8BC1', '\u7A0E\u52A1'], currentLoad: 17, capacity: 18 },
  { id: 4, name: '\u9648\u9759', initials: '\u9648', expertise: ['\u516C\u53F8\u6CE8\u518C', '\u5DE5\u4F5C\u8BB8\u53EF'], currentLoad: 5, capacity: 20 },
]

const weeklyData = [
  { day: '\u5468\u4E00', completed: 8 },
  { day: '\u5468\u4E8C', completed: 12 },
  { day: '\u5468\u4E09', completed: 9 },
  { day: '\u5468\u56DB', completed: 11 },
  { day: '\u5468\u4E94', completed: 7 },
]

const timeData = [
  { week: 'W1', days: 4.2 },
  { week: 'W2', days: 3.8 },
  { week: 'W3', days: 3.5 },
  { week: 'W4', days: 3.2 },
]

const chartConfig = {
  completed: { label: '\u5B8C\u6210', color: '#2563eb' },
  days: { label: '\u5929\u6570', color: '#16a34a' },
}

// Urgency icon component
function UrgencyIcon({ level }: { level: 'high' | 'medium' | 'low' }) {
  if (level === 'high') return <Zap className="w-3 h-3 text-[#b91c1c]" />
  if (level === 'medium') return <Clock className="w-3 h-3 text-[#b45309]" />
  return <Clock className="w-3 h-3 text-[#6b7280]" />
}

// Thin load bar
function LoadBar({ current, capacity }: { current: number; capacity: number }) {
  const pct = (current / capacity) * 100
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
  onAssign 
}: { 
  oppId: string
  onAssign: (oppId: string, memberId: number) => void 
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
          {teamMembers
            .filter(m => (m.currentLoad / m.capacity) < 0.9)
            .map((m) => (
              <button
                key={m.id}
                onClick={() => { onAssign(oppId, m.id); setOpen(false) }}
                className="w-full px-2 py-1.5 text-left text-[11px] text-[#374151] hover:bg-[#f3f4f6] flex items-center justify-between"
              >
                <span>{m.name}</span>
                <span className="font-mono text-[9px] text-[#9ca3af]">{m.currentLoad}/{m.capacity}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default function DispatchPage() {
  const user = useAuth()
  const [hoveredOpp, setHoveredOpp] = useState<string | null>(null)

  const handleAssign = (oppId: string, memberId: number) => {
    console.log(`Assigned ${oppId} to member ${memberId}`)
  }

  const totalCompleted = weeklyData.reduce((s, d) => s + d.completed, 0)
  const avgTime = timeData[timeData.length - 1].days

  return (
    <DashboardLayout title={'资源调度'} userName={user?.name} isSupervisor={true}>
      <div className="flex flex-col h-full gap-3">
        {/* Top stats row - 4 cards */}
        <div className="grid grid-cols-4 gap-2 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-[#e5e7eb] rounded-sm">
            <div className="w-7 h-7 flex items-center justify-center bg-[#fef2f2] rounded-sm">
              <Clock className="w-3.5 h-3.5 text-[#b91c1c]" />
            </div>
            <div>
              <p className="text-[10px] text-[#6b7280]">{L.pending}</p>
              <p className="text-[18px] font-semibold text-[#111827] font-mono leading-tight">{unassignedOpportunities.length}</p>
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
                {teamMembers.reduce((s, m) => s + m.currentLoad, 0)}/{teamMembers.reduce((s, m) => s + m.capacity, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Main content - 3 columns */}
        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
          {/* Left: Unassigned Pool - narrow */}
          <div className="col-span-3 flex flex-col bg-white border border-[#e5e7eb] rounded-sm overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-between">
              <span className="text-[12px] font-medium text-[#374151]">{L.unassignedPool}</span>
              <span className="px-1 py-0.5 text-[9px] font-mono bg-[#fef2f2] text-[#b91c1c] rounded-sm border border-[#fecaca]">
                {unassignedOpportunities.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {unassignedOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  onMouseEnter={() => setHoveredOpp(opp.id)}
                  onMouseLeave={() => setHoveredOpp(null)}
                  className="px-2.5 py-2 border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] text-[#2563eb] font-medium">{opp.id}</span>
                    <UrgencyIcon level={opp.urgency} />
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#374151]">{opp.serviceType}</span>
                    <span className="font-mono text-[#6b7280]">{L.waitDays}{opp.waitingDays}{L.day}</span>
                  </div>
                  {/* Hover dropdown */}
                  {hoveredOpp === opp.id && (
                    <div className="mt-1.5 pt-1.5 border-t border-[#e5e7eb]">
                      <QuickAssignDropdown oppId={opp.id} onAssign={handleAssign} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Middle: Team Resource Matrix - grid */}
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
              <div className="grid grid-cols-2 gap-2">
                {teamMembers
                  .sort((a, b) => (a.currentLoad / a.capacity) - (b.currentLoad / b.capacity))
                  .map((member) => {
                    const pct = (member.currentLoad / member.capacity) * 100
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
                            <div className="flex flex-wrap gap-1 mb-1.5">
                              {member.expertise.map((exp) => (
                                <span key={exp} className="px-1 py-0.5 text-[8px] bg-[#f3f4f6] text-[#4b5563] rounded-sm border border-[#e5e7eb]">
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
