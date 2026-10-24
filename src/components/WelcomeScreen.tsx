import React from 'react';
import { Logo } from './Logo';
import { ArrowRight, Clock, ShieldCheck, Sparkles, Sprout, PawPrint, Download, Smartphone } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onAdminOpen: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  onOpenInstallModal: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onAdminOpen,
  isInstallable,
  isInstalled,
  onOpenInstallModal,
}) => {
  return (
    <div className="w-full max-w-md mx-auto py-4 sm:py-6 flex flex-col items-center text-center">
      {/* Brand Logo Header */}
      <div className="mb-6">
        <Logo size="lg" onAdminOpen={onAdminOpen} />
      </div>

      {/* Main Title Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3ED] text-[#1F5C3A] text-xs font-bold uppercase tracking-wider mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Validación de Mercado • Bogotá</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#154228] tracking-tight leading-tight mb-3">
        Bolsas que cuidan tu mascota y el planeta
      </h1>

      <p className="text-base text-[#4E6356] leading-relaxed mb-6 font-medium">
        Esta encuesta toma sólo <strong>2 minutos</strong> y nos ayuda a desarrollar la solución ecológica perfecta a base de <strong>almidón de maíz</strong> en Bogotá.
      </p>

      {/* Value Proposition Cards */}
      <div className="w-full grid grid-cols-3 gap-2.5 mb-6 text-left">
        <div className="bg-white p-3 rounded-2xl border border-[#E2E8E4] shadow-xs flex flex-col justify-between">
          <Sprout className="w-5 h-5 text-[#22C55E] mb-2" />
          <div>
            <p className="text-[11px] font-bold text-[#1E2D24] leading-tight">100% Maíz</p>
            <p className="text-[10px] text-[#5E7367] mt-0.5">Biodegradable</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#E2E8E4] shadow-xs flex flex-col justify-between">
          <PawPrint className="w-5 h-5 text-[#1F5C3A] mb-2" />
          <div>
            <p className="text-[11px] font-bold text-[#1E2D24] leading-tight">Mascotas</p>
            <p className="text-[10px] text-[#5E7367] mt-0.5">Resistentes</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#E2E8E4] shadow-xs flex flex-col justify-between">
          <Clock className="w-5 h-5 text-[#EAB308] mb-2" />
          <div>
            <p className="text-[11px] font-bold text-[#1E2D24] leading-tight">2 Minutos</p>
            <p className="text-[10px] text-[#5E7367] mt-0.5">Rápida</p>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={onStart}
        className="w-full py-4 px-6 rounded-2xl bg-[#1F5C3A] hover:bg-[#154228] active:scale-[0.98] text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#1F5C3A]/25 transition-all cursor-pointer group"
      >
        <span>Comenzar</span>
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>

      {/* Install PWA Prompt if available and not yet installed */}
      {!isInstalled && (
        <button
          type="button"
          onClick={onOpenInstallModal}
          className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1F5C3A] bg-white border border-[#DCE4DE] hover:bg-[#F2F7F4] shadow-xs transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#1F5C3A]" />
          <span>Instalar en Android o iPhone</span>
        </button>
      )}

      {/* Admin Easter Egg Hint */}
      <div className="mt-8 text-[11px] text-[#71867A] flex items-center gap-1.5 justify-center">
        <ShieldCheck className="w-3.5 h-3.5 text-[#1F5C3A]/70" />
        <span>Tus datos son 100% anónimos y seguros</span>
      </div>
    </div>
  );
};
