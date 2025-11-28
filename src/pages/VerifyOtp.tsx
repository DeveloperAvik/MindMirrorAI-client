import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { verifyOtp, resendOtp } from "../services/api";
import { useOtpTimer } from "../hooks";
import { setToken } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function VerifyOtp() {
  const { tempUserId } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const { timeLeft, resetTimer } = useOtpTimer(30);

  if (!tempUserId) {
    return (
      <div className="text-center text-red-600 mt-20">
        Session expired. Register again.
      </div>
    );
  }

  const handleVerify = async () => {
    try {
      const res = await verifyOtp(tempUserId, otp);
      dispatch(setToken(res.token));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp(tempUserId);
      resetTimer();
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center">Verify OTP</h1>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full border p-3 rounded-xl text-center text-xl tracking-widest mt-6"
        />

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        <button
          onClick={handleVerify}
          className="w-full bg-indigo-600 text-white p-3 mt-4 rounded-xl"
        >
          Verify
        </button>

        <div className="text-center mt-4">
          {timeLeft > 0 ? (
            <p>Resend OTP in {timeLeft}s</p>
          ) : (
            <button
              onClick={handleResend}
              className="text-indigo-600 font-semibold"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
