import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Nav from "./components/Nav";
import PrivateRoute from "./components/PrivateRoute";
import VerifyOtp from "./pages/VerifyOtp";

export default function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyOtp />} />  {/* ← Add this */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}
