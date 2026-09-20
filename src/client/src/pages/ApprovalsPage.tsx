import { useEffect, useState } from "react";
import { ErrorMessage, StatusBadge, SuccessMessage } from "../components/DataState";
import { api, formatDate } from "../lib/api";

type RequestRow = {
  id: number;
  quantity: number;
  reason: string;
  destination?: string;
  status: string;
  stockAtRequest: number;
  createdAt: string;
  requestedBy: { username: string };
  variant: { color: string; size: string; currentQuantity: number; design: { designNumber: string; name: string } };
};

export function ApprovalsPage() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    setRows(await api<RequestRow[]>("/api/removal-requests?status=PENDING"));
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(row: RequestRow) {
    const comment = window.prompt(`Approve removal request #${row.id}? Optional comment:`, "");
    if (comment === null) return;
    setError("");
    setSuccess("");
    try {
      await api(`/api/removal-requests/${row.id}/approve`, { method: "POST", body: JSON.stringify({ comment }) });
      setSuccess(`Request #${row.id} approved. Stock deducted once.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not approve request");
    }
  }

  async function reject(row: RequestRow) {
    const reason = window.prompt(`Reject removal request #${row.id}. Reason:`);
    if (!reason) return;
    setError("");
    setSuccess("");
    try {
      await api(`/api/removal-requests/${row.id}/reject`, { method: "POST", body: JSON.stringify({ reason }) });
      setSuccess(`Request #${row.id} rejected. Stock unchanged.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reject request");
    }
  }

  return (
    <>
      <div className="page-title"><div><h1>Approvals</h1><p className="muted">YCT and CCT approval queue for pending removals.</p></div></div>
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Design</th><th>Qty</th><th>Requested By</th><th>Date</th><th>Reason</th><th>Current Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>#{row.id}</td>
                <td>{row.variant.design.designNumber} {row.variant.color} {row.variant.size}</td>
                <td>{row.quantity}</td>
                <td>{row.requestedBy.username}</td>
                <td>{formatDate(row.createdAt)}</td>
                <td>{row.reason}</td>
                <td>{row.variant.currentQuantity}</td>
                <td><StatusBadge status={row.status} /></td>
                <td>
                  <div className="toolbar">
                    <button className="primary" onClick={() => approve(row)}>Approve</button>
                    <button className="danger" onClick={() => reject(row)}>Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
