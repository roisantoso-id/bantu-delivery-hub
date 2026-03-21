import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function DispatchPage() {
  return (
    <DashboardLayout title="资源调度" userName="张三" isSupervisor={true}>
      <div className="bg-white border border-[#e5e7eb] rounded-sm p-4">
        <p className="text-[13px] text-[#6b7280]">资源调度面板将在此处显示（仅主管可见）</p>
      </div>
    </DashboardLayout>
  )
}
