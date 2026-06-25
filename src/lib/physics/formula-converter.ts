// دالة تحويل صيغ المعادلات النصية إلى KaTeX

/**
 * يحوّل صيغة نصية بسيطة إلى صيغة KaTeX قابلة للعرض
 */
export function textToKaTeX(text: string): string {
  let result = text;

  // 0. معالجة الحدود السفلية Unicode (₁, ₂, ₀, ...)
  result = result
    .replace(/₀/g, "_{0}")
    .replace(/₁/g, "_{1}")
    .replace(/₂/g, "_{2}")
    .replace(/₃/g, "_{3}")
    .replace(/₄/g, "_{4}")
    .replace(/₅/g, "_{5}")
    .replace(/₆/g, "_{6}")
    .replace(/₇/g, "_{7}")
    .replace(/₈/g, "_{8}")
    .replace(/₉/g, "_{9}");

  // 1. الرموز اليونانية مع الحدود السفلية (معالجة قبل الانفصال)
  // مثال: μ_k → \mu_{k}, θ_c → \theta_{c}
  result = result
    .replace(/μ_([A-Za-z0-9]+)/g, "\\mu_{$1}")
    .replace(/θ_([A-Za-z0-9]+)/g, "\\theta_{$1}")
    .replace(/ρ_([A-Za-z0-9]+)/g, "\\rho_{$1}")
    .replace(/λ_([A-Za-z0-9]+)/g, "\\lambda_{$1}")
    .replace(/ω_([A-Za-z0-9]+)/g, "\\omega_{$1}")
    .replace(/α_([A-Za-z0-9]+)/g, "\\alpha_{$1}")
    .replace(/β_([A-Za-z0-9]+)/g, "\\beta_{$1}")
    .replace(/γ_([A-Za-z0-9]+)/g, "\\gamma_{$1}")
    .replace(/Δ_([A-Za-z0-9]+)/g, "\\Delta_{$1}")
    .replace(/Σ_([A-Za-z0-9]+)/g, "\\Sigma_{$1}");

  // 1b. الرموز اليونانية المتبقية (بدون حدود سفلية)
  // لكن أولاً عالج الرموز اليونانية متبوعة بـ _{ (من تحويل Unicode subscripts)
  result = result
    .replace(/Δ_\{/g, "\\Delta_{")
    .replace(/μ_\{/g, "\\mu_{")
    .replace(/ρ_\{/g, "\\rho_{")
    .replace(/λ_\{/g, "\\lambda_{")
    .replace(/θ_\{/g, "\\theta_{")
    .replace(/ω_\{/g, "\\omega_{")
    .replace(/π_\{/g, "\\pi_{")
    .replace(/Σ_\{/g, "\\Sigma_{")
    .replace(/α_\{/g, "\\alpha_{")
    .replace(/β_\{/g, "\\beta_{")
    .replace(/γ_\{/g, "\\gamma_{");

  // 1c. الرموز اليونانية المتبقية (بدون أي حدود)
  result = result
    .replace(/Δ/g, "\\Delta ")
    .replace(/μ/g, "\\mu ")
    .replace(/ρ/g, "\\rho ")
    .replace(/λ/g, "\\lambda ")
    .replace(/θ/g, "\\theta ")
    .replace(/ω/g, "\\omega ")
    .replace(/π/g, "\\pi ")
    .replace(/Σ/g, "\\Sigma ")
    .replace(/α/g, "\\alpha ")
    .replace(/β/g, "\\beta ")
    .replace(/γ/g, "\\gamma ");

  // 2. الأسس (superscripts) Unicode
  result = result
    .replace(/²/g, "^{2}")
    .replace(/³/g, "^{3}")
    .replace(/⁴/g, "^{4}")
    .replace(/⁵/g, "^{5}")
    .replace(/⁻¹/g, "^{-1}")
    .replace(/⁻²/g, "^{-2}")
    .replace(/⁻³/g, "^{-3}")
    .replace(/⁻⁶/g, "^{-6}")
    .replace(/⁻⁹/g, "^{-9}")
    .replace(/⁻¹²/g, "^{-12}")
    .replace(/⁻¹⁵/g, "^{-15}")
    .replace(/¹⁰/g, "^{10}")
    .replace(/¹⁴/g, "^{14}")
    .replace(/²⁴/g, "^{24}");

  // 3. الحدود السفلية (subscripts) - v_f → v_{f}, F_N → F_{N}
  // نطابق الحرف اللاتيني متبوعًا بـ _ ثم أحرف لاتينية أو أرقام
  result = result.replace(
    /([A-Za-z])_([A-Za-z0-9]+)/g,
    "$1_{$2}"
  );
  // معالجة الكلمات العربية بعد _
  result = result.replace(
    /([A-Za-z])_(محصلة|حقيقية|مقاسة|مائع|مغمور|الجسم|المائع|صعود|fall|H|الشد|السحب|الشدّ|نت|محصلة|صافي|متوسط|ابتدائي|نهائي)/g,
    "$1_{\\text{$2}}"
  );

  // 4. ضرب النقطة والضرب العام
  result = result.replace(/·/g, " \\cdot ");
  result = result.replace(/×/g, " \\times ");

  // 5. نصف
  result = result.replace(/½/g, "\\frac{1}{2}");

  // 6. الجذر التربيعي
  result = result.replace(/√\(([^)]+)\)/g, "\\sqrt{$1}");

  // 7. المتجهات (السهم)
  result = result.replace(/→/g, "\\vec{}");
  result = result.replace(/\\vec\{\}([A-Za-z])/g, "\\vec{$1}");

  // 8. الرموز الخاصة
  result = result.replace(/±/g, "\\pm ");
  result = result.replace(/≈/g, "\\approx ");
  result = result.replace(/≠/g, "\\neq ");
  result = result.replace(/≤/g, "\\leq ");
  result = result.replace(/≥/g, "\\geq ");
  result = result.replace(/≅/g, "\\cong ");
  result = result.replace(/∝/g, "\\propto ");
  result = result.replace(/∞/g, "\\infty ");

  // 9. sin, cos, tan (وعكساتها)
  result = result.replace(/\bsin\b/g, "\\sin ");
  result = result.replace(/\bcos\b/g, "\\cos ");
  result = result.replace(/\btan\b/g, "\\tan ");
  result = result.replace(/\barcsin\b/g, "\\arcsin ");
  result = result.replace(/\barccos\b/g, "\\arccos ");
  result = result.replace(/\barctan\b/g, "\\arctan ");

  // 10. تحويل الكسور - الخطوة الأصعب
  // نريد: "A / B" → "\frac{A}{B}"
  // لكن يجب الحذر مع المسافات والأقواس

  // أولاً: معالجة (X) / Y و X / (Y)
  // نكرر العملية عدة مرات لأن بعض الكسور متداخلة
  for (let i = 0; i < 3; i++) {
    // (X) / Y → \frac{X}{Y}
    result = result.replace(
      /\(([^()]+)\)\s*\/\s*([^()\s/+·\\]+)/g,
      "\\frac{$1}{$2}"
    );
    // X / (Y) → \frac{X}{Y}
    result = result.replace(
      /([^()\s/+·\\]+)\s*\/\s*\(([^()]+)\)/g,
      "\\frac{$1}{$2}"
    );
    // X / Y (بدون أقواس) → \frac{X}{Y}
    // نطابق: حد بسيط (أحرف وأرقام ورموز بدون مسافات) / حد بسيط
    // مثال: "v = Δx / Δt" → "v = \frac{Δx}{Δt}" (لكن Δx يحتوي مسافة بعد Δ)
    // لذلك نطابق: أحرف يونانية + أحرف لاتينية + أرقام + _ { } ^ بدون مسافات وبدون /
    result = result.replace(
      /(\\[A-Za-z]+\s?[A-Za-z]?[A-Za-z0-9_^{}\\]*|[A-Za-z][A-Za-z0-9_^{}]*)\s*\/\s*(\\[A-Za-z]+\s?[A-Za-z]?[A-Za-z0-9_^{}\\]*|[A-Za-z][A-Za-z0-9_^{}]*)/g,
      "\\frac{$1}{$2}"
    );
  }

  // 11. الوحدات (نص عادي)
  result = result.replace(
    /(m\/s[^²³]*|m²|m³|kg|N\)|J\)|Pa\)|Hz|W\)|kg\.m\/s²|kg\.m²\/s²)/g,
    "\\text{$1}"
  );

  // 12. تنسيق النص العربي
  result = result.replace(/الخطأ %/g, "\\text{الخطأ \\%}");

  // 13. تنظيف المسافات الزائدة
  result = result
    .replace(/\s+/g, " ")
    .replace(/\s+}/g, "}")
    .replace(/{\s+/g, "{")
    .replace(/\s+\)/g, ")")
    .replace(/\(\s+/g, "(")
    .trim();

  // 14. إصلاح: \frac{x}{\Delta} t → \frac{x}{\Delta t}
  // هذه حالة خاصة عندما يكون هناك حرف يوناني متبوع بحرف لاتيني
  result = result.replace(
    /\\frac\{([^}]+)\}\{\\([A-Za-z]+)\s?\}\s([A-Za-z])/g,
    "\\frac{$1}{\\$2 $3}"
  );

  return result;
}

/**
 * يعرض معادلة كاملة بصيغة KaTeX
 */
export function renderFormula(text: string): string {
  return textToKaTeX(text);
}
