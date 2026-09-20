import { FormEvent, useEffect, useState } from "react";
import { ErrorMessage, SuccessMessage } from "../components/DataState";
import { api } from "../lib/api";

type Variant = { id: number; color: string; size: string; currentQuantity: number; design: { designNumber: string; name: string } };

export function RemovalPage() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [destination, setDestination] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api<Variant[]>("/api/stock?filter=available").then(setVariants);
  }, []);

  const selected = variants.find((item) => item.id === Number(variantId));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!selected) return;
    const confirmed = window.confirm(`Request removal of ${quantity} pieces of ${selected.design.designNumber} ${selected.color} ${selected.size}?`);
    if (!confirmed) return;
    try {
      await api("/api/removal-requests", {
        method: "POST",
        body: JSON.stringify({ variantId: Number(variantId), quantity, reason, destination, notes })
      });
      setSuccess("Removal request created. Stock will not change until YCT or CCT approves it.");
      setQuantity(1);
      setReason("");
      setDestination("");
      setNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create removal request");
    }
  }

  return (
    <>
      <div className="page-title"><div><h1>Request Goods Removal</h1><p className="muted">Requests stay pending until approved by YCT or CCT.</p></div></div>
      <form className="panel form-grid" onSubmit={submit}>
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
        <div className="field">
          <label>Design / Variant</label>
          <select value={variantId} onChange={(e) => setVariantId(e.target.value)} required>
            <option value="">Select stock item</option>
            {variants.map((item) => (
              <option key={item.id} value={item.id}>
                {item.design.designNumber} - {item.design.name} - {item.color} {item.size} - Available: {item.currentQuantity}
              </option>
            ))}
          </select>
        </div>
        <div className="field"><label>Quantity</label><input type="number" min="1" max={selected?.currentQuantity} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required /></div>
        <div className="field"><label>Reason</label><input value={reason} onChange={(e) => setReason(e.target.value)} required /></div>
        <div className="field"><label>Destination / Department</label><input value={destination} onChange={(e) => setDestination(e.target.value)} /></div>
        <div className="field"><label>Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        <button className="primary" type="submit">Confirm Removal Request</button>
      </form>
    </>
  );
}
