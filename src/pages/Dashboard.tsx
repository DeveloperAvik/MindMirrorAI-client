// src/pages/Dashboard.tsx
import React, { useState } from "react";
import CameraCapture from "../components/CameraCapture";
import VoiceRecorder from "../components/VoiceRecorder";
import PremiumToggle from "../components/PremiumToggle";
import WellnessScoreCard from "../components/WellnessScoreCard";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { API_BASE } from "../services/api"; // make sure this exists

export default function Dashboard() {
  const user = useSelector((s: RootState) => s.auth.user);
  const token = useSelector((s: RootState) => s.auth.token);

  const [faceBlob, setFaceBlob] = useState<Blob | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [lastScan, setLastScan] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);

  function handleFaceCapture(blob: Blob) {
    setFaceBlob(blob);
  }

  function handleVoiceCapture(blob: Blob) {
    setVoiceBlob(blob);
  }

  async function uploadCombined() {
    if (!token) return alert("Please login first.");

    if (!faceBlob && !voiceBlob) {
      alert("Please provide face or voice (or both).");
      return;
    }

    setUploading(true);

    try {
      // Use WebWorker for upload
      const worker = new Worker(
        new URL("../workers/combinedUpload.worker.ts", import.meta.url),
        { type: "module" }
      );

      worker.postMessage({
        apiBase: API_BASE + "/scan",
        token,
        files: [
          ...(faceBlob
            ? [{ field: "face", blob: faceBlob, name: "face.jpg" }]
            : []),
          ...(voiceBlob
            ? [{ field: "voice", blob: voiceBlob, name: "voice.webm" }]
            : []),
        ],
      });

      worker.onmessage = (ev) => {
        const { ok, data, error } = ev.data;
        if (!ok) {
          alert("Upload failed: " + error);
        } else {
          setLastScan(data);
        }
        setUploading(false);
        worker.terminate();
      };
    } catch (err: any) {
      console.error(err);
      alert("Upload failed: " + err.message);
      setUploading(false);
    }
  }

  const wellnessScore =
    lastScan?.scan?.meta?.wellness?.score ?? user?.lastWellnessScore ?? 70;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome,{" "}
          <span className="text-indigo-600">
            {user?.name || user?.email}
          </span>
        </h1>
        <p className="text-slate-500 mt-1">
          Track your wellness, daily scans & mental clarity.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT PANEL */}
        <div className="space-y-6">

          {/* Profile Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-xl font-semibold">Your Profile</h3>
            <p className="mt-2 text-slate-600 text-sm">
              <strong>Email:</strong> {user?.email}
            </p>
            <p className="mt-1 text-slate-600 text-sm">
              <strong>Plan:</strong>{" "}
              <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs">
                {user?.plan}
              </span>
            </p>
          </div>

          {/* Face Capture */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Face Capture</h3>
            <CameraCapture onCapture={handleFaceCapture} />

            {faceBlob && (
              <p className="text-xs mt-2 text-green-600">Face captured ✓</p>
            )}
          </div>

          {/* Voice Capture */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Voice Recording</h3>
            <VoiceRecorder onRecord={handleVoiceCapture} />

            {voiceBlob && (
              <p className="text-xs mt-2 text-green-600">Voice recorded ✓</p>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={uploadCombined}
            disabled={uploading}
            className="px-4 py-3 bg-indigo-600 text-white rounded-lg shadow hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload Combined Scan"}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          {/* Wellness */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">Wellness</h3>
            <WellnessScoreCard score={wellnessScore} trend={4} />

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-700">
                Latest Scan Result
              </h4>

              {lastScan?.scan ? (
                <pre className="mt-3 text-xs bg-slate-50 p-3 border rounded-lg text-slate-600 overflow-auto">
                  {JSON.stringify(lastScan.scan.meta, null, 2)}
                </pre>
              ) : (
                <div className="text-sm text-slate-500 mt-3">
                  No scans yet.
                </div>
              )}
            </div>
          </div>

          {/* Premium */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">Upgrade Plan</h3>
            <p className="text-sm text-slate-500 mb-4">
              Unlock deeper insights, long-term trends & advanced AI analysis.
            </p>
            <PremiumToggle />
          </div>

        </div>
      </div>
    </div>
  );
}
