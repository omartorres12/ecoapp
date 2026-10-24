import React from 'react';
import { RotateCcw, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface ThankYouScreenProps {
  onRestart: () => void;
}

export const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ onRestart }) => {
  return (
    <div className="w-full max-w-md mx-auto text-center py-6 px-4">
      {/* Decorative Icon */}
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#1F5C3A] to-[#34A853] flex items-center justify-center text-white shadow-xl shadow-[#1F5C3A]/25 mx-auto animate-bounce-short">
          <Heart className="w-12 h-12 fill-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#FEF08A] text-[#154228] flex items-center justify-center font-bold shadow-md">
          <Sparkles className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
        </div>
      </div>

      <h2 className="text-3xl font-extrabold text-[#154228] tracking-tight mb-2">
        ¡Muchas Gracias!
      </h2>
      <p className="text-base text-[#3E5246] leading-relaxed mb-6 font-medium">
        Tu opinión es fundamental para transformar a Bogotá en una ciudad más limpia, sostenible y amigable con nuestras mascotas.
      </p>

      {/* Highlights Card */}
      <div className="bg-white rounded-3xl p-5 border-2 border-[#E2E8E4] shadow-sm text-left space-y-3 mb-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#1F5C3A] shrink-0 mt-0.5" />
          <p className="text-xs text-[#2C3E33]">
            <strong>Respuestas respaldadas:</strong> Tu encuesta quedó registrada en la memoria local de tu dispositivo y lista para análisis.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#1F5C3A] shrink-0 mt-0.5" />
          <p className="text-xs text-[#2C3E33]">
            <strong>Comunidad EcoGuardian:</strong> Si dejaste tu WhatsApp, te escribiremos cuando entreguemos los primeros rollos de almidón de maíz en tu localidad.
          </p>
        </div>
      </div>

      {/* Reset Button */}
      <button
        type="button"
        onClick={onRestart}
        className="w-full py-4 px-6 rounded-2xl bg-[#1F5C3A] hover:bg-[#154228] active:scale-[0.98] text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#1F5C3A]/20 transition-all cursor-pointer"
      >
        <RotateCcw className="w-5 h-5" />
        <span>Responder otra encuesta</span>
      </button>

      <p className="text-[11px] text-[#5E7367] mt-6">
        EcoGuardian • Bolsas biodegradables de almidón de maíz • Bogotá, Colombia
      </p>
    </div>
  );
};
