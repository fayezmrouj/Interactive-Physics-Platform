"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  BookOpen,
  CircleCheck,
  CircleCheckBig,
  CircleHelp,
  Clock,
  Eye,
  EyeOff,
  FlaskConical,
  Lightbulb,
  ListChecks,
  Target,
  TriangleAlert,
  Trophy,
  Wand2,
  XCircle,
  CheckCircle2,
  Sigma,
  Undo2,
} from "lucide-react";
import type { Lesson, Unit } from "@/lib/physics";
import { ALL_LESSON_IDS, findLesson } from "@/lib/physics";
import { TimeTracker } from "./time-tracker";
import { formatTime } from "@/lib/use-progress";

type Props = {
  lessonId: string;
  isCompleted: boolean;
  onBack: () => void;
  onComplete: () => void;
  onNavigateLesson: (lessonId: string) => void;
  onQuizResult: (correct: number, total: number) => void;
  lessonTimeSpent: number;
  notes?: string;
  onSaveNote?: (text: string) => void;
};

export function LessonView({
  lessonId,
  isCompleted,
  onBack,
  onComplete,
  onNavigateLesson,
  onQuizResult,
  lessonTimeSpent,
  notes,
  onSaveNote,
}: Props) {
  const found = findLesson(lessonId);
  if (!found) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-slate-600">الدرس غير موجود.</p>
            <Button onClick={onBack} className="mt-4">
              العودة للوحة التحكم
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  const { lesson, unit } = found;
  const currentIdx = ALL_LESSON_IDS.indexOf(lessonId);
  const prevLessonId = currentIdx > 0 ? ALL_LESSON_IDS[currentIdx - 1] : null;
  const nextLessonId =
    currentIdx < ALL_LESSON_IDS.length - 1
      ? ALL_LESSON_IDS[currentIdx + 1]
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* مكوّن تتبع الوقت - يعمل في الخلفية */}
      <TimeTracker lessonId={lessonId} />

      <LessonHeader
        lesson={lesson}
        unit={unit}
        isCompleted={isCompleted}
        onBack={onBack}
        lessonTimeSpent={lessonTimeSpent}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
        {/* الفكرة الرئيسة */}
        <SectionCard
          icon={<Lightbulb className="w-5 h-5" />}
          color="amber"
          title="الفكرة الرئيسة"
        >
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-base md:text-lg">
            {lesson.mainIdea}
          </p>
        </SectionCard>

        {/* الأهداف */}
        <SectionCard
          icon={<Target className="w-5 h-5" />}
          color="indigo"
          title="أهداف الدرس"
          subtitle="ماذا ستتعلّم في هذا الدرس؟"
        >
          <ul className="space-y-2.5">
            {lesson.objectives.map((obj, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="mt-1 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-slate-700 dark:text-slate-200 leading-relaxed">
                  {obj}
                </span>
              </motion.li>
            ))}
          </ul>
        </SectionCard>

        {/* الشرح */}
        <SectionCard
          icon={<BookOpen className="w-5 h-5" />}
          color="blue"
          title="شرح الدرس"
          subtitle="التفسير المفصّل للمفاهيم الفيزيائية"
        >
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
            {lesson.explanation.map((para, i) => (
              <p key={i} className="text-slate-700 dark:text-slate-200 leading-loose text-base">
                {para}
              </p>
            ))}
          </div>
        </SectionCard>

        {/* المفاهيم والثوابت */}
        <SectionCard
          icon={<Sigma className="w-5 h-5" />}
          color="purple"
          title="المفاهيم والثوابت"
          subtitle="تعريف الكميات الفيزيائية والثوابت الأساسية"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            {lesson.concepts.map((c, i) => (
              <div
                key={i}
                className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-xl p-4 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <h4 className="font-bold text-purple-900 dark:text-purple-200 text-base">
                    {c.term}
                  </h4>
                  <div className="flex items-center gap-1 flex-wrap">
                    {c.symbol && (
                      <Badge className="bg-purple-600 text-white border-0">
                        <span className="math-formula">{c.symbol}</span>
                      </Badge>
                    )}
                    {c.unit && (
                      <Badge
                        variant="outline"
                        className="border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                      >
                        <span className="math-formula">{c.unit}</span>
                      </Badge>
                    )}
                  </div>
                </div>
                {c.value && (
                  <div className="mb-2 px-2 py-1 bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded text-xs">
                    <span className="font-semibold text-amber-800 dark:text-amber-300">
                      القيمة:{" "}
                    </span>
                    <span className="math-formula text-amber-900 dark:text-amber-200">
                      {c.value}
                    </span>
                  </div>
                )}
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {c.definition}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* القوانين */}
        <SectionCard
          icon={<Wand2 className="w-5 h-5" />}
          color="cyan"
          title="القوانين الرياضية"
          subtitle="الصيغ الرياضية الأساسية للدرس"
        >
          <div className="grid gap-3">
            {lesson.formulas.map((f, i) => (
              <div
                key={i}
                className="bg-gradient-to-l from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-200 dark:border-cyan-900 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3 hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-cyan-900 dark:text-cyan-200 mb-1">
                    {f.name}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {f.description}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg px-4 py-3 border-2 border-cyan-300 dark:border-cyan-700 shadow-sm shrink-0 self-start md:self-center">
                  <span className="math-formula text-cyan-900 dark:text-cyan-200 text-base md:text-lg font-bold">
                    {f.expression}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* أمثلة محلولة */}
        <SectionCard
          icon={<CircleCheck className="w-5 h-5" />}
          color="emerald"
          title="أمثلة محلولة خطوة بخطوة"
          subtitle="مع المعطيات والمطلوب وطريقة الحل"
        >
          <Accordion
            type="single"
            collapsible
            defaultValue="example-0"
            className="w-full"
          >
            {lesson.examples.map((ex, i) => (
              <AccordionItem
                key={i}
                value={`example-${i}`}
                className="border border-emerald-200 dark:border-emerald-900 rounded-xl mb-3 overflow-hidden bg-emerald-50/30 dark:bg-emerald-950/10"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 no-underline">
                  <div className="flex items-center gap-2 text-right flex-1">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm md:text-base">
                      {ex.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-3">
                        <div className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
                          المعطيات
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                          {ex.given}
                        </p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-lg p-3">
                        <div className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">
                          المطلوب
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                          {ex.required}
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                        الحل
                      </div>
                      <ol className="space-y-1.5">
                        {ex.steps.map((step, si) => (
                          <li
                            key={si}
                            className="text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2"
                          >
                            <span className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0">
                              {si + 1}.
                            </span>
                            <span className={/math-formula/.test(step) ? "math-formula" : ""}>
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="bg-emerald-100 dark:bg-emerald-950/30 border-2 border-emerald-300 dark:border-emerald-800 rounded-lg p-3 flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-0.5">
                          الإجابة النهائية
                        </div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
                          {ex.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SectionCard>

        {/* التجربة المخبرية التخيلية */}
        <SectionCard
          icon={<FlaskConical className="w-5 h-5" />}
          color="rose"
          title="التجربة المخبرية التخيلية"
          subtitle="محاكاة مبسطة لترسيخ المفهوم الفيزيائي"
        >
          <ExperimentSection experiment={lesson.experiment} />
        </SectionCard>

        {/* الأخطاء المفاهيمية */}
        <SectionCard
          icon={<TriangleAlert className="w-5 h-5" />}
          color="orange"
          title="أخطاء مفاهيمية شائعة"
          subtitle="تنبيهات لخلط شائع بين المفاهيم"
        >
          <div className="space-y-3">
            {lesson.misconceptions.map((m, i) => (
              <MisconceptionCard key={i} misconception={m} index={i} />
            ))}
          </div>
        </SectionCard>

        {/* الكويز */}
        <SectionCard
          icon={<ListChecks className="w-5 h-5" />}
          color="violet"
          title="أسئلة سريعة (كويز)"
          subtitle="اختبر فهمك بحساب قيمة فيزيائية أو اختيار الإجابة"
        >
          <QuizSection
            lesson={lesson}
            onResult={(correct, total) => onQuizResult(correct, total)}
          />
        </SectionCard>

        {/* مفكرة الطالب لهذا الدرس */}
        {onSaveNote && (
          <SectionCard
            icon={<BookOpen className="w-5 h-5" />}
            color="teal"
            title="ملاحظاتي على هذا الدرس"
            subtitle="اكتب ملاحظاتك الخاصة — تُحفظ تلقائيًا"
          >
            <LessonNotebook
              key={lessonId}
              initialText={notes || ""}
              onSave={onSaveNote}
            />
          </SectionCard>
        )}

        {/* زر الإكمال + التنقل */}
        <CompletionCard
          isCompleted={isCompleted}
          onComplete={onComplete}
          prevLessonId={prevLessonId}
          nextLessonId={nextLessonId}
          onNavigateLesson={onNavigateLesson}
          lessonTimeSpent={lessonTimeSpent}
        />
      </main>
    </div>
  );
}

// ============================================================
// مكونات مساعدة
// ============================================================

function LessonHeader({
  lesson,
  unit,
  isCompleted,
  onBack,
  lessonTimeSpent,
}: {
  lesson: Lesson;
  unit: Unit;
  isCompleted: boolean;
  onBack: () => void;
  lessonTimeSpent: number;
}) {
  // عرض حي للوقت: استخدم lessonTimeSpent مباشرة + علامة تحديث كل دقيقة لإعادة الرسم
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);
  const liveTime = lessonTimeSpent;

  return (
    <header className={`bg-gradient-to-l ${unit.color} text-white shadow-lg`}>
      <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-white/85 hover:text-white text-sm mb-3 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للوحة التحكم
        </button>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs md:text-sm bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                {unit.grade} • {unit.semester} • {unit.title}
              </span>
              {isCompleted && (
                <Badge className="bg-emerald-400 text-emerald-950 border-0 gap-1">
                  <CircleCheckBig className="w-3 h-3" />
                  مكتمل
                </Badge>
              )}
              {lessonTimeSpent > 0 && (
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(liveTime)}
                </Badge>
              )}
            </div>
            <h1 className="text-xl md:text-3xl font-bold">{lesson.title}</h1>
            {lesson.englishTitle && (
              <p className="text-xs md:text-sm text-white/70 mt-1">
                {lesson.englishTitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

const COLOR_MAP: Record<
  string,
  { bg: string; text: string; border: string; iconBg: string }
> = {
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-900",
    iconBg: "bg-amber-500",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-900",
    iconBg: "bg-indigo-500",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-900",
    iconBg: "bg-blue-500",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-900",
    iconBg: "bg-purple-500",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950/20",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-900",
    iconBg: "bg-cyan-500",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-900",
    iconBg: "bg-emerald-500",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/20",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-900",
    iconBg: "bg-rose-500",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/20",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-900",
    iconBg: "bg-orange-500",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/20",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-900",
    iconBg: "bg-violet-500",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950/20",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-900",
    iconBg: "bg-teal-500",
  },
};

function SectionCard({
  icon,
  color,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  color: keyof typeof COLOR_MAP;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const c = COLOR_MAP[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`border ${c.border} dark:${c.border} shadow-sm overflow-hidden bg-white dark:bg-slate-900`}>
        <CardHeader className={`${c.bg} pb-3`}>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg ${c.iconBg} text-white flex items-center justify-center shrink-0 shadow-sm`}
            >
              {icon}
            </div>
            <div>
              <CardTitle className={`text-base md:text-lg ${c.text}`}>
                {title}
              </CardTitle>
              {subtitle && (
                <CardDescription className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

function ExperimentSection({ experiment }: { experiment: Lesson["experiment"] }) {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className="space-y-4">
      <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl p-4">
        <h4 className="font-bold text-rose-900 dark:text-rose-200 mb-2 flex items-center gap-2">
          <FlaskConical className="w-4 h-4" />
          {experiment.title}
        </h4>
        <div className="space-y-3 mt-3">
          <div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              الأدوات والمواد:
            </div>
            <div className="flex flex-wrap gap-2">
              {experiment.tools.map((tool, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-white dark:bg-slate-800 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              خطوات العمل:
            </div>
            <ol className="space-y-1.5">
              {experiment.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-l from-violet-50 to-rose-50 dark:from-violet-950/30 dark:to-rose-950/30 border-2 border-violet-300 dark:border-violet-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <CircleHelp className="w-5 h-5 text-violet-700 dark:text-violet-300" />
          <h4 className="font-bold text-violet-900 dark:text-violet-200">
            سؤال تفاعلي للتفكير
          </h4>
        </div>
        <p className="text-sm md:text-base text-slate-800 dark:text-slate-100 leading-relaxed mb-3">
          {experiment.question}
        </p>
        <Collapsible open={showAnswer} onOpenChange={setShowAnswer}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
            className="border-violet-300 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-950/40"
          >
            {showAnswer ? (
              <>
                <EyeOff className="w-4 h-4 ml-1" />
                إخفاء الإجابة النموذجية
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 ml-1" />
                إظهار الإجابة النموذجية
              </>
            )}
          </Button>
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-violet-200 dark:border-violet-800"
            >
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                الإجابة النموذجية:
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {experiment.expectedAnswer}
              </p>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

function MisconceptionCard({
  misconception,
  index,
}: {
  misconception: Lesson["misconceptions"][0];
  index: number;
}) {
  return (
    <div className="border border-orange-200 dark:border-orange-900 rounded-xl overflow-hidden">
      <div className="bg-rose-50 dark:bg-rose-950/30 p-3 border-b border-rose-200 dark:border-rose-900">
        <div className="flex items-start gap-2">
          <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-rose-700 dark:text-rose-300 mb-0.5">
              خطأ شائع #{index + 1}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {misconception.wrong}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 border-b border-emerald-200 dark:border-emerald-900">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-0.5">
              الصواب
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {misconception.correct}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-amber-50 dark:bg-amber-950/30 p-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-0.5">
              لماذا؟
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {misconception.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizSection({
  lesson,
  onResult,
}: {
  lesson: Lesson;
  onResult: (correct: number, total: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  function setAnswer(qid: string, val: string) {
    setAnswers((a) => ({ ...a, [qid]: val }));
  }

  function toggleSolution(qid: string) {
    setShowSolutions((s) => ({ ...s, [qid]: !s[qid] }));
  }

  function submitAll() {
    const newSub: Record<string, boolean> = {};
    const newShow: Record<string, boolean> = {};
    lesson.quiz.forEach((q) => {
      newSub[q.id] = true;
      newShow[q.id] = true;
    });
    setSubmitted(newSub);
    setShowSolutions(newShow);

    const correct = lesson.quiz.filter((q) => {
      const userAns = (answers[q.id] || "").trim();
      const correctAns = q.answer.trim();
      if (q.type === "numeric") {
        const userNum = parseFloat(userAns);
        const correctNum = parseFloat(correctAns);
        if (!isNaN(userNum) && !isNaN(correctNum)) {
          return Math.abs(userNum - correctNum) < 0.5;
        }
        return userAns === correctAns;
      }
      return userAns === correctAns;
    }).length;
    onResult(correct, lesson.quiz.length);
  }

  const answeredCount = Object.values(answers).filter(
    (v) => v && v.trim()
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          أجب عن جميع الأسئلة ثم اضغط على زر التصحيح لمعرفة نتيجتك.
        </p>
        <Button
          onClick={submitAll}
          className="bg-violet-600 hover:bg-violet-700"
          size="sm"
        >
          <CheckCircle2 className="w-4 h-4 ml-1" />
          صحّح الكل
        </Button>
      </div>

      <Progress
        value={(answeredCount / lesson.quiz.length) * 100}
        className="h-2"
      />

      {lesson.quiz.map((q, idx) => {
        const userAns = (answers[q.id] || "").trim();
        const correctAns = q.answer.trim();
        let isCorrect = false;
        if (submitted[q.id] && userAns) {
          if (q.type === "numeric") {
            const u = parseFloat(userAns);
            const c = parseFloat(correctAns);
            isCorrect = !isNaN(u) && !isNaN(c)
              ? Math.abs(u - c) < 0.5
              : userAns === correctAns;
          } else {
            isCorrect = userAns === correctAns;
          }
        }

        return (
          <div
            key={q.id}
            className={`border rounded-xl p-4 transition-colors ${
              submitted[q.id] && userAns
                ? isCorrect
                  ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20"
                  : "border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20"
                : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <p className="text-sm md:text-base text-slate-800 dark:text-slate-100 leading-relaxed flex-1">
                {q.question}
              </p>
            </div>

            {q.type === "numeric" && (
              <div className="pr-10">
                <Input
                  type="number"
                  step="any"
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  placeholder="اكتب القيمة العددية..."
                  disabled={submitted[q.id]}
                  className="bg-white dark:bg-slate-800 max-w-xs"
                />
              </div>
            )}

            {q.type === "mcq" && q.options && (
              <div className="pr-10">
                <RadioGroup
                  value={answers[q.id] || ""}
                  onValueChange={(v) => setAnswer(q.id, v)}
                  disabled={submitted[q.id]}
                  className="space-y-2"
                >
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt;
                    const showCorrect = submitted[q.id] && opt === q.answer;
                    const showWrong = submitted[q.id] && selected && opt !== q.answer;
                    return (
                      <Label
                        key={opt}
                        htmlFor={`${q.id}-${opt}`}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          showCorrect
                            ? "border-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40"
                            : showWrong
                            ? "border-rose-400 bg-rose-100/60 dark:bg-rose-950/40"
                            : selected
                            ? "border-violet-400 bg-violet-50 dark:bg-violet-950/30"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-700"
                        } ${submitted[q.id] ? "cursor-default" : ""}`}
                      >
                        <RadioGroupItem
                          id={`${q.id}-${opt}`}
                          value={opt}
                          disabled={submitted[q.id]}
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-200">
                          {opt}
                        </span>
                        {showCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-auto" />
                        )}
                        {showWrong && (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mr-auto" />
                        )}
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            {q.type === "truefalse" && q.options && (
              <div className="pr-10">
                <RadioGroup
                  value={answers[q.id] || ""}
                  onValueChange={(v) => setAnswer(q.id, v)}
                  disabled={submitted[q.id]}
                  className="flex gap-2"
                >
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt;
                    const showCorrect = submitted[q.id] && opt === q.answer;
                    const showWrong = submitted[q.id] && selected && opt !== q.answer;
                    return (
                      <Label
                        key={opt}
                        htmlFor={`${q.id}-${opt}`}
                        className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          showCorrect
                            ? "border-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40"
                            : showWrong
                            ? "border-rose-400 bg-rose-100/60 dark:bg-rose-950/40"
                            : selected
                            ? "border-violet-400 bg-violet-50 dark:bg-violet-950/30"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-700"
                        }`}
                      >
                        <RadioGroupItem
                          id={`${q.id}-${opt}`}
                          value={opt}
                          disabled={submitted[q.id]}
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {opt}
                        </span>
                        {showCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                        {showWrong && (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        )}
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            <div className="pr-10 mt-3 flex flex-wrap gap-2 items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSolution(q.id)}
                className="text-slate-600 dark:text-slate-300 hover:text-violet-700 dark:hover:text-violet-300"
              >
                {showSolutions[q.id] ? (
                  <>
                    <EyeOff className="w-4 h-4 ml-1" />
                    إخفاء الحل النموذجي
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 ml-1" />
                    إظهار الحل النموذجي
                  </>
                )}
              </Button>
              {submitted[q.id] && (
                <Badge
                  className={
                    isCorrect
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                  }
                >
                  {isCorrect ? "إجابة صحيحة" : "إجابة خاطئة"}
                </Badge>
              )}
            </div>

            {showSolutions[q.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="pr-10 mt-2"
              >
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-violet-200 dark:border-violet-800">
                  <div className="text-xs font-bold text-violet-700 dark:text-violet-300 mb-1">
                    الإجابة النموذجية:{" "}
                    <span className="text-slate-900 dark:text-slate-100">
                      {q.answer}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {q.workedSolution}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LessonNotebook({
  initialText,
  onSave,
}: {
  initialText: string;
  onSave: (text: string) => void;
}) {
  const [text, setText] = useState(initialText);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleChange(v: string) {
    setText(v);
    setDirty(true);
    setSaved(false);
  }

  function handleSave() {
    onSave(text);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="اكتب ملاحظاتك على هذا الدرس هنا... (مثل: نقاط مهمة، أسئلة، استنتاجات)"
        className="min-h-32 bg-white dark:bg-slate-800 resize-y"
      />
      <div className="flex items-center justify-between text-xs">
        <div className="text-slate-500">
          {text.length} حرف
          {dirty && <span className="text-amber-600 ml-2">• غير محفوظ</span>}
          {saved && <span className="text-emerald-600 ml-2">✓ تم الحفظ</span>}
        </div>
        <Button
          onClick={handleSave}
          size="sm"
          disabled={!dirty}
          className="bg-teal-600 hover:bg-teal-700"
        >
          حفظ
        </Button>
      </div>
    </div>
  );
}

function CompletionCard({
  isCompleted,
  onComplete,
  prevLessonId,
  nextLessonId,
  onNavigateLesson,
  lessonTimeSpent,
}: {
  isCompleted: boolean;
  onComplete: () => void;
  prevLessonId: string | null;
  nextLessonId: string | null;
  onNavigateLesson: (lessonId: string) => void;
  lessonTimeSpent: number;
}) {
  return (
    <Card className="border-2 border-indigo-200 dark:border-indigo-900 bg-gradient-to-l from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 mb-3">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
            {isCompleted ? "أحسنت! لقد أكملت هذا الدرس" : "هل أنهيت هذا الدرس؟"}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isCompleted
              ? "يمكنك المرور للدرس التالي أو إعادة مراجعة هذا الدرس."
              : "اضغط على زر الإكمال لتحديث شريط التقدم العام وإتمام الدرس."}
          </p>
          {lessonTimeSpent > 0 && (
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-indigo-200 dark:border-indigo-800 text-xs">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-slate-700 dark:text-slate-200">
                وقتك في هذا الدرس:{" "}
                <span className="font-bold text-indigo-700 dark:text-indigo-300">
                  {formatTime(lessonTimeSpent)}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={onComplete}
            disabled={isCompleted}
            className={`h-12 px-6 text-base font-bold ${
              isCompleted
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            }`}
          >
            {isCompleted ? (
              <>
                <CircleCheckBig className="w-5 h-5 ml-2" />
                تم إكمال الدرس
              </>
            ) : (
              <>
                <CircleCheck className="w-5 h-5 ml-2" />
                إكمال الدرس
              </>
            )}
          </Button>
        </div>

        <Separator className="bg-slate-200 dark:bg-slate-700" />

        <div className="flex flex-col sm:flex-row gap-2 justify-between">
          {prevLessonId ? (
            <Button
              variant="outline"
              onClick={() => onNavigateLesson(prevLessonId)}
              className="flex-1 border-slate-300 dark:border-slate-700"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              الدرس السابق
            </Button>
          ) : (
            <div className="flex-1" />
          )}
          {nextLessonId ? (
            <Button
              onClick={() => onNavigateLesson(nextLessonId)}
              className="flex-1 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600"
            >
              <Undo2 className="w-4 h-4 ml-2 rotate-180" />
              الدرس التالي
            </Button>
          ) : (
            <div className="flex-1 text-center self-center text-sm text-slate-500 dark:text-slate-400">
              لقد أكملت آخر درس! 🎉
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
