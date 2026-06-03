import React, { useState, useEffect } from "react";

const TARGET_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
];

// Basic keyword dictionary for demonstration. In a real app, this could come from an API or larger dictionary.
const KEYWORDS = {
  "Software Engineer": [
    "java",
    "python",
    "c++",
    "algorithms",
    "data structures",
    "git",
    "agile",
    "sql",
    "aws",
    "docker",
  ],
  "Frontend Developer": [
    "html",
    "css",
    "javascript",
    "react",
    "vue",
    "angular",
    "tailwind",
    "responsive",
    "ui",
    "ux",
    "webpack",
  ],
  "Backend Developer": [
    "node.js",
    "express",
    "java",
    "spring",
    "python",
    "django",
    "sql",
    "mongodb",
    "api",
    "rest",
    "graphql",
    "docker",
    "aws",
  ],
  "Full Stack Developer": [
    "react",
    "node.js",
    "javascript",
    "typescript",
    "mongodb",
    "sql",
    "api",
    "html",
    "css",
    "aws",
    "docker",
    "express",
  ],
  "Data Analyst": [
    "python",
    "sql",
    "r",
    "excel",
    "tableau",
    "power bi",
    "statistics",
    "data visualization",
    "pandas",
    "machine learning",
  ],
};

const ATSChecker = ({ resumeData }) => {
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [score, setScore] = useState(0);
  const [results, setResults] = useState({
    completeness: { score: 0, max: 40, missing: [] },
    formatQuality: { score: 0, max: 30, issues: [] },
    keywords: { score: 0, max: 30, found: 0 },
  });

  useEffect(() => {
    if (!resumeData) return;
    evaluateATS();
  }, [resumeData, targetRole]);

  const evaluateATS = () => {
    let currentScore = 0;

    // 1. Section Completeness (40 points)
    let compScore = 0;
    let missingComp = [];

    if (resumeData.profileInfo?.fullName?.trim()) compScore += 5;
    else missingComp.push("Name");
    if (resumeData.profileInfo?.designation?.trim()) compScore += 5;
    else missingComp.push("Professional Title");
    if (resumeData.contactInfo?.email?.trim()) compScore += 5;
    else missingComp.push("Email");
    if (resumeData.contactInfo?.phone?.trim()) compScore += 5;
    else missingComp.push("Phone");
    if (resumeData.contactInfo?.linkedin?.trim()) compScore += 5;
    else missingComp.push("LinkedIn URL");
    if (resumeData.contactInfo?.github?.trim()) compScore += 5;
    else missingComp.push("GitHub URL");

    const validProjects = (resumeData.projects || []).filter((p) =>
      p.name?.trim(),
    );
    if (validProjects.length >= 1) compScore += 5;
    else missingComp.push("Projects (at least 1)");

    // Check skills (could be array or normalized object)
    let skillsCount = 0;
    if (Array.isArray(resumeData.skills)) {
      skillsCount = resumeData.skills.filter((s) => s.name?.trim()).length;
    } else if (typeof resumeData.skills === "object") {
      Object.values(resumeData.skills).forEach((arr) => {
        if (Array.isArray(arr)) skillsCount += arr.length;
      });
    }
    if (skillsCount >= 3) compScore += 5;
    else missingComp.push("Skills (at least 3)");

    currentScore += compScore;

    // 2. Format Quality (30 points)
    let formatScore = 0;
    let formatIssues = [];

    // Check if skill ratings used (if it's the old array format and progress > 0)
    let usesRatings = false;
    if (Array.isArray(resumeData._legacySkills || resumeData.skills)) {
      usesRatings = (resumeData._legacySkills || resumeData.skills).some(
        (s) => s.progress && s.progress > 0,
      );
    }
    if (!usesRatings) formatScore += 10;
    else formatIssues.push("Remove visual skill ratings/bars");

    // Check bullets used in experience
    let usesParagraphs = false;
    const validExp = (resumeData.workExperience || []).filter(
      (e) => e.company?.trim() || e.description?.trim(),
    );
    validExp.forEach((exp) => {
      if (exp.description && !exp.description.includes("\n")) {
        // rough heuristic: if it's long and has no newlines, it might be a paragraph
        if (exp.description.length > 100) usesParagraphs = true;
      }
    });
    // In a real scenario we'd check if semantic UL is used, but based on data, we check description format
    if (!usesParagraphs) formatScore += 10;
    else formatIssues.push("Convert experience paragraphs to bullets");

    // Summary under 60 words
    const summaryWords = (resumeData.profileInfo?.summary || "")
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    if (summaryWords > 0 && summaryWords <= 60) formatScore += 10;
    else if (summaryWords > 60)
      formatIssues.push("Summary is too long (> 60 words)");
    else formatIssues.push("Add a professional summary"); // if 0

    currentScore += formatScore;

    // 3. Keyword Presence (30 points)
    let keywordScore = 0;
    const allText = JSON.stringify(resumeData).toLowerCase();
    const targetKeywords = KEYWORDS[targetRole] || [];
    let foundKeywordsCount = 0;

    targetKeywords.forEach((kw) => {
      if (allText.includes(kw.toLowerCase())) {
        foundKeywordsCount++;
      }
    });

    // Score proportional to keywords found (max 30 points)
    if (targetKeywords.length > 0) {
      keywordScore = Math.min(
        30,
        Math.round(
          (foundKeywordsCount / Math.min(5, targetKeywords.length)) * 30,
        ),
      );
      // e.g., finding 5 keywords gives full 30 points
    }
    currentScore += keywordScore;

    setScore(currentScore);
    setResults({
      completeness: { score: compScore, max: 40, missing: missingComp },
      formatQuality: { score: formatScore, max: 30, issues: formatIssues },
      keywords: { score: keywordScore, max: 30, found: foundKeywordsCount },
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        backgroundColor: "#f8fafc",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: 0,
            color: "#0f172a",
          }}
        >
          ATS Completeness Checker
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label
            style={{ fontSize: "14px", fontWeight: "bold", color: "#475569" }}
          >
            Target Role:
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
            }}
          >
            {TARGET_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor:
              score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        >
          {score}
        </div>
        <div>
          <div
            style={{ fontSize: "14px", fontWeight: "bold", color: "#64748b" }}
          >
            Overall ATS Score
          </div>
          <div style={{ fontSize: "14px", color: "#94a3b8" }}>
            Targeting 80+ is recommended for ATS parsing.
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
        {/* Section Completeness */}
        <div
          style={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#334155" }}>
              Section Completeness
            </span>
            <span style={{ fontWeight: "bold", color: "#475569" }}>
              {results.completeness.score}/{results.completeness.max}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              backgroundColor: "#f1f5f9",
              height: "8px",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(results.completeness.score / results.completeness.max) * 100}%`,
                backgroundColor: "#3b82f6",
                height: "100%",
              }}
            ></div>
          </div>
          {results.completeness.missing.length > 0 && (
            <div
              style={{ marginTop: "8px", fontSize: "12px", color: "#ef4444" }}
            >
              <strong>Missing:</strong>{" "}
              {results.completeness.missing.join(", ")}
            </div>
          )}
        </div>

        {/* Format Quality */}
        <div
          style={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#334155" }}>
              Format Quality
            </span>
            <span style={{ fontWeight: "bold", color: "#475569" }}>
              {results.formatQuality.score}/{results.formatQuality.max}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              backgroundColor: "#f1f5f9",
              height: "8px",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(results.formatQuality.score / results.formatQuality.max) * 100}%`,
                backgroundColor: "#8b5cf6",
                height: "100%",
              }}
            ></div>
          </div>
          {results.formatQuality.issues.length > 0 && (
            <div
              style={{ marginTop: "8px", fontSize: "12px", color: "#ef4444" }}
            >
              <strong>Issues:</strong> {results.formatQuality.issues.join(", ")}
            </div>
          )}
        </div>

        {/* Keywords */}
        <div
          style={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#334155" }}>
              Keywords Found
            </span>
            <span style={{ fontWeight: "bold", color: "#475569" }}>
              {results.keywords.score}/{results.keywords.max}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              backgroundColor: "#f1f5f9",
              height: "8px",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(results.keywords.score / results.keywords.max) * 100}%`,
                backgroundColor: "#10b981",
                height: "100%",
              }}
            ></div>
          </div>
          <div style={{ marginTop: "8px", fontSize: "12px", color: "#64748b" }}>
            Found {results.keywords.found} target keywords for {targetRole}.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSChecker;
