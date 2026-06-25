"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, Target, BookOpen, CheckCircle2, X, Trophy, Sparkles } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grade9Pct: number;
  grade10Pct: number;
  grade9Completed: number;
  grade10Completed: number;
  grade9Total: number;
  grade10Total: number;
};

export function CertificateInstructions({
  open,
  onOpenChange,
  grade9Pct,
  grade10Pct,
  grade9Completed,
  grade10Completed,
  grade9Total,
  grade10Total,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden" dir="rtl">
        {/* زر الإغلاق */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 flex items-center justify-center text-slate-500 hover:text-rose-600 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* الرأس المتدرج */}
        <div className="bg-gradient-to-l from-amber-500 to-orange-500 p-6 text-center text-white">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.1, stiffness: 120 }}
            className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3"
          >
            <Award className="w-9 h-9" />
          </motion.div>
          <h2 className="text-xl font-bold">كيف تحصل على الشهادة؟</h2>
          <p className="text-xs text-white/80 mt-1">
            أكمل جميع دروس الصف للحصول على شهادته
          </p>
        </div>

        {/* المحتوى */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* شهادة الصف التاسع */}
          <GradeCard
            grade={9}
            pct={grade9Pct}
            completed={grade9Completed}
            total={grade9Total}
            color="from-blue-500 to-indigo-600"
          />

          {/* شهادة الصف العاشر */}
          <GradeCard
            grade={10}
            pct={grade10Pct}
            completed={grade10Completed}
            total={grade10Total}
            color="from-purple-500 to-fuchsia-600"
          />

          {/* الخطوات */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              الخطوات:
            </h3>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">1</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                أكمل <span className="font-bold">جميع دروس</span> الصف التاسع أو العاشر (أو كليهما)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">2</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                أجب عن الكويزات وثبّت فهمك لكل درس
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">3</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                عند إكمال 100% من دروس الصف، سيتم تفعيل زر الشهادة تلقائيًا
              </p>
            </div>
          </div>

          {/* حافز */}
          <div className="bg-gradient-to-l from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
              يمكنك الحصول على شهادتين: واحدة للصف التاسع وواحدة للصف العاشر! 🎓
            </p>
          </div>

          {/* زر الإغلاق */}
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            هيا نكمل الدروس!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GradeCard({
  grade,
  pct,
  completed,
  total,
  color,
}: {
  grade: 9 | 10;
  pct: number;
  completed: number;
  total: number;
  color: string;
}) {
  const isComplete = pct >= 100;
  return (
    <div className={`rounded-xl p-4 border ${isComplete ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${color} flex items-center justify-center text-white text-xs font-bold`}>
            {grade}
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            شهادة الصف {grade === 9 ? "التاسع" : "العاشر"}
          </span>
        </div>
        {isComplete ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <span className="text-xs font-bold text-slate-500">{pct}%</span>
        )}
      </div>
      <Progress value={pct} className="h-2 mb-1.5" />
      <div className="flex items-center justify-between text-[10px] text-slate-500">
        <span>{completed} / {total} درس</span>
        <span>{isComplete ? "مكتمل ✓" : `تبقى ${total - completed} درس`}</span>
      </div>
    </div>
  );
}
