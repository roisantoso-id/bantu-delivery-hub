'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  shortLabel: string
  href: string
  icon: React.ReactNode
  supervisorOnly?: boolean
}

const navItems: NavItem[] = [
  {
    label: '大盘概览',
    shortLabel: '概览',
    href: '/dashboard',
    icon: <LayoutDashboard className="size-4" />,
  },
  {
    label: '我的办件',
    shortLabel: '工作台',
    href: '/tasks',
    icon: <ClipboardList className="size-4" />,
  },
  {
    label: '资源调度',
    shortLabel: '调度',
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
    <aside className="w-16 shrink-0 bg-[#f9fafb] border-r border-[#e5e7eb] flex flex-col h-screen">
      {/* Logo 区域 */}
      <div className="h-12 flex items-center justify-center border-b border-[#e5e7eb]">
        <div className="size-7 rounded-sm bg-[#2563eb] flex items-center justify-center">
          <span className="text-white text-[12px] font-semibold">B</span>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-3 px-1.5">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-0.5 px-1 py-2 rounded-sm text-center transition-colors',
                    isActive
                      ? 'bg-[#eff6ff] text-[#2563eb]'
                      : 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]'
                  )}
                >
                  {item.icon}
                  <span className={cn(
                    'text-[10px] leading-tight',
                    isActive && 'font-medium'
                  )}>
                    {item.shortLabel}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 底部版本信息 */}
      <div className="py-2 border-t border-[#e5e7eb] text-center">
        <p className="text-[9px] text-[#9ca3af]">v1.0</p>
      </div>
    </aside>
  )
}
