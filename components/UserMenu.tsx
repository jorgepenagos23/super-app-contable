'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/types/auth';
import { Shield, ChevronDown, Check } from 'lucide-react';

interface UserMenuProps {
  onOpenUserManagement: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onOpenUserManagement }) => {
  const { currentUser, users, switchUser, hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const roleInfo = ROLE_LABELS[currentUser.role];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all text-xs focus:outline-none cursor-pointer"
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>

        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">
            {currentUser.name}
          </div>
          <div className="text-[10px] font-bold text-emerald-700">
            {roleInfo.label}
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-2 animate-fadeIn">
          {/* User Info Header */}
          <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
            <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
            <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
            <div className="mt-1.5">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${roleInfo.badgeBg}`}>
                {roleInfo.label}
              </span>
            </div>
          </div>

          {/* Quick User Switcher */}
          <div className="py-1">
            <div className="px-4 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Cambiar Usuario Rápidamente
            </div>
            {users.map((u) => {
              const isSelected = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer ${
                    isSelected ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                      {u.name.charAt(0)}
                    </span>
                    <span className="truncate">{u.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Management Trigger */}
          {hasPermission('manage_users') && (
            <div className="border-t border-slate-100 pt-1 mt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenUserManagement();
                }}
                className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Gestión de Usuarios...</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
