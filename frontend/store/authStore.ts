import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface User {
  user_id: number;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

interface AuthState {
  isLogin: boolean;
  user: User | null;
  token: string | null;
  setCredentials: (user: User, token?: string) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isLogin: false,
        user: null,
        token: null,

        setCredentials: (user, token) =>
          set({
            isLogin: true,
            user,
            token: token || null,
          }),

        updateUser: (updates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          })),

        logout: () =>
          set({
            isLogin: false,
            user: null,
            token: null,
          }),
      }),
      {
        name: 'auth-storage',
      }
    ),
    { name: 'AuthStore' }
  )
);
