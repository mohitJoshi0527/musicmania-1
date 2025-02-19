import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuthStore from "./useAuthStore";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      syncAuthState: () => {
        const { user } = get();
        if (user) {
          useAuthStore.getState().setUser(user); // Sync with Auth Store
        }
      },

      // Login
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("https://musicmania-32nu.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include", // Include cookies
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Invalid credentials");
          }

          const { user } = await response.json();
          useAuthStore.getState().setUser(user);
          set({ user, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
      // Signup
      signup: async (formData) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch(
            "https://musicmania-32nu.onrender.com/api/auth/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error creating account.");
          }

          const data = await response.json();
          set({ user: data.user, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      // Logout
      logout: async () => {
        set({ loading: true });
        try {
          // ✅ Fix URL to match backend route
          await fetch("https://musicmania-32nu.onrender.com/api/auth/logout", {
            method: "POST",
            credentials: "include", // Include cookies
          });
      
          // ✅ Clear ALL client-side state
          useAuthStore.getState().clearUser();
          localStorage.removeItem("userStore"); // Clear persisted storage
          set({ user: null, token: null, error: null });
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "userStore", // Name for localStorage persistence
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);

export default useUserStore;
