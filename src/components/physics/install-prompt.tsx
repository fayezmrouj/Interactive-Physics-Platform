"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone, Monitor } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState<"mobile" | "desktop">("desktop");

  useEffect(() => {
    // تحقق إذا كان التطبيق مثبتًا بالفعل
    if (window.matchMedia("(display-mode: standalone)").matches) {
      const t = setTimeout(() => setIsInstalled(true), 0);
      return () => clearTimeout(t);
    }

    // تحديد نوع الجهاز
    const dt = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
      ? "mobile"
      : "desktop";
    const t2 = setTimeout(() => setDeviceType(dt), 0);

    // الاستماع لحدث beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // اعرض المطالبة بعد 3 ثوانٍ (لكي لا تكون مزعجة فورًا)
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // الاستماع لحدث appinstalled
    const installedHandler = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
      clearTimeout(t2);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setIsInstalled(true);
    }
    setShowPrompt(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setShowPrompt(false);
    // لا تُظهر مجددًا لمدة 7 أيام
    try {
      localStorage.setItem(
        "install-prompt-dismissed",
        Date.now().toString()
      );
    } catch {}
  }

  // تحقق إن كان المستخدم رفض سابقًا (خلال 7 أيام) - استخدم initial state
  const [initiallyDismissed, setInitiallyDismissed] = useState(false);
  useEffect(() => {
    const dismissed = localStorage.getItem("install-prompt-dismissed");
    if (dismissed) {
      const daysSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        const t = setTimeout(() => setInitiallyDismissed(true), 0);
        return () => clearTimeout(t);
      }
    }
  }, []);

  if (isInstalled || !showPrompt || initiallyDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-indigo-200 dark:border-indigo-800 overflow-hidden">
          {/* الرأس */}
          <div className="bg-gradient-to-l from-indigo-600 to-purple-600 p-4 text-white relative">
            <button
              onClick={handleDismiss}
              className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                {deviceType === "mobile" ? (
                  <Smartphone className="w-6 h-6" />
                ) : (
                  <Monitor className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-base">
                  ثبّت التطبيق على جهازك!
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  وصول سريع + يعمل بدون إنترنت
                </p>
              </div>
            </div>
          </div>

          {/* المحتوى */}
          <div className="p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
              ثبّت <span className="font-bold">منصة الفيزياء التفاعلية</span> كتطبيق
              أصلي على جهازك لـ:
            </p>
            <ul className="space-y-1.5 mb-4">
              <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-emerald-500">✓</span>
                وصول سريع بنقرة واحدة من الشاشة الرئيسية
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-emerald-500">✓</span>
                تجربة ملء الشاشة بدون شريط المتصفح
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-emerald-500">✓</span>
                يعمل بشكل أسرع من المتصفح
              </li>
            </ul>

            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                className="flex-1 bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Download className="w-4 h-4 ml-1" />
                تثبيت الآن
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="text-slate-500"
              >
                لاحقًا
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
