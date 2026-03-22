// Shared display configs for stages, statuses, and service types
// 交付中心仅展示 P7 阶段的数据（商机推到 P7 才进入交付中心）

// 交付中心固定阶段
export const DELIVERY_STAGE = 'P7'

export const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: '进行中', bg: 'bg-[#dbeafe]', text: 'text-[#1d4ed8]' },
  won: { label: '已成交', bg: 'bg-[#d1fae5]', text: 'text-[#047857]' },
  lost: { label: '已流失', bg: 'bg-[#fee2e2]', text: 'text-[#dc2626]' },
}

export const serviceTypeLabels: Record<string, string> = {
  VISA: '签证服务',
  COMPANY_REGISTRATION: '公司注册',
  FACTORY_SETUP: '工厂设立',
  TAX_SERVICES: '税务服务',
  PERMIT_SERVICES: '许可证办理',
  FINANCIAL_SERVICES: '金融服务',
  IMMIGRATION: '移民服务',
  OTHER: '其他',
}
