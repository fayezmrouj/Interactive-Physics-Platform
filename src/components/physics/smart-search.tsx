"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Sigma, Wand2, ArrowLeft, X } from "lucide-react";
import { searchAll, type SearchResult } from "@/lib/physics/dictionary";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateLesson: (lessonId: string) => void;
};

export function SmartSearch({ open, onOpenChange, onNavigateLesson }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results: SearchResult[] = useMemo(
    () => (query.trim() ? searchAll(query) : []),
    [query]
  );

  // إعادة التركيز على input عند الفتح
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // إعادة ضبط activeIndex عند تغيّر البحث
  useEffect(() => {
    const timer = setTimeout(() => setActiveIndex(0), 0);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(result: SearchResult) {
    if (result.lessonId) {
      onNavigateLesson(result.lessonId);
      onOpenChange(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  }

  const typeIcon = {
    lesson: <BookOpen className="w-4 h-4 text-indigo-600" />,
    concept: <Sigma className="w-4 h-4 text-purple-600" />,
    formula: <Wand2 className="w-4 h-4 text-cyan-600" />,
  };

  const typeLabel = {
    lesson: "درس",
    concept: "مفهوم",
    formula: "قانون",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden" dir="rtl">
        <DialogHeader className="sr-only">
          <DialogTitle>البحث الذكي</DialogTitle>
        </DialogHeader>

        {/* زر الإغلاق - يمين */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 flex items-center justify-center text-white shadow-md transition-colors"
          aria-label="إغلاق"
          title="إغلاق"
        >
          <X className="w-5 h-5" strokeWidth={3} />
        </button>

        <div className="flex items-center gap-3 p-4 pl-12 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <Search className="w-5 h-5 text-slate-500 shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ابحث عن درس، مفهوم، أو قانون... (مثل: نيوتن، F=ma، الكثافة)"
            className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-base"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950/40 flex items-center justify-center text-slate-500 hover:text-rose-600 transition-colors shrink-0"
              aria-label="مسح البحث"
              title="مسح"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div
          className="max-h-[60vh] overflow-y-auto overflow-x-hidden"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}
        >
          <div className="p-2">
            {query.trim() === "" ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  ابدأ بالكتابة للبحث في {searchAll("").length === 0 ? "الدروس والمفاهيم والقوانين" : "المنهج"}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setQuery("نيوتن")}
                  >
                    نيوتن
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setQuery("الجاذبية")}
                  >
                    الجاذبية
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setQuery("الموجات")}
                  >
                    الموجات
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setQuery("F=ma")}
                  >
                    F=ma
                  </Badge>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <p className="text-sm">لا توجد نتائج لـ "{query}"</p>
              </div>
            ) : (
              <>
                <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                  {results.length} نتيجة
                </div>
                {results.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect(r)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full text-right p-3 rounded-lg flex items-start gap-3 transition-colors ${
                      i === activeIndex
                        ? "bg-indigo-50 dark:bg-indigo-950/30"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      {typeIcon[r.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-4 px-1.5"
                        >
                          {typeLabel[r.type]}
                        </Badge>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {r.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        {r.subtitle}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {r.snippet}
                      </p>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
