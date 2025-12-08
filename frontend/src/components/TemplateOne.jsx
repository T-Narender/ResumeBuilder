import React, { useEffect, useRef, useState } from "react";
import { LuMail, LuPhone, LuGithub, LuGlobe } from "react-icons/lu";
import { RiLinkedinLine } from "react-icons/ri";
import {
  EducationInfo,
  WorkExperience,
  ProjectInfo,
  CertificationInfo,
} from "./ResumeSection";
import { formatYearMonth } from "../utils/helper";

const DEFAULT_THEME = ["#ffffff", "#0d47a1", "#1e88e5", "#64b5f6", "#bbdefb"];

const Title = ({ text, color }) => (
  <div className="relative w-fit mb-2 resume-section-title">
    <h2
      className="relative text-base font-bold uppercase tracking-wide pb-2"
      style={{ color }}
    >
      {text}
    </h2>
    <div className="w-full h-[2px] mt-1" style={{ backgroundColor: color }} />
  </div>
);

const TemplateOne = ({ resumeData = {}, colorPalette, containerWidth }) => {
  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    languages = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    interests = [],
  } = resumeData;

  // Filter out empty work experience entries
  const filteredWorkExperience = Array.isArray(workExperience)
    ? workExperience.filter(
        (exp) =>
          exp &&
          (exp.company?.trim() || exp.role?.trim() || exp.description?.trim())
      )
    : [];

  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      const actualWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualWidth);
      setScale(containerWidth / actualWidth);
    }
  }, [containerWidth]);

  return (
    <div
      className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden text-left"
      dir="ltr"
      style={{ width: containerWidth || "800px" }}
    >
      <div
        ref={resumeRef}
        className="p-6 bg-white font-sans text-gray-800"
        style={{
          transform: containerWidth > 0 ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
          width: containerWidth > 0 ? `${baseWidth}px` : undefined,
        }}
      >
        {/* Header */}
        <div className="resume-section mb-6">
          <div className="mb-2">
            <h1 className="text-4xl font-bold text-left" dir="ltr">
              {profileInfo?.fullName || "Your Name"}
            </h1>

            <h2 className="text-xl text-gray-600 text-left" dir="ltr">
              {profileInfo?.designation || "Your Title"}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 text-sm mb-3">
            {contactInfo.email && (
              <span>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:underline text-blue-600"
                >
                  {contactInfo.email}
                </a>
              </span>
            )}
            {contactInfo.phone && (
              <span>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hover:underline text-blue-600"
                >
                  📞 {contactInfo.phone}
                </a>
              </span>
            )}
            {contactInfo.location && <span>📍 {contactInfo.location}</span>}
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            {contactInfo.linkedin && (
              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-blue-600"
              >
                🔗 LinkedIn
              </a>
            )}
            {contactInfo.github && (
              <a
                href={contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-blue-600"
              >
                💻 GitHub
              </a>
            )}
            {contactInfo.website && (
              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-blue-600"
              >
                🌐 Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {profileInfo.summary && (
          <div className="resume-section mb-4">
            <Title text="Professional Summary" />
            <p
              className="text-sm text-gray-700 leading-relaxed text-left"
              dir="ltr"
            >
              {profileInfo.summary}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-2 space-y-4">
            {filteredWorkExperience.length > 0 && (
              <div className="resume-section">
                <Title text="Work Experience" />
                <div className="space-y-6">
                  {filteredWorkExperience.map((exp, i) => (
                    <WorkExperience
                      key={i}
                      company={exp.company}
                      role={exp.role}
                      duration={`${formatYearMonth(
                        exp.startDate
                      )} - ${formatYearMonth(exp.endDate)}`}
                      description={exp.description}
                      durationColor={[2]}
                    />
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div className="resume-section">
                <Title text="Projects" />
                <div className="space-y-4">
                  {projects.map((proj, i) => (
                    <ProjectInfo
                      key={i}
                      title={proj.title}
                      description={proj.description}
                      githubLink={proj.github}
                      liveDemoUrl={proj.liveDemo}
                      bgColor={[4]}
                      headingClass="pb-2" // Added pb-2 to subheadings
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-1 space-y-6">
            {skills.length > 0 && (
              <div className="resume-section">
                <Title text="Skills" />
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{ backgroundColor: [4] }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div className="resume-section">
                <Title text="Education" />
                <div className="space-y-4 pb-2">
                  {education.map((edu, i) => (
                    <EducationInfo
                      key={i}
                      degree={edu.degree}
                      institution={edu.institution}
                      duration={`${formatYearMonth(
                        edu.startDate
                      )} - ${formatYearMonth(edu.endDate)}`}
                    />
                  ))}
                  <br />
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div className="resume-section">
                <Title text="Certifications" />
                <div className="space-y-2">
                  {certifications.map((cert, i) => (
                    <CertificationInfo
                      key={i}
                      title={cert.title}
                      issuer={cert.issuer}
                      year={cert.year}
                      bgColor={[4]}
                    />
                  ))}
                </div>
              </div>
            )}

            {languages.length > 0 && (
              <div className="resume-section">
                <Title text="Languages" />
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{ backgroundColor: [4] }}
                    >
                      {lang.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {interests.length > 0 && interests.some((i) => i) && (
              <div className="resume-section">
                <Title text="Interests" />
                <div className="flex flex-wrap gap-2">
                  {interests.map((int, i) =>
                    int ? (
                      <span
                        key={i}
                        className="text-xs font-medium px-2 py-1 rounded"
                        style={{ backgroundColor: [4] }}
                      >
                        {int}
                      </span>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateOne;
