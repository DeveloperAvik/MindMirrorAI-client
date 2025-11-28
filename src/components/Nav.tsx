import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { logout } from "../store/authSlice";

export default function Nav() {
  const auth = useSelector((s: RootState) => s.auth);
  const dispatch = useAppDispatch();

  return (
    <nav className="bg-white shadow p-3 mb-4">
      <div className="container flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">MindMirror</Link>
        <div>
          {auth.token ? (
            <>
              <span className="mr-4">Hi, {auth.user?.name ?? auth.user?.email}</span>
              <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => dispatch(logout())}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 text-sky-600">Login</Link>
              <Link to="/register" className="text-sky-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
