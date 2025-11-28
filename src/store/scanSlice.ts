import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

type ScanState = {
  lastScan: any | null;
  status: "idle" | "loading" | "failed";
  error?: string | null;
};

const initialState: ScanState = { lastScan: null, status: "idle", error: null };

export const uploadScan = createAsyncThunk("scan/upload", async (payload: { formData: FormData; token?: string }) => {
  const res = await api.postForm("/api/v1/scan", payload.formData, payload.token);
  return res;
});

const slice = createSlice({
  name: "scan",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(uploadScan.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(uploadScan.fulfilled, (s, a) => { s.status = "idle"; s.lastScan = a.payload; })
      .addCase(uploadScan.rejected, (s, a) => { s.status = "failed"; s.error = String(a.error.message); });
  }
});

export default slice.reducer;
