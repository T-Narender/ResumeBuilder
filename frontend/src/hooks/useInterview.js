import { useState } from 'react';
import toast from 'react-hot-toast';
import { API_PATHS, buildApiUrl } from '../utils/apiPath';

const calculateIntegrityScore = (metrics) => {
  let score = 100;

  // Tab switches
  if (metrics.tabSwitchCount > 0) {
    score -= 10; // First switch
    if (metrics.tabSwitchCount > 1) {
      score -= (metrics.tabSwitchCount - 1) * 15; // Subsequent switches
    }
  }

  // Fullscreen exits
  score -= metrics.fullscreenExitCount * 15;

  // Copy/Paste/Cut attempts
  score -= (metrics.copyAttempts + metrics.pasteAttempts + metrics.cutAttempts) * 5;

  return Math.max(0, score);
};

const calculateTypingFluency = (analytics) => {
  const { keystrokeCount, backspaceCount } = analytics;
  if (keystrokeCount === 0) return 100;
  const correctionRatio = backspaceCount / (keystrokeCount + backspaceCount);
  const fluency = Math.round((1 - correctionRatio) * 100);
  return Math.max(0, Math.min(100, fluency));
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

export const useInterview = () => {
  const [loading, setLoading] = useState(false);
  const [sessionState, setSessionState] = useState('setup'); // setup, active, summary
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [resumeContext, setResumeContext] = useState(null);
  const [resumeId, setResumeId] = useState(null);

  // New States
  const [targetRoleState, setTargetRoleState] = useState('');
  const [experienceState, setExperienceState] = useState('');
  const [localAnswers, setLocalAnswers] = useState({}); // { [questionId]: answerText }
  const [questionTimes, setQuestionTimes] = useState({}); // { [questionId]: seconds }
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [overallReport, setOverallReport] = useState(null);

  const [integrityMetrics, setIntegrityMetrics] = useState({
    tabSwitchCount: 0,
    fullscreenExitCount: 0,
    copyAttempts: 0,
    pasteAttempts: 0,
    cutAttempts: 0
  });

  const [typingAnalytics, setTypingAnalytics] = useState({
    keystrokeCount: 0,
    backspaceCount: 0,
    pauseTimes: [], // milliseconds between key presses
    lastKeyTime: null
  });

  // Track key strikes
  const recordKeystroke = (key) => {
    // Ignore modifier and navigation keys (length > 1 except Backspace and Enter)
    if (key.length > 1 && key !== 'Backspace' && key !== 'Enter') return;

    setTypingAnalytics(prev => {
      const now = Date.now();
      const newPauseTimes = [...prev.pauseTimes];

      if (prev.lastKeyTime) {
        const pause = now - prev.lastKeyTime;
        if (pause < 5000) { // filter out pauses > 5s
          newPauseTimes.push(pause);
        }
      }

      const isBackspace = key === 'Backspace';
      return {
        ...prev,
        keystrokeCount: prev.keystrokeCount + (isBackspace ? 0 : 1),
        backspaceCount: prev.backspaceCount + (isBackspace ? 1 : 0),
        pauseTimes: newPauseTimes,
        lastKeyTime: now
      };
    });
  };

  const recordCopyAttempt = () => {
    setIntegrityMetrics(prev => ({ ...prev, copyAttempts: prev.copyAttempts + 1 }));
  };

  const recordPasteAttempt = () => {
    setIntegrityMetrics(prev => ({ ...prev, pasteAttempts: prev.pasteAttempts + 1 }));
  };

  const recordCutAttempt = () => {
    setIntegrityMetrics(prev => ({ ...prev, cutAttempts: prev.cutAttempts + 1 }));
  };

  const recordTabSwitch = () => {
    setIntegrityMetrics(prev => ({ ...prev, tabSwitchCount: prev.tabSwitchCount + 1 }));
  };

  const recordFullscreenExit = () => {
    setIntegrityMetrics(prev => ({ ...prev, fullscreenExitCount: prev.fullscreenExitCount + 1 }));
  };

  const startInterview = async (id, targetRole, regenerate = false, resumeText = '', experience = '', interviewLength = 'standard') => {
    if ((!id && !resumeText) || !targetRole.trim()) {
      toast.error('Resume and Target Role are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(buildApiUrl(API_PATHS.AI.INTERVIEW.START), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: id || undefined,
          resumeText: resumeText || undefined,
          role: targetRole,
          experience: experience || undefined,
          interviewLength: interviewLength || undefined,
          regenerate
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setQuestions(data.questions);
        setResumeContext(data.resumeJSON);
        setResumeId(id);
        setTargetRoleState(targetRole);
        setExperienceState(experience);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setLocalAnswers({});
        setQuestionTimes({});
        setQuestionStartTime(Date.now());
        setOverallReport(null);
        setIntegrityMetrics({
          tabSwitchCount: 0,
          fullscreenExitCount: 0,
          copyAttempts: 0,
          pasteAttempts: 0,
          cutAttempts: 0
        });
        setTypingAnalytics({
          keystrokeCount: 0,
          backspaceCount: 0,
          pauseTimes: [],
          lastKeyTime: null
        });
        setSessionState('active');
        toast.success("Interview started! Good luck.");
      } else {
        toast.error(data.message || 'Failed to start interview');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while generating questions');
    } finally {
      setLoading(false);
    }
  };

  // Keep evaluateAnswer for backward compatibility if called elsewhere (legacy code)
  const evaluateAnswer = async (answerText, regenerate = false) => {
    if (!answerText.trim()) return null;

    setLoading(true);
    const currentQuestion = questions[currentQuestionIndex];

    try {
      const response = await fetch(buildApiUrl(API_PATHS.AI.INTERVIEW.EVALUATE), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: answerText,
          resumeJSON: resumeContext,
          regenerate
        }),
      });
      const evaluation = await response.json();

      if (response.ok) {
        const answerRecord = {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          answer: answerText,
          ...evaluation
        };

        setAnswers(prev => [...prev, answerRecord]);
        return evaluation;
      } else {
        toast.error(evaluation.message || 'Failed to evaluate answer');
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during evaluation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const recordCurrentQuestionTime = () => {
    if (!questionStartTime || !questions[currentQuestionIndex]) return;
    const elapsedSeconds = Math.round((Date.now() - questionStartTime) / 1000);
    const qId = questions[currentQuestionIndex].id;
    setQuestionTimes(prev => ({
      ...prev,
      [qId]: (prev[qId] || 0) + elapsedSeconds
    }));
  };

  const nextQuestion = () => {
    recordCurrentQuestionTime();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const submitInterview = async () => {
    if (loading) return; // Prevent double submission
    setLoading(true);

    const finalIntegrityScore = calculateIntegrityScore(integrityMetrics);
    const finalFluencyScore = calculateTypingFluency(typingAnalytics);

    const answersPayload = questions.map(q => {
      const qId = q.id;
      const ansText = localAnswers[qId]?.trim() ? localAnswers[qId] : "No answer provided.";

      let timeSpentSec = questionTimes[qId] || 0;
      if (qId === questions[currentQuestionIndex]?.id && questionStartTime) {
        timeSpentSec += Math.round((Date.now() - questionStartTime) / 1000);
      }

      return {
        questionId: qId,
        answer: ansText,
        timeSpentSeconds: timeSpentSec,
        timeSpent: formatTime(timeSpentSec)
      };
    });

    const totalTimeSeconds = answersPayload.reduce((sum, a) => sum + a.timeSpentSeconds, 0);

    const words = (typingAnalytics.keystrokeCount + typingAnalytics.backspaceCount) / 5;
    const minutes = totalTimeSeconds / 60 || 0.1;
    const typingSpeedWpm = Math.round(words / minutes);

    const avgPauseTimeMs = typingAnalytics.pauseTimes.length > 0
      ? Math.round(typingAnalytics.pauseTimes.reduce((sum, p) => sum + p, 0) / typingAnalytics.pauseTimes.length)
      : 0;

    try {
      const response = await fetch(buildApiUrl(API_PATHS.AI.INTERVIEW.EVALUATE_SESSION), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions,
          answers: answersPayload,
          metadata: {
            resumeJSON: resumeContext,
            role: targetRoleState,
            experience: experienceState,
            integrityScore: finalIntegrityScore,
            typingFluency: finalFluencyScore,
            integrityMetrics,
            typingAnalytics: {
              keystrokeCount: typingAnalytics.keystrokeCount,
              backspaceCount: typingAnalytics.backspaceCount,
              typingSpeedWpm,
              avgPauseTimeMs
            }
          }
        }),
      });

      const report = await response.json();

      if (response.ok) {
        setAnswers(report.evaluations || []);
        setOverallReport(report);

        // Skip saving for guest users
        if (resumeId) {
          try {
            await fetch(buildApiUrl(API_PATHS.AI.INTERVIEW.SAVE), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                resumeId,
                questions,
                answers: report.evaluations,
                overallScore: report.overallScore
              }),
            });
          } catch (error) {
            console.error("Failed to save session", error);
          }
        } else {
          console.log('[INTERVIEW] Guest session, skipping save');
        }

        setSessionState('summary');
        toast.success("Interview completed! Detailed report generated.");
      } else {
        toast.error(report.message || 'Failed to evaluate session');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during evaluation');
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setSessionState('setup');
    setQuestions([]);
    setAnswers([]);
    setLocalAnswers({});
    setQuestionTimes({});
    setCurrentQuestionIndex(0);
    setOverallReport(null);
  };

  return {
    loading,
    sessionState,
    questions,
    currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex],
    answers,
    startInterview,
    evaluateAnswer,
    nextQuestion,
    resetInterview,
    // Additive exports
    localAnswers,
    setLocalAnswers,
    integrityMetrics,
    typingAnalytics,
    questionTimes,
    overallReport,
    submitInterview,
    recordKeystroke,
    recordCopyAttempt,
    recordPasteAttempt,
    recordCutAttempt,
    recordTabSwitch,
    recordFullscreenExit,
    questionStartTime
  };
};
