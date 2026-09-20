import { Router } from "express";
import { prisma } from "../prisma";
import { requireAuth, requirePermission } from "../middleware/auth";

export const reportsRouter = Router();

reportsRouter.use(requireAuth, requirePermission("reports:view"));

function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((header) => escape(row[header])).join(","))].join("\n");
}

reportsRouter.get("/stock", async (req, res, next) => {
  try {
    const rows = await prisma.productVariant.findMany({ include: { design: true } });
    const data = rows.map((row) => ({
      designNumber: row.design.designNumber,
      designName: row.design.name,
      color: row.color,
      size: row.size,
      currentQuantity: row.currentQuantity,
      minimumStock: row.minimumStock
    }));
    if (req.query.format === "csv") {
      res.type("text/csv").send(toCsv(data));
      return;
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
});

reportsRouter.get("/receipts", async (req, res, next) => {
  try {
    const rows = await prisma.stockTransaction.findMany({
      where: { type: "RECEIPT" },
      include: { variant: { include: { design: true } }, performedBy: true },
      orderBy: { createdAt: "desc" }
    });
    const data = rows.map((row) => ({
      date: row.createdAt,
      designNumber: row.variant.design.designNumber,
      color: row.variant.color,
      size: row.variant.size,
      quantity: row.quantity,
      user: row.performedBy.username,
      reference: row.reference,
      reason: row.reason
    }));
    if (req.query.format === "csv") return res.type("text/csv").send(toCsv(data));
    res.json(data);
  } catch (error) {
    next(error);
  }
});

reportsRouter.get("/removals", async (req, res, next) => {
  try {
    const rows = await prisma.stockTransaction.findMany({
      where: { type: "REMOVAL" },
      include: { variant: { include: { design: true } }, performedBy: true, removalRequest: { include: { requestedBy: true, approvedBy: true } } },
      orderBy: { createdAt: "desc" }
    });
    const data = rows.map((row) => ({
      date: row.createdAt,
      designNumber: row.variant.design.designNumber,
      color: row.variant.color,
      size: row.variant.size,
      quantity: Math.abs(row.quantity),
      requestedBy: row.removalRequest?.requestedBy.username,
      approvedBy: row.removalRequest?.approvedBy?.username,
      reason: row.reason
    }));
    if (req.query.format === "csv") return res.type("text/csv").send(toCsv(data));
    res.json(data);
  } catch (error) {
    next(error);
  }
});

reportsRouter.get("/audit", async (req, res, next) => {
  try {
    const rows = await prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 500
    });
    const data = rows.map((row) => ({
      date: row.createdAt,
      user: row.user?.username || "System",
      action: row.action,
      entityType: row.entityType,
      entityId: row.entityId,
      description: row.description
    }));
    if (req.query.format === "csv") return res.type("text/csv").send(toCsv(data));
    res.json(data);
  } catch (error) {
    next(error);
  }
});
