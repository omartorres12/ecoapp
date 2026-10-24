import { SurveyAnswers } from '../types';

export const ECOGUARDIAN_WHATSAPP_NUMBER = '573043795676';

export function formatWhatsAppMessage(answers: SurveyAnswers, timestamp?: number): string {
  const dateObj = timestamp ? new Date(timestamp) : new Date();
  const formattedDate = dateObj.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const lines: string[] = [
    '📋 *Nueva encuesta EcoGuardian*',
    '',
    `*1. Nombre:* ${answers.nombre || 'No especificado'}`,
    `*2. Rango de edad:* ${answers.edad || 'No especificado'}`,
    `*3. Localidad o barrio de Bogotá:* ${answers.localidad || 'No especificado'}`,
    `*4. ¿Tienes mascota?:* ${answers.tieneMascota || 'No especificado'}`,
  ];

  const hasPet = answers.tieneMascota && answers.tieneMascota.toLowerCase() !== 'no tengo';

  if (hasPet) {
    lines.push(`*5. ¿Con qué frecuencia sacas a tu mascota a pasear?:* ${answers.frecuenciaPaseo || 'No respondió'}`);
    lines.push(`*6. ¿Qué usas hoy para recoger las heces?:* ${answers.queUsaHoy || 'No respondió'}`);
    lines.push(`*7. ¿Cuánto gastas al mes en bolsas para tu mascota?:* ${answers.gastoMensual || 'No respondió'}`);
    lines.push(`*8. ¿Qué tan importante es para ti que la bolsa sea biodegradable?:* ${answers.importanciaBiodegradable ? `${answers.importanciaBiodegradable}/5 ⭐` : 'No respondió'}`);
    lines.push(`*9. ¿Qué es lo más importante al elegir una bolsa?:* ${answers.masImportanteBolsa && answers.masImportanteBolsa.length > 0 ? answers.masImportanteBolsa.join(', ') : 'No respondió'}`);
    lines.push(`*10. ¿Cuánto pagarías al mes por una suscripción de bolsas biodegradables con dispensador gratis?:* ${answers.precioSuscripcion || 'No respondió'}`);
    lines.push(`*11. ¿Dónde preferirías comprar?:* ${answers.dondeComprar && answers.dondeComprar.length > 0 ? answers.dondeComprar.join(', ') : 'No respondió'}`);
  } else {
    lines.push(`*Preguntas 5-11 (Mascota):* Saltadas (No tiene mascota)`);
  }

  lines.push(`*12. ¿Qué te preocupa de comprar un producto biodegradable?:* ${answers.preocupaciones && answers.preocupaciones.length > 0 ? answers.preocupaciones.join(', ') : 'No respondió'}`);
  lines.push(`*13. ¿Recomendarías EcoGuardian a un amigo?:* ${answers.nps !== null && answers.nps !== undefined ? `${answers.nps}/10` : 'No respondió'}`);
  lines.push(`*14. Comentarios o sugerencias:* ${answers.comentarios?.trim() ? answers.comentarios.trim() : 'Ninguno'}`);
  lines.push(`*15. Número de WhatsApp para contactarte:* ${answers.whatsapp?.trim() ? answers.whatsapp.trim() : 'No proporcionado'}`);
  lines.push('');
  lines.push(`📅 *Fecha y hora de envío:* ${formattedDate}`);

  return lines.join('\n');
}

export function generateWhatsAppLink(answers: SurveyAnswers, timestamp?: number): string {
  const message = formatWhatsAppMessage(answers, timestamp);
  return `https://wa.me/${ECOGUARDIAN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
