"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Trophy,
  Flame,
  Sparkles,
} from "lucide-react";
import {
  getDailyChallenge,
  getTodayKey,
} from "@/lib/physics/practice-questions";

type Props = {
  completedDates: string[];
  streak: number;
  onComplete: (correct: boolean) => void;
};

export function DailyChallenge({ completedDates, streak, onComplete }: Props) {
  const todayKey = getTodayKey();
  const alreadyCompleted = completedDates.includes(todayKey);
  const question = getDailyChallenge();
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  function handleSubmit() {
    setSubmitted(true);
    setShowSolution(true);
    let isCorrect = false;
    if (question.type === "numeric") {
      const u = parseFloat(answer);
      const c = parseFloat(question.answer);
      isCorrect = !isNaN(u) && !isNaN(c) ? Math.abs(u - c) < 0.5 : answer === question.answer;
    } else {
      isCorrect = answer === question.answer;
    }
    onComplete(isCorrect);
  }

  // حساب السلسلة الأسبوعية
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return getTodayKey(d);
  }).reverse();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
        <Calendar className="w-6 h-6 text-amber-700 dark:text-amber-400" />
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            تحدي اليوم
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            سؤال جديد كل يوم — حافظ على سلسلتك!
          </p>
        </div>
        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <Flame className="w-5 h-5" />
          <span className="font-bold text-lg">{streak}</span>
        </div>
      </div>

      {/* سلسلة آخر 7 أيام */}
      <div className="grid grid-cols-7 gap-1">
        {last7Days.map((day) => {
          const done = completedDates.includes(day);
          const d = new Date(day);
          const dayName = ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"][d.getDay()];
          return (
            <div
              key={day}
              className={`p-2 rounded-lg text-center text-xs ${
                done
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}
            >
              <div>{dayName}</div>
              <div className="font-bold mt-1">{done ? "✓" : "—"}</div>
            </div>
          );
        })}
      </div>

      {alreadyCompleted ? (
        <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              أكملت تحدي اليوم! 🎉
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              عُد غدًا لتحدٍّ جديد
            </p>
            <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-lg text-right">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-2">
                {question.question}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                الإجابة: <span className="font-bold text-emerald-700 dark:text-emerald-400">{question.answer}</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{question.explanation}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                <Sparkles className="w-3 h-3 ml-1" />
                تحدي {todayKey}
              </Badge>
              <Badge variant="outline" className={
                question.difficulty === "easy" ? "border-emerald-300 text-emerald-700" :
                question.difficulty === "medium" ? "border-amber-300 text-amber-700" :
                "border-rose-300 text-rose-700"
              }>
                {question.difficulty === "easy" ? "🟢 سهل" : question.difficulty === "medium" ? "🟡 متوسط" : "🔴 صعب"}
              </Badge>
            </div>

            <p className="text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
              {question.question}
            </p>

            {question.type === "numeric" && (
              <Input
                type="number"
                step="any"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={submitted}
                placeholder="اكتب القيمة العددية..."
                className="max-w-xs bg-white dark:bg-slate-800"
              />
            )}

            {question.type === "mcq" && question.options && (
              <RadioGroup
                value={answer}
                onValueChange={setAnswer}
                disabled={submitted}
                className="space-y-2"
              >
                {question.options.map((opt) => {
                  const selected = answer === opt;
                  const showCorrect = submitted && opt === question.answer;
                  const showWrong = submitted && selected && opt !== question.answer;
                  return (
                    <Label
                      key={opt}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        showCorrect
                          ? "border-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40"
                          : showWrong
                          ? "border-rose-400 bg-rose-100/60 dark:bg-rose-950/40"
                          : selected
                          ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      } ${submitted ? "cursor-default" : ""}`}
                    >
                      <RadioGroupItem value={opt} disabled={submitted} />
                      <span className="text-sm text-slate-700 dark:text-slate-200">{opt}</span>
                      {showCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-auto" />}
                      {showWrong && <XCircle className="w-4 h-4 text-rose-600 mr-auto" />}
                    </Label>
                  );
                })}
              </RadioGroup>
            )}

            {question.type === "truefalse" && question.options && (
              <RadioGroup
                value={answer}
                onValueChange={setAnswer}
                disabled={submitted}
                className="flex gap-2"
              >
                {question.options.map((opt) => {
                  const selected = answer === opt;
                  const showCorrect = submitted && opt === question.answer;
                  const showWrong = submitted && selected && opt !== question.answer;
                  return (
                    <Label
                      key={opt}
                      className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        showCorrect
                          ? "border-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40"
                          : showWrong
                          ? "border-rose-400 bg-rose-100/60 dark:bg-rose-950/40"
                          : selected
                          ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      }`}
                    >
                      <RadioGroupItem value={opt} disabled={submitted} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt}</span>
                    </Label>
                  );
                })}
              </RadioGroup>
            )}

            {showSolution && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                  الإجابة النموذجية: {question.answer}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200">{question.explanation}</p>
              </div>
            )}

            {!submitted && (
              <Button
                onClick={handleSubmit}
                disabled={!answer}
                className="w-full bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <CheckCircle2 className="w-4 h-4 ml-1" />
                تسليم الإجابة
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        <p>أكملت {completedDates.length} تحديًا يوميًا حتى الآن</p>
        <p className="text-xs mt-1">السلسلة الحالية: {streak} يوم متتالي</p>
      </div>
    </div>
  );
}
