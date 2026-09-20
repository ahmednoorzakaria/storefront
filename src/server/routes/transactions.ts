import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, requirePermission } from "../middleware/auth";

export const transactionsRouter = Router();

transactionsRouter.get("/", requireAuth, requirePermission("stock:view"), async (_req, res, next) => {
  try {
    const transactions = await prisma.stockTransaction.findMany({
      include: {
        variant: { include: { design: true } },
        performedBy: { select: { username: true, role: true } },
        removalRequest: true
      },
      orderBy: { createdAt: "desc" },
      take: 500
    });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});
