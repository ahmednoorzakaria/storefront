import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { audit } from "../services/auditService";
import { AppError } from "../utils/errors";
import { signToken } from "../middleware/auth";

export const authRouter = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { username: input.username },
      include: { permissions: true }
    });
    if (!user || !user.active) throw new AppError("Invalid username or password.", 401);

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new AppError("Invalid username or password.", 401);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });
    await audit({
      userId: user.id,
      action: "LOGIN",
      entityType: "User",
      entityId: user.id,
      description: `${user.username} logged in.`,
      ipAddress: req.ip
    });

    res.json({
      token: signToken(user.id),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions.filter((item) => item.enabled).map((item) => item.key)
      }
    });
  } catch (error) {
    next(error);
  }
});
