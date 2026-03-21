import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { FileText, Users, Clock, CheckCircle } from 'lucide-react'

// 模拟统计数据
const stats = [
  { label: '待处理办件', value: 12, icon: Clock, color: '#f59e0b' },
  { label: '今日完成', value: 8, icon: CheckCircle, color: '#10b981' },
  { label: '本月办件', value: 156, icon: FileText, color: '#2563eb' },
  { label: '客户总数', value: 324, icon: Users, color: '#6366f1' },
]

export default function DashboardPage() {
  return (
    <DashboardLayout 
      title="大盘概览" 
      userName="张三"
      isSupervisor={true}
    >
      <div className="space-y-4">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-[#e5e7eb] rounded-sm p-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[#6b7280]">{stat.label}</p>
                  <p className="text-[18px] font-semibold text-[#111827] font-mono mt-0.5">
                    {stat.value}
                  </p>
                </div>
                <div
                  className="size-8 rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}10` }}
                >
                  <stat.icon className="size-4" style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 最近办件列表 */}
        <div className="bg-white border border-[#e5e7eb] rounded-sm">
          <div className="px-3 py-2 border-b border-[#e5e7eb]">
            <h2 className="text-[13px] font-semibold text-[#111827]">最近办件</h2>
          </div>
          <div className="divide-y divide-[#e5e7eb]">
            {[
              { id: 'OPP-260321-0001', customer: '王伟', type: '签证服务', status: '进行中', date: '2026-03-21' },
              { id: 'OPP-260320-0012', customer: '李娜', type: '公司注册', status: '待审核', date: '2026-03-20' },
              { id: 'OPP-260320-0008', customer: '陈明', type: '许可证服务', status: '已完成', date: '2026-03-20' },
              { id: 'OPP-260319-0003', customer: '张华', type: '税务服务', status: '进行中', date: '2026-03-19' },
            ].map((item) => (
              <div key={item.id} className="px-3 py-2 flex items-center justify-between hover:bg-[#f9fafb]">
                <div className="flex items-center gap-4">
                  <span className="text-[12px] font-mono text-[#2563eb]">{item.id}</span>
                  <span className="text-[13px] text-[#111827]">{item.customer}</span>
                  <span className="text-[12px] text-[#6b7280]">{item.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-sm ${
                      item.status === '已完成'
                        ? 'bg-[#d1fae5] text-[#059669]'
                        : item.status === '待审核'
                        ? 'bg-[#fef3c7] text-[#d97706]'
                        : 'bg-[#dbeafe] text-[#2563eb]'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-[12px] font-mono text-[#9ca3af]">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
