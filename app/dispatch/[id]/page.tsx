'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  ArrowLeft,
  ChevronDown,
  Link2,
  Copy,
  Check,
  User,
  Building2,
  Plus,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

// Status badge styles
const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-[#f3f4f6]', text: 'text-[#374151]', label: '\u5F85\u5206\u914D' },
  assigned: { bg: 'bg-[#eff6ff]', text: 'text-[#1d4ed8]', label: '\u5DF2\u5206\u914D' },
  in_progress: { bg: 'bg-[#fefce8]', text: 'text-[#a16207]', label: '\u8FDB\u884C\u4E2D' },
  completed: { bg: 'bg-[#ecfdf5]', text: 'text-[#047857]', label: '\u5DF2\u5B8C\u6210' },
}

// Mock data
const opportunityData = {
  id: 'OPP-240321-001',
  customerName: '\u6DF1\u5733\u521B\u65B0\u79D1\u6280\u6709\u9650\u516C\u53F8',
  totalServices: 3,
  createdAt: '2024-03-21',
}

const serviceItems = [
  { 
    id: 's1', 
    name: '\u5370\u5C3C\u7B7E\u8BC1\u529E\u7406', 
    status: 'assigned' as const,
    executorType: 'internal' as const,
    executorId: 1,
    executorName: '\u674E\u660E',
    externalLink: null,
  },
  { 
    id: 's2', 
    name: '\u5370\u5C3C\u516C\u53F8\u6CE8\u518C', 
    status: 'pending' as const,
    executorType: null,
    executorId: null,
    executorName: null,
    externalLink: null,
  },
  { 
    id: 's3', 
    name: '\u5370\u5C3C\u7A0E\u52A1\u767B\u8BB0', 
    status: 'in_progress' as const,
    executorType: 'external' as const,
    executorId: null,
    executorName: 'PT. Indo Tax Partner',
    externalLink: 'https://collab.bantu.app/ext/abc123xyz',
  },
]

const internalStaff = [
  { id: 1, name: '\u674E\u660E', initials: '\u674E', currentLoad: 12, capacity: 20 },
  { id: 2, name: '\u738B\u82B3', initials: '\u738B', currentLoad: 8, capacity: 15 },
  { id: 3, name: '\u5F20\u4F1F', initials: '\u5F20', currentLoad: 17, capacity: 18 },
  { id: 4, name: '\u9648\u9759', initials: '\u9648', currentLoad: 5, capacity: 20 },
]

const externalSuppliers = [
  { id: 'e1', name: 'PT. Indo Tax Partner', type: '\u7A0E\u52A1' },
  { id: 'e2', name: 'Jakarta Legal Services', type: '\u6CD5\u5F8B' },
  { id: 'e3', name: 'Bali Visa Agency', type: '\u7B7E\u8BC1' },
]

// Labels
const L = {
  title: '\u591A\u670D\u52A1\u9879\u76EE\u6307\u6D3E\u4E2D\u5FC3',
  back: '\u8FD4\u56DE\u5217\u8868',
  customer: '\u5BA2\u6237',
  services: '\u670D\u52A1\u9879',
  assignMatrix: '\u670D\u52A1\u5206\u914D\u77E9\u9635',
  serviceName: '\u670D\u52A1\u540D\u79F0',
  status: '\u72B6\u6001',
  executorType: '\u6267\u884C\u4EBA\u7C7B\u578B',
  executor: '\u6267\u884C\u4EBA',
  actions: '\u64CD\u4F5C',
  assign: '\u5206\u914D',
  internal: '\u5185\u90E8\u5458\u5DE5',
  external: '\u5916\u90E8\u4F9B\u5E94\u5546',
  genLink: '\u751F\u6210\u534F\u4F5C\u94FE\u63A5',
  copyLink: '\u590D\u5236\u94FE\u63A5',
  copied: '\u5DF2\u590D\u5236',
  unassigned: '\u672A\u5206\u914D',
  assignAll: '\u4E00\u952E\u5168\u90E8\u6307\u6D3E\u7ED9',
  selectPerson: '\u9009\u62E9\u4EBA\u5458',
  currentLoad: '\u5728\u529E',
}

