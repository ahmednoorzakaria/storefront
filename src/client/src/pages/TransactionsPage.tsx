import { useEffect, useState } from "react";
import { api, formatDate } from "../lib/api";

type Tx = {
  id: number;
  type: string;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  reason?: string;
  reference?: string;
  createdAt: string;
  performedBy: { username: string };
  variant: { color: string; size: string; design: { designNumber: string } };
};

export function TransactionsPage() {
  const [rows, setRows] = useState<Tx[]>([]);
  useEffect(() => {
    api<Tx[]>("/api/transactions").then(setRows);
  }, []);

  return (
    <>
      <div className="page-title"><div><h1>Transactions</h1><p className="muted">Immutable stock ledger for receipts, removals, returns, adjustments, and reversals.</p></div></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Type</th><th>Design</th><th>Qty</th><th>Before</th><th>After</th><th>User</th><th>Reason</th><th>Reference</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.createdAt)}</td>
                <td>{row.type}</td>
                <td>{row.variant.design.designNumber} {row.variant.color} {row.variant.size}</td>
                <td>{row.quantity}</td>
                <td>{row.quantityBefore}</td>
                <td>{row.quantityAfter}</td>
                <td>{row.performedBy.username}</td>
                <td>{row.reason || "-"}</td>
                <td>{row.reference || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
