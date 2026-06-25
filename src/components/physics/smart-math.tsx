"use client";

import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { textToKaTeX } from "@/lib/physics/formula-converter";

/**
 * مكوّن ذكي لعرض النص الرياضي
 * 1. نص عربي خالص → نص عادي
 * 2. معادلة خالصة → KaTeX inline-block مع displaystyle (لا يُكسر)
 * 3. نص مختلط → المعادلة في سطر منفصل تحت النص العربي
 */
export function SmartMath({ text }: { text: string }) {
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const hasLatinOrGreek = /[A-Za-z\u00bd\u03bc\u03c1\u03bb\u03b8\u03c9\u03a3\u0394\u03b1\u03b2\u03b3\u03c0]/.test(text);
  const hasMathSymbols = /[+\-\u00b7/\u221a^\u00b2\u00b3\u2074\u2075\u207b\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089\u0394\u03bc\u03c1\u03bb\u03c9\u03b8\u03c0\u03a3\u221d\u2245\u2248\u2260\u2264\u2265\u00b1\u2192\u00d7]/.test(text);
  const hasLatinMath = /[A-Za-z].*[/_^\u00b2\u00b3]|\u221a|\u00b7|\u00d7/.test(text);
  // `=` وحدها مع عربية = "يساوي" عربية، ليست معادلة
  const hasOnlyEqualsAndArabic = hasArabic && /[=]/.test(text) && !hasLatinOrGreek && !hasMathSymbols && !hasLatinMath;

  // حالة 1: نص عربي خالص (أو عربي مع = فقط = "يساوي")
  if (hasArabic && !hasMathSymbols && !hasLatinMath && !hasOnlyEqualsAndArabic) {
    return <span dir="rtl">{text}</span>;
  }
  if (hasOnlyEqualsAndArabic) {
    return <span dir="rtl">{text}</span>;
  }

  // حالة 2: معادلة خالصة بدون عربية
  // نستخدم InlineMath مع displaystyle داخل inline-block لمنع الكسر
  if (!hasArabic && (hasMathSymbols || /[=]/.test(text) || hasLatinMath || /^[A-Za-z](_|\^)/.test(text))) {
    const katexStr = "\\displaystyle " + textToKaTeX(text);
    return (
      <div
        dir="ltr"
        className="my-2 text-center w-full overflow-x-auto"
        style={{ whiteSpace: "nowrap" }}
      >
        <span className="inline-block align-middle">
          <InlineMath math={katexStr} errorColor="#cc0000" />
        </span>
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
 * المعادلات تُعرض في سطور منفصلة بـ KaTeX (InlineMath مع displaystyle لمنع الكسر)
 */
function MixedText({ text }: { text: string }) {
  // نهج أبسط: قسّم عند ":" إذا وُجد
  const colonIdx = text.indexOf(":");
  if (colonIdx >= 0) {
    const beforeColon = text.slice(0, colonIdx + 1).trim();
    const afterColon = text.slice(colonIdx + 1).trim();

    // إذا ما بعد النقطتين يحتوي على معادلة
    if (/[A-Za-z\u00bd\u03bc\u03c1\u03bb\u03b8\u03c9\u03a3\u0394=\u00b7/\u00b7\u00d7\^\u00b2\u00b3]/.test(afterColon)) {
      const katexStr = "\\displaystyle " + textToKaTeX(afterColon);
      return (
        <span dir="rtl" className="inline">
          <span>{beforeColon} </span>
          <span
            dir="ltr"
            className="block my-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-center overflow-x-auto"
            style={{ whiteSpace: "nowrap" }}
          >
            <span className="inline-block align-middle">
              <InlineMath math={katexStr} errorColor="#cc0000" />
            </span>
          </span>
        </span>
      );
    }
  }

  // نهج بديل: ابحث عن معادلات باستخدام regex بسيط
  const formulaMatch = text.match(/([A-Za-z\u00bd\u03bc\u03c1\u03bb\u03b8\u03c9\u03a3\u0394][A-Za-z0-9_\^\u00b7\u00d7\u00f7\u00b1\u2248\u2260\u2264\u2265=+\-/\s\u00b2\u00b3\u2074\u2075\u2070\u00b9\u00b2\u00b3\u2076\u2077\u2078\u2079\u221a\u0394\u03bc\u03c1\u03bb\u03c9\u03b8\u03c0\u03a3\u2192.()\u00bd\u03c1\u03bb]{2,})/);

  if (formulaMatch && formulaMatch.index !== undefined) {
    const before = text.slice(0, formulaMatch.index).trim();
    const formula = formulaMatch[0].trim();
    const after = text.slice(formulaMatch.index + formulaMatch[0].length).trim();

    const katexStr = "\\displaystyle " + textToKaTeX(formula);
    return (
      <span dir="rtl" className="inline">
        {before && <span>{before} </span>}
        <span
          dir="ltr"
          className="block my-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-center overflow-x-auto"
          style={{ whiteSpace: "nowrap" }}
        >
          <span className="inline-block align-middle">
            <InlineMath math={katexStr} errorColor="#cc0000" />
          </span>
        </span>
        {after && <span> {after}</span>}
      </span>
    );
  }

  // افتراضي: نص عادي
  return <span dir="rtl">{text}</span>;
}
