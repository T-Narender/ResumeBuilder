import React from "react";
import TemplateOne from "./TemplateOne";
import TemplateTwo from "./TemplateTwo";
import TemplateThree from "./TemplateThree";
import TemplateFour from "./TemplateFour";
import TemplateFive from "./TemplateFive";

const RenderResume = ({ templateId, resumeData, containerWidth }) => {
  switch (templateId) {
    case "01":
      return (
        <TemplateOne resumeData={resumeData} containerWidth={containerWidth} />
      );
    case "02":
      return (
        <TemplateTwo resumeData={resumeData} containerWidth={containerWidth} />
      );
    case "03":
      return (
        <TemplateThree
          resumeData={resumeData}
          containerWidth={containerWidth}
        />
      );
    case "04":
      return (
        <TemplateFour resumeData={resumeData} containerWidth={containerWidth} />
      );
    case "05":
      return (
        <TemplateFive resumeData={resumeData} containerWidth={containerWidth} />
      );
    default:
      return (
        <TemplateTwo resumeData={resumeData} containerWidth={containerWidth} />
      );
  }
};

export default RenderResume;
