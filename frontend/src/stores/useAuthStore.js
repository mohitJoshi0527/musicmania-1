import { create } from "zustand";
const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),

  checkAuth: async () => {
    set({ loading: true });
    try {
      const response = await fetch("https://musicmania-t7rb.onrender.com/api/auth/me", {
        credentials: "include", // Include cookies
      });

      if (!response.ok) throw new Error("Auth check failed");

      const data = await response.json();
      set({ user: data, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
      console.log("Auth check failed:", error);
    }
  },
}));
export default useAuthStore;
