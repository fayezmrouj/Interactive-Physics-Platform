"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Atom,
  Sparkles,
  Rocket,
  BookOpen,
  ChevronLeft,
  PlayCircle,
  Calculator,
  FlaskConical,
  Trophy,
  Brain,
  Search,
  Dumbbell,
  HelpCircle,
  Quote,
  Moon,
  Sun,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { getDailyQuote } from "@/lib/physics/quotes";
import { getTodayKey } from "@/lib/physics/practice-questions";
import { HowItWorks } from "./how-it-works";
import { UnitsPreview } from "./units-preview";
import { DailyChallengeCountdown } from "./daily-countdown";
import { ParticlesBackground, AtomAnimation } from "./particles";

type Props = {
  onStart: (name: string, grade: "9" | "10" | "all") => void;
  hasProgress?: boolean;
  studentName?: string;
  onContinue?: () => void;
  dailyChallengeCompletedToday?: boolean;
  dailyStreak?: number;
};

// مكوّن شعار المعلم - يستخدم صورة حقيقية إذا وُجدت، وإلا placeholder
function TeacherLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const [imgSrc, setImgSrc] = useState<string>("/teacher-photo.png");
  const [imgError, setImgError] = useState(false);
  const sizeClass = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-base",
    lg: "w-20 h-20 text-xl",
  }[size];

  // حاول تحميل الصورة (PNG أولًا للشفافية، ثم JPG كـ fallback)
  if (!imgError) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden border-2 border-white/40 shadow-lg shrink-0 bg-white/10`}>
        <img
          src={imgSrc}
          alt="المعلم فايز مروج"
          className="w-full h-full object-cover"
          onError={() => {
            if (imgSrc === "/teacher-photo.png") {
              setImgSrc("/teacher-photo.jpg");
            } else {
              setImgError(true);
            }
          }}
        />
      </div>
    );
  }
  // placeholder بأحرف "ف.م"
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white/40 shrink-0`}
    >
      ف.م
    </div>
  );
}

