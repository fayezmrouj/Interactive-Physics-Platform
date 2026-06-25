"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  CircleCheck,
  CircleDot,
  Clock,
  Flame,
  GraduationCap,
  LogOut,
  Menu,
  RotateCcw,
  Sparkles,
  Trophy,
  Target,
  ListChecks,
  Award,
  Hourglass,
  Zap,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  ALL_UNITS,
  CURRICULUM,
  CURRICULUM_STATS,
  type Lesson,
  type Unit,
} from "@/lib/physics";
import type { UserProfile } from "@/lib/use-progress";
import { formatTime } from "@/lib/use-progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppHeader } from "./app-header";
import { AppFooter } from "./app-footer";
import {
  computeAchievementPoints,
  ACHIEVEMENTS,
} from "@/lib/physics/achievements";

type Props = {
  profile: UserProfile;
  onOpenLesson: (lessonId: string) => void;
  onReset: () => void;
  onLogout: () => void;
  onShowCertificate: () => void;
  onOpenFeatures: () => void;
  pendingUnitId?: string | null;
  onConsumedPendingUnit?: () => void;
};

export function Dashboard({
  profile,
  onOpenLesson,
  onReset,
  onLogout,
  onShowCertificate,
  onOpenFeatures,
  pendingUnitId,
  onConsumedPendingUnit,
}: Props) {
  const totalLessons = CURRICULUM_STATS.totalLessons;
  const completedCount = profile.completedLessons.length;
  const completionPct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // إحصائيات الكويز
  const totalCorrect = Object.values(profile.quizResults).reduce(
    (acc, r) => acc + r.correct,
    0
  );
  const totalQuizQ = Object.values(profile.quizResults).reduce(
    (acc, r) => acc + r.total,
    0
  );

  // عدد القوانين في الدروس المكتملة
  const completedLessonsData = ALL_UNITS.flatMap((u) => u.lessons).filter((l) =>
    profile.completedLessons.includes(l.id)
  );
  const lawsStudied = completedLessonsData.reduce(
    (acc, l) => acc + l.formulas.length,
    0
  );
  const examplesSolved = completedLessonsData.reduce(
    (acc, l) => acc + l.examples.length,
    0
  );

  // إمكانية الحصول على شهادة (>= 70% إكمال)
  const eligibleForCertificate = completionPct >= 70;
  const certificateIssued = !!profile.certificateIssuedAt;

  // إنجازات
  const unlockedAch = profile.unlockedAchievements.length;
  const totalAch = ACHIEVEMENTS.length;
  const totalPoints = computeAchievementPoints(profile.unlockedAchievements);

  // عدد المراجعات المستحقة
  const now = Date.now();
  const dueReviews = Object.values(profile.spacedRepetition).filter(
    (it) => it.nextReviewAt <= now
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors">
      {/* الترويسة الرئيسية */}
      <AppHeader
        studentName={profile.name}
        eligibleForCertificate={eligibleForCertificate}
        certificateIssued={certificateIssued}
        onOpenFeatures={onOpenFeatures}
        onShowCertificate={onShowCertificate}
        onReset={onReset}
        onLogout={onLogout}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 pb-16 space-y-6 md:space-y-8">
        {/* بطاقة التقدم العام */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-bl from-indigo-700 via-blue-700 to-purple-700 text-white">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Trophy className="w-5 h-5 text-amber-300" />
                    <span className="text-amber-200 text-sm font-semibold">
                      تقدمك في المنهج
                    </span>
                    <span className="text-amber-200 text-xs bg-white/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {profile.dailyStreak} يوم متتالي
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {completedCount} / {totalLessons} درسًا مكتملًا
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    استمرارك في التعلم هو سر التميز! 🌟
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-5xl md:text-6xl font-extrabold text-amber-300 tabular-nums">
                    {completionPct}
                    <span className="text-2xl md:text-3xl">%</span>
                  </div>
                  <p className="text-blue-100 text-xs mt-1">نسبة الإنجاز</p>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-sm rounded-full h-4 overflow-hidden border border-white/20">
                <motion.div
                  className="h-full bg-gradient-to-l from-amber-300 via-amber-400 to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>

              {/* إحصائيات مصغرة */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <StatPill
                  icon={<BookOpen className="w-4 h-4" />}
                  label="دروس مكتملة"
                  value={`${completedCount}`}
                />
                <StatPill
                  icon={<Target className="w-4 h-4" />}
                  label="أمثلة محلولة"
                  value={`${examplesSolved}`}
                />
                <StatPill
                  icon={<ListChecks className="w-4 h-4" />}
                  label="أسئلة كويز"
                  value={`${totalCorrect}/${totalQuizQ}`}
                />
                <StatPill
                  icon={<Trophy className="w-4 h-4" />}
                  label="نقاط الإنجازات"
                  value={`${totalPoints}`}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* بطاقات الميزات: وقت + شهادة + إنجازات + مراجعة */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* وقت الدراسة */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 shadow-sm h-full">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                    <Hourglass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      وقت الدراسة
                    </h3>
                  </div>
                </div>
                <div className="text-2xl font-extrabold bg-gradient-to-l from-indigo-600 to-purple-600 bg-clip-text text-transparent tabular-nums">
                  {formatTime(profile.totalTimeSeconds)}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {profile.completedLessons.length > 0
                      ? `متوسط ${formatTime(
                          Math.round(
                            profile.totalTimeSeconds / profile.completedLessons.length
                          )
                        )} لكل درس`
                      : "ابدأ أول درس"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* شهادة */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card
              className={`shadow-sm h-full ${
                eligibleForCertificate
                  ? "border-amber-300 dark:border-amber-700 bg-gradient-to-bl from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              }`}
            >
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      eligibleForCertificate
                        ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {certificateIssued
                        ? "شهادتك جاهزة!"
                        : eligibleForCertificate
                        ? "مؤهّل للشهادة!"
                        : "شهادة الإتمام"}
                    </h3>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  {eligibleForCertificate ? (
                    <Button
                      onClick={onShowCertificate}
                      size="sm"
                      className="w-full bg-gradient-to-l from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md"
                    >
                      <Award className="w-4 h-4 ml-1" />
                      {certificateIssued ? "عرض" : "إصدار"}
                    </Button>
                  ) : (
                    <div className="w-full">
                      <div className="text-xs text-slate-500 mb-1 text-center">
                        أكمل {Math.max(0, 70 - completionPct)}% إضافي
                      </div>
                      <Progress value={Math.min(completionPct, 70)} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* إنجازات */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-900 shadow-sm h-full">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      الإنجازات
                    </h3>
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {unlockedAch}/{totalAch}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {totalPoints} نقطة • {unlockedAch > 0 ? "أحسنت!" : "ابدأ لفتح أول إنجاز"}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* مراجعة ذكية */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <Card className={`shadow-sm h-full ${dueReviews > 0 ? "border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"}`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dueReviews > 0 ? "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      مراجعة مستحقة
                    </h3>
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 tabular-nums">
                  {dueReviews}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {dueReviews > 0 ? "راجع من قائمة الميزات" : "لا مراجعات الآن"}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* رسالة استئناف التقدم */}
        {profile.lastVisited &&
          !profile.completedLessons.includes(profile.lastVisited) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      آخر درس زرته ولم تكمله. هل تريد المتابعة؟
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onOpenLesson(profile.lastVisited!)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    متابعة
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

        {/* قائمة الوحدات */}
        <div className="space-y-6">
          {CURRICULUM.map((group, gi) => (
            <motion.div
              key={`${group.grade}-${group.semester}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * gi }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
                <h2 className="text-sm md:text-base font-bold text-slate-600 dark:text-slate-300 px-3 py-1 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 whitespace-nowrap">
                  {group.grade} • {group.semester}
                </h2>
                <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
              </div>

              {group.units.map((unit) => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  profile={profile}
                  onOpenLesson={onOpenLesson}
                  isPending={pendingUnitId === unit.id}
                  onConsumedPending={onConsumedPendingUnit}
                />
              ))}
            </motion.div>
          ))}
        </div>

      </main>

      {/* التذييل المختصر الثابت */}
      <AppFooter />
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/10">
      <div className="flex items-center gap-2 text-amber-200 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function UnitCard({
  unit,
  profile,
  onOpenLesson,
  isPending = false,
  onConsumedPending,
}: {
  unit: Unit;
  profile: UserProfile;
  onOpenLesson: (lessonId: string) => void;
  isPending?: boolean;
  onConsumedPending?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // عند وصول وحدة "معلّقة" (تم اختيارها من صفحة الترحيب)، افتحها ومرّر لها
  useEffect(() => {
    if (!isPending) return;
    // استخدم setTimeout لتفادي قاعدة setState في effect
    const t1 = setTimeout(() => setOpen(true), 100);
    const t2 = setTimeout(() => {
      cardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
    // أخبر الأب أننا استهلكنا الوحدة المعلّقة بعد 5 ثوانٍ
    const t3 = setTimeout(() => {
      onConsumedPending?.();
    }, 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isPending, onConsumedPending]);

  const lessonsCompleted = unit.lessons.filter((l) =>
    profile.completedLessons.includes(l.id)
  ).length;
  const totalLessons = unit.lessons.length;
  const unitPct =
    totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;
  const allDone = lessonsCompleted === totalLessons;

  return (
    <Card
      ref={cardRef}
      className={`overflow-hidden border transition-all scroll-mt-20 ${
        isPending
          ? "border-amber-400 dark:border-amber-600 ring-4 ring-amber-200 dark:ring-amber-900/50 shadow-xl scale-[1.01]"
          : allDone
          ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md"
      }`}
    >
      {/* شارة "اخترت هذه الوحدة" */}
      {isPending && (
        <div className="bg-gradient-to-l from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          اخترت هذه الوحدة من صفحة الترحيب — هيا نبدأ!
        </div>
      )}
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full text-right">
            <div className={`bg-gradient-to-l ${unit.color} p-4 md:p-5 text-white`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs md:text-sm bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {unit.grade} • {unit.semester}
                    </span>
                    {allDone && (
                      <Badge className="bg-emerald-500 text-white border-0 gap-1">
                        <CircleCheck className="w-3 h-3" />
                        مكتملة
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">{unit.title}</h3>
                  {unit.englishTitle && (
                    <p className="text-xs md:text-sm text-white/70 mt-0.5">
                      {unit.englishTitle}
                    </p>
                  )}
                </div>
                <ChevronDown
                  className={`w-5 h-5 mt-1 transition-transform shrink-0 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </button>
        </CollapsibleTrigger>

        <CardContent className="p-4 md:p-5 bg-white dark:bg-slate-900">
          {!open && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                {unit.intro}
              </p>
              <div className="flex items-center gap-3">
                <Progress value={unitPct} className="flex-1 h-2" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                  {lessonsCompleted}/{totalLessons}
                </span>
              </div>
            </div>
          )}

          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {unit.intro}
              </p>
              <div className="flex items-center gap-3">
                <Progress value={unitPct} className="flex-1 h-2" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                  {lessonsCompleted}/{totalLessons}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {unit.lessons.map((lesson, idx) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    index={idx}
                    isCompleted={profile.completedLessons.includes(lesson.id)}
                    quizResult={profile.quizResults[lesson.id]}
                    timeSpent={profile.lessonTimeSeconds[lesson.id] || 0}
                    hasNote={!!profile.notebook[lesson.id]}
                    onOpen={() => onOpenLesson(lesson.id)}
                  />
                ))}
              </div>
            </motion.div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
}

function LessonRow({
  lesson,
  index,
  isCompleted,
  quizResult,
  timeSpent,
  hasNote,
  onOpen,
}: {
  lesson: Lesson;
  index: number;
  isCompleted: boolean;
  quizResult?: { correct: number; total: number };
  timeSpent: number;
  hasNote: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className={`w-full text-right p-3 md:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
        isCompleted
          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isCompleted
              ? "bg-emerald-500 text-white"
              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-600 dark:group-hover:border-indigo-700 dark:group-hover:text-indigo-400"
          }`}
        >
          {isCompleted ? (
            <CircleCheck className="w-5 h-5" />
          ) : (
            <CircleDot className="w-5 h-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-100 truncate">
            <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">
              الدرس {index + 1}:
            </span>
            {lesson.title}
          </h4>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {lesson.formulas.length} قانون • {lesson.examples.length} أمثلة •{" "}
              {lesson.quiz.length} أسئلة
            </span>
            {timeSpent > 0 && (
              <Badge
                variant="outline"
                className="text-[10px] h-5 gap-0.5 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30"
              >
                <Clock className="w-2.5 h-2.5" />
                {formatTime(timeSpent)}
              </Badge>
            )}
            {hasNote && (
              <Badge
                variant="outline"
                className="text-[10px] h-5 gap-0.5 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/30"
              >
                📝
              </Badge>
            )}
            {quizResult && (
              <Badge
                variant="secondary"
                className={`text-[10px] h-5 gap-1 ${
                  quizResult.correct / quizResult.total >= 0.7
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                {quizResult.correct}/{quizResult.total}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:-translate-x-1 transition-transform shrink-0">
        <ChevronLeft className="w-5 h-5" />
      </div>
    </button>
  );
}
