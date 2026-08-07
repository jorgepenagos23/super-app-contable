'use client';

import { useState, useEffect } from 'react';

export interface SupplierProfile {
  rfc: string;
  nombre: string;
  logoUrl?: string;
  colorBadge?: string;
  regimenFiscal?: string;
  emailContacto?: string;
  telefono?: string;
  direccionFiscal?: string;
  monedaHabitual?: string;
  toleranciaEspecifica?: number;
  diasCredito?: number;
  notasAuditoria?: string;
}

const STORAGE_KEY = 'paral_supplier_profiles_v1';

export function useSupplierProfiles() {
  const [profiles, setProfiles] = useState<Record<string, SupplierProfile>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setProfiles(JSON.parse(saved));
        } catch (e) {
          console.error('Error al cargar perfiles de proveedores:', e);
        }
      }
    }
  }, []);

  const saveProfile = (profile: SupplierProfile) => {
    const key = (profile.rfc || profile.nombre).toUpperCase().trim();
    if (!key) return;

    const updated = {
      ...profiles,
      [key]: profile,
    };

    setProfiles(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const getProfile = (rfcOrNombre: string): SupplierProfile | null => {
    if (!rfcOrNombre) return null;
    const clean = rfcOrNombre.toUpperCase().trim();
    return profiles[clean] || null;
  };

  const removeProfile = (rfcOrNombre: string) => {
    const clean = rfcOrNombre.toUpperCase().trim();
    if (!profiles[clean]) return;

    const updated = { ...profiles };
    delete updated[clean];
    setProfiles(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  return {
    profiles,
    isMounted,
    saveProfile,
    getProfile,
    removeProfile,
  };
}
