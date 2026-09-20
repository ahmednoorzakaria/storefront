import { FormEvent, useState } from "react";
import { ErrorMessage, SuccessMessage } from "../components/DataState";
import { api } from "../lib/api";

export function ReceivePage() {
  const [form, setForm] = useState({
    designNumber: "",
    designName: "",
    color: "",
    size: "",
    quantity: 1,
    supplier: "",
    reference: "",
    notes: "",
    category: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function setField(key: keyof typeof form, value: string | number) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const confirmed = window.confirm(`Receive ${form.quantity} pieces of ${form.designNumber} ${form.color} ${form.size}?`);
    if (!confirmed) return;
    try {
      await api("/api/stock/receive", { method: "POST", body: JSON.stringify(form) });
      setSuccess("Goods received and ledger transaction recorded.");
      setForm({ designNumber: "", designName: "", color: "", size: "", quantity: 1, supplier: "", reference: "", notes: "", category: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not receive goods");
    }
  }

  return (
    <>
      <div className="page-title"><div><h1>Receive Goods</h1><p className="muted">Receiving increases stock and writes a permanent ledger entry.</p></div></div>
      <form className="panel form-grid" onSubmit={submit}>
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
        <div className="field"><label>Design Number</label><input value={form.designNumber} onChange={(e) => setField("designNumber", e.target.value)} required /></div>
        <div className="field"><label>Design Name</label><input value={form.designName} onChange={(e) => setField("designName", e.target.value)} required /></div>
        <div className="field"><label>Category</label><input value={form.category} onChange={(e) => setField("category", e.target.value)} /></div>
        <div className="field"><label>Color</label><input value={form.color} onChange={(e) => setField("color", e.target.value)} required /></div>
        <div className="field"><label>Size</label><input value={form.size} onChange={(e) => setField("size", e.target.value)} required /></div>
        <div className="field"><label>Quantity</label><input type="number" min="1" value={form.quantity} onChange={(e) => setField("quantity", Number(e.target.value))} required /></div>
        <div className="field"><label>Supplier / Source</label><input value={form.supplier} onChange={(e) => setField("supplier", e.target.value)} /></div>
        <div className="field"><label>Reference</label><input value={form.reference} onChange={(e) => setField("reference", e.target.value)} /></div>
        <div className="field"><label>Notes</label><textarea value={form.notes} onChange={(e) => setField("notes", e.target.value)} /></div>
        <button className="primary" type="submit">Record Receipt</button>
      </form>
    </>
  );
}
