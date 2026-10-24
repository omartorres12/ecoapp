import React from 'react';
import { SurveyAnswers } from '../types';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { saveSurvey } from '../utils/storage';
import { CheckCircle2, MessageCircle, ArrowLeft, Edit3, ShieldCheck, Calendar } from 'lucide-react';

interface SummaryScreenProps {
  answers: SurveyAnswers;
  onEditQuestion: (stepIndex: number) => void;
  onSubmitted: () => void;
  onBack: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  answers,
  onEditQuestion,
  onSubmitted,
  onBack,
}) => {
  const hasPet = answers.tieneMascota && answers.tieneMascota.toLowerCase() !== 'no tengo';

  const items = [
    { num: 1, label: 'Nombre', val: answers.nombre, step: 0 },
    { num: 2, label: 'Rango de edad', val: answers.edad, step: 1 },
    { num: 3, label: 'Localidad / Barrio', val: answers.localidad, step: 2 },
    { num: 4, label: '¿Tienes mascota?', val: answers.tieneMascota, step: 3 },
  ];

  if (hasPet) {
    items.push(
      { num: 5, label: 'Frecuencia de paseo', val: answers.frecuenciaPaseo || 'No respondió', step: 4 },
      { num: 6, label: 'Qué usas hoy', val: answers.queUsaHoy || 'No respondió', step: 5 },
      { num: 7, label: 'Gasto mensual', val: answers.gastoMensual || 'No respondió', step: 6 },
      {
        num: 8,
        label: 'Importancia biodegradable',
        val: answers.importanciaBiodegradable ? `${answers.importanciaBiodegradable} de 5 ⭐` : 'No respondió',
        step: 7,
      },
      {
        num: 9,
        label: 'Más importante en una bolsa',
        val: answers.masImportanteBolsa?.join(', ') || 'No respondió',
        step: 8,
      },
      { num: 10, label: 'Precio suscripción mensual', val: answers.precioSuscripcion || 'No respondió', step: 9 },
      {
        num: 11,
        label: 'Dónde preferirías comprar',
        val: answers.dondeComprar?.join(', ') || 'No respondió',
        step: 10,
      }
    );
  }

  // Question 12 is at index 11 (if pet) or index 4 (if no pet)
  const stepPreocupaciones = hasPet ? 11 : 4;
  const stepNps = hasPet ? 12 : 5;
  const stepComentarios = hasPet ? 13 : 6;
  const stepWhatsapp = hasPet ? 14 : 7;

  items.push(
    {
      num: 12,
      label: 'Preocupaciones producto biodegradable',
      val: answers.preocupaciones?.join(', ') || 'Ninguna',
      step: stepPreocupaciones,
    },
    {
      num: 13,
      label: 'Recomendarías EcoGuardian',
      val: answers.nps !== null && answers.nps !== undefined ? `${answers.nps} / 10` : 'No respondió',
      step: stepNps,
    },
    {
      num: 14,
      label: 'Comentarios / Sugerencias',
      val: answers.comentarios?.trim() || 'Sin comentarios adicionales',
      step: stepComentarios,
    },
    {
      num: 15,
      label: 'WhatsApp de contacto',
      val: answers.whatsapp?.trim() || 'No proporcionado',
      step: stepWhatsapp,
    }
  );

  const handleSendToWhatsApp = () => {
    // 1. Save to localStorage backup
    saveSurvey(answers);

    // 2. Generate WhatsApp link
    const waUrl = generateWhatsAppLink(answers, Date.now());

    // 3. Open WhatsApp in new window/tab
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // 4. Transition to thank you screen
    onSubmitted();
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-10">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-[#E8F3ED] text-[#1F5C3A] mb-3 shadow-inner">
          <CheckCircle2 className="w-8 h-8 text-[#1F5C3A]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#154228]">
          Resumen de tu Encuesta
        </h2>
        <p className="text-sm text-[#4E6356] mt-1">
          Verifica tus respuestas antes de enviarlas al equipo fundador de EcoGuardian.
        </p>
      </div>

      {/* Answers List */}
      <div className="bg-white rounded-3xl border-2 border-[#E2E8E4] shadow-sm divide-y divide-[#EEF2EF] overflow-hidden mb-6">
        {items.map((item) => (
          <div
            key={item.num}
            className="p-3.5 sm:p-4 flex items-start justify-between gap-3 hover:bg-[#F9FAF8] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-[#5E7367] uppercase tracking-wider block">
                {item.num}. {item.label}
              </span>
              <p className="text-sm font-semibold text-[#1E2D24] mt-0.5 break-words">
                {item.val || '—'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onEditQuestion(item.step)}
              className="text-[#1F5C3A] hover:text-[#154228] p-1.5 rounded-lg hover:bg-[#E8F3ED] transition-colors shrink-0"
              title="Modificar respuesta"
              aria-label={`Editar pregunta ${item.num}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* WhatsApp Action Button */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleSendToWhatsApp}
          className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] active:scale-[0.98] text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg shadow-[#25D366]/30 transition-all cursor-pointer"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span>Enviar por WhatsApp</span>
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-[#5E7367] text-center pt-1">
          <ShieldCheck className="w-4 h-4 text-[#1F5C3A]" />
          <span>Se abrirá el chat con el número oficial (+57 304 379 5676)</span>
        </div>

        {/* Back navigation */}
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-[#4E6356] hover:bg-white/80 transition-colors flex items-center justify-center gap-1.5 mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Regresar a la última pregunta</span>
        </button>
      </div>
    </div>
  );
};
