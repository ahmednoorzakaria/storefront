import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth, requirePermission } from "../middleware/auth";
import { approveRemovalRequest, createRemovalRequest, rejectRemovalRequest } from "../services/removalService";

export const removalsRouter = Router();

removalsRouter.use(requireAuth);

removalsRouter.get("/", requirePermission("removals:view"), async (req, res, next) => {
  try {
    const status = String(req.query.status || "");
    const requests = await prisma.removalRequest.findMany({
      where: status ? { status: status as never } : undefined,
      include: {
        variant: { include: { design: true } },
        requestedBy: { select: { username: true, role: true } },
        approvedBy: { select: { username: true, role: true } },
        rejectedBy: { select: { username: true, role: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

const requestSchema = z.object({
  variantId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
  reason: z.string().min(1),
  destination: z.string().optional(),
  notes: z.string().optional()
});

removalsRouter.post("/", requirePermission("removals:create"), async (req, res, next) => {
  try {
    const input = requestSchema.parse(req.body);
    const request = await createRemovalRequest({ ...input, userId: req.user!.id });
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
});

removalsRouter.post("/:id/approve", requirePermission("removals:approve"), async (req, res, next) => {
  try {
    const result = await approveRemovalRequest({
      requestId: Number(req.params.id),
      approverId: req.user!.id,
      approverRole: req.user!.role,
      comment: String(req.body.comment || "")
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

removalsRouter.post("/:id/reject", requirePermission("removals:approve"), async (req, res, next) => {
  try {
    const result = await rejectRemovalRequest({
      requestId: Number(req.params.id),
      rejecterId: req.user!.id,
      rejecterRole: req.user!.role,
      reason: String(req.body.reason || "")
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});
