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
  Send,
  Paperclip,
  ImageIcon,
  X
} from 'lucide-react'
import Link from 'next/link'

// Labels - extracted to avoid hydration mismatch
const LABELS = {
  markException: '\u6807\u8BB0\u5F02\u5E38',
  saveNotes: '\u4FDD\u5B58\u5907\u6CE8',
  completeCase: '\u5B8C\u6210\u7ED3\u6848',
  currentNode: '\u5F53\u524D\u8282\u70B9:',
  originalMaterials: '\u529E\u4EF6\u539F\u59CB\u6750\u6599',
  fromP6: '\u6765\u81EA P6 \u7CFB\u7EDF',
  approved: '\u5DF2\u901A\u8FC7',
  pendingSupply: '\u5F85\u8865\u4EF6',
  deliveryMilestones: '\u4EA4\u4ED8\u91CC\u7A0B\u7891\u6267\u884C',
  completed: '\u5DF2\u5B8C\u6210',
  inProgress: '\u8FDB\u884C\u4E2D',
  pending: '\u5F85\u5904\u7406',
  completedAt: '\u5B8C\u6210\u4E8E',
  stageEvidence: '\u9636\u6BB5\u6027\u51ED\u8BC1',
  uploadEvidence: '\u4E0A\u4F20\u9636\u6BB5\u6027\u51ED\u8BC1',
  waitingPrevious: '\u7B49\u5F85\u4E0A\u4E00\u8282\u70B9\u5B8C\u6210',
  markComplete: '\u6807\u8BB0\u5B8C\u6210',
  finalUpload: '\u6700\u7EC8\u51ED\u8BC1\u4E0A\u4F20',
  dragOrClick: '\u62D6\u62FD\u6216\u70B9\u51FB\u4E0A\u4F20\u6700\u7EC8\u4EA4\u4ED8\u6587\u4EF6',
  maxSize: '\u6700\u5927',
  interactionLog: '\u4EA4\u4ED8\u4E92\u52A8\u8BB0\u5F55',
  deliveryNotes: '\u4EA4\u4ED8\u5907\u6CE8',
  autoSave: '\u81EA\u52A8\u4FDD\u5B58',
  inputMessage: '\u8F93\u5165\u6D88\u606F...',
  addNotes: '\u6DFB\u52A0\u64CD\u4F5C\u8BB0\u5F55\u5907\u6CE8...',
  addDeliveryNotes: '\u6DFB\u52A0\u4EA4\u4ED8\u5907\u6CE8...',
}

// Mock data
const caseData = {
  id: 'OPP-260315-0001',
  customerName: '\u5F20\u4E09\u79D1\u6280\u6709\u9650\u516C\u53F8',
  currentStep: 2,
  totalSteps: 3,
  currentStepName: '\u653F\u5E9C\u5BA1\u6838',
}

const materials = [
  { id: 1, name: '\u62A4\u7167\u626B\u63CF\u4EF6.pdf', status: 'approved' as const },
  { id: 2, name: '\u516C\u53F8\u7AE0\u7A0B.pdf', status: 'approved' as const },
  { id: 3, name: '\u7533\u8BF7\u8868\u683C.pdf', status: 'pending' as const },
  { id: 4, name: '\u8425\u4E1A\u6267\u7167\u526F\u672C.pdf', status: 'approved' as const },
  { id: 5, name: '\u6CD5\u4EBA\u8EAB\u4EFD\u8BC1.pdf', status: 'pending' as const },
]

