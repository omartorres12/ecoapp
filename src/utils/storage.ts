import { SavedSurveyRecord, SurveyAnswers } from '../types';

const STORAGE_KEY = 'ecoguardian_surveys_backup';
const CURRENT_DRAFT_KEY = 'ecoguardian_survey_draft';

export function getSavedSurveys(): SavedSurveyRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading saved surveys from localStorage', err);
    return [];
  }
}

export function saveSurvey(answers: SurveyAnswers): SavedSurveyRecord {
  const now = Date.now();
  const dateStr = new Date(now).toISOString();
  const newRecord: SavedSurveyRecord = {
    id: `eco_${now}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: dateStr,
    timestamp: now,
    answers: { ...answers }
  };

  try {
    const current = getSavedSurveys();
    const updated = [newRecord, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.removeItem(CURRENT_DRAFT_KEY);
  } catch (err) {
    console.error('Error saving survey to localStorage', err);
  }

  return newRecord;
}

export function deleteSurvey(id: string): SavedSurveyRecord[] {
  try {
    const current = getSavedSurveys();
    const filtered = current.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Error deleting survey', err);
    return [];
  }
}

export function clearAllSurveys(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing surveys', err);
  }
}

export function saveDraft(answers: Partial<SurveyAnswers>, currentStep: number): void {
  try {
    localStorage.setItem(CURRENT_DRAFT_KEY, JSON.stringify({ answers, currentStep }));
  } catch (err) {
    console.error('Error saving draft', err);
  }
}

export function loadDraft(): { answers: Partial<SurveyAnswers>; currentStep: number } | null {
  try {
    const raw = localStorage.getItem(CURRENT_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(CURRENT_DRAFT_KEY);
  } catch (err) {
    console.error('Error clearing draft', err);
  }
}

export function exportSurveysToCSV(surveys: SavedSurveyRecord[]): void {
  if (surveys.length === 0) {
    alert('No hay encuestas guardadas para exportar.');
    return;
  }

  const headers = [
    'ID',
    'Fecha',
    'Hora',
    '1. Nombre',
    '2. Rango de Edad',
    '3. Localidad / Barrio',
    '4. ¿Tiene Mascota?',
    '5. Frecuencia Paseo',
    '6. Qué Usa Hoy',
    '7. Gasto Mensual en Bolsas',
    '8. Importancia Biodegradable (1-5)',
    '9. Lo Más Importante',
    '10. Disposición Suscripción',
    '11. Dónde Comprar',
    '12. Preocupaciones Biodegradable',
    '13. NPS Recomendaría (0-10)',
    '14. Comentarios',
    '15. WhatsApp Contacto'
  ];

  const escapeCSV = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = surveys.map(record => {
    const d = new Date(record.timestamp || record.createdAt);
    const datePart = d.toLocaleDateString('es-CO');
    const timePart = d.toLocaleTimeString('es-CO');
    const a = record.answers;

    return [
      escapeCSV(record.id),
      escapeCSV(datePart),
      escapeCSV(timePart),
      escapeCSV(a.nombre),
      escapeCSV(a.edad),
      escapeCSV(a.localidad),
      escapeCSV(a.tieneMascota),
      escapeCSV(a.frecuenciaPaseo || 'N/A'),
      escapeCSV(a.queUsaHoy || 'N/A'),
      escapeCSV(a.gastoMensual || 'N/A'),
      escapeCSV(a.importanciaBiodegradable || 'N/A'),
      escapeCSV(a.masImportanteBolsa ? a.masImportanteBolsa.join('; ') : 'N/A'),
      escapeCSV(a.precioSuscripcion || 'N/A'),
      escapeCSV(a.dondeComprar ? a.dondeComprar.join('; ') : 'N/A'),
      escapeCSV(a.preocupaciones ? a.preocupaciones.join('; ') : 'N/A'),
      escapeCSV(a.nps !== null && a.nps !== undefined ? a.nps : 'N/A'),
      escapeCSV(a.comentarios || ''),
      escapeCSV(a.whatsapp || '')
    ].join(',');
  });

  // UTF-8 BOM for Microsoft Excel in Spanish
  const csvContent = '\uFEFF' + [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const fileDate = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `encuestas_ecoguardian_${fileDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
