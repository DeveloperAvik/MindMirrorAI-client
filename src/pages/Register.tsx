import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { useAppDispatch } from "../hooks";
import { setTempUserId } from "../store/authSlice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const registerHandler = async () => {
    setError("");

    try {
      const res = await registerUser(email, password);

      // 🔥 FIX 2 — Always redirect when tempUserId exists
      if (res.tempUserId) {
        dispatch(setTempUserId(res.tempUserId));
        navigate("/verify");
        return;
      }

      // If backend didn't send tempUserId
      setError(res.error || "Registration failed");

    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Account</h1>

      <input
        className="border p-2 block w-full mt-4"
        placeholder="Email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 block w-full mt-4"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-red-500 mt-3">{error}</p>
      )}

      <button
        onClick={registerHandler}
        className="bg-indigo-600 text-white p-2 w-full rounded mt-6"
      >
        Register
      </button>
    </div>
  );
}
