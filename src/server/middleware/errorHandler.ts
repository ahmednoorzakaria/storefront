import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.status).json({ error: error.message });
  }

  if (error instanceof Error) {
    console.error(error);
  }

  return res.status(500).json({ error: "Something went wrong. Please try again." });
}
