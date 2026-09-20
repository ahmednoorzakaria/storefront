import type { Prisma, PrismaClient, StockTransactionType } from "@prisma/client";
import { prisma } from "../prisma";
import { AppError, assertPositiveQuantity } from "../utils/errors";
import { audit } from "./auditService";

type Db = PrismaClient | Prisma.TransactionClient;

export async function findOrCreateVariant(input: {
  designNumber: string;
  designName: string;
  description?: string;
  category?: string;
  color: string;
  size: string;
  unit?: string;
  minimumStock?: number;
}, db: Db = prisma) {
  const designNumber = input.designNumber.trim();
  const color = input.color.trim();
  const size = input.size.trim();
  if (!designNumber) throw new AppError("Design number cannot be empty.");
  if (!input.designName.trim()) throw new AppError("Design name cannot be empty.");
  if (!color || !size) throw new AppError("Color and size are required.");

  const design = await db.design.upsert({
    where: { designNumber },
    update: {
      name: input.designName.trim(),
      description: input.description,
      category: input.category
    },
    create: {
      designNumber,
      name: input.designName.trim(),
      description: input.description,
      category: input.category
    }
  });

  return db.productVariant.upsert({
    where: { designId_color_size: { designId: design.id, color, size } },
    update: {
      unit: input.unit || "pieces",
      minimumStock: input.minimumStock ?? undefined
    },
    create: {
      designId: design.id,
      color,
      size,
      unit: input.unit || "pieces",
      minimumStock: input.minimumStock || 0
    },
    include: { design: true }
  });
}

export async function moveStock(input: {
  variantId: number;
  type: StockTransactionType;
  quantity: number;
  reason?: string;
  reference?: string;
  performedById: number;
  removalRequestId?: number;
}, db: Db = prisma) {
  assertPositiveQuantity(Math.abs(input.quantity));

  const variant = await db.productVariant.findUnique({
    where: { id: input.variantId },
    include: { design: true }
  });
  if (!variant) throw new AppError("Product variant not found.", 404);

  const quantityBefore = variant.currentQuantity;
  const signedQuantity = input.type === "REMOVAL" || input.type === "REVERSAL"
    ? -Math.abs(input.quantity)
    : input.quantity;
  const quantityAfter = quantityBefore + signedQuantity;

  if (quantityAfter < 0) {
    throw new AppError(`Insufficient stock. Available quantity: ${quantityBefore}.`);
  }

  await db.productVariant.update({
    where: { id: input.variantId },
    data: { currentQuantity: quantityAfter }
  });

  const transaction = await db.stockTransaction.create({
    data: {
      variantId: input.variantId,
      type: input.type,
      quantity: signedQuantity,
      quantityBefore,
      quantityAfter,
      reason: input.reason,
      reference: input.reference,
      performedById: input.performedById,
      removalRequestId: input.removalRequestId
    }
  });

  await audit({
    userId: input.performedById,
    action: `STOCK_${input.type}`,
    entityType: "StockTransaction",
    entityId: transaction.id,
    description: `${input.type} ${Math.abs(signedQuantity)} pieces for ${variant.design.designNumber} ${variant.color} ${variant.size}. Stock: ${quantityBefore} -> ${quantityAfter}.`
  }, db);

  return transaction;
}

export async function receiveGoods(input: {
  designNumber: string;
  designName: string;
  description?: string;
  category?: string;
  color: string;
  size: string;
  quantity: number;
  dateReceived?: string;
  supplier?: string;
  reference?: string;
  notes?: string;
  userId: number;
}) {
  assertPositiveQuantity(input.quantity);

  return prisma.$transaction(async (tx) => {
    const variant = await findOrCreateVariant(input, tx);
    return moveStock({
      variantId: variant.id,
      type: "RECEIPT",
      quantity: input.quantity,
      reason: input.notes || input.supplier || "Goods received",
      reference: input.reference,
      performedById: input.userId
    }, tx);
  });
}
