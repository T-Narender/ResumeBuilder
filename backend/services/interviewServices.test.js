import assert from 'node:assert/strict';
import test from 'node:test';
import { generateInterviewQuestionsLocally } from './interviewQuestionService.js';
import { evaluateInterviewLocally } from './interviewEvaluationService.js';

test('generates the requested local interview mix from resume skills', () => {
  const result = generateInterviewQuestionsLocally({
    resumeContent: JSON.stringify({
      skills: [{ name: 'React' }, { name: 'Node.js' }],
      projects: [{ name: 'Resume Builder', techStack: ['React'], bullets: ['Built a dashboard'] }]
    }),
    role: 'Full Stack Developer',
    experience: 'Mid-level',
    mix: { behavioural: 2, technical: 2, situational: 1 }
  });

  assert.equal(result.questions.length, 5);
  assert.deepEqual(
    result.questions.reduce((counts, question) => {
      counts[question.type] = (counts[question.type] || 0) + 1;
      return counts;
    }, {}),
    { behavioural: 2, technical: 2, situational: 1 }
  );
  assert.ok(result.questions.some((question) =>
    question.question.includes('React') && question.question.includes('Resume Builder')
  ));
  assert.ok(result.questions.some((question) =>
    question.type === 'behavioural' && question.question.includes('Resume Builder')
  ));
});

test('increases question count and depth for senior and lead levels', () => {
  const resumeContent = JSON.stringify({
    skills: [{ name: 'React' }, { name: 'Node.js' }],
    projects: [{ name: 'Resume Builder', techStack: ['React', 'Node.js'], bullets: ['Built a dashboard'] }]
  });
  const junior = generateInterviewQuestionsLocally({
    resumeContent,
    role: 'Software Engineer',
    experience: 'Junior',
    length: 7,
    mix: { behavioural: 3, technical: 2, situational: 2 }
  });
  const senior = generateInterviewQuestionsLocally({
    resumeContent,
    role: 'Software Engineer',
    experience: 'Senior',
    length: 7,
    mix: { behavioural: 3, technical: 2, situational: 2 }
  });
  const lead = generateInterviewQuestionsLocally({
    resumeContent,
    role: 'Software Engineer',
    experience: 'Lead / Executive',
    length: 7,
    mix: { behavioural: 3, technical: 2, situational: 2 }
  });

  assert.equal(junior.questions.length, 7);
  assert.equal(senior.questions.length, 8);
  assert.equal(lead.questions.length, 9);
  assert.equal(senior.experienceLevel, 'senior');
  assert.equal(lead.experienceLevel, 'lead');
  assert.ok(senior.questions.some((question) => question.question.includes('larger scale')));
  assert.ok(lead.questions.some((question) => question.question.includes('technical direction')));
});

test('evaluates a complete session locally without AI', () => {
  const result = evaluateInterviewLocally({
    questions: [
      { id: 1, type: 'technical', skill: 'React', contextName: 'Resume Builder', question: 'How did you use React in your Resume Builder project, and why did you choose it over alternatives?' },
      { id: 2, type: 'behavioural', question: 'Tell me about a difficult problem you solved.' }
    ],
    answers: [
      { questionId: 1, answer: 'I used React with components and state to build the Resume Builder dashboard, compared alternatives, tested the changes, and improved the result.', timeSpent: '01:00' },
      { questionId: 2, answer: 'When a project issue occurred, my task was to resolve it. I implemented a fix and the result was a stable release.', timeSpent: '01:30' }
    ],
    resumeText: 'React JavaScript',
    integrityScore: 95,
    typingFluency: 88
  });

  assert.ok(result.overallScore >= 1 && result.overallScore <= 10);
  assert.equal(result.technicalScore >= 1, true);
  assert.equal(result.integrityScore, 95);
  assert.equal(result.typingFluencyScore, 88);
  assert.equal(result.evaluations.length, 2);
  assert.ok(result.evaluations[0].improvements.length >= 1);
});

test('does not give passing scores to empty or non-substantive answers', () => {
  const result = evaluateInterviewLocally({
    questions: [
      { id: 1, type: 'behavioural', question: 'Tell me about a difficult problem you solved.' },
      { id: 2, type: 'technical', skill: 'Node.js', contextName: 'Resume Builder', question: 'How did you use Node.js in your Resume Builder project?' }
    ],
    answers: [
      { questionId: 1, answer: 'ok' },
      { questionId: 2, answer: 'great fit' }
    ],
    resumeText: 'Node.js'
  });

  assert.deepEqual(result.evaluations.map((evaluation) => evaluation.score), [1, 1]);
  assert.ok(result.evaluations[0].improvements.some((item) => item.includes('complete answer')));
  assert.ok(result.evaluations[1].improvements.some((item) => item.includes('trade-offs')));
});

test('rejects repeated filler and gibberish answers', () => {
  const result = evaluateInterviewLocally({
    questions: [
      { id: 1, type: 'behavioural', question: 'Tell me about a difficult problem you solved.' },
      { id: 2, type: 'technical', skill: 'Node.js', contextName: 'Resume Builder', question: 'How did you use Node.js in your Resume Builder project?' }
    ],
    answers: [
      { questionId: 1, answer: 'ok ok ok ok ok ok ok ok' },
      { questionId: 2, answer: 'df jf sd said isa a be the on e ojf ihi oe' }
    ],
    resumeText: 'Node.js'
  });

  assert.deepEqual(result.evaluations.map((evaluation) => evaluation.score), [1, 1]);
});

test('creates a technical question for a resume skill not covered by the bank', () => {
  const result = generateInterviewQuestionsLocally({
    resumeContent: JSON.stringify({
      skills: [{ name: 'GraphQL' }],
      projects: [{ name: 'API Platform', techStack: ['GraphQL'], bullets: [] }]
    }),
    role: 'Software Engineer',
    experience: 'Mid-level',
    mix: { behavioural: 0, technical: 1, situational: 0 }
  });

  assert.equal(result.questions.length, 1);
  assert.match(result.questions[0].question, /GraphQL/);
  assert.match(result.questions[0].question, /API Platform/);
});

test('marks raw uploaded text without extractable context for AI fallback', () => {
  const result = generateInterviewQuestionsLocally({
    resumeContent: JSON.stringify({
      rawResumeText: 'Social Media Intern\nInstagram content creation and video editing'
    }),
    role: 'Social Media Marketing Intern',
    experience: 'Junior',
    mix: { behavioural: 1, technical: 1, situational: 1 }
  });

  assert.equal(result.needsAiFallback, true);
  assert.ok(result.questions.every((question) => !question.contextName));
});

test('rewards a detailed answer with project evidence and technical reasoning', () => {
  const result = evaluateInterviewLocally({
    questions: [
      { id: 1, type: 'behavioural', contextName: 'AI-Powered ResumeCraft', question: 'Tell me about a difficult problem you solved in your AI-Powered ResumeCraft project and how you handled it.' }
    ],
    answers: [{
      questionId: 1,
      answer: 'The difficult problem I faced initially was downloading resumes. I tried different approaches and found that PDF layouts sometimes broke. I reviewed the options, implemented Puppeteer, and achieved a stable structured download.'
    }],
    resumeText: 'Puppeteer PDF generation'
  });

  assert.ok(result.evaluations[0].score >= 5);
  assert.ok(result.evaluations[0].strengths.length >= 1);
});
