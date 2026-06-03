import React, { useState } from "react";
import { BrainIcon, Copy, AlertCircle, RefreshCw } from "lucide-react";
import { BASE_URL, API_PATHS } from "../utils/apiPath";
import toast from "react-hot-toast";

const prompt =
  "You are a professional resume assistant. Return projects as strict JSON only:\n" +
  "{\n" +
  '  "name": "Project Name",\n' +
  '  "techStack": ["Tech1", "Tech2"],\n' +
  '  "github": "url",\n' +
  '  "liveDemo": "url",\n' +
  '  "bullets": [\n' +
  '    "Action verb + what you built + result",\n' +
  '    "Action verb + what you built + result"\n' +
  "  ]\n" +
  "}\n" +
  "Never return tech stack and description as one string. Never include 'Technologies Used :' prefix. " +
  "Generate one polished resume-ready project object for the title: `{projectTitle}`";

const ProjectAI = ({ project, projectIndex, onProjectDataSelect }) => {
  const [aiGeneratedProject, setAIGeneratedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);

  const GenerateDescriptionFromAI = async (regenerate = false) => {
    // Check if project name is filled
    const title = project?.name?.trim();

    if (!title) {
      setShowTitleError(true);
      setTimeout(() => setShowTitleError(false), 3000);
      return;
    }

    try {
      setLoading(true);
      setShowTitleError(false);

      const PROMPT = prompt.replace("{projectTitle}", title);
      console.log("Project Prompt:", PROMPT);

      const response = await fetch(
        `${BASE_URL}${API_PATHS.AI.GENERATE}`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            prompt: PROMPT,
            regenerate: regenerate
          })
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || 'Failed to generate descriptions');
        const fallbackProject = generateFallbackProject(title);
        setAIGeneratedProject(fallbackProject);
        return;
      }
      const text = data.response;

      console.log("AI Project Response:", text);

      // Parse the text response as strict JSON.
      const parsedProject = parseTextResponse(text);
      setAIGeneratedProject(parsedProject);
    } catch (error) {
      console.error("Error generating AI project description:", error);
      toast.error('Failed to generate descriptions');
      // Fallback descriptions based on title if AI fails
      const fallbackProject = generateFallbackProject(title);
      setAIGeneratedProject(fallbackProject);
    } finally {
      setLoading(false);
    }
  };

  const parseTextResponse = (text) => {
    try {
      let jsonStr = text.trim();
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
      } else if (jsonStr.includes("```")) {
        jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
      }

      const parsed = JSON.parse(jsonStr);
      const project = Array.isArray(parsed) ? parsed[0] : parsed;

      return {
        name: project?.name || "",
        techStack: Array.isArray(project?.techStack) ? project.techStack : [],
        github: project?.github || "",
        liveDemo: project?.liveDemo || "",
        bullets: Array.isArray(project?.bullets) ? project.bullets : [],
      };
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return null;
    }
  };

  const generateFallbackProject = (title) => {
    const projectTitle = title.toLowerCase();

    if (
      projectTitle.includes("portfolio") ||
      projectTitle.includes("website") ||
      projectTitle.includes("web")
    ) {
      return {
        name: title,
        techStack: ["React", "Tailwind CSS", "Node.js"],
        github: "",
        liveDemo: "",
        bullets: [
          "Developed a responsive portfolio website to showcase projects and experience.",
          "Implemented a polished user interface with optimized navigation and content layout.",
          "Improved recruiter engagement with fast-loading, mobile-friendly presentation.",
        ],
      };
    } else if (
      projectTitle.includes("ecommerce") ||
      projectTitle.includes("shop") ||
      projectTitle.includes("store")
    ) {
      return {
        name: title,
        techStack: ["React", "Node.js", "MongoDB"],
        github: "",
        liveDemo: "",
        bullets: [
          "Developed an e-commerce platform with product browsing and checkout flows.",
          "Integrated secure payments and responsive product management screens.",
          "Improved purchase flow efficiency with a streamlined user experience.",
        ],
      };
    } else if (
      projectTitle.includes("mobile") ||
      projectTitle.includes("app") ||
      projectTitle.includes("android") ||
      projectTitle.includes("ios")
    ) {
      return {
        name: title,
        techStack: ["React Native", "Firebase"],
        github: "",
        liveDemo: "",
        bullets: [
          "Developed a cross-platform mobile app with smooth navigation and responsive screens.",
          "Integrated device features and real-time data synchronization for improved usability.",
          "Reduced friction for users through a native-like mobile experience.",
        ],
      };
    } else if (
      projectTitle.includes("api") ||
      projectTitle.includes("backend") ||
      projectTitle.includes("server")
    ) {
      return {
        name: title,
        techStack: ["Node.js", "Express.js", "MongoDB"],
        github: "",
        liveDemo: "",
        bullets: [
          "Developed a REST API with scalable routing and structured data handling.",
          "Implemented authentication and reliable request processing for application integrations.",
          "Improved backend maintainability through clean service boundaries and reusable logic.",
        ],
      };
    } else if (
      projectTitle.includes("dashboard") ||
      projectTitle.includes("admin") ||
      projectTitle.includes("analytics")
    ) {
      return {
        name: title,
        techStack: ["React", "Chart.js", "Node.js"],
        github: "",
        liveDemo: "",
        bullets: [
          "Built an interactive dashboard with real-time data visualization and filtering.",
          "Implemented analytics views that improved decision-making for stakeholders.",
          "Reduced reporting effort by automating metric display and export workflows.",
        ],
      };
    } else {
      return {
        name: title,
        techStack: ["React", "Node.js"],
        github: "",
        liveDemo: "",
        bullets: [
          `Developed ${title} using modern web technologies and best practices.`,
          "Implemented a clean, user-friendly interface with maintainable code structure.",
          "Improved usability and performance through focused end-user enhancements.",
        ],
      };
    }
  };

  const copyToClipboard = async (projectData) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(projectData, null, 2));
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="mt-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-semibold text-gray-800">
          AI Description Suggestions
        </h4>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              GenerateDescriptionFromAI(false);
            }}
            disabled={loading}
            className="border-green-500 text-green-600 bg-transparent border flex gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-green-50 disabled:opacity-50 transition-colors"
          >
            <BrainIcon className="h-4 w-4 shrink-0" />
            {loading ? "Generating..." : "Generate Descriptions"}
          </button>

          {aiGeneratedProject && (
            <button
              onClick={(e) => {
                e.preventDefault();
                GenerateDescriptionFromAI(true);
              }}
              disabled={loading}
              className="border-orange-500 text-orange-600 bg-transparent border flex gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-orange-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 shrink-0" />
              {loading ? "Regenerating..." : "Regenerate"}
            </button>
          )}
        </div>
      </div>

      {/* Title Required Error */}
      {showTitleError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">
            <strong>Please fill in the project name first</strong> to generate
            relevant project descriptions.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600 text-sm">
            Generating descriptions for "{project?.name}"...
          </span>
        </div>
      )}

      {/* AI Descriptions Cards */}
      {aiGeneratedProject && !loading && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Review the generated project data for{" "}
            <strong>"{project?.name || project?.title}"</strong>:
          </p>
          <div className="bg-linear-to-r from-green-50 to-white border border-green-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full uppercase">
                Project JSON
              </span>
              <button
                onClick={() => copyToClipboard(aiGeneratedProject)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 transition-colors"
              >
                <Copy size={12} />
                Copy
              </button>
            </div>

            <div
              className="text-gray-700 text-sm leading-relaxed text-left space-y-2"
              dir="ltr"
            >
              <div>
                <strong>Name:</strong> {aiGeneratedProject.name}
              </div>
              <div>
                <strong>Tech Stack:</strong>{" "}
                {(aiGeneratedProject.techStack || []).join(", ")}
              </div>
              <div>
                <strong>Bullets:</strong>
              </div>
              <ul className="ml-4 list-disc">
                {(aiGeneratedProject.bullets || []).map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="mt-3 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700"
              onClick={() => onProjectDataSelect?.(aiGeneratedProject)}
            >
              Use This Project Data
            </button>
          </div>

          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              💡 <strong>Tip:</strong> Copy any description and paste it in the
              description field below to use and modify as needed.
            </p>
          </div>
        </div>
      )}

      {/* No descriptions state */}
      {!aiGeneratedProject && !loading && !showTitleError && (
        <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
          <BrainIcon className="h-8 w-8 text-gray-400 mx-auto mb-1" />
          <p className="text-gray-600 text-sm">
            {project?.name || project?.title
              ? `Click "Generate Descriptions" to get AI-powered project data for ${project.name}`
              : 'Fill in the project name above, then click "Generate Descriptions" to get AI-powered project data ideas'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectAI;
