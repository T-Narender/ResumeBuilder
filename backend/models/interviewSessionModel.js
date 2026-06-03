import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema({
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
  questions: [{
    id: Number,
    question: String,
    type: { type: String, enum: ['behavioural', 'technical', 'situational'] },
    hint: String
  }],
  answers: [{
    questionId: Number,
    answer: String,
    score: Number,
    feedback: String,
    strongPoints: [String],
    improvements: [String],
    sampleAnswer: String
  }],
  overallScore: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);

export default InterviewSession;
