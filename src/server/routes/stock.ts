import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth, requirePermission } from "../middleware/auth";
import { receiveGoods, moveStock } from "../services/stockService";
import { AppError } from "../utils/errors";

export const stockRouter = Router();

stockRouter.use(requireAuth);

stockRouter.get("/", requirePermission("stock:view"), async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    const filter = String(req.query.filter || "");
    const variants = await prisma.productVariant.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { color: { contains: q } },
                  { size: { contains: q } },
                  { design: { designNumber: { contains: q } } },
                  { design: { name: { contains: q } } }
                ]
              }
            : {},
          filter === "low" ? { currentQuantity: { lte: prisma.productVariant.fields.minimumStock } } : {},
          filter === "out" ? { currentQuantity: 0 } : {},
          filter === "available" ? { currentQuantity: { gt: 0 } } : {}
        ]
      },
      include: { design: true },
      orderBy: [{ design: { designNumber: "asc" } }, { color: "asc" }, { size: "asc" }]
    });
    res.json(variants);
  } catch (error) {
    next(error);
  }
});

const receiveSchema = z.object({
  designNumber: z.string().min(1),
  designName: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  color: z.string().min(1),
  size: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  dateReceived: z.string().optional(),
  supplier: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional()
});

stockRouter.post("/receive", requirePermission("stock:receive"), async (req, res, next) => {
  try {
    const input = receiveSchema.parse(req.body);
    const transaction = await receiveGoods({ ...input, userId: req.user!.id });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
});

const adjustmentSchema = z.object({
  variantId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int(),
  reason: z.string().min(1),
  reference: z.string().optional()
});

stockRouter.post("/adjust", requirePermission("stock:adjust"), async (req, res, next) => {
  try {
    const input = adjustmentSchema.parse(req.body);
    if (input.quantity === 0) throw new AppError("Adjustment quantity cannot be zero.");
    const tx = await prisma.$transaction(async (db) => {
      return moveStock({
        variantId: input.variantId,
        type: input.quantity < 0 ? "REVERSAL" : "ADJUSTMENT",
        quantity: Math.abs(input.quantity),
        reason: input.reason,
        reference: input.reference,
        performedById: req.user!.id
      }, db);
    });
    res.status(201).json(tx);
  } catch (error) {
    next(error);
  }
});
