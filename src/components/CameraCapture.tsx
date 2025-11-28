import React, { useRef, useState } from "react";
import { uploadScan } from "../store/scanSlice";
import { useAppDispatch } from "../hooks";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [log, setLog] = useState("");
  const dispatch = useAppDispatch();
  const token = useSelector((s: RootState) => s.auth.token);

  async function startStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setLog("Camera & mic active. Click Capture to take snapshot and record 6s audio.");
    } catch (e: any) {
      setLog("Error accessing camera/mic: " + e.message);
    }
  }

  async function captureAndUpload() {
    if (!mediaStreamRef.current || !videoRef.current) { setLog("Start camera first."); return; }
    setLog("Capturing image and recording audio (6s)...");
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 320;
    canvas.height = videoRef.current.videoHeight || 240;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    if (!imageBlob) { setLog("Failed to capture image"); return; }

    const audioTracks = mediaStreamRef.current.getAudioTracks();
    const recorder = new MediaRecorder(new MediaStream(audioTracks));
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.start();
    setRecording(true);
    await new Promise((r) => setTimeout(r, 6000));
    recorder.stop();
    await new Promise<void>((resolve) => { recorder.onstop = () => resolve(); });
    setRecording(false);
    const audioBlob = new Blob(chunks, { type: chunks[0]?.type || "audio/webm" });

    const fd = new FormData();
    fd.append("image", imageBlob, "capture.jpg");
    fd.append("audio", audioBlob, "voice.webm");

    try {
      const result = await dispatch(uploadScan({ formData: fd, token })).unwrap();
      setLog("Upload success — wellness score: " + result.wellnessScore);
    } catch (err: any) {
      setLog("Upload failed: " + (err?.message || JSON.stringify(err)));
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <video ref={videoRef} autoPlay playsInline className="w-full max-w-md bg-black" />
      <div className="mt-3 space-x-2">
        <button className="px-3 py-1 bg-sky-600 text-white rounded" onClick={startStream}>Start Stream</button>
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={captureAndUpload} disabled={recording}>Capture & Upload</button>
      </div>
      <div className="mt-3 text-sm text-slate-600">{recording ? "Recording..." : log}</div>
    </div>
  );
}
