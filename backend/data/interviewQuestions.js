export const roleAliases = {
  frontend: ['frontend', 'front end', 'ui developer', 'react developer', 'web developer'],
  backend: ['backend', 'back end', 'api developer', 'node developer', 'server developer'],
  fullstack: ['full stack', 'fullstack', 'software engineer', 'software developer'],
  data: ['data analyst', 'data scientist', 'machine learning', 'data engineer'],
  devops: ['devops', 'site reliability', 'cloud engineer', 'platform engineer']
};

export const experienceProfiles = {
  junior: { aliases: ['junior', 'entry', 'graduate'], extraQuestions: 0 },
  mid: { aliases: ['mid-level', 'mid level', 'mid'], extraQuestions: 0 },
  senior: { aliases: ['senior'], extraQuestions: 1 },
  lead: { aliases: ['lead', 'executive', 'principal', 'staff'], extraQuestions: 2 }
};

export const interviewQuestions = [
  { type: 'behavioural', context: 'project', roles: ['all'], question: 'Tell me about a difficult problem you solved in your {contextName} project and how you handled it.', hint: 'Use Situation, Task, Action, and Result. Focus on your specific contribution and outcome.' },
  { type: 'behavioural', context: 'project', roles: ['all'], question: 'Tell me about a time you received critical feedback while working on your {contextName} project and what you changed.', hint: 'Explain the feedback, your response, and the outcome.' },
  { type: 'behavioural', context: 'project', roles: ['all'], question: 'Describe how you prioritized competing deadlines in your {contextName} project.', hint: 'Explain your prioritization method, communication, and result.' },
  { type: 'behavioural', context: 'project', roles: ['all'], question: 'Tell me about a disagreement you handled while working on your {contextName} project.', hint: 'Describe how you resolved it professionally and what you learned.' },
  { type: 'technical', skills: ['JavaScript', 'TypeScript'], roles: ['frontend', 'backend', 'fullstack'], question: 'How did you use {skill} in your {contextName} project, and why did you choose it over alternatives?', hint: 'Explain the use case, alternatives considered, trade-offs, and outcome.' },
  { type: 'technical', skills: ['React'], roles: ['frontend', 'fullstack'], question: 'How did you use {skill} in your {contextName} project, and why was it a good fit?', hint: 'Explain the use case, alternatives considered, component design, and trade-offs.' },
  { type: 'technical', skills: ['Node.js', 'Express.js', 'REST APIs'], roles: ['backend', 'fullstack'], question: 'How did you use {skill} in your {contextName} project to build the backend, and why did you choose it over alternatives?', hint: 'Explain the API use case, design decisions, alternatives, errors, and persistence.' },
  { type: 'technical', skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQL'], roles: ['backend', 'fullstack', 'data'], question: 'How did you use {skill} in your {contextName} project, and why did you choose it over alternatives?', hint: 'Discuss the data use case, schema, indexes, alternatives, and trade-offs.' },
  { type: 'technical', skills: ['Docker', 'Kubernetes', 'AWS', 'Azure'], roles: ['backend', 'fullstack', 'devops'], question: 'How did you use {skill} in your {contextName} project or deployment, and why did you choose it over alternatives?', hint: 'Cover the use case, alternatives, configuration, reliability, and trade-offs.' },
  { type: 'technical', skills: ['Git', 'Jest', 'Cypress'], roles: ['all'], question: 'How did you use {skill} in your {contextName} project to keep changes safe, and why did you choose this approach?', hint: 'Explain the use case, alternatives, testing or workflow, and trade-offs.' },
  { type: 'technical', levels: ['senior', 'lead'], skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'], roles: ['frontend', 'backend', 'fullstack'], question: 'What technical trade-offs did you make in your {contextName} project, and how would you improve the design at a larger scale?', hint: 'Discuss constraints, alternatives, scalability, reliability, and what you would change with more ownership.' },
  { type: 'technical', levels: ['lead'], skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'PostgreSQL'], roles: ['frontend', 'backend', 'fullstack'], question: 'How did you influence the technical direction of your {contextName} project, and how did you align implementation decisions with product goals?', hint: 'Discuss architecture, prioritization, stakeholder communication, and measurable outcomes.' },
  { type: 'technical', skills: [], roles: ['all'], question: 'Describe a technical decision you made in a recent project and its trade-offs.', hint: 'Explain the context, alternatives, decision, and result.' },
  { type: 'situational', roles: ['all'], question: 'What would you do if a critical feature was not ready before release?', hint: 'Discuss risk, prioritization, communication, and alternatives.' },
  { type: 'situational', roles: ['all'], question: 'How would you handle unclear requirements for an important task?', hint: 'Explain how you clarify scope and validate assumptions.' },
  { type: 'situational', roles: ['all'], question: 'What would you do if a production issue appeared immediately after deployment?', hint: 'Cover mitigation, diagnosis, communication, and prevention.' }
];
