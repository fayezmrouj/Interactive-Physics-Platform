"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, RotateCcw, Play, Pause } from "lucide-react";
import { Math as PhysMath } from "./math";

type SimType = "freefall" | "newton" | "refraction" | "wave";

const SIM_LABELS: Record<SimType, { title: string; desc: string }> = {
  freefall: {
    title: "السقوط الحر",
    desc: "غيّر الكتلة والارتفاع وشاهد تأثيرها على الزمن والسرعة النهائية",
  },
  newton: {
    title: "قانون نيوتن الثاني",
    desc: "غيّر القوة والكتلة وشاهد التسارع الناتج على جسم متحرك",
  },
  refraction: {
    title: "انكسار الضوء",
    desc: "غيّر زاوية السقوط ومعامل الانكسار وشاهد مسار الشعاع",
  },
  wave: {
    title: "الموجات",
    desc: "غيّر الطول الموجي والتردد والسعة وشاهد الموجة",
  },
};

export function SimulationLab() {
  const [sim, setSim] = useState<SimType>("freefall");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-950/30 rounded-lg">
        <FlaskConical className="w-6 h-6 text-rose-700 dark:text-rose-400" />
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            مختبر المحاكاة التفاعلية
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            محاكاة بصرية حية للمفاهيم الفيزيائية — جرّب بنفسك!
          </p>
        </div>
      </div>

      {/* اختيار المحاكاة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {(Object.keys(SIM_LABELS) as SimType[]).map((key) => (
          <button
            key={key}
            onClick={() => setSim(key)}
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
              sim === key
                ? "border-rose-400 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-rose-300"
            }`}
          >
            {SIM_LABELS[key].title}
          </button>
        ))}
      </div>

      <Card className="border-rose-200 dark:border-rose-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-rose-800 dark:text-rose-200">
            {SIM_LABELS[sim].title}
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {SIM_LABELS[sim].desc}
          </p>
        </CardHeader>
        <CardContent>
          {sim === "freefall" && <FreeFallSim />}
          {sim === "newton" && <NewtonSim />}
          {sim === "refraction" && <RefractionSim />}
          {sim === "wave" && <WaveSim />}
        </CardContent>
      </Card>
    </div>
  );
}

// ====== محاكاة السقوط الحر ======
function FreeFallSim() {
  const [height, setHeight] = useState(20);
  const [mass, setMass] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const g = 9.8;
  const tMax = Math.sqrt((2 * height) / g);
  const currentY = 0.5 * g * Math.min(t, tMax) ** 2;
  const currentV = g * Math.min(t, tMax);
  const progress = currentY / height;

  useEffect(() => {
    if (!playing) return;
    lastTimeRef.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setT((prev) => {
        const next = prev + dt;
        if (next >= tMax) {
          setPlaying(false);
          return tMax;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, tMax]);

  function handleReset() {
    setPlaying(false);
    setT(0);
  }

  function handleHeightChange(v: number[]) {
    setHeight(v[0]);
    handleReset();
  }

  function handleMassChange(v: number[]) {
    setMass(v[0]);
  }

  // عرض بصري: كرة تسقط من أعلى
  const ballTop = 5 + progress * 80; // نسبة 5% لـ 85%

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <Label className="flex justify-between text-sm mb-2">
              <span>الارتفاع (m)</span>
              <Badge variant="outline">{height} m</Badge>
            </Label>
            <Slider
              value={[height]}
              onValueChange={handleHeightChange}
              min={5}
              max={50}
              step={1}
            />
          </div>
          <div>
            <Label className="flex justify-between text-sm mb-2">
              <span>الكتلة (kg)</span>
              <Badge variant="outline">{mass} kg</Badge>
            </Label>
            <Slider
              value={[mass]}
              onValueChange={handleMassChange}
              min={0.1}
              max={10}
              step={0.1}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              💡 في غياب مقاومة الهواء، الكتلة لا تؤثر على زمن السقوط!
            </p>
          </div>
        </div>

        {/* عرض بصري */}
        <div className="relative h-72 bg-gradient-to-b from-sky-100 to-sky-50 dark:from-sky-950/30 dark:to-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
          {/* سماء */}
          <div className="absolute top-2 right-2 text-xs text-slate-500">☁️</div>
          {/* الأرض */}
          <div className="absolute bottom-0 inset-x-0 h-3 bg-gradient-to-l from-amber-700 to-amber-600" />
          {/* الكرة */}
          <div
            className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg transition-none"
            style={{
              top: `${ballTop}%`,
              left: "50%",
              transform: "translateX(-50%)",
              width: `${10 + mass * 2}px`,
              height: `${10 + mass * 2}px`,
            }}
          />
          {/* معلومات */}
          <div className="absolute top-2 left-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded p-2 text-xs space-y-1">
            <div>الزمن: <span className="font-bold">{t.toFixed(2)} s</span></div>
            <div>السرعة: <span className="font-bold">{currentV.toFixed(2)} m/s</span></div>
            <div>المسافة: <span className="font-bold">{currentY.toFixed(2)} m</span></div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => setPlaying(!playing)}
          className="flex-1 bg-rose-600 hover:bg-rose-700"
          disabled={t >= tMax}
        >
          {playing ? (
            <>
              <Pause className="w-4 h-4 ml-1" />
              إيقاف
            </>
          ) : (
            <>
              <Play className="w-4 h-4 ml-1" />
              {t >= tMax ? "انتهى" : t > 0 ? "متابعة" : "ابدأ"}
            </>
          )}
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="w-4 h-4 ml-1" />
          إعادة
        </Button>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm space-y-1">
        <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">القوانين المستخدمة:</div>
        <div className="text-slate-600 dark:text-slate-300">
          <PhysMath math={`y = \\frac{1}{2} g t^2`} /> — المسافة المقطوعة
        </div>
        <div className="text-slate-600 dark:text-slate-300">
          <PhysMath math={`v = g \\cdot t`} /> — السرعة اللحظية
        </div>
        <div className="text-slate-600 dark:text-slate-300">
          <PhysMath math={`t_{fall} = \\sqrt{\\frac{2h}{g}} = ${tMax.toFixed(3)} \\text{ s}`} /> — زمن السقوط الكلي
        </div>
      </div>
    </div>
  );
}

