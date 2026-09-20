import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import { AppError } from "../utils/errors";

export type AuthUser = {
  id: number;
  username: string;
  role: "ADMIN" | "YCT" | "CCT" | "ACT" | "AACT";
  permissions: string[];
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const jwtSecret = process.env.JWT_SECRET || "development-secret";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) throw new AppError("Login required.", 401);

    const payload = jwt.verify(token, jwtSecret) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { permissions: true }
    });
    if (!user || !user.active) throw new AppError("User account is inactive or not found.", 401);

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions.filter((item) => item.enabled).map((item) => item.key)
    };
    next();
  } catch (error) {
    next(error);
  }
}

export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Login required.", 401));
    if (req.user.role === "ADMIN" || req.user.permissions.includes(permission)) return next();
    return next(new AppError("You do not have permission to perform this action.", 403));
  };
}

export function signToken(userId: number) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "12h" });
}
