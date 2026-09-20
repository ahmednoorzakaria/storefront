import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, requirePermission } from "../middleware/auth";

export const auditRouter = Router();

auditRouter.get("/", requireAuth, requirePermission("audit:view"), async (_req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: { select: { username: true, role: true } } },
      orderBy: { createdAt: "desc" },
      take: 300
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
});
