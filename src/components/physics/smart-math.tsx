"use client";

import { Math } from "./math";

/**
 * مكوّن ذكي لعرض النص الرياضي
 * يتعامل مع 3 حالات:
 * 1. نص عربي خالص (نيوتن، كيلوغرام) → نص عادي
 * 2. معادلة رياضية خالصة (F_N, m/s²) → KaTeX
 * 3. نص مختلط (نيوتن (N), kg·m/s²) → فصل وعرض كل جزء بالطريقة المناسبة
 */
export function SmartMath({ text }: { text: string }) {
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const hasMathSymbols = /[=+\-·/√^²³⁴⁵⁻¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉ΔμρλωθπΣ∝≅≈≠≤≥±→×]/.test(text);
  const hasLatinMath = /[A-Za-z].*[/_^²³]|√|·|×/.test(text);

  // حالة 1: نص عربي خالص بدون رموز رياضية
  if (hasArabic && !hasMathSymbols && !hasLatinMath) {
    return <span dir="rtl">{text}</span>;
  }

  // حالة 2: معادلة خالصة بدون عربية
  if (!hasArabic && (hasMathSymbols || hasLatinMath || /^[A-Za-z](_|\^)/.test(text))) {
    return (
      <span dir="ltr">
        <Math math={text} />
      </span>
    );
  }

  // حالة 3: نص مختلط (عربي + رياضي) - فصل الأجزاء
  if (hasArabic && (hasMathSymbols || hasLatinMath)) {
    const parts = text
      .split(/(\([^)]*\)|[A-Za-z][A-Za-z0-9/^²³·×\s]*[A-Za-z0-9²³])/g)
      .filter(Boolean);

    return (
      <span dir="rtl" className="inline-flex items-center gap-1 flex-wrap">
        {parts.map((part, i) => {
          const partArabic = /[\u0600-\u06FF]/.test(part);
          const partMath = /[A-Za-z]/.test(part) && !partArabic;
          if (partMath) {
            return (
              <span key={i} dir="ltr">
                <Math math={part.trim()} />
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  }

  // افتراضي: نص عادي
  return <span>{text}</span>;
}
