// src/components/WellnessScoreCard.tsx
import React from "react";
import { motion } from "framer-motion";

type Props = { score?: number; trend?: number }; // trend: +ve percent
export default function WellnessScoreCard({ score = 72, trend = 4 }: Props) {
  const size = 96;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const dash = (circumference * pct) / 100;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm w-full max-w-xs">
      <div className="flex items-center gap-4">
        <div className="relative">
          <svg width={size} height={size}>
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle cx={size / 2} cy={size / 2} r={r} stroke="#f1f5f9" strokeWidth={stroke} fill="none" />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="url(#g1)"
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${dash} ${circumference - dash}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.9 }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-slate-800">{score}</div>
              <div className="text-xs text-slate-500">Wellness</div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="text-lg font-semibold text-slate-800">Wellness Score</h4>
          <p className="text-sm text-slate-500 mt-1">Daily snapshot of your stress & fatigue levels.</p>
          <div className="mt-3 text-sm">
            <span className={`px-2 py-1 rounded text-sm font-semibold ${trend >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
            <span className="text-xs text-slate-500 ml-2">since last scan</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
