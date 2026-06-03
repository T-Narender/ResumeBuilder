import crypto from 'crypto';
import Resume from '../models/resumeModel.js';
import SkillGapAnalysis from '../models/skillGapAnalysisModel.js';
import InterviewSession from '../models/interviewSessionModel.js';
import { generateContent } from '../utils/aiProvider.js';

export const generateContentController = async (req, res) => {
    try {
        const { prompt, regenerate = false } = req.body;
        if (!prompt) {
            return res.status(400).json({ message: "prompt is required" });
        }
        const response = await generateContent(prompt, regenerate);
        res.status(200).json({ response });
    } catch (error) {
        console.error("Error in generateContentController:", error);
        res.status(500).json({ message: "Failed to generate content", error: error.message });
    }
};

export const improveBullet = async (req, res) => {
    try {
        const { bulletText, jobTitle, regenerate = false } = req.body;

        if (!bulletText) {
            return res.status(400).json({ message: "bulletText is required" });
        }

        const prompt = `You are an expert resume writer. Rewrite the following resume bullet point using the STAR method with a strong action verb and a quantifiable metric. If no metric exists, estimate a realistic one based on context. Keep it under 20 words. Return ONLY valid JSON: { "original": "...", "improved": "...", "explanation": "..." }

Job title the user is targeting: ${jobTitle || 'General'}
Bullet point: ${bulletText}`;

        const text = await generateContent(prompt, regenerate);

        // Parse JSON from text, removing potential markdown blocks
        let jsonStr = text;
        if (text.includes("```json")) {
            jsonStr = text.split("```json")[1].split("```")[0].trim();
        } else if (text.includes("```")) {
            jsonStr = text.split("```")[1].split("```")[0].trim();
        }

        const parsedJson = JSON.parse(jsonStr);
        res.status(200).json(parsedJson);

    } catch (error) {
        console.error("Error in improveBullet:", error);
        res.status(500).json({ message: "Failed to improve bullet point", error: error.message });
    }
};

export const analyzeSkillGap = async (req, res) => {
  try {
    const { 
      resumeId,
      resumeText,
      jobDescription, 
      regenerate = false 
    } = req.body

    // Validate inputs
    if (!resumeId && !resumeText) {
      return res.status(400).json({ 
        message: 'resumeId or resumeText is required' 
      })
    }
    if (!jobDescription) {
      return res.status(400).json({ 
        message: 'jobDescription is required' 
      })
    }

    let resumeContent
    let userId = null
    let resumeIdForCache = null

    if (resumeId) {
      // ── OLD FLOW (unchanged) ──
      const resume = await Resume.findById(resumeId)
      if (!resume) {
        return res.status(404).json({ 
          message: 'Resume not found' 
        })
      }
      userId = resume.userId
      resumeIdForCache = resumeId

      // Check existing analysis cache (24h)
      const jobDescriptionHash = crypto
        .createHash('md5')
        .update(jobDescription)
        .digest('hex')
      
      const twentyFourHoursAgo = new Date(
        Date.now() - 24 * 60 * 60 * 1000)
      
      const existingAnalysis = await 
        SkillGapAnalysis.findOne({
          resumeId,
          jobDescriptionHash,
          createdAt: { $gte: twentyFourHoursAgo }
        })

      if (existingAnalysis && !regenerate) {
        return res.status(200).json(
          existingAnalysis.analysis)
      }

      // Normalize to JSON
      resumeContent = JSON.stringify({
        profileInfo: resume.profileInfo,
        workExperience: resume.workExperience,
        education: resume.education,
        skills: resume.skills,
        projects: resume.projects,
        certifications: resume.certifications
      })

    } else {
      // ── NEW GUEST FLOW ──
      // Normalize raw text to same JSON format
      resumeContent = JSON.stringify({
        rawResumeText: resumeText
      })
    }

    // AI prompt - same for both flows
    const prompt = `You are a career coach and skills expert. Analyze the gap between the candidate's current skills and the target job requirements. Return ONLY valid JSON (no markdown wrapping):
{
  "matchPercentage": <0-100>,
  "hasSkills": ["..."],
  "missingSkills": [{ 
    "skill": "...", 
    "importance": "...", 
    "learningTime": "...", 
    "difficulty": "beginner|intermediate|advanced"
  }],
  "partialSkills": [{ 
    "skill": "...", 
    "gap": "..." 
  }],
  "roadmap": [{ 
    "week": "Week 1-2", 
    "focus": "...", 
    "resources": [{ 
      "name": "...", 
      "url": "...", 
      "type": "course|book|project" 
    }], 
    "dailyHours": <number> 
  }],
  "resumeSuggestions": [{ 
    "section": "skills|experience|summary", 
    "suggestion": "..." 
  }]
}

Full resume context: ${resumeContent}
Target job description: ${jobDescription}`

    const text = await generateContent(prompt, regenerate)

    let jsonStr = text
    if (text.includes("```json")) {
      jsonStr = text.split("```json")[1]
        .split("```")[0].trim()
    } else if (text.includes("```")) {
      jsonStr = text.split("```")[1]
        .split("```")[0].trim()
    }
    const parsedJson = JSON.parse(jsonStr)

    // Save analysis only for existing users
    if (resumeIdForCache && userId) {
      const jobDescriptionHash = crypto
        .createHash('md5')
        .update(jobDescription)
        .digest('hex')

      const existingAnalysis = await 
        SkillGapAnalysis.findOne({ 
          resumeId: resumeIdForCache,
          jobDescriptionHash 
        })

      if (existingAnalysis) {
        existingAnalysis.analysis = parsedJson
        await existingAnalysis.save()
      } else {
        await SkillGapAnalysis.create({
          userId,
          resumeId: resumeIdForCache,
          jobDescriptionHash,
          analysis: parsedJson
        })
      }
    }
    // Guest users: no DB save, just return
    res.status(200).json(parsedJson)

  } catch (error) {
    console.error('Error in analyzeSkillGap:', error)
    res.status(500).json({ 
      message: 'Failed to analyze skill gap', 
      error: error.message 
    })
  }
};

