import { extractSkills, normalizeText } from './skillGapService.js';

const clamp = (value, min = 1, max = 10) => Math.max(min, Math.min(max, Math.round(value)));
const average = (values, fallback = 5) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : fallback;
const words = (text) => normalizeText(text).split(' ').filter(Boolean);
const stopWords = new Set(['about', 'after', 'also', 'and', 'are', 'been', 'because', 'from', 'have', 'how', 'that', 'the', 'their', 'this', 'used', 'what', 'when', 'were', 'with', 'your']);
const meaningfulWords = (answerWords) => answerWords.filter((word) => !stopWords.has(word) && word.length >= 3);
const likelyNaturalLanguage = (answerWords) => {
  const meaningful = meaningfulWords(answerWords);
  if (!meaningful.length) return false;
  const vowelWords = meaningful.filter((word) => /[aeiou]/i.test(word)).length;
  const uniqueWords = new Set(meaningful);
  const repeatedRatio = 1 - uniqueWords.size / meaningful.length;
  return vowelWords / meaningful.length >= 0.75 && repeatedRatio < 0.5;
};

const communicationScore = (answerWords) => {
  if (answerWords.length < 5) return 2;
  if (answerWords.length < 20) return 5;
  if (answerWords.length < 80) return 7;
  return 8;
};

const evaluateAnswerLocally = (question, answer, resumeText) => {
  const text = normalizeText(answer);
  const answerWords = words(text);
  const meaningful = meaningfulWords(answerWords);
  const questionEvidence = meaningfulWords(words(question.question))
    .some((word) => answerWords.includes(word));
  const skillEvidence = [question.skill, question.contextName]
    .filter(Boolean)
    .some((value) => text.includes(normalizeText(value)));
  const structureEvidence = ['when', 'situation', 'task', 'responsible', 'implemented', 'built', 'result', 'improved', 'achieved']
    .some((term) => text.includes(term));
  if (
    answerWords.length < 5 ||
    meaningful.length < 3 ||
    !likelyNaturalLanguage(answerWords) ||
    (answerWords.length < 20 && !questionEvidence && !skillEvidence && !structureEvidence)
  ) {
    const feedback = answerWords.length
      ? 'This answer is too short to demonstrate understanding or experience.'
      : 'No answer was provided.';
    return {
      questionId: question.id,
      question: question.question,
      answer,
      score: 1,
      feedback,
      strengths: [],
      strongPoints: [],
      improvements: [
        'Provide a complete answer with a specific example.',
        question.type === 'technical'
          ? 'Mention the resume skill, project use case, alternatives, and trade-offs.'
          : 'Use Situation, Task, Action, and Result to structure the response.'
      ],
      sampleAnswer: 'Explain the context, your responsibility, the action you took, and the result.',
      exampleAnswer: 'Explain the context, your responsibility, the action you took, and the result.'
    };
  }
  const questionWords = new Set(meaningfulWords(words(question.question)));
  const answerSet = new Set(answerWords);
  const overlap = [...questionWords].filter((word) => answerSet.has(word)).length;
  const relevance = Math.min(10, 2 + overlap * 2);
  const skills = extractSkills(resumeText);
  const technicalEvidence = skills.filter((skill) => text.includes(normalizeText(skill))).length;
  const contextEvidence = [question.skill, question.contextName]
    .filter(Boolean)
    .filter((value) => text.includes(normalizeText(value))).length;
  const tradeoffTerms = ['alternative', 'instead', 'because', 'trade off', 'tradeoff', 'compared', 'why'];
  const tradeoffEvidence = tradeoffTerms.filter((term) => text.includes(term)).length;
  const technicalDepth = question.type === 'technical'
    ? Math.min(10, 3 + technicalEvidence * 1.5 + contextEvidence * 1.5 + Math.min(2, tradeoffEvidence) + (answerWords.length >= 30 ? 1 : 0))
    : 7;
  const structureTerms = ['when', 'situation', 'task', 'responsible', 'implemented', 'built', 'result', 'improved', 'achieved'];
  const structureHits = structureTerms.filter((term) => text.includes(term)).length;
  const structure = question.type === 'technical' ? Math.min(10, 5 + (answerWords.length >= 30 ? 2 : 0)) : Math.min(10, 3 + structureHits);
  const communication = communicationScore(answerWords);
  const score = clamp(relevance * 0.35 + technicalDepth * 0.3 + structure * 0.2 + communication * 0.15);
  const strengths = [];
  const improvements = [];
  if (answerWords.length >= 30) strengths.push('Provided enough detail to evaluate the approach.');
  if (overlap > 0) strengths.push('Addressed key terms from the question.');
  if (technicalEvidence > 0) strengths.push('Connected the answer to skills listed on the resume.');
  if (question.type === 'technical' && contextEvidence > 0) strengths.push('Explained the resume-specific skill or project context.');
  if (question.type === 'technical' && tradeoffEvidence > 0) strengths.push('Discussed alternatives or technical trade-offs.');
  if (!answer.trim() || answerWords.length < 5) improvements.push('Provide a complete answer with a specific example.');
  if (question.type !== 'technical' && structureHits < 3) improvements.push('Use Situation, Task, Action, and Result to structure the response.');
  if (question.type === 'technical' && technicalEvidence === 0) improvements.push('Mention the resume skill and explain how you used it.');
  if (question.type === 'technical' && contextEvidence === 0) improvements.push('Connect the answer to the specific project or context named in the question.');
  if (question.type === 'technical' && tradeoffEvidence === 0) improvements.push('Explain why you chose this approach over alternatives and discuss the trade-offs.');
  if (!improvements.length) improvements.push('Add measurable results or lessons learned to make the answer stronger.');

  return {
    questionId: question.id,
    question: question.question,
    answer,
    score,
    feedback: score >= 8 ? 'Strong, relevant response with clear supporting detail.' : score >= 5 ? 'Reasonable response; add more specific evidence and outcomes.' : 'The response needs more detail and should address the question more directly.',
    strengths,
    strongPoints: strengths,
    improvements,
    sampleAnswer: 'Structure your response with the context, your responsibility, the action you took, and the result.',
    exampleAnswer: 'Structure your response with the context, your responsibility, the action you took, and the result.'
  };
};

export const evaluateInterviewLocally = ({
  questions,
  answers,
  resumeText = '',
  integrityScore = 100,
  typingFluency = 100
}) => {
  const evaluations = questions.map((question) => {
    const answerRecord = answers.find((answer) => answer.questionId === question.id) || {};
    return {
      ...evaluateAnswerLocally(question, answerRecord.answer || '', resumeText),
      timeSpent: answerRecord.timeSpent
    };
  });
  const technical = evaluations.filter((evaluation) => questions.find((question) => question.id === evaluation.questionId)?.type === 'technical').map((evaluation) => evaluation.score);
  const communication = evaluations.map((evaluation) => evaluation.score);
  const overallScore = clamp(average(evaluations.map((evaluation) => evaluation.score)));
  return {
    overallScore,
    overallFeedback: overallScore >= 8 ? 'Strong interview performance with relevant and well-structured answers.' : overallScore >= 5 ? 'Good foundation; improve specificity, structure, and measurable outcomes.' : 'Focus on answering every question with a structured, specific example.',
    technicalScore: clamp(average(technical)),
    communicationScore: clamp(average(communication)),
    confidenceScore: clamp(average(evaluations.map((evaluation) => evaluation.answer.trim().split(/\s+/).filter(Boolean).length >= 5 ? 7 : 3))),
    integrityScore,
    typingFluencyScore: typingFluency,
    evaluations
  };
};
