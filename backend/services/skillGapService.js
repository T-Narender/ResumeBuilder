import { relatedSkills, skillsCatalog } from '../data/skillsCatalog.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const normalizeText = (value = '') => String(value)
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim();

const containsAlias = (text, alias) => {
  const normalizedAlias = normalizeText(alias);
  const escaped = escapeRegex(normalizedAlias);
  const prefix = normalizedAlias.length <= 2 ? '(?<![a-z0-9.])' : '(^|[^a-z0-9])';
  return new RegExp(`${prefix}${escaped}(?=$|[^a-z0-9])`, 'i').test(text);
};

const getSkillEvidence = (text, skill) => {
  const matches = skill.aliases.filter((alias) => containsAlias(text, alias)).length;
  return matches ? Math.min(1, 0.6 + matches * 0.2) : 0;
};

export const extractSkills = (text, catalog = skillsCatalog) => {
  const normalized = normalizeText(text);
  return catalog
    .filter((skill) => getSkillEvidence(normalized, skill) > 0)
    .map((skill) => skill.canonical);
};

const getWeight = (jobText, skill) => {
  const matchedAlias = skill.aliases.find((alias) => containsAlias(jobText, alias));
  const skillIndex = matchedAlias ? jobText.indexOf(normalizeText(matchedAlias)) : -1;
  if (skillIndex < 0) return 1;

  const requiredMarkers = ['required', 'must have', 'mandatory', 'essential', 'need to', 'should have'];
  const preferredMarkers = ['preferred', 'nice to have', 'bonus', 'plus', 'ideally'];
  const after = jobText.slice(skillIndex, skillIndex + 90);
  const afterRequiredIndex = Math.min(...requiredMarkers
    .map((marker) => after.indexOf(marker))
    .filter((index) => index >= 0));
  const afterPreferredIndex = Math.min(...preferredMarkers
    .map((marker) => after.indexOf(marker))
    .filter((index) => index >= 0));
  if (afterPreferredIndex >= 0 && (afterRequiredIndex < 0 || afterPreferredIndex < afterRequiredIndex)) return 1;
  if (afterRequiredIndex >= 0) return 3;

  const before = jobText.slice(Math.max(0, skillIndex - 90), skillIndex);
  const findLastMarker = (text, markers) => Math.max(
    ...markers.map((marker) => text.lastIndexOf(marker))
  );
  const requiredIndex = findLastMarker(before, requiredMarkers);
  const preferredIndex = findLastMarker(before, preferredMarkers);
  if (requiredIndex >= 0 || preferredIndex >= 0) {
    return requiredIndex > preferredIndex ? 3 : 1;
  }
  return 2;
};

const buildResumeSuggestions = (missingSkills, partialSkills, requiredSkills) => {
  const suggestions = [];
  if (missingSkills.length) {
    suggestions.push({
      section: 'skills',
      suggestion: `Add these skills only if you can support them with real experience: ${missingSkills.map((item) => item.skill).join(', ')}.`
    });
  }
  if (partialSkills.length) {
    suggestions.push({
      section: 'experience',
      suggestion: 'Add project or work examples that demonstrate the related skills and the specific tools used.'
    });
  }
  if (requiredSkills.length) {
    suggestions.push({
      section: 'summary',
      suggestion: 'Tailor your summary to the target role and mention the strongest matching requirements.'
    });
  }
  return suggestions;
};

const buildRoadmap = (missingSkills) => {
  if (!missingSkills.length) return [];
  const fundamentals = missingSkills.filter((item) => item.difficulty === 'beginner');
  const core = missingSkills.filter((item) => item.difficulty !== 'beginner');
  const phases = [];
  if (fundamentals.length) {
    phases.push({ week: 'Week 1-2', focus: `Learn fundamentals: ${fundamentals.map((item) => item.skill).join(', ')}`, items: fundamentals, dailyHours: 1 });
  }
  if (core.length) {
    phases.push({ week: fundamentals.length ? 'Week 3-5' : 'Week 1-3', focus: `Practice core requirements: ${core.map((item) => item.skill).join(', ')}`, items: core, dailyHours: 1.5 });
  }
  return phases.map(({ week, focus, items, dailyHours }) => ({
    week,
    focus,
    dailyHours,
    resources: items.flatMap((item) => item.resources || [{
      name: `${item.skill} official documentation`,
      url: '#',
      type: 'book'
    }]).slice(0, 5)
  }));
};

export const analyzeSkillGapLocally = ({
  resumeText = '',
  jobDescription = '',
  catalog = skillsCatalog
}) => {
  const normalizedJob = normalizeText(jobDescription);
  const candidateSkills = new Set(extractSkills(resumeText, catalog));
  const requiredSkills = catalog
    .filter((skill) => getSkillEvidence(normalizedJob, skill) > 0)
    .map((skill) => ({ ...skill, weight: getWeight(normalizedJob, skill) }));

  const hasSkills = requiredSkills
    .filter((skill) => candidateSkills.has(skill.canonical))
    .map((skill) => skill.canonical);
  const partialSkills = requiredSkills
    .filter((skill) => !candidateSkills.has(skill.canonical))
    .filter((skill) => (relatedSkills[skill.canonical] || []).some((related) => candidateSkills.has(related)))
    .map((skill) => ({
      skill: skill.canonical,
      gap: `You have related experience, but not explicit ${skill.canonical} experience.`
    }));
  const partialNames = new Set(partialSkills.map((item) => item.skill));
  const missingSkills = requiredSkills
    .filter((skill) => !candidateSkills.has(skill.canonical) && !partialNames.has(skill.canonical))
    .map((skill) => ({
      skill: skill.canonical,
      importance: skill.importance,
      learningTime: skill.learningTime,
      difficulty: skill.difficulty,
      weight: skill.weight,
      resources: skill.resources
    }));

  const totalWeight = requiredSkills.reduce((sum, skill) => sum + skill.weight, 0);
  const matchedWeight = requiredSkills
    .filter((skill) => candidateSkills.has(skill.canonical))
    .reduce((sum, skill) => sum + skill.weight, 0);

  return {
    matchPercentage: totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0,
    hasSkills,
    missingSkills: missingSkills.map(({ weight, resources, ...skill }) => ({ ...skill, ...(resources ? { resources } : {}) })),
    partialSkills,
    roadmap: buildRoadmap(missingSkills),
    resumeSuggestions: buildResumeSuggestions(missingSkills, partialSkills, requiredSkills)
  };
};
