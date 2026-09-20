import { Boxes, ClipboardCheck, ClipboardList, FileClock, FileText, Home, LogOut, PackagePlus, Search, ShieldCheck, Users } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home, permission: "dashboard:view" },
  { to: "/stock", label: "Stock", icon: Boxes, permission: "stock:view" },
  { to: "/designs", label: "Designs", icon: Search, permission: "stock:view" },
  { to: "/receive", label: "Receive Goods", icon: PackagePlus, permission: "stock:receive" },
  { to: "/remove", label: "Remove Goods", icon: ClipboardList, permission: "removals:create" },
  { to: "/approvals", label: "Approvals", icon: ClipboardCheck, permission: "removals:approve" },
  { to: "/transactions", label: "Transactions", icon: FileClock, permission: "stock:view" },
  { to: "/reports", label: "Reports", icon: FileText, permission: "reports:view" },
  { to: "/users", label: "Users", icon: Users, permission: "users:manage" },
  { to: "/audit", label: "Audit Log", icon: ShieldCheck, permission: "audit:view" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout, can } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">SMS</span>
          <span>Store Management</span>
        </Link>
        <nav>
          {navItems.filter((item) => can(item.permission)).map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <strong>{user?.username}</strong>
            <span className="muted"> {user?.role}</span>
          </div>
          <button className="icon-text" onClick={logout}>
            <LogOut size={18} /> Logout
          </button>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  );
}
