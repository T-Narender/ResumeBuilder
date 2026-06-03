import express from "express";
import {
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
  getUserResumes,
  extractResumeText,
} from "../controllers/resumeController.js";
import { uploadResumeImage } from "../controllers/uploadImages.js"; // Change from uploadResumeImages to uploadResumeImage
import { protect } from '../middleware/authMiddleware.js';
import { uploadPDF } from '../middleware/uploadMiddleware.js';

const resumeRouter = express.Router();

// ⚠️ NO auth middleware on this route
// Must be accessible by guest users
resumeRouter.post(
  '/extract-text',
  uploadPDF.single('resume'),
  extractResumeText
);

resumeRouter.post("/", protect, createResume);
resumeRouter.get("/", protect, getUserResumes);
resumeRouter.get("/:id", protect, getResumeById);

resumeRouter.put("/:id", protect, updateResume);
resumeRouter.put('/:id/upload-images', protect, uploadResumeImage); 

resumeRouter.delete("/:id", protect, deleteResume);


export default resumeRouter;