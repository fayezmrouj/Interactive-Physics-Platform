"use client";

import { motion } from "framer-motion";
import { ALL_UNITS, CURRICULUM } from "@/lib/physics";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  onSelectUnit?: (unitId: string) => void;
  highlightGrade?: "9" | "10" | "all";
};

// أيقونات مختصرة لكل وحدة
const UNIT_ICONS: Record<string, string> = {
  "g9s1-u1": "📏",
  "g9s1-u2": "🎯",
  "g9s1-u3": "⚙️",
  "g9s2-u4": "💧",
  "g9s2-u5": "🌈",
  "g10s1-u1": "➡️",
  "g10s1-u2": "🚀",
  "g10s2-u4": "🪐",
  "g10s2-u5": "🌊",
  "g10s2-u6": "〰️",
};

export function UnitsPreview({ onSelectUnit, highlightGrade = "all" }: Props) {
  // رتّب الوحدات حسب الصف المختار
  const sortedUnits = [...ALL_UNITS].sort((a, b) => {
    if (highlightGrade === "9") {
      const aG9 = a.grade.includes("التاسع") ? 0 : 1;
      const bG9 = b.grade.includes("التاسع") ? 0 : 1;
      return aG9 - bG9;
    }
    if (highlightGrade === "10") {
      const aG10 = a.grade.includes("العاشر") ? 0 : 1;
      const bG10 = b.grade.includes("العاشر") ? 0 : 1;
      return aG10 - bG10;
    }
    return 0;
  });

  return (
    <TooltipProvider delayDuration={200}>
      <div className="w-full">
        <div className="text-center mb-3">
          <h3 className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-200">
            📚 استكشف الوحدات الـ10
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {highlightGrade === "9"
              ? "مبوّبة حسب الصف التاسع أولًا"
              : highlightGrade === "10"
              ? "مبوّبة حسب الصف العاشر أولًا"
              : "اضغط على أي وحدة لمعرفة المزيد"}
          </p>
        </div>

        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex gap-2 px-1 min-w-max">
            {sortedUnits.map((unit, idx) => {
              const isHighlighted =
                highlightGrade === "all" ||
                (highlightGrade === "9" && unit.grade.includes("التاسع")) ||
                (highlightGrade === "10" && unit.grade.includes("العاشر"));

              const isDimmed = !isHighlighted;

              return (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isDimmed ? 0.5 : 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05, opacity: 1 }}
                  className="shrink-0"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onSelectUnit?.(unit.id)}
                        className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-gradient-to-tr ${unit.color} text-white shadow-md hover:shadow-lg transition-all w-24 h-24 ${
                          isHighlighted ? "ring-2 ring-white/40" : ""
                        }`}
                      >
                        <span className="text-2xl">
                          {UNIT_ICONS[unit.id] || "📕"}
                        </span>
                        <span className="text-[10px] font-bold leading-tight text-center line-clamp-2">
                          {unit.title}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="text-right">
                        <div className="font-bold text-xs">{unit.title}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">
                          {unit.grade} • {unit.semester}
                        </div>
                        <div className="text-[10px] opacity-70 mt-0.5">
                          {unit.lessons.length} دروس
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        {/* ملخص حسب الصف */}
        <div className="flex justify-center gap-3 mt-3">
          {CURRICULUM.map((group) => {
            const isHighlighted =
              highlightGrade === "all" ||
              (highlightGrade === "9" && group.grade.includes("التاسع")) ||
              (highlightGrade === "10" && group.grade.includes("العاشر"));
            const lessonsCount = group.units.reduce(
              (acc, u) => acc + u.lessons.length,
              0
            );
            return (
              <div
                key={`${group.grade}-${group.semester}`}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  isHighlighted
                    ? "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                {group.grade} • {group.semester} ({lessonsCount} دروس)
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