export const startInterview = async (req, res) => {
  try {
    const { 
      resumeId, 
      resumeText,
      targetRole, 
      role,
      experience,
      interviewLength,
      regenerate = false 
    } = req.body;

    if (!resumeId && !resumeText) {
      return res.status(400).json({ 
        message: 'resumeId or resumeText is required' 
      });
    }

    const roleOrTarget = role || targetRole;
    if (!roleOrTarget) {
      return res.status(400).json({ 
        message: 'role or targetRole is required' 
      });
    }

    let resumeContent;

    if (resumeId) {
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).json({ 
          message: 'Resume not found' 
        });
      }
      resumeContent = JSON.stringify({
        profileInfo: resume.profileInfo,
        workExperience: resume.workExperience,
        education: resume.education,
        skills: resume.skills,
        projects: resume.projects,
        certifications: resume.certifications
      });
    } else {
      resumeContent = JSON.stringify({
        rawResumeText: resumeText
      });
    }

    let length = 8;
    let mix = "3 behavioural, 3 technical based on their skills, 2 situational based on their experience";
    
    if (interviewLength) {
      if (interviewLength === 'quick' || interviewLength === '5') {
        length = 5;
        mix = "2 behavioural, 2 technical based on their skills, 1 situational based on their experience";
      } else if (interviewLength === 'standard' || interviewLength === '7') {
        length = 7;
        mix = "3 behavioural, 2 technical based on their skills, 2 situational based on their experience";
      } else if (interviewLength === 'deep' || interviewLength === '10') {
        length = 10;
        mix = "4 behavioural, 4 technical based on their skills, 2 situational based on their experience";
      }
    }

    const prompt = `You are a senior technical interviewer. Based on the resume below and the target role "${roleOrTarget}" with experience level "${experience || 'Not specified'}", generate exactly ${length} interview questions: ${mix}.
    Make sure the questions are highly relevant, specific, resume-aware, and NOT generic.
    Return ONLY valid JSON array (no markdown wrapping, no extra text): [{ "id": 1, "question": "...", "type": "behavioural|technical|situational", "hint": "..." }]

    Resume data: ${resumeContent}
    Target role: ${roleOrTarget}`;

    const text = await generateContent(prompt, regenerate);

    let jsonStr = text;
    if (text.includes("```json")) {
      jsonStr = text.split("```json")[1].split("```")[0].trim();
    } else if (text.includes("```")) {
      jsonStr = text.split("```")[1].split("```")[0].trim();
    }

    const questions = JSON.parse(jsonStr);
    
    res.status(200).json({ questions, resumeJSON: resumeContent });

  } catch (error) {
    console.error("Error in startInterview:", error);
    res.status(500).json({ message: "Failed to start interview", error: error.message });
  }
};

export const evaluateAnswer = async (req, res) => {
    try {
        const { question, answer, resumeJSON, regenerate = false } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ message: "question and answer are required" });
        }

        const prompt = `You are an expert interview coach. Evaluate the candidate's answer to the interview question below. Be specific and reference their resume. Return ONLY valid JSON (no markdown wrapping): { "score": <1-10>, "feedback": "...", "strongPoints": ["..."], "improvements": ["..."], "sampleAnswer": "..." }

        Question: ${question}
        Candidate's answer: ${answer}
        Resume context: ${resumeJSON || 'Not provided'}`;

        const text = await generateContent(prompt, regenerate);

        let jsonStr = text;
        if (text.includes("```json")) {
            jsonStr = text.split("```json")[1].split("```")[0].trim();
        } else if (text.includes("```")) {
            jsonStr = text.split("```")[1].split("```")[0].trim();
        }

        const evaluation = JSON.parse(jsonStr);
        
        res.status(200).json(evaluation);

    } catch (error) {
        console.error("Error in evaluateAnswer:", error);
        res.status(500).json({ message: "Failed to evaluate answer", error: error.message });
    }
};

