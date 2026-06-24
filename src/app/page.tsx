"use client";

import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/physics/welcome-screen";
import { Dashboard } from "@/components/physics/dashboard";
import { LessonView } from "@/components/physics/lesson-view";
import { Certificate } from "@/components/physics/certificate";
import { useProgress, useIsMounted } from "@/lib/use-progress";
import { CURRICULUM_STATS } from "@/lib/physics";
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
    issueCertificateIfEligible,
  } = useProgress();
  const isMounted = useIsMounted();
  const [view, setView] = useState<View>({ type: "dashboard" });
  const [showCertificate, setShowCertificate] = useState(false);

  // التمرير لأعلى عند تغيير العرض
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [view]);

  // عندما يكمل الطالب كل الدروس لأول مرة، نُصدر الشهادة تلقائيًا ونعرض إشعارًا
  // (نستخدم toast مباشرةً من داخل الـ effect بلا setState غير مشروط - setState
  // يحدث فقط في فرع نادر فلا يتسبب في cascade)
  useEffect(() => {
    if (!isMounted || !state.studentName) return;
    if (state.certificateIssuedAt) return; // أصدرت بالفعل
    if (state.completedLessons.length < CURRICULUM_STATS.totalLessons) return;

    const result = issueCertificateIfEligible(CURRICULUM_STATS.totalLessons);
    if (result.issued) {
      toast.success(
        "🎉 مبروك! لقد أكملت المنهج بنسبة 100% وحصلت على شهادة الإتمام!",
        { duration: 6000 }
      );
      // استخدم setTimeout لتفادي setState داخل effect مباشرة
      const timer = setTimeout(() => setShowCertificate(true), 100);
      return () => clearTimeout(timer);
    }
  }, [
    state.completedLessons.length,
    state.certificateIssuedAt,
    isMounted,
    state.studentName,
    issueCertificateIfEligible,
  ]);

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

  function handleShowCertificate() {
    // إذا لم يكن هناك تاريخ إصدار بعد، فأصدر الآن
    if (state.completedLessons.length >= 7 && !state.certificateIssuedAt) {
      issueCertificateIfEligible(CURRICULUM_STATS.totalLessons);
    }
    setShowCertificate(true);
  }

  // قبل التحميل على العميل، اعرض شاشة ترحيب لتفادي hydration mismatch
  if (!isMounted) {
    return <WelcomeScreen onStart={() => {}} />;
  }

  // إذا لم يُسجّل الطالب بعد، اعرض شاشة الترحيب
  if (!state.studentName) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  // إذا كانت الشهادة معروضة، اعرضها فوق المحتوى
  const certificateOverlay = showCertificate ? (
    <Certificate
      progress={state}
      onClose={() => setShowCertificate(false)}
    />
  ) : null;

  // لوحة التحكم
  if (view.type === "dashboard") {
    return (
      <>
        <Dashboard
          progress={state}
          onOpenLesson={handleOpenLesson}
          onReset={handleReset}
          onLogout={handleLogout}
          onShowCertificate={handleShowCertificate}
        />
        {certificateOverlay}
      </>
    );
  }

  // صفحة الدرس
  return (
    <>
      <LessonView
        lessonId={view.lessonId}
        isCompleted={state.completedLessons.includes(view.lessonId)}
        onBack={handleBackToDashboard}
        onComplete={() => handleCompleteLesson(view.lessonId)}
        onNavigateLesson={handleOpenLesson}
        onQuizResult={(correct, total) => handleQuizResult(view.lessonId, correct, total)}
        lessonTimeSpent={state.lessonTimeSeconds[view.lessonId] || 0}
      />
      {certificateOverlay}
    </>
  );
}
