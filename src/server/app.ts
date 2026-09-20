import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { adminRouter } from "./routes/admin";
import { auditRouter } from "./routes/audit";
import { authRouter } from "./routes/auth";
import { dashboardRouter } from "./routes/dashboard";
import { designsRouter } from "./routes/designs";
import { removalsRouter } from "./routes/removals";
import { reportsRouter } from "./routes/reports";
import { stockRouter } from "./routes/stock";
import { transactionsRouter } from "./routes/transactions";
import { errorHandler } from "./middleware/errorHandler";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/designs", designsRouter);
  app.use("/api/stock", stockRouter);
  app.use("/api/removal-requests", removalsRouter);
  app.use("/api/transactions", transactionsRouter);
  app.use("/api/audit-logs", auditRouter);
  app.use("/api/reports", reportsRouter);
  app.use("/api/admin", adminRouter);

  const builtClientDir = path.resolve(process.cwd(), "dist/client");
  const sourceClientDir = path.resolve(__dirname, "../client");
  const clientDir = path.resolve(builtClientDir);
  app.use(express.static(clientDir));
  app.get("*", (_req, res) => {
    const indexPath = path.join(clientDir, "index.html");
    res.sendFile(indexPath, (error) => {
      if (error) {
        res.status(404).send(`Frontend build not found. Run npm run build. Dev source: ${sourceClientDir}`);
      }
    });
  });

  app.use(errorHandler);
  return app;
}
