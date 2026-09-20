import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth, requirePermission } from "../middleware/auth";
import { audit } from "../services/auditService";
import { AppError } from "../utils/errors";

export const designsRouter = Router();

designsRouter.use(requireAuth);

designsRouter.get("/", requirePermission("stock:view"), async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    const designs = await prisma.design.findMany({
      where: q
        ? {
            OR: [
              { designNumber: { contains: q } },
              { name: { contains: q } },
              { variants: { some: { OR: [{ color: { contains: q } }, { size: { contains: q } }] } } }
            ]
          }
        : undefined,
      include: { variants: true },
      orderBy: { designNumber: "asc" }
    });
    res.json(designs);
  } catch (error) {
    next(error);
  }
});

const designSchema = z.object({
  designNumber: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  active: z.boolean().optional()
});

designsRouter.post("/", requirePermission("designs:manage"), async (req, res, next) => {
  try {
    const input = designSchema.parse(req.body);
    const existing = await prisma.design.findUnique({ where: { designNumber: input.designNumber } });
    if (existing) throw new AppError("Design number already exists.");

    const design = await prisma.design.create({ data: input });
    await audit({
      userId: req.user!.id,
      action: "DESIGN_CREATED",
      entityType: "Design",
      entityId: design.id,
      description: `Created design ${design.designNumber}.`
    });
    res.status(201).json(design);
  } catch (error) {
    next(error);
  }
});

designsRouter.get("/:id/timeline", requirePermission("stock:view"), async (req, res, next) => {
  try {
    const designId = Number(req.params.id);
    const design = await prisma.design.findUnique({
      where: { id: designId },
      include: { variants: true }
    });
    if (!design) throw new AppError("Design not found.", 404);

    const variantIds = design.variants.map((variant) => variant.id);
    const [transactions, requests] = await Promise.all([
      prisma.stockTransaction.findMany({
        where: { variantId: { in: variantIds } },
        include: {
          performedBy: { select: { username: true, role: true } },
          variant: true,
          removalRequest: true
        }
      }),
      prisma.removalRequest.findMany({
        where: { variantId: { in: variantIds } },
        include: {
          requestedBy: { select: { username: true, role: true } },
          approvedBy: { select: { username: true, role: true } },
          rejectedBy: { select: { username: true, role: true } },
          variant: true
        }
      })
    ]);

    const events = [
      ...transactions.map((item) => ({
        id: `transaction-${item.id}`,
        type: item.type,
        createdAt: item.createdAt,
        title: `${item.type} ${Math.abs(item.quantity)} pieces`,
        description: `${item.variant.color} ${item.variant.size}. Stock ${item.quantityBefore} -> ${item.quantityAfter}. ${item.reason || ""}`,
        user: item.performedBy
      })),
      ...requests.map((item) => ({
        id: `request-${item.id}`,
        type: "REMOVAL_REQUEST",
        createdAt: item.createdAt,
        title: `Removal requested: ${item.quantity} pieces`,
        description: `${item.variant.color} ${item.variant.size}. Reason: ${item.reason}. Status: ${item.status}.`,
        user: item.requestedBy
      })),
      ...requests.flatMap((item) => {
        const approval = item.approvedAt
          ? [{
              id: `approval-${item.id}`,
              type: "APPROVAL",
              createdAt: item.approvedAt,
              title: `Removal approved: ${item.quantity} pieces`,
              description: item.approvalComment || "Approved",
              user: item.approvedBy
            }]
          : [];
        const rejection = item.rejectedAt
          ? [{
              id: `rejection-${item.id}`,
              type: "REJECTION",
              createdAt: item.rejectedAt,
              title: `Removal rejected: ${item.quantity} pieces`,
              description: item.rejectionReason || "Rejected",
              user: item.rejectedBy
            }]
          : [];
        return [...approval, ...rejection];
      })
    ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    res.json({ design, events });
  } catch (error) {
    next(error);
  }
});
