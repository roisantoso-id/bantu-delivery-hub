import { PrismaClient } from '@/lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient }

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.__prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
    globalForPrisma.__prisma = new PrismaClient({ adapter })
  }
  return globalForPrisma.__prisma
}
