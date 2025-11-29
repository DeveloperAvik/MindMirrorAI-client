import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  FaceSmileIcon,
  ShieldCheckIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600">
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-24 text-center text-white">
        
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg"
        >
          Your Daily <span className="text-yellow-300">Health & Mind</span> Mirror
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mt-6 text-lg text-white/90"
        >
          AI-powered face & voice scanning that reveals your stress, fatigue, mood + wellness patterns.  
          Your personal AI wellness companion — friendly, private, and preventive.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-5"
        >
          <Link
            to="/scan"
            className="px-10 py-4 bg-white text-indigo-700 font-bold rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition"
          >
            Start Scan
          </Link>

          <Link
            to="/login"
            className="px-10 py-4 bg-white/20 border border-white/40 backdrop-blur-xl rounded-2xl text-white font-semibold hover:bg-white/10 transition"
          >
            Login
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-t-3xl p-10 md:p-16 shadow-2xl -mt-2 relative z-10">
        
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-14">
          Why Choose MindMirror AI?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="p-8 bg-gradient-to-br from-white to-slate-50 shadow-lg rounded-2xl border border-slate-200 hover:shadow-xl transition group"
          >
            <div className="flex justify-center">
              <CameraIcon className="w-14 h-14 text-indigo-600 group-hover:rotate-6 transition" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mt-4 text-center">
              AI Face & Voice Scan
            </h3>
            <p className="mt-3 text-slate-600 text-center">
              Detect stress, fatigue, mood & micro-emotions using advanced AI techniques.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="p-8 bg-gradient-to-br from-white to-slate-50 shadow-lg rounded-2xl border border-slate-200 hover:shadow-xl transition group"
          >
            <div className="flex justify-center">
              <FaceSmileIcon className="w-14 h-14 text-yellow-500 group-hover:rotate-6 transition" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mt-4 text-center">
              Emotion Tracking
            </h3>
            <p className="mt-3 text-slate-600 text-center">
              Your emotional patterns visualized clearly with daily wellness scoring.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="p-8 bg-gradient-to-br from-white to-slate-50 shadow-lg rounded-2xl border border-slate-200 hover:shadow-xl transition group"
          >
            <div className="flex justify-center">
              <ShieldCheckIcon className="w-14 h-14 text-green-600 group-hover:rotate-6 transition" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mt-4 text-center">
              Privacy First Design
            </h3>
            <p className="mt-3 text-slate-600 text-center">
              All scans processed locally or with full user consent.  
              Your data stays secure — always.
            </p>
          </motion.div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-20 px-6 bg-gradient-to-b from-white to-slate-100">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-800"
        >
          Begin Your Personal Wellness Journey
        </motion.h2>

        <p className="mt-3 text-slate-600 max-w-lg mx-auto">
          Stay emotionally balanced, reduce burnout, and improve mental fitness — with the world’s first AI Health & Mind Mirror.
        </p>

        <Link
          to="/register"
          className="mt-8 inline-block px-12 py-4 rounded-2xl bg-indigo-700 text-white font-semibold shadow-lg hover:bg-indigo-800 hover:shadow-xl transition"
        >
          Create Free Account
        </Link>
      </div>
    </div>
  );
}
