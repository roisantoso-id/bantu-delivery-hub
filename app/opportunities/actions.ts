'use server'

import { getPrisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

export interface OpportunityListItem {
  id: string
  opportunityCode: string
  customerName: string
  customerId: string
  serviceType: string
  serviceTypeLabel: string
  stageId: string
  status: 'active' | 'won' | 'lost'
  estimatedAmount: number
  currency: string
  executorName: string | null
  assigneeName: string
  createdAt: string
  expectedCloseDate: string | null
}

export interface OpportunityFilters {
  status?: string
  serviceType?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface OpportunityListResult {
  items: OpportunityListItem[]
  total: number
  page: number
  pageSize: number
}

export interface OpportunityStats {
  active: number
  won: number
  lost: number
  total: number
  unassigned: number
}

/** 获取商机列表（分页 + 筛选） */
export async function getOpportunities(filters: OpportunityFilters = {}): Promise<OpportunityListResult> {
  const prisma = getPrisma()
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 20

  const where: Record<string, unknown> = { stageId: 'P7' }

  if (filters.status) where.status = filters.status
  if (filters.serviceType) where.serviceType = filters.serviceType
  if (filters.search) {
    where.OR = [
      { opportunityCode: { contains: filters.search, mode: 'insensitive' } },
      { customers: { customerName: { contains: filters.search, mode: 'insensitive' } } },
    ]
  }

  const [items, total] = await Promise.all([
    prisma.opportunities.findMany({
      where,
      include: {
        customers: { select: { customerName: true, customerId: true } },
        users_auth: { select: { name: true } },
        delivery_assignments: {
          include: {
            users_auth_delivery_assignments_executorIdTousers_auth: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.opportunities.count({ where }),
  ])

  return {
    items: items.map((opp) => ({
      id: opp.id,
      opportunityCode: opp.opportunityCode,
      customerName: opp.customers.customerName,
      customerId: opp.customers.customerId,
      serviceType: opp.serviceType,
      serviceTypeLabel: opp.serviceTypeLabel,
      stageId: opp.stageId,
      status: opp.status as 'active' | 'won' | 'lost',
      estimatedAmount: opp.estimatedAmount,
      currency: opp.currency,
      executorName: opp.delivery_assignments
        ?.users_auth_delivery_assignments_executorIdTousers_auth?.name ?? null,
      assigneeName: opp.users_auth.name,
      createdAt: opp.createdAt.toISOString(),
      expectedCloseDate: opp.expectedCloseDate?.toISOString() ?? null,
    })),
    total,
    page,
    pageSize,
  }
}

/** 获取商机统计 */
export async function getOpportunityStats(): Promise<OpportunityStats> {
  const prisma = getPrisma()

  const [active, won, lost, unassigned] = await Promise.all([
    prisma.opportunities.count({ where: { stageId: 'P7', status: 'active' } }),
    prisma.opportunities.count({ where: { stageId: 'P7', status: 'won' } }),
    prisma.opportunities.count({ where: { stageId: 'P7', status: 'lost' } }),
    prisma.opportunities.count({ where: { stageId: 'P7', status: 'active', delivery_assignments: null } }),
  ])

  return { active, won, lost, total: active + won + lost, unassigned }
}

/** 获取各阶段商机数量 */
export async function getOpportunityStageCounts(): Promise<{ stageId: string; count: number }[]> {
  const prisma = getPrisma()
  const grouped = await prisma.opportunities.groupBy({
    by: ['stageId'],
    where: { status: 'active', stageId: 'P7' },
    _count: { id: true },
    orderBy: { stageId: 'asc' },
  })
  return grouped.map((g) => ({ stageId: g.stageId, count: g._count.id }))
}

export interface OpportunityDetail {
  id: string
  opportunityCode: string
  stageId: string
  status: string
  serviceType: string
  serviceTypeLabel: string
  estimatedAmount: number
  currency: string
  requirements: string | null
  notes: string | null
  destination: string | null
  travelDate: string | null
  expectedCloseDate: string | null
  actualCloseDate: string | null
  createdAt: string
  updatedAt: string
  customer: {
    id: string
    customerId: string
    customerName: string
    phone: string | null
    email: string | null
    wechat: string | null
    level: string | null
  }
  assignee: { id: string; name: string }
  executor: { id: string; name: string; assignedAt: string } | null
  assignedBy: { id: string; name: string } | null
  actionLogs: {
    id: string
    actionType: string
    actionLabel: string
    remark: string | null
    stageId: string | null
    operatorName: string
    timestamp: string
  }[]
  interactions: {
    id: string
    type: string
    content: string
    operatorName: string
    createdAt: string
  }[]
}

/** 获取商机详情 */
export async function getOpportunityDetail(id: string): Promise<OpportunityDetail | null> {
  const prisma = getPrisma()

  const opp = await prisma.opportunities.findUnique({
    where: { id },
    include: {
      customers: {
        select: { id: true, customerId: true, customerName: true, phone: true, email: true, wechat: true, level: true },
      },
      users_auth: { select: { id: true, name: true } },
      delivery_assignments: {
        include: {
          users_auth_delivery_assignments_executorIdTousers_auth: { select: { id: true, name: true } },
          users_auth_delivery_assignments_assignedByIdTousers_auth: { select: { id: true, name: true } },
        },
      },
      action_logs: {
        include: { users_auth: { select: { name: true } } },
        orderBy: { timestamp: 'desc' },
        take: 50,
      },
      interactions: {
        include: { users_auth: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 30,
      },
    },
  })

  if (!opp) return null

  const da = opp.delivery_assignments

  return {
    id: opp.id,
    opportunityCode: opp.opportunityCode,
    stageId: opp.stageId,
    status: opp.status,
    serviceType: opp.serviceType,
    serviceTypeLabel: opp.serviceTypeLabel,
    estimatedAmount: opp.estimatedAmount,
    currency: opp.currency,
    requirements: opp.requirements,
    notes: opp.notes,
    destination: opp.destination,
    travelDate: opp.travelDate?.toISOString() ?? null,
    expectedCloseDate: opp.expectedCloseDate?.toISOString() ?? null,
    actualCloseDate: opp.actualCloseDate?.toISOString() ?? null,
    createdAt: opp.createdAt.toISOString(),
    updatedAt: opp.updatedAt.toISOString(),
    customer: {
      id: opp.customers.id,
      customerId: opp.customers.customerId,
      customerName: opp.customers.customerName,
      phone: opp.customers.phone,
      email: opp.customers.email,
      wechat: opp.customers.wechat,
      level: opp.customers.level,
    },
    assignee: { id: opp.users_auth.id, name: opp.users_auth.name },
    executor: da ? {
      id: da.users_auth_delivery_assignments_executorIdTousers_auth.id,
      name: da.users_auth_delivery_assignments_executorIdTousers_auth.name,
      assignedAt: da.assignedAt.toISOString(),
    } : null,
    assignedBy: da ? {
      id: da.users_auth_delivery_assignments_assignedByIdTousers_auth.id,
      name: da.users_auth_delivery_assignments_assignedByIdTousers_auth.name,
    } : null,
    actionLogs: opp.action_logs.map((log) => ({
      id: log.id,
      actionType: log.actionType,
      actionLabel: log.actionLabel,
      remark: log.remark,
      stageId: log.stageId,
      operatorName: log.users_auth.name,
      timestamp: log.timestamp.toISOString(),
    })),
    interactions: opp.interactions.map((i) => ({
      id: i.id,
      type: i.type,
      content: i.content,
      operatorName: i.users_auth?.name ?? '系统',
      createdAt: i.createdAt.toISOString(),
    })),
  }
}

/** 添加商机备注 */
export async function addOpportunityNote(
  opportunityId: string,
  operatorId: string,
  organizationId: string,
  content: string,
) {
  const prisma = getPrisma()

  const opp = await prisma.opportunities.findUnique({
    where: { id: opportunityId },
    select: { customerId: true },
  })
  if (!opp) throw new Error('Opportunity not found')

  await prisma.interactions.create({
    data: {
      id: randomUUID(),
      organizationId,
      opportunityId,
      customerId: opp.customerId,
      operatorId,
      type: 'NOTE',
      content,
      updatedAt: new Date(),
    },
  })

  return { success: true }
}

/** 变更商机阶段 */
export async function updateOpportunityStage(
  opportunityId: string,
  newStageId: string,
  operatorId: string,
  organizationId: string,
) {
  const prisma = getPrisma()

  const opp = await prisma.opportunities.findUnique({
    where: { id: opportunityId },
    select: { stageId: true },
  })
  if (!opp) throw new Error('Opportunity not found')

  const oldStageId = opp.stageId

  await prisma.$transaction([
    prisma.opportunities.update({
      where: { id: opportunityId },
      data: { stageId: newStageId, updatedAt: new Date() },
    }),
    prisma.action_logs.create({
      data: {
        id: randomUUID(),
        organizationId,
        opportunityId,
        operatorId,
        stageId: newStageId,
        actionType: 'STAGE_CHANGE',
        actionLabel: `阶段变更: ${oldStageId} → ${newStageId}`,
      },
    }),
  ])

  return { success: true }
}
