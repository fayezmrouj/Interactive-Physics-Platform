"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Clock,
  Target,
  TrendingUp,
  Award,
} from "lucide-react";
import { ALL_UNITS, CURRICULUM } from "@/lib/physics";
import type { UserProfile } from "@/lib/use-progress";
import { formatTime } from "@/lib/use-progress";

type Props = {
  profile: UserProfile;
};

export function Analytics({ profile }: Props) {
  // إحصائيات الإكمال لكل وحدة
  const unitStats = ALL_UNITS.map((unit) => {
    const completed = unit.lessons.filter((l) =>
      profile.completedLessons.includes(l.id)
    ).length;
    const total = unit.lessons.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const time = unit.lessons.reduce(
      (acc, l) => acc + (profile.lessonTimeSeconds[l.id] || 0),
      0
    );
    return { unit, completed, total, pct, time };
  });

  // نتائج الكويز لكل وحدة
  const quizStats = ALL_UNITS.map((unit) => {
    const lessonsWithQuiz = unit.lessons.filter((l) => profile.quizResults[l.id]);
    if (lessonsWithQuiz.length === 0)
      return { unit, avg: 0, count: 0 };
    const sum = lessonsWithQuiz.reduce(
      (acc, l) =>
        acc + (profile.quizResults[l.id].correct / profile.quizResults[l.id].total) * 100,
      0
    );
    return { unit, avg: Math.round(sum / lessonsWithQuiz.length), count: lessonsWithQuiz.length };
  });

  // خريطة حرارية لآخر 30 يوم
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d;
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const heatmap = last30Days.map((d) => {
    const dayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const challenge = profile.dailyChallengeCompletedDates.includes(dayKey);
    // للتطبيق الحقيقي سنحتاج تتبع وقت يومي كامل
    return { dayKey, challenge, day: d.getDay() };
  });

  // إحصائيات التدريب
  const practice = profile.practiceStats;
  const practicePct =
    practice.totalAnswered > 0
      ? Math.round((practice.totalCorrect / practice.totalAnswered) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
        <BarChart3 className="w-6 h-6 text-blue-700 dark:text-blue-400" />
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            إحصائيات وتحليلات الأداء
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تتبع نقاط قوتك وضعفك في المنهج
          </p>
        </div>
      </div>

      {/* بطاقات الإحصائيات الرئيسية */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="نسبة الإكمال"
          value={`${Math.round((profile.completedLessons.length / 24) * 100)}%`}
          color="indigo"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="وقت الدراسة"
          value={formatTime(profile.totalTimeSeconds)}
          color="purple"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="إنجازات"
          value={`${profile.unlockedAchievements.length}`}
          color="amber"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="دقة التدريب"
          value={`${practicePct}%`}
          color="emerald"
        />
      </div>

      {/* خريطة حرارية لآخر 30 يوم */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-sm">
            📅 نشاط آخر 30 يوم
          </h4>
          <div className="grid grid-cols-10 gap-1.5">
            {heatmap.map((day, i) => (
              <div
                key={i}
                className={`aspect-square rounded text-xs flex items-center justify-center ${
                  day.challenge
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
                title={day.dayKey}
              >
                {day.challenge ? "✓" : ""}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
            <span>أقل</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-3 h-3 rounded bg-emerald-500" />
            </div>
            <span>أكثر</span>
          </div>
        </CardContent>
      </Card>

      {/* تقدم كل وحدة */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            📚 تقدمك في كل وحدة
          </h4>
          {unitStats.map(({ unit, completed, total, pct, time }) => (
            <div key={unit.id} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {unit.title}
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{completed}/{total}</span>
                  {time > 0 && <span>• {formatTime(time)}</span>}
                  <span className="font-bold text-slate-700 dark:text-slate-200">{pct}%</span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-l ${unit.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* متوسط نتائج الكويز */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            ✏️ متوسط نتائج الكويز لكل وحدة
          </h4>
          {quizStats.map(({ unit, avg, count }) => (
            <div key={unit.id} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {unit.title}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">{count > 0 ? `${count} كويز` : "لم يبدأ"}</span>
                  <span className={`font-bold ${avg >= 70 ? "text-emerald-600" : avg >= 50 ? "text-amber-600" : "text-slate-400"}`}>
                    {avg > 0 ? `${avg}%` : "—"}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    avg >= 70 ? "bg-emerald-500" : avg >= 50 ? "bg-amber-500" : "bg-rose-400"
                  }`}
                  style={{ width: `${avg}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* أداء التدريب حسب الصعوبة */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            🎯 أداء التدريب حسب الصعوبة
          </h4>
          {(["easy", "medium", "hard"] as const).map((diff) => {
            const stats = practice.byDifficulty[diff];
            const pct = stats.t > 0 ? Math.round((stats.c / stats.t) * 100) : 0;
            return (
              <div key={diff} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {diff === "easy" ? "🟢 سهل" : diff === "medium" ? "🟡 متوسط" : "🔴 صعب"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {stats.c}/{stats.t} ({pct}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      diff === "easy" ? "bg-emerald-500" : diff === "medium" ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
            إجمالي: {practice.totalAnswered} سؤال • {practice.totalCorrect} صحيحة ({practicePct}%)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "indigo" | "purple" | "amber" | "emerald";
}) {
  const colorMap = {
    indigo: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300",
    purple: "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300",
    amber: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
    emerald: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
  };
  return (
    <Card>
      <CardContent className="p-3 text-center">
        <div className={`w-10 h-10 rounded-lg ${colorMap[color]} flex items-center justify-center mx-auto mb-2`}>
          {icon}
        </div>
        <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{value}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      </CardContent>
    </Card>
  );
}
