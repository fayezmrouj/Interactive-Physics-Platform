"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";

type Props = {
  completedToday: boolean;
  streak: number;
};

// حساب الوقت المتبقي حتى منتصف الليل (بداية يوم جديد = تحدٍّ جديد)
function getTimeUntilMidnight(): {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // منتصف الليل القادم
  const diff = midnight.getTime() - now.getTime();
  const total = Math.max(0, Math.floor(diff / 1000));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    total,
  };
}

export function DailyChallengeCountdown({ completedToday, streak }: Props) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col sm:flex-row items-center justify-center gap-3 px-4 py-2.5 rounded-xl border ${
        completedToday
          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
          : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            completedToday
              ? "bg-emerald-500 text-white"
              : "bg-amber-500 text-white"
          }`}
        >
          <Calendar className="w-4 h-4" />
        </div>
        <div className="text-right">
          <div
            className={`text-xs font-bold ${
              completedToday
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-amber-700 dark:text-amber-300"
            }`}
          >
            {completedToday
              ? "✓ أكملت تحدي اليوم!"
              : "⚡ تحدّ يومي جديد ينتظرك"}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            🔥 السلسلة الحالية: {streak} يوم متتالي
          </div>
        </div>
      </div>

      {/* الفاصل */}
      <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700" />

      {/* العدّاد */}
      <div className="flex items-center gap-1.5">
        <Clock
          className={`w-4 h-4 ${
            completedToday
              ? "text-emerald-500"
              : "text-amber-500 animate-pulse"
          }`}
        />
        <div className="text-xs text-slate-600 dark:text-slate-300">
          {completedToday ? "التحدّي القادم بعد" : "ينتهي التحدي الحالي بعد"}
        </div>
        <div className="flex items-center gap-1 font-mono font-bold text-sm tabular-nums">
          <TimeBox value={pad(timeLeft.hours)} unit="س" />
          <span className="text-slate-400">:</span>
          <TimeBox value={pad(timeLeft.minutes)} unit="د" />
          <span className="text-slate-400">:</span>
          <TimeBox value={pad(timeLeft.seconds)} unit="ث" />
        </div>
      </div>
    </motion.div>
  );
}

function TimeBox({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-100">
        {value}
      </span>
      <span className="text-[9px] text-slate-500 dark:text-slate-400">
        {unit}
      </span>
    </div>
  );
}
