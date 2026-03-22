'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, Users, GitBranch, Network } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  shortLabel: string
  href: string
  icon: React.ReactNode
}

// Executor menu
const executorNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    shortLabel: '\u6982\u89C8',
    href: '/dashboard',
    icon: <LayoutDashboard className="size-4" />,
  },
  {
    label: 'My Tasks',
    shortLabel: '\u5DE5\u4F5C\u53F0',
    href: '/tasks',
    icon: <ClipboardList className="size-4" />,
  },
  {
    label: 'Collab Workbench',
    shortLabel: '\u534F\u540C',
    href: '/workbench/collab/demo',
    icon: <GitBranch className="size-4" />,
  },
]

// Assigner menu
const assignerNavItems: NavItem[] = [
  {
    label: 'Dispatch',
    shortLabel: '\u8C03\u5EA6',
    href: '/dispatch',
    icon: <Users className="size-4" />,
  },
  {
    label: 'Multi-Service',
    shortLabel: '\u6307\u6D3E',
    href: '/dispatch/OPP-240321-001',
    icon: <Network className="size-4" />,
  },
]

const SECTION_LABELS = {
  executor: '\u6267\u884C',
  assigner: '\u5206\u914D',
}

export function Sidebar() {
  const pathname = usePathname()

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
        {/* Executor section */}
        <div className="flex-1">
          <p className="text-[9px] text-[#9ca3af] text-center mb-1.5 px-1">{SECTION_LABELS.executor}</p>
          <ul className="space-y-1">
            {executorNavItems.map(renderNavItem)}
          </ul>
        </div>

        {/* Divider */}
        <div className="my-3 mx-1 border-t border-[#e5e7eb]" />

        {/* Assigner section */}
        <div>
          <p className="text-[9px] text-[#9ca3af] text-center mb-1.5 px-1">{SECTION_LABELS.assigner}</p>
          <ul className="space-y-1">
            {assignerNavItems.map(renderNavItem)}
          </ul>
        </div>
      </nav>

      {/* Version */}
      <div className="py-2 border-t border-[#e5e7eb] text-center">
        <p className="text-[9px] text-[#9ca3af]">v1.0</p>
      </div>
    </aside>
  )
}
