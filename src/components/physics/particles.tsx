"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * نظام جسيمات متحركة للخلفية
 * جسيمات صغيرة ملونة تطفو بحركة عشوائية ناعمة
 */
export function ParticlesBackground({ count = 35 }: { count?: number }) {
  // توليد الجسيمات مرة واحدة فقط
  const particles = useMemo(() => {
    const colors = [
      "bg-cyan-300",
      "bg-blue-400",
      "bg-indigo-400",
      "bg-purple-400",
      "bg-pink-300",
      "bg-amber-300",
    ];
    return Array.from({ length: count }, (_, i) => {
      const size = 2 + Math.random() * 5; // 2-7px
      return {
        id: i,
        x: Math.random() * 100, // %
        y: Math.random() * 100, // %
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 8 + Math.random() * 12, // 8-20s
        delay: Math.random() * 5,
        drift: (Math.random() - 0.5) * 40, // انحراف أفقي -20 to +20
        rise: 30 + Math.random() * 40, // ارتفاع 30-70px
        opacity: 0.2 + Math.random() * 0.5, // 0.2-0.7
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${p.color}`}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px currentColor`,
            filter: "blur(0.3px)",
          }}
          animate={{
            y: [0, -p.rise, 0],
            x: [0, p.drift, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/**
 * ذرة تدور حول النواة - تُستخدم كشعار متحرك في رأس البطاقة
 * 3 إلكترونات تدور في مدارات بزوايا مختلفة
 */
export function AtomAnimation({ size = 96 }: { size?: number }) {
  const electrons = [
    { rotation: 0, color: "#60a5fa", duration: 4 },
    { rotation: 60, color: "#a78bfa", duration: 5 },
    { rotation: 120, color: "#f472b6", duration: 6 },
  ];

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* النواة */}
      <motion.div
        className="absolute top-1/2 left-1/2 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 shadow-lg"
        style={{
          width: size * 0.25,
          height: size * 0.25,
          marginLeft: -(size * 0.125),
          marginTop: -(size * 0.125),
          boxShadow: "0 0 20px rgba(251, 146, 60, 0.6)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* المدارات + الإلكترونات */}
      {electrons.map((e, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            transform: `rotate(${e.rotation}deg)`,
          }}
          animate={{ rotate: [e.rotation, e.rotation + 360] }}
          transition={{
            duration: e.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* المدار (إهليلج) */}
          <div
            className="absolute inset-0 border border-white/20 rounded-full"
            style={{
              transform: "rotateX(75deg)",
            }}
          />
          {/* الإلكترون */}
          <motion.div
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: size * 0.1,
              height: size * 0.1,
              marginLeft: -(size * 0.05),
              marginTop: -(size * 0.05),
              backgroundColor: e.color,
              boxShadow: `0 0 ${size * 0.15}px ${e.color}`,
              transform: `translateX(${size * 0.4}px)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
