"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Maximize2,
} from "lucide-react";

type Mode = "pomodoro" | "shortBreak" | "longBreak";

const DURATIONS: Record<Mode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const LABELS: Record<Mode, string> = {
  pomodoro: "تركيز (25 دقيقة)",
  shortBreak: "استراحة قصيرة (5 د)",
  longBreak: "استراحة طويلة (15 د)",
};

export function FocusMode() {
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.pomodoro);
  const [playing, setPlaying] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setPlaying(false);
          if (mode === "pomodoro") setSessions((x) => x + 1);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, mode]);

  function switchMode(m: Mode) {
    setMode(m);
    setSecondsLeft(DURATIONS[m]);
    setPlaying(false);
  }

  function reset() {
    setSecondsLeft(DURATIONS[mode]);
    setPlaying(false);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = ((DURATIONS[mode] - secondsLeft) / DURATIONS[mode]) * 100;

  // دائرة التقدم
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-violet-50 dark:bg-violet-950/30 rounded-lg">
        <Brain className="w-6 h-6 text-violet-700 dark:text-violet-400" />
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            وضع التركيز (Pomodoro)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تقنية بومودورو: 25 دقيقة دراسة + 5 دقائق استراحة
          </p>
        </div>
      </div>

      {/* اختيار الوضع */}
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(DURATIONS) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              mode === m
                ? "bg-violet-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            {m === "pomodoro" && <Maximize2 className="w-3 h-3 inline ml-1" />}
            {m === "shortBreak" && <Coffee className="w-3 h-3 inline ml-1" />}
            {LABELS[m].split(" ")[0]}
          </button>
        ))}
      </div>

      {/* الدائرة */}
      <Card className="bg-gradient-to-b from-violet-50 to-white dark:from-violet-950/20 dark:to-slate-900">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="relative w-56 h-56">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-200 dark:text-slate-800"
              />
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-linear"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
              </div>
              <Badge variant="outline" className="mt-2">
                {mode === "pomodoro" ? "🎯 دراسة" : "☕ استراحة"}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => setPlaying(!playing)}
              className="bg-violet-600 hover:bg-violet-700"
              size="lg"
              disabled={secondsLeft === 0}
            >
              {playing ? (
                <>
                  <Pause className="w-5 h-5 ml-1" />
                  إيقاف
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 ml-1" />
                  {secondsLeft === DURATIONS[mode] ? "ابدأ" : "متابعة"}
                </>
              )}
            </Button>
            <Button onClick={reset} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5 ml-1" />
              إعادة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات الجلسات */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-violet-600">{sessions}</div>
            <div className="text-xs text-slate-500">جلسات اليوم</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{sessions * 25}</div>
            <div className="text-xs text-slate-500">دقيقة دراسة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{Math.floor(sessions / 4)}</div>
            <div className="text-xs text-slate-500">جولات مكتملة</div>
          </CardContent>
        </Card>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-600 dark:text-slate-300 space-y-1">
        <div className="font-bold mb-1">💡 كيف تستخدم تقنية بومودورو:</div>
        <div>1. ادرس بتركيز كامل لـ 25 دقيقة (وضع التركيز)</div>
        <div>2. خذ استراحة 5 دقائق (استراحة قصيرة)</div>
        <div>3. بعد 4 جلسات دراسة، خذ استراحة طويلة 15 دقيقة</div>
        <div>4. ابتعد عن المشتتات أثناء جلسة التركيز!</div>
      </div>
    </div>
  );
}
