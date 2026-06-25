"use client";

import { useState, useEffect, useRef } from "react";
import { WelcomeScreen } from "@/components/physics/welcome-screen";
import { Dashboard } from "@/components/physics/dashboard";
import { LessonView } from "@/components/physics/lesson-view";
import { Certificate } from "@/components/physics/certificate";
import { FeaturesDrawer } from "@/components/physics/features-drawer";
import { useProgress, useIsMounted } from "@/lib/use-progress";
import { CURRICULUM_STATS } from "@/lib/physics";
import { ACHIEVEMENTS } from "@/lib/physics/achievements";
import { toast } from "sonner";
import { useTheme } from "next-themes";

type View =
  | { type: "dashboard" }
  | { type: "lesson"; lessonId: string };

export default function Home() {
  const {
    state,
    activeProfile,
    setStudentName,
    completeLesson,
    setQuizResult,
    setLastVisited,
    addLessonTime,
    resetProgress,
    logout,
    issueCertificateIfEligible,
    setNotebookEntry,
    completeDailyChallenge,
    recordPracticeAnswer,
    unlockThemeAchievement,
    switchProfile,
    addProfile,
    deleteProfile,
    exportState,
    importState,
  } = useProgress();
  const isMounted = useIsMounted();
  const { theme } = useTheme();
  const [view, setView] = useState<View>({ type: "dashboard" });
  const [showCertificate, setShowCertificate] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  // وحدة مميزة من صفحة الترحيب - ستُفتح تلقائيًا في لوحة التحكم
  const [pendingUnitId, setPendingUnitId] = useState<string | null>(null);

  // تتبع الوضع اللوني للإنجازات - تجنّب الحلقة اللانهائية بالتحقق من التغيير
  const lastThemeRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isMounted || !activeProfile) return;
    if (!theme) return;
    const mode = theme === "dark" ? "dark" : "light";
    if (lastThemeRef.current === mode) return;
    if (activeProfile.lastThemeMode === mode) {
      lastThemeRef.current = mode;
      return;
    }
    lastThemeRef.current = mode;
    unlockThemeAchievement(mode);
  }, [theme, isMounted, activeProfile, unlockThemeAchievement]);

  // التمرير لأعلى عند تغيير العرض
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [view]);

  // عندما يكمل الطالب كل الدروس لأول مرة، نُصدر الشهادة تلقائيًا
  useEffect(() => {
    if (!isMounted || !activeProfile) return;
    if (activeProfile.certificateIssuedAt) return;
    if (activeProfile.completedLessons.length < CURRICULUM_STATS.totalLessons) return;

    const result = issueCertificateIfEligible(CURRICULUM_STATS.totalLessons);
    if (result.issued) {
      toast.success(
        "🎉 مبروك! لقد أكملت المنهج بنسبة 100% وحصلت على شهادة الإتمام!",
        { duration: 6000 }
      );
      const timer = setTimeout(() => setShowCertificate(true), 100);
      return () => clearTimeout(timer);
    }
  }, [
    activeProfile?.completedLessons.length,
    activeProfile?.certificateIssuedAt,
    isMounted,
    activeProfile,
    issueCertificateIfEligible,
  ]);

  // الاستماع لإلغاء قفل الإنجازات الجديدة
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      const ids = (e as CustomEvent<string[]>).detail;
      if (ids && ids.length > 0) {
        ids.forEach((id) => {
          const ach = ACHIEVEMENTS.find((a) => a.id === id);
          if (ach) {
            toast.success(`🏆 إنجاز جديد: ${ach.icon} ${ach.title} (+${ach.points} نقطة)`, {
              duration: 5000,
            });
          }
        });
      }
    };
    window.addEventListener("physics-achievements-unlocked", handler);
    return () => window.removeEventListener("physics-achievements-unlocked", handler);
  }, []);

  function handleStart(
    name: string,
    grade: "9" | "10" | "all",
    selectedUnitId?: string | null
  ) {
    setStudentName(name, grade);
    setPendingUnitId(selectedUnitId || null);
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
    if (!activeProfile) return;
    if (activeProfile.completedLessons.includes(lessonId)) {
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
      resetProgress();
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
    if (activeProfile && activeProfile.completedLessons.length >= 7 && !activeProfile.certificateIssuedAt) {
      issueCertificateIfEligible(CURRICULUM_STATS.totalLessons);
    }
    setShowCertificate(true);
  }

  function handleDailyComplete(correct: boolean) {
    completeDailyChallenge(correct);
    if (correct) {
      toast.success("🎯 إجابة صحيحة! حافظ على سلسلتك يوميًا.");
    } else {
      toast.info("إجابة غير صحيحة. ستتعلم أكثر غدًا!");
    }
  }

  function handlePracticeAnswer(
    questionId: string,
    isCorrect: boolean,
    difficulty: "easy" | "medium" | "hard"
  ) {
    recordPracticeAnswer(questionId, isCorrect, difficulty);
  }

  // قبل التحميل على العميل
  if (!isMounted) {
    return <WelcomeScreen onStart={() => {}} />;
  }

  // إذا لم يُسجّل الطالب بعد - تحقق من وجود ملفات سابقة لعرض "متابعة"
  const existingProfiles = Object.values(state.profiles);
  const lastProfile = existingProfiles[0];
  const hasExistingProfile =
    existingProfiles.length > 0 && !!lastProfile?.name;

  // بيانات التحدي اليومي من آخر بروفايل نشط (إن وُجد)
  const todayKey = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();
  const lastProfileDailyCompleted = lastProfile
    ? lastProfile.dailyChallengeCompletedDates.includes(todayKey)
    : false;
  const lastProfileStreak = lastProfile?.dailyStreak || 0;

  if (!activeProfile) {
    return (
      <WelcomeScreen
        onStart={handleStart}
        hasProgress={hasExistingProfile}
        studentName={lastProfile?.name}
        onContinue={() => {
          if (lastProfile) {
            switchProfile(lastProfile.id);
            setView({ type: "dashboard" });
          }
        }}
        dailyChallengeCompletedToday={lastProfileDailyCompleted}
        dailyStreak={lastProfileStreak}
      />
    );
  }

  // overlay الشهادة
  const certificateOverlay = showCertificate ? (
    <Certificate
      progress={{
        studentName: activeProfile.name,
        completedLessons: activeProfile.completedLessons,
        quizResults: activeProfile.quizResults,
        lastVisited: activeProfile.lastVisited,
        startedAt: activeProfile.startedAt,
        lessonTimeSeconds: activeProfile.lessonTimeSeconds,
        totalTimeSeconds: activeProfile.totalTimeSeconds,
        certificateIssuedAt: activeProfile.certificateIssuedAt,
        notebook: activeProfile.notebook,
        spacedRepetition: activeProfile.spacedRepetition,
        dailyChallengeCompletedDates: activeProfile.dailyChallengeCompletedDates,
        dailyChallengeResults: activeProfile.dailyChallengeResults,
        practiceStats: activeProfile.practiceStats,
        lastStudyDate: activeProfile.lastStudyDate,
        dailyStreak: activeProfile.dailyStreak,
        unlockedAchievements: activeProfile.unlockedAchievements,
        lastThemeMode: activeProfile.lastThemeMode,
        id: activeProfile.id,
        name: activeProfile.name,
        createdAt: activeProfile.createdAt,
      }}
      onClose={() => setShowCertificate(false)}
    />
  ) : null;

  // لوحة التحكم
  if (view.type === "dashboard") {
    return (
      <>
        <Dashboard
          profile={activeProfile}
          onOpenLesson={handleOpenLesson}
          onReset={handleReset}
          onLogout={handleLogout}
          onShowCertificate={handleShowCertificate}
          onOpenFeatures={() => setFeaturesOpen(true)}
          pendingUnitId={pendingUnitId}
          onConsumedPendingUnit={() => setPendingUnitId(null)}
        />
        <FeaturesDrawer
          activeProfile={activeProfile}
          onNavigateLesson={handleOpenLesson}
          onAnswer={handlePracticeAnswer}
          onDailyComplete={handleDailyComplete}
          onSaveNote={setNotebookEntry}
          onSwitchProfile={switchProfile}
          onAddProfile={addProfile}
          onDeleteProfile={deleteProfile}
          onExport={exportState}
          onImport={importState}
          profilesState={state}
          externalOpen={featuresOpen}
          onExternalOpenChange={setFeaturesOpen}
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
        isCompleted={activeProfile.completedLessons.includes(view.lessonId)}
        onBack={handleBackToDashboard}
        onComplete={() => handleCompleteLesson(view.lessonId)}
        onNavigateLesson={handleOpenLesson}
        onQuizResult={(correct, total) => handleQuizResult(view.lessonId, correct, total)}
        lessonTimeSpent={activeProfile.lessonTimeSeconds[view.lessonId] || 0}
        notes={activeProfile.notebook[view.lessonId] || ""}
        onSaveNote={(text) => setNotebookEntry(view.lessonId, text)}
        studentName={activeProfile.name}
        eligibleForCertificate={
          Math.round(
            (activeProfile.completedLessons.length / CURRICULUM_STATS.totalLessons) * 100
          ) >= 70
        }
        certificateIssued={!!activeProfile.certificateIssuedAt}
        onOpenFeatures={() => setFeaturesOpen(true)}
        onShowCertificate={handleShowCertificate}
        onReset={handleReset}
        onLogout={handleLogout}
      />
      <FeaturesDrawer
        activeProfile={activeProfile}
        onNavigateLesson={handleOpenLesson}
        onAnswer={handlePracticeAnswer}
        onDailyComplete={handleDailyComplete}
        onSaveNote={setNotebookEntry}
        onSwitchProfile={switchProfile}
        onAddProfile={addProfile}
        onDeleteProfile={deleteProfile}
        onExport={exportState}
        onImport={importState}
        profilesState={state}
        externalOpen={featuresOpen}
        onExternalOpenChange={setFeaturesOpen}
      />
      {certificateOverlay}
    </>
  );
}
