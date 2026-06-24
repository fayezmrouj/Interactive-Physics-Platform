"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/lib/use-progress";

/**
 * يُستخدم داخل صفحة الدرس لتتبع الوقت الفعلي الذي يقضيه الطالب في الدرس.
 * يجمع الثواني ويضيفها للتخزين كل 10 ثوانٍ، ثم عند مغادرة الصفحة.
 */
export function TimeTracker({ lessonId }: { lessonId: string }) {
  const { addLessonTime } = useProgress();
  const accumRef = useRef(0); // ثوانٍ غير مُسجّلة بعد
  const lastTickRef = useRef<number>(Date.now());
  const lessonIdRef = useRef(lessonId);
  lessonIdRef.current = lessonId;

  useEffect(() => {
    lastTickRef.current = Date.now();
    accumRef.current = 0;

    // مؤقت كل 10 ثوانٍ لتسجيل الوقت المتراكم
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000; // ثوانٍ
      lastTickRef.current = now;
      if (delta > 0 && delta < 60) {
        // تجاهل القفزات الكبيرة (مثل توقف التبويب في الخلفية)
        accumRef.current += delta;
        if (accumRef.current >= 10) {
          const toAdd = Math.floor(accumRef.current);
          accumRef.current -= toAdd;
          addLessonTime(lessonIdRef.current, toAdd);
        }
      }
    }, 10000);

    // عند إخفاء الصفحة (تبديل التبويب أو تصغير النافذة) سجّل الوقت المتراكم
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const now = Date.now();
        const delta = (now - lastTickRef.current) / 1000;
        lastTickRef.current = now;
        if (delta > 0 && delta < 300) {
          // لا تسجّل أكثر من 5 دقائق كقطعة واحدة
          accumRef.current += delta;
        }
        const toAdd = Math.floor(accumRef.current);
        if (toAdd > 0) {
          accumRef.current = 0;
          addLessonTime(lessonIdRef.current, toAdd);
        }
      } else {
        lastTickRef.current = Date.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // قبل مغادرة الصفحة، سجّل الوقت المتراكم
    const handleBeforeUnload = () => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      if (delta > 0 && delta < 3600) {
        accumRef.current += delta;
      }
      const toAdd = Math.floor(accumRef.current);
      if (toAdd > 0) {
        accumRef.current = 0;
        addLessonTime(lessonIdRef.current, toAdd);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // عند إزالة المكون (التنقل لدرس آخر)، سجّل الوقت المتبقي
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      if (delta > 0 && delta < 3600) {
        accumRef.current += delta;
      }
      const toAdd = Math.floor(accumRef.current);
      if (toAdd > 0) {
        addLessonTime(lessonIdRef.current, toAdd);
      }
      accumRef.current = 0;

      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [lessonId, addLessonTime]);

  // مكوّن صامت لا يعرض شيئًا
  return null;
}
