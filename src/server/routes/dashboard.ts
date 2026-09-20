import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";

export const dashboardRouter = Router();

dashboardRouter.get("/", requireAuth, async (_req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const [totalDesigns, variants, receivedToday, removedToday, pending, recentActivity] = await Promise.all([
      prisma.design.count({ where: { active: true } }),
      prisma.productVariant.findMany({ select: { currentQuantity: true } }),
      prisma.stockTransaction.aggregate({
        where: { type: "RECEIPT", createdAt: { gte: start } },
        _sum: { quantity: true }
      }),
      prisma.stockTransaction.aggregate({
        where: { type: "REMOVAL", createdAt: { gte: start } },
        _sum: { quantity: true }
      }),
      prisma.removalRequest.count({ where: { status: "PENDING" } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { user: { select: { username: true, role: true } } }
      })
    ]);

    res.json({
      totalDesigns,
      totalPieces: variants.reduce((sum, item) => sum + item.currentQuantity, 0),
      receivedToday: receivedToday._sum.quantity || 0,
      removedToday: Math.abs(removedToday._sum.quantity || 0),
      pendingApprovals: pending,
      recentActivity
    });
  } catch (error) {
    next(error);
  }
});
