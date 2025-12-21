// @ts-nocheck
// Add type declaration to globalThis for prisma
import { PrismaClient } from '@prisma/client';
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient({
    log: ['query', 'error', 'warn', 'info'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;