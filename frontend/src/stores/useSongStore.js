import { create } from "zustand";
import { toast } from "react-hot-toast";

export const useSongStore = create((set, get) => ({
    songs: [],
    loading: false,
    error: null,

    // ✅ Fetch all songs
    fetchSongs: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch("http://localhost:5000/api/songs");
            if (!response.ok) throw new Error("Failed to fetch songs");
            const data = await response.json();
            set({ songs: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
            toast.error("Failed to load songs");
        }
    },

    // ✅ Create a new song with file upload
    createSong: async (formData) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch("http://localhost:5000/api/admin/songs", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create song");
            }

            const newSong = await response.json();
            set((state) => ({ songs: [newSong, ...state.songs], loading: false }));
            toast.success("Song created successfully!");
        } catch (error) {
            set({ error: error.message, loading: false });
            toast.error(error.message || "Error creating song");
        }
    },

    // ✅ Delete a song (Fixed API endpoint)
    deleteSong: async (songId) => {
        set({ loading: true, error: null });
        try {
            console.log("🔍 Deleting song with ID:", songId); // Debugging log

            const response = await fetch(`https://musicmania-t7rb.onrender.com/api/admin/songs/${songId}`, { 
                method: "DELETE",
                credentials: "include", // Ensure authentication is passed
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete song");
            }

            set((state) => ({ 
                songs: state.songs.filter(song => song._id !== songId), 
                loading: false 
            }));
            toast.success("Song deleted successfully!");
        } catch (error) {
            set({ error: error.message, loading: false });
            toast.error(error.message || "Error deleting song");
        }
    },

    // ✅ Update a song
    updateSong: async (songId, formData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`https://musicmania-t7rb.onrender.com/api/admin/songs/${songId}`, {
            method: "PUT",
            body: formData,
            credentials: "include",
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update song");
          }
    
          const updatedSong = await response.json();
          set((state) => ({
            songs: state.songs.map((song) =>
              song._id === songId ? updatedSong.song : song
            ),
            loading: false,
          }));
          toast.success("Song updated successfully!");
        } catch (error) {
          set({ error: error.message, loading: false });
          toast.error(error.message || "Error updating song");
        }
      },
    
}));
