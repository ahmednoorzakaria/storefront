import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { StockPage } from "./pages/StockPage";
import { ReceivePage } from "./pages/ReceivePage";
import { RemovalPage } from "./pages/RemovalPage";
import { ApprovalsPage } from "./pages/ApprovalsPage";
import { DesignsPage } from "./pages/DesignsPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { AuditPage } from "./pages/AuditPage";
import { UsersPage } from "./pages/UsersPage";
import { TimelinePage } from "./pages/TimelinePage";
import "./styles.css";

function ProtectedApp() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/stock" element={<StockPage />} />
        <Route path="/designs" element={<DesignsPage />} />
        <Route path="/receive" element={<ReceivePage />} />
        <Route path="/remove" element={<RemovalPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/timeline/:id" element={<TimelinePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedApp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
