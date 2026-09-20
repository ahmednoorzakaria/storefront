import bcrypt from "bcryptjs";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth, requirePermission } from "../middleware/auth";
import { rolePermissions } from "../utils/permissions";
import { audit } from "../services/auditService";

export const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get("/users", requirePermission("users:manage"), async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: { permissions: true },
      orderBy: { username: "asc" }
    });
    res.json(users.map(({ passwordHash: _passwordHash, ...user }) => user));
  } catch (error) {
    next(error);
  }
});

const userSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "YCT", "CCT", "ACT", "AACT"]),
  active: z.boolean().optional()
});

adminRouter.post("/users", requirePermission("users:manage"), async (req, res, next) => {
  try {
    const input = userSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        username: input.username,
        passwordHash,
        role: input.role,
        active: input.active ?? true,
        permissions: {
          create: rolePermissions[input.role].map((key) => ({ key, enabled: true }))
        }
      },
      include: { permissions: true }
    });
    await audit({
      userId: req.user!.id,
      action: "USER_CREATED",
      entityType: "User",
      entityId: user.id,
      description: `Created user ${user.username}.`
    });
    const { passwordHash: _passwordHash, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/backup", requirePermission("backup:create"), async (req, res, next) => {
  try {
    const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
    const dbPath = dbUrl.replace("file:", "");
    const absoluteDb = path.isAbsolute(dbPath) ? dbPath : path.resolve("prisma", dbPath);
    const backupDir = path.resolve("backups");
    if (!existsSync(backupDir)) mkdirSync(backupDir);
    const backupPath = path.join(backupDir, `store-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.db`);
    copyFileSync(absoluteDb, backupPath);
    await audit({
      userId: req.user!.id,
      action: "DATABASE_BACKUP",
      entityType: "System",
      description: `Created database backup ${path.basename(backupPath)}.`
    });
    res.download(backupPath);
  } catch (error) {
    next(error);
  }
});
