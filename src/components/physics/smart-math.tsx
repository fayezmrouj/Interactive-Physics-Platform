"use client";

import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { textToKaTeX } from "@/lib/physics/formula-converter";

/**
 * مكوّن ذكي لعرض النص الرياضي
 * يتعامل مع 3 حالات:
 * 1. نص عربي خالص → نص عادي
 * 2. معادلة رياضية خالصة → KaTeX
 * 3. نص مختلط → فصل المعادلات في سطور منفصلة
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

  // حالة 3: نص مختلط (عربي + رياضي) - فصل المعادلات في سطور منفصلة
  if (hasArabic && (hasMathSymbols || hasLatinMath)) {
    return <MixedText text={text} />;
  }

  // افتراضي: نص عادي
  return <span>{text}</span>;
}

/**
 * يعرض نصًا مختلطًا (عربي + معادلات) بفصل ذكي
 * المعادلات تُعرض في سطور منفصلة بـ KaTeX
 * النص العربي يُعرض كنص عادي
 */
function MixedText({ text }: { text: string }) {
  // قسّم النص إلى أجزاء: عربي / معادلة / عربي / معادلة...
  // نطابق معادلات تبدأ بحرف لاتيني أو يوناني وتحتوي على = أو · أو / أو ≤
  const pattern = /(\([^)]*[=+\-·/√^²³⁴⁵ΔμρλωθπΣ×½][^)]*\)|[A-Za-z½ΔμρλωθπΣμθω][A-Za-z0-9_\^·×÷±≈≠≤≥=+\-/\s²³⁴⁵⁰¹²³⁴⁵⁶⁷⁸⁹√ΔμρλωθπΣ→.()½ρλ]*[A-Za-z0-9²³⁴⁵)\]]|[A-Za-z½μρλθωΣΔ]\s*[=+≤≥]\s*[A-Za-z½ρλμθωF][^.\u0600-\u06FF,]*|\d+\.?\d*\s*[mkgNJPaHzW][/^²³⁴⁵·\d]*\d?)/g;

  const parts: Array<{ type: "text" | "math"; content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: "math", content: match[0].trim() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  if (parts.length === 0) {
    return <span dir="rtl">{text}</span>;
  }

  // اعرض الأجزاء: النص العربي في نفس السطر، المعادلة في سطر منفصل
  return (
    <span dir="rtl" className="inline">
      {parts.map((part, i) => {
        if (part.type === "math") {
          // المعادلة في سطر منفصل
          return (
            <span key={i} dir="ltr" className="block my-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
              <InlineMath math={textToKaTeX(part.content)} errorColor="#cc0000" />
            </span>
          );
        }
        // النص العربي عادي
        return <span key={i}>{part.content}</span>;
      })}
    </span>
  );
}
