"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  Dumbbell,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Timer,
  Trophy,
} from "lucide-react";
import { PRACTICE_QUESTIONS, type PracticeQuestion } from "@/lib/physics/practice-questions";
import { SmartMath } from "./smart-math";

type Difficulty = "all" | "easy" | "medium" | "hard";
type Mode = "config" | "playing" | "review";

export function PracticeMode({
  onAnswer,
}: {
  onAnswer: (
    questionId: string,
    isCorrect: boolean,
    difficulty: "easy" | "medium" | "hard"
  ) => void;
}) {
  const [mode, setMode] = useState<Mode>("config");
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [count, setCount] = useState(5);
  const [timer, setTimer] = useState(false);

  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});
  const [elapsed, setElapsed] = useState(0);

  // مرشّح الأسئلة
  const filteredQuestions = useMemo(() => {
    if (difficulty === "all") return PRACTICE_QUESTIONS;
    return PRACTICE_QUESTIONS.filter((q) => q.difficulty === difficulty);
  }, [difficulty]);

  function startPractice() {
    // اختر عشوائيًا
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    setQuestions(selected);
    setCurrentIdx(0);
    setAnswers({});
    setSubmitted({});
    setShowSolution({});
    setElapsed(0);
    setMode("playing");
  }

  // مؤقت
  useEffect(() => {
    if (mode !== "playing" || !timer) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [mode, timer]);

  function submitOne(qid: string) {
    setSubmitted((s) => ({ ...s, [qid]: true }));
    setShowSolution((s) => ({ ...s, [qid]: true }));
    const q = questions.find((x) => x.id === qid);
    if (q) {
      const userAns = (answers[qid] || "").trim();
      let isCorrect = false;
      if (q.type === "numeric") {
        const u = parseFloat(userAns);
        const c = parseFloat(q.answer);
        isCorrect = !isNaN(u) && !isNaN(c) ? Math.abs(u - c) < 0.5 : userAns === q.answer;
      } else {
        isCorrect = userAns === q.answer;
      }
      onAnswer(qid, isCorrect, q.difficulty);
    }
  }

  function submitAll() {
    const newSub: Record<string, boolean> = {};
    const newShow: Record<string, boolean> = {};
    questions.forEach((q) => {
      newSub[q.id] = true;
      newShow[q.id] = true;
    });
    setSubmitted(newSub);
    setShowSolution(newShow);
    questions.forEach((q) => {
      const userAns = (answers[q.id] || "").trim();
      let isCorrect = false;
      if (q.type === "numeric") {
        const u = parseFloat(userAns);
        const c = parseFloat(q.answer);
        isCorrect = !isNaN(u) && !isNaN(c) ? Math.abs(u - c) < 0.5 : userAns === q.answer;
      } else {
        isCorrect = userAns === q.answer;
      }
      onAnswer(q.id, isCorrect, q.difficulty);
    });
    setMode("review");
  }

  function reset() {
    setMode("config");
    setQuestions([]);
    setCurrentIdx(0);
    setAnswers({});
    setSubmitted({});
    setShowSolution({});
    setElapsed(0);
  }

  // ====== شاشة الإعداد ======
  if (mode === "config") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-violet-50 dark:bg-violet-950/30 rounded-lg">
          <Dumbbell className="w-6 h-6 text-violet-700 dark:text-violet-400" />
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">
              وضع التدريب المكثّف
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تدرّب على {PRACTICE_QUESTIONS.length}+ سؤال من المنهج كامل، بمستويات صعوبة مختلفة
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">مستوى الصعوبة</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: "all", label: "الكل", icon: "🎲", count: PRACTICE_QUESTIONS.length },
                  { id: "easy", label: "سهل", icon: "🟢", count: PRACTICE_QUESTIONS.filter(q=>q.difficulty==="easy").length },
                  { id: "medium", label: "متوسط", icon: "🟡", count: PRACTICE_QUESTIONS.filter(q=>q.difficulty==="medium").length },
                  { id: "hard", label: "صعب", icon: "🔴", count: PRACTICE_QUESTIONS.filter(q=>q.difficulty==="hard").length },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id as Difficulty)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      difficulty === d.id
                        ? "border-violet-400 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-violet-300"
                    }`}
                  >
                    <div className="text-xl mb-1">{d.icon}</div>
                    <div>{d.label}</div>
                    <div className="text-xs text-slate-500">{d.count} سؤال</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">عدد الأسئلة</Label>
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      count === n
                        ? "border-violet-400 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    }`}
                  >
                    {n} أسئلة
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={timer}
                  onChange={(e) => setTimer(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <Timer className="w-4 h-4 text-violet-600" />
                تفعيل المؤقت (تتبع السرعة)
              </Label>
            </div>

            <Button
              onClick={startPractice}
              className="w-full bg-gradient-to-l from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              size="lg"
            >
              <Dumbbell className="w-5 h-5 ml-2" />
              ابدأ التدريب
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ====== شاشة اللعب ======
  const current = questions[currentIdx];
  const answeredCount = Object.values(answers).filter((v) => v && v.trim()).length;
  const progress = ((currentIdx + 1) / questions.length) * 100;

  if (mode === "playing" && current) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300">
            سؤال {currentIdx + 1} / {questions.length}
          </Badge>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={
              current.difficulty === "easy" ? "border-emerald-300 text-emerald-700" :
              current.difficulty === "medium" ? "border-amber-300 text-amber-700" :
              "border-rose-300 text-rose-700"
            }>
              {current.difficulty === "easy" ? "🟢 سهل" : current.difficulty === "medium" ? "🟡 متوسط" : "🔴 صعب"}
            </Badge>
            {timer && (
              <Badge variant="outline" className="font-mono">
                <Timer className="w-3 h-3 ml-1" />
                {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}
              </Badge>
            )}
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <Card>
          <CardContent className="p-5">
            <p className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 leading-relaxed">
              <SmartMath text={current.question} />
            </p>

            {current.type === "numeric" && (
              <Input
                type="number"
                step="any"
                value={answers[current.id] || ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [current.id]: e.target.value }))}
                disabled={submitted[current.id]}
                placeholder="اكتب القيمة العددية..."
                className="max-w-xs bg-white dark:bg-slate-800"
              />
            )}

            {current.type === "mcq" && current.options && (
              <RadioGroup
                value={answers[current.id] || ""}
                onValueChange={(v) => setAnswers((a) => ({ ...a, [current.id]: v }))}
                disabled={submitted[current.id]}
                className="space-y-2"
              >
                {current.options.map((opt) => {
                  const selected = answers[current.id] === opt;
                  const showCorrect = submitted[current.id] && opt === current.answer;
                  const showWrong = submitted[current.id] && selected && opt !== current.answer;
                  return (
                    <Label
                      key={opt}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        showCorrect
                          ? "border-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40"
                          : showWrong
                          ? "border-rose-400 bg-rose-100/60 dark:bg-rose-950/40"
                          : selected
                          ? "border-violet-400 bg-violet-50 dark:bg-violet-950/30"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      } ${submitted[current.id] ? "cursor-default" : ""}`}
                    >
                      <RadioGroupItem value={opt} disabled={submitted[current.id]} />
                      <span className="text-sm text-slate-700 dark:text-slate-200">{opt}</span>
                      {showCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-auto" />}
                      {showWrong && <XCircle className="w-4 h-4 text-rose-600 mr-auto" />}
                    </Label>
                  );
                })}
              </RadioGroup>
            )}

            {current.type === "truefalse" && current.options && (
              <RadioGroup
                value={answers[current.id] || ""}
                onValueChange={(v) => setAnswers((a) => ({ ...a, [current.id]: v }))}
                disabled={submitted[current.id]}
                className="flex gap-2"
              >
                {current.options.map((opt) => {
                  const selected = answers[current.id] === opt;
                  const showCorrect = submitted[current.id] && opt === current.answer;
                  const showWrong = submitted[current.id] && selected && opt !== current.answer;
                  return (
                    <Label
                      key={opt}
                      className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        showCorrect
                          ? "border-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40"
                          : showWrong
                          ? "border-rose-400 bg-rose-100/60 dark:bg-rose-950/40"
                          : selected
                          ? "border-violet-400 bg-violet-50 dark:bg-violet-950/30"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      }`}
                    >
                      <RadioGroupItem value={opt} disabled={submitted[current.id]} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt}</span>
                    </Label>
                  );
                })}
              </RadioGroup>
            )}

            {showSolution[current.id] && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                  الإجابة النموذجية: {current.answer}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200">{current.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          {!submitted[current.id] && (
            <Button
              onClick={() => submitOne(current.id)}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <CheckCircle2 className="w-4 h-4 ml-1" />
              تحقّق
            </Button>
          )}
          {!showSolution[current.id] && (
            <Button
              variant="outline"
              onClick={() => setShowSolution((s) => ({ ...s, [current.id]: true }))}
            >
              <Eye className="w-4 h-4 ml-1" />
              إظهار الحل
            </Button>
          )}
          {showSolution[current.id] && (
            <Button
              variant="outline"
              onClick={() => setShowSolution((s) => ({ ...s, [current.id]: false }))}
            >
              <EyeOff className="w-4 h-4 ml-1" />
              إخفاء الحل
            </Button>
          )}
          <div className="flex-1" />
          {currentIdx > 0 && (
            <Button variant="outline" onClick={() => setCurrentIdx(currentIdx - 1)}>
              السابق
            </Button>
          )}
          {currentIdx < questions.length - 1 ? (
            <Button onClick={() => setCurrentIdx(currentIdx + 1)}>
              التالي
            </Button>
          ) : (
            <Button onClick={submitAll} className="bg-emerald-600 hover:bg-emerald-700">
              <Trophy className="w-4 h-4 ml-1" />
              إنهاء وعرض النتيجة
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ====== شاشة المراجعة ======
  const correctCount = questions.filter((q) => {
    const userAns = (answers[q.id] || "").trim();
    if (q.type === "numeric") {
      const u = parseFloat(userAns);
      const c = parseFloat(q.answer);
      return !isNaN(u) && !isNaN(c) ? Math.abs(u - c) < 0.5 : userAns === q.answer;
    }
    return userAns === q.answer;
  }).length;
  const pct = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-bl from-violet-600 to-purple-700 text-white">
        <CardContent className="p-6 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-amber-300" />
          <h3 className="text-2xl font-bold mb-2">انتهى التدريب!</h3>
          <div className="text-5xl font-extrabold mb-2">
            {correctCount}/{questions.length}
          </div>
          <div className="text-lg text-violet-100">
            نسبة {pct}% {pct >= 80 ? "🎉 ممتاز!" : pct >= 60 ? "👍 جيد" : "💪 تحتاج مزيدًا من التدريب"}
          </div>
          {timer && (
            <div className="mt-3 text-sm text-violet-100">
              الزمن: {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")} •
              متوسط {Math.round(elapsed / questions.length)} ث لكل سؤال
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h4 className="font-bold text-slate-800 dark:text-slate-100">مراجعة الأسئلة:</h4>
        {questions.map((q, i) => {
          const userAns = (answers[q.id] || "").trim();
          let isCorrect = false;
          if (q.type === "numeric") {
            const u = parseFloat(userAns);
            const c = parseFloat(q.answer);
            isCorrect = !isNaN(u) && !isNaN(c) ? Math.abs(u - c) < 0.5 : userAns === q.answer;
          } else {
            isCorrect = userAns === q.answer;
          }
          return (
            <div
              key={q.id}
              className={`border rounded-lg p-3 ${
                isCorrect
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10"
                  : "border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/10"
              }`}
            >
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-1">
                    {i + 1}. <SmartMath text={q.question} />
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    إجابتك: <span className={isCorrect ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}><SmartMath text={userAns || "—"} /></span>
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      الصواب: <span className="text-emerald-700 font-bold"><SmartMath text={q.answer} /></span>
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1"><SmartMath text={q.explanation} /></p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button onClick={reset} variant="outline" className="w-full">
        <RotateCcw className="w-4 h-4 ml-1" />
        تدريب جديد
      </Button>
    </div>
  );
}
