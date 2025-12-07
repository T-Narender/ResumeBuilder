import React, { useState } from "react";
import { BrainIcon, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { AIChatSession } from "../../service/AIModal";

const prompt =
  "Job Role: {jobRole} at {company}. Based on this job role and company, generate 3 different professional work experience descriptions in 3-4 bullet points each that highlight key responsibilities, achievements, and impact. Format as: LEVEL: [entry/mid/senior] followed by the description with bullet points. Separate each description with '---'";

const WorkExperienceAI = ({
  workExperience,
  experienceIndex,
  onDescriptionSelect,
}) => {
  const [aiGeneratedDescriptions, setAIGeneratedDescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showRoleError, setShowRoleError] = useState(false);

  const GenerateDescriptionFromAI = async () => {
    // Check if role and company are filled
    const role = workExperience?.role?.trim();
    const company = workExperience?.company?.trim();

    if (!role) {
      setShowRoleError(true);
      setTimeout(() => setShowRoleError(false), 3000);
      return;
    }

    try {
      setLoading(true);
      setShowRoleError(false);

      const PROMPT = prompt
        .replace("{jobRole}", role)
        .replace("{company}", company || "the company");
      console.log("Work Experience Prompt:", PROMPT);

      const result = await AIChatSession.sendMessage(PROMPT);
      const responseText = result.response.text();

      console.log("AI Work Experience Response:", responseText);

      // Parse the text response
      const parsedDescriptions = parseTextResponse(responseText);
      setAIGeneratedDescriptions(parsedDescriptions);
    } catch (error) {
      console.error("Error generating AI work experience description:", error);
      // Fallback descriptions based on role if AI fails
      const fallbackDescriptions = generateFallbackDescriptions(role, company);
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
          const levelLine = lines.find((line) =>
            line.toLowerCase().includes("level:")
          );
          const level = levelLine ? levelLine.split(":")[1].trim() : "general";
          const description = lines
            .filter((line) => !line.toLowerCase().includes("level:"))
            .join("\n")
            .trim();

          return {
            level: level,
            description: description,
          };
        })
        .filter((item) => item.description.length > 0);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return [];
    }
  };

  const generateFallbackDescriptions = (role, company) => {
    const jobTitle = role.toLowerCase();
    const companyName = company || "the company";

    if (
      jobTitle.includes("software") ||
      jobTitle.includes("developer") ||
      jobTitle.includes("engineer")
    ) {
      return [
        {
          level: "entry",
          description: `• Developed and maintained web applications using modern technologies\n• Collaborated with senior developers to implement new features\n• Participated in code reviews and followed best practices\n• Assisted in debugging and troubleshooting application issues`,
        },
        {
          level: "mid",
          description: `• Led development of key features for web applications serving 10,000+ users\n• Mentored junior developers and conducted code reviews\n• Optimized application performance resulting in 30% faster load times\n• Collaborated with cross-functional teams to deliver projects on time`,
        },
        {
          level: "senior",
          description: `• Architected and led development of scalable microservices handling 1M+ requests daily\n• Managed a team of 5+ developers and established coding standards\n• Reduced system downtime by 40% through implementing robust monitoring solutions\n• Drove technical decisions and modernized legacy systems`,
        },
      ];
    } else if (
      jobTitle.includes("data") ||
      jobTitle.includes("analyst") ||
      jobTitle.includes("scientist")
    ) {
      return [
        {
          level: "entry",
          description: `• Analyzed datasets using Python/R and SQL to extract meaningful insights\n• Created visualizations and reports for stakeholders\n• Assisted in data cleaning and preprocessing tasks\n• Supported senior analysts in developing analytical models`,
        },
        {
          level: "mid",
          description: `• Led data analysis projects resulting in 15% increase in business efficiency\n• Developed automated reporting systems reducing manual work by 50%\n• Built predictive models with 85%+ accuracy for business forecasting\n• Collaborated with business teams to translate requirements into analytical solutions`,
        },
        {
          level: "senior",
          description: `• Established data science framework and best practices across the organization\n• Led cross-functional initiatives resulting in $2M+ cost savings\n• Mentored team of 8+ analysts and data scientists\n• Developed machine learning models driving 25% improvement in key metrics`,
        },
      ];
    } else if (
      jobTitle.includes("marketing") ||
      jobTitle.includes("digital") ||
      jobTitle.includes("social")
    ) {
      return [
        {
          level: "entry",
          description: `• Assisted in developing and executing marketing campaigns across multiple channels\n• Created engaging content for social media platforms\n• Analyzed campaign performance metrics and prepared reports\n• Supported senior marketers in market research activities`,
        },
        {
          level: "mid",
          description: `• Managed digital marketing campaigns with budgets up to $100K\n• Increased brand engagement by 40% through strategic content creation\n• Led social media strategy resulting in 60% follower growth\n• Collaborated with design and content teams to deliver cohesive campaigns`,
        },
        {
          level: "senior",
          description: `• Developed comprehensive marketing strategy driving 35% revenue growth\n• Managed marketing team of 10+ professionals across multiple channels\n• Launched successful product campaigns generating $5M+ in revenue\n• Established marketing automation processes improving efficiency by 50%`,
        },
      ];
    } else {
      return [
        {
          level: "entry",
          description: `• Contributed to key projects and initiatives at ${companyName}\n• Collaborated with team members to achieve departmental goals\n• Developed foundational skills in ${role} responsibilities\n• Supported senior colleagues in day-to-day operations`,
        },
        {
          level: "mid",
          description: `• Led multiple projects resulting in improved operational efficiency\n• Mentored junior team members and facilitated knowledge transfer\n• Implemented process improvements saving 20+ hours per week\n• Collaborated with cross-functional teams to deliver strategic initiatives`,
        },
        {
          level: "senior",
          description: `• Developed strategic initiatives driving significant business impact\n• Managed team of professionals and established best practices\n• Led organizational change resulting in measurable improvements\n• Served as subject matter expert and key decision maker`,
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
          className="border-blue-500 text-blue-600 bg-transparent border flex gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-50 disabled:opacity-50 transition-colors"
        >
          <BrainIcon className="h-4 w-4 flex-shrink-0" />
          {loading ? "Generating..." : "Generate Descriptions"}
        </button>
      </div>

      {/* Role Required Error */}
      {showRoleError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">
            <strong>Please fill in the role field first</strong> to generate
            relevant work experience descriptions.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 text-sm">
            Generating descriptions for "{workExperience?.role}"...
          </span>
        </div>
      )}

      {/* AI Descriptions Cards */}
      {aiGeneratedDescriptions.length > 0 && !loading && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Choose a description for <strong>"{workExperience?.role}"</strong>{" "}
            that matches your experience level:
          </p>

          {aiGeneratedDescriptions.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full uppercase">
                  {item.level}
                </span>
                <button
                  onClick={() => copyToClipboard(item.description, index)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
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
                className="text-gray-700 text-sm leading-relaxed text-left whitespace-pre-line"
                dir="ltr"
              >
                {item.description}
              </div>
            </div>
          ))}

          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              💡 <strong>Tip:</strong> Copy any description and paste it in the
              description field below to use and modify as needed.
            </p>
          </div>
        </div>
      )}

      {/* No descriptions state */}
      {aiGeneratedDescriptions.length === 0 && !loading && !showRoleError && (
        <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
          <BrainIcon className="h-8 w-8 text-gray-400 mx-auto mb-1" />
          <p className="text-gray-600 text-sm">
            {workExperience?.role
              ? `Click "Generate Descriptions" to get AI-powered work experience descriptions for ${workExperience.role}`
              : 'Fill in the role field above, then click "Generate Descriptions" to get AI-powered work experience ideas'}
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkExperienceAI;
