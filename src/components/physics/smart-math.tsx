"use client";

import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { textToKaTeX } from "@/lib/physics/formula-converter";

/**
 * مكوّن ذكي لعرض النص الرياضي
 * 1. نص عربي خالص → نص عادي
 * 2. معادلة خالصة → KaTeX (display mode لسطر كامل)
 * 3. نص مختلط → المعادلة في سطر منفصل تحت النص العربي
 */
export function SmartMath({ text }: { text: string }) {
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const hasLatinOrGreek = /[A-Za-z½μρλθωΣΔαβγπ]/.test(text);
  const hasMathSymbols = /[+\-·/√^²³⁴⁵⁻¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉ΔμρλωθπΣ∝≅≈≠≤≥±→×]/.test(text);
  const hasLatinMath = /[A-Za-z].*[/_^²³]|√|·|×/.test(text);
  // `=` وحدها مع عربية = "يساوي" عربية، ليست معادلة
  const hasOnlyEqualsAndArabic = hasArabic && /[=]/.test(text) && !hasLatinOrGreek && !hasMathSymbols && !hasLatinMath;

  // حالة 1: نص عربي خالص (أو عربي مع = فقط = "يساوي")
  if (hasArabic && !hasMathSymbols && !hasLatinMath && !hasOnlyEqualsAndArabic) {
    return <span dir="rtl">{text}</span>;
  }
  if (hasOnlyEqualsAndArabic) {
    return <span dir="rtl">{text}</span>;
  }

  // حالة 2: معادلة خالصة بدون عربية - عرض display لسطر كامل
  if (!hasArabic && (hasMathSymbols || /[=]/.test(text) || hasLatinMath || /^[A-Za-z](_|\^)/.test(text))) {
    return (
      <div
        dir="ltr"
        className="my-2 flex justify-center items-center overflow-x-auto"
        style={{ whiteSpace: "nowrap" }}
      >
        <BlockMath math={textToKaTeX(text)} errorColor="#cc0000" />
      </div>
    );
  }

  // حالة 3: نص مختلط - فصل المعادلات في سطور منفصلة
  // لكن فقط إذا كان هناك حروف لاتينية/يونانية (معادلة حقيقية)
  if (hasArabic && hasLatinOrGreek && (hasMathSymbols || /[=]/.test(text) || hasLatinMath)) {
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
    if (/[A-Za-z\u00bd\u03bc\u03c1\u03bb\u03b8\u03c9\u03a3\u0394=\u00b7/\u00b7\u00d7\^\u00b2\u00b3]/.test(afterColon)) {
      return (
        <span dir="rtl" className="inline">
          <span>{beforeColon} </span>
          <span
            dir="ltr"
            className="block my-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-center items-center overflow-x-auto"
            style={{ whiteSpace: "nowrap" }}
          >
            <BlockMath math={textToKaTeX(afterColon)} errorColor="#cc0000" />
          </span>
        </span>
      );
    }
  }

  // نهج بديل: ابحث عن معادلات باستخدام regex بسيط
  // يطابق: حرف لاتيني/يوناني متبوع بـ = أو · أو / أو ≤ ويأخذ كل ما بعده
  // حتى نهاية النص أو حرف عربي (ليس داخل _{})
  const formulaMatch = text.match(/([A-Za-z\u00bd\u03bc\u03c1\u03bb\u03b8\u03c9\u03a3\u0394][A-Za-z0-9_\^\u00b7\u00d7\u00f7\u00b1\u2248\u2260\u2264\u2265=+\-/\s\u00b2\u00b3\u2074\u2075\u2070\u00b9\u00b2\u00b3\u2076\u2077\u2078\u2079\u221a\u0394\u03bc\u03c1\u03bb\u03c9\u03b8\u03c0\u03a3\u2192.()\u00bd\u03c1\u03bb]{2,})/);

  if (formulaMatch && formulaMatch.index !== undefined) {
    const before = text.slice(0, formulaMatch.index).trim();
    const formula = formulaMatch[0].trim();
    const after = text.slice(formulaMatch.index + formulaMatch[0].length).trim();

    return (
      <span dir="rtl" className="inline">
        {before && <span>{before} </span>}
        <span
          dir="ltr"
          className="block my-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-center items-center overflow-x-auto"
          style={{ whiteSpace: "nowrap" }}
        >
          <BlockMath math={textToKaTeX(formula)} errorColor="#cc0000" />
        </span>
        {after && <span> {after}</span>}
      </span>
    );
  }

  // افتراضي: نص عادي
  return <span dir="rtl">{text}</span>;
}
