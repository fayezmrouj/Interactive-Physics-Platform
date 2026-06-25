"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, RotateCcw, Lightbulb } from "lucide-react";
import { Math } from "./math";

// تعريف القوانين القابلة للحساب
type SolverField = {
  symbol: string;
  label: string;
  unit?: string;
};

type SolverFormula = {
  id: string;
  name: string;
  category: string;
  expression: string;
  fields: SolverField[];
  // يحل المجهول: اسم الحقل المجهول + دالة تحسبه من البقية
  // ندخل قيمًا لكل الحقول ما عدا واحد، فيحسب المجهول
  solve: (vals: Record<string, number>, unknown: string) => number | null;
  steps: (vals: Record<string, number>, unknown: string, result: number) => string[];
};

const SOLVERS: SolverFormula[] = [
  // الحركة
  {
    id: "v",
    name: "السرعة",
    category: "الحركة",
    expression: "v = Δx / Δt",
    fields: [
      { symbol: "v", label: "السرعة", unit: "m/s" },
      { symbol: "x", label: "الإزاحة", unit: "m" },
      { symbol: "t", label: "الزمن", unit: "s" },
    ],
    solve: (v, u) => {
      if (u === "v") return v.x && v.t ? v.x / v.t : null;
      if (u === "x") return v.v && v.t ? v.v * v.t : null;
      if (u === "t") return v.v && v.x ? v.x / v.v : null;
      return null;
    },
    steps: (v, u, r) => {
      if (u === "v") return [`v = Δx / Δt = ${v.x} / ${v.t} = ${r.toFixed(3)} m/s`];
      if (u === "x") return [`Δx = v × Δt = ${v.v} × ${v.t} = ${r.toFixed(3)} m`];
      if (u === "t") return [`Δt = Δx / v = ${v.x} / ${v.v} = ${r.toFixed(3)} s`];
      return [];
    },
  },
  {
    id: "a",
    name: "التسارع",
    category: "الحركة",
    expression: "a = (v_f - v_i) / Δt",
    fields: [
      { symbol: "a", label: "التسارع", unit: "m/s²" },
      { symbol: "vf", label: "السرعة النهائية", unit: "m/s" },
      { symbol: "vi", label: "السرعة الابتدائية", unit: "m/s" },
      { symbol: "t", label: "الزمن", unit: "s" },
    ],
    solve: (v, u) => {
      if (u === "a") return v.t ? (v.vf - v.vi) / v.t : null;
      if (u === "vf") return v.a && v.t ? v.vi + v.a * v.t : null;
      if (u === "vi") return v.a && v.t ? v.vf - v.a * v.t : null;
      if (u === "t") return v.a ? (v.vf - v.vi) / v.a : null;
      return null;
    },
    steps: (v, u, r) => {
      if (u === "a") return [`a = (v_f - v_i) / Δt = (${v.vf} - ${v.vi}) / ${v.t} = ${r.toFixed(3)} m/s²`];
      if (u === "vf") return [`v_f = v_i + a·t = ${v.vi} + ${v.a}×${v.t} = ${r.toFixed(3)} m/s`];
      if (u === "vi") return [`v_i = v_f - a·t = ${v.vf} - ${v.a}×${v.t} = ${r.toFixed(3)} m/s`];
      if (u === "t") return [`Δt = (v_f - v_i) / a = (${v.vf} - ${v.vi}) / ${v.a} = ${r.toFixed(3)} s`];
      return [];
    },
  },
  // القوة
  {
    id: "f",
    name: "قانون نيوتن الثاني",
    category: "القوى",
    expression: "F = m · a",
    fields: [
      { symbol: "F", label: "القوة", unit: "N" },
      { symbol: "m", label: "الكتلة", unit: "kg" },
      { symbol: "a", label: "التسارع", unit: "m/s²" },
    ],
    solve: (v, u) => {
      if (u === "F") return v.m && v.a ? v.m * v.a : null;
      if (u === "m") return v.F && v.a ? v.F / v.a : null;
      if (u === "a") return v.F && v.m ? v.F / v.m : null;
      return null;
    },
    steps: (v, u, r) => {
      if (u === "F") return [`F = m × a = ${v.m} × ${v.a} = ${r.toFixed(3)} N`];
      if (u === "m") return [`m = F / a = ${v.F} / ${v.a} = ${r.toFixed(3)} kg`];
      if (u === "a") return [`a = F / m = ${v.F} / ${v.m} = ${r.toFixed(3)} m/s²`];
      return [];
    },
  },
  {
    id: "weight",
    name: "الوزن",
    category: "القوى",
    expression: "F_g = m · g",
    fields: [
      { symbol: "Fg", label: "الوزن", unit: "N" },
      { symbol: "m", label: "الكتلة", unit: "kg" },
      { symbol: "g", label: "تسارع الجاذبية", unit: "m/s²" },
    ],
    solve: (v, u) => {
      if (u === "Fg") return v.m && v.g ? v.m * v.g : null;
      if (u === "m") return v.Fg && v.g ? v.Fg / v.g : null;
      if (u === "g") return v.Fg && v.m ? v.Fg / v.m : null;
      return null;
    },
    steps: (v, u, r) => {
      if (u === "Fg") return [`F_g = m × g = ${v.m} × ${v.g} = ${r.toFixed(3)} N`];
      if (u === "m") return [`m = F_g / g = ${v.Fg} / ${v.g} = ${r.toFixed(3)} kg`];
      if (u === "g") return [`g = F_g / m = ${v.Fg} / ${v.m} = ${r.toFixed(3)} m/s²`];
      return [];
    },
  },
  // الشغل والقدرة
  {
    id: "work",
    name: "الشغل",
    category: "الطاقة",
    expression: "W = F · d",
    fields: [
      { symbol: "W", label: "الشغل", unit: "J" },
      { symbol: "F", label: "القوة", unit: "N" },
      { symbol: "d", label: "الإزاحة", unit: "m" },
    ],
    solve: (v, u) => {
      if (u === "W") return v.F && v.d ? v.F * v.d : null;
      if (u === "F") return v.W && v.d ? v.W / v.d : null;
      if (u === "d") return v.W && v.F ? v.W / v.F : null;
      return null;
    },
    steps: (v, u, r) => {
      if (u === "W") return [`W = F × d = ${v.F} × ${v.d} = ${r.toFixed(3)} J`];
      if (u === "F") return [`F = W / d = ${v.W} / ${v.d} = ${r.toFixed(3)} N`];
      if (u === "d") return [`d = W / F = ${v.W} / ${v.F} = ${r.toFixed(3)} m`];
      return [];
    },
  },
  {
    id: "power",
    name: "القدرة",
    category: "الطاقة",
    expression: "P = W / t",
    fields: [
      { symbol: "P", label: "القدرة", unit: "W" },
      { symbol: "W", label: "الشغل", unit: "J" },
      { symbol: "t", label: "الزمن", unit: "s" },
    ],
    solve: (v, u) => {
      if (u === "P") return v.W && v.t ? v.W / v.t : null;
      if (u === "W") return v.P && v.t ? v.P * v.t : null;
      if (u === "t") return v.P && v.W ? v.W / v.P : null;
      return null;
    },
    steps: (v, u, r) => {
      if (u === "P") return [`P = W / t = ${v.W} / ${v.t} = ${r.toFixed(3)} W`];
      if (u === "W") return [`W = P × t = ${v.P} × ${v.t} = ${r.toFixed(3)} J`];
      if (u === "t") return [`t = W / P = ${v.W} / ${v.P} = ${r.toFixed(3)} s`];
      return [];
    },
  },
  {
    id: "ke",
    name: "الطاقة الحركية",
    category: "الطاقة",
    expression: "K = ½ · m · v²",
    fields: [
      { symbol: "K", label: "الطاقة الحركية", unit: "J" },
      { symbol: "m", label: "الكتلة", unit: "kg" },
      { symbol: "v", label: "السرعة", unit: "m/s" },
    ],
    solve: (v, u) => {
      if (u === "K") return v.m && v.v ? 0.5 * v.m * v.v * v.v : null;
      if (u === "m") return v.K && v.v ? (2 * v.K) / (v.v * v.v) : null;
      if (u === "v") return v.K && v.m ? Math.sqrt((2 * v.K) / v.m) : null;
      return null;
    },
    steps: (v, u, r) => {
      if (u === "K") return [`K = ½ × m × v² = 0.5 × ${v.m} × ${v.v}² = ${r.toFixed(3)} J`];
      if (u === "m") return [`m = 2K / v² = 2×${v.K} / ${v.v}² = ${r.toFixed(3)} kg`];
      if (u === "v") return [`v = √(2K / m) = √(2×${v.K} / ${v.m}) = ${r.toFixed(3)} m/s`];
      return [];
    },
  },
  // الموائع
  {
    id: "pressure",
    name: "الضغط",
    category: "الموائع",
    expression: "P = F / A",
    fields: [
      { symbol: "P", label: "الضغط", unit: "Pa" },
      { symbol: "F", label: "القوة", unit: "N" },
      { symbol: "A", label: "المساحة", unit: "m²" },
    ],
    solve: (v, u) => {
      if (u === "P") return v.F && v.A ? v.F / v.A : null;
      if (u === "F") return v.P && v.A ? v.P * v.A : null;
      if (u === "A") return v.P && v.F ? v.F / v.P : null;
      return null;
    },
    steps: (v, u, r) => {
      if (u === "P") return [`P = F / A = ${v.F} / ${v.A} = ${r.toFixed(3)} Pa`];
      if (u === "F") return [`F = P × A = ${v.P} × ${v.A} = ${r.toFixed(3)} N`];
      if (u === "A") return [`A = F / P = ${v.F} / ${v.P} = ${r.toFixed(3)} m²`];
      return [];
    },
  },
  {
    id: "fluid-pressure",
    name: "ضغط عمود مائع",
    category: "الموائع",
    expression: "P = ρ · g · h",
    fields: [
      { symbol: "P", label: "الضغط", unit: "Pa" },
      { symbol: "rho", label: "الكثافة", unit: "kg/m³" },
      { symbol: "g", label: "تسارع الجاذبية", unit: "m/s²" },
      { symbol: "h", label: "العمق", unit: "m" },
    ],
    solve: (v, u) => {
      if (u === "P") return v.rho && v.g && v.h ? v.rho * v.g * v.h : null;
      if (u === "rho") return v.P && v.g && v.h ? v.P / (v.g * v.h) : null;
      if (u === "g") return v.P && v.rho && v.h ? v.P / (v.rho * v.h) : null;
      if (u === "h") return v.P && v.rho && v.g ? v.P / (v.rho * v.g) : null;
      return null;
    },
    steps: (v, u, r) => {
      if (u === "P") return [`P = ρ × g × h = ${v.rho} × ${v.g} × ${v.h} = ${r.toFixed(3)} Pa`];
      if (u === "rho") return [`ρ = P / (g·h) = ${v.P} / (${v.g}×${v.h}) = ${r.toFixed(3)} kg/m³`];
      if (u === "g") return [`g = P / (ρ·h) = ${v.P} / (${v.rho}×${v.h}) = ${r.toFixed(3)} m/s²`];
      if (u === "h") return [`h = P / (ρ·g) = ${v.P} / (${v.rho}×${v.g}) = ${r.toFixed(3)} m`];
      return [];
    },
  },
  {
    id: "buoyancy",
    name: "قوة الدفع (أرخميدس)",
    category: "الموائع",
    expression: "F_B = ρ · g · V",
    fields: [
      { symbol: "FB", label: "قوة الدفع", unit: "N" },
      { symbol: "rho", label: "كثافة المائع", unit: "kg/m³" },
      { symbol: "g", label: "تسارع الجاذبية", unit: "m/s²" },
      { symbol: "V", label: "الحجم المغمور", unit: "m³" },
    ],
    solve: (v, u) => {
      if (u === "FB") return v.rho && v.g && v.V ? v.rho * v.g * v.V : null;
      if (u === "rho") return v.FB && v.g && v.V ? v.FB / (v.g * v.V) : null;
      if (u === "g") return v.FB && v.rho && v.V ? v.FB / (v.rho * v.V) : null;
      if (u === "V") return v.FB && v.rho && v.g ? v.FB / (v.rho * v.g) : null;
      return null;
    },
    steps: (v, u, r) => {
      if (u === "FB") return [`F_B = ρ × g × V = ${v.rho} × ${v.g} × ${v.V} = ${r.toFixed(3)} N`];
      if (u === "rho") return [`ρ = F_B / (g·V) = ${v.FB} / (${v.g}×${v.V}) = ${r.toFixed(3)} kg/m³`];
      if (u === "g") return [`g = F_B / (ρ·V) = ${v.FB} / (${v.rho}×${v.V}) = ${r.toFixed(3)} m/s²`];
      if (u === "V") return [`V = F_B / (ρ·g) = ${v.FB} / (${v.rho}×${v.g}) = ${r.toFixed(3)} m³`];
      return [];
    },
  },
  // الضوء
  {
    id: "snell",
    name: "قانون سنيل (الانكسار)",
    category: "الضوء",
    expression: "n₁ · sin(θ₁) = n₂ · sin(θ₂)",
    fields: [
      { symbol: "n1", label: "معامل الوسط الأول", unit: "" },
      { symbol: "t1", label: "زاوية السقوط (درجة)", unit: "°" },
      { symbol: "n2", label: "معامل الوسط الثاني", unit: "" },
      { symbol: "t2", label: "زاوية الانكسار (درجة)", unit: "°" },
    ],
    solve: (v, u) => {
      const toRad = (d: number) => (d * Math.PI) / 180;
      const toDeg = (r: number) => (r * 180) / Math.PI;
      if (u === "t2" && v.n1 && v.t1 !== undefined && v.n2) {
        const s1 = Math.sin(toRad(v.t1));
        const s2 = (v.n1 * s1) / v.n2;
        if (s2 > 1) return null; // انعكاس كلي
        return toDeg(Math.asin(s2));
      }
      if (u === "t1" && v.n1 && v.t2 !== undefined && v.n2) {
        const s2 = Math.sin(toRad(v.t2));
        const s1 = (v.n2 * s2) / v.n1;
        if (s1 > 1) return null;
        return toDeg(Math.asin(s1));
      }
      if (u === "n1" && v.t1 !== undefined && v.n2 && v.t2 !== undefined) {
        return (v.n2 * Math.sin(toRad(v.t2))) / Math.sin(toRad(v.t1));
      }
      if (u === "n2" && v.n1 && v.t1 !== undefined && v.t2 !== undefined) {
        return (v.n1 * Math.sin(toRad(v.t1))) / Math.sin(toRad(v.t2));
      }
      return null;
    },
    steps: (v, u, r) => {
      if (u === "t2") return [`sin(θ₂) = (n₁·sin(θ₁))/n₂ = (${v.n1}×sin(${v.t1}°))/${v.n2} → θ₂ = ${r.toFixed(3)}°`];
      if (u === "t1") return [`sin(θ₁) = (n₂·sin(θ₂))/n₁ = (${v.n2}×sin(${v.t2}°))/${v.n1} → θ₁ = ${r.toFixed(3)}°`];
      if (u === "n1") return [`n₁ = (n₂·sin(θ₂))/sin(θ₁) = (${v.n2}×sin(${v.t2}°))/sin(${v.t1}°) = ${r.toFixed(3)}`];
      if (u === "n2") return [`n₂ = (n₁·sin(θ₁))/sin(θ₂) = (${v.n1}×sin(${v.t1}°))/sin(${v.t2}°) = ${r.toFixed(3)}`];
      return [];
    },
  },
  // الموجات
  {
    id: "wave",
    name: "سرعة الموجة",
    category: "الموجات",
    expression: "v = λ · f",
    fields: [
      { symbol: "v", label: "سرعة الموجة", unit: "m/s" },
      { symbol: "lambda", label: "الطول الموجي", unit: "m" },
      { symbol: "f", label: "التردد", unit: "Hz" },
    ],
    solve: (v, u) => {
      if (u === "v") return v.lambda && v.f ? v.lambda * v.f : null;
      if (u === "lambda") return v.v && v.f ? v.v / v.f : null;
      if (u === "f") return v.v && v.lambda ? v.v / v.lambda : null;
      return null;
    },
    steps: (v, u, r) => {
      if (u === "v") return [`v = λ × f = ${v.lambda} × ${v.f} = ${r.toFixed(3)} m/s`];
      if (u === "lambda") return [`λ = v / f = ${v.v} / ${v.f} = ${r.toFixed(3)} m`];
      if (u === "f") return [`f = v / λ = ${v.v} / ${v.lambda} = ${r.toFixed(3)} Hz`];
      return [];
    },
  },
  // الحركة الدائرية
  {
    id: "centripetal",
    name: "القوة المركزية",
    category: "الحركة",
    expression: "F_c = m · v² / r",
    fields: [
      { symbol: "Fc", label: "القوة المركزية", unit: "N" },
      { symbol: "m", label: "الكتلة", unit: "kg" },
      { symbol: "v", label: "السرعة", unit: "m/s" },
      { symbol: "r", label: "نصف القطر", unit: "m" },
    ],
    solve: (v, u) => {
      if (u === "Fc") return v.m && v.v !== undefined && v.r ? (v.m * v.v * v.v) / v.r : null;
      if (u === "m") return v.Fc && v.v !== undefined && v.r ? (v.Fc * v.r) / (v.v * v.v) : null;
      if (u === "v") return v.Fc && v.m && v.r ? Math.sqrt((v.Fc * v.r) / v.m) : null;
      if (u === "r") return v.Fc && v.m && v.v !== undefined ? (v.m * v.v * v.v) / v.Fc : null;
      return null;
    },
    steps: (v, u, r) => {
      if (u === "Fc") return [`F_c = m×v²/r = ${v.m}×${v.v}²/${v.r} = ${r.toFixed(3)} N`];
      if (u === "m") return [`m = F_c×r/v² = ${v.Fc}×${v.r}/${v.v}² = ${r.toFixed(3)} kg`];
      if (u === "v") return [`v = √(F_c×r/m) = √(${v.Fc}×${v.r}/${v.m}) = ${r.toFixed(3)} m/s`];
      if (u === "r") return [`r = m×v²/F_c = ${v.m}×${v.v}²/${v.Fc} = ${r.toFixed(3)} m`];
      return [];
    },
  },
];

