"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calculator,
  Trophy,
  X,
  Sparkles,
} from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SLIDES = [
  {
    icon: <BookOpen className="w-12 h-12" />,
    color: "from-indigo-500 to-blue-600",
    bg: "from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/20",
    title: "اقرأ الدروس بسهولة",
    description:
      "اختر وحدة من الوحدات الـ10، ثم افتح أي درس من الـ24 درسًا. كل درس يحتوي على شرح مفصّل، مفاهيم، قوانين، أمثلة محلولة خطوة بخطوة، تجربة مخبرية تفاعلية، وأخطاء مفاهيمية شائعة.",
    points: [
      "📚 10 وحدات دراسية موزعة على الصفين التاسع والعاشر",
      "🎯 أهداف واضحة لكل درس",
      "✨ شرح ميسّر مع رسم تخيلي للتجارب",
    ],
  },
  {
    icon: <Calculator className="w-12 h-12" />,
    color: "from-emerald-500 to-cyan-600",
    bg: "from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/20",
    title: "تطبيق وأدوات تفاعلية",
    description:
      "بعد قراءة الدرس، استخدم الحاسبة الفيزيائية لحل المسائل، جرّب المختبر التفاعلي لرؤية الفيزياء حية، واختبر نفسك بالكويز. كل ميزة متاحة من زر «المزيد» في الأعلى.",
    points: [
      "🧮 حاسبة فيزيائية لـ12 قانونًا مع شرح الخطوات",
      "🔬 مختبر محاكاة: سقوط حر، نيوتن، انكسار، موجات",
      "✏️ كويز تفاعلي لكل درس مع تصحيح فوري",
    ],
  },
  {
    icon: <Trophy className="w-12 h-12" />,
    color: "from-amber-500 to-orange-600",
    bg: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20",
    title: "تتبّع تقدّمك واكسب الإنجازات",
    description:
      "كل درس تكمله يحدّث شريط التقدم. كل كويز تُجيب عنه بشكل صحيح يفتح إنجازًا جديدًا. عند إكمال 70% من المنهج، ستحصل على شهادة إتمام قابلة للطباعة. تقدّمك يُحفظ تلقائيًا على متصفحك.",
    points: [
      "🏆 19 إنجازًا وشارة لتحفيزك",
      "📊 إحصائيات مفصّلة لأدائك",
      "🎓 شهادة إتمام عند إكمال 70% من المنهج",
    ],
  },
];

export function HowItWorks({ open, onOpenChange }: Props) {
  const [step, setStep] = useState(0);

  function handleClose() {
    onOpenChange(false);
    setTimeout(() => setStep(0), 200);
  }

  function handleNext() {
    if (step < SLIDES.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleClose();
    }
  }

  function handlePrev() {
    if (step > 0) setStep((s) => s - 1);
  }

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : handleClose())}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden" dir="rtl">
        <DialogHeader className="sr-only">
          <DialogTitle>كيف تعمل المنصة؟</DialogTitle>
        </DialogHeader>

        {/* زر الإغلاق */}
        <button
          onClick={handleClose}
          className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* محتوى الشريحة */}
        <div className={`bg-gradient-to-b ${slide.bg} p-6 md:p-8`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* الأيقونة */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.1, stiffness: 120 }}
                className={`mx-auto w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr ${slide.color} text-white flex items-center justify-center shadow-lg mb-4`}
              >
                {slide.icon}
              </motion.div>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {slide.title}
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {slide.description}
              </p>

              {/* النقاط */}
              <div className="space-y-2 text-right">
                {slide.points.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm"
                  >
                    <span className="text-sm text-slate-700 dark:text-slate-200">
                      {point}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* شريط التقدّم + الأزرار */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          {/* النقاط */}
          <div className="flex justify-center gap-2 mb-4">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === step
                    ? "w-8 bg-indigo-600 dark:bg-indigo-400"
                    : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
                aria-label={`الشريحة ${i + 1}`}
              />
            ))}
          </div>

          {/* الأزرار */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={step === 0}
              className="border-slate-300 dark:border-slate-700"
            >
              <ChevronRight className="w-4 h-4 ml-1" />
              السابق
            </Button>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              {step + 1} / {SLIDES.length}
            </span>

            <Button
              size="sm"
              onClick={handleNext}
              className="bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isLast ? (
                <>
                  <Sparkles className="w-4 h-4 ml-1" />
                  هيا نبدأ!
                </>
              ) : (
                <>
                  التالي
                  <ChevronLeft className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
