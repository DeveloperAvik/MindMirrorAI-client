// combinedUpload.worker.ts
importScripts();

self.onmessage = async (ev: any) => {
  const { apiBase, token, files } = ev.data; // files: [{name, blob, field}]
  try {
    const fd = new FormData();
    for (const f of files) {
      fd.append(f.field, f.blob, f.name);
    }
    const res = await fetch(apiBase + "/scan/combined", {
      method: "POST",
      body: fd,
      headers: token ? { Authorization: "Bearer " + token } : undefined,
    });
    const data = await res.json();
    self.postMessage({ ok: true, data });
  } catch (err) {
    self.postMessage({ ok: false, error: String(err) });
  }
};
