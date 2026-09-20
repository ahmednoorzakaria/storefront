import { RemovalStatus } from "@prisma/client";
import { prisma } from "../prisma";
import { AppError, assertPositiveQuantity } from "../utils/errors";
import { canApprove } from "../utils/permissions";
import { audit } from "./auditService";
import { moveStock } from "./stockService";

export async function createRemovalRequest(input: {
  variantId: number;
  quantity: number;
  reason: string;
  destination?: string;
  notes?: string;
  userId: number;
}) {
  assertPositiveQuantity(input.quantity);
  if (!input.reason.trim()) throw new AppError("Reason for removal is required.");

  const variant = await prisma.productVariant.findUnique({
    where: { id: input.variantId },
    include: { design: true }
  });
  if (!variant) throw new AppError("Product variant not found.", 404);
  if (variant.currentQuantity < input.quantity) {
    throw new AppError(`Insufficient stock. Available quantity: ${variant.currentQuantity}.`);
  }

  const request = await prisma.removalRequest.create({
    data: {
      variantId: input.variantId,
      quantity: input.quantity,
      reason: input.reason,
      destination: input.destination,
      notes: input.notes,
      requestedById: input.userId,
      stockAtRequest: variant.currentQuantity
    },
    include: { variant: { include: { design: true } }, requestedBy: true }
  });

  await audit({
    userId: input.userId,
    action: "REMOVAL_REQUESTED",
    entityType: "RemovalRequest",
    entityId: request.id,
    description: `Requested removal of ${input.quantity} pieces from ${variant.design.designNumber} ${variant.color} ${variant.size}.`
  });

  return request;
}

export async function approveRemovalRequest(input: {
  requestId: number;
  approverId: number;
  approverRole: "ADMIN" | "YCT" | "CCT" | "ACT" | "AACT";
  comment?: string;
}) {
  if (!canApprove(input.approverRole)) {
    throw new AppError("Only YCT or CCT can approve removal requests.", 403);
  }

  return prisma.$transaction(async (tx) => {
    const request = await tx.removalRequest.findUnique({
      where: { id: input.requestId },
      include: { variant: { include: { design: true } }, requestedBy: true }
    });
    if (!request) throw new AppError("Removal request not found.", 404);
    if (request.requestedById === input.approverId) {
      throw new AppError("You cannot approve your own removal request.", 403);
    }
    if (request.status === RemovalStatus.APPROVED || request.status === RemovalStatus.COMPLETED) {
      throw new AppError("This removal request has already been approved.");
    }
    if (request.status === RemovalStatus.REJECTED) {
      throw new AppError("This removal request has already been rejected.");
    }
    if (request.status !== RemovalStatus.PENDING) {
      throw new AppError("Only pending requests can be approved.");
    }
    if (request.variant.currentQuantity < request.quantity) {
      throw new AppError(`Insufficient stock. Available quantity: ${request.variant.currentQuantity}.`);
    }

    await tx.removalRequest.update({
      where: { id: input.requestId },
      data: {
        status: "COMPLETED",
        approvedById: input.approverId,
        approvedAt: new Date(),
        approvalComment: input.comment
      }
    });

    const transaction = await moveStock({
      variantId: request.variantId,
      type: "REMOVAL",
      quantity: request.quantity,
      reason: request.reason,
      reference: `Removal request #${request.id}`,
      performedById: input.approverId,
      removalRequestId: request.id
    }, tx);

    await audit({
      userId: input.approverId,
      action: "REMOVAL_APPROVED",
      entityType: "RemovalRequest",
      entityId: request.id,
      description: `Approved removal request #${request.id} for ${request.quantity} pieces.`
    }, tx);

    return transaction;
  });
}

export async function rejectRemovalRequest(input: {
  requestId: number;
  rejecterId: number;
  rejecterRole: "ADMIN" | "YCT" | "CCT" | "ACT" | "AACT";
  reason: string;
}) {
  if (!canApprove(input.rejecterRole)) {
    throw new AppError("Only YCT or CCT can reject removal requests.", 403);
  }
  if (!input.reason.trim()) throw new AppError("Rejection reason is required.");

  return prisma.$transaction(async (tx) => {
    const request = await tx.removalRequest.findUnique({ where: { id: input.requestId } });
    if (!request) throw new AppError("Removal request not found.", 404);
    if (request.requestedById === input.rejecterId) {
      throw new AppError("You cannot reject your own removal request.", 403);
    }
    if (request.status !== RemovalStatus.PENDING) {
      throw new AppError("Only pending requests can be rejected.");
    }

    const updated = await tx.removalRequest.update({
      where: { id: input.requestId },
      data: {
        status: "REJECTED",
        rejectedById: input.rejecterId,
        rejectedAt: new Date(),
        rejectionReason: input.reason
      }
    });

    await audit({
      userId: input.rejecterId,
      action: "REMOVAL_REJECTED",
      entityType: "RemovalRequest",
      entityId: request.id,
      description: `Rejected removal request #${request.id}: ${input.reason}`
    }, tx);

    return updated;
  });
}
