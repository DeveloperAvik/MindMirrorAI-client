import React, { useState } from "react";
import { register, verifyOtp } from "../store/authSlice";
import { useAppDispatch } from "../hooks";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tempId, setTempId] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  async function doRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await dispatch(register({ email, password })).unwrap();
      setTempId((res as any).tempUserId);
      setStep(2);
      alert("OTP sent (server console in dev). Enter OTP to verify.");
    } catch (err: any) {
      alert("Register failed: " + (err?.message ?? err));
    }
  }

  async function doVerify(e: React.FormEvent) {
    e.preventDefault();
    try {
      await dispatch(verifyOtp({ tempUserId: tempId, otp })).unwrap();
      alert("Verified & logged in");
      navigate("/dashboard");
    } catch (err: any) {
      alert("Verify failed: " + (err?.message ?? err));
    }
  }

  return (
    <div className="container">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        {step === 1 ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Register</h2>
            <form onSubmit={doRegister} className="space-y-3">
              <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
              <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" />
              <button className="w-full py-2 bg-sky-600 text-white rounded">Register</button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
            <form onSubmit={doVerify} className="space-y-3">
              <input placeholder="OTP" value={otp} onChange={e => setOtp(e.target.value)} className="w-full p-2 border rounded" />
              <button className="w-full py-2 bg-sky-600 text-white rounded">Verify & Login</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
