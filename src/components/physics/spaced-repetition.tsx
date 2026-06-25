"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Inbox,
} from "lucide-react";
import { PRACTICE_QUESTIONS } from "@/lib/physics/practice-questions"
import { SmartMath } from "./smart-math";
import type { SpacedRepetitionItem } from "@/lib/use-progress";
import { useState } from "react";

type Props = {
  items: Record<string, SpacedRepetitionItem>;
  onAnswer: (
    questionId: string,
    isCorrect: boolean,
    difficulty: "easy" | "medium" | "hard"
  ) => void;
};

export function SpacedRepetition({ items, onAnswer }: Props) {
  // العناصر التي حان وقت مراجعتها
  const now = Date.now();
  const dueItems = Object.values(items)
    .filter((it) => it.nextReviewAt <= now)
    .map((it) => ({
      item: it,
      question: PRACTICE_QUESTIONS.find((q) => q.id === it.questionId),
    }))
    .filter((x) => x.question)
    .sort((a, b) => a.item.nextReviewAt - b.item.nextReviewAt);

  const totalItems = Object.keys(items).length;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const current = dueItems[currentIdx];

  function handleSubmit(qid: string, difficulty: "easy" | "medium" | "hard") {
    setSubmitted((s) => ({ ...s, [qid]: true }));
    const q = PRACTICE_QUESTIONS.find((x) => x.id === qid);
    if (!q) return;
    const userAns = (answers[qid] || "").trim();
    let isCorrect = false;
    if (q.type === "numeric") {
      const u = parseFloat(userAns);
      const c = parseFloat(q.answer);
      isCorrect = !isNaN(u) && !isNaN(c) ? Math.abs(u - c) < 0.5 : userAns === q.answer;
    } else {
      isCorrect = userAns === q.answer;
    }
    onAnswer(qid, isCorrect, difficulty);
  }

  function next() {
    setCurrentIdx((i) => i + 1);
  }

  function reset() {
    setCurrentIdx(0);
    setAnswers({});
    setSubmitted({});
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg">
        <Brain className="w-6 h-6 text-cyan-700 dark:text-cyan-400" />
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            المراجعة الذكية (Spaced Repetition)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            خوارزمية تذكير فاصل تعيد لك الأسئلة التي أخطأت فيها على فترات متزايدة
          </p>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-slate-50 dark:bg-slate-800/50">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">{totalItems}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">إجمالي الأسئلة المراجَعة</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{dueItems.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">للمراجعة الآن</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 dark:bg-emerald-950/30">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {Object.values(items).filter((i) => i.box === 5).length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">محفوظة (Box 5)</div>
          </CardContent>
        </Card>
      </div>

      {/* شرح الصناديق */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-600 dark:text-slate-300 space-y-1">
        <div className="font-bold mb-1">نظام الصناديق:</div>
        <div>📦 Box 1: جديد — راجع اليوم</div>
        <div>📦 Box 2: راجع بعد يوم</div>
        <div>📦 Box 3: راجع بعد 3 أيام</div>
        <div>📦 Box 4: راجع بعد أسبوع</div>
        <div>📦 Box 5: راجع بعد شهر (محفوظ)</div>
        <div className="mt-2">✅ إجابة صحيحة = ترقية للصندوق التالي</div>
        <div>❌ إجابة خاطئة = عودة للصندوق 1</div>
      </div>

      {dueItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Inbox className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <h4 className="font-bold text-slate-700 dark:text-slate-200">لا توجد أسئلة للمراجعة الآن</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {totalItems === 0
                ? "ابدأ التدريب المكثّف — الأسئلة الخاطئة ستظهر هنا تلقائيًا"
                : "أحسنت! راجعت كل ما هو مستحق. عُد لاحقًا."}
            </p>
          </CardContent>
        </Card>
      ) : current ? (
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                مراجعة {currentIdx + 1} / {dueItems.length}
              </Badge>
              <Badge variant="outline">
                Box {current.item.box} • مرات الخطأ: {current.item.wrongCount}
              </Badge>
            </div>

            <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
              <SmartMath text={current.question!.question} />
            </p>

            {current.question!.type === "numeric" && (
              <Input
                type="number"
                step="any"
                value={answers[current.question!.id] || ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [current.question!.id]: e.target.value }))}
                disabled={submitted[current.question!.id]}
                placeholder="اكتب القيمة العددية..."
                className="max-w-xs bg-white dark:bg-slate-800"
              />
            )}

            {current.question!.type === "mcq" && current.question!.options && (
              <RadioGroup
                value={answers[current.question!.id] || ""}
                onValueChange={(v) => setAnswers((a) => ({ ...a, [current.question!.id]: v }))}
                disabled={submitted[current.question!.id]}
                className="space-y-2"
              >
                {current.question!.options.map((opt) => {
                  const selected = answers[current.question!.id] === opt;
                  const showCorrect = submitted[current.question!.id] && opt === current.question!.answer;
                  const showWrong = submitted[current.question!.id] && selected && opt !== current.question!.answer;
                  return (
                    <Label
                      key={opt}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        showCorrect
                          ? "border-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40"
                          : showWrong
                          ? "border-rose-400 bg-rose-100/60 dark:bg-rose-950/40"
                          : selected
                          ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-950/30"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      }`}
                    >
                      <RadioGroupItem value={opt} disabled={submitted[current.question!.id]} />
                      <span className="text-sm text-slate-700 dark:text-slate-200">{opt}</span>
                      {showCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-auto" />}
                      {showWrong && <XCircle className="w-4 h-4 text-rose-600 mr-auto" />}
                    </Label>
                  );
                })}
              </RadioGroup>
            )}

            {current.question!.type === "truefalse" && current.question!.options && (
              <RadioGroup
                value={answers[current.question!.id] || ""}
                onValueChange={(v) => setAnswers((a) => ({ ...a, [current.question!.id]: v }))}
                disabled={submitted[current.question!.id]}
                className="flex gap-2"
              >
                {current.question!.options.map((opt) => {
                  const selected = answers[current.question!.id] === opt;
                  const showCorrect = submitted[current.question!.id] && opt === current.question!.answer;
                  const showWrong = submitted[current.question!.id] && selected && opt !== current.question!.answer;
                  return (
                    <Label
                      key={opt}
                      className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        showCorrect
                          ? "border-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40"
                          : showWrong
                          ? "border-rose-400 bg-rose-100/60 dark:bg-rose-950/40"
                          : selected
                          ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-950/30"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      }`}
                    >
                      <RadioGroupItem value={opt} disabled={submitted[current.question!.id]} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt}</span>
                    </Label>
                  );
                })}
              </RadioGroup>
            )}

            {submitted[current.question!.id] && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                  الإجابة النموذجية: <SmartMath text={current.question!.answer} />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200"><SmartMath text={current.question!.explanation} /></p>
              </div>
            )}

            {!submitted[current.question!.id] ? (
              <Button
                onClick={() => handleSubmit(current.question!.id, current.question!.difficulty)}
                disabled={!answers[current.question!.id]}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                <CheckCircle2 className="w-4 h-4 ml-1" />
                تحقّق
              </Button>
            ) : (
              <Button onClick={next} variant="outline" className="w-full">
                التالي
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
            <h4 className="font-bold text-slate-700 dark:text-slate-200">أنهيت كل المراجعات!</h4>
            <Button onClick={reset} variant="outline" className="mt-3">
              <RotateCcw className="w-4 h-4 ml-1" />
              إعادة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
