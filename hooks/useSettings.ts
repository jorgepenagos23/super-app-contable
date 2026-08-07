'use client';

import { useState, useEffect } from 'react';

export interface AccountingSettings {
  toleranciaDiferencia: number; // Tolerancia en Pesos ($), defecto 1.00 MXN
  filtroProveedorRFC: string;   // Proveedor o RFC específico a conciliar (Ej: "PEÑAFIEL" o "PRO991231AAA")
}

const DEFAULT_SETTINGS: AccountingSettings = {
  toleranciaDiferencia: 1.00,
  filtroProveedorRFC: '',
};

export function useSettings() {
  const [settings, setSettings] = useState<AccountingSettings>(DEFAULT_SETTINGS);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('paral_accounting_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const updateSettings = (newSettings: Partial<AccountingSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('paral_accounting_settings', JSON.stringify(updated));
    }
  };

  const updateTolerancia = (nuevaTolerancia: number) => {
    updateSettings({ toleranciaDiferencia: Math.max(0, nuevaTolerancia) });
  };

  const updateFiltroProveedorRFC = (filtro: string) => {
    updateSettings({ filtroProveedorRFC: filtro.trim() });
  };

  return {
    settings,
    isMounted,
    toleranciaDiferencia: settings.toleranciaDiferencia,
    filtroProveedorRFC: settings.filtroProveedorRFC,
    updateTolerancia,
    updateFiltroProveedorRFC,
    updateSettings,
  };
}
