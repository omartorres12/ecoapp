import React from 'react';
import { QuestionDef, SurveyAnswers } from '../types';
import { Star, Check, Sparkles, MapPin, AlertCircle, Phone } from 'lucide-react';

interface QuestionCardProps {
  question: QuestionDef;
  answers: SurveyAnswers;
  onChange: (field: keyof SurveyAnswers, value: unknown) => void;
  onNext: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answers,
  onChange,
  onNext,
}) => {
  const { id, title, subtitle, type, options, maxSelect, placeholder, suggestions, optional } =
    question;

  // Render question-specific input controls
  const renderControls = () => {
    switch (type) {
      case 'text': {
        const textVal = (answers[id as keyof SurveyAnswers] as string) || '';
        return (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={textVal}
                onChange={(e) => onChange(id as keyof SurveyAnswers, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && textVal.trim()) {
                    e.preventDefault();
                    onNext();
                  }
                }}
                placeholder={placeholder || 'Escribe tu respuesta...'}
                autoFocus
                className="w-full px-4 py-4 rounded-2xl bg-white border-2 border-[#DCE4DE] text-[#1E2D24] text-base placeholder-gray-400 focus:outline-none focus:border-[#1F5C3A] focus:ring-4 focus:ring-[#1F5C3A]/10 shadow-sm transition-all"
              />
              {textVal.trim() && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1F5C3A] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Suggestions chips if any (e.g. Bogotá localities) */}
            {suggestions && suggestions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#5E7367] mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1F5C3A]" />
                  Localidades y zonas frecuentes:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((sug) => {
                    const isSelected = textVal.toLowerCase() === sug.toLowerCase();
                    return (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => onChange(id as keyof SurveyAnswers, sug)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-[#1F5C3A] text-white border-[#1F5C3A] font-semibold shadow-xs'
                            : 'bg-white text-[#334D3D] border-[#D6E0D9] hover:bg-[#EAF2ED]'
                        }`}
                      >
                        {sug}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'radio': {
        const currentVal = (answers[id as keyof SurveyAnswers] as string) || '';
        return (
          <div className="space-y-2.5">
            {options?.map((opt) => {
              const isSelected = currentVal === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange(id as keyof SurveyAnswers, opt)}
                  className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all duration-200 active:scale-[0.99] ${
                    isSelected
                      ? 'bg-[#EBF5EE] border-[#1F5C3A] text-[#1F5C3A] font-bold shadow-md shadow-[#1F5C3A]/10'
                      : 'bg-white border-[#E2E8E4] text-[#2C3E33] hover:border-[#1F5C3A]/40 hover:bg-[#F9FAF8] font-medium'
                  }`}
                >
                  <span className="text-sm sm:text-base leading-snug">{opt}</span>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-[#1F5C3A] bg-[#1F5C3A] text-white'
                        : 'border-[#CBD5CE] bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        );
      }

      case 'stars': {
        const rating = (answers.importanciaBiodegradable as number) || 0;
        const labels: Record<number, string> = {
          1: '1 de 5 • Poco importante',
          2: '2 de 5 • Algo importante',
          3: '3 de 5 • Moderadamente importante',
          4: '4 de 5 • Muy importante',
          5: '5 de 5 • ¡Fundamental para el planeta!',
        };

        return (
          <div className="bg-white p-6 rounded-3xl border-2 border-[#E2E8E4] shadow-sm text-center">
            <p className="text-xs uppercase tracking-wider font-bold text-[#5E7367] mb-4">
              Toca para calificar
            </p>
            <div className="flex justify-center items-center gap-2 sm:gap-3 py-2">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isActive = rating >= starVal;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => onChange('importanciaBiodegradable', starVal)}
                    className="p-1 sm:p-2 group focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    aria-label={`Calificar con ${starVal} estrellas`}
                  >
                    <Star
                      className={`w-9 h-9 sm:w-11 sm:h-11 transition-all ${
                        isActive
                          ? 'fill-[#F59E0B] text-[#F59E0B] drop-shadow-sm filter'
                          : 'fill-transparent text-[#CBD5CE] group-hover:text-[#F59E0B]/50'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 min-h-6">
              {rating > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#EBF5EE] text-[#1F5C3A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  {labels[rating]}
                </span>
              ) : (
                <span className="text-xs text-gray-400">Selecciona entre 1 y 5 estrellas</span>
              )}
            </div>
          </div>
        );
      }

      case 'multi': {
        const selectedList = ((answers[id as keyof SurveyAnswers] as string[]) || []) as string[];

        const handleToggle = (opt: string) => {
          // Special handling for question 12 (preocupaciones) with 'Nada' option
          if (id === 'preocupaciones') {
            if (opt === 'Nada') {
              if (selectedList.includes('Nada')) {
                onChange(id, []);
              } else {
                onChange(id, ['Nada']);
              }
              return;
            } else {
              const withoutNada = selectedList.filter((item) => item !== 'Nada');
              if (withoutNada.includes(opt)) {
                onChange(id, withoutNada.filter((item) => item !== opt));
              } else {
                onChange(id, [...withoutNada, opt]);
              }
              return;
            }
          }

          // General multi-select
          if (selectedList.includes(opt)) {
            onChange(id, selectedList.filter((item) => item !== opt));
          } else {
            if (maxSelect && selectedList.length >= maxSelect) {
              // Reached limit
              return;
            }
            onChange(id, [...selectedList, opt]);
          }
        };

        return (
          <div className="space-y-3">
            {maxSelect && (
              <div className="flex items-center justify-between text-xs font-semibold px-1 text-[#5E7367]">
                <span>Selección múltiple</span>
                <span
                  className={
                    selectedList.length === maxSelect
                      ? 'text-[#1F5C3A] font-bold'
                      : 'text-amber-700'
                  }
                >
                  {selectedList.length} de {maxSelect} seleccionadas
                </span>
              </div>
            )}

            <div className="space-y-2.5">
              {options?.map((opt) => {
                const isChecked = selectedList.includes(opt);
                const isMaxReached =
                  Boolean(maxSelect && selectedList.length >= maxSelect && !isChecked);

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={isMaxReached}
                    onClick={() => handleToggle(opt)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all duration-200 ${
                      isChecked
                        ? 'bg-[#EBF5EE] border-[#1F5C3A] text-[#1F5C3A] font-bold shadow-sm'
                        : isMaxReached
                        ? 'bg-gray-50 border-gray-200 text-gray-400 opacity-60 cursor-not-allowed'
                        : 'bg-white border-[#E2E8E4] text-[#2C3E33] hover:border-[#1F5C3A]/40 font-medium active:scale-[0.99]'
                    }`}
                  >
                    <span className="text-sm sm:text-base leading-snug">{opt}</span>
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'border-[#1F5C3A] bg-[#1F5C3A] text-white'
                          : 'border-[#CBD5CE] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      case 'scale-0-10': {
        const val = answers.nps;
        return (
          <div className="bg-white p-5 rounded-3xl border-2 border-[#E2E8E4] shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold text-[#5E7367] px-1">
              <span className="text-red-700">0 = Nada probable</span>
              <span className="text-emerald-700">10 = Muy seguro</span>
            </div>

            {/* Grid of 0 to 10 */}
            <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isSelected = val === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onChange('nps', num)}
                    className={`py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-150 flex flex-col items-center justify-center active:scale-95 ${
                      isSelected
                        ? 'bg-[#1F5C3A] text-white ring-4 ring-[#1F5C3A]/20 scale-105 shadow-md'
                        : num <= 6
                        ? 'bg-red-50 text-red-900 hover:bg-red-100 border border-red-100'
                        : num <= 8
                        ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-100'
                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-100'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            <div className="text-center pt-1 min-h-6">
              {val !== null && val !== undefined ? (
                <span className="text-xs font-semibold px-3 py-1 bg-[#EBF5EE] text-[#1F5C3A] rounded-full inline-block">
                  {val <= 6
                    ? `Puntuación: ${val} (Detractor: Cuéntanos cómo mejorar)`
                    : val <= 8
                    ? `Puntuación: ${val} (Pasivo: ¡Vamos por ese 10!)`
                    : `Puntuación: ${val} (¡Promotor! Gracias por tu confianza)`}
                </span>
              ) : (
                <span className="text-xs text-gray-400">Selecciona un número del 0 al 10</span>
              )}
            </div>
          </div>
        );
      }

      case 'textarea': {
        const textVal = (answers.comentarios as string) || '';
        return (
          <div className="space-y-2">
            <textarea
              rows={4}
              value={textVal}
              onChange={(e) => onChange('comentarios', e.target.value)}
              placeholder={placeholder || 'Escribe tus comentarios o sugerencias aquí...'}
              className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-[#DCE4DE] text-[#1E2D24] text-sm placeholder-gray-400 focus:outline-none focus:border-[#1F5C3A] focus:ring-4 focus:ring-[#1F5C3A]/10 shadow-sm transition-all resize-none"
            />
            <div className="flex justify-between items-center text-xs text-[#5E7367] px-1">
              <span>{optional ? 'Opcional' : 'Requerido'}</span>
              <span>{textVal.length} caracteres</span>
            </div>
          </div>
        );
      }

      case 'phone': {
        const phoneVal = (answers.whatsapp as string) || '';
        return (
          <div className="space-y-3">
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-xs font-bold text-[#1F5C3A] bg-[#E8F3ED] px-2 py-1 rounded-lg">
                <span>🇨🇴</span>
                <span>+57</span>
              </div>
              <input
                type="tel"
                value={phoneVal}
                onChange={(e) => onChange('whatsapp', e.target.value)}
                placeholder={placeholder || '304 379 5676'}
                className="w-full pl-22 pr-4 py-4 rounded-2xl bg-white border-2 border-[#DCE4DE] text-[#1E2D24] text-base placeholder-gray-400 focus:outline-none focus:border-[#1F5C3A] focus:ring-4 focus:ring-[#1F5C3A]/10 shadow-sm transition-all"
              />
              <Phone className="absolute right-4 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <p className="text-xs text-[#5E7367] px-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#1F5C3A]" />
              Es opcional. No te enviaremos spam, únicamente promociones y avisos de lanzamiento.
            </p>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Question header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#154228] leading-tight tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[#4E6356] mt-1.5 leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Control Area */}
      {renderControls()}
    </div>
  );
};
