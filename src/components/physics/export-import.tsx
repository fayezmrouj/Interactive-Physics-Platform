"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Upload,
  Database,
  CheckCircle2,
  XCircle,
  FileJson,
} from "lucide-react";

type Props = {
  onExport: () => string;
  onImport: (json: string) => boolean;
};

export function ExportImport({ onExport, onImport }: Props) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = onExport();
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `physics-progress-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("success");
    setMessage("تم تصدير تقدمك بنجاح! احتفظ بهذا الملف لاستعادته لاحقًا.");
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const ok = onImport(text);
      if (ok) {
        setStatus("success");
        setMessage("تم استيراد التقدم بنجاح! يتم تحديث الواجهة الآن.");
      } else {
        setStatus("error");
        setMessage("ملف غير صالح. تأكد من اختيار ملف تصدير صحيح.");
      }
    };
    reader.onerror = () => {
      setStatus("error");
      setMessage("تعذّر قراءة الملف.");
    };
    reader.readAsText(file);
    e.target.value = ""; // reset للسماح بإعادة الاستيراد
  }

  // إحصائيات
  const stats = (() => {
    try {
      const data = JSON.parse(onExport());
      const active = data.profiles?.[data.activeProfileId];
      if (!active) return null;
      return {
        completedLessons: active.completedLessons.length,
        quizCount: Object.keys(active.quizResults).length,
        totalTime: active.totalTimeSeconds,
        achievements: active.unlockedAchievements.length,
        notes: Object.values(active.notebook).filter((n: any) => n && n.trim()).length,
      };
    } catch {
      return null;
    }
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
        <Database className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            التصدير والاستيراد
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            انقل تقدمك بين الأجهزة أو احتفظ بنسخة احتياطية
          </p>
        </div>
      </div>

      {stats && (
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-bold mb-2">📊 بياناتك الحالية:</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                <div className="text-slate-500">دروس مكتملة</div>
                <div className="font-bold text-slate-800 dark:text-slate-100">{stats.completedLessons}/24</div>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                <div className="text-slate-500">كويزات</div>
                <div className="font-bold text-slate-800 dark:text-slate-100">{stats.quizCount}</div>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                <div className="text-slate-500">إنجازات</div>
                <div className="font-bold text-slate-800 dark:text-slate-100">{stats.achievements}</div>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                <div className="text-slate-500">ملاحظات</div>
                <div className="font-bold text-slate-800 dark:text-slate-100">{stats.notes}</div>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded col-span-2 md:col-span-1">
                <div className="text-slate-500">إجمالي الوقت</div>
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  {Math.floor(stats.totalTime / 60)} دقيقة
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {/* تصدير */}
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mx-auto mb-3">
              <Download className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
              تصدير التقدم
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              نزّل تقدمك كملف JSON للاحتفاظ به
            </p>
            <Button
              onClick={handleExport}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="w-4 h-4 ml-1" />
              تصدير الآن
            </Button>
          </CardContent>
        </Card>

        {/* استيراد */}
        <Card className="border-indigo-200 dark:border-indigo-800">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-indigo-700 dark:text-indigo-400" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
              استيراد التقدم
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              استعد تقدمك من ملف JSON محفوظ سابقًا
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              onClick={handleImportClick}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              <Upload className="w-4 h-4 ml-1" />
              اختر ملف
            </Button>
          </CardContent>
        </Card>
      </div>

      {status !== "idle" && (
        <div
          className={`p-3 rounded-lg border text-sm flex items-start gap-2 ${
            status === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
          }`}
        >
          {status === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <span>{message}</span>
        </div>
      )}

      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-xs text-slate-600 dark:text-slate-300 space-y-1">
        <div className="font-bold mb-1">💡 متى تستخدم هذه الميزة؟</div>
        <div>• عند الانتقال لجهاز جديد (من الكمبيوتر للجوال مثلًا)</div>
        <div>• كنسخة احتياطية قبل تصفير المتصفح</div>
        <div>• لمشاركة تقدمك مع معلمك أو ولي أمرك</div>
        <div className="mt-2 flex items-center gap-1 text-slate-500">
          <FileJson className="w-3 h-3" />
          <span>الملف بصيغة JSON قياسية يمكن قراءته بأي محرر نصوص</span>
        </div>
      </div>
    </div>
  );
}
