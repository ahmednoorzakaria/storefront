import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, formatDate } from "../lib/api";

type Timeline = {
  design: { designNumber: string; name: string; variants: Array<{ currentQuantity: number; color: string; size: string }> };
  events: Array<{ id: string; type: string; title: string; description: string; createdAt: string; user?: { username: string } | null }>;
};

export function TimelinePage() {
  const { id } = useParams();
  const [data, setData] = useState<Timeline | null>(null);

  useEffect(() => {
    api<Timeline>(`/api/designs/${id}/timeline`).then(setData);
  }, [id]);

  const total = data?.design.variants.reduce((sum, item) => sum + item.currentQuantity, 0) || 0;

  return (
    <>
      <div className="page-title">
        <div>
          <h1>{data ? `${data.design.designNumber} - ${data.design.name}` : "Timeline"}</h1>
          <p className="muted">Complete chronological history for the design. Current total stock: {total}</p>
        </div>
      </div>
      <div className="panel">
        <h2>Current Stock</h2>
        <div className="toolbar">
          {data?.design.variants.map((variant) => (
            <span className="badge" key={`${variant.color}-${variant.size}`}>{variant.color} {variant.size}: {variant.currentQuantity}</span>
          ))}
        </div>
      </div>
      <div className="panel timeline">
        {data?.events.map((event) => (
          <article className="timeline-item" key={event.id}>
            <strong>{formatDate(event.createdAt)} - {event.title}</strong>
            <p>{event.description}</p>
            <span className="muted">User: {event.user?.username || "System"} | Event: {event.type}</span>
          </article>
        ))}
        {data && data.events.length === 0 && <p className="muted">No timeline events yet.</p>}
      </div>
    </>
  );
}
