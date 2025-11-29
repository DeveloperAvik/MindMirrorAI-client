// src/components/Nav.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bars3Icon, BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import { logout } from "../store";

export default function Nav() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white/60 backdrop-blur sticky top-0 z-40 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <motion.div className="rounded-full bg-indigo-600 p-2 text-white" animate={{ rotate: [0, 10, -6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
              MM
            </motion.div>

            <Link to="/" className="text-lg font-bold text-slate-800">MindMirror</Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">Wellness</div>
              <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-sm font-semibold">72</div>
            </div>

            <BellIcon className="w-5 h-5 text-slate-600" />
            <UserCircleIcon className="w-6 h-6 text-slate-600" />
            <div className="text-sm text-slate-600">{user?.name || user?.email}</div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen((s) => !s)} className="p-2 rounded-md text-slate-700">
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:hidden pb-4">
            <div className="flex flex-col gap-2">
              <Link to="/dashboard" className="py-2 px-3 rounded hover:bg-slate-50">Dashboard</Link>
              <Link to="/scan" className="py-2 px-3 rounded hover:bg-slate-50">Scan</Link>
              <Link to="/profile" className="py-2 px-3 rounded hover:bg-slate-50">Profile</Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
