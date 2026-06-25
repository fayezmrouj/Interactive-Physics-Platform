"use client";

/**
 * التذييل المختصر - ثابت في أسفل الشاشة
 * يستخدم في صفحات الدروس (وليس صفحة الترحيب أو لوحة التحكم)
 * شفاف مع blur ليتناسب مع أي خلفية
 */
export function AppFooter() {
  return (
    <footer className="fixed bottom-0 inset-x-0 z-30 backdrop-blur-sm bg-white/70 dark:bg-slate-950/70 border-t border-slate-200/50 dark:border-slate-800/50 py-1.5">
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
