'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft,
  Search,
  Crown,
  Zap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

// Mock task data
const taskData = {
  id: 'TASK-2024-001',
  title: 'CRM System API Integration',
  priority: 'high' as const,
  client: 'TechCorp Solutions',
  skills: ['TypeScript', 'Node.js', 'REST API'],
  estimatedHours: 40,
  description: 'Integrate our CRM system with third-party APIs for data synchronization. Requires expertise in backend development and API design patterns.',
}

// Mock expert recommendations
const expertRecommendations = [
  {
    id: 'expert-1',
    name: 'Alex Johnson',
    role: 'Senior Backend Engineer',
    avatar: 'AJ',
    matchScore: 92,
    skills: ['TypeScript', 'Node.js', 'REST API', 'PostgreSQL'],
    currentLoad: 8,
    capacity: 15,
    status: 'available' as const,
    badge: 'best' as const,
  },
  {
    id: 'expert-2',
    name: 'Sarah Chen',
    role: 'Full Stack Developer',
    avatar: 'SC',
    matchScore: 78,
    skills: ['TypeScript', 'React', 'Node.js'],
    currentLoad: 12,
    capacity: 15,
    status: 'available' as const,
    badge: null,
  },
  {
    id: 'expert-3',
    name: 'Michael Rodriguez',
    role: 'API Specialist',
    avatar: 'MR',
    matchScore: 65,
    skills: ['REST API', 'GraphQL', 'Go'],
    currentLoad: 16,
    capacity: 16,
    status: 'overloaded' as const,
    badge: null,
  },
]

const getLoadColor = (load: number, capacity: number) => {
  const percentage = (load / capacity) * 100
  if (percentage < 80) return 'bg-[#10b981]'
  if (percentage < 100) return 'bg-[#f59e0b]'
  return 'bg-[#ef4444]'
}

const getLoadLabel = (load: number, capacity: number) => {
  const percentage = Math.round((load / capacity) * 100)
  if (percentage >= 100) return `${percentage}% (Overloaded)`
  return `${percentage}% (Available)`
}

export default function IntelligentDispatchCenterPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [assigningId, setAssigningId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const filteredExperts = expertRecommendations.filter(expert =>
    expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleAssign = (expertId: string) => {
    setAssigningId(expertId)
    setTimeout(() => {
      setAssigningId(null)
      // In real app, would trigger API call
    }, 800)
  }

  return (
    <DashboardLayout title="Intelligent Dispatch Center" userName="System Admin" isSupervisor={true}>
      <div className="flex flex-col gap-3 h-full p-0">
        {/* Header with back button */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-[#e5e7eb] rounded-sm">
          <Link 
            href="/dispatch"
            className="inline-flex items-center justify-center w-6 h-6 hover:bg-[#f3f4f6] rounded-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#6b7280]" />
          </Link>
          <div className="h-4 w-px bg-[#e5e7eb]" />
          <span className="font-mono text-[12px] font-medium text-[#2563eb]">{taskData.id}</span>
        </div>

        {/* Main content - Two column layout */}
        <div className="flex gap-3 flex-1 min-h-0">
          {/* Left Column - Task Details (40%) */}
          <div className="w-[40%] flex flex-col gap-3">
            {/* Task Card */}
            <div className="bg-white border border-[#e5e7eb] rounded-sm p-3 flex flex-col gap-3">
              {/* Title */}
              <div>
                <h2 className="text-[14px] font-medium text-[#111827] mb-2">{taskData.title}</h2>
                <div className="flex gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] rounded-sm ${
                    taskData.priority === 'high' 
                      ? 'bg-[#fee2e2] text-[#b91c1c]' 
                      : taskData.priority === 'medium'
                      ? 'bg-[#fef3c7] text-[#a16207]'
                      : 'bg-[#ecfdf5] text-[#047857]'
                  }`}>
                    {taskData.priority === 'high' ? 'High Priority' : taskData.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                  </span>
                  <span className="inline-flex px-2 py-1 text-[10px] bg-[#eff6ff] text-[#1d4ed8] rounded-sm">
                    {taskData.client}
                  </span>
                </div>
              </div>

              {/* Estimated Effort */}
              <div className="border-t border-[#f3f4f6] pt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-[#374151]">Estimated Effort</span>
                  <span className="font-mono text-[12px] font-bold text-[#2563eb]">{taskData.estimatedHours} Hours</span>
                </div>
              </div>

              {/* Required Skills */}
              <div className="border-t border-[#f3f4f6] pt-3">
                <div className="text-[12px] font-medium text-[#374151] mb-2">Required Skills</div>
                <div className="flex gap-2 flex-wrap">
                  {taskData.skills.map(skill => (
                    <span key={skill} className="inline-flex px-2 py-1 text-[10px] bg-[#f3f4f6] text-[#6b7280] rounded-sm border border-[#e5e7eb]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-[#f3f4f6] pt-3">
                <div className="text-[12px] font-medium text-[#374151] mb-2">Description</div>
                <p className="text-[11px] text-[#6b7280] leading-relaxed">{taskData.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column - AI Expert Recommendations (60%) */}
          <div className="w-[60%] flex flex-col gap-3 min-h-0">
            {/* Header */}
            <div className="bg-white border border-[#e5e7eb] rounded-sm p-3">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-[14px] font-medium text-[#111827]">Intelligent Allocation Recommendations</h3>
                <Zap className="w-4 h-4 text-[#f59e0b]" />
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                <Input 
                  placeholder="Search experts or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-7 text-[11px] border border-[#e5e7eb] rounded-sm shadow-none focus-visible:ring-1 focus-visible:ring-[#2563eb]"
                />
              </div>
            </div>

            {/* Experts List */}
            <div className="flex-1 bg-white border border-[#e5e7eb] rounded-sm overflow-y-auto">
              <div className="divide-y divide-[#f3f4f6]">
                {filteredExperts.map((expert, index) => {
                  const loadPercentage = (expert.currentLoad / expert.capacity) * 100
                  const loadColor = getLoadColor(expert.currentLoad, expert.capacity)
                  const isOverloaded = expert.currentLoad >= expert.capacity
                  
                  return (
                    <div key={expert.id} className={`p-3 ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'} hover:bg-[#f9fafb] transition-colors`}>
                      {/* Header with badge */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2 flex-1">
                          <Avatar className="w-7 h-7 rounded-sm">
                            <AvatarFallback className="rounded-sm text-[10px] bg-[#e5e7eb] text-[#374151] font-medium">
                              {expert.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <div className="text-[12px] font-medium text-[#111827]">{expert.name}</div>
                              {expert.badge === 'best' && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#fef3c7] text-[#a16207] rounded-sm text-[9px] font-medium">
                                  <Crown className="w-3 h-3" />
                                  Best Match
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#6b7280]">{expert.role}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1 mb-1">
                            <span className="text-[12px] font-bold text-[#2563eb]">{expert.matchScore}%</span>
                            <div className="text-[10px] text-[#9ca3af]">Match</div>
                          </div>
                          <div className="text-[10px] text-[#6b7280]">Similarity</div>
                        </div>
                      </div>

                      {/* Load status with progress bar */}
                      <div className="mb-2.5 p-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-sm">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-medium text-[#374151]">Current Load</span>
                          <span className="font-mono text-[10px] text-[#111827]">
                            {expert.currentLoad}/{expert.capacity}
                          </span>
                        </div>
                        <div className="mb-1">
                          <Progress 
                            value={Math.min(loadPercentage, 100)} 
                            className="h-1.5 bg-[#e5e7eb] rounded-full"
                          />
                        </div>
                        <div className={`text-[9px] font-medium ${
                          isOverloaded ? 'text-[#ef4444]' : loadPercentage >= 80 ? 'text-[#f59e0b]' : 'text-[#10b981]'
                        }`}>
                          {getLoadLabel(expert.currentLoad, expert.capacity)}
                        </div>
                      </div>

                      {/* Skills match */}
                      <div className="mb-2.5">
                        <div className="flex flex-wrap gap-1">
                          {expert.skills.map(skill => (
                            <span 
                              key={skill}
                              className={`inline-flex px-1.5 py-0.5 text-[9px] rounded-sm ${
                                taskData.skills.includes(skill)
                                  ? 'bg-[#ecfdf5] text-[#047857]'
                                  : 'bg-[#f3f4f6] text-[#6b7280]'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action button */}
                      <Button
                        onClick={() => handleAssign(expert.id)}
                        disabled={isOverloaded || assigningId === expert.id}
                        className={`w-full h-7 text-[11px] font-medium rounded-sm transition-all ${
                          isOverloaded
                            ? 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'
                            : expert.badge === 'best'
                            ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
                            : 'bg-[#f9fafb] hover:bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb]'
                        }`}
                      >
                        {assigningId === expert.id ? (
                          <>Assigning...</>
                        ) : isOverloaded ? (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1 inline" />
                            Overloaded
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                            Assign
                          </>
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
