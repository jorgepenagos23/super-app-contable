'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  X,
  Upload,
  Check,
  Building,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  FileText,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { SupplierProfile } from '@/hooks/useSupplierProfiles';
import { ProveedorResumen } from '@/types/reconciliation';

interface SupplierConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  opcionesProveedores: ProveedorResumen[];
  initialSupplier?: string;
  onSaveProfile: (profile: SupplierProfile) => void;
  getProfile: (rfcOrNombre: string) => SupplierProfile | null;
  onDeleteProfile?: (rfcOrNombre: string) => void;
}

export const SupplierConfigModal: React.FC<SupplierConfigModalProps> = ({
  isOpen,
  onClose,
  opcionesProveedores,
  initialSupplier = '',
  onSaveProfile,
  getProfile,
  onDeleteProfile
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(initialSupplier);

  const [nombre, setNombre] = useState('');
  const [rfc, setRfc] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [regimenFiscal, setRegimenFiscal] = useState('601');
  const [emailContacto, setEmailContacto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccionFiscal, setDireccionFiscal] = useState('');
  const [monedaHabitual, setMonedaHabitual] = useState('MXN');
  const [toleranciaEspecifica, setToleranciaEspecifica] = useState<number>(1.00);
  const [diasCredito, setDiasCredito] = useState<number>(30);
  const [notasAuditoria, setNotasAuditoria] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (initialSupplier) {
      setSelectedKey(initialSupplier);
    } else if (opcionesProveedores.length > 0 && !selectedKey) {
      setSelectedKey(opcionesProveedores[0].rfc || opcionesProveedores[0].nombre);
    }
  }, [initialSupplier, opcionesProveedores]);

  useEffect(() => {
    if (!selectedKey) return;
    const existing = getProfile(selectedKey);

    if (existing) {
      setNombre(existing.nombre || '');
      setRfc(existing.rfc || '');
      setLogoUrl(existing.logoUrl || '');
      setRegimenFiscal(existing.regimenFiscal || '601');
      setEmailContacto(existing.emailContacto || '');
      setTelefono(existing.telefono || '');
      setDireccionFiscal(existing.direccionFiscal || '');
      setMonedaHabitual(existing.monedaHabitual || 'MXN');
      setToleranciaEspecifica(existing.toleranciaEspecifica ?? 1.00);
      setDiasCredito(existing.diasCredito ?? 30);
      setNotasAuditoria(existing.notasAuditoria || '');
    } else {
      // Si no existe perfil, autocompletar nombre/rfc del proveedor seleccionado
      const foundProv = opcionesProveedores.find(
        p => (p.rfc || p.nombre).toUpperCase().trim() === selectedKey.toUpperCase().trim()
      );
      setNombre(foundProv?.nombre || selectedKey);
      setRfc(foundProv?.rfc || (selectedKey.length === 12 || selectedKey.length === 13 ? selectedKey : ''));
      setLogoUrl('');
      setRegimenFiscal('601');
      setEmailContacto('');
      setTelefono('');
      setDireccionFiscal('');
      setMonedaHabitual('MXN');
      setToleranciaEspecifica(1.00);
      setDiasCredito(30);
      setNotasAuditoria('');
    }
  }, [selectedKey, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setLogoUrl(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() && !rfc.trim()) return;

    const profile: SupplierProfile = {
      rfc: rfc.toUpperCase().trim(),
      nombre: nombre.trim(),
      logoUrl,
      regimenFiscal,
      emailContacto: emailContacto.trim(),
      telefono: telefono.trim(),
      direccionFiscal: direccionFiscal.trim(),
      monedaHabitual,
      toleranciaEspecifica: Number(toleranciaEspecifica),
      diasCredito: Number(diasCredito),
      notasAuditoria: notasAuditoria.trim(),
    };

    onSaveProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleDelete = () => {
    if (!selectedKey || !onDeleteProfile) return;
    if (confirm(`¿Deseas eliminar la configuración personalizada de "${nombre || selectedKey}"?`)) {
      onDeleteProfile(selectedKey);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-[95vw] sm:w-full max-w-3xl bg-white border border-slate-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Espacio de Configuración del Proveedor
              </h3>
              <p className="text-xs text-slate-300">
                Personaliza marca, logotipo, datos fiscales y tolerancia contable por proveedor.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex flex-col gap-6 text-xs text-slate-700">
          
          {/* Selector de Proveedor */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-800 text-xs">Seleccionar Proveedor a Configurar:</span>
            </div>

            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="bg-white border border-slate-300 font-extrabold text-xs text-slate-900 rounded-xl px-3 py-2 outline-none cursor-pointer max-w-full sm:max-w-md"
            >
              {opcionesProveedores.map((prov, pIdx) => (
                <option key={pIdx} value={prov.rfc || prov.nombre}>
                  🏢 {prov.nombre} ({prov.rfc || 'Sin RFC'}) — {prov.count} facturas
                </option>
              ))}
            </select>
          </div>

          {/* Banner Previsualización con Logotipo */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-4">
              
              {/* Preview Avatar / Logo */}
              <div className="relative w-16 h-16 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo Proveedor" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-xl font-black text-slate-800">
                    {(nombre || 'P').slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider block mb-1">
                  {rfc || 'RFC NO REGISTRADO'}
                </span>
                <h4 className="text-base font-black text-white">{nombre || 'Nombre del Proveedor'}</h4>
                <span className="text-xs text-slate-400">
                  Régimen Fiscal: {regimenFiscal} • Moneda: {monedaHabitual}
                </span>
              </div>
            </div>

            {/* Upload Logo Button */}
            <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer flex items-center gap-2 shrink-0">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Subir Logotipo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Secciones de Configuración en Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Columna 1: Identificación Fiscal & Logotipo */}
            <div className="flex flex-col gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              <span className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-2 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                Identificación & Imagen Corporativa
              </span>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">Razón Social / Nombre Comercial:</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="ej: PEÑAFIEL BEBIDAS SA DE CV"
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">RFC del Proveedor:</label>
                <input
                  type="text"
                  value={rfc}
                  onChange={(e) => setRfc(e.target.value.toUpperCase())}
                  placeholder="ej: PBE900712TV4"
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">URL del Logotipo (Opcional):</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://empresa.com/logo.png o base64"
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">Régimen Fiscal (SAT):</label>
                <select
                  value={regimenFiscal}
                  onChange={(e) => setRegimenFiscal(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                >
                  <option value="601">601 - General de Ley Personas Morales</option>
                  <option value="626">626 - Régimen Simplificado de Confianza (RESICO)</option>
                  <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                  <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                  <option value="625">625 - Régimen de las Actividades Empresariales con Plataformas Tecnológicas</option>
                </select>
              </div>
            </div>

            {/* Columna 2: Contacto & Parámetros Contables */}
            <div className="flex flex-col gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              <span className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-2 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                Parámetros Contables & Contacto
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-500" />
                    Correo Facturación:
                  </label>
                  <input
                    type="email"
                    value={emailContacto}
                    onChange={(e) => setEmailContacto(e.target.value)}
                    placeholder="facturacion@proveedor.com"
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    Teléfono Contacto:
                  </label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="55-1234-5678"
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">Tolerancia Específica ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={toleranciaEspecifica}
                    onChange={(e) => setToleranciaEspecifica(Number(e.target.value))}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">Días Crédito CXP:</label>
                  <input
                    type="number"
                    value={diasCredito}
                    onChange={(e) => setDiasCredito(Number(e.target.value))}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">Notas de Auditoría Contable:</label>
                <textarea
                  rows={2}
                  value={notasAuditoria}
                  onChange={(e) => setNotasAuditoria(e.target.value)}
                  placeholder="Ej: Proveedor autoriza conciliación de centavos por tipo de cambio. Solicitar complementos PPD..."
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {onDeleteProfile && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Restablecer Proveedor</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>¡Guardado!</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Guardar Configuración del Proveedor</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
