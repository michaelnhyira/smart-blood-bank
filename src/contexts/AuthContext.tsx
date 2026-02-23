import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppUser } from '@/data/mockData';

interface AuthContextType {
  user: AppUser | null;
  users: AppUser[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (userData: Omit<AppUser, 'id' | 'donations'>) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const PERSONNEL_CODE = 'GH-NBS-SECURE-2479';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    const s = localStorage.getItem('bb_current_user');
    return s ? JSON.parse(s) : null;
  });
  const [users, setUsers] = useState<AppUser[]>(() => {
    const s = localStorage.getItem('bb_users');
    return s ? JSON.parse(s) : [];
  });

  const saveUsers = (u: AppUser[]) => {
    setUsers(u);
    localStorage.setItem('bb_users', JSON.stringify(u));
  };

  const login = (email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password.' };
    setUser(found);
    localStorage.setItem('bb_current_user', JSON.stringify(found));
    return { success: true };
  };

  const register = (userData: Omit<AppUser, 'id' | 'donations'>) => {
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered.' };
    }
    const newUser: AppUser = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      donations: userData.role === 'donor' && userData.lastDonationDate
        ? [{ date: userData.lastDonationDate, units: 1 }]
        : [],
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    setUser(newUser);
    localStorage.setItem('bb_current_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bb_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export { PERSONNEL_CODE };
