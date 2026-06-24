"use client";

import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/physics/welcome-screen";
import { Dashboard } from "@/components/physics/dashboard";
import { LessonView } from "@/components/physics/lesson-view";
import { useProgress, useIsMounted } from "@/lib/use-progress";
import { toast } from "sonner";

type View =
  | { type: "dashboard" }
  | { type: "lesson"; lessonId: string };

export default function Home() {
  const {
    state,
    setStudentName,
    completeLesson,
    setQuizResult,
    setLastVisited,
    resetProgress,
    logout,
  } = useProgress();
  const isMounted = useIsMounted();
  const [view, setView] = useState<View>({ type: "dashboard" });

  // التمرير لأعلى عند تغيير العرض
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [view]);

  function handleStart(name: string) {
    setStudentName(name);
    setView({ type: "dashboard" });
    toast.success(`أهلاً بك ${name}! ابدأ رحلتك في عالم الفيزياء 🚀`);
  }

  function handleOpenLesson(lessonId: string) {
    setLastVisited(lessonId);
    setView({ type: "lesson", lessonId });
  }

  function handleBackToDashboard() {
    setView({ type: "dashboard" });
  }

  function handleCompleteLesson(lessonId: string) {
    if (state.completedLessons.includes(lessonId)) {
      toast.info("لقد أكملت هذا الدرس بالفعل.");
      return;
    }
    completeLesson(lessonId);
    toast.success("🎉 أحسنت! تم إكمال الدرس. شريط التقدم محدّث.");
  }

  function handleReset() {
    if (
      typeof window !== "undefined" &&
      window.confirm(
        "هل أنت متأكد من تصفير كل تقدمك؟ سيتم حذف الدروس المكتملة ونتائج الكويزات (لن يتم حذف اسمك)."
      )
    ) {
      const studentName = state.studentName;
      resetProgress();
      // أعد الاسم لأن resetProgress تمسح كل شيء
      setStudentName(studentName);
      setView({ type: "dashboard" });
      toast.success("تم تصفير التقدم بنجاح.");
    }
  }

  function handleLogout() {
    if (
      typeof window !== "undefined" &&
      window.confirm("هل تريد الخروج؟ سيتم حذف اسمك وتقدمك من هذا المتصفح.")
    ) {
      logout();
      setView({ type: "dashboard" });
      toast.info("تم تسجيل الخروج. نراك قريبًا!");
    }
  }

  function handleQuizResult(lessonId: string, correct: number, total: number) {
    setQuizResult(lessonId, correct, total);
    const pct = Math.round((correct / total) * 100);
    if (pct >= 70) {
      toast.success(`🎉 ممتاز! نتيجتك ${correct}/${total} (${pct}%)`);
    } else if (pct >= 50) {
      toast.info(`نتيجتك ${correct}/${total} (${pct}%). حاول مرة أخرى لتحسينها!`);
    } else {
      toast.warning(`نتيجتك ${correct}/${total} (${pct}%). راجع الدرس وأعد المحاولة.`);
    }
  }

  // قبل التحميل على العميل، اعرض شاشة ترحيب لتفادي hydration mismatch
  if (!isMounted) {
    return <WelcomeScreen onStart={() => {}} />;
  }

  // إذا لم يُسجّل الطالب بعد، اعرض شاشة الترحيب
  if (!state.studentName) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  // لوحة التحكم
  if (view.type === "dashboard") {
    return (
      <Dashboard
        progress={state}
        onOpenLesson={handleOpenLesson}
        onReset={handleReset}
        onLogout={handleLogout}
      />
    );
  }

  // صفحة الدرس
  return (
    <LessonView
      lessonId={view.lessonId}
      isCompleted={state.completedLessons.includes(view.lessonId)}
      onBack={handleBackToDashboard}
      onComplete={() => handleCompleteLesson(view.lessonId)}
      onNavigateLesson={handleOpenLesson}
      onQuizResult={(correct, total) => handleQuizResult(view.lessonId, correct, total)}
    />
  );
}
