import React from "react";
import CameraCapture from "../components/CameraCapture";
import PremiumToggle from "../components/PremiumToggle";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function Dashboard() {
  const scan = useSelector((s: RootState) => s.scan.lastScan);
  const user = useSelector((s: RootState) => s.auth.user);

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-lg font-semibold">Welcome {user?.name ?? user?.email}</h3>
            <p className="text-sm text-slate-600">Plan: <strong>{user?.plan ?? "free"}</strong></p>
          </div>
          <CameraCapture />
        </div>

        <div>
          <PremiumToggle />
          <div className="bg-white p-4 rounded shadow mt-4">
            <h4 className="font-semibold">Last scan</h4>
            {scan ? <pre className="text-xs mt-2 bg-slate-100 p-2 rounded overflow-auto">{JSON.stringify(scan, null, 2)}</pre> : <div className="text-sm text-slate-500 mt-2">No scan yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
