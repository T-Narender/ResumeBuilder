import fs from "fs";
import path from "path";
import Resume from "../models/resumeModel.js";
import multer from "multer";
import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Ensure uploads directory exists
// const uploadsDir = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Configure multer for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadsDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + '-' + file.originalname);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: function (req, file, cb) {
//     const allowedTypes = /jpeg|jpg|png|gif/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed'));
//     }
//   }
// });

// export const uploadResumeImage = (req, res) => {
//   try {
//     //configure multer to handle images
//     upload.fields([{ name: "thumbnail" }, { name: "profileImage" }])
//       (req, res, async (err) => {
//         if (err) {
//           return res.status(400).json({ message: "File upload failed", error: err.message });
//         }
//         const resumeId = req.params.id;
//         const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
//         if (!resume) {
//           return res.status(404).json({ message: "Resume not found" });
//         }
//         //Use process cwd to locate uploads folder
//         const uploadFolder = path.join(process.cwd(), "uploads");
//         const baseUrl = `${req.protocol}://${req.get("host")}`;

//         const newThumbnail = req.files.thumbnail?.[0];
//         const newProfileImage = req.files.profileImage?.[0];
//         //Update resume document with new image links
//         if (newThumbnail) {
//           if (resume.thumbnailLink) {
//             const oldThumbnail = path.join(uploadFolder, path.basename(resume.thumbnailLink));
//             if (fs.existsSync(oldThumbnail)) {
//               fs.unlinkSync(oldThumbnail);
//             }
//           }
//           resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
//         }

//         //same for profilePreviewImage
//         if (newProfileImage) {
//           if (resume.profileInfo?.profilePreviewUrl) {
//             const oldProfile = path.join(uploadFolder, path.basename(resume.profileInfo.profilePreviewUrl));
//             if (fs.existsSync(oldProfile)) {
//               fs.unlinkSync(oldProfile);
//             }
//           }
//           resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
//         }

//         await resume.save();
//         res.status(200).json({
//           message: "Images uploaded successfully",
//           thumbnailLink: resume.thumbnailLink,
//           profilePreviewUrl: resume.profileInfo?.profilePreviewUrl
//         });
//       })

//   } catch (error) {
//     console.error("Error uploading images:", error);
//     res.status(500).json({ message: "failed to upload images", error: error.message });

//   }
// }

// export const uploadImages = async (req, res) => {
//   const uploadSingle = upload.single('thumbnail');

//   uploadSingle(req, res, async function (err) {
//     if (err) {
//       console.error('Upload error:', err);
//       return res.status(400).json({ message: err.message });
//     }

//     try {
//       const { id: resumeId } = req.params;

//       if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//       }

//       const thumbnailLink = `${process.env.BASE_URL || 'http://localhost:30001'}/uploads/${req.file.filename}`;

//       // Update resume with thumbnail link
//       const resume = await Resume.findOneAndUpdate(
//         { _id: resumeId, userId: req.user.userId },
//         { thumbnailLink },
//         { new: true }
//       );

//       if (!resume) {
//         return res.status(404).json({ message: 'Resume not found' });
//       }

//       res.json({
//         thumbnailLink,
//         message: 'Image uploaded successfully'
//       });
//     } catch (error) {
//       console.error('Error updating resume:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
// };


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,"uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }

  const upload = multer({
    storage,
    fileFilter,
  });
  export default upload;