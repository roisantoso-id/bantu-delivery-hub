'use server'

import { getPrisma } from '@/lib/prisma'

export interface Executor {
  id: string
  name: string
  initials: string
  expertise: string[]
  currentLoad: number
  capacity: number
}

export interface UnassignedOpportunity {
  id: string
  opportunityCode: string
  customerName: string
  serviceType: string
  expectedAmount: number
  currency: string
  waitingDays: number
  urgency: 'high' | 'medium' | 'low'
}

/** 获取所有执行人及其当前负载 */
export async function getExecutors(): Promise<Executor[]> {
  const prisma = getPrisma()

  const executors = await prisma.users_auth.findMany({
    where: {
      isActive: true,
      user_organizations: {
        some: {
          roles: { code: 'executor' },
        },
      },
    },
    include: {
      delivery_assignments_delivery_assignments_executorIdTousers_auth: {
        where: { status: 'active' },
        include: {
          opportunities: {
            select: { serviceTypeLabel: true },
          },
        },
      },
    },
  })

  return executors.map((e) => {
    const assignments = e.delivery_assignments_delivery_assignments_executorIdTousers_auth
    // 从当前执行的商机中提取服务类型作为擅长领域
    const expertiseSet = new Set(
      assignments.map((a) => a.opportunities.serviceTypeLabel)
    )

    return {
      id: e.id,
      name: e.name,
      initials: e.name.charAt(0),
      expertise: Array.from(expertiseSet),
      currentLoad: assignments.length,
      capacity: 20, // 默认容量，后续可配置
    }
  })
}

/** 获取未指派的商机 */
export async function getUnassignedOpportunities(): Promise<UnassignedOpportunity[]> {
  const prisma = getPrisma()

  const opportunities = await prisma.opportunities.findMany({
    where: {
      stageId: 'P7',
      status: 'active',
      delivery_assignments: null,
    },
    include: {
      customers: {
        select: { customerName: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  const now = new Date()

  return opportunities.map((opp) => {
    const waitingDays = Math.floor(
      (now.getTime() - opp.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    let urgency: 'high' | 'medium' | 'low' = 'low'
    if (waitingDays >= 5) urgency = 'high'
    else if (waitingDays >= 3) urgency = 'medium'

    return {
      id: opp.id,
      opportunityCode: opp.opportunityCode,
      customerName: opp.customers.customerName,
      serviceType: opp.serviceTypeLabel,
      expectedAmount: opp.estimatedAmount,
      currency: opp.currency,
      waitingDays,
      urgency,
    }
  })
}

/** 指派商机给执行人 */
export async function assignOpportunity(
  opportunityId: string,
  executorId: string,
  assignedById: string,
  organizationId: string,
) {
  const prisma = getPrisma()

  await prisma.delivery_assignments.create({
    data: {
      opportunityId,
      executorId,
      assignedById,
      organizationId,
      status: 'active',
    },
  })

  return { success: true }
}
