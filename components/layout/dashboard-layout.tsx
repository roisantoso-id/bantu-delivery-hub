'use client'

import { Sidebar } from './sidebar'
import { Header } from './header'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  userName?: string
  userAvatar?: string
}

export function DashboardLayout({
  children,
  title,
  userName,
  userAvatar,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <Header title={title} userName={userName} userAvatar={userAvatar} />

        <main className="flex-1 overflow-auto bg-[#f9fafb] p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
