'use client';

import React, { useRef } from 'react';
import { FileSpreadsheet, Upload, CheckCircle2, X } from 'lucide-react';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  fileName?: string;
  totalParsedRows?: number;
  onClearFile?: () => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  isLoading = false,
  fileName,
  totalParsedRows = 0,
  onClearFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx, .xls, .csv"
        className="hidden"
      />

      {fileName ? (
        /* Estado: Archivo Cargado (Compacto Apple Style) */
        <div className="flex items-center justify-between p-3 bg-emerald-50/80 border border-emerald-300 rounded-2xl shadow-xs backdrop-blur-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-900 truncate">
                  {fileName}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-200 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 inline mr-1" />
                  {totalParsedRows > 0 ? `${totalParsedRows} facturas` : 'Listo'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onClearFile) onClearFile();
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="p-1.5 rounded-xl hover:bg-emerald-200 text-emerald-800 transition-all cursor-pointer"
            title="Cambiar archivo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Estado: Cargar Archivo (Minimalista Tipo Apple) */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-between p-3 bg-white border border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 flex items-center justify-center transition-all border border-slate-200">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-800 group-hover:text-emerald-700 transition-all block">
                Cargar Excel o CSV del SAT
              </span>
              <span className="text-[10px] font-medium text-slate-600">
                Arrastre o seleccione su archivo aquí
              </span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-xl bg-slate-100 group-hover:bg-emerald-600 text-slate-700 group-hover:text-white font-black text-xs border border-slate-300 group-hover:border-emerald-600 transition-all">
            Seleccionar
          </span>
        </div>
      )}
    </div>
  );
};
