"use client";

import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { textToKaTeX } from "@/lib/physics/formula-converter";

/**
 * مكوّن ذكي لعرض النص الرياضي
 * 1. نص عربي خالص → نص عادي
 * 2. معادلة خالصة → KaTeX
 * 3. نص مختلط → المعادلة في سطر منفصل تحت النص العربي
 */
export function SmartMath({ text }: { text: string }) {
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const hasMathSymbols = /[=+\-·/√^²³⁴⁵⁻¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉ΔμρλωθπΣ∝≅≈≠≤≥±→×]/.test(text);
  const hasLatinMath = /[A-Za-z].*[/_^²³]|√|·|×/.test(text);

  // حالة 1: نص عربي خالص
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

  // حالة 3: نص مختلط - فصل المعادلات في سطور منفصلة
  if (hasArabic && (hasMathSymbols || hasLatinMath)) {
    return <MixedText text={text} />;
  }

  return <span>{text}</span>;
}

/**
 * يقسم النص المختلط إلى أجزاء عربية ومعادلات
 * المعادلات تُعرض في سطور منفصلة بـ KaTeX
 */
function MixedText({ text }: { text: string }) {
  // استراتيجية: ابحث عن المعادلات باستخدام علامات واضحة
  // المعادلة تبدأ عادةً بعد ":" أو في بداية النص
  // وتنتهي عند عربية جديدة أو نهاية النص

  // ابحث عن مواضع المعادلات: تبدأ بحرف لاتيني/يوناني وتحتوي على = أو · أو / أو ≤
  // لكن لا تلتقط الأحرف العربية (إلا في _{} بعد المعالجة)

  // نهج أبسط: قسّم عند ":" إذا وُجد
  const colonIdx = text.indexOf(":");
  if (colonIdx >= 0) {
    const beforeColon = text.slice(0, colonIdx + 1).trim();
    const afterColon = text.slice(colonIdx + 1).trim();

    // إذا ما بعد النقطتين يحتوي على معادلة
    if (/[A-Za-z½μρλθωΣΔ=·/·×^²]/.test(afterColon)) {
      return (
        <span dir="rtl" className="inline">
          <span>{beforeColon} </span>
          <span dir="ltr" className="block my-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
            <InlineMath math={textToKaTeX(afterColon)} errorColor="#cc0000" />
          </span>
        </span>
      );
    }
  }

  // نهج بديل: ابحث عن معادلات باستخدام regex بسيط
  // يطابق: حرف لاتيني/يوناني متبوع بـ = أو · أو / أو ≤ ويأخذ كل ما بعده
  // حتى نهاية النص أو حرف عربي (ليس داخل _{})
  const formulaMatch = text.match(/([A-Za-z½μρλθωΣΔ][A-Za-z0-9_\^·×÷±≈≠≤≥=+\-/\s²³⁴⁵⁰¹²³⁴⁵⁶⁷⁸⁹√ΔμρλωθπΣ→.()½ρλ]{2,})/);

  if (formulaMatch && formulaMatch.index !== undefined) {
    const before = text.slice(0, formulaMatch.index).trim();
    const formula = formulaMatch[0].trim();
    const after = text.slice(formulaMatch.index + formulaMatch[0].length).trim();

    return (
      <span dir="rtl" className="inline">
        {before && <span>{before} </span>}
        <span dir="ltr" className="block my-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
          <InlineMath math={textToKaTeX(formula)} errorColor="#cc0000" />
        </span>
        {after && <span> {after}</span>}
      </span>
    );
  }

  // افتراضي: نص عادي
  return <span dir="rtl">{text}</span>;
}
