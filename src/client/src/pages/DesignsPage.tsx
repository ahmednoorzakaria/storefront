import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

type Design = { id: number; designNumber: string; name: string; category?: string; active: boolean; variants: Array<{ id: number; color: string; size: string; currentQuantity: number }> };

export function DesignsPage() {
  const [rows, setRows] = useState<Design[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api<Design[]>(`/api/designs?q=${encodeURIComponent(q)}`).then(setRows);
  }, [q]);

  return (
    <>
      <div className="page-title"><div><h1>Designs</h1><p className="muted">Search a design and open its complete stock history.</p></div></div>
      <div className="toolbar">
        <input placeholder="Search design number, name, color, size" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Design</th><th>Name</th><th>Category</th><th>Variants</th><th>Total Stock</th><th>Timeline</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.designNumber}</td>
                <td>{row.name}</td>
                <td>{row.category || "-"}</td>
                <td>{row.variants.map((variant) => `${variant.color} ${variant.size}`).join(", ")}</td>
                <td>{row.variants.reduce((sum, variant) => sum + variant.currentQuantity, 0)}</td>
                <td><Link className="secondary" to={`/timeline/${row.id}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
