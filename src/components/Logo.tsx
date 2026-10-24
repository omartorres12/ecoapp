import React, { useRef, useState, useEffect } from 'react';

interface LogoProps {
  onAdminOpen?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  onAdminOpen,
  size = 'md',
  showText = true,
}) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const HOLD_DURATION = 3000; // 3 seconds required

  const startHold = (e: React.PointerEvent) => {
    // Only primary button
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setHolding(true);
    setProgress(0);
    startTimeRef.current = performance.now();

    const updateTimer = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setProgress(pct);

      if (elapsed >= HOLD_DURATION) {
        setHolding(false);
        setProgress(0);
        if (navigator.vibrate) {
          navigator.vibrate([40, 60, 80]);
        }
        if (onAdminOpen) {
          onAdminOpen();
        }
      } else {
        timerRef.current = requestAnimationFrame(updateTimer);
      }
    };

    timerRef.current = requestAnimationFrame(updateTimer);
  };

  const endHold = () => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    setHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, []);

  const sizeDimensions = {
    sm: { icon: 'w-9 h-9', title: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'w-12 h-12', title: 'text-xl', sub: 'text-xs' },
    lg: { icon: 'w-16 h-16', title: 'text-2xl', sub: 'text-sm' },
  }[size];

  return (
    <div
      onPointerDown={startHold}
      onPointerUp={endHold}
      onPointerLeave={endHold}
      onPointerCancel={endHold}
      className="relative flex items-center gap-3 cursor-pointer select-none group touch-none"
      title="EcoGuardian (Mantén presionado 3s para panel de administración)"
    >
      {/* Icon with circular progress outline during hold */}
      <div className={`relative ${sizeDimensions.icon} flex items-center justify-center shrink-0`}>
        {/* Progress SVG Ring around logo */}
        {holding && (
          <svg className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] -rotate-90 pointer-events-none z-20">
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              stroke="rgba(31, 92, 58, 0.2)"
              strokeWidth="3.5"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              stroke="#1F5C3A"
              strokeWidth="3.5"
              strokeDasharray="280"
              strokeDashoffset={280 - (280 * progress) / 100}
              strokeLinecap="round"
              fill="none"
              className="transition-[stroke-dashoffset] duration-75"
            />
          </svg>
        )}

        {/* The Badge Container */}
        <div
          className={`w-full h-full rounded-2xl bg-gradient-to-br from-[#1F5C3A] to-[#143D27] p-2 flex items-center justify-center shadow-md shadow-[#1F5C3A]/20 transition-transform duration-200 ${
            holding ? 'scale-95 ring-2 ring-[#4ADE80]' : 'group-hover:scale-105'
          }`}
        >
          {/* Leaf & Sprout SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-white fill-current filter drop-shadow-sm"
          >
            {/* Organic Leaf Contour */}
            <path
              d="M50 12 C72 12 85 30 84 56 C83 72 68 88 50 88 C32 88 17 72 16 56 C15 30 28 12 50 12 Z"
              fill="#22C55E"
            />
            {/* Shaded Fold */}
            <path
              d="M50 12 C50 36 30 46 25 60 C32 75 42 85 50 88 C44 70 47 40 50 12 Z"
              fill="#15803D"
            />
            {/* Center stem */}
            <path
              d="M50 14 Q50 50 50 86"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Subtle veins */}
            <path
              d="M50 38 Q62 33 68 30"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M50 52 Q64 48 70 45"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M50 44 Q38 40 32 36"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            {/* Little Paw Mark at base */}
            <circle cx="50" cy="74" r="5" fill="#FFFFFF" opacity="0.95" />
            <circle cx="43" cy="65" r="2.2" fill="#FFFFFF" opacity="0.9" />
            <circle cx="48" cy="62" r="2.2" fill="#FFFFFF" opacity="0.9" />
            <circle cx="52" cy="62" r="2.2" fill="#FFFFFF" opacity="0.9" />
            <circle cx="57" cy="65" r="2.2" fill="#FFFFFF" opacity="0.9" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight text-[#1F5C3A] font-sans ${sizeDimensions.title}`}
            >
              EcoGuardian
            </span>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#1F5C3A]/10 text-[#1F5C3A] px-1.5 py-0.5 rounded-full">
              Bio
            </span>
          </div>
          <span className={`text-[#5E7367] font-medium ${sizeDimensions.sub}`}>
            {holding
              ? `Accediendo modo admin (${Math.ceil((HOLD_DURATION - (HOLD_DURATION * progress) / 100) / 1000)}s)...`
              : 'Bogotá • Validación 100% Maíz'}
          </span>
        </div>
      )}
    </div>
  );
};
