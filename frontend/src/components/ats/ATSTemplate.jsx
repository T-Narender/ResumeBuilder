import React, { useState } from "react";
import {
  HeaderBlock,
  SummaryBlock,
  SkillsBlock,
  ExperienceBlock,
  ProjectsBlock,
  EducationBlock,
  CertificationsBlock,
  AchievementsBlock,
} from "./index";
import { normalizeResumeData } from "../../utils/normalizeResumeData";
import { getTheme } from "../../themes";

const ATSTemplate = ({ resumeData, compact = false, themeName }) => {
  const [isFresher, setIsFresher] = useState(false);

  // Safely normalize data
  const normalizedData = normalizeResumeData(resumeData);
  const theme = getTheme(themeName || normalizedData?.template?.theme || "modern");

  return (
    <div
      id="ats-resume-container"
      className={`${compact ? "ats-compact " : ""}${
        theme.layout === "reference" ? "ats-reference" : ""
      }`}
      style={{
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: "16px 35px",
        color: "#1a1a1a",
        fontSize: "12px",
        lineHeight: "1.5",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        #ats-resume-container {
          line-height: 1.35;
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
          margin: 0 0 6px 0;
        }

        #ats-resume-container section,
        #ats-resume-container header {
          line-height: 1.35;
        }

        #ats-resume-container section {
          margin-top: 10px !important;
        }

        #ats-resume-container li,
        #ats-resume-container p,
        #ats-resume-container div {
          line-height: 1.35;
        }

        #ats-resume-container section > div > div > div:first-child,
        #ats-resume-container section > div > div > div > span:first-child {
          font-size: ${theme.textSize || "13px"} !important;
          font-weight: 600 !important;
          line-height: 1.35 !important;
        }

        #ats-resume-container section > div > div > div:nth-child(2),
        #ats-resume-container section > div > div > span:last-child,
        #ats-resume-container section > div > div > div:last-child,
        #ats-resume-container section li,
        #ats-resume-container section p {
          font-size: ${theme.textSize || "12px"} !important;
          line-height: 1.35 !important;
        }

        #ats-resume-container.ats-compact {
          padding: 12px 28px !important;
          font-size: 11px !important;
          line-height: 1.25 !important;
        }

        #ats-resume-container.ats-compact header h1 {
          font-size: 28px !important;
          line-height: 1 !important;
        }

        #ats-resume-container.ats-compact header > div,
        #ats-resume-container.ats-compact header a,
        #ats-resume-container.ats-compact header span,
        #ats-resume-container.ats-compact li,
        #ats-resume-container.ats-compact p,
        #ats-resume-container.ats-compact section > div > div > div:nth-child(2),
        #ats-resume-container.ats-compact section > div > div > span:last-child,
        #ats-resume-container.ats-compact section > div > div > div:last-child,
        #ats-resume-container.ats-compact section li,
        #ats-resume-container.ats-compact section p {
          line-height: 1.3 !important;
        }

        #ats-resume-container.ats-compact section {
          margin-top: 7px !important;
        }

        #ats-resume-container.ats-compact [data-pdf-exclude] {
          margin-bottom: 10px !important;
          padding: 6px !important;
        }

        #ats-resume-container.ats-reference {
          font-family: Georgia, "Times New Roman", serif !important;
          padding: 24px 42px 30px !important;
          color: #111111 !important;
          font-size: 12px !important;
          line-height: 1.35 !important;
        }

        #ats-resume-container.ats-reference header {
          margin-bottom: 16px !important;
          text-align: center !important;
        }

        #ats-resume-container.ats-reference header h1 {
          font-family: Georgia, "Times New Roman", serif !important;
          font-size: 31px !important;
          font-weight: 600 !important;
          letter-spacing: 0.02em !important;
          line-height: 1.15 !important;
          margin-bottom: 4px !important;
        }

        #ats-resume-container.ats-reference header > div,
        #ats-resume-container.ats-reference header a,
        #ats-resume-container.ats-reference header span {
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 11px !important;
          line-height: 1.35 !important;
        }

        #ats-resume-container.ats-reference section {
          margin-top: 14px !important;
        }

        #ats-resume-container.ats-reference h2 {
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          letter-spacing: 0.02em !important;
          line-height: 1.25 !important;
        }

        #ats-resume-container.ats-reference section > div,
        #ats-resume-container.ats-reference section p,
        #ats-resume-container.ats-reference section li,
        #ats-resume-container.ats-reference section span,
        #ats-resume-container.ats-reference section strong {
          font-size: 11px !important;
          line-height: 1.35 !important;
        }

        #ats-resume-container.ats-reference section > div > div {
          margin-bottom: 9px !important;
        }

        #ats-resume-container.ats-reference section > div > div > div:first-child span {
          font-size: 13px !important;
          font-weight: 700 !important;
        }

        #ats-resume-container.ats-reference section > div > div > p {
          font-size: 10.5px !important;
        }

        #ats-resume-container.ats-reference hr {
          border-top-color: #999 !important;
          margin-bottom: 7px !important;
        }

        #ats-resume-container.ats-reference.ats-compact {
          padding: 18px 36px 24px !important;
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
      <AchievementsBlock
        achievements={normalizedData?.achievements}
        theme={theme}
      />
    </div>
  );
};

export default ATSTemplate;
