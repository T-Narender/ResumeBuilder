import express from 'express';
import { createRateLimiter } from '../utils/rateLimiter.js';
import { 
  improveBullet, 
  analyzeSkillGap, 
  startInterview, 
  evaluateAnswer, 
  saveInterviewSession,
  generateContentController,
  evaluateSession
} from '../controllers/aiController.js';

const router = express.Router();

const generateRateLimiter = createRateLimiter({
  windowSeconds: 10 * 60,
  maxRequests: 20,
  keyPrefix: 'ratelimit:ai:generate:'
});

const improveBulletRateLimiter = createRateLimiter({
  windowSeconds: 10 * 60,
  maxRequests: 10,
  keyPrefix: 'ratelimit:ai:improve-bullet:'
});

const interviewStartRateLimiter = createRateLimiter({
  windowSeconds: 15 * 60,
  maxRequests: 5,
  keyPrefix: 'ratelimit:ai:interview-start:'
});

const interviewEvaluateRateLimiter = createRateLimiter({
  windowSeconds: 10 * 60,
  maxRequests: 30,
  keyPrefix: 'ratelimit:ai:interview-evaluate:'
});

const interviewEvaluateSessionRateLimiter = createRateLimiter({
  windowSeconds: 15 * 60,
  maxRequests: 5,
  keyPrefix: 'ratelimit:ai:interview-evaluate-session:'
});

router.post('/generate', generateRateLimiter, generateContentController);
router.post('/improve-bullet', improveBulletRateLimiter, improveBullet);
router.post('/skill-gap', analyzeSkillGap);
router.post('/interview/start', interviewStartRateLimiter, startInterview);
router.post('/interview/evaluate', interviewEvaluateRateLimiter, evaluateAnswer);
router.post('/interview/save', saveInterviewSession);
router.post('/interview/evaluate-session', interviewEvaluateSessionRateLimiter, evaluateSession);

export default router;
