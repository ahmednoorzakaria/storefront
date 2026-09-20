import { useEffect, useState } from "react";
import { api, formatDate } from "../lib/api";

type Log = { id: number; action: string; description: string; entityType?: string; entityId?: number; createdAt: string; user?: { username: string } };

export function AuditPage() {
  const [rows, setRows] = useState<Log[]>([]);
  useEffect(() => {
    api<Log[]>("/api/audit-logs").then(setRows);
  }, []);

  return (
    <>
      <div className="page-title"><div><h1>Audit Log</h1><p className="muted">System activity log. Normal users cannot modify these records.</p></div></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>User</th><th>Action</th><th>Entity</th><th>Description</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.createdAt)}</td>
                <td>{row.user?.username || "System"}</td>
                <td>{row.action}</td>
                <td>{row.entityType || "-"} {row.entityId || ""}</td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
