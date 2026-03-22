'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Users, GitBranch, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

interface NavItem {
  label: string
  shortLabel: string
  href: string
  icon: React.ReactNode
}

interface NavSection {
  key: string
  label: string
  visibleTo: string[] // empty = all roles
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    key: 'common',
    label: '通用',
    visibleTo: [],
    items: [
      { label: 'Dashboard', shortLabel: '概览', href: '/dashboard', icon: <LayoutDashboard className="size-4" /> },
    ],
  },
  {
    key: 'pm',
    label: '项目',
    visibleTo: ['pm', 'admin'],
    items: [
      { label: 'Opportunities', shortLabel: '商机', href: '/opportunities', icon: <Target className="size-4" /> },
      { label: 'Dispatch', shortLabel: '调度', href: '/dispatch', icon: <Users className="size-4" /> },
    ],
  },
  {
    key: 'executor',
    label: '执行',
    visibleTo: ['executor', 'admin'],
    items: [
      { label: 'My Tasks', shortLabel: '工作台', href: '/tasks', icon: <ClipboardList className="size-4" /> },
      { label: 'Collab Workbench', shortLabel: '协同', href: '/workbench/collab/demo', icon: <GitBranch className="size-4" /> },
    ],
  },
]

function getVisibleSections(roleCodes: string[]): NavSection[] {
  return navSections.filter((section) => {
    if (section.visibleTo.length === 0) return true
    return section.visibleTo.some((role) => roleCodes.includes(role))
  })
}

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuth()
  const roleCodes = user?.roleCodes ?? []
  const visibleSections = getVisibleSections(roleCodes)

  const renderNavItem = (item: NavItem) => {
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
  }

  return (
    <aside className="w-16 shrink-0 bg-[#f9fafb] border-r border-[#e5e7eb] flex flex-col h-screen">
      {/* Logo */}
      <div className="h-12 flex items-center justify-center border-b border-[#e5e7eb]">
        <Image
          src="/bantu_logo_yuan.png"
          alt="Bantu Logo"
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-1.5 flex flex-col">
        {visibleSections.map((section, idx) => (
          <div key={section.key} className={idx === 0 ? 'flex-1' : ''}>
            {idx > 0 && <div className="my-3 mx-1 border-t border-[#e5e7eb]" />}
            <p className="text-[9px] text-[#9ca3af] text-center mb-1.5 px-1">{section.label}</p>
            <ul className="space-y-1">
              {section.items.map(renderNavItem)}
            </ul>
          </div>
        ))}
      </nav>

      {/* Version */}
      <div className="py-2 border-t border-[#e5e7eb] text-center">
        <p className="text-[9px] text-[#9ca3af]">v1.0</p>
      </div>
    </aside>
  )
}
