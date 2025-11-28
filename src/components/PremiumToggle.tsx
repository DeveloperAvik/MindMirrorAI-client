import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function PremiumToggle() {
  const user = useSelector((s: RootState) => s.auth.user);
  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="font-semibold">Plan</h4>
      <div className="mt-2">
        <div>Current: <strong>{user?.plan ?? "free"}</strong></div>
        <div className="mt-2 text-sm text-slate-600">Upgrade to premium for advanced suggestions and insights.</div>
        {/* In demo mode we won't integrate payments. Provide backend endpoint to toggle plan; for now we can instruct how to toggle directly in DB */}
      </div>
    </div>
  );
}
