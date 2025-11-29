import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../services/api";
import type { RootState } from ".";

type User = {
  id?: string;
  email?: string;
  name?: string;
  plan?: string;
};

type AuthState = {
  token: string | null;
  tempUserId: string | null;
  user: User | null;
  status: "idle" | "loading" | "failed";
  error?: string | null;
};

const initialState: AuthState = {
  token: localStorage.getItem("mm_token"),
  tempUserId: null,
  user: null,
  status: "idle",
  error: null
};

/**
 * REGISTER → returns tempUserId
 */
export const register = createAsyncThunk(
  "auth/register",
  async (payload: { email: string; password: string }) => {
    const res = await api.post("/auth/register", payload);
    return res; // { tempUserId }
  }
);

/**
 * VERIFY OTP → returns { token }
 */
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload: { tempUserId: string; otp: string }) => {
    const res = await api.post("/auth/verify-otp", payload);
    return res; // { token }
  }
);

/**
 * LOGIN → returns { token, user }
 */
export const login = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }) => {
    const res = await api.post("/auth/login", payload);
    return res;
  }
);

/**
 * FETCH USER PROFILE
 */
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.token;
    if (!token) throw new Error("No token");
    const res = await api.get("/user/me", token);
    return res;
  }
);

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.tempUserId = null;
      localStorage.removeItem("mm_token");
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem("mm_token", action.payload);
    },
    setTempUserId(state, action: PayloadAction<string>) {
      state.tempUserId = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      // REGISTER
      .addCase(register.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.status = "idle";
        s.tempUserId = a.payload.tempUserId; // IMPORTANT
      })
      .addCase(register.rejected, (s, a) => {
        s.status = "failed";
        s.error = String(a.error.message);
      })

      // VERIFY OTP
      .addCase(verifyOtp.fulfilled, (s, a) => {
        s.token = a.payload.token;
        localStorage.setItem("mm_token", a.payload.token);
        s.tempUserId = null; // clear after success
      })

      // LOGIN
      .addCase(login.fulfilled, (s, a) => {
        s.token = a.payload.token;
        s.user = a.payload.user;
        localStorage.setItem("mm_token", a.payload.token);
      })
      .addCase(login.rejected, (s, a) => {
        s.status = "failed";
        s.error = String(a.error.message);
      })

      // FETCH PROFILE
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload.user;
      });
  }
});

export const { logout, setToken, setTempUserId } = slice.actions;
export default slice.reducer;