const CATEGORIES = Array.from(new Set(SOLVERS.map((s) => s.category)));

export function PhysicsCalculator() {
  const [selectedId, setSelectedId] = useState(SOLVERS[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [unknown, setUnknown] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState("");

  const solver = SOLVERS.find((s) => s.id === selectedId)!;

  function handleSolverChange(id: string) {
    setSelectedId(id);
    setValues({});
    setUnknown("");
    setResult(null);
    setSteps([]);
    setError("");
  }

  function handleFieldChange(symbol: string, value: string) {
    setValues((v) => ({ ...v, [symbol]: value }));
    setError("");
  }

  function handleUnknownChange(symbol: string) {
    setUnknown(symbol);
    setResult(null);
    setSteps([]);
    setError("");
  }

  function handleSolve() {
    if (!unknown) {
      setError("اختر المجهول الذي تريد حسابه");
      return;
    }
    const vals: Record<string, number> = {};
    for (const field of solver.fields) {
      if (field.symbol === unknown) continue;
      const raw = values[field.symbol];
      if (raw === undefined || raw === "" || isNaN(Number(raw))) {
        setError(`أدخل قيمة ${field.label}`);
        return;
      }
      vals[field.symbol] = Number(raw);
    }
    const res = solver.solve(vals, unknown);
    if (res === null || isNaN(res)) {
      setError("تعذّر الحساب — تحقق من القيم (قد تكون غير فيزيائية)");
      return;
    }
    setResult(res);
    setSteps(solver.steps(vals, unknown, res));
    setError("");
  }

  function handleReset() {
    setValues({});
    setUnknown("");
    setResult(null);
    setSteps([]);
    setError("");
  }

  const unknownField = solver.fields.find((f) => f.symbol === unknown);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
        <Calculator className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            الحاسبة الفيزيائية
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            اختر قانونًا، أدخل القيم المعروفة، واختر المجهول — سيُحسب تلقائيًا مع شرح الخطوات
          </p>
        </div>
      </div>

      {/* اختيار القانون */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">اختر القانون</Label>
        <Select value={selectedId} onValueChange={handleSolverChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <div className="px-2 py-1 text-xs font-bold text-slate-500">
                  {cat}
                </div>
                {SOLVERS.filter((s) => s.category === cat).map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} ({s.expression})
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* عرض القانون */}
      <Card className="bg-gradient-to-l from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-900">
        <CardContent className="p-4 text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            القانون
          </div>
          <div className="text-lg font-bold text-cyan-900 dark:text-cyan-200">
            <Math math={solver.expression} />
          </div>
        </CardContent>
      </Card>

      {/* الحقول */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          أدخل القيم المعروفة واختر المجهول
        </Label>
        {solver.fields.map((field) => {
          const isUnknown = unknown === field.symbol;
          return (
            <div
              key={field.symbol}
              className={`flex items-center gap-3 p-2 rounded-lg border ${
                isUnknown
                  ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              }`}
            >
              <button
                onClick={() => handleUnknownChange(field.symbol)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isUnknown
                    ? "border-amber-500 bg-amber-500"
                    : "border-slate-300 dark:border-slate-600"
                }`}
                title="تحديد كمجهول"
              >
                {isUnknown && <div className="w-2 h-2 bg-white rounded-full" />}
              </button>
              <Label className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                {field.label}
                {field.unit && (
                  <span className="text-xs text-slate-500 mr-1">
                    ({field.unit})
                  </span>
                )}
                <span className="text-xs text-slate-400 mr-2">
                  {" "}← {field.symbol}
                </span>
              </Label>
              <Input
                type="number"
                step="any"
                value={isUnknown ? "" : values[field.symbol] || ""}
                onChange={(e) => handleFieldChange(field.symbol, e.target.value)}
                disabled={isUnknown}
                placeholder={isUnknown ? "مجهول" : "أدخل القيمة"}
                className="w-32 bg-white dark:bg-slate-800"
              />
            </div>
          );
        })}
      </div>

      {error && (
        <div className="p-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded text-sm text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSolve}
          className="flex-1 bg-gradient-to-l from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
        >
          <Calculator className="w-4 h-4 ml-1" />
          احسب
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="w-4 h-4 ml-1" />
          تصفير
        </Button>
      </div>

      {/* النتيجة */}
      {result !== null && unknownField && (
        <Card className="border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardContent className="p-4 space-y-3">
            <div className="text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                النتيجة
              </div>
              <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {unknownField.label} = {result.toFixed(4)}
                {unknownField.unit && (
                  <span className="text-base font-medium mr-1">
                    {" "}
                    {unknownField.unit}
                  </span>
                )}
              </div>
            </div>
            {steps.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                  <Lightbulb className="w-3 h-3" />
                  خطوات الحل
                </div>
                <ol className="space-y-1">
                  {steps.map((step, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-200">
                      <Math math={step} />
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
