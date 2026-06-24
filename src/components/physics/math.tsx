"use client";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

type Props = {
  math: string;
  block?: boolean;
};

export function Math({ math, block = false }: Props) {
  // KaTeX يتطلب LTR للعرض الصحيح
  if (block) {
    return (
      <div dir="ltr" className="my-2 overflow-x-auto">
        <BlockMath math={math} />
      </div>
    );
  }
  return (
    <span dir="ltr" className="inline-block align-middle">
      <InlineMath math={math} />
    </span>
  );
}

// تحويل صيغة نصية بسيطة إلى KaTeX
// مثال: "F = m \\cdot a" -> يعرض كمعادلة
// مثال: "v = \\frac{\\Delta x}{\\Delta t}" -> يعرض ككسر
export function MathText({ text }: { text: string }) {
  return <Math math={text} />;
}
