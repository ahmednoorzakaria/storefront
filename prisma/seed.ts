import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: ["dashboard:view", "users:manage", "designs:manage", "stock:view", "stock:receive", "stock:adjust", "removals:create", "removals:view", "removals:approve", "reports:view", "audit:view", "backup:create"],
  YCT: ["dashboard:view", "stock:view", "stock:receive", "removals:create", "removals:view", "removals:approve", "reports:view", "audit:view"],
  CCT: ["dashboard:view", "stock:view", "stock:receive", "removals:create", "removals:view", "removals:approve", "reports:view", "audit:view"],
  ACT: ["dashboard:view", "stock:view", "stock:receive", "removals:create", "removals:view", "reports:view"],
  AACT: ["dashboard:view", "stock:view", "stock:receive", "removals:create", "removals:view", "reports:view"]
};

async function main() {
  const users: Array<{ username: string; role: UserRole; password: string }> = [
    { username: "Admin", role: "ADMIN", password: "Admin@123" },
    { username: "YCT", role: "YCT", password: "YCT@123" },
    { username: "CCT", role: "CCT", password: "CCT@123" },
    { username: "ACT", role: "ACT", password: "ACT@123" },
    { username: "AACT", role: "AACT", password: "AACT@123" }
  ];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 12);
    const saved = await prisma.user.upsert({
      where: { username: user.username },
      update: { role: user.role, active: true, passwordHash },
      create: { username: user.username, role: user.role, passwordHash }
    });

    for (const key of rolePermissions[user.role]) {
      await prisma.permission.upsert({
        where: { userId_key: { userId: saved.id, key } },
        update: { enabled: true },
        create: { userId: saved.id, key, enabled: true }
      });
    }
  }

  const design = await prisma.design.upsert({
    where: { designNumber: "DES-001" },
    update: {},
    create: {
      designNumber: "DES-001",
      name: "Example Dress",
      description: "Seed design for testing store movements",
      category: "Dress"
    }
  });

  await prisma.productVariant.upsert({
    where: { designId_color_size: { designId: design.id, color: "Black", size: "M" } },
    update: {},
    create: { designId: design.id, color: "Black", size: "M", minimumStock: 5 }
  });

  await prisma.auditLog.create({
    data: {
      action: "SEED",
      entityType: "System",
      description: "Seeded initial users. Temporary passwords: Admin@123, YCT@123, CCT@123, ACT@123, AACT@123. Change before production."
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
