import React from "react";
import SectionHeader from "./SectionHeader";

const EducationBlock = ({ education, theme }) => {
  console.log("Education:", education);
  if (!education || education.length === 0) return null;

  const validEdu = education.filter(
    (edu) =>
      (edu.degree || edu.institution) &&
      edu.institution !== "adaf" &&
      edu.degree !== "adaf" &&
      (edu.institution?.trim() || "") !== "" &&
      (edu.degree?.trim() || "") !== "",
  );
  if (validEdu.length === 0) return null;

  return (
    <section>
      <SectionHeader title="Education" />
      <div>
        {validEdu.map((edu, index) => (
          <div key={index} style={{ marginBottom: "14px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div
                style={{ fontSize: "13px", fontWeight: 600, lineHeight: 1.5 }}
              >
                {edu.degree} {edu.branch ? `— ${edu.branch}` : ""}
              </div>
              <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.5 }}>
                {edu.startDate
                  ? `${edu.startDate} – ${edu.endDate || "Present"}`
                  : edu.year || edu.endDate || ""}
              </div>
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#444",
                marginBottom: "4px",
                lineHeight: 1.5,
              }}
            >
              {edu.institution} {edu.cgpa ? `| CGPA: ${edu.cgpa}` : ""}
            </div>
            {edu.coursework && (
              <div
                style={{ marginTop: "2px", fontSize: "12px", lineHeight: 1.5 }}
              >
                <span style={{ fontWeight: 600 }}>Relevant Coursework:</span>{" "}
                {edu.coursework}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationBlock;
