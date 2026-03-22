import { createClient } from '@/lib/supabase/server'
import { getPrisma } from '@/lib/prisma'
import type { AuthUser } from '@/lib/auth-context'

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) return null

    const prisma = getPrisma()
    const dbUser = await prisma.users_auth.findUnique({
      where: { email: user.email },
      include: {
        user_organizations: {
          include: { roles: true },
        },
      },
    })

    if (!dbUser) return null

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      roleCodes: [...new Set(dbUser.user_organizations.map((uo) => uo.roles.code))],
      organizationId: dbUser.user_organizations[0]?.organizationId ?? '',
    }
  } catch {
    return null
  }
}
