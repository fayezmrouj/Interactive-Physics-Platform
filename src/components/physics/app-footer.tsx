"use client";

/**
 * التذييل الرئيسي - ثابت في أسفل الشاشة
 * خلفية داكنة شفافة في جميع الصفحات للتوحد البصري
 * variant="full": النص الكامل (لصفحة الترحيب ولوحة التحكم)
 * variant="compact": النص المختصر (لصفحات الدروس)
 */
export function AppFooter({
  variant = "compact",
}: {
  variant?: "compact" | "full";
}) {
  if (variant === "full") {
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

  // صفحة الدرس (نص مختصر)
  return (
    <footer className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-md bg-black/30 border-t border-white/10 py-1.5">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-1.5 text-[10px] md:text-xs text-white/70">
        <span>© 2026</span>
        <span>•</span>
        <span className="font-semibold text-white/90">
          المعلم فايز مروج
        </span>
      </div>
    </footer>
  );
}
