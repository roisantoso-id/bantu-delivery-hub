'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  ChevronRight,
  Check,
  Clock,
  Circle,
  Upload,
  Send,
  Paperclip,
  MessageSquare,
  FileText,
  User,
  Building2,
  Briefcase,
  ShieldCheck
} from 'lucide-react'
import Link from 'next/link'

export default function CollaborativeWorkbenchPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState(2)
  const [currentNote, setCurrentNote] = useState('')
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Current user
  const currentUserId = 'u2'
  const currentUserName = '王芳'

  // Opportunity data
  const opportunity = {
    id: 'OPP-2026-001',
    customerName: '华夏科技集团有限公司',
    totalServices: 3,
  }

  // Services under this opportunity
  const services = [
    { 
      id: 1, 
      name: '印尼签证申请', 
      executorId: 'u1',
      executorName: '李明',
      progress: 100,
      status: 'completed' as const,
      isMine: false,
    },
    { 
      id: 2, 
      name: '公司注册', 
      executorId: 'u2',
      executorName: '王芳',
      progress: 66,
      status: 'in_progress' as const,
      isMine: true,
    },
    { 
      id: 3, 
      name: '银行开户', 
      executorId: 'u3',
      executorName: '张伟',
      progress: 0,
      status: 'pending' as const,
      isMine: false,
    },
  ]

  // Steps for my service
  const myServiceSteps = [
    { 
      id: 1, 
      code: 'S01',
      name: '材料收集', 
      status: 'completed' as const, 
      completedAt: '2026-03-18 10:30',
      completedBy: '王芳',
    },
    { 
      id: 2, 
      code: 'S02',
      name: '文件公证', 
      status: 'completed' as const, 
      completedAt: '2026-03-20 14:00',
      completedBy: '王芳',
    },
    { 
      id: 3, 
      code: 'S03',
      name: '工商递交', 
      status: 'in_progress' as const, 
      completedAt: null,
      completedBy: null,
    },
    { 
      id: 4, 
      code: 'S04',
      name: '执照领取', 
      status: 'pending' as const, 
      completedAt: null,
      completedBy: null,
    },
  ]

  // Internal discussion messages
  const discussions = [
    { 
      id: 1, 
      sender: '李明', 
      role: 'sales' as const,
      roleLabel: '销售',
      message: '签证已经下来了，客户可以准备入境材料了', 
      time: '2026-03-20 09:30',
    },
    { 
      id: 2, 
      sender: '陈主管', 
      role: 'supervisor' as const,
      roleLabel: '主管',
      message: '收到，注意跟进公司注册进度', 
      time: '2026-03-20 09:45',
    },
    { 
      id: 3, 
      sender: '王芳', 
      role: 'executor' as const,
      roleLabel: '交付',
      message: '公证已完成，今天下午去工商递交', 
      time: '2026-03-20 14:20',
    },
    { 
      id: 4, 
      sender: 'PT. JASA', 
      role: 'supplier' as const,
      roleLabel: '供应商',
      message: '代办费用已到账，材料已收到', 
      time: '2026-03-20 15:00',
    },
    { 
      id: 5, 
      sender: '张伟', 
      role: 'executor' as const,
      roleLabel: '交付',
      message: '等公司注册完成后我这边启动银行开户', 
      time: '2026-03-20 16:10',
    },
  ]

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'sales':
        return 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
      case 'supervisor':
        return 'bg-[#fce7f3] text-[#9d174d] border-[#fbcfe8]'
      case 'executor':
        return 'bg-[#dbeafe] text-[#1e40af] border-[#bfdbfe]'
      case 'supplier':
        return 'bg-[#f3e8ff] text-[#6b21a8] border-[#e9d5ff]'
      default:
        return 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'sales':
        return <Briefcase className="h-2.5 w-2.5" />
      case 'supervisor':
        return <ShieldCheck className="h-2.5 w-2.5" />
      case 'executor':
        return <User className="h-2.5 w-2.5" />
      case 'supplier':
        return <Building2 className="h-2.5 w-2.5" />
      default:
        return <User className="h-2.5 w-2.5" />
    }
  }

  const selectedService = services.find(s => s.id === selectedServiceId)

  if (!mounted) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
        <div className="w-16 bg-[#f3f4f6] border-r border-[#e5e7eb]" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[12px] text-[#9ca3af]">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        {/* Breadcrumb Header - 36px */}
        <header className="h-9 flex-shrink-0 border-b border-[#e5e7eb] bg-white flex items-center px-3">
          <nav className="flex items-center text-[11px]">
            <Link href="/dispatch" className="text-[#6b7280] hover:text-[#2563eb]">
              交付中心
            </Link>
            <ChevronRight className="h-3 w-3 mx-1 text-[#d1d5db]" />
            <span className="text-[#6b7280]">详情</span>
            <ChevronRight className="h-3 w-3 mx-1 text-[#d1d5db]" />
            <span className="font-mono text-[#2563eb] font-medium">{opportunity.id}</span>
          </nav>
          
          <div className="ml-4 flex items-center gap-2">
            <span className="text-[12px] text-[#374151] font-medium">{opportunity.customerName}</span>
            <span className="text-[10px] text-[#9ca3af]">|</span>
            <span className="text-[10px] text-[#6b7280]">共 {opportunity.totalServices} 项服务</span>
          </div>
        </header>

        {/* Main 3-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Task Tree */}
          <div className="w-[200px] flex-shrink-0 border-r border-[#e5e7eb] bg-white flex flex-col">
            <div className="px-2.5 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
              <h3 className="text-[11px] font-medium text-[#374151]">服务任务树</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {services.map((service, index) => (
                <div 
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`relative px-2.5 py-2 border-b border-[#e5e7eb] cursor-pointer transition-colors ${
                    selectedServiceId === service.id 
                      ? 'bg-[#eff6ff]' 
                      : 'hover:bg-[#f9fafb]'
                  }`}
                >
                  {/* Left highlight bar for my tasks */}
                  {service.isMine && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2563eb]" />
                  )}
                  
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-[10px] text-[#9ca3af] mt-0.5">{String(index + 1).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] truncate ${
                        service.isMine ? 'font-medium text-[#2563eb]' : 'text-[#374151]'
                      }`}>
                        {service.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] text-[#9ca3af]">{service.executorName}</span>
                        <span className="text-[#e5e7eb]">|</span>
                        <span className={`font-mono text-[9px] ${
                          service.progress === 100 
                            ? 'text-[#15803d]' 
                            : service.progress > 0 
                            ? 'text-[#2563eb]' 
                            : 'text-[#9ca3af]'
                        }`}>
                          {service.progress}%
                        </span>
                      </div>
                      {/* Mini progress bar */}
                      <div className="w-full h-0.5 bg-[#e5e7eb] mt-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            service.progress === 100 
                              ? 'bg-[#15803d]' 
                              : service.progress > 0 
                              ? 'bg-[#2563eb]' 
                              : 'bg-transparent'
                          }`} 
                          style={{ width: `${service.progress}%` }} 
                        />
                      </div>
                    </div>
                    {/* Status indicator */}
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      service.status === 'completed' 
                        ? 'bg-[#15803d]' 
                        : service.status === 'in_progress'
                        ? 'bg-[#2563eb]'
                        : 'bg-[#d1d5db]'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="px-2.5 py-2 border-t border-[#e5e7eb] bg-[#f9fafb]">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-[3px] h-3 bg-[#2563eb] rounded-sm" />
                  <span className="text-[9px] text-[#9ca3af]">我负责</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Dynamic Execution Area */}
          <div className="flex-1 bg-[#f9fafb] p-3 overflow-y-auto">
            {selectedService?.isMine ? (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-[12px] font-medium text-[#374151]">{selectedService.name}</h3>
                    <p className="text-[10px] text-[#9ca3af]">执行进度追踪</p>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border ${
                    selectedService.status === 'completed' 
                      ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]' 
                      : selectedService.status === 'in_progress'
                      ? 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]'
                      : 'bg-[#f9fafb] text-[#6b7280] border-[#e5e7eb]'
                  }`}>
                    {selectedService.status === 'completed' ? '已完成' : selectedService.status === 'in_progress' ? '进行中' : '待启动'}
                  </span>
                </div>

                <div className="relative">
                  {myServiceSteps.map((step, index) => (
                    <div key={step.id} className="flex gap-3 pb-3 last:pb-0">
                      {/* Timeline node */}
                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 border ${
                          step.status === 'completed' 
                            ? 'bg-[#15803d] border-[#15803d]' 
                            : step.status === 'in_progress'
                            ? 'bg-white border-[#2563eb]'
                            : 'bg-white border-[#d1d5db]'
                        }`}>
                          {step.status === 'completed' ? (
                            <Check className="h-3 w-3 text-white" />
                          ) : step.status === 'in_progress' ? (
                            <Clock className="h-2.5 w-2.5 text-[#2563eb]" />
                          ) : (
                            <Circle className="h-2 w-2 text-[#d1d5db]" />
                          )}
                        </div>
                        {index < myServiceSteps.length - 1 && (
                          <div className={`w-px flex-1 mt-1 ${
                            step.status === 'completed' ? 'bg-[#15803d]' : 'bg-[#e5e7eb]'
                          }`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 border rounded-sm bg-white ${
                        step.status === 'in_progress' ? 'border-[#2563eb]' : 'border-[#e5e7eb]'
                      }`}>
                        <div className="px-2 py-1.5 border-b border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-[#9ca3af]">{step.code}</span>
                            <span className="text-[11px] font-medium text-[#374151]">{step.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="p-1 hover:bg-[#e5e7eb] rounded-sm transition-colors" title="上传凭证">
                              <Paperclip className="h-3 w-3 text-[#6b7280]" />
                            </button>
                            <button className="p-1 hover:bg-[#e5e7eb] rounded-sm transition-colors" title="内部留言">
                              <MessageSquare className="h-3 w-3 text-[#6b7280]" />
                            </button>
                          </div>
                        </div>

                        <div className="px-2 py-1.5">
                          {step.status === 'completed' && (
                            <p className="text-[10px] text-[#9ca3af]">
                              由 <span className="text-[#6b7280]">{step.completedBy}</span> 于 <span className="font-mono text-[#6b7280]">{step.completedAt}</span> 标记完成
                            </p>
                          )}

                          {step.status === 'in_progress' && (
                            <div className="space-y-1.5">
                              <Textarea 
                                placeholder="添加执行备注..."
                                value={currentNote}
                                onChange={(e) => setCurrentNote(e.target.value)}
                                className="min-h-[40px] text-[11px] border-[#e5e7eb] rounded-sm resize-none shadow-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                              />
                              <div className="flex gap-1.5">
                                <button className="flex items-center justify-center gap-1 flex-1 h-6 text-[10px] text-[#6b7280] border border-dashed border-[#d1d5db] rounded-sm hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-[#eff6ff] transition-colors">
                                  <Upload className="h-2.5 w-2.5" />
                                  <span>上传凭证</span>
                                </button>
                                <Button size="sm" className="flex-1 h-6 text-[10px] rounded-sm bg-[#2563eb] hover:bg-[#1d4ed8]">
                                  <Check className="h-2.5 w-2.5 mr-0.5" />
                                  <span>标记完成</span>
                                </Button>
                              </div>
                            </div>
                          )}

                          {step.status === 'pending' && (
                            <p className="text-[10px] text-[#9ca3af]">等待前置步骤完成</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="text-center">
                  <User className="h-8 w-8 text-[#d1d5db] mx-auto mb-2" />
                  <p className="text-[12px] text-[#6b7280]">{selectedService?.name}</p>
                  <p className="text-[11px] text-[#9ca3af] mt-1">由 {selectedService?.executorName} 负责执行</p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border ${
                      selectedService?.status === 'completed' 
                        ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]' 
                        : selectedService?.status === 'in_progress'
                        ? 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]'
                        : 'bg-[#f9fafb] text-[#6b7280] border-[#e5e7eb]'
                    }`}>
                      {selectedService?.status === 'completed' ? '已完成' : selectedService?.status === 'in_progress' ? '进行中' : '待启动'}
                    </span>
                    <span className="font-mono text-[11px] text-[#6b7280]">{selectedService?.progress}%</span>
                  </div>
                  <p className="text-[10px] text-[#9ca3af] mt-4">无权查看详细执行步骤</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Collaboration Sidebar */}
          <div className="w-[260px] flex-shrink-0 border-l border-[#e5e7eb] bg-white flex flex-col">
            <div className="px-2.5 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
              <h3 className="text-[11px] font-medium text-[#374151]">内部讨论区</h3>
              <p className="text-[9px] text-[#9ca3af]">销售 / 主管 / 交付 / 供应商</p>
            </div>
            
            <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-2">
              {discussions.map((msg) => (
                <div key={msg.id} className="group">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`flex items-center gap-0.5 text-[9px] px-1 py-0.5 rounded-sm border ${getRoleStyle(msg.role)}`}>
                      {getRoleIcon(msg.role)}
                      {msg.roleLabel}
                    </span>
                    <span className="text-[10px] text-[#374151] font-medium">{msg.sender}</span>
                    <span className="font-mono text-[9px] text-[#d1d5db] ml-auto">{msg.time}</span>
                  </div>
                  <div className="ml-0 pl-2 border-l-2 border-[#e5e7eb]">
                    <p className="text-[11px] text-[#374151]">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-2.5 py-2 border-t border-[#e5e7eb] bg-[#f9fafb]">
              <div className="flex items-center gap-1 mb-1.5">
                <span className="flex items-center gap-0.5 text-[9px] px-1 py-0.5 rounded-sm border bg-[#dbeafe] text-[#1e40af] border-[#bfdbfe]">
                  <User className="h-2.5 w-2.5" />
                  交付
                </span>
                <span className="text-[10px] text-[#374151]">{currentUserName}</span>
              </div>
              <div className="flex gap-1.5">
                <input 
                  type="text"
                  placeholder="输入消息..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 h-7 px-2 text-[11px] border border-[#e5e7eb] rounded-sm bg-white focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                />
                <Button size="sm" className="h-7 w-7 p-0 rounded-sm bg-[#2563eb] hover:bg-[#1d4ed8]">
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
