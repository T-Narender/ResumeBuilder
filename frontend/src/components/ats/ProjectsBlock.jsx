import React from "react";
import SectionHeader from "./SectionHeader";

const ProjectsBlock = ({ projects, theme }) => {
  console.log(
    "Projects received in ProjectsBlock:",
    JSON.stringify(projects, null, 2),
  );
  if (!projects || projects.length === 0) return null;
  const validProjects = projects.filter((project) => {
    console.log("Project data:", JSON.stringify(project, null, 2));
    return (
      project?.name?.trim() &&
      Array.isArray(project.techStack) &&
      Array.isArray(project.bullets)
    );
  });
  if (validProjects.length === 0) {
    console.log("No valid projects after filtering");
    return null;
  }

  return (
    <section>
      <SectionHeader title="Projects" />
      <div>
        {validProjects.map((project, index) => (
          <div key={index} style={{ marginBottom: "9px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: 1.3,
                  color: "#111111",
                }}
              >
                {project.name}
              </span>
              <span
                style={{ fontSize: "12px", color: "#1a1a1a", lineHeight: 1.35 }}
              >
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1a1a1a", textDecoration: "none" }}
                  >
                    GitHub
                  </a>
                )}
                {project.github && project.liveDemo && " | "}
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1a1a1a", textDecoration: "none" }}
                  >
                    Live Demo
                  </a>
                )}
              </span>
            </div>
            <p
              style={{
                fontStyle: "italic",
                color: "#202020",
                fontWeight: 600,
                fontSize: "11px",
                marginBottom: "5px",
                marginTop: "3px",
                lineHeight: 1.35,
              }}
            >
              {Array.isArray(project.techStack)
                ? project.techStack.join(", ")
                : typeof project.techStack === "string"
                  ? project.techStack
                  : ""}
            </p>
            <ul style={{ margin: 0, padding: 0, marginLeft: "16px" }}>
              {project.bullets.map((bullet, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: "3px",
                    lineHeight: 1.35,
                    fontSize: "12px",
                  }}
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsBlock;
