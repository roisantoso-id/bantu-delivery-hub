'use server'

import { createClient } from '@/lib/supabase/server'
import { getPrisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: '邮箱或密码错误' }
  }

  const prisma = getPrisma()

  const dbUser = await prisma.users_auth.findUnique({
    where: { email },
    include: {
      user_organizations: {
        include: { roles: true },
      },
    },
  })

  if (!dbUser || !dbUser.isActive) {
    await supabase.auth.signOut()
    return { error: '账户未激活或不存在' }
  }

  const hasAllowedRole = dbUser.user_organizations.some(
    (uo) => uo.roles.code.includes('executor') || uo.roles.code === 'admin'
  )

  if (!hasAllowedRole) {
    await supabase.auth.signOut()
    return { error: '您没有执行端访问权限，请联系管理员' }
  }

  redirect('/dashboard')
}
