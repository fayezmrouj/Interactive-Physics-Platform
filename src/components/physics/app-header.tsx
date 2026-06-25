"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  GraduationCap,
  Menu,
  Award,
  RotateCcw,
  LogOut,
} from "lucide-react";

type Props = {
  studentName: string;
  eligibleForCertificate: boolean;
  certificateIssued: boolean;
  onOpenFeatures: () => void;
  onShowCertificate: () => void;
  onReset: () => void;
  onLogout: () => void;
  onShowCertInstructions?: () => void;
};

/**
 * الترويسة الرئيسية للتطبيق - مشتركة بين لوحة التحكم وصفحة الدرس
 * ثابتة في الأعلى (sticky top-0)
 */
export function AppHeader({
  studentName,
  eligibleForCertificate,
  certificateIssued,
  onOpenFeatures,
  onShowCertificate,
  onReset,
  onLogout,
  onShowCertInstructions,
}: Props) {
  return (
    <header
      className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-md shrink-0">
            <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm md:text-lg font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">
              منصة الفيزياء التفاعلية
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 truncate leading-tight">
              أهلًا بك يا{" "}
              <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                {studentName}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            onClick={onOpenFeatures}
            className="bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md h-8 md:h-9"
            title="كل الميزات الإضافية (حاسبة، محاكاة، تدريب، إنجازات...)"
          >
            <Menu className="w-4 h-4 ml-1" />
            المزيد
          </Button>
          <ThemeToggle />
          <Button
            size="sm"
            onClick={() => {
              if (eligibleForCertificate) {
                onShowCertificate();
              } else {
                onShowCertInstructions?.();
              }
            }}
            className="hidden sm:inline-flex bg-gradient-to-l from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white h-8 md:h-9"
            title={!eligibleForCertificate ? "اضغط لمعرفة كيف تحصل على الشهادة" : "عرض شهادتك"}
          >
            <Award className="w-4 h-4 ml-1" />
            {certificateIssued ? "شهادتك" : "احصل على شهادتك"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hidden md:inline-flex h-8 md:h-9"
          >
            <RotateCcw className="w-4 h-4 ml-1" />
            تصفير
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white h-8 md:h-9"
          >
            <LogOut className="w-4 h-4 ml-1" />
            <span className="hidden sm:inline">خروج</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