// Executor selector component
function ExecutorSelector({ 
  serviceId,
  currentType,
  currentName,
  onAssign 
}: { 
  serviceId: string
  currentType: 'internal' | 'external' | null
  currentName: string | null
  onAssign: (serviceId: string, type: 'internal' | 'external', executorId: string | number, name: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [generatingLink, setGeneratingLink] = useState(false)

  const handleGenerateLink = () => {
    setGeneratingLink(true)
    setTimeout(() => {
      onAssign(serviceId, 'external', 'new-link', '\u65B0\u5916\u90E8\u4F9B\u5E94\u5546')
      setGeneratingLink(false)
      setOpen(false)
    }, 800)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 h-6 px-2 text-[11px] text-[#2563eb] hover:bg-[#eff6ff] border border-[#e5e7eb] rounded-sm transition-colors">
          {currentName || L.assign}
          <ChevronDown className="w-3 h-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 border border-[#e5e7eb] rounded-sm shadow-none" align="start">
        <Tabs defaultValue="internal" className="w-full">
          <TabsList className="w-full h-7 p-0 bg-[#f9fafb] border-b border-[#e5e7eb] rounded-none rounded-t-sm">
            <TabsTrigger 
              value="internal" 
              className="flex-1 h-7 text-[10px] rounded-none rounded-tl-sm data-[state=active]:bg-white data-[state=active]:border-b-white data-[state=active]:shadow-none border-0"
            >
              <User className="w-3 h-3 mr-1" />
              {L.internal}
            </TabsTrigger>
            <TabsTrigger 
              value="external" 
              className="flex-1 h-7 text-[10px] rounded-none rounded-tr-sm data-[state=active]:bg-white data-[state=active]:border-b-white data-[state=active]:shadow-none border-0"
            >
              <Building2 className="w-3 h-3 mr-1" />
              {L.external}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="internal" className="m-0">
            <div className="max-h-40 overflow-y-auto">
              {internalStaff.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => { 
                    onAssign(serviceId, 'internal', staff.id, staff.name)
                    setOpen(false)
                  }}
                  className="w-full px-2.5 py-1.5 text-left hover:bg-[#f9fafb] flex items-center justify-between border-b border-[#f3f4f6] last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="w-5 h-5 rounded-sm">
                      <AvatarFallback className="rounded-sm text-[8px] bg-[#f3f4f6] text-[#374151]">
                        {staff.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[11px] text-[#374151]">{staff.name}</span>
                  </div>
                  <span className="font-mono text-[9px] text-[#9ca3af]">
                    {L.currentLoad} {staff.currentLoad}/{staff.capacity}
                  </span>
                </button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="external" className="m-0">
            <div className="max-h-40 overflow-y-auto">
              {externalSuppliers.map((supplier) => (
                <button
                  key={supplier.id}
                  onClick={() => { 
                    onAssign(serviceId, 'external', supplier.id, supplier.name)
                    setOpen(false)
                  }}
                  className="w-full px-2.5 py-1.5 text-left hover:bg-[#f9fafb] flex items-center justify-between border-b border-[#f3f4f6] last:border-0"
                >
                  <span className="text-[11px] text-[#374151]">{supplier.name}</span>
                  <span className="text-[9px] text-[#9ca3af]">{supplier.type}</span>
                </button>
              ))}
              <button
                onClick={handleGenerateLink}
                disabled={generatingLink}
                className="w-full px-2.5 py-2 text-left hover:bg-[#eff6ff] flex items-center gap-2 text-[11px] text-[#2563eb] border-t border-[#e5e7eb]"
              >
                {generatingLink ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                {L.genLink}
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

// External link icon with copy
function ExternalLinkIcon({ link }: { link: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 h-5 px-1.5 text-[9px] text-[#6b7280] hover:text-[#2563eb] hover:bg-[#eff6ff] rounded-sm transition-colors"
      title={link}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-[#15803d]" />
          {L.copied}
        </>
      ) : (
        <>
          <Link2 className="w-3 h-3" />
          {L.copyLink}
        </>
      )}
    </button>
  )
}

export default function MultiServiceAssignmentPage() {
  const [mounted, setMounted] = useState(false)
  const [services, setServices] = useState(serviceItems)
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAssign = (serviceId: string, type: 'internal' | 'external', executorId: string | number, name: string) => {
    setServices(prev => prev.map(s => 
      s.id === serviceId 
        ? { 
            ...s, 
            status: 'assigned' as const, 
            executorType: type,
            executorId: typeof executorId === 'number' ? executorId : null,
            executorName: name,
            externalLink: type === 'external' ? `https://collab.bantu.app/ext/${Math.random().toString(36).slice(2, 10)}` : null
          }
        : s
    ))
  }

  const handleBulkAssign = (staffId: number, name: string) => {
    setServices(prev => prev.map(s => 
      s.status === 'pending'
        ? { 
            ...s, 
            status: 'assigned' as const, 
            executorType: 'internal' as const,
            executorId: staffId,
            executorName: name,
            externalLink: null
          }
        : s
    ))
    setBulkAssignOpen(false)
  }

  if (!mounted) {
    return (
      <DashboardLayout title={L.title} userName={'\u5F20\u4E09'} isSupervisor={true}>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-5 h-5 animate-spin text-[#6b7280]" />
        </div>
      </DashboardLayout>
    )
  }

  const pendingCount = services.filter(s => s.status === 'pending').length

  return (
    <DashboardLayout title={L.title} userName={'\u5F20\u4E09'} isSupervisor={true}>
      <div className="flex flex-col h-full gap-3">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-white border border-[#e5e7eb] rounded-sm">
          <div className="flex items-center gap-4">
            <Link 
              href="/dispatch" 
              className="flex items-center gap-1 h-6 px-2 text-[11px] text-[#6b7280] hover:text-[#374151] hover:bg-[#f9fafb] rounded-sm transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              {L.back}
            </Link>
            <div className="h-4 w-px bg-[#e5e7eb]" />
            <div className="flex items-center gap-3">
              <span className="font-mono text-[12px] font-medium text-[#2563eb]">{opportunityData.id}</span>
              <span className="text-[12px] text-[#374151]">{L.customer}: {opportunityData.customerName}</span>
              <span className="px-1.5 py-0.5 text-[10px] bg-[#f3f4f6] text-[#6b7280] rounded-sm border border-[#e5e7eb]">
                {L.services}: {opportunityData.totalServices}
              </span>
            </div>
          </div>
          
          {/* Bulk assign button */}
          {pendingCount > 0 && (
            <Popover open={bulkAssignOpen} onOpenChange={setBulkAssignOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 h-7 px-3 text-[11px] font-medium text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-sm transition-colors">
                  {L.assignAll}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-44 p-0 border border-[#e5e7eb] rounded-sm shadow-none" align="end">
                <div className="px-2 py-1.5 text-[10px] text-[#6b7280] bg-[#f9fafb] border-b border-[#e5e7eb]">
                  {L.selectPerson}
                </div>
                {internalStaff.map((staff) => (
                  <button
                    key={staff.id}
                    onClick={() => handleBulkAssign(staff.id, staff.name)}
                    className="w-full px-2.5 py-1.5 text-left hover:bg-[#f9fafb] flex items-center justify-between border-b border-[#f3f4f6] last:border-0"
                  >
                    <span className="text-[11px] text-[#374151]">{staff.name}</span>
                    <span className="font-mono text-[9px] text-[#9ca3af]">{staff.currentLoad}/{staff.capacity}</span>
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Service Assignment Matrix */}
        <div className="flex-1 bg-white border border-[#e5e7eb] rounded-sm overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
            <span className="text-[12px] font-medium text-[#374151]">{L.assignMatrix}</span>
          </div>
          
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb] text-[10px] font-medium text-[#6b7280]">
            <div className="col-span-4">{L.serviceName}</div>
            <div className="col-span-2">{L.status}</div>
            <div className="col-span-2">{L.executorType}</div>
            <div className="col-span-3">{L.executor}</div>
            <div className="col-span-1 text-right">{L.actions}</div>
          </div>

          {/* Table body */}
          <div className="flex-1 overflow-y-auto">
            {services.map((service, index) => {
              const style = statusStyles[service.status]
              return (
                <div 
                  key={service.id}
                  className={`grid grid-cols-12 gap-2 px-3 py-2.5 border-b border-[#f3f4f6] hover:bg-[#fafafa] items-center ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}
                >
                  {/* Service name */}
                  <div className="col-span-4 text-[12px] text-[#111827] font-medium">
                    {service.name}
                  </div>
                  
                  {/* Status */}
                  <div className="col-span-2">
                    <span className={`inline-flex px-1.5 py-0.5 text-[10px] rounded-sm ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                  </div>
                  
                  {/* Executor type */}
                  <div className="col-span-2 text-[11px] text-[#6b7280]">
                    {service.executorType === 'internal' && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {L.internal}
                      </span>
                    )}
                    {service.executorType === 'external' && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {L.external}
                      </span>
                    )}
                    {!service.executorType && (
                      <span className="text-[#9ca3af]">-</span>
                    )}
                  </div>
                  
                  {/* Executor */}
                  <div className="col-span-3">
                    <ExecutorSelector
                      serviceId={service.id}
                      currentType={service.executorType}
                      currentName={service.executorName}
                      onAssign={handleAssign}
                    />
                  </div>
                  
                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    {service.executorType === 'external' && service.externalLink && (
                      <ExternalLinkIcon link={service.externalLink} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
