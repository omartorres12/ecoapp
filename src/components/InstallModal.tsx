import React from 'react';
import { Share, PlusSquare, X, Smartphone, Download } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  onInstallAndroid?: () => void;
  isInstallable?: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  onInstallAndroid,
  isInstallable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl p-6 shadow-2xl border border-[#E5E9E4] text-[#1E2D24] relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#1F5C3A]/10 rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1F5C3A] flex items-center justify-center text-white shadow-md">
            <Smartphone className="w-6 h-6 text-[#86EFAC]" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[#1F5C3A]">
              Instalar EcoGuardian
            </h3>
            <p className="text-xs text-[#5E7367]">
              Acceso rápido directo desde tu pantalla de inicio
            </p>
          </div>
        </div>

        {/* Content depending on iOS vs Android/Desktop */}
        {isIOS ? (
          <div className="space-y-4 my-2 text-sm text-[#3E5246]">
            <p className="text-xs text-[#5E7367] bg-[#E8F3ED] p-3 rounded-xl border border-[#CDE3D5]">
              En tu iPhone o iPad, instala la aplicación en 2 simples pasos desde Safari:
            </p>

            <div className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-xs">
              <div className="p-2 bg-[#E8F3ED] text-[#1F5C3A] rounded-xl shrink-0">
                <Share className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1F5C3A]">1. Toca el botón Compartir</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Está en la barra inferior de Safari (ícono de caja con flecha hacia arriba).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-xs">
              <div className="p-2 bg-[#E8F3ED] text-[#1F5C3A] rounded-xl shrink-0">
                <PlusSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1F5C3A]">2. "Agregar a inicio"</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Desliza hacia abajo en el menú y selecciona <strong>"Agregar a la pantalla de inicio"</strong>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 my-2 text-sm text-[#3E5246]">
            <p className="text-xs text-[#5E7367] bg-[#E8F3ED] p-3 rounded-xl border border-[#CDE3D5]">
              Instala la aplicación para responder encuestas sin conexión y recibir novedades exclusivas de EcoGuardian.
            </p>

            {isInstallable && onInstallAndroid ? (
              <button
                onClick={() => {
                  onInstallAndroid();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#1F5C3A] hover:bg-[#154228] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#1F5C3A]/25 transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                Instalar Ahora en este Dispositivo
              </button>
            ) : (
              <div className="p-3 bg-white rounded-2xl border border-gray-200 text-xs text-gray-600">
                Abre el menú de opciones de tu navegador (los tres puntos arriba a la derecha) y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
              </div>
            )}
          </div>
        )}

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 px-4 rounded-xl font-semibold text-xs text-[#5E7367] hover:bg-gray-100 transition-colors"
        >
          Entendido, gracias
        </button>
      </div>
    </div>
  );
};
