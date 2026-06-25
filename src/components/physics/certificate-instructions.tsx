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
  completionPct: number;
  completedLessons: number;
  totalLessons: number;
};

export function CertificateInstructions({
  open,
  onOpenChange,
  completionPct,
  completedLessons,
  totalLessons,
}: Props) {
  const remaining = Math.max(0, 70 - completionPct);
  const lessonsRemaining = Math.max(0, Math.ceil((70 / 100) * totalLessons) - completedLessons);

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
            اتبع الخطوات التالية لإتمام رحلتك
          </p>
        </div>

        {/* المحتوى */}
        <div className="p-5 space-y-4">
          {/* حالة التقدم الحالية */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-amber-800 dark:text-amber-300">
                تقدمك الحالي
              </span>
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {completionPct}%
              </span>
            </div>
            <Progress value={completionPct} className="h-2.5 mb-2" />
            <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {completedLessons} / {totalLessons} درس
              </span>
              <span>
                تبقى {remaining}% للحصول على الشهادة
              </span>
            </div>
          </div>

          {/* الخطوات */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              الخطوات المطلوبة:
            </h3>

            <Step
              number={1}
              icon={<BookOpen className="w-4 h-4" />}
              title="أكمل الدروس"
              description={`أكمل ${lessonsRemaining} درسًا إضافيًا للوصول إلى 70% من المنهج`}
              done={completionPct >= 70}
            />
            <Step
              number={2}
              icon={<CheckCircle2 className="w-4 h-4" />}
              title="أجب عن الكويزات"
              description="أجب عن كويز كل درس لتثبيت الفهم واكتساب النقاط"
              done={false}
            />
            <Step
              number={3}
              icon={<Trophy className="w-4 h-4" />}
              title="احصل على شهادتك"
              description="عند الوصول لـ 70% سيتم تفعيل زر الشهادة تلقائيًا"
              done={false}
            />
          </div>

          {/* حافز */}
          <div className="bg-gradient-to-l from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
              كل درس تكمله يقربك خطوة من الشهادة! واصل التعلم وستحصل عليها قريبًا 💪
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

function Step({
  number,
  icon,
  title,
  description,
  done,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  done: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
          done
            ? "bg-emerald-500 text-white"
            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
        }`}
      >
        {done ? <CheckCircle2 className="w-4 h-4" /> : number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-sm">{icon}</span>
          <h4 className={`text-sm font-semibold ${done ? "text-emerald-700 dark:text-emerald-400" : "text-slate-800 dark:text-slate-100"}`}>
            {title}
          </h4>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
