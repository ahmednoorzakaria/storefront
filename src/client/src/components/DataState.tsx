export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <div className="alert error">{message}</div>;
}

export function SuccessMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <div className="alert success">{message}</div>;
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${status.toLowerCase()}`}>{status}</span>;
}
