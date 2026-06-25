"use client";

/**
 * التذييل المختصر - ثابت في أسفل الشاشة
 * يستخدم في صفحات الدروس (وليس صفحة الترحيب أو لوحة التحكم)
 * شفاف مع blur ليتناسب مع أي خلفية
 */
export function AppFooter() {
  return (
    <footer className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-t border-slate-300 dark:border-slate-700 py-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-1.5 text-[10px] md:text-xs text-slate-500 dark:text-slate-400">
        <span>© 2026</span>
        <span>•</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          المعلم فايز مروج
        </span>
      </div>
    </footer>
  );
}