const milestones = [
  { 
    id: 1, 
    name: '\u63D0\u4EA4\u7533\u8BF7', 
    status: 'completed' as const, 
    completedAt: '2024-03-21 14:00',
    note: '\u5DF2\u63D0\u4EA4\u81F3\u653F\u5E9C\u7CFB\u7EDF',
    attachments: [
      { id: 'a1', name: '\u63D0\u4EA4\u56DE\u6267\u622A\u56FE.png', type: 'image' as const },
      { id: 'a2', name: '\u7CFB\u7EDF\u786E\u8BA4\u5355.pdf', type: 'file' as const },
    ]
  },
  { 
    id: 2, 
    name: '\u653F\u5E9C\u5BA1\u6838', 
    status: 'in_progress' as const, 
    completedAt: null,
    note: '',
    attachments: []
  },
  { 
    id: 3, 
    name: '\u7ED3\u679C\u4E0B\u53D1', 
    status: 'pending' as const, 
    completedAt: null,
    note: '',
    attachments: []
  },
]

const chatHistory = [
  { id: 1, sender: '\u9500\u552E-\u674E\u660E', message: '\u5BA2\u6237\u50AC\u4FC3\u8FDB\u5EA6\uFF0C\u8BF7\u5C3D\u5FEB\u5904\u7406', time: '03-20 09:30', isMe: false },
  { id: 2, sender: '\u4EA4\u4ED8-\u738B\u82B3', message: '\u5DF2\u63D0\u4EA4\uFF0C\u9884\u8BA13\u4E2A\u5DE5\u4F5C\u65E5\u51FA\u7ED3\u679C', time: '03-20 10:15', isMe: true },
  { id: 3, sender: '\u9500\u552E-\u674E\u660E', message: '\u6536\u5230\uFF0C\u5DF2\u544A\u77E5\u5BA2\u6237', time: '03-20 10:20', isMe: false },
]

const DEFAULT_DELIVERY_NOTE = '\u5BA2\u6237\u914D\u5408\u5EA6\u9AD8\uFF0C\u6750\u6599\u9F50\u5168\u3002'

