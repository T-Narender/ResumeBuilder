import crypto from 'crypto';
import Resume from '../models/resumeModel.js';
import SkillGapAnalysis from '../models/skillGapAnalysisModel.js';
import InterviewSession from '../models/interviewSessionModel.js';
import { generateContent } from '../utils/aiProvider.js';
import { analyzeSkillGapLocally } from '../services/skillGapService.js';
import { generateInterviewQuestionsLocally } from '../services/interviewQuestionService.js';
import { evaluateInterviewLocally } from '../services/interviewEvaluationService.js';

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

    // Skill matching is deterministic and does not require an external AI call.
    const parsedJson = analyzeSkillGapLocally({
      resumeText: resumeContent,
      jobDescription
    })

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
      regenerate = false,
      generationMode = 'hybrid'
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

    const localInterview = generateInterviewQuestionsLocally({
      resumeContent,
      role: roleOrTarget,
      experience,
      length,
      mix: {
        behavioural: mix.match(/(\d+) behavioural/)?.[1] ? Number(mix.match(/(\d+) behavioural/)[1]) : 3,
        technical: mix.match(/(\d+) technical/)?.[1] ? Number(mix.match(/(\d+) technical/)[1]) : 3,
        situational: mix.match(/(\d+) situational/)?.[1] ? Number(mix.match(/(\d+) situational/)[1]) : 2
      }
    });

    if (generationMode === 'local') {
      return res.status(200).json({
        questions: localInterview.questions,
        resumeJSON: resumeContent
      });
    }

    if (generationMode === 'hybrid' && localInterview.needsAiFallback) {
      const fallbackCount = Math.max(1, localInterview.questions.filter((question) => !question.contextName && !question.skill).length);
      const variationSeed = Math.random().toString(36).slice(2, 10);
      const fallbackPrompt = `You are a resume-aware interviewer. Generate exactly ${fallbackCount} replacement interview question${fallbackCount === 1 ? '' : 's'} for the target role "${roleOrTarget}" at "${experience || 'unspecified'}" level.

Use only evidence explicitly present in this resume text. Prefer named projects, roles, employers, responsibilities, technologies, platforms, campaigns, and measurable outcomes. Do not invent experience. Do not ask generic questions such as "tell me about a difficult problem" without naming a real resume context. Return only a JSON array:
[{"question":"...","type":"behavioural|technical|situational","hint":"..."}]

Variation seed: ${variationSeed}. Prefer a different valid angle or resume evidence than a previous interview.

Resume text:
${resumeText || resumeContent}`;
      const fallbackText = await generateContent(fallbackPrompt, regenerate);
      let fallbackJson = fallbackText;
      if (fallbackText.includes("```json")) {
        fallbackJson = fallbackText.split("```json")[1].split("```")[0].trim();
      } else if (fallbackText.includes("```")) {
        fallbackJson = fallbackText.split("```")[1].split("```")[0].trim();
      }
      let generatedQuestions = null;
      try {
        generatedQuestions = JSON.parse(fallbackJson);
      } catch (parseError) {
        console.error('Invalid hybrid interview question response:', parseError.message);
      }
      if (Array.isArray(generatedQuestions)) {
        let fallbackIndex = 0;
        localInterview.questions = localInterview.questions.map((question) => {
          if (question.contextName || question.skill || fallbackIndex >= generatedQuestions.length) return question;
          const generatedQuestion = generatedQuestions[fallbackIndex];
          fallbackIndex += 1;
          if (!generatedQuestion || typeof generatedQuestion.question !== 'string' || !generatedQuestion.question.trim()) return question;
          return {
            ...question,
            question: generatedQuestion.question.trim(),
            type: ['behavioural', 'technical', 'situational'].includes(generatedQuestion.type) ? generatedQuestion.type : question.type,
            hint: typeof generatedQuestion.hint === 'string' && generatedQuestion.hint.trim() ? generatedQuestion.hint.trim() : question.hint
          };
        });
      }
      return res.status(200).json({
        questions: localInterview.questions,
        resumeJSON: resumeContent
      });
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
    const { questions, answers, metadata, regenerate = false, evaluationMode = 'local' } = req.body;

    if (!questions || !answers || !Array.isArray(questions) || !Array.isArray(answers) || questions.length === 0 || answers.length === 0) {
      return res.status(400).json({ message: "questions and answers arrays are required and cannot be empty" });
    }

    const resumeContent = metadata?.resumeJSON || metadata?.resumeText || "Not provided";
    const roleOrTarget = metadata?.role || metadata?.targetRole || "Not specified";
    const experience = metadata?.experience || "Not specified";

    const integrityScoreRaw = typeof metadata?.integrityScore === 'number' ? metadata.integrityScore : 100;
    const integrityScore = Math.max(0, Math.min(100, integrityScoreRaw));
    const typingFluencyRaw = typeof metadata?.typingFluency === 'number' ? metadata.typingFluency : 100;
    const typingFluency = Math.max(0, Math.min(100, typingFluencyRaw));

    if (evaluationMode !== 'ai') {
      return res.status(200).json(evaluateInterviewLocally({
        questions,
        answers,
        resumeText: resumeContent,
        integrityScore,
        typingFluency
      }));
    }

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
