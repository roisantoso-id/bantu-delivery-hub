'use client'

import { useState, useEffect, useTransition } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from './actions'

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setMounted(true)
  }, [])

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f9fafb]">
        <p className="text-[12px] text-[#9ca3af]">加载中...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[#f9fafb]">
      <div className="w-full max-w-sm bg-white border border-[#e5e7eb] rounded-lg p-8 space-y-6 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/bantu_logo_yuan.png"
            alt="Bantu"
            width={56}
            height={56}
            className="rounded-full"
          />
          <h1 className="text-[18px] font-semibold text-[#111827]">Bantu 交付工作台</h1>
          <p className="text-[13px] text-[#6b7280]">请登录您的账户</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] text-[#4b5563]">邮箱</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[13px] text-[#4b5563]">密码</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="输入密码"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-[12px] text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? '登录中...' : '登 录'}
          </Button>
        </form>
      </div>
    </div>
  )
}
