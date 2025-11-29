// src/components/PremiumToggle.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";

type PremiumToggleProps = {
  currentPlan?: "free" | "premium";
  onToggle?: (plan: "free" | "premium") => void;
  onPurchase?: () => Promise<void> | void;
};

export default function PremiumToggle({
  currentPlan = "free",
  onToggle,
  onPurchase,
}: PremiumToggleProps) {
  const [enabled, setEnabled] = useState(currentPlan === "premium");
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      await onPurchase?.();
      setEnabled(true);
      onToggle?.("premium");
    } finally {
      setLoading(false);
    }
  }

  function toggleSwitch() {
    const newState = !enabled;
    setEnabled(newState);
    onToggle?.(newState ? "premium" : "free");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-gradient-to-br from-white to-slate-50 p-5 border border-slate-100 shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-semibold text-slate-800">Premium</h3>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Advanced insights, long-term trends, export data, priority support.
          </p>
        </div>

        {/* CUSTOM SWITCH */}
        <div className="flex flex-col items-end">
          <div className="text-sm text-slate-500 mb-1">Your plan</div>

          <div
            onClick={toggleSwitch}
            className={`w-12 h-6 flex items-center rounded-full cursor-pointer transition ${
              enabled ? "bg-indigo-600" : "bg-slate-300"
            }`}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-5 h-5 rounded-full bg-white shadow ml-1"
              style={{ transform: enabled ? "translateX(24px)" : "translateX(0px)" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-indigo-600">₹199 / mo</div>
          <div className="text-xs text-slate-500">billed monthly • cancel anytime</div>
        </div>

        <button
          onClick={handleBuy}
          disabled={enabled || loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 disabled:opacity-60"
        >
          {enabled ? "Active" : loading ? "Processing..." : "Upgrade"}
        </button>
      </div>
    </motion.div>
  );
}
