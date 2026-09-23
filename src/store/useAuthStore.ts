import { create } from 'zustand';
import type { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  tokenBalance: number;
  createdAt: any;
  updatedAt: any;
}

interface AuthState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
}));
