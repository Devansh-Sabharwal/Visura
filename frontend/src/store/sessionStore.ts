// stores/sessionStore.ts
import { create } from "zustand";
import { Session } from "next-auth";

interface SessionState {
  session: Session | null;
  fastApiToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  fastApiToken: null,
  isLoading: true,
  isAuthenticated: false,

  setSession: (session) =>
    set({
      session,
      fastApiToken: session?.fastApiToken || null,
      isAuthenticated: !!session,
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  clearSession: () =>
    set({
      session: null,
      fastApiToken: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
