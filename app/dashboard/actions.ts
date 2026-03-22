'use server'

import { getPrisma } from '@/lib/prisma'

export interface DashboardStats {
  activeOpportunities: number
  completedThisMonth: number
  unassigned: number
  totalPipelineAmount: number
  currency: string
}

export interface DashboardOpportunity {
  id: string
  opportunityCode: string
  customerName: string
  serviceTypeLabel: string
  stageId: string
  status: string
  executorName: string | null
  createdAt: string
  expectedCloseDate: string | null
}

export interface TeamMemberLoad {
  id: string
  name: string
  initials: string
  currentLoad: number
  capacity: number
}

/** 获取仪表盘统计数据 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const prisma = getPrisma()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [active, completedThisMonth, unassigned, pipelineAgg] = await Promise.all([
    prisma.opportunities.count({ where: { stageId: 'P7', status: 'active' } }),
    prisma.opportunities.count({
      where: {
        stageId: 'P7',
        status: 'won',
        actualCloseDate: { gte: monthStart },
      },
    }),
    prisma.opportunities.count({ where: { stageId: 'P7', status: 'active', delivery_assignments: null } }),
    prisma.opportunities.aggregate({
      where: { stageId: 'P7', status: 'active' },
      _sum: { estimatedAmount: true },
    }),
  ])

  return {
    activeOpportunities: active,
    completedThisMonth,
    unassigned,
    totalPipelineAmount: pipelineAgg._sum.estimatedAmount ?? 0,
    currency: 'IDR',
  }
}

/** 获取最近的商机列表 */
export async function getRecentOpportunities(limit: number = 10): Promise<DashboardOpportunity[]> {
  const prisma = getPrisma()

  const items = await prisma.opportunities.findMany({
    where: { stageId: 'P7', status: 'active' },
    include: {
      customers: { select: { customerName: true } },
      delivery_assignments: {
        include: {
          users_auth_delivery_assignments_executorIdTousers_auth: { select: { name: true } },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  })

  return items.map((opp) => ({
    id: opp.id,
    opportunityCode: opp.opportunityCode,
    customerName: opp.customers.customerName,
    serviceTypeLabel: opp.serviceTypeLabel,
    stageId: opp.stageId,
    status: opp.status,
    executorName: opp.delivery_assignments
      ?.users_auth_delivery_assignments_executorIdTousers_auth?.name ?? null,
    createdAt: opp.createdAt.toISOString(),
    expectedCloseDate: opp.expectedCloseDate?.toISOString() ?? null,
  }))
}

/** 获取团队负载概况 */
export async function getTeamWorkload(): Promise<TeamMemberLoad[]> {
  const prisma = getPrisma()

  const executors = await prisma.users_auth.findMany({
    where: {
      isActive: true,
      user_organizations: {
        some: { roles: { code: 'executor' } },
      },
    },
    include: {
      delivery_assignments_delivery_assignments_executorIdTousers_auth: {
        where: { status: 'active' },
      },
    },
  })

  return executors.map((e) => ({
    id: e.id,
    name: e.name,
    initials: e.name.charAt(0),
    currentLoad: e.delivery_assignments_delivery_assignments_executorIdTousers_auth.length,
    capacity: 20,
  }))
}
