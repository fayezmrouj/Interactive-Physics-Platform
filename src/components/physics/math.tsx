"use client";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { textToKaTeX } from "@/lib/physics/formula-converter";

type Props = {
  math: string;
  block?: boolean;
};

/**
 * مكوّن Math لعرض المعادلات الرياضية باستخدام KaTeX
 * يقبل الصيغة النصية البسيطة ويحوّلها تلقائيًا
 */
export function Math({ math, block = false }: Props) {
  // حوّل الصيغة النصية إلى KaTeX
  const katexString = textToKaTeX(math);

  if (block) {
    return (
      <div dir="ltr" className="my-2 overflow-x-auto">
        <BlockMath math={katexString} errorColor="#cc0000" />
      </div>
    );
  }
  return (
    <span dir="ltr" className="inline-block align-middle">
      <InlineMath math={katexString} errorColor="#cc0000" />
    </span>
  );
}

/**
 * يعرض معادلة كاملة بصيغة KaTeX (block)
 * يستخدم في عرض القوانين والأمثلة
 */
export function FormulaDisplay({ formula }: { formula: string }) {
  return <Math math={formula} block />;
}
