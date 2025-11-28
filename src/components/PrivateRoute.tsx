import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { fetchMe } from "../store/authSlice";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = useSelector((s: RootState) => s.auth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [token, dispatch]);

  if (!token) return <Navigate to="/login" replace />;
  return children;
}
