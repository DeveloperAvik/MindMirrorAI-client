import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function ScanHistory() {
  const token = useSelector((s: RootState) => s.auth.token);
  const [scans, setScans] = useState<any[]>([]);
  useEffect(() => {
    if (!token) return;
    api.get("/scan/history", token).then((res:any) => {
      setScans(res.scans || []);
    }).catch(console.error);
  }, [token]);

  // mood calendar simplified: group by date and show color
  const groups: Record<string, any[]> = {};
  scans.forEach(s => {
    const d = new Date(s.createdAt).toISOString().slice(0,10);
    groups[d] = groups[d] || [];
    groups[d].push(s);
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Scan History</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">List</h4>
          <div className="space-y-3">
            {scans.map(s => (
              <div key={s._id} className="p-3 border rounded">
                <div className="text-sm text-slate-600">{new Date(s.createdAt).toLocaleString()}</div>
                <div className="text-md font-semibold">Type: {s.type}</div>
                <pre className="text-xs mt-2">{JSON.stringify(s.meta?.wellness ?? s.meta, null, 2)}</pre>
              </div>
            ))}
            {!scans.length && <div className="text-sm text-slate-500">No scans yet</div>}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Mood Calendar (recent)</h4>
          <div className="grid grid-cols-7 gap-2">
            {Object.keys(groups).slice(0,28).map(date => {
              const items = groups[date];
              const wellness = items[0]?.meta?.wellness?.score ?? 50;
              const color = wellness >= 65 ? "bg-emerald-400" : wellness >= 40 ? "bg-amber-400" : "bg-rose-400";
              return <div key={date} className={`w-8 h-8 rounded ${color}`} title={`${date} — score ${wellness}`}></div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
