"use client";

/**
 * التذييل الرئيسي - ثابت في أسفل الشاشة
 * variant="full": النص الكامل (لصفحة الترحيب ولوحة التحكم)
 * variant="compact": النص المختصر (لصفحات الدروس)
 * dark=true: للاستخدام مع الخلفية الداكنة (صفحة الترحيب)
 */
export function AppFooter({
  variant = "compact",
  dark = false,
}: {
  variant?: "compact" | "full";
  dark?: boolean;
}) {
  // صفحة الترحيب (خلفية داكنة)
  if (dark) {
    return (
      <footer className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-md bg-black/30 border-t border-white/10 py-2">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-2 text-[10px] md:text-xs text-white/70 flex-wrap">
          <span>© 2026 منصة الفيزياء التفاعلية</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">جميع الحقوق محفوظة</span>
          <span>•</span>
          <span className="font-semibold text-white/90">تصميم وإعداد المعلم: فايز مروج</span>
        </div>
      </footer>
    );
  }

  // لوحة التحكم (نص كامل، خلفية فاتحة)
  if (variant === "full") {
    return (
      <footer className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-t border-slate-300 dark:border-slate-700 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-2 text-[10px] md:text-xs text-slate-500 dark:text-slate-400 flex-wrap">
          <span>© 2026 منصة الفيزياء التفاعلية</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">جميع الحقوق محفوظة</span>
          <span>•</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">تصميم وإعداد المعلم: فايز مروج</span>
        </div>
      </footer>
    );
  }

  // صفحة الدرس (نص مختصر)
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
