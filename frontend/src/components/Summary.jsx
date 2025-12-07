import React, { useState } from "react";
import { BrainIcon, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { AIChatSession } from "../../service/AIModal";

const prompt =
  "Job Title: {jobTitle}. Based on this job title, generate 3 different professional resume summaries in 4-5 lines each that highlight relevant skills, experience expectations, and career objectives. Format as: LEVEL: [fresher/mid-level/experienced] followed by the summary text. Separate each summary with '---'";

const Summary = ({ profileData }) => {
  const [aiGeneratedSummaryList, setAIGeneratedSummaryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showDesignationError, setShowDesignationError] = useState(false);

  const GenerateSummaryFromAI = async () => {
    const designation = profileData?.designation?.trim();

    if (!designation) {
      setShowDesignationError(true);
      setTimeout(() => setShowDesignationError(false), 3000);
      return;
    }

    try {
      setLoading(true);
      setShowDesignationError(false);

      const PROMPT = prompt.replace("{jobTitle}", designation);
      console.log("Prompt:", PROMPT);

      const result = await AIChatSession.sendMessage(PROMPT);
      const summaryText = result.response.text();

      console.log("AI Summary Response:", summaryText);

      // Parse the text response
      const parsedSummaries = parseTextResponse(summaryText);
      setAIGeneratedSummaryList(parsedSummaries);
    } catch (error) {
      console.error("Error generating AI summary:", error);
      // Fallback summaries based on designation if AI fails
      const fallbackSummaries = generateFallbackSummaries(designation);
      setAIGeneratedSummaryList(fallbackSummaries);
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
          const summary = lines
            .filter((line) => !line.toLowerCase().includes("level:"))
            .join(" ")
            .trim();

          return {
            level: level,
            summary: summary,
          };
        })
        .filter((item) => item.summary.length > 0);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return [];
    }
  };

  const generateFallbackSummaries = (designation) => {
    const jobTitle = designation.toLowerCase();

    if (
      jobTitle.includes("software") ||
      jobTitle.includes("developer") ||
      jobTitle.includes("engineer")
    ) {
      return [
        {
          level: "fresher",
          summary: `Recent graduate with strong foundation in software development and passion for ${designation}. Eager to contribute to innovative projects and grow professionally in a dynamic tech environment while learning cutting-edge technologies.`,
        },
        {
          level: "mid-level",
          summary: `Experienced ${designation} with 3-5 years of expertise in developing scalable solutions. Proven track record of delivering high-quality projects and collaborating effectively with cross-functional teams to achieve business objectives.`,
        },
        {
          level: "experienced",
          summary: `Senior ${designation} with 7+ years of experience leading complex projects and mentoring junior developers. Expert in modern technologies with a focus on architecture, performance optimization, and driving technical excellence.`,
        },
      ];
    } else if (
      jobTitle.includes("data") ||
      jobTitle.includes("analyst") ||
      jobTitle.includes("scientist")
    ) {
      return [
        {
          level: "fresher",
          summary: `Recent graduate with strong analytical skills and passion for data-driven insights as a ${designation}. Eager to apply statistical knowledge and modern tools to solve complex business problems and drive informed decision-making.`,
        },
        {
          level: "mid-level",
          summary: `Experienced ${designation} with 3-5 years of expertise in data analysis and visualization. Proven ability to extract meaningful insights from complex datasets and translate findings into actionable business recommendations.`,
        },
        {
          level: "experienced",
          summary: `Senior ${designation} with 7+ years of experience leading data initiatives and building analytical frameworks. Expert in advanced analytics, machine learning, and driving data-driven strategies across organizations.`,
        },
      ];
    } else {
      return [
        {
          level: "fresher",
          summary: `Recent graduate with strong foundational skills and passion for ${designation}. Eager to contribute to organizational success while developing expertise and growing professionally in a collaborative environment.`,
        },
        {
          level: "mid-level",
          summary: `Experienced ${designation} with 3-5 years of expertise in the field. Proven track record of delivering results and collaborating effectively with teams to achieve organizational objectives and drive success.`,
        },
        {
          level: "experienced",
          summary: `Senior ${designation} with 7+ years of experience leading initiatives and mentoring team members. Expert in industry best practices with a focus on strategic planning and driving operational excellence.`,
        },
      ];
    }
  };

  const copyToClipboard = async (summary, index) => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="mt-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          AI Summary Suggestions
        </h3>
        <button
          onClick={(e) => {
            e.preventDefault();
            GenerateSummaryFromAI();
          }}
          disabled={loading}
          className="border-violet-500 text-violet-600 bg-transparent border flex gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-violet-50 disabled:opacity-50 transition-colors"
        >
          <BrainIcon className="h-4 w-4 flex-shrink-0" />
          {loading ? "Generating..." : "Generate Suggestions"}
        </button>
      </div>

      {/* Designation Required Error */}
      {showDesignationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">
            <strong>Please fill in your designation/job title first</strong> to
            generate relevant AI summary suggestions.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          <span className="ml-2 text-gray-600">
            Generating AI suggestions for "{profileData?.designation}"...
          </span>
        </div>
      )}

      {/* AI Suggestions Cards */}
      {aiGeneratedSummaryList.length > 0 && !loading && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose a summary for <strong>"{profileData?.designation}"</strong>{" "}
            that matches your experience level:
          </p>

          {aiGeneratedSummaryList.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-violet-50 to-white border border-violet-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="inline-block bg-violet-100 text-violet-800 text-xs font-semibold px-2 py-1 rounded-full uppercase">
                  {item.level}
                </span>
                <button
                  onClick={() => copyToClipboard(item.summary, index)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-violet-600 transition-colors"
                >
                  {copiedIndex === index ? (
                    <>
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <p
                className="text-gray-700 text-sm leading-relaxed text-left"
                dir="ltr"
              >
                {item.summary}
              </p>
            </div>
          ))}

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Copy any suggestion and paste it in the
              summary field below to use and modify as needed.
            </p>
          </div>
        </div>
      )}

      {/* No suggestions state */}
      {aiGeneratedSummaryList.length === 0 &&
        !loading &&
        !showDesignationError && (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
            <BrainIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              {profileData?.designation
                ? `Click "Generate Suggestions" to get AI-powered summary ideas for ${profileData.designation}`
                : 'Fill in your designation above, then click "Generate Suggestions" to get AI-powered summary ideas'}
            </p>
          </div>
        )}
    </div>
  );
};

export default Summary;
