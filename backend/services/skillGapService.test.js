import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeSkillGapLocally, extractSkills } from './skillGapService.js';

test('extracts canonical skills from aliases', () => {
  assert.deepEqual(
    extractSkills('Built a ReactJS and Node.js API with Mongo DB'),
    ['React', 'Node.js', 'MongoDB']
  );
});

test('classifies direct, partial, and missing skills', () => {
  const result = analyzeSkillGapLocally({
    resumeText: 'JavaScript developer building React applications',
    jobDescription: 'Required: React, Next.js, TypeScript, Docker'
  });

  assert.equal(result.matchPercentage, 25);
  assert.deepEqual(result.hasSkills, ['React']);
  assert.deepEqual(result.partialSkills, [
    {
      skill: 'TypeScript',
      gap: 'You have related experience, but not explicit TypeScript experience.'
    },
    {
      skill: 'Next.js',
      gap: 'You have related experience, but not explicit Next.js experience.'
    }
  ]);
  assert.deepEqual(result.missingSkills.map(({ skill }) => skill), ['Docker']);
  assert.equal(result.roadmap.length, 1);
});

test('weights required skills more than optional skills', () => {
  const result = analyzeSkillGapLocally({
    resumeText: 'JavaScript',
    jobDescription: 'JavaScript required; React preferred'
  });

  assert.equal(result.matchPercentage, 75);
});

test('returns a stable empty analysis when no catalog skills are found', () => {
  assert.deepEqual(
    analyzeSkillGapLocally({
      resumeText: 'A general professional summary',
      jobDescription: 'Excellent communication and leadership'
    }),
    {
      matchPercentage: 0,
      hasSkills: [],
      missingSkills: [],
      partialSkills: [],
      roadmap: [],
      resumeSuggestions: []
    }
  );
});
