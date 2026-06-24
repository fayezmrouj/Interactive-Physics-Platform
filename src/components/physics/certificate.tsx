"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Award,
  Printer,
  X,
  GraduationCap,
  Atom,
  Sparkles,
} from "lucide-react";
import type { ProgressState } from "@/lib/use-progress";
import { formatTime } from "@/lib/use-progress";
import { CURRICULUM_STATS } from "@/lib/physics";

type Props = {
  progress: ProgressState;
  onClose: () => void;
};

export function Certificate({ progress, onClose }: Props) {
  const completedCount = progress.completedLessons.length;
  const totalLessons = CURRICULUM_STATS.totalLessons;
  const completionPct = Math.round((completedCount / totalLessons) * 100);
  const issuedAt = progress.certificateIssuedAt
    ? new Date(progress.certificateIssuedAt)
    : new Date();
  const startedAt = progress.startedAt
    ? new Date(progress.startedAt)
    : null;

  // حساب عدد الإجابات الصحيحة في الكويزات
  const quizStats = Object.values(progress.quizResults).reduce(
    (acc, r) => ({
      correct: acc.correct + r.correct,
      total: acc.total + r.total,
    }),
    { correct: 0, total: 0 }
  );
  const quizPct =
    quizStats.total > 0
      ? Math.round((quizStats.correct / quizStats.total) * 100)
      : 0;

  // رقم الشهادة (مشتق من بيانات الطالب)
  const certificateId = `PHY-${(
    progress.startedAt || Date.now()
  )
    .toString(36)
    .toUpperCase()
    .slice(-6)}-${completedCount.toString().padStart(2, "0")}`;

  const studentName = progress.studentName || "طالب الفيزياء";

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  // التقييم النصي حسب نسبة الإنجاز
  let grade = "ممتاز";
  let gradeColor = "text-amber-600";
  if (completionPct < 70) {
    grade = "مؤهل";
    gradeColor = "text-indigo-600";
  } else if (completionPct < 90) {
    grade = "جيد جدًا";
    gradeColor = "text-emerald-600";
  } else if (completionPct < 100) {
    grade = "ممتاز";
    gradeColor = "text-amber-600";
  } else {
    grade = "ممتاز بمرتبة الشرف";
    gradeColor = "text-amber-600";
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-4xl my-4"
      >
        {/* أزرار التحكم - لا تُطبع */}
        <div className="no-print flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-white">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="font-semibold">شهادة إتمام</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-white text-slate-900 hover:bg-slate-100"
            >
              <Printer className="w-4 h-4 ml-1" />
              طباعة / حفظ PDF
            </Button>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <X className="w-4 h-4 ml-1" />
              إغلاق
            </Button>
          </div>
        </div>

        {/* الشهادة - تُطبع فقط */}
        <div className="certificate-print bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* إطار زخرفي */}
          <div className="p-2 md:p-3 bg-gradient-to-bl from-amber-100 via-yellow-50 to-amber-100">
            <div className="border-4 border-double border-amber-600 rounded-lg p-1">
              <div className="border-2 border-amber-400 rounded-md overflow-hidden">
                <div className="bg-white px-4 md:px-10 py-6 md:py-10">
                  {/* رأس الشهادة */}
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                      <div className="relative">
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 -m-2"
                        >
                          <Sparkles className="w-5 h-5 text-amber-400 absolute -top-3 left-1/2 -translate-x-1/2" />
                          <Sparkles className="w-4 h-4 text-amber-400 absolute -bottom-2 left-1/2 -translate-x-1/2" />
                        </motion.div>
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                          <GraduationCap className="w-9 h-9 md:w-11 md:h-11 text-white" />
                        </div>
                      </div>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-extrabold text-indigo-900 mb-1">
                      شهادة إتمام
                    </h1>
                    <p className="text-sm md:text-base text-slate-600">
                      منصة الفيزياء التفاعلية
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="h-px w-12 bg-amber-500" />
                      <Atom className="w-4 h-4 text-indigo-700" />
                      <div className="h-px w-12 bg-amber-500" />
                    </div>
                  </div>

                  {/* جسم الشهادة */}
                  <div className="text-center px-2 md:px-8">
                    <p className="text-slate-600 text-sm md:text-base mb-2">
                      تشهد منصة الفيزياء التفاعلية بأن الطالب
                    </p>
                    <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-3 py-2 px-4 inline-block border-b-2 border-amber-500">
                      {studentName}
                    </h2>
                    <p className="text-slate-700 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-5">
                      قد أتمّ بنجاح دراسة منهج الفيزياء للصفين التاسع والعاشر،
                      مشتملاً على{" "}
                      <span className="font-bold text-indigo-700">
                        {CURRICULUM_STATS.totalUnits} وحدات دراسية
                      </span>{" "}
                      و{" "}
                      <span className="font-bold text-indigo-700">
                        {totalLessons} درسًا
                      </span>{" "}
                      تشمل القوانين والأمثلة المحلولة والتجارب المخبرية والكويزات
                      التفاعلية.{" "}
                      {completionPct >= 100
                        ? "وقد أتمّ جميع الدروس بنجاح."
                        : `وقد أتمّ ${completedCount} من ${totalLessons} درسًا.`}
                    </p>

                    {/* إحصائيات الإنجاز */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                      <StatBox
                        label="نسبة الإنجاز"
                        value={`${completionPct}%`}
                        color="indigo"
                      />
                      <StatBox
                        label="دروس مكتملة"
                        value={`${completedCount}/${totalLessons}`}
                        color="blue"
                      />
                      <StatBox
                        label="وقت الدراسة"
                        value={formatTime(progress.totalTimeSeconds)}
                        color="purple"
                      />
                      <StatBox
                        label="نتيجة الكويزات"
                        value={`${quizPct}%`}
                        color="amber"
                      />
                    </div>

                    {/* التقدير */}
                    <div className="inline-block px-6 py-3 bg-gradient-to-l from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-lg mb-6">
                      <div className="text-xs text-slate-500 mb-1">
                        التقدير النهائي
                      </div>
                      <div className={`text-2xl font-extrabold ${gradeColor}`}>
                        {grade}
                      </div>
                    </div>

                    {/* التوقيع والتاريخ */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-center">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">
                          تاريخ البدء
                        </div>
                        <div className="text-sm font-semibold text-slate-800">
                          {startedAt
                            ? startedAt.toLocaleDateString("ar-EG", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">
                          تاريخ الإصدار
                        </div>
                        <div className="text-sm font-semibold text-slate-800">
                          {issuedAt.toLocaleDateString("ar-EG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">
                          رقم الشهادة
                        </div>
                        <div className="text-sm font-mono font-bold text-indigo-700">
                          {certificateId}
                        </div>
                      </div>
                    </div>

                    {/* التوقيع */}
                    <div className="flex items-center justify-between mt-10 pt-6 border-t-2 border-dashed border-slate-300">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-700 font-cairo">
                          منصة الفيزياء التفاعلية
                        </div>
                        <div className="text-xs text-slate-500">
                          إدارة المنصة التعليمية
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-300 to-amber-500 flex items-center justify-center mx-auto mb-1 shadow-md">
                          <Award className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-xs text-slate-500">ختم الإتمام</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ملاحظة سفلية - لا تُطبع */}
        <p className="no-print text-center text-white/70 text-xs mt-4">
          💡 يمكنك حفظ الشهادة كملف PDF عبر زر "طباعة / حفظ PDF" واختيار "Save as PDF"
        </p>
      </motion.div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "indigo" | "blue" | "purple" | "amber";
}) {
  const colorMap = {
    indigo: "border-indigo-300 bg-indigo-50 text-indigo-900",
    blue: "border-blue-300 bg-blue-50 text-blue-900",
    purple: "border-purple-300 bg-purple-50 text-purple-900",
    amber: "border-amber-300 bg-amber-50 text-amber-900",
  };
  return (
    <div
      className={`border-2 rounded-lg p-3 ${colorMap[color]}`}
    >
      <div className="text-[10px] md:text-xs opacity-70 mb-1">{label}</div>
      <div className="text-sm md:text-lg font-bold">{value}</div>
    </div>
  );
}
