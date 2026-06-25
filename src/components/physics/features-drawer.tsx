"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Search,
  BookA,
  Calculator,
  FlaskConical,
  Dumbbell,
  Brain,
  Calendar,
  Trophy,
  BarChart3,
  BookOpen,
  Clock,
  Database,
  Users,
  X,
} from "lucide-react";
import { SmartSearch } from "./smart-search";
import { Dictionary } from "./dictionary-view";
import { PhysicsCalculator } from "./calculator";
import { SimulationLab } from "./simulation-lab";
import { PracticeMode } from "./practice-mode";
import { SpacedRepetition } from "./spaced-repetition";
import { DailyChallenge } from "./daily-challenge";
import { Achievements } from "./achievements-view";
import { Analytics } from "./analytics";
import { Notebook } from "./notebook";
import { FocusMode } from "./focus-mode";
import { ExportImport } from "./export-import";
import { Profiles } from "./profiles";
import type { UserProfile } from "@/lib/use-progress";

type FeatureKey =
  | "search"
  | "dictionary"
  | "calculator"
  | "simulations"
  | "practice"
  | "spaced"
  | "daily"
  | "achievements"
  | "analytics"
  | "notebook"
  | "focus"
  | "export"
  | "profiles";

type Feature = {
  key: FeatureKey;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const FEATURES: Feature[] = [
  {
    key: "search",
    label: "البحث الذكي",
    description: "بحث فوري في الدروس والمفاهيم والقوانين",
    icon: <Search className="w-5 h-5" />,
    color: "indigo",
  },
  {
    key: "dictionary",
    label: "القاموس الفيزيائي",
    description: "قاموس شامل بكل المصطلحات والقوانين",
    icon: <BookA className="w-5 h-5" />,
    color: "purple",
  },
  {
    key: "calculator",
    label: "الحاسبة الفيزيائية",
    description: "احسب أي مجهول في القوانين مع شرح الخطوات",
    icon: <Calculator className="w-5 h-5" />,
    color: "emerald",
  },
  {
    key: "simulations",
    label: "مختبر المحاكاة",
    description: "محاكاة تفاعلية: سقوط حر، نيوتن، انكسار، موجات",
    icon: <FlaskConical className="w-5 h-5" />,
    color: "rose",
  },
  {
    key: "practice",
    label: "التدريب المكثّف",
    description: "تدرّب على 50+ سؤال بمستويات صعوبة مختلفة",
    icon: <Dumbbell className="w-5 h-5" />,
    color: "violet",
  },
  {
    key: "spaced",
    label: "المراجعة الذكية",
    description: "خوارزمية تذكير فاصل لإتقان الأسئلة الصعبة",
    icon: <Brain className="w-5 h-5" />,
    color: "cyan",
  },
  {
    key: "daily",
    label: "تحدي اليوم",
    description: "سؤال جديد كل يوم مع تتبع السلسلة",
    icon: <Calendar className="w-5 h-5" />,
    color: "amber",
  },
  {
    key: "achievements",
    label: "الإنجازات والشارات",
    description: "اجمع النقاط وافتح الشارات بتحقيق الأهداف",
    icon: <Trophy className="w-5 h-5" />,
    color: "yellow",
  },
  {
    key: "analytics",
    label: "الإحصائيات",
    description: "تحليل أدائك ونقاط قوتك وضعفك",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "blue",
  },
  {
    key: "notebook",
    label: "مفكرة الطالب",
    description: "اكتب ملاحظاتك لكل درس وصدّرها كملف",
    icon: <BookOpen className="w-5 h-5" />,
    color: "teal",
  },
  {
    key: "focus",
    label: "وضع التركيز",
    description: "مؤقت بومودورو: 25 دقيقة دراسة + 5 استراحة",
    icon: <Clock className="w-5 h-5" />,
    color: "violet",
  },
  {
    key: "export",
    label: "تصدير/استيراد",
    description: "انقل تقدمك بين الأجهزة أو احتفظ بنسخة احتياطية",
    icon: <Database className="w-5 h-5" />,
    color: "slate",
  },
  {
    key: "profiles",
    label: "ملفات المستخدمين",
    description: "عدة ملفات على نفس الجهاز (Family Mode)",
    icon: <Users className="w-5 h-5" />,
    color: "pink",
  },
];

type Props = {
  activeProfile: UserProfile | null;
  onNavigateLesson: (lessonId: string) => void;
  onAnswer: (
    questionId: string,
    isCorrect: boolean,
    difficulty: "easy" | "medium" | "hard"
  ) => void;
  onDailyComplete: (correct: boolean) => void;
  onSaveNote: (lessonId: string, text: string) => void;
  onSwitchProfile: (id: string) => void;
  onAddProfile: (name: string) => void;
  onDeleteProfile: (id: string) => void;
  onExport: () => string;
  onImport: (json: string) => boolean;
  profilesState: import("@/lib/use-progress").ProgressState;
  // فتح من الخارج (من زر الرأس)
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
};

export function FeaturesDrawer({
  activeProfile,
  onNavigateLesson,
  onAnswer,
  onDailyComplete,
  onSaveNote,
  onSwitchProfile,
  onAddProfile,
  onDeleteProfile,
  onExport,
  onImport,
  profilesState,
  externalOpen,
  onExternalOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onExternalOpenChange || setInternalOpen;

  const [activeFeature, setActiveFeature] = useState<FeatureKey | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  function openFeature(key: FeatureKey) {
    if (key === "search") {
      // البحث يفتح كـ Dialog منفصل
      setSearchOpen(true);
      return;
    }
    setActiveFeature(key);
    setOpen(true);
  }

  const activeFeatureData = FEATURES.find((f) => f.key === activeFeature);

  return (
    <>
      {/* Dialog البحث */}
      <SmartSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onNavigateLesson={(id) => {
          onNavigateLesson(id);
          setSearchOpen(false);
        }}
      />

      {/* Drawer الميزات */}
      <Sheet
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setActiveFeature(null);
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl p-0 flex flex-col h-[100dvh]"
          dir="rtl"
        >
          {/* الرأس مع زر إغلاق واضح */}
          <SheetHeader className="border-b border-slate-200 dark:border-slate-800 p-4 flex-row items-center justify-between space-y-0">
            <SheetTitle className="text-right">
              {activeFeatureData ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveFeature(null)}
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    ← رجوع
                  </button>
                  <span>{activeFeatureData.label}</span>
                </div>
              ) : (
                <span>كل الميزات الإضافية</span>
              )}
            </SheetTitle>
            <button
              onClick={() => {
                setOpen(false);
                setActiveFeature(null);
              }}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shrink-0"
              aria-label="إغلاق"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </SheetHeader>

          {/* المحتوى قابل للتمرير العمودي */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden"
            style={{
              scrollbarWidth: "thin",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="p-4 pb-20">
              {!activeFeature ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {FEATURES.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => openFeature(f.key)}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all text-right"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-${f.color}-100 dark:bg-${f.color}-950/40 text-${f.color}-700 dark:text-${f.color}-300 flex items-center justify-center mb-2`}>
                        {f.icon}
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">
                        {f.label}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {f.description}
                      </p>
                    </button>
                  ))}
                </div>
              ) : activeProfile ? (
                <FeatureContent
                  feature={activeFeature}
                  profile={activeProfile}
                  onNavigateLesson={(id) => {
                    onNavigateLesson(id);
                    setOpen(false);
                  }}
                  onAnswer={onAnswer}
                  onDailyComplete={onDailyComplete}
                  onSaveNote={onSaveNote}
                  onSwitchProfile={onSwitchProfile}
                  onAddProfile={onAddProfile}
                  onDeleteProfile={onDeleteProfile}
                  onExport={onExport}
                  onImport={onImport}
                  profilesState={profilesState}
                />
              ) : (
                <div className="text-center p-8 text-slate-500 dark:text-slate-400">
                  سجّل اسمك أولًا لتفعيل هذه الميزة
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function FeatureContent({
  feature,
  profile,
  onNavigateLesson,
  onAnswer,
  onDailyComplete,
  onSaveNote,
  onSwitchProfile,
  onAddProfile,
  onDeleteProfile,
  onExport,
  onImport,
  profilesState,
}: {
  feature: FeatureKey;
  profile: UserProfile;
  onNavigateLesson: (lessonId: string) => void;
  onAnswer: (
    questionId: string,
    isCorrect: boolean,
    difficulty: "easy" | "medium" | "hard"
  ) => void;
  onDailyComplete: (correct: boolean) => void;
  onSaveNote: (lessonId: string, text: string) => void;
  onSwitchProfile: (id: string) => void;
  onAddProfile: (name: string) => void;
  onDeleteProfile: (id: string) => void;
  onExport: () => string;
  onImport: (json: string) => boolean;
  profilesState: any;
}) {
  switch (feature) {
    case "dictionary":
      return <Dictionary onNavigateLesson={onNavigateLesson} />;
    case "calculator":
      return <PhysicsCalculator />;
    case "simulations":
      return <SimulationLab />;
    case "practice":
      return <PracticeMode onAnswer={onAnswer} />;
    case "spaced":
      return <SpacedRepetition items={profile.spacedRepetition} onAnswer={onAnswer} />;
    case "daily":
      return (
        <DailyChallenge
          completedDates={profile.dailyChallengeCompletedDates}
          streak={profile.dailyStreak}
          onComplete={onDailyComplete}
        />
      );
    case "achievements":
      return <Achievements unlockedAchievements={profile.unlockedAchievements} />;
    case "analytics":
      return <Analytics profile={profile} />;
    case "notebook":
      return <Notebook notes={profile.notebook} onSaveNote={onSaveNote} />;
    case "focus":
      return <FocusMode />;
    case "export":
      return <ExportImport onExport={onExport} onImport={onImport} />;
    case "profiles":
      return (
        <Profiles
          state={profilesState}
          activeProfileId={profilesState.activeProfileId}
          onSwitch={onSwitchProfile}
          onAdd={onAddProfile}
          onDelete={onDeleteProfile}
        />
      );
    default:
      return null;
  }
}
