/**
 * Diccionario de Logotipos Oficiales de Proveedores de Grupo MV
 * Asigna automáticamente imágenes y marcas visuales reconocibles por Razón Social o RFC.
 */

export interface SupplierBrand {
  name: string;
  logoUrl: string;
  color: string;
}

const KNOWN_SUPPLIER_LOGOS: Record<string, SupplierBrand> = {
  PBE900712TV4: {
    name: 'Peñafiel',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pe%C3%B1afiel_logo.svg/512px-Pe%C3%B1afiel_logo.svg.png',
    color: '#0284c7',
  },
  PENAFIEL: {
    name: 'Peñafiel',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pe%C3%B1afiel_logo.svg/512px-Pe%C3%B1afiel_logo.svg.png',
    color: '#0284c7',
  },
  COCACOLA: {
    name: 'Coca Cola',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/512px-Coca-Cola_logo.svg.png',
    color: '#dc2626',
  },
  FEMSA: {
    name: 'Femsa',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Femsa_logo.svg/512px-Femsa_logo.svg.png',
    color: '#e11d48',
  },
  PARAL: {
    name: 'PARAL',
    logoUrl: '/screenshots/logo_gmv.png',
    color: '#059669',
  },
  GRUPOMV: {
    name: 'Grupo MV',
    logoUrl: '/screenshots/logo_gmv.png',
    color: '#0d9488',
  },
};

export function getSupplierBrandLogo(nombre: string, rfc?: string, customLogoUrl?: string): string | null {
  if (customLogoUrl && customLogoUrl.trim() !== '') {
    return customLogoUrl.trim();
  }

  const cleanRfc = (rfc || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const cleanNombre = (nombre || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  // 1. Coincidencia por RFC
  if (cleanRfc && KNOWN_SUPPLIER_LOGOS[cleanRfc]) {
    return KNOWN_SUPPLIER_LOGOS[cleanRfc].logoUrl;
  }

  // 2. Coincidencia por Nombre Comercial
  if (cleanNombre.includes('PENAFIEL') || cleanNombre.includes('BEBIDAS')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Pe%C3%B1afiel_logo.svg/512px-Pe%C3%B1afiel_logo.svg.png';
  }

  if (cleanNombre.includes('COCA') || cleanNombre.includes('FEMSA') || cleanNombre.includes('ARCA')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/512px-Coca-Cola_logo.svg.png';
  }

  if (cleanNombre.includes('PARAL') || cleanNombre.includes('GRUPOMV') || cleanNombre.includes('MV')) {
    return 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&auto=format&fit=crop&q=80';
  }

  if (cleanNombre.includes('NESTLE')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Nestl%C3%A9_textlogo.svg/512px-Nestl%C3%A9_textlogo.svg.png';
  }

  if (cleanNombre.includes('SIGMA')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Sigma_Alimentos_logo.svg/512px-Sigma_Alimentos_logo.svg.png';
  }

  return null;
}
