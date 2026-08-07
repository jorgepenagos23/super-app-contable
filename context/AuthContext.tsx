'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Permission, ROLE_PERMISSIONS } from '@/types/auth';

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Jorge Ramírez (Super Admin)',
    email: 'jorge.ramirez@grupomv.mx',
    role: 'admin',
    active: true,
    createdAt: '2025-01-01',
  },
  {
    id: 'usr-2',
    name: 'Laura Contabilidad',
    email: 'laura.contable@paral.com.mx',
    role: 'contador',
    active: true,
    createdAt: '2025-01-05',
  },
  {
    id: 'usr-3',
    name: 'Carlos Auditor SAT',
    email: 'carlos.auditor@fiscal.com.mx',
    role: 'auditor',
    active: true,
    createdAt: '2025-01-10',
  },
];

interface AuthContextType {
  currentUser: User;
  users: User[];
  isMounted: boolean;
  switchUser: (userId: string) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('usr-1');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Sincronizar localStorage únicamente en el cliente tras el montaje (Evita Hydration Mismatch)
  useEffect(() => {
    setIsMounted(true);
    const savedUsers = localStorage.getItem('superapp_users');
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (e) {}
    }
    const savedUserId = localStorage.getItem('superapp_current_user_id');
    if (savedUserId) {
      setCurrentUserId(savedUserId);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('superapp_users', JSON.stringify(users));
    }
  }, [users, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('superapp_current_user_id', currentUserId);
    }
  }, [currentUserId, isMounted]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || DEFAULT_USERS[0];

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId && u.active);
    if (target) {
      setCurrentUserId(target.id);
    }
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, active: !u.active } : u))
    );
  };

  const deleteUser = (userId: string) => {
    if (users.length <= 1) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUserId === userId) {
      const remaining = users.filter((u) => u.id !== userId);
      if (remaining.length > 0) setCurrentUserId(remaining[0].id);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    const allowed = ROLE_PERMISSIONS[currentUser.role] || [];
    return allowed.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isMounted,
        switchUser,
        addUser,
        updateUserRole,
        toggleUserStatus,
        deleteUser,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
