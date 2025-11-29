
export const API_BASE = "http://localhost:4000/api/v1";

async function handleRes(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  return ct.includes("application/json") ? res.json() : res.text();
}

function authHeader(token?: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🔥 Correct default export name: api
const api = {
  get(path: string, token?: string | null) {
    return fetch(`${API_BASE}${path}`, {
      headers: { ...authHeader(token) },
    }).then(handleRes);
  },

  post(path: string, body: any, token?: string | null) {
    return fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader(token) },
      body: JSON.stringify(body),
    }).then(handleRes);
  },

  postForm(path: string, form: FormData, token?: string | null) {
    return fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { ...authHeader(token) },
      body: form,
    }).then(handleRes);
  },
};

export default api;

// AUTH EXPORTS
export const registerUser = (email: string, password: string) =>
  api.post("/auth/register", { email, password });

export const verifyOtp = (id: string, otp: string) =>
  api.post("/auth/verify-otp", { tempUserId: id, otp });

export const resendOtp = (id: string) =>
  api.post("/auth/resend-otp", { tempUserId: id });

export const loginUser = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

// SCAN
export const uploadFace = (form: FormData, token: string) =>
  api.postForm("/scan/face", form, token);

export const uploadVoice = (form: FormData, token: string) =>
  api.postForm("/scan/voice", form, token);
