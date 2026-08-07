export type UserRole = 'admin' | 'contador' | 'auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
  createdAt: string;
}

export type Permission =
  | 'upload_sat'
  | 'sync_erp'
  | 'export_excel'
  | 'manage_users'
  | 'view_dashboard';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ['upload_sat', 'sync_erp', 'export_excel', 'manage_users', 'view_dashboard'],
  contador: ['upload_sat', 'sync_erp', 'export_excel', 'view_dashboard'],
  auditor: ['export_excel', 'view_dashboard'],
};

export const ROLE_LABELS: Record<UserRole, { label: string; color: string; badgeBg: string }> = {
  admin: {
    label: 'Administrador',
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
  contador: {
    label: 'Contador PARAL',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  auditor: {
    label: 'Auditor Fiscal',
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
};
