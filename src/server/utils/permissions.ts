import { UserRole } from "@prisma/client";

export const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: ["dashboard:view", "users:manage", "designs:manage", "stock:view", "stock:receive", "stock:adjust", "removals:create", "removals:view", "removals:approve", "reports:view", "audit:view", "backup:create"],
  YCT: ["dashboard:view", "stock:view", "stock:receive", "removals:create", "removals:view", "removals:approve", "reports:view", "audit:view"],
  CCT: ["dashboard:view", "stock:view", "stock:receive", "removals:create", "removals:view", "removals:approve", "reports:view", "audit:view"],
  ACT: ["dashboard:view", "stock:view", "stock:receive", "removals:create", "removals:view", "reports:view"],
  AACT: ["dashboard:view", "stock:view", "stock:receive", "removals:create", "removals:view", "reports:view"]
};

export function canApprove(role: UserRole) {
  return role === "YCT" || role === "CCT";
}
