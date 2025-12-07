import express from "express";
import {
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
  getUserResumes,
} from "../controllers/resumeController.js";
import { uploadResumeImage } from "../controllers/uploadImages.js"; // Change from uploadResumeImages to uploadResumeImage
import { protect } from '../middleware/authMiddleware.js';

const resumeRouter = express.Router();

resumeRouter.post("/", protect, createResume);
resumeRouter.get("/", protect, getUserResumes);
resumeRouter.get("/:id", protect, getResumeById);

resumeRouter.put("/:id", protect, updateResume);
resumeRouter.put('/:id/upload-images', protect, uploadResumeImage); // Change from uploadResumeImages to uploadResumeImage

resumeRouter.delete("/:id", protect, deleteResume);


export default resumeRouter;