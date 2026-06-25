"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookA, Search, ArrowLeft } from "lucide-react";
import { getDictionary, getFormulaBank } from "@/lib/physics/dictionary";
import { Math } from "./math";
import { SmartMath } from "./smart-math";

type Props = {
  onNavigateLesson: (lessonId: string) => void;
};

type Tab = "concepts" | "formulas";

export function Dictionary({ onNavigateLesson }: Props) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("concepts");

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (tab === "concepts") {
      const dict = getDictionary();
      if (!q) return dict;
      return dict.filter(
        (e) =>
          e.term.toLowerCase().includes(q) ||
          e.definition.toLowerCase().includes(q)
      );
    } else {
      const bank = getFormulaBank();
      if (!q) return bank;
      return bank.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.expression.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
      );
    }
  }, [query, tab]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
        <BookA className="w-6 h-6 text-indigo-700 dark:text-indigo-400" />
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            قاموس المصطلحات الفيزيائية
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ابحث عن أي مصطلح أو قانون فيزيائي في المنهج كامل
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            tab === "concepts"
              ? "ابحث عن مصطلح... (مثل: السرعة، الجاذبية)"
              : "ابحث عن قانون... (مثل: F=ma، نيوتن)"
          }
          className="pr-10"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("concepts")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === "concepts"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          المفاهيم ({getDictionary().length})
        </button>
        <button
          onClick={() => setTab("formulas")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === "formulas"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          القوانين ({getFormulaBank().length})
        </button>
      </div>

      <ScrollArea className="h-[50vh] pr-2">
        <div className="space-y-2">
          {entries.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              لا توجد نتائج لـ "{query}"
            </div>
          ) : (
            entries.map((entry, i) => (
              <div
                key={i}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                {tab === "concepts" ? (
                  <ConceptCard entry={entry} onNavigateLesson={onNavigateLesson} />
                ) : (
                  <FormulaCard entry={entry as any} onNavigateLesson={onNavigateLesson} />
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function ConceptCard({
  entry,
  onNavigateLesson,
}: {
  entry: ReturnType<typeof getDictionary>[0];
  onNavigateLesson: (lessonId: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <h4 className="font-bold text-purple-900 dark:text-purple-200">
          {entry.term}
        </h4>
        <div className="flex items-center gap-1 flex-wrap">
          {entry.symbol && (
            <Badge className="bg-purple-600 text-white border-0">
              <SmartMath text={entry.symbol} />
            </Badge>
          )}
          {entry.unit && (
            <Badge variant="outline" className="border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300">
              <SmartMath text={entry.unit} />
            </Badge>
          )}
        </div>
      </div>
      {entry.value && (
        <div className="mb-2 px-2 py-1 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded text-xs">
          <span className="font-semibold text-amber-800 dark:text-amber-300">القيمة: </span>
          <span className="text-amber-900 dark:text-amber-200"><SmartMath text={entry.value} /></span>
        </div>
      )}
      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-2">
        {entry.definition}
      </p>
      <button
        onClick={() => onNavigateLesson(entry.lessonId)}
        className="text-xs text-indigo-700 dark:text-indigo-400 hover:underline flex items-center gap-1"
      >
        الذهاب للدرس: {entry.lessonTitle}
        <ArrowLeft className="w-3 h-3" />
      </button>
    </div>
  );
}

function FormulaCard({
  entry,
  onNavigateLesson,
}: {
  entry: ReturnType<typeof getFormulaBank>[0];
  onNavigateLesson: (lessonId: string) => void;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-bold text-cyan-900 dark:text-cyan-200">{entry.name}</h4>
        <div className="bg-white dark:bg-slate-800 rounded-lg px-3 py-1.5 border-2 border-cyan-300 dark:border-cyan-700 shrink-0">
          <span className="text-cyan-900 dark:text-cyan-200 font-bold text-sm">
            <Math math={entry.expression} />
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{entry.description}</p>
      <button
        onClick={() => onNavigateLesson(entry.lessonId)}
        className="text-xs text-indigo-700 dark:text-indigo-400 hover:underline flex items-center gap-1"
      >
        الذهاب للدرس: {entry.lessonTitle}
        <ArrowLeft className="w-3 h-3" />
      </button>
    </div>
  );
}
