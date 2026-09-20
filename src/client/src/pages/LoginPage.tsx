import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { ErrorMessage } from "../components/DataState";
import { useAuth } from "../components/AuthContext";

export function LoginPage() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState("Admin");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <main className="login-screen">
      <form className="login-card" onSubmit={submit}>
        <h1>Store Management</h1>
        <p>Track goods in, goods out, approvals, and complete design history.</p>
        <ErrorMessage message={error} />
        <div className="form-grid">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="primary" type="submit">Login</button>
        </div>
        <p className="muted">Temporary seed passwords: Admin@123, YCT@123, CCT@123, ACT@123, AACT@123.</p>
      </form>
    </main>
  );
}
