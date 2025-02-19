import { Trash2, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useSongStore } from "../stores/useSongStore";
import { motion } from "framer-motion";
import EditSongForm from "./EditSongForm"; // Import the EditSongForm

const SongList = () => {
  const { songs, fetchSongs, deleteSong, loading } = useSongStore();
  const [editSongId, setEditSongId] = useState(null); // Track song being edited

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleDelete = async (songId) => {
    if (confirm("Are you sure you want to delete this song?")) {
      await deleteSong(songId);
      fetchSongs(); // Refresh song list after deletion
    }
  };

  const handleEdit = (songId) => {
    setEditSongId(songId); // Set the songId to start editing
  };

  const handleCloseEditForm = () => {
    setEditSongId(null); // Close the edit form by resetting the songId
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-red-700 via-black to-red-700 text-white p-8 shadow-lg rounded-lg max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">
        🎵 Manage Songs
      </h2>

      {loading ? (
        <div className="text-center text-gray-300">Loading songs...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-900 text-white rounded-lg">
            <thead className="bg-black text-red-400">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Artist</th>
                <th className="px-6 py-3 text-left">Genre</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {songs.map((song) => (
                <tr key={song._id} className="hover:bg-gray-800 transition">
                  <td className="px-6 py-3">{song.title}</td>
                  <td className="px-6 py-3">{song.artist}</td>
                  <td className="px-6 py-3">{song.genre}</td>
                  <td className="px-6 py-3">₹{song.price}</td>
                  <td className="px-6 py-3 flex space-x-4">
                    <button
                      className="text-emerald-400 hover:text-emerald-300 transition"
                      onClick={() => handleEdit(song._id)}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300 transition"
                      onClick={() => handleDelete(song._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editSongId && (
        <div className="mt-6 p-6 bg-black rounded-lg shadow-lg">
          <button
            onClick={handleCloseEditForm}
            className="text-red-500 hover:text-red-700 mb-4 transition"
          >
            Close Edit Form
          </button>
          <EditSongForm songId={editSongId} />
        </div>
      )}
    </motion.div>
  );
};

export default SongList;
