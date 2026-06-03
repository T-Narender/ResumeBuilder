import React from "react";
import SectionHeader from "./SectionHeader";

const ExperienceBlock = ({ experience, theme }) => {
  if (!experience || experience.length === 0) return null;

  const validExp = experience.filter((exp) => exp.company || exp.role);
  if (validExp.length === 0) return null;

  return (
    <section>
      <SectionHeader title="Experience" />
      <div>
        {validExp.map((exp, index) => (
          <div key={index} style={{ marginBottom: "14px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 600, lineHeight: 1.5 }}>
                {exp.role}
              </div>
              <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.5 }}>
                {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ""}
              </div>
            </div>
            {exp.company && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#444",
                  marginBottom: "4px",
                  lineHeight: 1.5,
                }}
              >
                {exp.company}
              </div>
            )}
            {exp.description && (
              <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                {exp.description
                  .split("\n")
                  .filter((line) => line.trim())
                  .map((bullet, idx) => (
                    <li
                      key={idx}
                      style={{
                        marginBottom: "4px",
                        lineHeight: 1.5,
                        fontSize: "12px",
                      }}
                    >
                      {bullet.replace(/^[•\-\*]\s*/, "")}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceBlock;
