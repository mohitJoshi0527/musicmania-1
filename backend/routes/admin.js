import express from "express";
import adminMiddleware from "../middleware/admin.js";
import {
  uploadSong,
  deleteSong,
  updateSong,
} from "../controllers/songController.js";
import { upload, handleUploadErrors } from "../config/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.use("/admin", adminMiddleware); // Add route prefix

router.post(
  "/songs",
  authMiddleware,
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  handleUploadErrors, // Add this after upload middleware
  uploadSong
);
router.delete("/songs/:id", deleteSong);

router.put(
  "/songs/:id",
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  handleUploadErrors,
  updateSong
);
export default router;
