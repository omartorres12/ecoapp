import React from 'react';
import { Logo } from './Logo';
import { WifiOff, Download, Shield } from 'lucide-react';

interface HeaderProps {
  onAdminOpen: () => void;
  isOnline: boolean;
  isInstalled: boolean;
  isInstallable: boolean;
  onOpenInstallModal: () => void;
  showAdminButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onAdminOpen,
  isOnline,
  isInstalled,
  isInstallable,
  onOpenInstallModal,
  showAdminButton = false,
}) => {
  return (
    <header className="w-full bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#E8ECE6] sticky top-0 z-40 transition-colors">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Logo with 3s hold trigger */}
        <Logo size="sm" onAdminOpen={onAdminOpen} />

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Offline indicator */}
          {!isOnline && (
            <div
              className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full shadow-xs"
              title="Guardando localmente"
            >
              <WifiOff className="w-3 h-3 text-amber-700" />
              <span className="hidden sm:inline">Sin conexión</span>
            </div>
          )}

          {/* Quick install button */}
          {!isInstalled && (
            <button
              type="button"
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1F5C3A] bg-[#E8F3ED] hover:bg-[#D7EBE0] px-3 py-1.5 rounded-full transition-colors"
              title="Instalar App"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Instalar</span>
            </button>
          )}

          {/* Direct admin button if activated */}
          {showAdminButton && (
            <button
              type="button"
              onClick={onAdminOpen}
              className="p-1.5 text-[#1F5C3A] hover:bg-[#E8F3ED] rounded-lg transition-colors"
              title="Panel de Administración"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
