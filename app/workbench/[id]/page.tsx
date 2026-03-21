'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
  Send
} from 'lucide-react'
import Link from 'next/link'

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
    note: '已提交至政府系统'
  },
  { 
    id: 2, 
    name: '政府审核', 
    status: 'in_progress' as const, 
    completedAt: null,
    note: ''
  },
  { 
    id: 3, 
    name: '结果下发', 
    status: 'pending' as const, 
    completedAt: null,
    note: ''
  },
]

const chatHistory = [
  { id: 1, sender: '销售-李明', message: '客户催促进度，请尽快处理', time: '03-20 09:30', isMe: false },
  { id: 2, sender: '交付-王芳', message: '已提交，预计3个工作日出结果', time: '03-20 10:15', isMe: true },
  { id: 3, sender: '销售-李明', message: '收到，已告知客户', time: '03-20 10:20', isMe: false },
]

export default function WorkbenchDetailPage() {
  const [currentNote, setCurrentNote] = useState('')
  const [deliveryNote, setDeliveryNote] = useState('客户配合度高，材料齐全。')
  const [newMessage, setNewMessage] = useState('')

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar isSupervisor={false} />

      <div className="flex flex-1 flex-col min-w-0">
        <header className="h-12 flex-shrink-0 border-b border-[#e5e7eb] bg-white flex items-center px-4 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] text-[#2563eb] font-medium">{caseData.id}</span>
              <span className="text-[#9ca3af]">|</span>
              <span className="text-[13px] text-[#374151]">{caseData.customerName}</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-sm px-3 py-1">
              <span className="text-[11px] text-[#6b7280]">当前节点:</span>
              <span className="text-[12px] text-[#374151] font-medium">{caseData.currentStepName}</span>
              <div className="w-24 h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2563eb] rounded-full"
                  style={{ width: `${(caseData.currentStep / caseData.totalSteps) * 100}%` }}
                />
              </div>
              <span className="font-mono text-[11px] text-[#6b7280]">({caseData.currentStep}/{caseData.totalSteps})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3 text-[12px] rounded-sm border-[#e5e7eb] text-[#dc2626] hover:bg-red-50 hover:border-[#dc2626]"
            >
              <TriangleAlert className="h-3.5 w-3.5 mr-1.5" />
              {"标记异常"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3 text-[12px] rounded-sm border-[#e5e7eb]"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {"保存备注"}
            </Button>
            <Button 
              size="sm" 
              className="h-8 px-3 text-[12px] rounded-sm bg-[#2563eb] hover:bg-[#1d4ed8]"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              {"完成结案"}
            </Button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-[300px] flex-shrink-0 border-r border-[#e5e7eb] bg-white flex flex-col overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[#e5e7eb]">
              <h3 className="text-[13px] font-medium text-[#374151]">{"办件原始材料"}</h3>
              <p className="text-[11px] text-[#9ca3af] mt-0.5">{"来自 P6 系统"}</p>
            </div>
            <div className="flex-1 overflow-auto">
              <ul className="divide-y divide-[#e5e7eb]">
                {materials.map((item) => (
                  <li key={item.id} className="flex items-center px-3 py-2 hover:bg-[#f9fafb]">
                    <FileText className="h-4 w-4 text-[#9ca3af] flex-shrink-0" />
                    <span className="ml-2 flex-1 text-[12px] text-[#374151] truncate">{item.name}</span>
                    <span 
                      className={`text-[10px] px-1.5 py-0.5 rounded-sm border mr-2 ${
                        item.status === 'approved' 
                          ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]' 
                          : 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]'
                      }`}
                    >
                      {item.status === 'approved' ? '已通过' : '待补件'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-[#e5e7eb] rounded-sm">
                        <Eye className="h-3.5 w-3.5 text-[#6b7280]" />
                      </button>
                      <button className="p-1 hover:bg-[#e5e7eb] rounded-sm">
                        <Download className="h-3.5 w-3.5 text-[#6b7280]" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex-1 bg-[#f9fafb] p-4 overflow-auto">
            <div className="mb-4">
              <h3 className="text-[13px] font-medium text-[#374151]">{"交付里程碑执行"}</h3>
              <p className="text-[11px] text-[#9ca3af] mt-0.5">Progress Points</p>
            </div>

            <div className="relative">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                        milestone.status === 'completed' 
                          ? 'bg-[#22c55e] border-[#22c55e]' 
                          : milestone.status === 'in_progress'
                          ? 'bg-white border-[#2563eb]'
                          : 'bg-white border-[#d1d5db]'
                      }`}
                    >
                      {milestone.status === 'completed' ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : milestone.status === 'in_progress' ? (
                        <Clock className="h-3.5 w-3.5 text-[#2563eb]" />
                      ) : (
                        <Circle className="h-3 w-3 text-[#d1d5db]" />
                      )}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-2 ${
                        milestone.status === 'completed' ? 'bg-[#22c55e]' : 'bg-[#e5e7eb]'
                      }`} />
                    )}
                  </div>

                  <div className={`flex-1 border rounded-sm bg-white ${
                    milestone.status === 'in_progress' ? 'border-[#2563eb]' : 'border-[#e5e7eb]'
                  }`}>
                    <div className="px-3 py-2 border-b border-[#e5e7eb]">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#374151]">{milestone.name}</span>
                        <span 
                          className={`text-[10px] px-1.5 py-0.5 rounded-sm border ${
                            milestone.status === 'completed' 
                              ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]' 
                              : milestone.status === 'in_progress'
                              ? 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]'
                              : 'bg-[#f9fafb] text-[#6b7280] border-[#e5e7eb]'
                          }`}
                        >
                          {milestone.status === 'completed' ? '已完成' : milestone.status === 'in_progress' ? '进行中' : '待处理'}
                        </span>
                      </div>
                      {milestone.completedAt && (
                        <p className="font-mono text-[11px] text-[#9ca3af] mt-1">{"完成于"} {milestone.completedAt}</p>
                      )}
                    </div>

                    <div className="px-3 py-2.5">
                      {milestone.status === 'completed' && milestone.note && (
                        <p className="text-[12px] text-[#6b7280]">{milestone.note}</p>
                      )}
                      {milestone.status === 'in_progress' && (
                        <div className="space-y-2.5">
                          <Textarea 
                            placeholder="添加操作记录备注..."
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            className="min-h-[60px] text-[12px] border-[#e5e7eb] rounded-sm resize-none shadow-none focus-visible:ring-1 focus-visible:ring-[#2563eb]"
                          />
                          <Button 
                            size="sm" 
                            className="h-8 px-4 text-[12px] rounded-sm bg-[#2563eb] hover:bg-[#1d4ed8] w-full"
                          >
                            <Check className="h-3.5 w-3.5 mr-1.5" />
                            {"标记完成"}
                          </Button>
                        </div>
                      )}
                      {milestone.status === 'pending' && (
                        <p className="text-[11px] text-[#9ca3af]">{"等待上一节点完成"}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[320px] flex-shrink-0 border-l border-[#e5e7eb] bg-white flex flex-col overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[#e5e7eb]">
              <h4 className="text-[12px] font-medium text-[#374151]">{"最终凭证上传"}</h4>
            </div>
            <div className="px-3 py-3 border-b border-[#e5e7eb]">
              <div className="h-28 border-2 border-dashed border-[#d1d5db] rounded-sm flex flex-col items-center justify-center bg-[#f9fafb] hover:border-[#2563eb] hover:bg-[#eff6ff] cursor-pointer transition-colors">
                <Upload className="h-6 w-6 text-[#9ca3af] mb-1.5" />
                <p className="text-[11px] text-[#6b7280]">{"拖拽或点击上传最终交付文件"}</p>
                <p className="text-[10px] text-[#9ca3af] mt-0.5">PDF, JPG, PNG ({"最大"} 10MB)</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-3 py-2 border-b border-[#e5e7eb]">
                <h4 className="text-[12px] font-medium text-[#374151]">{"交付互动记录"}</h4>
              </div>
              <div className="flex-1 overflow-auto px-3 py-2 space-y-2">
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] text-[#9ca3af]">{msg.sender}</span>
                      <span className="font-mono text-[9px] text-[#d1d5db]">{msg.time}</span>
                    </div>
                    <div 
                      className={`max-w-[85%] px-2.5 py-1.5 rounded-sm text-[12px] ${
                        msg.isMe 
                          ? 'bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]' 
                          : 'bg-[#f9fafb] text-[#374151] border border-[#e5e7eb]'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2 border-t border-[#e5e7eb]">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="输入消息..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 h-8 px-2.5 text-[12px] border border-[#e5e7eb] rounded-sm bg-white focus:outline-none focus:border-[#2563eb]"
                  />
                  <Button size="sm" className="h-8 w-8 p-0 rounded-sm bg-[#2563eb] hover:bg-[#1d4ed8]">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-[#e5e7eb]">
              <div className="px-3 py-2 border-b border-[#e5e7eb]">
                <h4 className="text-[12px] font-medium text-[#374151]">{"交付备注"}</h4>
                <p className="text-[10px] text-[#9ca3af]">{"自动保存"}</p>
              </div>
              <div className="px-3 py-2">
                <Textarea 
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="添加交付备注..."
                  className="min-h-[72px] text-[12px] border-[#e5e7eb] rounded-sm resize-none shadow-none focus-visible:ring-1 focus-visible:ring-[#2563eb]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