// شارة اسم المعلم - مستخدمة في الشهادة فقط
export function TeacherCredit({ variant = "light" }: { variant?: "light" | "dark" }) {
  const colorClass =
    variant === "dark"
      ? "text-white/90 bg-white/10 backdrop-blur-sm border-white/20"
      : "text-slate-700 bg-white/80 backdrop-blur-sm border-slate-200";
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold border ${colorClass} shadow-sm`}
    >
      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
      <span>تصميم وإعداد المعلم: فايز مروج</span>
    </div>
  );
}

// زر تبديل الوضع الليلي/النهاري
function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      title={isDark ? "التبديل للوضع النهاري" : "التبديل للوضع الليلي"}
      aria-label={isDark ? "التبديل للوضع النهاري" : "التبديل للوضع الليلي"}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-amber-300" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// عداد متحرك
function AnimatedCounter({
  value,
  suffix = "",
  duration = 1500,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    let rafId: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * value));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

// مكون الاقتباس اليومي
function DailyQuoteCard() {
  const quote = getDailyQuote();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-l from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 md:p-4 mb-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
          <Quote className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            اقتباس اليوم
          </div>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 italic leading-relaxed">
            «{quote.text}»
          </p>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 font-semibold">
            — {quote.author}
            {quote.context && (
              <span className="text-slate-500 dark:text-slate-500 font-normal">
                {" "}
                ({quote.context})
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// مكون اختيار الصف
function GradeSelector({
  value,
  onChange,
}: {
  value: "9" | "10" | "all";
  onChange: (v: "9" | "10" | "all") => void;
}) {
  const options: Array<{ id: "9" | "10" | "all"; label: string; emoji: string }> = [
    { id: "9", label: "الصف التاسع", emoji: "📘" },
    { id: "10", label: "الصف العاشر", emoji: "📕" },
    { id: "all", label: "كلا الصفين", emoji: "📚" },
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-slate-700">
        اختر صفك الدراسي
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
              value === opt.id
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-200 dark:ring-indigo-800"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300"
            }`}
          >
            <div className="text-lg mb-0.5">{opt.emoji}</div>
            <div className="text-xs leading-tight">{opt.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function WelcomeScreen({
  onStart,
  hasProgress,
  studentName,
  onContinue,
  dailyChallengeCompletedToday = false,
  dailyStreak = 0,
}: Props) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<"9" | "10" | "all">("all");
  const [error, setError] = useState("");
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("الرجاء إدخال اسمك (حرفان على الأقل).");
      return;
    }
    setError("");
    onStart(trimmed, grade);
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col">
      {/* خلفية متدرجة علمية */}
      <div className="absolute inset-0 bg-gradient-to-bl from-indigo-950 via-blue-900 to-purple-950" />

      {/* جسيمات متحركة + رموز فيزيائية عائمة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* الجسيمات المتحركة */}
        <ParticlesBackground count={35} />

        {/* توهجات خلفية ناعمة (أبقينا واحدة فقط للعمق) */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* رموز فيزيائية عائمة */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 font-mono text-3xl md:text-5xl font-bold"
            style={{
              top: `${10 + i * 14}%`,
              left: `${5 + (i * 17) % 90}%`,
            }}
            animate={{ y: [0, -15, 0], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          >
            {["F=ma", "E=mc²", "λ·f=v", "ρ=m/V", "P=F/A", "v²=v₀²+2ax"][i]}
          </motion.div>
        ))}
      </div>

      {/* ============ الترويسة العلوية ============ */}
      <header className="relative z-20 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between gap-3">
        {/* شعار المعلم + العبارة - يسار */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <TeacherLogo size="md" />
          <div className="hidden sm:block">
            <div className="text-white/95 font-bold text-sm md:text-base leading-tight">
              المعلم فايز مروج
            </div>
            <div className="text-white/60 text-xs">
              معد ومصمم المنصة
            </div>
          </div>
        </motion.div>

        {/* أدوات يمين - زر الوضع الليلي فقط */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <ThemeToggleButton />
        </motion.div>
      </header>

      {/* ============ المحتوى الرئيسي ============ */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* اقتباس اليوم */}
          <DailyQuoteCard />

          <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-white/40">
            <CardHeader className="text-center pb-2 pt-8 md:pt-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 120 }}
                className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg mb-4 overflow-hidden"
              >
                <AtomAnimation size={80} />
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-l from-indigo-700 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-2">
                منصة الفيزياء التفاعلية
              </h1>
              <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                رحلة تعليمية شاملة لفيزياء الصفين التاسع والعاشر، مبنية على الكتب المدرسية الرسمية.
                ابدأ بالاستكشاف، طبّق القوانين، واختبر نفسك بالكويزات التفاعلية.
              </p>

              {/* شارات المنهج */}
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                  <BookOpen className="w-3 h-3 ml-1" />
                  10 وحدات دراسية
                </Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Sparkles className="w-3 h-3 ml-1" />
                  24 درسًا
                </Badge>
                <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Rocket className="w-3 h-3 ml-1" />
                  قوانين + أمثلة + كويزات
                </Badge>
              </div>

              {/* عدّادات إحصائية متحركة */}
              <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-slate-200">
                <StatCounter
                  value={89}
                  label="مفهوم"
                  color="text-indigo-600"
                />
                <StatCounter
                  value={75}
                  label="قانون"
                  color="text-purple-600"
                />
                <StatCounter
                  value={50}
                  label="سؤال تدريب"
                  color="text-cyan-600"
                />
                <StatCounter
                  value={15}
                  suffix="+"
                  label="ميزة"
                  color="text-rose-600"
                />
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              {/* عدّاد التحدي اليومي */}
              <div className="mb-4">
                <DailyChallengeCountdown
                  completedToday={dailyChallengeCompletedToday}
                  streak={dailyStreak}
                />
              </div>

              {/* زر متابعة التعلم إن وُجد تقدم سابق */}
              {hasProgress && studentName && onContinue ? (
                <div className="space-y-3 mb-4">
                  <Button
                    onClick={onContinue}
                    size="lg"
                    className="w-full h-12 md:h-14 text-base md:text-lg font-bold bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all group"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    <span>متابعة كـ {studentName}</span>
                  </Button>
                  <div className="text-center text-xs text-slate-500">
                    أو سجّل اسمًا جديدًا بالأسفل
                  </div>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* اختيار الصف */}
                <GradeSelector value={grade} onChange={setGrade} />

                {/* إدخال الاسم */}
                <div className="space-y-2">
                  <Label htmlFor="student-name" className="text-base font-semibold text-slate-700">
                    ما اسمك أيها الفيزيائي؟
                  </Label>
                  <Input
                    id="student-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اكتب اسمك هنا..."
                    className="h-12 text-base bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    autoFocus
                    maxLength={40}
                  />
                  {error && <p className="text-sm text-rose-600">{error}</p>}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 h-12 md:h-14 text-base md:text-lg font-bold bg-gradient-to-l from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all group"
                  >
                    <span>ابدأ رحلة الاستكشاف</span>
                    <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setShowHowItWorks(true)}
                    className="h-12 md:h-14 px-4 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                    title="شرح طريقة استخدام المنصة"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span className="hidden md:inline mr-1">كيف يعمل؟</span>
                  </Button>
                </div>
              </form>

              <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed">
                سيتم حفظ اسمك وتقدمك بشكل دائم على هذا المتصفح باستخدام LocalStorage.
                يمكنك متابعة التعلم في أي وقت دون الحاجة لإعادة البدء.
              </p>
            </CardContent>
          </Card>

          {/* معاينة سريعة للميزات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-2"
          >
            <FeaturePreview icon={<Calculator className="w-4 h-4" />} label="حاسبة" />
            <FeaturePreview icon={<FlaskConical className="w-4 h-4" />} label="محاكاة" />
            <FeaturePreview icon={<Search className="w-4 h-4" />} label="بحث" />
            <FeaturePreview icon={<Dumbbell className="w-4 h-4" />} label="تدريب" />
            <FeaturePreview icon={<Trophy className="w-4 h-4" />} label="إنجازات" />
            <FeaturePreview icon={<Brain className="w-4 h-4" />} label="مراجعة" />
          </motion.div>

          {/* معاينة الوحدات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
              <UnitsPreview highlightGrade={grade} />
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* ============ التذييل ============ */}
      <footer className="relative z-20 px-4 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row items-center justify-center gap-2 border-t border-white/10">
        <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm flex-wrap justify-center">
          <Atom className="w-4 h-4 text-cyan-400" />
          <span>© 2026 منصة الفيزياء التفاعلية</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">جميع الحقوق محفوظة</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-white/90 font-semibold">تصميم وإعداد المعلم: فايز مروج</span>
        </div>
      </footer>

      {/* Dialog كيف يعمل؟ */}
      <HowItWorks open={showHowItWorks} onOpenChange={setShowHowItWorks} />
    </div>
  );
}

function StatCounter({
  value,
  label,
  suffix = "",
  color,
}: {
  value: number;
  label: string;
  suffix?: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className={`text-xl md:text-2xl font-extrabold ${color}`}>
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5">
        {label}
      </div>
    </div>
  );
}

function FeaturePreview({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors">
      <div className="text-cyan-300">{icon}</div>
      <span className="text-[10px] md:text-xs text-white/80 font-medium">
        {label}
      </span>
    </div>
  );
}
