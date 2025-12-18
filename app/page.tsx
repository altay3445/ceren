"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

// Çiçek verisi için tip tanımı
interface FlowerData {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

// --- ORTAK DEFINITIONS (İris için Gradyanlar ve Filtreler) ---
const SvgDefs = () => (
  <defs>
    <radialGradient id="irisOuterGrad" cx="50%" cy="50%" r="70%" fx="50%" fy="20%">
      <stop offset="0%" stopColor="#5D3FD3" />
      <stop offset="60%" stopColor="#310062" />
      <stop offset="100%" stopColor="#1a0033" />
    </radialGradient>

    <linearGradient id="irisInnerGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stopColor="#8A2BE2" />
      <stop offset="100%" stopColor="#9370DB" />
    </linearGradient>

    <radialGradient id="irisAccentGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFD700" />
      <stop offset="100%" stopColor="#FFA500" />
    </radialGradient>

    <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#228B22" />
      <stop offset="100%" stopColor="#32CD32" />
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// --- SADECE İRİS ÇİÇEK KAFASI ---
const IrisHeadOnly = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => {
  const outerPetalPath = "M50 50 Q 20 85 50 120 Q 80 85 50 50 Z";
  const innerPetalPath = "M50 50 Q 35 15 50 -10 Q 65 15 50 50 Z";

  return (
    <svg viewBox="0 0 100 120" className={`overflow-visible ${className || ""}`} style={style}>
      <SvgDefs />
      <g filter="url(#glow)">
        {[0, 120, 240].map((angle, i) => (
          <g key={`outer-${i}`} transform={`rotate(${angle} 50 50)`}>
            <path d={outerPetalPath} fill="url(#irisOuterGrad)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            <ellipse cx="50" cy="80" rx="4" ry="15" fill="url(#irisAccentGrad)" opacity={0.9} />
          </g>
        ))}

        {[60, 180, 300].map((angle, i) => (
          <g key={`inner-${i}`} transform={`rotate(${angle} 50 50)`}>
            <path
              d={innerPetalPath}
              fill="url(#irisInnerGrad)"
              opacity={0.95}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
          </g>
        ))}

        <circle cx="50" cy="50" r="6" fill="url(#irisAccentGrad)" opacity={0.8} />
      </g>
    </svg>
  );
};

// --- SAPLI İRİS ---
const IrisWithStem = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 250" className={`overflow-visible ${className || ""}`} style={style}>
    <SvgDefs />
    <g>
      <path d="M50 250 Q 55 150 50 60" stroke="url(#stemGrad)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M50 180 Q 20 170 30 200 Q 40 210 50 190" fill="#228B22" />
      <path d="M50 180 Q 35 185 30 200" stroke="#1a6b1a" strokeWidth="1" fill="none" />
      <path d="M52 120 Q 80 110 75 140 Q 65 150 52 130" fill="#32CD32" />
      <path d="M52 120 Q 67 125 75 140" stroke="#228B22" strokeWidth="1" fill="none" />
    </g>

    <g transform="translate(0, 0) scale(0.9)">
      <IrisHeadOnly />
    </g>
  </svg>
);

// --- TOHUM ---
const Seed = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className || ""}>
    <defs>
      <radialGradient id="seedGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#F5E6C8" />
        <stop offset="60%" stopColor="#C8A46A" />
        <stop offset="100%" stopColor="#7A5A2B" />
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="52" rx="18" ry="24" fill="url(#seedGrad)" />
    <path d="M50 30 Q 44 52 50 76 Q 56 52 50 30 Z" fill="rgba(255,255,255,0.14)" />
  </svg>
);

// --- TYPEWRITER ---
function Typewriter({
  text,
  start,
  speed = 24,
  className,
}: {
  text: string;
  start: boolean;
  speed?: number;
  className?: string;
}) {
  const [out, setOut] = useState("");
  const idxRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;

    setOut("");
    idxRef.current = 0;

    const tick = () => {
      const i = idxRef.current;
      if (i >= text.length) return;

      setOut((prev) => prev + text[i]);
      idxRef.current = i + 1;
      timerRef.current = window.setTimeout(tick, speed);
    };

    timerRef.current = window.setTimeout(tick, 220);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [start, text, speed]);

  return <h1 className={className}>{out}</h1>;
}

type Stage = "idle" | "seedDrop" | "bloom";

