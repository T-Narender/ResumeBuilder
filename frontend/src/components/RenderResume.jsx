import React from "react";
import TemplateOne from "./TemplateOne";
import TemplateTwo from "./TemplateTwo";
import TemplateThree from "./TemplateThree";
import TemplateFour from "./TemplateFour";
import TemplateFive from "./TemplateFive";
import ATSTemplate from "./ats/ATSTemplate"; // Import ATSTemplate

const RenderResume = ({ templateId, resumeData, containerWidth, singlePage }) => {
  // If the template ID is one of the new ATS themes, render ATSTemplate
  const atsThemes = ["minimal", "modern", "classic", "student"];
  if (atsThemes.includes(templateId?.toLowerCase())) {
    return <ATSTemplate resumeData={resumeData} />;
  }

  // Fallback to old templates
  switch (templateId) {
    case "01":
      return <TemplateOne resumeData={resumeData} containerWidth={containerWidth} />;
    case "02":
      return <TemplateTwo resumeData={resumeData} containerWidth={containerWidth} />;
    case "03":
      return <TemplateThree resumeData={resumeData} containerWidth={containerWidth} />;
    case "04":
      return <TemplateFour resumeData={resumeData} containerWidth={containerWidth} />;
    case "05":
      return <TemplateFive resumeData={resumeData} containerWidth={containerWidth} />;
    default:
      return <TemplateTwo resumeData={resumeData} containerWidth={containerWidth} />;
  }
};

export default RenderResume;
