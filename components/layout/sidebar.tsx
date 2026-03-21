'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  supervisorOnly?: boolean
}

const navItems: NavItem[] = [
  {
    label: '大盘概览',
    href: '/dashboard',
    icon: <LayoutDashboard className="size-4" />,
  },
  {
    label: '我的办件',
    href: '/tasks',
    icon: <ClipboardList className="size-4" />,
  },
  {
    label: '资源调度',
    href: '/dispatch',
    icon: <Users className="size-4" />,
    supervisorOnly: true,
  },
]

interface SidebarProps {
  isSupervisor?: boolean
}

export function Sidebar({ isSupervisor = true }: SidebarProps) {
  const pathname = usePathname()

  const filteredNavItems = navItems.filter(
    (item) => !item.supervisorOnly || isSupervisor
  )

  return (
    <aside className="w-[200px] shrink-0 bg-[#f9fafb] border-r border-[#e5e7eb] flex flex-col h-screen">
      {/* Logo 区域 */}
      <div className="h-12 flex items-center px-4 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-sm bg-[#2563eb] flex items-center justify-center">
            <span className="text-white text-[11px] font-semibold">B</span>
          </div>
          <span className="text-[13px] font-semibold text-[#111827]">
            Bantu Delivery Hub
          </span>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-3 px-2">
        <ul className="space-y-0.5">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-[13px] transition-colors',
                    isActive
                      ? 'bg-[#eff6ff] text-[#2563eb] font-medium'
                      : 'text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#111827]'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 底部版本信息 */}
      <div className="px-4 py-3 border-t border-[#e5e7eb]">
        <p className="text-[11px] text-[#9ca3af]">v1.0.0</p>
      </div>
    </aside>
  )
}