export default function Home() {
  const [stage, setStage] = useState<Stage>("idle");
  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const nextIdRef = useRef(0);

  const bloomed = stage === "bloom";

  const centerText = useMemo(() => "YAŞ FARKI YERİNE \nÇİÇEKLERİ SAYABİLİRSİN", []);

  const spawnOneFlower = () => {
    const yPos = Math.random() * 95 + 5;
    const sizeCalc = (yPos / 100) * 1.2 + 0.3;

    const f: FlowerData = {
      id: nextIdRef.current++,
      x: Math.random() * 100,
      y: yPos,
      size: sizeCalc,
      delay: Math.random() * 0.35,
      duration: 3 + Math.random() * 5,
      rotation: Math.random() * 40 - 20,
    };

    setFlowers((prev) => [...prev, f]);
  };

  // BLOOM başlayınca tek tek spawn
  useEffect(() => {
    if (!bloomed) return;

    setFlowers([]);
    nextIdRef.current = 0;

    const TOTAL = 100;
    const INTERVAL_MS = 55;

    const timer = window.setInterval(() => {
      spawnOneFlower();
      if (nextIdRef.current >= TOTAL) window.clearInterval(timer);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [bloomed]);

  const handleBloom = () => {
    if (stage !== "idle") return;

    setStage("seedDrop");

    window.setTimeout(() => {
      setStage("bloom");
    }, 900);
  };

  const handleReset = () => {
    setStage("idle");
    setFlowers([]);
    nextIdRef.current = 0;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#0f0c29] overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

      {/* MERKEZ (IDLE / SEED DROP) */}
      <div
        className={[
          "z-50 flex flex-col items-center justify-center",
          "transition-opacity duration-500",
          bloomed ? "opacity-0 pointer-events-none" : "opacity-100",
        ].join(" ")}
        onClick={handleBloom}
      >
        {stage === "idle" && (
          <div className="iris-breathe cursor-pointer">
            <IrisHeadOnly className="w-56 h-56" />
          </div>
        )}

        {stage === "seedDrop" && (
          <div className="seed-drop">
            <Seed className="w-20 h-20" />
          </div>
        )}

        {stage === "idle" && (
          <p className="text-pink-300 mt-6 font-bold tracking-[0.3em] text-sm drop-shadow-lg select-none">
            BANA TIKLA
          </p>
        )}
      </div>

      {/* ARKA PLAN */}
      {bloomed && (
        <div className="absolute inset-0 pointer-events-none">
          {flowers.map((flower) => (
            <div
              key={flower.id}
              className="absolute animate-bloom-infinite origin-bottom"
              style={{
                left: `${flower.x}%`,
                top: `${flower.y}%`,
                width: "80px",
                height: "200px",
                animationDelay: `${flower.delay}s`,
                animationDuration: `${flower.duration}s`,
                transform: `scale(${flower.size}) rotate(${flower.rotation}deg) translate(-50%, -100%)`,
                zIndex: Math.floor(flower.size * 100),
              }}
            >
              <IrisWithStem className="w-full h-full drop-shadow-lg" />
            </div>
          ))}

          {/* ORTA YAZI: TYPEWRITER */}
          <div className="absolute inset-0 flex items-center justify-center z-[200] pointer-events-none">
            <Typewriter
              start={bloomed}
              text={centerText}
              speed={48}
              className="whitespace-pre-line text-5xl md:text-7xl font-black text-center px-4
                         text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-indigo-200
                         drop-shadow-[0_5px_5px_rgba(0,0,0,0.9)]"
            />
          </div>

          <button
            onClick={handleReset}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto z-[200]
                       px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10
                       transition-colors text-sm uppercase tracking-[0.3em] backdrop-blur-md font-bold
                       shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            Sıfırla
          </button>
        </div>
      )}

      {/* CSS (jsx global yok) */}
      <style>{`
        .iris-breathe {
          animation: irisBreathe 1.9s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes irisBreathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        .seed-drop {
          animation: seedDrop 0.9s cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
          transform-origin: center;
        }
        @keyframes seedDrop {
          0% { transform: translateY(0px) scale(1) rotate(0deg); opacity: 1; }
          65% { transform: translateY(180px) scale(0.92) rotate(12deg); opacity: 1; }
          100% { transform: translateY(520px) scale(0.65) rotate(24deg); opacity: 0; }
        }
      `}</style>
    </main>
  );
}
