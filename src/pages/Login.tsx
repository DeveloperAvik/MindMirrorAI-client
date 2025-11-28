import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { login, fetchMe } from "../store/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useSelector((s: RootState) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (auth.token) {
      dispatch(fetchMe());
      navigate("/dashboard");
    }
  }, [auth.token]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (err: any) {
      alert("Login failed: " + (err?.message ?? err));
    }
  }

  return (
    <div className="container">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="w-full py-2 bg-sky-600 text-white rounded">Login</button>
        </form>
        <div className="mt-3 text-sm">
          New? <Link to="/register" className="text-sky-600">Register</Link>
        </div>
      </div>
    </div>
  );
}
