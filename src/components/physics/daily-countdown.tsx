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
      className={`flex flex-col sm:flex-row items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 ${
        completedToday
          ? "bg-emerald-100 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700"
          : "bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ${
            completedToday ? "bg-emerald-600" : "bg-amber-600"
          }`}
        >
          <Calendar className="w-4 h-4" />
        </div>
        <div className="text-right">
          <div
            className={`text-xs font-bold ${
              completedToday ? "text-emerald-800 dark:text-emerald-300" : "text-amber-800 dark:text-amber-300"
            }`}
          >
            {completedToday
              ? "✓ أكملت تحدي اليوم!"
              : "⚡ تحدّ يومي جديد ينتظرك"}
          </div>
          <div className={`text-[10px] font-medium ${completedToday ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
            🔥 السلسلة الحالية: {streak} يوم متتالي
          </div>
        </div>
      </div>

      {/* الفاصل */}
      <div className="hidden sm:block w-px h-8 bg-slate-300" />

      {/* العدّاد */}
      <div className="flex items-center gap-1.5">
        <Clock
          className={`w-4 h-4 ${completedToday ? "text-emerald-600" : "text-amber-600 animate-pulse"}`}
        />
        <div className={`text-xs font-medium ${completedToday ? "text-emerald-800 dark:text-emerald-300" : "text-amber-800 dark:text-amber-300"}`}>
          {completedToday ? "التحدّي القادم بعد" : "ينتهي التحدي الحالي بعد"}
        </div>
        <div className="flex items-center gap-1 font-mono font-bold text-sm tabular-nums">
          <TimeBox value={pad(timeLeft.hours)} unit="س" completedToday={completedToday} />
          <span className="text-slate-400">:</span>
          <TimeBox value={pad(timeLeft.minutes)} unit="د" completedToday={completedToday} />
          <span className="text-slate-400">:</span>
          <TimeBox value={pad(timeLeft.seconds)} unit="ث" completedToday={completedToday} />
        </div>
      </div>
    </motion.div>
  );
}

function TimeBox({ value, unit, completedToday }: { value: string; unit: string; completedToday: boolean }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className={`px-1.5 py-0.5 rounded font-bold ${completedToday ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"}`}>
        {value}
      </span>
      <span className={`text-[9px] font-medium ${completedToday ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
        {unit}
      </span>
    </div>
  );
}
