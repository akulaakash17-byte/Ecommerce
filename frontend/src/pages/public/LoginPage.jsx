import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "" });

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "" });

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  return (
    <main className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-12">
      <form className="card w-full max-w-md p-6" onSubmit={submit}>
        <p className="eyebrow">Admin access</p>
        <h1 className="mt-2 text-2xl font-black">Login to dashboard</h1>
        <div className="mt-5">
          <ErrorMessage message={status.error} />
        </div>
        <div className="mt-5">
          <label className="label" htmlFor="email">Email</label>
          <input className="field" id="email" onChange={(event) => setForm({ ...form, email: event.target.value })} required type="email" value={form.email} />
        </div>
        <div className="mt-4">
          <label className="label" htmlFor="password">Password</label>
          <input className="field" id="password" onChange={(event) => setForm({ ...form, password: event.target.value })} required type="password" value={form.password} />
        </div>
        <button className="btn-primary mt-6 w-full" disabled={status.loading} type="submit">
          {status.loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
