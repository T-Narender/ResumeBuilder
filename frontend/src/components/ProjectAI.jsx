import React, { useState } from "react";
import { BrainIcon, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { AIChatSession } from "../../service/AIModal";

const prompt =
/*
. Based on this project title, generate 3 different professional project descriptions in 3-4 sentences each that highlight key technologies used, features implemented, and impact/results achieved. Format as: TYPE: [web-app/mobile-app/api/other] followed by the description. Separate each description with '---'
*/

"You are a professional resume writing assistant.  Your task is to generate **3 different resume-ready project descriptions** based on the given project title.  Each description must strictly follow this format:1. First line → The **Project Title in UPPERCASE**, followed by     `— Technologies Used :` and list 3–6 realistic technologies relevant to the project.  (Example: QUICKBILLING — Technologies Used : Node.js, Express.js, EJS, MongoDB)  2. Second line → Add a label `TYPE:` (choose one: Web-App, Mobile-App, API, Tool, or System).  3. Third line onward → Write a **3–4 sentence professional description** that highlights:  - The **key technologies/features implemented** (authentication, dashboards, data visualization, automation, etc.).  - The **impact/results achieved** (e.g., improved performance, reduced costs, higher adoption, measurable KPIs).  - Always use **action verbs** like Developed, Designed, Implemented, Automated, Optimized.  - Always try to include **numbers or percentages** for credibility (e.g., 'reduced processing time by 40%', 'adopted by 50+ users').  4. Separate each version with `---`.Formatting rules:- Keep the tone **professional, concise, and resume-ready**.  - Ensure **project title always appears at the top** as shown in the example.  Example Input:  Project Title: QuickBilling  Example Output:  QUICKBILLING — Technologies Used : Node.js, Express.js, EJS, MongoDB  TYPE: Web-App  Developed a billing and inventory management system enabling small shops to track items, generate bills, and manage reports efficiently. Designed EJS-based responsive templates for real-time updates powered by MongoDB. Reduced manual billing errors by 40% and increased reporting efficiency by 60%.  ---  QUICKBILLING — Technologies Used : React, Node.js, Firebase,Tailwind CSS  TYPE: Web-App  Built a modern QuickBilling platform with React for the frontend and Firebase for authentication and cloud data storage. Implemented role-based access, invoice downloads, and analytics dashboards. Helped reduce bookkeeping time by 2+ hours daily while improving customer billing accuracy.  ---  QUICKBILLING — Technologies Used : Angular, Spring Boot, PostgreSQL, Redis  TYPE: System  Engineered a scalable enterprise billing and inventory system with microservices architecture using Spring Boot and PostgreSQL. Integrated Redis caching for high-speed invoice generation and data consistency. Achieved 99.9% uptime during testing and processed 500+ concurrent transactions smoothly.  Now generate descriptions for this project title: `{projectTitle}`"

const ProjectAI = ({ project, projectIndex, onDescriptionSelect }) => {
  const [aiGeneratedDescriptions, setAIGeneratedDescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showTitleError, setShowTitleError] = useState(false);

  const GenerateDescriptionFromAI = async () => {
    // Check if project title is filled
    const title = project?.title?.trim();

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

      const result = await AIChatSession.sendMessage(PROMPT);
      const responseText = result.response.text();

      console.log("AI Project Response:", responseText);

      // Parse the text response
      const parsedDescriptions = parseTextResponse(responseText);
      setAIGeneratedDescriptions(parsedDescriptions);
    } catch (error) {
      console.error("Error generating AI project description:", error);
      // Fallback descriptions based on title if AI fails
      const fallbackDescriptions = generateFallbackDescriptions(title);
      setAIGeneratedDescriptions(fallbackDescriptions);
    } finally {
      setLoading(false);
    }
  };

  const parseTextResponse = (text) => {
    try {
      const sections = text.split("---").map((section) => section.trim());
      return sections
        .map((section) => {
          const lines = section.split("\n");
          const typeLine = lines.find((line) =>
            line.toLowerCase().includes("type:")
          );
          const type = typeLine ? typeLine.split(":")[1].trim() : "general";
          const description = lines
            .filter((line) => !line.toLowerCase().includes("type:"))
            .join(" ")
            .trim();

          return {
            type: type,
            description: description,
          };
        })
        .filter((item) => item.description.length > 0);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return [];
    }
  };

  const generateFallbackDescriptions = (title) => {
    const projectTitle = title.toLowerCase();

    if (
      projectTitle.includes("portfolio") ||
      projectTitle.includes("website") ||
      projectTitle.includes("web")
    ) {
      return [
        {
          type: "web-app",
          description: `A responsive portfolio website built with modern web technologies to showcase personal projects and skills. Features include interactive UI components, smooth animations, and optimized performance for better user experience across all devices.`,
        },
        {
          type: "web-app",
          description: `Professional portfolio website developed using React/Vue and modern CSS frameworks. Implements responsive design principles, SEO optimization, and fast loading times to effectively present work and achievements to potential clients and employers.`,
        },
        {
          type: "web-app",
          description: `Dynamic portfolio platform featuring project galleries, contact forms, and blog functionality. Built with focus on user experience, accessibility standards, and cross-browser compatibility to maximize reach and engagement.`,
        },
      ];
    } else if (
      projectTitle.includes("ecommerce") ||
      projectTitle.includes("shop") ||
      projectTitle.includes("store")
    ) {
      return [
        {
          type: "web-app",
          description: `Full-stack e-commerce platform with user authentication, product catalog, shopping cart, and payment gateway integration. Features include inventory management, order tracking, and responsive design for seamless shopping experience across devices.`,
        },
        {
          type: "web-app",
          description: `Scalable online marketplace built with modern web technologies, featuring secure payment processing, user reviews, and admin dashboard. Implemented search and filtering capabilities, resulting in improved user engagement and conversion rates.`,
        },
        {
          type: "web-app",
          description: `Comprehensive e-commerce solution with real-time inventory updates, multi-vendor support, and analytics dashboard. Developed using microservices architecture to ensure high availability and performance under heavy traffic loads.`,
        },
      ];
    } else if (
      projectTitle.includes("mobile") ||
      projectTitle.includes("app") ||
      projectTitle.includes("android") ||
      projectTitle.includes("ios")
    ) {
      return [
        {
          type: "mobile-app",
          description: `Cross-platform mobile application developed with React Native/Flutter, featuring intuitive user interface and smooth navigation. Integrates device APIs and cloud services to deliver native-like performance and user experience.`,
        },
        {
          type: "mobile-app",
          description: `Native mobile app with offline capabilities, push notifications, and real-time data synchronization. Implements modern mobile design patterns and follows platform-specific guidelines for optimal user engagement and retention.`,
        },
        {
          type: "mobile-app",
          description: `Feature-rich mobile application with biometric authentication, location services, and social media integration. Built with focus on performance optimization and battery efficiency while maintaining high user satisfaction ratings.`,
        },
      ];
    } else if (
      projectTitle.includes("api") ||
      projectTitle.includes("backend") ||
      projectTitle.includes("server")
    ) {
      return [
        {
          type: "api",
          description: `RESTful API built with Node.js/Python, featuring comprehensive authentication, rate limiting, and documentation. Implements clean architecture principles and follows industry best practices for scalability and maintainability.`,
        },
        {
          type: "api",
          description: `Scalable backend service with microservices architecture, database optimization, and automated testing. Features include real-time data processing, caching strategies, and monitoring systems for high availability and performance.`,
        },
        {
          type: "api",
          description: `Robust API platform with GraphQL/REST endpoints, comprehensive error handling, and security implementations. Supports high concurrent users and integrates with third-party services for enhanced functionality and reliability.`,
        },
      ];
    } else if (
      projectTitle.includes("dashboard") ||
      projectTitle.includes("admin") ||
      projectTitle.includes("analytics")
    ) {
      return [
        {
          type: "web-app",
          description: `Interactive dashboard application with real-time data visualization, advanced filtering, and export capabilities. Built with modern charting libraries and responsive design to provide insights and analytics for business decision-making.`,
        },
        {
          type: "web-app",
          description: `Comprehensive admin panel with user management, content management, and system monitoring features. Implements role-based access control and audit logging for secure and efficient administrative operations.`,
        },
        {
          type: "web-app",
          description: `Data-driven dashboard platform featuring customizable widgets, automated reporting, and integration with multiple data sources. Provides actionable insights through interactive visualizations and performance metrics tracking.`,
        },
      ];
    } else {
      return [
        {
          type: "general",
          description: `Innovative ${title} project developed using modern technologies and best practices. Features clean architecture, user-friendly interface, and efficient performance to solve real-world problems and deliver value to users.`,
        },
        {
          type: "general",
          description: `Comprehensive ${title} solution built with focus on scalability, maintainability, and user experience. Implements industry standards and follows agile development practices to ensure high-quality deliverable and user satisfaction.`,
        },
        {
          type: "general",
          description: `Well-structured ${title} project showcasing technical expertise and problem-solving skills. Features responsive design, optimized performance, and thorough testing to demonstrate professional development capabilities and attention to detail.`,
        },
      ];
    }
  };

  const copyToClipboard = async (description, index) => {
    try {
      await navigator.clipboard.writeText(description);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
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
        <button
          onClick={(e) => {
            e.preventDefault();
            GenerateDescriptionFromAI();
          }}
          disabled={loading}
          className="border-green-500 text-green-600 bg-transparent border flex gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-green-50 disabled:opacity-50 transition-colors"
        >
          <BrainIcon className="h-4 w-4 flex-shrink-0" />
          {loading ? "Generating..." : "Generate Descriptions"}
        </button>
      </div>

      {/* Title Required Error */}
      {showTitleError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">
            <strong>Please fill in the project title first</strong> to generate
            relevant project descriptions.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600 text-sm">
            Generating descriptions for "{project?.title}"...
          </span>
        </div>
      )}

      {/* AI Descriptions Cards */}
      {aiGeneratedDescriptions.length > 0 && !loading && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Choose a description for <strong>"{project?.title}"</strong> that
            best fits your project:
          </p>

          {aiGeneratedDescriptions.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full uppercase">
                  {item.type}
                </span>
                <button
                  onClick={() => copyToClipboard(item.description, index)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 transition-colors"
                >
                  {copiedIndex === index ? (
                    <>
                      <CheckCircle size={12} className="text-green-500" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div
                className="text-gray-700 text-sm leading-relaxed text-left"
                dir="ltr"
              >
                {item.description}
              </div>
            </div>
          ))}

          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              💡 <strong>Tip:</strong> Copy any description and paste it in the
              description field below to use and modify as needed.
            </p>
          </div>
        </div>
      )}

      {/* No descriptions state */}
      {aiGeneratedDescriptions.length === 0 && !loading && !showTitleError && (
        <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
          <BrainIcon className="h-8 w-8 text-gray-400 mx-auto mb-1" />
          <p className="text-gray-600 text-sm">
            {project?.title
              ? `Click "Generate Descriptions" to get AI-powered project descriptions for ${project.title}`
              : 'Fill in the project title above, then click "Generate Descriptions" to get AI-powered project description ideas'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectAI;
