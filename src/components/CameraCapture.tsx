// src/components/CameraCapture.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CameraCapture({
  onCapture,
}: {
  onCapture?: (blob: Blob) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // -------------------------
  // START CAMERA
  // -------------------------
  async function startCamera() {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(media);

      if (videoRef.current) {
        videoRef.current.srcObject = media;

        // Important for MacBook / Safari / Chrome
        await new Promise<void>((resolve) => {
          videoRef.current!.onloadedmetadata = () => resolve();
        });

        await videoRef.current.play();
        setReady(true);
      }
    } catch (err) {
      console.error("Camera start error:", err);
    }
  }

  // -------------------------
  // STOP CAMERA
  // -------------------------
  function stopCamera() {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setReady(false);
  }

  // -------------------------
  // CAPTURE PHOTO
  // -------------------------
  async function capture() {
    const video = videoRef.current;
    if (!video || !ready) {
      console.warn("Video not ready yet");
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (width === 0 || height === 0) {
      console.warn("Video metadata not loaded");
      return;
    }

    // Create canvas if missing
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0, width, height);

    // convert to jpeg
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCaptured(dataUrl);

    // Convert DataURL to blob (BEST QUALITY)
    const blob = await (await fetch(dataUrl)).blob();
    onCapture?.(blob);
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow p-4 border border-slate-200"
    >
      <h3 className="font-semibold mb-3 text-slate-800">Camera Scan</h3>

      <div className="w-full h-64 bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
          muted
        />
      </div>

      <div className="mt-4 flex gap-3">
        {!stream ? (
          <button
            onClick={startCamera}
            className="px-4 py-2 rounded bg-indigo-600 text-white"
          >
            Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={capture}
              disabled={!ready}
              className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
            >
              Capture
            </button>

            <button
              onClick={stopCamera}
              className="px-4 py-2 rounded bg-gray-200"
            >
              Stop
            </button>
          </>
        )}
      </div>

      {captured && (
        <img
          src={captured}
          alt="preview"
          className="mt-4 w-24 h-24 rounded object-cover border"
        />
      )}
    </motion.div>
  );
}
