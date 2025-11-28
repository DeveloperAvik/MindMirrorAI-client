import { API_BASE } from "../config";

async function handleRes(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

function authHeader(token?: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const defaultExport = {
  async get(path: string, token?: string | null) {
    const res = await fetch(`${API_BASE}${path}`, { headers: { ...authHeader(token) } });
    return handleRes(res);
  },

  async post(path: string, body: any, token?: string | null) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader(token) },
      body: JSON.stringify(body),
    });
    return handleRes(res);
  },

  async postForm(path: string, form: FormData, token?: string | null) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      body: form,
      headers: { ...authHeader(token) }, // browser sets multipart header
    });
    return handleRes(res);
  },
};

// ---------------------------------------------
// 🔥 AUTH FUNCTIONS (use these in your pages)
// ---------------------------------------------

export function registerUser(email: string, password: string) {
  return defaultExport.post("/auth/register", { email, password });
}

export function verifyOtp(tempUserId: string, otp: string) {
  return defaultExport.post("/auth/verify-otp", { tempUserId, otp });
}

export function resendOtp(tempUserId: string) {
  return defaultExport.post("/auth/resend-otp", { tempUserId });
}

export function loginUser(email: string, password: string) {
  return defaultExport.post("/auth/login", { email, password });
}

export function refreshToken(refreshToken: string) {
  return defaultExport.post("/auth/refresh", { refreshToken });
}

export default defaultExport;
