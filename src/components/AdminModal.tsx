import React, { useState, useEffect } from 'react';
import { SavedSurveyRecord } from '../types';
import { getSavedSurveys, deleteSurvey, clearAllSurveys, exportSurveysToCSV, saveSurvey } from '../utils/storage';
import {
  X,
  Download,
  Trash2,
  Database,
  Search,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Users,
  Heart,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [surveys, setSurveys] = useState<SavedSurveyRecord[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshList = () => {
    setSurveys(getSavedSurveys());
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Deseas eliminar esta respuesta?')) {
      const updated = deleteSurvey(id);
      setSurveys(updated);
    }
  };

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de borrar TODAS las encuestas guardadas localmente? Esta acción no se puede deshacer.')) {
      clearAllSurveys();
      setSurveys([]);
    }
  };

  const handleAddSampleData = () => {
    const sample1 = {
      nombre: 'Catalina Gómez',
      edad: '25-34',
      localidad: 'Chapinero',
      tieneMascota: 'Perro',
      frecuenciaPaseo: 'Varias veces al día',
      queUsaHoy: 'Bolsa plástica común',
      gastoMensual: '$10.000-$20.000',
      importanciaBiodegradable: 5,
      masImportanteBolsa: ['Resistencia', 'Que sea biodegradable'],
      precioSuscripcion: '$15.000-$25.000',
      dondeComprar: ['Página web', 'WhatsApp'],
      preocupaciones: ['Que se rompa'],
      nps: 10,
      comentarios: 'Me encantaría que el dispensador fuera de tela reutilizable.',
      whatsapp: '3104567890'
    };

    const sample2 = {
      nombre: 'Carlos Morales',
      edad: '35-44',
      localidad: 'Usaquén',
      tieneMascota: 'Perro',
      frecuenciaPaseo: 'Una vez al día',
      queUsaHoy: 'Bolsa biodegradable',
      gastoMensual: '$5.000-$10.000',
      importanciaBiodegradable: 4,
      masImportanteBolsa: ['Que sea biodegradable', 'Precio'],
      precioSuscripcion: '$10.000-$15.000',
      dondeComprar: ['Supermercado', 'Veterinaria'],
      preocupaciones: ['Dudo de que sea biodegradable de verdad'],
      nps: 9,
      comentarios: 'Que certifiquen la norma de biodegradabilidad en el empaque.',
      whatsapp: '3158901234'
    };

    saveSurvey(sample1);
    saveSurvey(sample2);
    refreshList();
  };

  // Metrics
  const totalCount = surveys.length;
  const npsValues = surveys
    .map((s) => s.answers.nps)
    .filter((n): n is number => n !== null && n !== undefined);
  const avgNps = npsValues.length > 0
    ? (npsValues.reduce((a, b) => a + b, 0) / npsValues.length).toFixed(1)
    : 'N/A';

  const petOwnersCount = surveys.filter(
    (s) => s.answers.tieneMascota && s.answers.tieneMascota.toLowerCase() !== 'no tengo'
  ).length;

  const filteredSurveys = surveys.filter((s) => {
    const q = searchQuery.toLowerCase();
    const name = s.answers.nombre?.toLowerCase() || '';
    const loc = s.answers.localidad?.toLowerCase() || '';
    const pet = s.answers.tieneMascota?.toLowerCase() || '';
    return name.includes(q) || loc.includes(q) || pet.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#FFFDF9] rounded-3xl shadow-2xl border border-[#DCE4DE] max-h-[92vh] flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#1F5C3A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#86EFAC]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg">Panel de Administración</h3>
                <span className="text-[10px] uppercase font-bold bg-[#86EFAC] text-[#143D27] px-2 py-0.5 rounded-full">
                  Exclusivo
                </span>
              </div>
              <p className="text-xs text-white/80">
                Respaldo local de respuestas recopiladas en Bogotá
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar panel admin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-3 gap-2 p-3 sm:p-4 bg-[#F2F7F4] border-b border-[#DDE7E1] shrink-0 text-center">
          <div className="bg-white p-2.5 rounded-2xl border border-[#DDE7E1]">
            <p className="text-[11px] font-bold text-[#5E7367] flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#1F5C3A]" />
              Total Encuestas
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#1F5C3A] mt-0.5">{totalCount}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-[#DDE7E1]">
            <p className="text-[11px] font-bold text-[#5E7367] flex items-center justify-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-[#1F5C3A]" />
              NPS Promedio
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#1F5C3A] mt-0.5">
              {avgNps} <span className="text-xs font-normal text-gray-500">/10</span>
            </p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-[#DDE7E1]">
            <p className="text-[11px] font-bold text-[#5E7367] flex items-center justify-center gap-1">
              <Heart className="w-3.5 h-3.5 text-[#1F5C3A]" />
              Con Mascota
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#1F5C3A] mt-0.5">
              {totalCount > 0 ? `${Math.round((petOwnersCount / totalCount) * 100)}%` : '0%'}
            </p>
          </div>
        </div>

        {/* Toolbar: Export, Search, Actions */}
        <div className="p-3 sm:p-4 border-b border-[#E2E8E4] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, localidad o mascota..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#1F5C3A]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportSurveysToCSV(surveys)}
              disabled={surveys.length === 0}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                surveys.length > 0
                  ? 'bg-[#1F5C3A] hover:bg-[#154228] text-white cursor-pointer active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>

            {surveys.length === 0 && (
              <button
                onClick={handleAddSampleData}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-[#E8F3ED] text-[#1F5C3A] hover:bg-[#D7EBE0] transition-colors"
                title="Generar 2 respuestas de ejemplo"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Ejemplos</span>
              </button>
            )}

            {surveys.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Borrar todo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* List of Surveys */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {filteredSurveys.length === 0 ? (
            <div className="text-center py-12 text-[#5E7367]">
              <Database className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">No hay encuestas registradas aún</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Las encuestas completadas se respaldan automáticamente aquí en localStorage. Puedes pulsar "Ejemplos" para cargar datos de prueba.
              </p>
              <button
                onClick={handleAddSampleData}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1F5C3A] text-white hover:bg-[#154228] transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Cargar datos de prueba
              </button>
            </div>
          ) : (
            filteredSurveys.map((record, idx) => {
              const isExpanded = expandedId === record.id;
              const d = new Date(record.timestamp || record.createdAt);
              const dateFormatted = d.toLocaleDateString('es-CO', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              const a = record.answers;

              return (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl border border-[#DCE4DE] overflow-hidden shadow-xs hover:border-[#1F5C3A]/40 transition-all"
                >
                  {/* Card Row Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                    className="p-3 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-[#E8F3ED] text-[#1F5C3A] text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-[#1E2D24] truncate">
                            {a.nombre || 'Anónimo'}
                          </p>
                          <span className="text-[10px] bg-[#E8F3ED] text-[#1F5C3A] font-semibold px-2 py-0.5 rounded-full shrink-0">
                            {a.localidad || 'Bogotá'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5E7367]">
                          {dateFormatted} • {a.tieneMascota} • NPS: {a.nps ?? '—'}/10
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleDelete(record.id, e)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Eliminar respuesta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="p-1 text-gray-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Accordion Details */}
                  {isExpanded && (
                    <div className="p-4 bg-[#F9FAF8] border-t border-[#EAEFEA] text-xs space-y-2 text-[#2D3E33]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <p><strong>Rango de edad:</strong> {a.edad || '—'}</p>
                        <p><strong>Mascota:</strong> {a.tieneMascota}</p>
                        {a.frecuenciaPaseo && <p><strong>Frecuencia paseo:</strong> {a.frecuenciaPaseo}</p>}
                        {a.queUsaHoy && <p><strong>Qué usa hoy:</strong> {a.queUsaHoy}</p>}
                        {a.gastoMensual && <p><strong>Gasto mensual:</strong> {a.gastoMensual}</p>}
                        {a.importanciaBiodegradable && <p><strong>Importancia biodegradable:</strong> {a.importanciaBiodegradable} / 5 ⭐</p>}
                        {a.precioSuscripcion && <p><strong>Suscripción:</strong> {a.precioSuscripcion}</p>}
                        {a.masImportanteBolsa && (
                          <p className="sm:col-span-2">
                            <strong>Más importante:</strong> {a.masImportanteBolsa.join(', ')}
                          </p>
                        )}
                        {a.dondeComprar && (
                          <p className="sm:col-span-2">
                            <strong>Dónde comprar:</strong> {a.dondeComprar.join(', ')}
                          </p>
                        )}
                        {a.preocupaciones && (
                          <p className="sm:col-span-2">
                            <strong>Preocupaciones:</strong> {a.preocupaciones.join(', ')}
                          </p>
                        )}
                        <p><strong>Recomendaría (NPS):</strong> {a.nps ?? '—'} / 10</p>
                        <p><strong>WhatsApp:</strong> {a.whatsapp || 'No proporcionado'}</p>
                      </div>
                      {a.comentarios && (
                        <div className="pt-2 border-t border-gray-200">
                          <strong>Comentarios:</strong>
                          <p className="mt-0.5 text-gray-700 italic bg-white p-2 rounded-lg border border-gray-200">
                            "{a.comentarios}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-[#E2E8E4] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1F5C3A] text-white text-xs font-bold rounded-xl hover:bg-[#154228] transition-colors"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
