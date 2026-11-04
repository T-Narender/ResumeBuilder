import React from "react";
import SectionHeader from "./SectionHeader";

const AchievementsBlock = ({ achievements, theme }) => {
  const validAchievements = (achievements || []).filter(
    (achievement) =>
      achievement?.title?.trim() || achievement?.description?.trim(),
  );
  if (validAchievements.length === 0) return null;

  return (
    <section style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      <SectionHeader title="Achievements" />
      <ul style={{ margin: "2px 0 0 16px", padding: 0 }}>
        {validAchievements.map((achievement, index) => (
          <li
            key={index}
            style={{ marginBottom: "3px", lineHeight: 1.35, fontSize: "12px" }}
          >
            {achievement.title && (
              <span style={{ fontWeight: 600, color: theme?.primaryColor || "#111827" }}>
                {achievement.title}
              </span>
            )}
            {achievement.description && (
              <span>{achievement.title ? " — " : ""}{achievement.description}</span>
            )}
            {achievement.year && <span style={{ color: "#666" }}> ({achievement.year})</span>}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AchievementsBlock;
