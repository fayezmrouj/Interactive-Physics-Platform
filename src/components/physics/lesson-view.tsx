"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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

type Props = {
  lessonId: string;
  isCompleted: boolean;
  onBack: () => void;
  onComplete: () => void;
  onNavigateLesson: (lessonId: string) => void;
  onQuizResult: (correct: number, total: number) => void;
};

export function LessonView({
  lessonId,
  isCompleted,
  onBack,
  onComplete,
  onNavigateLesson,
  onQuizResult,
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
    currentIdx < ALL_LESSON_IDS.length - 1 ? ALL_LESSON_IDS[currentIdx + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <LessonHeader
        lesson={lesson}
        unit={unit}
        isCompleted={isCompleted}
        onBack={onBack}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
        {/* الفكرة الرئيسة */}
        <SectionCard
          icon={<Lightbulb className="w-5 h-5" />}
          color="amber"
          title="الفكرة الرئيسة"
        >
          <p className="text-slate-700 leading-relaxed text-base md:text-lg">
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
                <span className="mt-1 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-slate-700 leading-relaxed">{obj}</span>
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
          <div className="prose prose-slate max-w-none space-y-4">
            {lesson.explanation.map((para, i) => (
              <p key={i} className="text-slate-700 leading-loose text-base">
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
                className="bg-purple-50/50 border border-purple-200 rounded-xl p-4 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <h4 className="font-bold text-purple-900 text-base">{c.term}</h4>
                  <div className="flex items-center gap-1 flex-wrap">
                    {c.symbol && (
                      <Badge className="bg-purple-600 text-white border-0">
                        <span className="math-formula">{c.symbol}</span>
                      </Badge>
                    )}
                    {c.unit && (
                      <Badge variant="outline" className="border-purple-300 text-purple-700">
                        <span className="math-formula">{c.unit}</span>
                      </Badge>
                    )}
                  </div>
                </div>
                {c.value && (
                  <div className="mb-2 px-2 py-1 bg-amber-100 border border-amber-300 rounded text-xs">
                    <span className="font-semibold text-amber-800">القيمة: </span>
                    <span className="math-formula text-amber-900">{c.value}</span>
                  </div>
                )}
                <p className="text-sm text-slate-700 leading-relaxed">{c.definition}</p>
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
                className="bg-gradient-to-l from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3 hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-cyan-900 mb-1">{f.name}</h4>
                  <p className="text-sm text-slate-600">{f.description}</p>
                </div>
                <div className="bg-white rounded-lg px-4 py-3 border-2 border-cyan-300 shadow-sm shrink-0 self-start md:self-center">
                  <span className="math-formula text-cyan-900 text-base md:text-lg font-bold">
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
          <Accordion type="single" collapsible defaultValue="example-0" className="w-full">
            {lesson.examples.map((ex, i) => (
              <AccordionItem
                key={i}
                value={`example-${i}`}
                className="border border-emerald-200 rounded-xl mb-3 overflow-hidden bg-emerald-50/30"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-emerald-50 no-underline">
                  <div className="flex items-center gap-2 text-right flex-1">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-800 text-sm md:text-base">
                      {ex.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-xs font-bold text-blue-700 mb-1">
                          المعطيات
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {ex.given}
                        </p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="text-xs font-bold text-purple-700 mb-1">
                          المطلوب
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {ex.required}
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="text-xs font-bold text-slate-700 mb-2">
                        الحل
                      </div>
                      <ol className="space-y-1.5">
                        {ex.steps.map((step, si) => (
                          <li
                            key={si}
                            className="text-sm text-slate-700 flex items-start gap-2"
                          >
                            <span className="text-slate-400 mt-0.5 shrink-0">
                              {si + 1}.
                            </span>
                            <span
                              className={
                                /math-formula/.test(step)
                                  ? "math-formula"
                                  : ""
                              }
                            >
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="bg-emerald-100 border-2 border-emerald-300 rounded-lg p-3 flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-emerald-700 mb-0.5">
                          الإجابة النهائية
                        </div>
                        <p className="text-sm text-emerald-900 font-medium leading-relaxed">
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

        {/* زر الإكمال + التنقل */}
        <CompletionCard
          isCompleted={isCompleted}
          onComplete={onComplete}
          prevLessonId={prevLessonId}
          nextLessonId={nextLessonId}
          onNavigateLesson={onNavigateLesson}
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
}: {
  lesson: Lesson;
  unit: Unit;
  isCompleted: boolean;
  onBack: () => void;
}) {
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

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", iconBg: "bg-amber-500" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", iconBg: "bg-indigo-500" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", iconBg: "bg-blue-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", iconBg: "bg-purple-500" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", iconBg: "bg-cyan-500" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", iconBg: "bg-emerald-500" },
  rose: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", iconBg: "bg-rose-500" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", iconBg: "bg-orange-500" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", iconBg: "bg-violet-500" },
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
      <Card className={`border ${c.border} shadow-sm overflow-hidden`}>
        <CardHeader className={`${c.bg} pb-3`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${c.iconBg} text-white flex items-center justify-center shrink-0 shadow-sm`}>
              {icon}
            </div>
            <div>
              <CardTitle className={`text-base md:text-lg ${c.text}`}>{title}</CardTitle>
              {subtitle && (
                <CardDescription className="text-slate-500 text-xs md:text-sm">
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
      <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4">
        <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
          <FlaskConical className="w-4 h-4" />
          {experiment.title}
        </h4>
        <div className="space-y-3 mt-3">
          <div>
            <div className="text-xs font-bold text-slate-600 mb-1">الأدوات والمواد:</div>
            <div className="flex flex-wrap gap-2">
              {experiment.tools.map((tool, i) => (
                <Badge key={i} variant="outline" className="bg-white border-rose-300 text-rose-700">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-600 mb-1">خطوات العمل:</div>
            <ol className="space-y-1.5">
              {experiment.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
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

      <div className="bg-gradient-to-l from-violet-50 to-rose-50 border-2 border-violet-300 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <CircleHelp className="w-5 h-5 text-violet-700" />
          <h4 className="font-bold text-violet-900">سؤال تفاعلي للتفكير</h4>
        </div>
        <p className="text-sm md:text-base text-slate-800 leading-relaxed mb-3">
          {experiment.question}
        </p>
        <Collapsible open={showAnswer} onOpenChange={setShowAnswer}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
            className="border-violet-300 text-violet-700 hover:bg-violet-100"
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
              className="mt-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-violet-200"
            >
              <div className="text-xs font-bold text-emerald-700 mb-1">الإجابة النموذجية:</div>
              <p className="text-sm text-slate-700 leading-relaxed">{experiment.expectedAnswer}</p>
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
    <div className="border border-orange-200 rounded-xl overflow-hidden">
      <div className="bg-rose-50 p-3 border-b border-rose-200">
        <div className="flex items-start gap-2">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-rose-700 mb-0.5">
              خطأ شائع #{index + 1}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{misconception.wrong}</p>
          </div>
        </div>
      </div>
      <div className="bg-emerald-50 p-3 border-b border-emerald-200">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-emerald-700 mb-0.5">الصواب</div>
            <p className="text-sm text-slate-700 leading-relaxed">{misconception.correct}</p>
          </div>
        </div>
      </div>
      <div className="bg-amber-50 p-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-700 mb-0.5">لماذا؟</div>
            <p className="text-sm text-slate-700 leading-relaxed">{misconception.explanation}</p>
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

  function submitOne(qid: string) {
    setShowSolutions((s) => ({ ...s, [qid]: true }));
    setSubmitted((s) => ({ ...s, [qid]: true }));
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
      // للأسئلة الرقمية، اسمح بفاصلة عشرية
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

  const answeredCount = Object.values(answers).filter((v) => v && v.trim()).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm text-slate-600">
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
            isCorrect = !isNaN(u) && !isNaN(c) ? Math.abs(u - c) < 0.5 : userAns === correctAns;
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
                  ? "border-emerald-300 bg-emerald-50/50"
                  : "border-rose-300 bg-rose-50/50"
                : "border-slate-200 bg-slate-50/50"
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <p className="text-sm md:text-base text-slate-800 leading-relaxed flex-1">
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
                  className="bg-white max-w-xs"
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
                            ? "border-emerald-400 bg-emerald-100/60"
                            : showWrong
                            ? "border-rose-400 bg-rose-100/60"
                            : selected
                            ? "border-violet-400 bg-violet-50"
                            : "border-slate-200 bg-white hover:border-violet-300"
                        } ${submitted[q.id] ? "cursor-default" : ""}`}
                      >
                        <RadioGroupItem
                          id={`${q.id}-${opt}`}
                          value={opt}
                          disabled={submitted[q.id]}
                        />
                        <span className="text-sm text-slate-700">{opt}</span>
                        {showCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-auto" />
                        )}
                        {showWrong && (
                          <XCircle className="w-4 h-4 text-rose-600 mr-auto" />
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
                            ? "border-emerald-400 bg-emerald-100/60"
                            : showWrong
                            ? "border-rose-400 bg-rose-100/60"
                            : selected
                            ? "border-violet-400 bg-violet-50"
                            : "border-slate-200 bg-white hover:border-violet-300"
                        }`}
                      >
                        <RadioGroupItem
                          id={`${q.id}-${opt}`}
                          value={opt}
                          disabled={submitted[q.id]}
                        />
                        <span className="text-sm font-medium text-slate-700">{opt}</span>
                        {showCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                        {showWrong && (
                          <XCircle className="w-4 h-4 text-rose-600" />
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
                className="text-slate-600 hover:text-violet-700"
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
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-violet-200">
                  <div className="text-xs font-bold text-violet-700 mb-1">
                    الإجابة النموذجية:{" "}
                    <span className="text-slate-900">{q.answer}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
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

function CompletionCard({
  isCompleted,
  onComplete,
  prevLessonId,
  nextLessonId,
  onNavigateLesson,
}: {
  isCompleted: boolean;
  onComplete: () => void;
  prevLessonId: string | null;
  nextLessonId: string | null;
  onNavigateLesson: (lessonId: string) => void;
}) {
  return (
    <Card className="border-2 border-indigo-200 bg-gradient-to-l from-indigo-50 to-purple-50">
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 mb-3">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            {isCompleted ? "أحسنت! لقد أكملت هذا الدرس" : "هل أنهيت هذا الدرس؟"}
          </h3>
          <p className="text-sm text-slate-600">
            {isCompleted
              ? "يمكنك المرور للدرس التالي أو إعادة مراجعة هذا الدرس."
              : "اضغط على زر الإكمال لتحديث شريط التقدم العام وإتمام الدرس."}
          </p>
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

        <Separator />

        <div className="flex flex-col sm:flex-row gap-2 justify-between">
          {prevLessonId ? (
            <Button
              variant="outline"
              onClick={() => onNavigateLesson(prevLessonId)}
              className="flex-1 border-slate-300"
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
              className="flex-1 bg-slate-800 hover:bg-slate-900"
            >
              <Undo2 className="w-4 h-4 ml-2 rotate-180" />
              الدرس التالي
            </Button>
          ) : (
            <div className="flex-1 text-center self-center text-sm text-slate-500">
              لقد أكملت آخر درس! 🎉
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
