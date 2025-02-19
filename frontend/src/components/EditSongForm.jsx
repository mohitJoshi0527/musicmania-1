import React, { useState, useEffect } from "react";
import { useSongStore } from "../stores/useSongStore";
import { motion } from "framer-motion";

const EditSongForm = ({ songId, onClose }) => {
  const { songs, updateSong } = useSongStore();
  const [songDetails, setSongDetails] = useState({
    title: "",
    artist: "",
    genre: "",
    price: "",
    songFile: null,
    thumbnail: null,
  });
  const [loading, setLoading] = useState(false);

  const song = songs.find((song) => song._id === songId);

  useEffect(() => {
    if (song) {
      setSongDetails({
        title: song.title,
        artist: song.artist,
        genre: song.genre,
        price: song.price,
        songFile: null,
        thumbnail: null,
      });
    }
  }, [song]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSongDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setSongDetails((prev) => ({
      ...prev,
      [name]: files[0] ? files[0] : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", songDetails.title);
    formData.append("artist", songDetails.artist);
    formData.append("genre", songDetails.genre);
    formData.append("price", songDetails.price);

    if (songDetails.songFile) formData.append("song", songDetails.songFile);
    if (songDetails.thumbnail) formData.append("thumbnail", songDetails.thumbnail);

    try {
      await updateSong(songId, formData);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error updating song:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="edit-song-form p-6 rounded-lg shadow-lg bg-gradient-to-r from-gray-900 to-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl text-emerald-400 font-bold mb-4">Edit Song</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            name="title"
            value={songDetails.title}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:ring focus:ring-emerald-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Artist</label>
          <input
            type="text"
            name="artist"
            value={songDetails.artist}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:ring focus:ring-emerald-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Genre</label>
          <input
            type="text"
            name="genre"
            value={songDetails.genre}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:ring focus:ring-emerald-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Price</label>
          <input
            type="number"
            name="price"
            value={songDetails.price}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:ring focus:ring-emerald-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Song File</label>
          <input
            type="file"
            name="songFile"
            accept="audio/mp3"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:ring focus:ring-emerald-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Thumbnail</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-700 text-gray-200 focus:ring focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 text-white bg-emerald-500 rounded-lg transition hover:bg-emerald-600 focus:ring focus:ring-emerald-400"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </motion.div>
  );
};

export default EditSongForm;
