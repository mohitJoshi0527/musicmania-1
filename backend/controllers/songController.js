import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import Song from "../models/songs.model.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary Upload Helper
const uploadToCloudinary = (buffer, folder, resourceType) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

// ✅ Upload Song Controller
export const uploadSong = async (req, res) => {
  const { title, artist, genre, price } = req.body;
  const user = req.user;

  try {
    if (!req.files?.song?.[0] || !req.files?.thumbnail?.[0]) {
      return res.status(400).json({ message: "Both thumbnail and audio file are required." });
    }

    const songFile = req.files.song[0];
    if (songFile.mimetype !== "audio/mpeg") {
      return res.status(400).json({ message: "Only MP3 files are allowed." });
    }

    const [songUrl, thumbnailUrl] = await Promise.all([
      uploadToCloudinary(req.files.song[0].buffer, "songs", "raw"),
      uploadToCloudinary(req.files.thumbnail[0].buffer, "thumbnails", "image"),
    ]);

    const song = new Song({
      title,
      artist,
      genre,
      price,
      file_url: songUrl,
      thumbnail_url: thumbnailUrl,
      uploadedBy: user._id,
    });

    await song.save();
    res.status(201).json({ message: "Song uploaded successfully", song });
  } catch (error) {
    res.status(500).json({ message: "Error uploading song", error: error.message });
  }
};

// ✅ Get Songs Controller
export const getSongs = async (req, res) => {
  try {
    const songs = await Song.find().select("-uploadedBy");
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs", error: error.message });
  }
};

// ✅ Get Song by ID Controller
export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).select("-uploadedBy");
    if (!song) return res.status(404).json({ message: "Song not found" });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: "Error fetching song", error: error.message });
  }
};

// ✅ Delete Song from Cloudinary Helper
const deleteFromCloudinary = async (url, resourceType) => {
  const publicId = url.split("/upload/")[1].split(".")[0];
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

// ✅ Delete Song Controller
export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    await Promise.all([
      deleteFromCloudinary(song.file_url, "raw"),
      deleteFromCloudinary(song.thumbnail_url, "image"),
    ]);

    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting song", error: error.message });
  }
};

// ✅ Update Song Controller
export const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const existingSong = await Song.findById(id);
    if (!existingSong) return res.status(404).json({ message: "Song not found" });

    const updateData = { ...req.body };

    if (req.files?.song?.[0]) {
      await deleteFromCloudinary(existingSong.file_url, "raw");
      updateData.file_url = await uploadToCloudinary(req.files.song[0].buffer, "songs", "raw");
    }

    if (req.files?.thumbnail?.[0]) {
      await deleteFromCloudinary(existingSong.thumbnail_url, "image");
      updateData.thumbnail_url = await uploadToCloudinary(req.files.thumbnail[0].buffer, "thumbnails", "image");
    }

    const updatedSong = await Song.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: "Song updated successfully", song: updatedSong });
  } catch (error) {
    res.status(500).json({ message: "Error updating song", error: error.message });
  }
};

// ✅ Secure Download Song Controller
export const downloadSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ error: "Song not found" });

    if (song.price <= 0) {
      return handleDownload(song, res);
    }

    const purchase = await Purchase.findOne({
      user: req.user._id,
      song: req.params.id,
      status: "completed",
    });

    if (!purchase) {
      return res.status(403).json({
        error: "Purchase required. Please complete payment first.",
      });
    }

    handleDownload(song, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Secure Cloudinary Download Helper
const handleDownload = async (song, res) => {
  try {
    const publicId = song.file_url.split("/upload/")[1].split(".")[0];
    const downloadUrl = cloudinary.url(publicId, {
      resource_type: "raw",
      flags: "attachment",
      attachment_filename: `${song.title}.mp3`,
    });
    res.redirect(downloadUrl);
  } catch (error) {
    res.status(500).json({ error: "Download failed" });
  }
};
