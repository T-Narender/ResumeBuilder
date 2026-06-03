/**
 * normalizeResumeData.js
 * Phase 10: Data Compatibility Layer
 * Converts old saved resume data to V2 format safely without deleting legacy fields.
 */

export const normalizeResumeData = (resumeData) => {
  if (!resumeData) return resumeData;

  const v2Data = { ...resumeData }; // shallow copy to preserve everything

  const normalizeProject = (project) => {
    if (!project) return null;

    const name = (project.name || project.title || "").trim();
    if (!name) return null;

    const techStack = Array.isArray(project.techStack)
      ? project.techStack.map((item) => String(item).trim()).filter(Boolean)
      : typeof project.techStack === "string"
        ? project.techStack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
        : typeof project.description === "string" && project.description.includes("Technologies Used")
          ? project.description
            .split("Technologies Used")
            .pop()
            .split(/[\n•]/)[0]
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
          : [];

    const bullets = Array.isArray(project.bullets)
      ? project.bullets.map((item) => String(item).trim()).filter(Boolean)
      : typeof project.description === "string"
        ? project.description
          .split(/\r?\n/)
          .map((line) => line.replace(/^[-*•]\s*/, "").trim())
          .filter(Boolean)
        : [];

    return {
      name,
      techStack,
      bullets,
      github: project.github || "",
      liveDemo: project.liveDemo || "",
    };
  };

  // --- Normalize Skills (Phase 5/10) ---
  // Old format: Array of objects [{ name: "React", rating: 4, category: "Frontend" }]
  // New format (used by V2 SkillsBlock): Object grouping by category { Frontend: ["React"] }
  if (Array.isArray(v2Data.skills)) {
    const groupedSkills = {};
    v2Data.skills.forEach(skill => {
      if (skill && skill.name && skill.name.trim() !== '') {
        // Fallback category if none provided
        const category = skill.category || 'Tools';
        if (!groupedSkills[category]) {
          groupedSkills[category] = [];
        }
        groupedSkills[category].push(skill.name.trim());
      }
    });

    // We don't overwrite the original 'skills' array completely to keep legacy backward compatible,
    // instead we can store it in 'v2Skills' or if the ATS components expect 'skills' to be an object,
    // we should ideally keep the original array in a legacy field.
    // However, since we might need the original 'skills' array for legacy templates, 
    // we'll pass 'groupedSkills' as a separate property or handle it in the component.
    // Actually, Phase 10 explicitly asks: NEW format: skills: { Frontend: ["React"] }
    // We will keep old array as _legacySkills
    v2Data._legacySkills = [...v2Data.skills];
    v2Data.skills = groupedSkills;
  }

  // Add more normalization logic here if needed for other arrays (like removing completely empty objects)
  if (Array.isArray(v2Data.workExperience)) {
    v2Data.workExperience = v2Data.workExperience.map(exp => ({ ...exp }));
  }

  if (Array.isArray(v2Data.projects)) {
    v2Data.projects = v2Data.projects
      .map(normalizeProject)
      .filter(Boolean);
  }

  // Mark as V2 compatible
  v2Data._isV2Compatible = true;

  return v2Data;
};
