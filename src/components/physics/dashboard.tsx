"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  RotateCcw,
  Sparkles,
  Trophy,
  Target,
  ListChecks,
} from "lucide-react";
import { useState } from "react";
import {
  ALL_UNITS,
  CURRICULUM,
  CURRICULUM_STATS,
  type Lesson,
  type Unit,
} from "@/lib/physics";
import type { ProgressState } from "@/lib/use-progress";

type Props = {
  progress: ProgressState;
  onOpenLesson: (lessonId: string) => void;
  onReset: () => void;
  onLogout: () => void;
};

export function Dashboard({ progress, onOpenLesson, onReset, onLogout }: Props) {
  const totalLessons = CURRICULUM_STATS.totalLessons;
  const completedCount = progress.completedLessons.length;
  const completionPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // إحصائيات الكويز
  const quizCount = Object.keys(progress.quizResults).length;
  const totalCorrect = Object.values(progress.quizResults).reduce(
    (acc, r) => acc + r.correct,
    0
  );
  const totalQuizQ = Object.values(progress.quizResults).reduce(
    (acc, r) => acc + r.total,
    0
  );
  const quizPct = totalQuizQ > 0 ? Math.round((totalCorrect / totalQuizQ) * 100) : 0;

  // عدد القوانين في الدروس المكتملة
  const completedLessonsData = ALL_UNITS.flatMap((u) => u.lessons).filter((l) =>
    progress.completedLessons.includes(l.id)
  );
  const lawsStudied = completedLessonsData.reduce((acc, l) => acc + l.formulas.length, 0);
  const examplesSolved = completedLessonsData.reduce(
    (acc, l) => acc + l.examples.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* الترويسة */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-md shrink-0">
              <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-bold text-slate-800 truncate">
                منصة الفيزياء التفاعلية
              </h1>
              <p className="text-xs md:text-sm text-slate-500 truncate">
                أهلًا بك يا{" "}
                <span className="font-semibold text-indigo-700">{progress.studentName}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-slate-600 hover:text-rose-600 hidden sm:inline-flex"
            >
              <RotateCcw className="w-4 h-4 ml-1" />
              تصفير التقدم
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-slate-600 hover:text-slate-900"
            >
              <LogOut className="w-4 h-4 ml-1" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
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
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-amber-300" />
                    <span className="text-amber-200 text-sm font-semibold">تقدمك في المنهج</span>
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
                  icon={<Flame className="w-4 h-4" />}
                  label="قوانين درستها"
                  value={`${lawsStudied}`}
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
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* رسالة استئناف التقدم */}
        {progress.lastVisited && !progress.completedLessons.includes(progress.lastVisited) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <p className="text-sm text-amber-800">
                    آخر درس زرته ولم تكمله. هل تريد المتابعة؟
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onOpenLesson(progress.lastVisited!)}
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
                <div className="h-px flex-1 bg-slate-300" />
                <h2 className="text-sm md:text-base font-bold text-slate-600 px-3 py-1 bg-white rounded-full border border-slate-200 whitespace-nowrap">
                  {group.grade} • {group.semester}
                </h2>
                <div className="h-px flex-1 bg-slate-300" />
              </div>

              {group.units.map((unit) => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  progress={progress}
                  onOpenLesson={onOpenLesson}
                />
              ))}
            </motion.div>
          ))}
        </div>

        <footer className="text-center py-6 text-xs text-slate-400">
          منصة الفيزياء التفاعلية • مبنية على كتب الفيزياء الرسمية للصفين التاسع والعاشر
        </footer>
      </main>
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
  progress,
  onOpenLesson,
}: {
  unit: Unit;
  progress: ProgressState;
  onOpenLesson: (lessonId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const lessonsCompleted = unit.lessons.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const totalLessons = unit.lessons.length;
  const unitPct =
    totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;
  const allDone = lessonsCompleted === totalLessons;

  return (
    <Card
      className={`overflow-hidden border transition-all ${
        allDone
          ? "border-emerald-300 bg-emerald-50/50 shadow-md"
          : "border-slate-200 bg-white shadow-sm hover:shadow-md"
      }`}
    >
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

        <CardContent className="p-4 md:p-5">
          {!open && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                {unit.intro}
              </p>
              <div className="flex items-center gap-3">
                <Progress value={unitPct} className="flex-1 h-2" />
                <span className="text-xs font-semibold text-slate-600 tabular-nums">
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
              <p className="text-sm text-slate-600 leading-relaxed">{unit.intro}</p>
              <div className="flex items-center gap-3">
                <Progress value={unitPct} className="flex-1 h-2" />
                <span className="text-xs font-semibold text-slate-600 tabular-nums">
                  {lessonsCompleted}/{totalLessons}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {unit.lessons.map((lesson, idx) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    index={idx}
                    isCompleted={progress.completedLessons.includes(lesson.id)}
                    quizResult={progress.quizResults[lesson.id]}
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
  onOpen,
}: {
  lesson: Lesson;
  index: number;
  isCompleted: boolean;
  quizResult?: { correct: number; total: number };
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className={`w-full text-right p-3 md:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
        isCompleted
          ? "bg-emerald-50/50 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50"
          : "bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isCompleted
              ? "bg-emerald-500 text-white"
              : "bg-white border border-slate-200 text-slate-500 group-hover:border-indigo-300 group-hover:text-indigo-600"
          }`}
        >
          {isCompleted ? (
            <CircleCheck className="w-5 h-5" />
          ) : (
            <CircleDot className="w-5 h-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm md:text-base font-semibold text-slate-800 truncate">
            <span className="text-slate-400 font-normal ml-1">الدرس {index + 1}:</span>
            {lesson.title}
          </h4>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-slate-500">
              {lesson.formulas.length} قانون • {lesson.examples.length} أمثلة •{" "}
              {lesson.quiz.length} أسئلة
            </span>
            {quizResult && (
              <Badge
                variant="secondary"
                className={`text-[10px] h-5 gap-1 ${
                  quizResult.correct / quizResult.total >= 0.7
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                {quizResult.correct}/{quizResult.total}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="text-slate-400 group-hover:text-indigo-600 group-hover:-translate-x-1 transition-transform shrink-0">
        <ChevronLeft className="w-5 h-5" />
      </div>
    </button>
  );
}
