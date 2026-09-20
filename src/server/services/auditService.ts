import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../prisma";

type Db = PrismaClient | Prisma.TransactionClient;

export async function audit(data: {
  userId?: number | null;
  action: string;
  entityType?: string;
  entityId?: number;
  description: string;
  ipAddress?: string;
}, db: Db = prisma) {
  return db.auditLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      description: data.description,
      ipAddress: data.ipAddress
    }
  });
}
