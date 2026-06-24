"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Atom, Sparkles, Rocket, BookOpen, ChevronLeft } from "lucide-react";

type Props = {
  onStart: (name: string) => void;
};

export function WelcomeScreen({ onStart }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("الرجاء إدخال اسمك (حرفان على الأقل).");
      return;
    }
    setError("");
    onStart(trimmed);
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* خلفية متدرجة علمية */}
      <div className="absolute inset-0 bg-gradient-to-bl from-indigo-950 via-blue-900 to-purple-950" />
      {/* أشكال هندسية زخرفية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-full bg-purple-500/20 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* رموز فيزيائية عائمة */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 font-mono text-3xl md:text-5xl font-bold"
            style={{
              top: `${10 + i * 14}%`,
              left: `${5 + (i * 17) % 90}%`,
            }}
            animate={{ y: [0, -15, 0], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          >
            {["F=ma", "E=mc²", "λ·f=v", "ρ=m/V", "P=F/A", "v²=v₀²+2ax"][i]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-white/40">
            <CardHeader className="text-center pb-2 pt-8 md:pt-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 120 }}
                className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg mb-4"
              >
                <Atom className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-l from-indigo-700 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-2">
                منصة الفيزياء التفاعلية
              </h1>
              <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                رحلة تعليمية شاملة لفيزياء الصفين التاسع والعاشر، مبنية على الكتب المدرسية الرسمية.
                ابدأ بالاستكشاف، طبّق القوانين، واختبر نفسك بالكويزات التفاعلية.
              </p>

              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                  <BookOpen className="w-3 h-3 ml-1" />
                  11 وحدات دراسية
                </Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Sparkles className="w-3 h-3 ml-1" />
                  24 درسًا
                </Badge>
                <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Rocket className="w-3 h-3 ml-1" />
                  قوانين + أمثلة + كويزات
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name" className="text-base font-semibold text-slate-700">
                    ما اسمك أيها الفيزيائي؟
                  </Label>
                  <Input
                    id="student-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اكتب اسمك هنا..."
                    className="h-12 text-base bg-white border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    autoFocus
                    maxLength={40}
                  />
                  {error && <p className="text-sm text-rose-600">{error}</p>}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 md:h-14 text-base md:text-lg font-bold bg-gradient-to-l from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all group"
                >
                  <span>ابدأ رحلة الاستكشاف</span>
                  <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </form>

              <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed">
                سيتم حفظ اسمك وتقدمك بشكل دائم على هذا المتصفح باستخدام LocalStorage.
                يمكنك متابعة التعلم في أي وقت دون الحاجة لإعادة البدء.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
