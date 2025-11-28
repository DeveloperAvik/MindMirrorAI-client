import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import scanReducer from "./scanSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    scan: scanReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
