import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import type { RootState } from ".";

type User = { id?: string; email?: string; name?: string; plan?: string; };

type AuthState = {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "failed";
  error?: string | null;
};

const initialState: AuthState = {
  token: localStorage.getItem("mm_token"),
  user: null,
  status: "idle",
  error: null
};

export const register = createAsyncThunk("auth/register", async (payload: { email: string; password: string }) => {
  const res = await api.post("/api/v1/auth/register", payload);
  return res;
});

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (payload: { tempUserId: string; otp: string }) => {
  const res = await api.post("/api/v1/auth/verify-otp", payload);
  // returns { token }
  return res;
});

export const login = createAsyncThunk("auth/login", async (payload: { email: string; password: string }) => {
  const res = await api.post("/api/v1/auth/login", payload);
  return res;
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, thunkAPI) => {
  const token = (thunkAPI.getState() as RootState).auth.token;
  if (!token) throw new Error("No token");
  const res = await api.get("/api/v1/user/me", token);
  return res;
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("mm_token");
    },
    setToken(state, action) {
      state.token = action.payload;
      if (action.payload) localStorage.setItem("mm_token", action.payload);
      else localStorage.removeItem("mm_token");
    }
  },
  extraReducers(builder) {
    builder
      .addCase(register.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(register.fulfilled, (s) => { s.status = "idle"; })
      .addCase(register.rejected, (s, a) => { s.status = "failed"; s.error = String(a.error.message); })

      .addCase(verifyOtp.fulfilled, (s, a) => {
        s.token = a.payload.token;
        localStorage.setItem("mm_token", a.payload.token);
      })

      .addCase(login.fulfilled, (s, a) => {
        s.token = a.payload.token;
        s.user = a.payload.user ?? s.user;
        localStorage.setItem("mm_token", a.payload.token);
      })
      .addCase(login.rejected, (s, a) => { s.status = "failed"; s.error = String(a.error.message); })

      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload.user;
      })
      .addCase(fetchMe.rejected, (s) => { /* ignore */ });
  }
});

export const { logout, setToken } = slice.actions;
export default slice.reducer;
