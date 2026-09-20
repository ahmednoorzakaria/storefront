import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

type Variant = {
  id: number;
  color: string;
  size: string;
  currentQuantity: number;
  minimumStock: number;
  design: { id: number; designNumber: string; name: string };
};

export function StockPage() {
  const [rows, setRows] = useState<Variant[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api<Variant[]>(`/api/stock?q=${encodeURIComponent(q)}&filter=${filter}`).then(setRows);
  }, [q, filter]);

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Stock</h1>
          <p className="muted">Exact current quantity by design, color, and size.</p>
        </div>
      </div>
      <div className="toolbar">
        <input placeholder="Search design, name, color, size" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All stock</option>
          <option value="available">Available</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Design</th><th>Name</th><th>Color</th><th>Size</th><th>Current Stock</th><th>Minimum</th><th>Timeline</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.design.designNumber}</td>
                <td>{row.design.name}</td>
                <td>{row.color}</td>
                <td>{row.size}</td>
                <td>{row.currentQuantity}</td>
                <td>{row.minimumStock}</td>
                <td><Link className="secondary" to={`/timeline/${row.design.id}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
