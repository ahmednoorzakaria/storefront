import { FormEvent, useEffect, useState } from "react";
import { ErrorMessage, SuccessMessage } from "../components/DataState";
import { api, formatDate } from "../lib/api";

type UserRow = { id: number; username: string; role: string; active: boolean; createdAt: string; lastLoginAt?: string };

export function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [form, setForm] = useState({ username: "", password: "", role: "ACT", active: true });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    setRows(await api<UserRow[]>("/api/admin/users"));
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api("/api/admin/users", { method: "POST", body: JSON.stringify(form) });
      setSuccess("User created with default permissions for the selected role.");
      setForm({ username: "", password: "", role: "ACT", active: true });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create user");
    }
  }

  return (
    <>
      <div className="page-title"><div><h1>Users</h1><p className="muted">Admin user management and role assignment.</p></div></div>
      <form className="panel form-grid" onSubmit={submit}>
        <h2>Create User</h2>
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
        <div className="field"><label>Username</label><input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></div>
        <div className="field"><label>Password</label><input type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
        <div className="field">
          <label>Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option>ADMIN</option><option>YCT</option><option>CCT</option><option>ACT</option><option>AACT</option>
          </select>
        </div>
        <button className="primary" type="submit">Create User</button>
      </form>
      <div className="panel table-wrap">
        <table>
          <thead><tr><th>Username</th><th>Role</th><th>Active</th><th>Created</th><th>Last Login</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.username}</td>
                <td>{row.role}</td>
                <td>{row.active ? "Yes" : "No"}</td>
                <td>{formatDate(row.createdAt)}</td>
                <td>{row.lastLoginAt ? formatDate(row.lastLoginAt) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
