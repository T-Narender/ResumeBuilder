import express from 'express';
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

router.post('/generate', generateContentController);
router.post('/improve-bullet', improveBullet);
router.post('/skill-gap', analyzeSkillGap);
router.post('/interview/start', startInterview);
router.post('/interview/evaluate', evaluateAnswer);
router.post('/interview/save', saveInterviewSession);
router.post('/interview/evaluate-session', evaluateSession);

export default router;
