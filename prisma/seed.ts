import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const SEED_PASSWORD = 'Bantu2026!'

async function main() {
  console.log('🌱 开始 seed 数据...\n')

  // 1. 创建组织
  const org = await prisma.organizations.upsert({
    where: { code: 'BANTU-ID' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      code: 'BANTU-ID',
      name: '万途企服（印尼）',
      site: 'ID',
      updatedAt: new Date(),
    },
  })
  console.log(`✅ 组织: ${org.name} (${org.code})`)

  // 2. 创建角色
  const rolesData = [
    { code: 'admin', name: '管理员' },
    { code: 'pm', name: '项目经理' },
    { code: 'executor', name: '执行员' },
    { code: 'sales', name: '销售' },
  ]

  const roleMap: Record<string, string> = {}
  for (const r of rolesData) {
    const role = await prisma.roles.upsert({
      where: { code: r.code },
      update: {},
      create: {
        id: crypto.randomUUID(),
        code: r.code,
        name: r.name,
      },
    })
    roleMap[r.code] = role.id
    console.log(`✅ 角色: ${r.name} (${r.code})`)
  }

  // 3. 创建用户（Supabase Auth + 业务表）
  const usersData = [
    { email: 'admin@bantuqifu.com', name: '王硕', roleCode: 'admin' },
    { email: 'pm1@bantuqifu.com', name: '张明', roleCode: 'pm' },
    { email: 'pm2@bantuqifu.com', name: '李华', roleCode: 'pm' },
    { email: 'exec1@bantuqifu.com', name: '赵伟', roleCode: 'executor' },
    { email: 'exec2@bantuqifu.com', name: '陈静', roleCode: 'executor' },
    { email: 'pm_exec@bantuqifu.com', name: '刘强', roleCode: 'executor' },
  ]

  console.log('\n--- 创建用户 ---')
  for (const u of usersData) {
    const authId = await ensureAuthUser(u.email)
    if (!authId) continue

    // 创建 users_auth 记录
    await prisma.users_auth.upsert({
      where: { email: u.email },
      update: { name: u.name },
      create: {
        id: authId,
        email: u.email,
        name: u.name,
        isActive: true,
        updatedAt: new Date(),
      },
    })

    // 创建 user_organizations 关联
    await prisma.user_organizations.upsert({
      where: {
        userId_organizationId: {
          userId: authId,
          organizationId: org.id,
        },
      },
      update: { roleId: roleMap[u.roleCode] },
      create: {
        userId: authId,
        organizationId: org.id,
        roleId: roleMap[u.roleCode],
        updatedAt: new Date(),
      },
    })

    console.log(`✅ 用户: ${u.name} (${u.email}) — 角色: ${u.roleCode}`)
  }

  console.log('\n🎉 Seed 完成!')
  console.log(`\n📋 所有用户密码: ${SEED_PASSWORD}`)
  console.log('\n可登录的用户（包含 executor 或 admin 角色）:')
  console.log('  - admin@bantuqifu.com (admin)')
  console.log('  - exec1@bantuqifu.com (executor)')
  console.log('  - exec2@bantuqifu.com (executor)')
  console.log('  - pm_exec@bantuqifu.com (executor)')
  console.log('\n⚠️  PM 角色用户 pm1/pm2 无法登录执行端（需要 executor 或 admin 角色）')
}

async function ensureAuthUser(email: string): Promise<string | null> {
  // 先尝试创建
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: SEED_PASSWORD,
    email_confirm: true,
  })

  if (!error && data.user) {
    return data.user.id
  }

  // 如果已存在，查找现有用户
  if (error?.message?.includes('already been registered') || error?.message?.includes('already exists')) {
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    const existing = listData?.users?.find((u) => u.email === email)
    if (existing) return existing.id
  }

  console.error(`❌ 创建 auth 用户失败 ${email}: ${error?.message}`)
  return null
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
