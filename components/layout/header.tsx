'use client'

import { useRouter } from 'next/navigation'
import { Search, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

interface HeaderProps {
  title: string
  userName?: string
  userAvatar?: string
}

export function Header({
  title,
  userName,
  userAvatar
}: HeaderProps) {
  const user = useAuth()
  const router = useRouter()
  const displayName = user?.name ?? userName ?? '用户'

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="h-12 shrink-0 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-4">
      {/* 左侧：页面标题 */}
      <h1 className="text-[13px] font-semibold text-[#111827]">{title}</h1>

      {/* 右侧：搜索框 + 用户菜单 */}
      <div className="flex items-center gap-3">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="搜索..."
            className="h-8 w-48 rounded-sm border border-[#e5e7eb] bg-white pl-7 pr-3 text-[13px] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#2563eb]"
          />
        </div>

        {/* 用户头像/下拉菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 rounded-sm border border-[#e5e7eb] px-2 py-1 hover:bg-[#f9fafb] focus:outline-none">
              <Avatar className="size-6 rounded-sm">
                {userAvatar && <AvatarImage src={userAvatar} alt={displayName} />}
                <AvatarFallback className="rounded-sm bg-[#e5e7eb] text-[11px] text-[#4b5563]">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-[12px] text-[#4b5563] max-w-[60px] truncate">
                {displayName}
              </span>
              <ChevronDown className="size-3 text-[#9ca3af]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 rounded-sm border border-[#e5e7eb] p-1 shadow-none"
          >
            <DropdownMenuItem className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] text-[#4b5563] cursor-pointer hover:bg-[#f3f4f6] hover:text-[#111827]">
              <User className="size-3.5" />
              个人信息
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] text-[#4b5563] cursor-pointer hover:bg-[#f3f4f6] hover:text-[#111827]">
              <Settings className="size-3.5" />
              设置
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-[#e5e7eb]" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] text-[#dc2626] cursor-pointer hover:bg-[#fef2f2] hover:text-[#dc2626]"
            >
              <LogOut className="size-3.5" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