// ====== محاكاة قانون نيوتن الثاني ======
function NewtonSim() {
  const [force, setForce] = useState(10);
  const [mass, setMass] = useState(2);
  const [friction, setFriction] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [x, setX] = useState(0); // موضع الصندوق
  const [v, setV] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const g = 9.8;
  const fNet = force - friction * mass * g;
  const a = mass > 0 ? fNet / mass : 0;

  useEffect(() => {
    if (!playing) return;
    lastTimeRef.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setV((prevV) => prevV + a * dt);
      setX((prevX) => {
        const newX = prevX + v * dt;
        if (newX > 80) {
          setPlaying(false);
          return 80;
        }
        return newX;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, a, v]);

  function handleReset() {
    setPlaying(false);
    setX(0);
    setV(0);
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <Label className="flex justify-between text-sm mb-2">
              <span>القوة المؤثرة (N)</span>
              <Badge variant="outline">{force} N</Badge>
            </Label>
            <Slider
              value={[force]}
              onValueChange={(v) => setForce(v[0])}
              min={0}
              max={50}
              step={1}
            />
          </div>
          <div>
            <Label className="flex justify-between text-sm mb-2">
              <span>الكتلة (kg)</span>
              <Badge variant="outline">{mass} kg</Badge>
            </Label>
            <Slider
              value={[mass]}
              onValueChange={(v) => setMass(v[0])}
              min={0.5}
              max={10}
              step={0.5}
            />
          </div>
          <div>
            <Label className="flex justify-between text-sm mb-2">
              <span>معامل الاحتكاك (μ)</span>
              <Badge variant="outline">{friction.toFixed(2)}</Badge>
            </Label>
            <Slider
              value={[friction]}
              onValueChange={(v) => setFriction(v[0])}
              min={0}
              max={0.5}
              step={0.01}
            />
          </div>
        </div>

        {/* عرض بصري */}
        <div className="relative h-72 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
          {/* الأرض */}
          <div className="absolute bottom-8 inset-x-0 h-1 bg-slate-400 dark:bg-slate-600" />
          {/* الصندوق */}
          <div
            className="absolute bottom-9 w-12 h-12 bg-gradient-to-tr from-amber-600 to-orange-500 rounded shadow-lg flex items-center justify-center text-white font-bold text-xs"
            style={{
              right: `${10 + x}%`,
            }}
          >
            {mass}kg
          </div>
          {/* سهم القوة */}
          {force > 0 && x < 80 && (
            <div
              className="absolute bottom-12 flex items-center"
              style={{ right: `${10 + x + 12}%` }}
            >
              <div className="text-rose-600 text-xl">←</div>
              <div className="text-xs text-rose-600 font-bold">{force}N</div>
            </div>
          )}
          {/* معلومات */}
          <div className="absolute top-2 left-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded p-2 text-xs space-y-1">
            <div>التسارع: <span className="font-bold text-indigo-600">{a.toFixed(2)} m/s²</span></div>
            <div>السرعة: <span className="font-bold">{v.toFixed(2)} m/s</span></div>
            <div>القوة الصافية: <span className="font-bold">{fNet.toFixed(2)} N</span></div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => setPlaying(!playing)}
          className="flex-1 bg-rose-600 hover:bg-rose-700"
          disabled={x >= 80}
        >
          {playing ? <><Pause className="w-4 h-4 ml-1" />إيقاف</> : <><Play className="w-4 h-4 ml-1" />{x >= 80 ? "انتهى" : x > 0 ? "متابعة" : "ابدأ"}</>}
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="w-4 h-4 ml-1" /> إعادة
        </Button>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm space-y-1">
        <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">القوانين:</div>
        <div className="text-slate-600 dark:text-slate-300">
          <PhysMath math={`F_{net} = F - \\mu \\cdot m \\cdot g = ${force} - ${friction}\\times${mass}\\times${g} = ${fNet.toFixed(2)} \\text{ N}`} />
        </div>
        <div className="text-slate-600 dark:text-slate-300">
          <PhysMath math={`a = \\frac{F_{net}}{m} = \\frac{${fNet.toFixed(2)}}{${mass}} = ${a.toFixed(2)} \\text{ m/s}^2`} />
        </div>
      </div>
    </div>
  );
}

// ====== محاكاة انكسار الضوء ======
function RefractionSim() {
  const [angle, setAngle] = useState(30);
  const [n1, setN1] = useState(1.0);
  const [n2, setN2] = useState(1.33);

  const theta1Rad = (angle * Math.PI) / 180;
  const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;
  const isTIR = sinTheta2 > 1;
  const theta2 = isTIR ? null : (Math.asin(sinTheta2) * 180) / Math.PI;
  const criticalAngle =
    n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

  // حساب الإحداثيات
  const cx = 150;
  const cy = 100;
  const rayLen = 80;
  // الشعاع الساقط: يأتي من أعلى اليسار (في RTL)
  // نرسم من الزاوية العلوية نحو النقطة المركزية
  const x1 = cx - rayLen * Math.cos(theta1Rad);
  const y1 = cy - rayLen * Math.sin(theta1Rad);
  // الشعاع المنكسر: ينزل إلى أسفل
  const x2 = isTIR ? cx + rayLen * Math.cos(theta1Rad) : cx + rayLen * Math.cos((theta2 || 0) * Math.PI / 180);
  const y2 = isTIR ? cy - rayLen * Math.sin(theta1Rad) : cy + rayLen * Math.sin((theta2 || 0) * Math.PI / 180);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <Label className="flex justify-between text-sm mb-2">
              <span>زاوية السقوط (°)</span>
              <Badge variant="outline">{angle}°</Badge>
            </Label>
            <Slider
              value={[angle]}
              onValueChange={(v) => setAngle(v[0])}
              min={0}
              max={89}
              step={1}
            />
          </div>
          <div>
            <Label className="flex justify-between text-sm mb-2">
              <span>معامل الانكسار العلوي (n₁)</span>
              <Badge variant="outline">{n1.toFixed(2)}</Badge>
            </Label>
            <Slider
              value={[n1]}
              onValueChange={(v) => setN1(v[0])}
              min={1}
              max={2.5}
              step={0.01}
            />
          </div>
          <div>
            <Label className="flex justify-between text-sm mb-2">
              <span>معامل الانكسار السفلي (n₂)</span>
              <Badge variant="outline">{n2.toFixed(2)}</Badge>
            </Label>
            <Slider
              value={[n2]}
              onValueChange={(v) => setN2(v[0])}
              min={1}
              max={2.5}
              step={0.01}
            />
          </div>
        </div>

        {/* عرض بصري */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
          <svg viewBox="0 0 300 200" className="w-full h-56" dir="ltr">
            {/* الوس العلوي */}
            <rect x="0" y="0" width="300" height="100" fill="#dbeafe" opacity="0.5" />
            {/* الوس السفلي */}
            <rect x="0" y="100" width="300" height="100" fill="#bfdbfe" opacity="0.7" />
            {/* السطح الفاصل */}
            <line x1="0" y1="100" x2="300" y2="100" stroke="#475569" strokeWidth="2" />
            {/* العمود المقام */}
            <line x1={cx} y1="20" x2={cx} y2="180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
            {/* الشعاع الساقط */}
            <line x1={x1} y1={y1} x2={cx} y2={cy} stroke="#f59e0b" strokeWidth="2.5" />
            {/* الشعاع المنكسر أو المنعكس */}
            {isTIR ? (
              <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 2" />
            ) : (
              <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth="2.5" />
            )}
            {/* نصوص */}
            <text x="5" y="15" fontSize="10" fill="#1e40af">n₁ = {n1.toFixed(2)}</text>
            <text x="5" y="115" fontSize="10" fill="#1e3a8a">n₂ = {n2.toFixed(2)}</text>
            <text x={cx + 5} y={cy + 12} fontSize="9" fill="#475569">{angle}°</text>
            {!isTIR && theta2 !== null && (
              <text x={cx + 5} y={cy + 22} fontSize="9" fill="#475569">{theta2.toFixed(1)}°</text>
            )}
          </svg>
        </div>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm space-y-2">
        <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">التحليل:</div>
        {isTIR ? (
          <div className="text-rose-700 dark:text-rose-400 font-medium">
            🔄 انعكاس كلي! الزاوية تتجاوز الزاوية الحرجة.
            {criticalAngle !== null && ` (الزاوية الحرجة = ${criticalAngle.toFixed(1)}°)`}
          </div>
        ) : (
          <>
            <div className="text-slate-600 dark:text-slate-300">
              <PhysMath math={`n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)`} />
            </div>
            <div className="text-slate-600 dark:text-slate-300">
              <PhysMath math={`${n1.toFixed(2)} \\times \\sin(${angle}°) = ${n2.toFixed(2)} \\times \\sin(\\theta_2)`} />
            </div>
            <div className="text-slate-700 dark:text-slate-200 font-bold">
              <PhysMath math={`\\theta_2 = ${theta2!.toFixed(2)}°`} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ====== محاكاة الموجات ======
function WaveSim() {
  const [amplitude, setAmplitude] = useState(20);
  const [wavelength, setWavelength] = useState(50);
  const [frequency, setFrequency] = useState(2);
  const [playing, setPlaying] = useState(true);
  const [phase, setPhase] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const speed = wavelength * frequency;

  useEffect(() => {
    if (!playing) return;
    lastTimeRef.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setPhase((p) => p + dt * frequency * 2 * Math.PI);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, frequency]);

  // توليد نقاط الموجة
  const points: string[] = [];
  const width = 300;
  const height = 100;
  const cy = height / 2;
  for (let x = 0; x <= width; x += 2) {
    const y = cy - amplitude * Math.sin((2 * Math.PI * x) / wavelength - phase);
    points.push(`${x},${y}`);
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <Label className="flex justify-between text-sm mb-2">
              <span>السعة (A)</span>
              <Badge variant="outline">{amplitude}</Badge>
            </Label>
            <Slider
              value={[amplitude]}
              onValueChange={(v) => setAmplitude(v[0])}
              min={5}
              max={40}
              step={1}
            />
          </div>
          <div>
            <Label className="flex justify-between text-sm mb-2">
              <span>الطول الموجي (λ)</span>
              <Badge variant="outline">{wavelength}</Badge>
            </Label>
            <Slider
              value={[wavelength]}
              onValueChange={(v) => setWavelength(v[0])}
              min={20}
              max={150}
              step={5}
            />
          </div>
          <div>
            <Label className="flex justify-between text-sm mb-2">
              <span>التردد (f)</span>
              <Badge variant="outline">{frequency} Hz</Badge>
            </Label>
            <Slider
              value={[frequency]}
              onValueChange={(v) => setFrequency(v[0])}
              min={0.5}
              max={5}
              step={0.1}
            />
          </div>
        </div>

        {/* عرض بصري */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44" dir="ltr">
            {/* خط الاتزان */}
            <line x1="0" y1={cy} x2={width} y2={cy} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            {/* الموجة */}
            <polyline
              points={points.join(" ")}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2.5"
            />
            {/* مؤشر السعة */}
            <line x1="10" y1={cy} x2="10" y2={cy - amplitude} stroke="#10b981" strokeWidth="2" />
            <text x="15" y={cy - amplitude / 2} fontSize="10" fill="#10b981">A</text>
            {/* مؤشر الطول الموجي */}
            <line x1="50" y1={height - 10} x2={50 + wavelength} y2={height - 10} stroke="#f59e0b" strokeWidth="2" />
            <text x={50 + wavelength / 2 - 5} y={height - 2} fontSize="10" fill="#f59e0b">λ</text>
          </svg>
          <div className="mt-2 flex justify-around text-xs">
            <div>السرعة: <span className="font-bold text-violet-600">{speed.toFixed(1)} m/s</span></div>
            <div>الدورة: <span className="font-bold">{(1 / frequency).toFixed(2)} s</span></div>
          </div>
        </div>
      </div>

      <Button
        onClick={() => setPlaying(!playing)}
        className="w-full bg-rose-600 hover:bg-rose-700"
      >
        {playing ? <><Pause className="w-4 h-4 ml-1" />إيقاف الحركة</> : <><Play className="w-4 h-4 ml-1" />تشغيل الحركة</>}
      </Button>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm space-y-1">
        <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">العلاقات:</div>
        <div className="text-slate-600 dark:text-slate-300">
          <PhysMath math={`v = \\lambda \\times f = ${wavelength} \\times ${frequency} = ${speed.toFixed(1)} \\text{ m/s}`} />
        </div>
        <div className="text-slate-600 dark:text-slate-300">
          <PhysMath math={`T = \\frac{1}{f} = \\frac{1}{${frequency}} = ${(1 / frequency).toFixed(3)} \\text{ s}`} />
        </div>
      </div>
    </div>
  );
}
