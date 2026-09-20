import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatDate } from "../lib/api";
import { useAuth } from "../components/AuthContext";

type Dashboard = {
  totalDesigns: number;
  totalPieces: number;
  receivedToday: number;
  removedToday: number;
  pendingApprovals: number;
  recentActivity: Array<{ id: number; action: string; description: string; createdAt: string; user?: { username: string } }>;
};

export function DashboardPage() {
  const { can } = useAuth();
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    api<Dashboard>("/api/dashboard").then(setData);
  }, []);

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Current store position and recent accountability trail.</p>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat"><span>Total designs</span><strong>{data?.totalDesigns ?? "-"}</strong></div>
        <div className="stat"><span>Pieces in store</span><strong>{data?.totalPieces ?? "-"}</strong></div>
        <div className="stat"><span>Received today</span><strong>{data?.receivedToday ?? "-"}</strong></div>
        <div className="stat"><span>Removed today</span><strong>{data?.removedToday ?? "-"}</strong></div>
        <div className="stat"><span>Pending approvals</span><strong>{data?.pendingApprovals ?? "-"}</strong></div>
      </div>
      <div className="panel">
        <h2>Quick Actions</h2>
        <div className="toolbar">
          {can("stock:receive") && <Link className="primary" to="/receive">Receive Goods</Link>}
          {can("removals:create") && <Link className="secondary" to="/remove">Request Removal</Link>}
          {can("removals:approve") && <Link className="secondary" to="/approvals">Approve Removal</Link>}
          {can("stock:view") && <Link className="secondary" to="/stock">View Stock</Link>}
          {can("stock:view") && <Link className="secondary" to="/designs">Search Design</Link>}
        </div>
      </div>
      <div className="panel">
        <h2>Recent Activity</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>User</th><th>Action</th><th>Description</th></tr></thead>
            <tbody>
              {data?.recentActivity.map((row) => (
                <tr key={row.id}>
                  <td>{formatDate(row.createdAt)}</td>
                  <td>{row.user?.username || "System"}</td>
                  <td>{row.action}</td>
                  <td>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
