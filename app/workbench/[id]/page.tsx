'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  ArrowLeft, 
  TriangleAlert, 
  Save, 
  CheckCircle2, 
  FileText, 
  Download, 
  Eye,
  Check,
  Clock,
  Circle,
  Upload,
  Send,
  Paperclip
} from 'lucide-react'
import Link from 'next/link'

export default function WorkbenchDetailPage() {
  const [mounted, setMounted] = useState(false)
  const [currentNote, setCurrentNote] = useState('')
  const [deliveryNote, setDeliveryNote] = useState('客户配合度高，材料齐全')
  const [newMessage, setNewMessage] = useState('')
  const [checkedMaterials, setCheckedMaterials] = useState<number[]>([1, 2, 4])

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMaterial = (id: number) => {
    setCheckedMaterials(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Mock data
  const caseData = {
    id: 'OPP-260315-0001',
    customerName: '张三科技有限公司',
    currentStep: 2,
    totalSteps: 3,
    currentStepName: '政府审核',
  }

  const materials = [
    { id: 1, name: '护照扫描件.pdf', status: 'approved' as const },
    { id: 2, name: '公司章程.pdf', status: 'approved' as const },
    { id: 3, name: '申请表格.pdf', status: 'pending' as const },
    { id: 4, name: '营业执照副本.pdf', status: 'approved' as const },
    { id: 5, name: '法人身份证.pdf', status: 'pending' as const },
  ]

  const milestones = [
    { 
      id: 1, 
      name: '提交申请', 
      status: 'completed' as const, 
      completedAt: '2024-03-21 14:00',
      completedBy: '王芳',
      note: '已提交至政府系统',
      attachments: [
        { id: 'a1', name: '提交回执.png' },
        { id: 'a2', name: '确认单.pdf' },
      ]
    },
    { 
      id: 2, 
      name: '政府审核', 
      status: 'in_progress' as const, 
      completedAt: null,
      completedBy: null,
      note: '',
      attachments: []
    },
    { 
      id: 3, 
      name: '结果下发', 
      status: 'pending' as const, 
      completedAt: null,
      completedBy: null,
      note: '',
      attachments: []
    },
  ]

  const chatHistory = [
    { id: 1, sender: '销售-李明', message: '客户催促进度', time: '03-20 09:30', isMe: false },
    { id: 2, sender: '交付-王芳', message: '已提交，预计3工作日', time: '03-20 10:15', isMe: true },
    { id: 3, sender: '销售-李明', message: '收到，已告知客户', time: '03-20 10:20', isMe: false },
  ]

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
        {/* Header - 48px */}
        <header className="h-12 flex-shrink-0 border-b border-[#e5e7eb] bg-white flex items-center px-3 gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-sm hover:bg-[#f3f4f6]">
              <ArrowLeft className="h-4 w-4 text-[#6b7280]" />
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] text-[#2563eb] font-medium">{caseData.id}</span>
            <span className="text-[#d1d5db]">|</span>
            <span className="text-[12px] text-[#374151]">{caseData.customerName}</span>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-sm px-2.5 py-1">
              <span className="text-[10px] text-[#6b7280]">当前节点</span>
              <span className="text-[11px] text-[#374151] font-medium">{caseData.currentStepName}</span>
              <div className="w-16 h-1 bg-[#e5e7eb] rounded-full overflow-hidden">
                <div className="h-full bg-[#2563eb]" style={{ width: `${(caseData.currentStep / caseData.totalSteps) * 100}%` }} />
              </div>
              <span className="font-mono text-[10px] text-[#6b7280]">{caseData.currentStep}/{caseData.totalSteps}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] rounded-sm text-[#b91c1c] hover:bg-[#fef2f2]">
              <TriangleAlert className="h-3 w-3 mr-1" />
              <span>标记异常</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] rounded-sm text-[#6b7280] hover:bg-[#f3f4f6]">
              <Save className="h-3 w-3 mr-1" />
              <span>保存备注</span>
            </Button>
            <Button size="sm" className="h-7 px-2.5 text-[11px] rounded-sm bg-[#2563eb] hover:bg-[#1d4ed8]">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              <span>完成结案</span>
            </Button>
          </div>
        </header>

        {/* Main 3-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Materials checklist */}
          <div className="w-[240px] flex-shrink-0 border-r border-[#e5e7eb] bg-white flex flex-col">
            <div className="px-2.5 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
              <h3 className="text-[12px] font-medium text-[#374151]">资料审查</h3>
              <p className="text-[10px] text-[#9ca3af]">来源: P6系统</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {materials.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-2 px-2.5 py-1.5 border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors"
                >
                  <Checkbox 
                    id={`mat-${item.id}`}
                    checked={checkedMaterials.includes(item.id)}
                    onCheckedChange={() => toggleMaterial(item.id)}
                    className="h-3.5 w-3.5 rounded-sm border-[#d1d5db] data-[state=checked]:bg-[#2563eb] data-[state=checked]:border-[#2563eb]"
                  />
                  <FileText className="h-3.5 w-3.5 text-[#9ca3af] flex-shrink-0" />
                  <span className="flex-1 text-[11px] text-[#374151] truncate">{item.name}</span>
                  <span className={`text-[9px] px-1 py-0.5 rounded-sm border ${
                    item.status === 'approved' 
                      ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]' 
                      : 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]'
                  }`}>
                    {item.status === 'approved' ? '通过' : '待补'}
                  </span>
                  <button className="p-0.5 hover:bg-[#e5e7eb] rounded-sm">
                    <Eye className="h-3 w-3 text-[#9ca3af]" />
                  </button>
                  <button className="p-0.5 hover:bg-[#e5e7eb] rounded-sm">
                    <Download className="h-3 w-3 text-[#9ca3af]" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Middle: Execution timeline */}
          <div className="flex-1 bg-[#f9fafb] p-3 overflow-y-auto">
            <div className="mb-3">
              <h3 className="text-[12px] font-medium text-[#374151]">执行进度</h3>
            </div>

            <div className="relative">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex gap-3 pb-4 last:pb-0">
                  {/* Timeline node */}
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                      milestone.status === 'completed' 
                        ? 'bg-[#15803d] border-[#15803d]' 
                        : milestone.status === 'in_progress'
                        ? 'bg-white border-[#2563eb]'
                        : 'bg-white border-[#d1d5db]'
                    }`}>
                      {milestone.status === 'completed' ? (
                        <Check className="h-3 w-3 text-white" />
                      ) : milestone.status === 'in_progress' ? (
                        <Clock className="h-3 w-3 text-[#2563eb]" />
                      ) : (
                        <Circle className="h-2 w-2 text-[#d1d5db]" />
                      )}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-1.5 ${
                        milestone.status === 'completed' ? 'bg-[#15803d]' : 'bg-[#e5e7eb]'
                      }`} />
                    )}
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 border rounded-sm bg-white ${
                    milestone.status === 'in_progress' ? 'border-[#2563eb]' : 'border-[#e5e7eb]'
                  }`}>
                    <div className="px-2.5 py-1.5 border-b border-[#e5e7eb] bg-[#f9fafb]">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-[#374151]">{milestone.name}</span>
                        <span className={`text-[9px] px-1 py-0.5 rounded-sm border ${
                          milestone.status === 'completed' 
                            ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]' 
                            : milestone.status === 'in_progress'
                            ? 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]'
                            : 'bg-[#f9fafb] text-[#6b7280] border-[#e5e7eb]'
                        }`}>
                          {milestone.status === 'completed' ? '已完成' : milestone.status === 'in_progress' ? '进行中' : '待处理'}
                        </span>
                      </div>
                    </div>

                    <div className="px-2.5 py-2">
                      {milestone.status === 'completed' && (
                        <div className="space-y-1.5">
                          {milestone.note && (
                            <p className="text-[11px] text-[#6b7280]">{milestone.note}</p>
                          )}
                          {/* Operation log preview */}
                          <p className="text-[10px] text-[#9ca3af]">
                            由 <span className="text-[#6b7280]">{milestone.completedBy}</span> 标记于 <span className="font-mono text-[#6b7280]">{milestone.completedAt}</span>
                          </p>
                          {/* Attachments */}
                          {milestone.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {milestone.attachments.map((att) => (
                                <span key={att.id} className="flex items-center gap-0.5 px-1 py-0.5 text-[9px] bg-[#f3f4f6] text-[#6b7280] rounded-sm border border-[#e5e7eb]">
                                  <FileText className="h-2.5 w-2.5" />
                                  {att.name}
                                </span>
                              ))}
                            </div>
                          )}
                          <button className="flex items-center gap-1 h-5 px-1.5 text-[9px] text-[#6b7280] border border-dashed border-[#d1d5db] rounded-sm hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-[#eff6ff] transition-colors">
                            <Paperclip className="h-2.5 w-2.5" />
                            <span>上传凭证</span>
                          </button>
                        </div>
                      )}

                      {milestone.status === 'in_progress' && (
                        <div className="space-y-2">
                          <Textarea 
                            placeholder="添加备注..."
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            className="min-h-[50px] text-[11px] border-[#e5e7eb] rounded-sm resize-none shadow-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                          />
                          <button className="flex items-center justify-center gap-1 h-5 w-full text-[9px] text-[#6b7280] border border-dashed border-[#d1d5db] rounded-sm hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-[#eff6ff] transition-colors">
                            <Paperclip className="h-2.5 w-2.5" />
                            <span>上传凭证</span>
                          </button>
                          <Button size="sm" className="h-6 w-full text-[10px] rounded-sm bg-[#2563eb] hover:bg-[#1d4ed8]">
                            <Check className="h-3 w-3 mr-1" />
                            <span>标记完成</span>
                          </Button>
                        </div>
                      )}

                      {milestone.status === 'pending' && (
                        <p className="text-[10px] text-[#9ca3af]">等待上一步</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Output & Chat */}
          <div className="w-[280px] flex-shrink-0 border-l border-[#e5e7eb] bg-white flex flex-col">
            {/* Upload area */}
            <div className="px-2.5 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
              <h4 className="text-[11px] font-medium text-[#374151]">交付产出</h4>
            </div>
            <div className="px-2.5 py-2.5 border-b border-[#e5e7eb]">
              <div className="h-20 border border-dashed border-[#d1d5db] rounded-sm flex flex-col items-center justify-center bg-[#f9fafb] hover:border-[#2563eb] hover:bg-[#eff6ff] cursor-pointer transition-colors">
                <Upload className="h-5 w-5 text-[#9ca3af] mb-1" />
                <p className="text-[10px] text-[#6b7280]">拖拽或点击上传</p>
                <p className="text-[9px] text-[#9ca3af]">PDF, JPG, PNG (最大 10MB)</p>
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-2.5 py-1.5 border-b border-[#e5e7eb] bg-[#f9fafb]">
                <h4 className="text-[11px] font-medium text-[#374151]">互动记录</h4>
              </div>
              <div className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1.5">
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[9px] text-[#9ca3af]">{msg.sender}</span>
                      <span className="font-mono text-[8px] text-[#d1d5db]">{msg.time}</span>
                    </div>
                    <div className={`max-w-[85%] px-2 py-1 rounded-sm text-[11px] ${
                      msg.isMe 
                        ? 'bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]' 
                        : 'bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb]'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-2.5 py-2 border-t border-[#e5e7eb]">
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

            {/* Notes */}
            <div className="border-t border-[#e5e7eb]">
              <div className="px-2.5 py-1.5 border-b border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-between">
                <h4 className="text-[11px] font-medium text-[#374151]">交付备注</h4>
                <span className="text-[9px] text-[#9ca3af]">自动保存</span>
              </div>
              <div className="p-2.5">
                <Textarea
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="添加备注..."
                  className="min-h-[60px] text-[11px] border-[#e5e7eb] rounded-sm resize-none shadow-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
