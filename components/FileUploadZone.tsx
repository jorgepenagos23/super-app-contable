'use client';

import React, { useRef } from 'react';
import { FileSpreadsheet, Upload, CheckCircle2, X } from 'lucide-react';

interface FileUploadZoneProps {
  onFileSelect?: (file: File) => void;
  onFileSelected?: (file: File) => void;
  isLoading?: boolean;
  fileName?: string;
  fileError?: string;
  totalParsedRows?: number;
  onClearFile?: () => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  onFileSelected,
  isLoading = false,
  fileName,
  fileError,
  totalParsedRows = 0,
  onClearFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notifyFileSelect = (file: File) => {
    if (onFileSelect) onFileSelect(file);
    if (onFileSelected) onFileSelected(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      notifyFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      notifyFileSelect(file);
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
        /* Estado: Archivo Cargado (Minimalista Apple Style) */
        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-xs text-slate-900 truncate">
                  {fileName}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-normal bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-600" />
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
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            title="Cambiar archivo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Estado: Cargar Archivo (Sleek Apple Style) */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-between p-2.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl cursor-pointer hover:bg-slate-50/80 transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 flex items-center justify-center transition-colors border border-slate-200 shrink-0">
              <Upload className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium text-slate-800 group-hover:text-emerald-700 transition-colors block truncate">
                Cargar auxiliares SAT (.xlsx / .csv)
              </span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-lg bg-slate-900 group-hover:bg-emerald-600 text-white font-medium text-xs transition-colors shrink-0">
            Examinar
          </span>
        </div>
      )}
    </div>
  );
};
