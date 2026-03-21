import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function TasksPage() {
  return (
    <DashboardLayout title="我的办件" userName="张三" isSupervisor={true}>
      <div className="bg-white border border-[#e5e7eb] rounded-sm p-4">
        <p className="text-[13px] text-[#6b7280]">我的办件列表将在此处显示</p>
      </div>
    </DashboardLayout>
  )
}
