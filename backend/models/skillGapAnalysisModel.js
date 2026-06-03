import mongoose from "mongoose";

const skillGapAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    required: true
  },
  jobDescriptionHash: {
    type: String,
    required: true
  },
  analysis: {
    type: Object,
    required: true
  }
}, {
  timestamps: true
});

const SkillGapAnalysis = mongoose.model("SkillGapAnalysis", skillGapAnalysisSchema);

export default SkillGapAnalysis;
