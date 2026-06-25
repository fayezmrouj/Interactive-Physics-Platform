"use client";

/**
 * التذييل الرئيسي للتطبيق - مشترك بين جميع الصفحات
 * ثابت في أسفل الشاشة (fixed bottom-0)
 */
export function AppFooter() {
  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-1.5">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-1.5 text-[10px] md:text-xs text-slate-500 dark:text-slate-400">
        <span>© 2026</span>
        <span>•</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          المعلم فايز مروج
        </span>
      </div>
    </footer>
  );
}
