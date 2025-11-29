import { useEffect, useRef, useState } from "react";
import Waveform from "../components/Waveform";
import "../styles/scan.css";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // ---------------------------
  // Start Camera
  // ---------------------------
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    });
  }, []);

  // ---------------------------
  // Start Mic Recording
  // ---------------------------
  const toggleRecording = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
      setRecording(false);

      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      analyzeVoice(audioBlob);
    }
  };

  // ---------------------------
  // Face Scan → Capture Frame
  // ---------------------------
  const captureFrame = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (blob) analyzeFace(blob);
    }, "image/jpeg");
  };

  // ---------------------------
  // Backend: Face
  // ---------------------------
  const analyzeFace = async (blob: Blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", blob);

    const res = await fetch("http://localhost:8000/analyze-face", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  // ---------------------------
  // Backend: Voice
  // ---------------------------
  const analyzeVoice = async (blob: Blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", blob);

    const res = await fetch("http://localhost:8000/analyze-voice", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult((prev: any) => ({ ...prev, ...data }));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-6 flex flex-col items-center pt-12">
      
      <h1 className="text-3xl font-bold mb-8 text-center breathing">
        MindMirror AI — Scan Your Wellness
      </h1>

      {/* CAMERA WINDOW */}
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          className="w-80 h-80 rounded-2xl shadow-xl border-2 border-white/20 object-cover"
        />

        {/* Animated Scan Ring */}
        {cameraReady && (
          <div
            className="scan-ring w-80 h-80 rounded-full pointer-events-none"
            style={{ top: 0, left: 0, position: "absolute" }}
          />
        )}
      </div>

      {/* Face Scan */}
      <button
        onClick={captureFrame}
        className="mt-6 px-8 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-lg"
      >
        Scan Face
      </button>

      {/* VOICE SECTION */}
      <div className="mt-12 flex flex-col items-center">
        <Waveform stream={audioStream} />

        <button
          onClick={toggleRecording}
          className={`mt-4 px-8 py-3 rounded-xl shadow-lg transition ${
            recording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {recording ? "Stop Recording" : "Record Voice"}
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-10 text-lg animate-pulse">Analyzing...</div>
      )}

      {/* RESULTS */}
      {result && !loading && (
        <div className="mt-10 bg-white/10 backdrop-blur-xl p-6 rounded-2xl w-[90%] max-w-md">
          <h2 className="text-xl font-bold text-center mb-4">Your Results</h2>

          <p className="text-center text-yellow-300 text-4xl font-extrabold">
            ⭐ {result.wellness_score}/100
          </p>

          {result.face_emotion && (
            <p className="mt-4 text-center">
              <strong>Face Emotion:</strong> {result.face_emotion}
            </p>
          )}

          {result.voice_emotion && (
            <p className="text-center mt-1">
              <strong>Voice Emotion:</strong> {result.voice_emotion}
            </p>
          )}

          <p className="text-center mt-3 opacity-80 text-sm">
            Your daily AI wellness insight is ready.
          </p>
        </div>
      )}
    </div>
  );
}
