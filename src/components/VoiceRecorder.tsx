import React, { useEffect, useRef, useState } from "react";

export default function VoiceRecorder({ onRecord }: { onRecord?: (blob: Blob) => void }) {
  const mediaRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [permission, setPermission] = useState(false);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermission(true);
      const recorder = new MediaRecorder(stream);
      const parts: BlobPart[] = [];
      recorder.ondataavailable = (e) => parts.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(parts, { type: "audio/webm" });
        onRecord?.(blob);
      };
      recorder.start();
      mediaRef.current = recorder;
      setRecording(true);
    } catch (err) {
      console.error("Mic permission error", err);
      alert("Microphone access denied");
    }
  }

  function stop() {
    const r = mediaRef.current;
    if (r && r.state !== "inactive") r.stop();
    setRecording(false);
  }

  return (
    <div>
      {!recording ? (
        <button onClick={start} className="px-4 py-2 bg-indigo-600 text-white rounded">Start Recording</button>
      ) : (
        <button onClick={stop} className="px-4 py-2 bg-rose-500 text-white rounded">Stop Recording</button>
      )}
    </div>
  );
}
