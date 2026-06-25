"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Lock } from "lucide-react";
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  computeAchievementPoints,
} from "@/lib/physics/achievements";
import { useState } from "react";

type Props = {
  unlockedAchievements: string[];
};

export function Achievements({ unlockedAchievements }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const totalPoints = computeAchievementPoints(unlockedAchievements);
  const totalPossible = ACHIEVEMENTS.reduce((acc, a) => acc + a.points, 0);

  const filtered =
    filter === "all"
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter((a) => a.category === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-gradient-to-l from-amber-100 to-yellow-100 dark:from-amber-950/40 dark:to-yellow-950/30 rounded-lg">
        <Trophy className="w-6 h-6 text-amber-700 dark:text-amber-400" />
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            الإنجازات والشارات
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            اجمع النقاط بإنجاز الأهداف التعليمية!
          </p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-400">
            {totalPoints}
          </div>
          <div className="text-xs text-slate-500">/ {totalPossible}</div>
        </div>
      </div>

      {/* شريط التقدم الكلي */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-semibold">التقدم الكلي</span>
          <span>{unlockedAchievements.length} / {ACHIEVEMENTS.length} إنجاز</span>
        </div>
        <Progress
          value={(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}
          className="h-2"
        />
      </div>

      {/* فلتر التصنيفات */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-amber-500 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          الكل
        </button>
        {ACHIEVEMENT_CATEGORIES.map((cat) => {
          const count = ACHIEVEMENTS.filter(
            (a) =>
              a.category === cat.id &&
              unlockedAchievements.includes(a.id)
          ).length;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === cat.id
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              {cat.icon} {cat.title} ({count})
            </button>
          );
        })}
      </div>

      {/* قائمة الإنجازات */}
      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((ach) => {
          const unlocked = unlockedAchievements.includes(ach.id);
          return (
            <Card
              key={ach.id}
              className={`${
                unlocked
                  ? "border-amber-300 dark:border-amber-700 bg-gradient-to-bl from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/10"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-70"
              } transition-all hover:scale-[1.01]`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    unlocked
                      ? "bg-gradient-to-tr from-amber-400 to-yellow-500 shadow-md"
                      : "bg-slate-200 dark:bg-slate-700 grayscale"
                  }`}
                >
                  {unlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-bold text-sm ${unlocked ? "text-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}>
                      {ach.title}
                    </h4>
                    <Badge
                      variant={unlocked ? "default" : "outline"}
                      className={`text-[10px] shrink-0 ${
                        unlocked
                          ? "bg-amber-500 text-white"
                          : "text-slate-400"
                      }`}
                    >
                      +{ach.points}
                    </Badge>
                  </div>
                  <p className={`text-xs mt-1 ${unlocked ? "text-slate-600 dark:text-slate-300" : "text-slate-400"}`}>
                    {ach.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
