/**
 * Returns a fallback default response based on the type of content requested.
 * @param {string} type - 'summary' | 'bullets' | 'experience' | 'skills'
 * @returns {string} The default template string
 */
export const getDefaultTemplate = (type) => {
  switch (type?.toLowerCase()) {
    case "summary":
      return "Experienced software engineer with a strong background in developing scalable web applications. Proven track record of collaborating with cross-functional teams to deliver projects on time. Passionate about problem-solving and optimizing user experiences.";

    case "bullets":
      return JSON.stringify({
        bullets: [
          "Developed and maintained web applications using modern programming technologies.",
          "Collaborated with cross-functional teams to deliver high-quality features on time.",
          "Optimized application performance and resolved critical system bottlenecks."
        ]
      });

    case "experience":
      return JSON.stringify({
        role: "Software Engineer",
        company: "Global Tech Solutions",
        startDate: "2022-01",
        endDate: "Present",
        description: "Developed robust APIs and optimized databases to enhance response times. Collaborated closely with the product team to design and build user-friendly components. Improved overall performance and stability of internal systems."
      });

    case "skills":
      return JSON.stringify({
        skills: [
          { name: "JavaScript", category: "Programming Languages", progress: 90 },
          { name: "React", category: "Frontend Technologies", progress: 85 },
          { name: "Node.js", category: "Backend Technologies", progress: 80 },
          { name: "Git", category: "Tools", progress: 75 }
        ]
      });

    default:
      return "Default placeholder content.";
  }
};
