"use client";

import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { textToKaTeX } from "@/lib/physics/formula-converter";

/**
 * مكوّن ذكي لعرض النص الرياضي
 * يتعامل مع 3 حالات:
 * 1. نص عربي خالص → نص عادي
 * 2. معادلة رياضية خالصة → KaTeX
 * 3. نص مختلط → فصل وعرض كل جزء بالطريقة المناسبة
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
        <InlineMath math={textToKaTeX(text)} errorColor="#cc0000" />
      </span>
    );
  }

  // حالة 3: نص مختلط (عربي + رياضي) - فصل الأجزاء
  if (hasArabic && (hasMathSymbols || hasLatinMath)) {
    return <MixedText text={text} />;
  }

  // افتراضي: نص عادي
  return <span>{text}</span>;
}

/**
 * يعرض نصًا مختلطًا (عربي + معادلات) بفصل ذكي
 */
function MixedText({ text }: { text: string }) {
  // قسّم النص إلى أجزاء: عربي / معادلة / عربي / معادلة...
  // نطابق:
  // 1. معادلات داخل أقواس: (F = m·a)
  // 2. معادلات تحتوي على = ورموز رياضية
  // 3. رموز رياضية مع وحدات: 9.8 m/s²
  // 4. تعابير بسيطة: = 1.25 m/s²
  // 5. معادلات برنولي: P + ½ρv² = ثابت

  // النمط يطابق معادلات تبدأ بحرف لاتيني أو يوناني وتحتوي على = أو · أو /
  // تتوقف عند الحرف العربي (الكلمات العربية في _{} تمت معالجتها مسبقًا بواسطة textToKaTeX)
  const pattern = /(\([^)]*[=+\-·/√^²³⁴⁵ΔμρλωθπΣ×½][^)]*\)|[A-Za-z½ΔμρλωθπΣμθω][A-Za-z0-9_\^·×÷±≈≠≤≥=+\-/\s²³⁴⁵⁰¹²³⁴⁵⁶⁷⁸⁹√ΔμρλωθπΣ→.()½ρλ]*[A-Za-z0-9²³⁴⁵)\]]|[A-Za-z½μρλθωΣΔ]\s*[=+]\s*[A-Za-z½ρλμθωF][^.\u0600-\u06FF]*|\d+\.?\d*\s*[mkgNJPaHzW][/^²³⁴⁵·\d]*\d?)/g;

  const parts: Array<{ type: "text" | "math"; content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // أضف النص العربي قبل المطابقة
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    // أضف المعادلة
    parts.push({ type: "math", content: match[0].trim() });
    lastIndex = match.index + match[0].length;
  }
  // أضف بقية النص
  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  // إذا لم نجد أي تقسيم، اعرض النص كاملًا
  if (parts.length === 0) {
    return <span dir="rtl">{text}</span>;
  }

  return (
    <span dir="rtl" className="inline-flex items-center gap-1 flex-wrap">
      {parts.map((part, i) => {
        if (part.type === "math") {
          return (
            <span key={i} dir="ltr" className="inline-block">
              <InlineMath math={textToKaTeX(part.content)} errorColor="#cc0000" />
            </span>
          );
        }
        return <span key={i}>{part.content}</span>;
      })}
    </span>
  );
}