export default function WorkbenchDetailPage() {
  const [currentNote, setCurrentNote] = useState('')
  const [deliveryNote, setDeliveryNote] = useState(DEFAULT_DELIVERY_NOTE)
  const [newMessage, setNewMessage] = useState('')

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />

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
              <span className="text-[11px] text-[#6b7280]">{LABELS.currentNode}</span>
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
              {LABELS.markException}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3 text-[12px] rounded-sm border-[#e5e7eb]"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {LABELS.saveNotes}
            </Button>
            <Button 
              size="sm" 
              className="h-8 px-3 text-[12px] rounded-sm bg-[#2563eb] hover:bg-[#1d4ed8]"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              {LABELS.completeCase}
            </Button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-[300px] flex-shrink-0 border-r border-[#e5e7eb] bg-white flex flex-col overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[#e5e7eb]">
              <h3 className="text-[13px] font-medium text-[#374151]">{LABELS.originalMaterials}</h3>
              <p className="text-[11px] text-[#9ca3af] mt-0.5">{LABELS.fromP6}</p>
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
                      {item.status === 'approved' ? LABELS.approved : LABELS.pendingSupply}
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
              <h3 className="text-[13px] font-medium text-[#374151]">{LABELS.deliveryMilestones}</h3>
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
                          {milestone.status === 'completed' ? LABELS.completed : milestone.status === 'in_progress' ? LABELS.inProgress : LABELS.pending}
                        </span>
                      </div>
                      {milestone.completedAt && (
                        <p className="font-mono text-[11px] text-[#9ca3af] mt-1">{LABELS.completedAt} {milestone.completedAt}</p>
                      )}
                    </div>

                    <div className="px-3 py-2.5">
                      {milestone.status === 'completed' && (
                        <div className="space-y-2">
                          {milestone.note && (
                            <p className="text-[12px] text-[#6b7280]">{milestone.note}</p>
                          )}
                          {milestone.attachments.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-[10px] text-[#9ca3af]">{LABELS.stageEvidence}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {milestone.attachments.map((att) => (
                                  <div 
                                    key={att.id} 
                                    className="flex items-center gap-1 px-1.5 py-0.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-sm text-[10px] text-[#6b7280] group"
                                  >
                                    {att.type === 'image' ? (
                                      <ImageIcon className="h-3 w-3 text-[#9ca3af]" />
                                    ) : (
                                      <FileText className="h-3 w-3 text-[#9ca3af]" />
                                    )}
                                    <span className="max-w-[100px] truncate">{att.name}</span>
                                    <button className="p-0.5 hover:bg-[#e5e7eb] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                      <X className="h-2.5 w-2.5 text-[#9ca3af]" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <button className="flex items-center gap-1 h-6 px-2 text-[10px] text-[#6b7280] border border-dashed border-[#d1d5db] rounded-sm hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-[#eff6ff] transition-colors">
                            <Paperclip className="h-3 w-3" />
                            {LABELS.uploadEvidence}
                          </button>
                        </div>
                      )}
                      {milestone.status === 'in_progress' && (
                        <div className="space-y-2.5">
                          <Textarea 
                            placeholder={LABELS.addNotes}
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            className="min-h-[60px] text-[12px] border-[#e5e7eb] rounded-sm resize-none shadow-none focus-visible:ring-1 focus-visible:ring-[#2563eb]"
                          />
                          {milestone.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {milestone.attachments.map((att) => (
                                <div 
                                  key={att.id} 
                                  className="flex items-center gap-1 px-1.5 py-0.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-sm text-[10px] text-[#6b7280] group"
                                >
                                  {att.type === 'image' ? (
                                    <ImageIcon className="h-3 w-3 text-[#9ca3af]" />
                                  ) : (
                                    <FileText className="h-3 w-3 text-[#9ca3af]" />
                                  )}
                                  <span className="max-w-[100px] truncate">{att.name}</span>
                                  <button className="p-0.5 hover:bg-[#e5e7eb] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="h-2.5 w-2.5 text-[#9ca3af]" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <button className="flex items-center gap-1 h-6 px-2 text-[10px] text-[#6b7280] border border-dashed border-[#d1d5db] rounded-sm hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-[#eff6ff] transition-colors w-full justify-center">
                            <Paperclip className="h-3 w-3" />
                            {LABELS.uploadEvidence}
                          </button>
                          <Button 
                            size="sm" 
                            className="h-8 px-4 text-[12px] rounded-sm bg-[#2563eb] hover:bg-[#1d4ed8] w-full"
                          >
                            <Check className="h-3.5 w-3.5 mr-1.5" />
                            {LABELS.markComplete}
                          </Button>
                        </div>
                      )}
                      {milestone.status === 'pending' && (
                        <p className="text-[11px] text-[#9ca3af]">{LABELS.waitingPrevious}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[320px] flex-shrink-0 border-l border-[#e5e7eb] bg-white flex flex-col overflow-hidden">
            <div className="px-3 py-2.5 border-b border-[#e5e7eb]">
              <h4 className="text-[12px] font-medium text-[#374151]">{LABELS.finalUpload}</h4>
            </div>
            <div className="px-3 py-3 border-b border-[#e5e7eb]">
              <div className="h-28 border-2 border-dashed border-[#d1d5db] rounded-sm flex flex-col items-center justify-center bg-[#f9fafb] hover:border-[#2563eb] hover:bg-[#eff6ff] cursor-pointer transition-colors">
                <Upload className="h-6 w-6 text-[#9ca3af] mb-1.5" />
                <p className="text-[11px] text-[#6b7280]">{LABELS.dragOrClick}</p>
                <p className="text-[10px] text-[#9ca3af] mt-0.5">PDF, JPG, PNG ({LABELS.maxSize} 10MB)</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-3 py-2 border-b border-[#e5e7eb]">
                <h4 className="text-[12px] font-medium text-[#374151]">{LABELS.interactionLog}</h4>
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
                    placeholder={LABELS.inputMessage}
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
                <h4 className="text-[12px] font-medium text-[#374151]">{LABELS.deliveryNotes}</h4>
                <p className="text-[10px] text-[#9ca3af]">{LABELS.autoSave}</p>
              </div>
              <div className="px-3 py-2">
                <Textarea 
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder={LABELS.addDeliveryNotes}
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
