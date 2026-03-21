'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { GripVertical, AlertTriangle, Clock, Zap } from 'lucide-react'

// 待分配商机数据
const unassignedOpportunities = [
  {
    id: 'OPP-240321-001',
    serviceType: '签证申请',
    urgency: 'high',
    customerName: '北京科技有限公司',
    createdAt: '2024-03-21',
  },
  {
    id: 'OPP-240321-002',
    serviceType: '公司注册',
    urgency: 'medium',
    customerName: '上海贸易集团',
    createdAt: '2024-03-21',
  },
  {
    id: 'OPP-240320-003',
    serviceType: '税务咨询',
    urgency: 'low',
    customerName: '深圳创新科技',
    createdAt: '2024-03-20',
  },
  {
    id: 'OPP-240320-004',
    serviceType: '签证申请',
    urgency: 'high',
    customerName: '广州进出口公司',
    createdAt: '2024-03-20',
  },
  {
    id: 'OPP-240319-005',
    serviceType: '工作许可',
    urgency: 'medium',
    customerName: '杭州数字科技',
    createdAt: '2024-03-19',
  },
]

// 团队成员数据
const teamMembers = [
  {
    id: 1,
    name: '李明',
    avatar: '',
    initials: '李',
    specialties: ['签证', '工作许可'],
    currentLoad: 12,
    capacity: 20,
  },
  {
    id: 2,
    name: '王芳',
    avatar: '',
    initials: '王',
    specialties: ['公司注册', '税务'],
    currentLoad: 8,
    capacity: 15,
  },
  {
    id: 3,
    name: '张伟',
    avatar: '',
    initials: '张',
    specialties: ['签证', '税务咨询'],
    currentLoad: 15,
    capacity: 18,
  },
  {
    id: 4,
    name: '陈静',
    avatar: '',
    initials: '陈',
    specialties: ['公司注册', '工作许可'],
    currentLoad: 5,
    capacity: 20,
  },
]

