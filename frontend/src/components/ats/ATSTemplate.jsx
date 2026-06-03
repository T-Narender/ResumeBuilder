import React, { useState } from "react";
import {
  HeaderBlock,
  SummaryBlock,
  SkillsBlock,
  ExperienceBlock,
  ProjectsBlock,
  EducationBlock,
  CertificationsBlock,
} from "./index";
import { normalizeResumeData } from "../../utils/normalizeResumeData";
import { getTheme } from "../../themes";

const ATSTemplate = ({ resumeData }) => {
  const [isFresher, setIsFresher] = useState(false);

  // Safely normalize data
  const normalizedData = normalizeResumeData(resumeData);
  const theme = getTheme(normalizedData?.template?.theme || "modern");

  return (
    <div
      id="ats-resume-container"
      style={{
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: "20px 35px",
        color: "#1a1a1a",
        fontSize: "12px",
        lineHeight: "1.5",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        #ats-resume-container {
          line-height: 1.5;
          color: ${theme.textColor || "#1a1a1a"} !important;
        }

        #ats-resume-container header {
          text-align: ${theme.alignment || "left"} !important;
        }

        #ats-resume-container header > div {
          justify-content: ${theme.alignment === "center" ? "center" : "flex-start"} !important;
        }

        #ats-resume-container header h1 {
          font-size: ${theme.nameSize || "32px"} !important;
          font-weight: 800 !important;
          line-height: 1.1 !important;
          color: ${theme.primaryColor || "#1a1a1a"} !important;
        }

        #ats-resume-container header > div,
        #ats-resume-container header a,
        #ats-resume-container header span {
          font-size: ${theme.contactSize || "12px"} !important;
          line-height: 1.5 !important;
          color: ${theme.textColor || "#1a1a1a"} !important;
        }

        #ats-resume-container h3 {
          font-size: ${theme.headingSize || "14px"} !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          line-height: 1.5 !important;
          color: ${theme.primaryColor || "#1a1a1a"} !important;
        }

        #ats-resume-container hr {
          border: none !important;
          border-top: ${theme.borderStyle || "1px solid #e0e0e0"} !important;
          margin: 0 0 12px 0;
        }

        #ats-resume-container section,
        #ats-resume-container header {
          line-height: 1.5;
        }

        #ats-resume-container section {
          margin-top: ${theme.spacing || "14px"};
        }

        #ats-resume-container li,
        #ats-resume-container p,
        #ats-resume-container div {
          line-height: 1.5;
        }

        #ats-resume-container section > div > div > div:first-child,
        #ats-resume-container section > div > div > div > span:first-child {
          font-size: ${theme.textSize || "13px"} !important;
          font-weight: 600 !important;
          line-height: 1.5 !important;
        }

        #ats-resume-container section > div > div > div:nth-child(2),
        #ats-resume-container section > div > div > span:last-child,
        #ats-resume-container section > div > div > div:last-child,
        #ats-resume-container section li,
        #ats-resume-container section p {
          font-size: ${theme.textSize || "12px"} !important;
          line-height: 1.5 !important;
        }
      `}</style>
      <div
        data-pdf-exclude="true"
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
          fontSize: "12px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <span style={{ fontWeight: 700 }}>ATS Ordering Mode:</span>
        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="radio"
            checked={isFresher}
            onChange={() => setIsFresher(true)}
          />
          <span>Fresher</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="radio"
            checked={!isFresher}
            onChange={() => setIsFresher(false)}
          />
          <span>Experienced</span>
        </label>
      </div>

      <HeaderBlock
        fullName={normalizedData?.profileInfo?.fullName}
        designation={normalizedData?.profileInfo?.designation}
        contactInfo={normalizedData?.contactInfo}
        theme={theme}
      />

      <SummaryBlock
        summary={normalizedData?.profileInfo?.summary}
        theme={theme}
      />

      <SkillsBlock skills={normalizedData?.skills} theme={theme} />
      <ExperienceBlock
        experience={normalizedData?.workExperience}
        theme={theme}
      />
      <ProjectsBlock projects={normalizedData?.projects} theme={theme} />
      <EducationBlock education={normalizedData?.education} theme={theme} />

      <CertificationsBlock
        certifications={normalizedData?.certifications}
        theme={theme}
      />
    </div>
  );
};

export default ATSTemplate;
