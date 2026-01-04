import Resume from "../models/resumeModel.js";
import fs from "fs";
import path from "path";

// Create new resume
export const createResume = async (req, res) => {
    try {
        const { title } = req.body;
        // Define default structure for a new resume
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                    category: 'Other Tools',
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };

        const newResume = await Resume.create({
            userId: req.user._id,
            title,
            ...defaultResumeData,
            ...req.body
        });
        res.status(201).json(newResume);
    } catch (error) {
        console.error("Create resume error:", error);
        res.status(500).json({ message: "Failed to create resume", error: error.message });
    }
};

// Get all resumes for user
export const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({
            updatedAt: -1,
        });
        res.json(resumes);
    } catch (error) {
        console.error("Get resumes error:", error);
        res.status(500).json({ message: "Failed to get resumes", error: error.message });
    }
};

// Get single resume by ID
export const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.json(resume);
    } catch (error) {
        console.error("Get resume error:", error);
        res.status(500).json({ message: "Failed to get resume", error: error.message });
    }
};

// Update resume
export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne(
            { _id: req.params.id, userId: req.user._id },
        );
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        //merge updated resumes
        Object.assign(resume, req.body);
        //save updated resume
        const savedResume = await resume.save();
        res.json(savedResume);
    } catch (error) {
        console.error("Update resume error:", error);
        res.status(500).json({ message: "Failed to update resume", error: error.message });
    }
};

// Delete resume and associated files
export const deleteResume = async (req, res) => {
    try {
        console.log(`Deleting resume ${req.params.id} for user ${req.user._id}`);

        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Create uploads folder path
        const uploadsFolder = path.join(process.cwd(), 'uploads');

        // Delete thumbnail file if exists
        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
            if (fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail);
            }
        }

        // Delete profile image if exists
        if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
            if (fs.existsSync(oldProfile)) {
                fs.unlinkSync(oldProfile);
            }
        }

        // Delete the resume from database
        await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        res.json({ message: "Resume and associated files deleted successfully" });

    } catch (error) {
        console.error("Delete resume error:", error);
        res.status(500).json({
            message: "Failed to delete resume",
            error: error.message
        });
    }
};