// 紧急程度标签
function UrgencyBadge({ urgency }: { urgency: string }) {
  const config = {
    high: {
      label: '高',
      className: 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]',
      icon: Zap,
    },
    medium: {
      label: '中',
      className: 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]',
      icon: AlertTriangle,
    },
    low: {
      label: '低',
      className: 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]',
      icon: Clock,
    },
  }
  const { label, className, icon: Icon } = config[urgency as keyof typeof config]
  
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium border rounded-sm ${className}`}>
      <Icon className="w-2.5 h-2.5" />
      {label}
    </span>
  )
}

// 负载进度条
function LoadBar({ current, capacity }: { current: number; capacity: number }) {
  const percentage = (current / capacity) * 100
  const isOverloaded = percentage > 80
  const barColor = isOverloaded ? 'bg-[#dc2626]' : 'bg-[#2563eb]'
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
        <div 
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className={`text-[11px] font-mono ${isOverloaded ? 'text-[#dc2626]' : 'text-[#6b7280]'}`}>
        {current}/{capacity}
      </span>
    </div>
  )
}

// 待分配商机卡片
function OpportunityCard({ opportunity, onAssign }: { 
  opportunity: typeof unassignedOpportunities[0]
  onAssign: (id: string) => void 
}) {
  const [isDragging, setIsDragging] = useState(false)
  
  return (
    <div 
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('opportunityId', opportunity.id)
        setIsDragging(true)
      }}
      onDragEnd={() => setIsDragging(false)}
      className={`flex items-start gap-2 p-2.5 bg-white border border-[#e5e7eb] rounded-sm cursor-grab active:cursor-grabbing transition-colors ${
        isDragging ? 'border-[#2563eb] bg-[#eff6ff]' : 'hover:border-[#d1d5db]'
      }`}
    >
      <GripVertical className="w-3.5 h-3.5 text-[#9ca3af] mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-mono text-[12px] text-[#2563eb] font-medium">
            {opportunity.id}
          </span>
          <UrgencyBadge urgency={opportunity.urgency} />
        </div>
        <p className="text-[13px] text-[#111827] truncate mb-0.5">
          {opportunity.customerName}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#6b7280]">{opportunity.serviceType}</span>
          <span className="text-[10px] text-[#9ca3af] font-mono">{opportunity.createdAt}</span>
        </div>
      </div>
    </div>
  )
}

// 团队成员卡片
function MemberCard({ member, onAssign, isDropTarget }: { 
  member: typeof teamMembers[0]
  onAssign: (memberId: number) => void
  isDropTarget: boolean
}) {
  return (
    <div 
      className={`p-3 bg-white border rounded-sm transition-colors ${
        isDropTarget 
          ? 'border-[#2563eb] border-dashed bg-[#eff6ff]' 
          : 'border-[#e5e7eb]'
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-9 h-9 rounded-sm border border-[#e5e7eb]">
          <AvatarImage src={member.avatar} />
          <AvatarFallback className="rounded-sm text-[12px] bg-[#f3f4f6] text-[#374151]">
            {member.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-medium text-[#111827]">{member.name}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAssign(member.id)}
              className="h-6 px-2 text-[10px] rounded-sm border-[#e5e7eb] hover:bg-[#eff6ff] hover:text-[#2563eb] hover:border-[#2563eb]"
            >
              一键分配
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {member.specialties.map((specialty) => (
              <span 
                key={specialty}
                className="px-1.5 py-0.5 text-[10px] bg-[#f3f4f6] text-[#4b5563] rounded-sm border border-[#e5e7eb]"
              >
                {specialty}
              </span>
            ))}
          </div>
          <LoadBar current={member.currentLoad} capacity={member.capacity} />
        </div>
      </div>
      {isDropTarget && (
        <div className="mt-2 pt-2 border-t border-dashed border-[#2563eb]">
          <p className="text-[11px] text-[#2563eb] text-center">松开鼠标以分配到此成员</p>
        </div>
      )}
    </div>
  )
}

export default function DispatchPage() {
  const [dropTargetId, setDropTargetId] = useState<number | null>(null)
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent, memberId: number) => {
    e.preventDefault()
    setDropTargetId(memberId)
  }

  const handleDragLeave = () => {
    setDropTargetId(null)
  }

  const handleDrop = (e: React.DragEvent, memberId: number) => {
    e.preventDefault()
    const opportunityId = e.dataTransfer.getData('opportunityId')
    console.log(`分配商机 ${opportunityId} 给成员 ${memberId}`)
    setDropTargetId(null)
    // 实际应用中这里会调用 API
  }

  const handleQuickAssign = (memberId: number) => {
    if (selectedOpportunity) {
      console.log(`快速分配商机 ${selectedOpportunity} 给成员 ${memberId}`)
      setSelectedOpportunity(null)
    }
  }

  return (
    <DashboardLayout title="资源调度" userName="张三" isSupervisor={true}>
      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-120px)]">
        {/* 左侧：待分配商机池 */}
        <div className="flex flex-col bg-white border border-[#e5e7eb] rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
            <h2 className="text-[13px] font-medium text-[#111827]">待分配商机池</h2>
            <span className="px-1.5 py-0.5 text-[11px] font-mono bg-[#fef2f2] text-[#dc2626] rounded-sm border border-[#fecaca]">
              {unassignedOpportunities.length} 待分配
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="flex flex-col gap-2">
              {unassignedOpportunities.map((opp) => (
                <OpportunityCard 
                  key={opp.id} 
                  opportunity={opp} 
                  onAssign={(id) => setSelectedOpportunity(id)}
                />
              ))}
            </div>
          </div>
          <div className="px-3 py-2 border-t border-[#e5e7eb] bg-[#f9fafb]">
            <p className="text-[11px] text-[#6b7280]">
              提示：拖拽商机卡片到右侧成员卡片上完成分配
            </p>
          </div>
        </div>

        {/* 右侧：团队负载看板 */}
        <div className="flex flex-col bg-white border border-[#e5e7eb] rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
            <h2 className="text-[13px] font-medium text-[#111827]">团队负载看板</h2>
            <span className="text-[11px] text-[#6b7280]">
              共 {teamMembers.length} 名成员
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="flex flex-col gap-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  onDragOver={(e) => handleDragOver(e, member.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, member.id)}
                >
                  <MemberCard 
                    member={member} 
                    onAssign={handleQuickAssign}
                    isDropTarget={dropTargetId === member.id}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="px-3 py-2 border-t border-[#e5e7eb] bg-[#f9fafb]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#6b7280]">团队总负载</span>
              <span className="font-mono text-[#111827]">
                {teamMembers.reduce((sum, m) => sum + m.currentLoad, 0)} / {teamMembers.reduce((sum, m) => sum + m.capacity, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
