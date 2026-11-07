import { extractSkills, normalizeText } from './skillGapService.js';
import { experienceProfiles, interviewQuestions, roleAliases } from '../data/interviewQuestions.js';

const roleGroupFor = (role = '') => {
  const normalized = normalizeText(role);
  return Object.entries(roleAliases).find(([, aliases]) =>
    aliases.some((alias) => normalized.includes(alias))
  )?.[0] || 'general';
};

const experienceLevelFor = (experience = '') => {
  const normalized = normalizeText(experience);
  return Object.entries(experienceProfiles).find(([, profile]) =>
    profile.aliases.some((alias) => normalized.includes(alias))
  )?.[0] || 'mid';
};

const parseResume = (resumeContent = '') => {
  try {
    const parsed = JSON.parse(resumeContent);
    if (parsed.rawResumeText) {
      const rawLines = parsed.rawResumeText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const projectStart = rawLines.findIndex((line) => /^(projects?|personal projects?|academic projects?)$/i.test(line));
      const projects = projectStart >= 0
        ? rawLines.slice(projectStart + 1, projectStart + 4)
          .filter((line) => line.length > 3 && line.length < 100)
          .map((name) => ({ name: name.replace(/^[-*•\d.)\s]+/, '').trim(), technologies: [], evidence: '' }))
        : [];
      const experienceStart = rawLines.findIndex((line) => /^(experience|work experience|internship|employment)$/i.test(line));
      const experiences = experienceStart >= 0
        ? rawLines.slice(experienceStart + 1, experienceStart + 3).filter((line) => line.length > 3 && line.length < 100)
        : [];
      return { text: parsed.rawResumeText, projects, experiences };
    }
    const projects = (parsed.projects || []).map((project) => ({
      name: project.name,
      technologies: project.techStack || [],
      evidence: project.bullets?.join(' ') || ''
    }));
    return {
      text: JSON.stringify(parsed),
      projects: projects.filter((project) => project.name),
      experiences: (parsed.workExperience || [])
        .map((experience) => experience.role || experience.company)
        .filter(Boolean)
    };
  } catch {
    return { text: resumeContent, projects: [], experiences: [] };
  }
};

const questionKey = (question) => question.question.toLowerCase();

const createSkillQuestion = (skill) => ({
  type: 'technical',
  skills: [skill],
  roles: ['all'],
  question: 'How did you use {skill} in your {contextName} project, and what use cases or trade-offs influenced your approach?',
  hint: 'Explain the project use case, why the skill fit, alternatives considered, and trade-offs.'
});

export const generateInterviewQuestionsLocally = ({
  resumeContent,
  role = '',
  experience = '',
  length = 7,
  mix = { behavioural: 3, technical: 2, situational: 2 }
}) => {
  const resume = parseResume(resumeContent);
  const skills = extractSkills(resume.text);
  const skillSet = new Set(skills);
  const roleGroup = roleGroupFor(role);
  const experienceLevel = experienceLevelFor(experience);
  const levelProfile = experienceProfiles[experienceLevel];
  const questionCount = Math.min(10, length + levelProfile.extraQuestions);
  const adjustedMix = { ...mix };
  if (experienceLevel === 'senior') adjustedMix.technical += 1;
  if (experienceLevel === 'lead') {
    adjustedMix.technical += 1;
    adjustedMix.situational += 1;
  }
  const knownQuestionSkills = new Set(interviewQuestions.flatMap((item) => item.skills || []));
  const dynamicQuestions = skills
    .filter((skill) => !knownQuestionSkills.has(skill))
    .map(createSkillQuestion);
  const scored = [...interviewQuestions, ...dynamicQuestions].map((item) => {
    const skillMatches = (item.skills || []).filter((skill) => skillSet.has(skill)).length;
    const roleMatch = item.roles.includes('all') || item.roles.includes(roleGroup);
    const levelMatch = !item.levels || item.levels.includes(experienceLevel);
    const levelPenalty = item.levels && !levelMatch ? -8 : 0;
    return {
      item,
      score: skillMatches * 5 + (roleMatch ? 3 : 0) + (levelMatch ? 4 : levelPenalty) + (item.skills?.length ? 0 : 1)
    };
  });
  const selected = [];
  const used = new Set();
  const unmatchedSkills = [];

  for (const [type, count] of Object.entries(adjustedMix)) {
    const candidates = scored
      .filter(({ item }) => item.type === type)
      .sort((a, b) => b.score - a.score || Math.random() - 0.5);
    for (let index = 0; index < count; index += 1) {
      const candidate = candidates.find(({ item }) => !used.has(questionKey(item)));
      if (!candidate) break;
      used.add(questionKey(candidate.item));
      selected.push(candidate.item);
    }
  }

  const technicalSkillsCovered = new Set(
    selected.flatMap((item) => item.skills || []).filter((skill) => skillSet.has(skill))
  );
  skills.filter((skill) => !technicalSkillsCovered.has(skill)).forEach((skill) => {
    if (!selected.some((item) => item.question.includes(skill))) unmatchedSkills.push(skill);
  });

  const defaultContext = resume.projects[0]?.name || resume.experiences[0] || '';
  const questions = selected.slice(0, questionCount).map((item, index) => {
    const matchedSkill = (item.skills || []).find((skill) => skillSet.has(skill));
    const project = resume.projects.find((candidate) =>
      matchedSkill && (candidate.technologies || []).some((technology) =>
        normalizeText(technology) === normalizeText(matchedSkill)
      )
    );
    const contextName = project?.name || defaultContext;
    const question = item.question
      .replaceAll('{skill}', matchedSkill || item.skills?.[0] || 'the technology')
      .replaceAll('{contextName}', contextName || 'recent');
    const hint = contextName
      ? item.hint
      : `${item.hint} Use a real project, internship, job, or academic example.`;
    return {
      id: index + 1,
      question,
      type: item.type,
      hint,
      ...(matchedSkill ? { skill: matchedSkill } : {}),
      ...(contextName ? { contextName } : {})
    };
  });

  return {
    questions,
    fallbackUsed: questions.some((question) => question.question.includes('technical decision')),
    needsAiFallback: !defaultContext || skills.length === 0 || questions.filter((question) => question.contextName || question.skill).length < Math.ceil(questionCount * 0.6),
    unmatchedSkills,
    roleGroup,
    experience,
    experienceLevel,
    questionCount
  };
};
