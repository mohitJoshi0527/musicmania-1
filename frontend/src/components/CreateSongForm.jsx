import { Upload, Loader, PlusCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSongStore } from "../stores/useSongStore";

const CreateSongForm = () => {
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    genre: "",
    price: 0,
    song: null,
    thumbnail: null,
  });

  const { createSong, loading } = useSongStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newSong.title);
    formData.append("artist", newSong.artist);
    formData.append("genre", newSong.genre);
    formData.append("price", newSong.price);
    if (newSong.song) formData.append("song", newSong.song);
    if (newSong.thumbnail) formData.append("thumbnail", newSong.thumbnail);

    await createSong(formData);
    setNewSong({ title: "", artist: "", genre: "", price: 0, song: null, thumbnail: null });
  };

  return (
    <motion.div
      className="bg-black bg-opacity-50 backdrop-blur-md shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto border border-red-500"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-extrabold text-white text-center">Create New Song</h2>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Song Title"
          className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white focus:ring-red-400 focus:border-red-400"
          value={newSong.title}
          onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Artist Name"
          className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white focus:ring-red-400 focus:border-red-400"
          value={newSong.artist}
          onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
          required
        />
        <input
          type="file"
          accept="audio/*"
          name="song"
          className="block w-full text-sm text-gray-400 border border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          onChange={(e) => setNewSong({ ...newSong, song: e.target.files[0] })}
          required
        />
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          className="block w-full text-sm text-gray-400 border border-gray-600 rounded-md shadow-sm focus:ring-red-400 focus:border-red-400"
          onChange={(e) => setNewSong({ ...newSong, thumbnail: e.target.files[0] })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white focus:ring-red-400 focus:border-red-400"
          value={newSong.price}
          onChange={(e) => setNewSong({ ...newSong, price: e.target.value })}
          min="0"
          required
        />
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" aria-hidden="true" />
              Create Song
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateSongForm;
