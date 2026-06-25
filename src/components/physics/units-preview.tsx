"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ALL_UNITS, CURRICULUM } from "@/lib/physics";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  // تحديث حالة أزرار التمرير
  function updateScrollButtons() {
    const el = scrollRef.current;
    if (!el) return;
    // في RTL، scrollLeft يكون سالبًا عند التمرير لليسار (أمام)
    const scrollLeft = Math.abs(el.scrollLeft);
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(scrollLeft < maxScroll - 5);
    setCanScrollRight(scrollLeft > 5);
  }

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  // التمرير بمقدار معين (يعمل في RTL و LTR)
  function scrollByAmount(direction: "next" | "prev") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    // في RTL، "next" يعني التمرير للأمام (scrollLeft يصبح أكثر سالبية)
    const dir = direction === "next" ? -1 : 1;
    el.scrollBy({ left: amount * dir, behavior: "smooth" });
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="w-full">
        <div className="text-center mb-3">
          <h3 className="text-sm md:text-base font-bold text-white">
            📚 استكشف الوحدات الـ10
          </h3>
          <p className="text-xs text-white/70 mt-0.5">
            {highlightGrade === "9"
              ? "مبوّبة حسب الصف التاسع أولًا"
              : highlightGrade === "10"
              ? "مبوّبة حسب الصف العاشر أولًا"
              : "اضغط على أي وحدة • مرّر أفقيًا لرؤية المزيد"}
          </p>
        </div>

        {/* شريط الوحدات مع أزرار التنقل */}
        <div className="relative">
          {/* زر التمرير للأمام (يمين في RTL) */}
          {canScrollLeft && (
            <button
              onClick={() => scrollByAmount("next")}
              className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              aria-label="عرض المزيد من الوحدات"
              title="عرض المزيد"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* زر التمرير للخلف (يسار في RTL) */}
          {canScrollRight && (
            <button
              onClick={() => scrollByAmount("prev")}
              className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              aria-label="العودة للوحدات السابقة"
              title="العودة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* شريط الوحدات - قابل للتمرير الأفقي باللمس والماوس */}
          <div
            ref={scrollRef}
            onScroll={updateScrollButtons}
            className="w-full overflow-x-auto overflow-y-hidden pb-3 px-1"
            style={{
              scrollbarWidth: "thin",
              WebkitOverflowScrolling: "touch",
              cursor: "grab",
            }}
          >
            <div className="flex gap-2 min-w-max px-1">
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
          </div>
        </div>

        {/* مؤشر النقاط */}
        <div className="flex justify-center gap-1.5 mt-2">
          {sortedUnits.map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600"
            />
          ))}
        </div>

        {/* ملخص حسب الصف */}
        <div className="flex justify-center gap-3 mt-3 flex-wrap">
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
                    ? "bg-white/20 text-white font-semibold"
                    : "bg-white/5 text-white/50"
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

