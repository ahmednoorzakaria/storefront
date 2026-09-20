export function ReportsPage() {
  const reports = [
    ["Stock Report", "/api/reports/stock?format=csv"],
    ["Receiving Report", "/api/reports/receipts?format=csv"],
    ["Removal Report", "/api/reports/removals?format=csv"],
    ["Audit Report", "/api/reports/audit?format=csv"]
  ];

  return (
    <>
      <div className="page-title"><div><h1>Reports</h1><p className="muted">Simple reports with CSV export.</p></div></div>
      <div className="panel">
        <div className="form-grid">
          {reports.map(([label, href]) => (
            <a key={href} className="secondary" href={href}>{label} CSV</a>
          ))}
        </div>
      </div>
    </>
  );
}
