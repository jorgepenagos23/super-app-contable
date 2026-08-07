'use client';

import React from 'react';

interface PaymentMethodBadgeProps {
  method: string;
}

export const PaymentMethodBadge: React.FC<PaymentMethodBadgeProps> = ({ method }) => {
  const upper = String(method || '').toUpperCase();

  if (upper.includes('PUE')) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold bg-sky-100 text-sky-800 border border-sky-300 shadow-sm" title="Pago en Una sola Exhibición">
        PUE
      </span>
    );
  }

  if (upper.includes('PPD')) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 shadow-sm" title="Pago en Parcialidades o Diferido">
        PPD
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
      {method || 'N/A'}
    </span>
  );
};