export const saveInterviewSession = async (req, res) => {
    try {
        const { resumeId, questions, answers, overallScore } = req.body;
        
        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        const session = new InterviewSession({
            userId: resume.userId,
            resumeId,
            questions,
            answers,
            overallScore,
            completedAt: new Date()
        });

        await session.save();
        res.status(201).json({ message: "Interview session saved successfully", sessionId: session._id });
        
    } catch (error) {
        console.error("Error in saveInterviewSession:", error);
        res.status(500).json({ message: "Failed to save interview session", error: error.message });
    }
};

export const evaluateSession = async (req, res) => {
  try {
    const { questions, answers, metadata, regenerate = false } = req.body;

    if (!questions || !answers || !Array.isArray(questions) || !Array.isArray(answers) || questions.length === 0 || answers.length === 0) {
      return res.status(400).json({ message: "questions and answers arrays are required and cannot be empty" });
    }

    const resumeContent = metadata?.resumeJSON || metadata?.resumeText || "Not provided";
    const roleOrTarget = metadata?.role || metadata?.targetRole || "Not specified";
    const experience = metadata?.experience || "Not specified";

    const prompt = `You are an expert interview coach. Evaluate the candidate's performance across the entire interview session.
    
    Target Role: ${roleOrTarget}
    Experience Level: ${experience}
    Resume Context: ${resumeContent}
    
    Here are the interview questions and the candidate's answers:
    ${questions.map((q, idx) => {
      const ansObj = answers.find(a => a.questionId === q.id) || {};
      const answerText = ansObj.answer || "No answer provided.";
      const timeSpent = ansObj.timeSpent ? ` [Time spent: ${ansObj.timeSpent}]` : "";
      return `\nQuestion ${idx + 1} (Type: ${q.type}): ${q.question}${timeSpent}\nAnswer: ${answerText}`;
    }).join('\n')}
    
    Analyze each response specifically, referencing their resume and target role. Assess:
    1. Technical depth and accuracy of answers (Technical Score).
    2. Communication structure, clarity, and articulation (Communication Score).
    3. Assertiveness and completeness (Confidence Score).
    
    Return ONLY valid JSON (no markdown wrapping, no extra text) matching this format:
    {
      "overallScore": <number 1-10>,
      "overallFeedback": "...",
      "technicalScore": <number 1-10>,
      "communicationScore": <number 1-10>,
      "confidenceScore": <number 1-10>,
      "evaluations": [
        {
          "questionId": <number>,
          "question": "...",
          "answer": "...",
          "score": <number 1-10>,
          "feedback": "...",
          "strengths": ["..."],
          "improvements": ["..."],
          "exampleAnswer": "..."
        }
      ]
    }
    `;

    const text = await generateContent(prompt, regenerate);

    let jsonStr = text;
    if (text.includes("```json")) {
      jsonStr = text.split("```json")[1].split("```")[0].trim();
    } else if (text.includes("```")) {
      jsonStr = text.split("```")[1].split("```")[0].trim();
    }

    const evaluationResult = JSON.parse(jsonStr);

    const integrityScoreRaw = typeof metadata?.integrityScore === 'number' ? metadata.integrityScore : 100;
    const integrityScore = Math.max(0, Math.min(100, integrityScoreRaw));

    const typingFluencyRaw = typeof metadata?.typingFluency === 'number' ? metadata.typingFluency : 100;
    const typingFluency = Math.max(0, Math.min(100, typingFluencyRaw));

    const formattedEvaluations = (evaluationResult.evaluations || []).map((ev) => {
      const strengths = ev.strengths || ev.strongPoints || [];
      const improvements = ev.improvements || [];
      const exampleAnswer = ev.exampleAnswer || ev.sampleAnswer || "";
      
      const originalAnswer = answers.find(a => a.questionId === ev.questionId) || {};

      return {
        ...ev,
        timeSpent: originalAnswer.timeSpent,
        strongPoints: strengths,
        strengths,
        improvements,
        sampleAnswer: exampleAnswer,
        exampleAnswer
      };
    });

    const report = {
      overallScore: evaluationResult.overallScore || 5,
      overallFeedback: evaluationResult.overallFeedback || "",
      technicalScore: evaluationResult.technicalScore || 5,
      communicationScore: evaluationResult.communicationScore || 5,
      confidenceScore: evaluationResult.confidenceScore || 5,
      integrityScore: integrityScore,
      typingFluencyScore: typingFluency,
      evaluations: formattedEvaluations
    };

    res.status(200).json(report);

  } catch (error) {
    console.error("Error in evaluateSession:", error);
    res.status(500).json({ message: "Failed to evaluate session", error: error.message });
  }
};
