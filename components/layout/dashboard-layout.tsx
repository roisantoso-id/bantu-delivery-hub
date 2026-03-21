'use client'

import { Sidebar } from './sidebar'
import { Header } from './header'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  userName?: string
  userAvatar?: string
  isSupervisor?: boolean
}

export function DashboardLayout({
  children,
  title,
  userName,
  userAvatar,
  isSupervisor = true,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* 左侧固定侧边栏 */}
      <Sidebar isSupervisor={isSupervisor} />

      {/* 右侧主内容区 */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* 顶栏 */}
        <Header title={title} userName={userName} userAvatar={userAvatar} />

        {/* 主内容 */}
        <main className="flex-1 overflow-auto bg-[#f9fafb] p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
