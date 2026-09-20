import { beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { prisma } from "../src/server/prisma";
import { receiveGoods } from "../src/server/services/stockService";
import { approveRemovalRequest, createRemovalRequest, rejectRemovalRequest } from "../src/server/services/removalService";

async function createUser(username: string, role: "ADMIN" | "YCT" | "CCT" | "ACT" | "AACT") {
  return prisma.user.create({
    data: {
      username,
      role,
      passwordHash: await bcrypt.hash("Password@123", 4)
    }
  });
}

async function resetDb() {
  await prisma.auditLog.deleteMany();
  await prisma.stockTransaction.deleteMany();
  await prisma.removalRequest.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.design.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.user.deleteMany();
}

async function stockedVariant(quantity = 100) {
  const act = await createUser("ACT", "ACT");
  await receiveGoods({
    designNumber: "DES-TEST",
    designName: "Test Design",
    color: "Black",
    size: "M",
    quantity,
    userId: act.id
  });
  const variant = await prisma.productVariant.findFirstOrThrow({ include: { design: true } });
  return { act, variant };
}

beforeEach(async () => {
  await resetDb();
});

describe("store accountability business rules", () => {
  it("receiving goods increases stock and creates a transaction plus audit log", async () => {
    const act = await createUser("ACT", "ACT");
    await receiveGoods({
      designNumber: "DES-001",
      designName: "Example Dress",
      color: "Black",
      size: "M",
      quantity: 100,
      userId: act.id
    });

    const variant = await prisma.productVariant.findFirstOrThrow();
    const transactions = await prisma.stockTransaction.findMany();
    const auditLogs = await prisma.auditLog.findMany();

    expect(variant.currentQuantity).toBe(100);
    expect(transactions).toHaveLength(1);
    expect(transactions[0].type).toBe("RECEIPT");
    expect(auditLogs.some((log) => log.action === "STOCK_RECEIPT")).toBe(true);
  });

  it("pending and rejected removals do not decrease stock", async () => {
    const { act, variant } = await stockedVariant();
    const yct = await createUser("YCT", "YCT");

    const request = await createRemovalRequest({
      variantId: variant.id,
      quantity: 10,
      reason: "Shop transfer",
      userId: act.id
    });

    expect((await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } })).currentQuantity).toBe(100);

    await rejectRemovalRequest({
      requestId: request.id,
      rejecterId: yct.id,
      rejecterRole: "YCT",
      reason: "Not approved today"
    });

    expect((await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } })).currentQuantity).toBe(100);
  });

  it("YCT can approve another user's request and stock decreases once", async () => {
    const { act, variant } = await stockedVariant();
    const yct = await createUser("YCT", "YCT");
    const request = await createRemovalRequest({
      variantId: variant.id,
      quantity: 10,
      reason: "Shop transfer",
      userId: act.id
    });

    await approveRemovalRequest({
      requestId: request.id,
      approverId: yct.id,
      approverRole: "YCT",
      comment: "Approved"
    });

    const updated = await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } });
    const removalTransactions = await prisma.stockTransaction.findMany({ where: { type: "REMOVAL" } });
    expect(updated.currentQuantity).toBe(90);
    expect(removalTransactions).toHaveLength(1);

    await expect(approveRemovalRequest({
      requestId: request.id,
      approverId: yct.id,
      approverRole: "YCT"
    })).rejects.toThrow("already been approved");

    expect((await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } })).currentQuantity).toBe(90);
  });

  it("CCT can approve another user's request", async () => {
    const { act, variant } = await stockedVariant();
    const cct = await createUser("CCT", "CCT");
    const request = await createRemovalRequest({ variantId: variant.id, quantity: 5, reason: "Department issue", userId: act.id });

    await approveRemovalRequest({ requestId: request.id, approverId: cct.id, approverRole: "CCT" });

    expect((await prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } })).currentQuantity).toBe(95);
  });

  it("self approval and ACT or AACT approval are blocked", async () => {
    const { variant } = await stockedVariant();
    const yct = await createUser("YCT", "YCT");
    const aact = await createUser("AACT", "AACT");
    const request = await createRemovalRequest({ variantId: variant.id, quantity: 5, reason: "Transfer", userId: yct.id });

    await expect(approveRemovalRequest({ requestId: request.id, approverId: yct.id, approverRole: "YCT" })).rejects.toThrow("cannot approve your own");
    await expect(approveRemovalRequest({ requestId: request.id, approverId: aact.id, approverRole: "AACT" })).rejects.toThrow("Only YCT or CCT");
  });

  it("cannot request more than available", async () => {
    const { act, variant } = await stockedVariant(10);

    await expect(createRemovalRequest({
      variantId: variant.id,
      quantity: 15,
      reason: "Too much",
      userId: act.id
    })).rejects.toThrow("Insufficient stock. Available quantity: 10.");
  });

  it("timeline events are chronological", async () => {
    const { act, variant } = await stockedVariant();
    const yct = await createUser("YCT", "YCT");
    const request = await createRemovalRequest({ variantId: variant.id, quantity: 3, reason: "Shop", userId: act.id });
    await approveRemovalRequest({ requestId: request.id, approverId: yct.id, approverRole: "YCT" });

    const transactions = await prisma.stockTransaction.findMany({
      where: { variantId: variant.id },
      orderBy: { createdAt: "asc" }
    });

    expect(transactions.map((tx) => tx.type)).toEqual(["RECEIPT", "REMOVAL"]);
    expect(transactions[0].createdAt.getTime()).toBeLessThanOrEqual(transactions[1].createdAt.getTime());
  });
});
