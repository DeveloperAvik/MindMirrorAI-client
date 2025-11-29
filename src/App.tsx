import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScanPage from "./pages/ScanPage";
// import ScanPage from "";   // ⬅ NEW PAGE

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* NEW ROUTE FIX */}
      <Route path="/scan" element={<ScanPage />} />
    </Routes>
  );
}
