"use client";
import React, { useEffect, useRef, useState } from "react";
import { LuExternalLink, LuGithub } from "react-icons/lu";
import { formatYearMonth } from "../utils/helper";

const sectionTitleClass =
  "text-base font-bold uppercase tracking-wide mb-1 pb-1 border-b border-gray-300 text-left";

const TemplateTwo = ({ resumeData = {}, containerWidth }) => {
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
      ref={resumeRef}
      className="resume-section p-4 bg-white font-sans text-black max-w-4xl mx-auto text-left"
      dir="ltr"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : undefined,
        height: "1123px",
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <div className="text-center mb-2">
        <h1
          className="text-2xl font-bold tracking-tight mb-2 text-left"
          dir="ltr"
        >
          {profileInfo.fullName}
        </h1>
        <p
          className="text-sm text-gray-600 font-medium mb-2 text-left"
          dir="ltr"
        >
          {profileInfo.designation}
        </p>
        <div
          className="flex flex-wrap justify-center gap-1 text-[11px] text-gray-700 text-left"
          dir="ltr"
        >
          {contactInfo.phone && <span>{contactInfo.phone}</span>}
          {contactInfo.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="hover:underline text-blue-600"
            >
              {contactInfo.email}
            </a>
          )}
          {contactInfo.linkedin && (
            <a
              href={contactInfo.linkedin}
              className="hover:underline text-blue-600"
            >
              🔗 LinkedIn
            </a>
          )}
          {contactInfo.github && (
            <a
              href={contactInfo.github}
              className="hover:underline text-blue-600"
            >
              💻 GitHub
            </a>
          )}
          {contactInfo.website && (
            <a
              href={contactInfo.website}
              className="hover:underline text-blue-600"
            >
              🌐 Portfolio
            </a>
          )}
        </div>
      </div>

      <hr className="border-gray-300 mb-2" />

      {/* Summary */}
      {profileInfo.summary && (
        <section className="mb-2">
          <h2 className={sectionTitleClass}>Summary</h2>
          <p
            className="text-[11px] text-gray-800 leading-tight text-left"
            dir="ltr"
          >
            {profileInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {filteredWorkExperience.length > 0 && (
        <section className="mb-2">
          <h2 className={sectionTitleClass}>Experience</h2>
          <div className="space-y-2">
            {filteredWorkExperience.map((exp, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-start">
                  <div className="text-left" dir="ltr">
                    <h3
                      className="font-semibold text-[12px] pb-2 text-gray-800 text-left"
                      dir="ltr"
                    >
                      {exp.role}
                    </h3>
                    <p
                      className="italic text-[11px] pb-2 text-gray-600 text-left"
                      dir="ltr"
                    >
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-[11px] text-right text-gray-600">
                    <p className="italic">
                      {formatYearMonth(exp.startDate)} -{" "}
                      {formatYearMonth(exp.endDate)}
                    </p>
                    {exp.location && (
                      <p className="text-[11px]">{exp.location}</p>
                    )}
                  </div>
                </div>
                {exp.technologies && (
                  <p
                    className="bg-gray-100 text-[10px] font-mono px-1.5 py-0.5 rounded inline-block text-left"
                    dir="ltr"
                  >
                    {exp.technologies}
                  </p>
                )}
                <ul className="mt-0.5 text-[12px] text-gray-700">
                  {exp.description?.split("\n").map((line, i) => (
                    <li key={i} className="pb-1 text-left" dir="ltr">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-2">
          <h2 className={sectionTitleClass}>Projects</h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-start">
                  <h3
                    className="font-semibold text-[12px] text-gray-800 text-left"
                    dir="ltr"
                  >
                    {proj.title}
                  </h3>
                  {proj.link && (
                    <a
                      href={proj.link}
                      className="text-blue-600 text-[11px] hover:underline"
                    >
                      {proj.linkType || "Link"}
                    </a>
                  )}
                </div>
                {proj.technologies && (
                  <p
                    className="bg-gray-100 pb-2 text-[10px] font-mono px-1.5 py-0.5 rounded inline-block text-left"
                    dir="ltr"
                  >
                    {proj.technologies}
                  </p>
                )}
                <p
                  className="text-[11px] pb-2 text-gray-700 text-left"
                  dir="ltr"
                >
                  {proj.description}
                </p>
                <div className="flex gap-1 mt-0.5 pt-2 text-[11px]">
                  {proj.github && (
                    <a
                      href={proj.github}
                      className="flex items-center gap-0.5 hover:underline text-blue-600"
                    >
                      <LuGithub size={10} /> GitHub
                    </a>
                  )}
                  {proj.liveDemo && (
                    <a
                      href={proj.liveDemo}
                      className="flex items-center gap-0.5 hover:underline text-blue-600"
                    >
                      <LuExternalLink size={10} /> Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-2">
          <h2 className={sectionTitleClass}>Education</h2>
          <div className="space-y-1">
            {education.map((edu, idx) => (
              <div key={idx} className="space-y-0.25">
                <div className="flex justify-between items-center">
                  <h3
                    className="font-semibold text-[12px] pb-2 text-gray-800 text-left"
                    dir="ltr"
                  >
                    {edu.degree}
                  </h3>
                  <p className="italic text-[11px] pb-2 text-gray-600">
                    {formatYearMonth(edu.startDate)} -{" "}
                    {formatYearMonth(edu.endDate)}
                  </p>
                </div>
                <p
                  className="italic text-[11px] text-gray-700 text-left"
                  dir="ltr"
                >
                  {edu.institution}
                </p>
                {edu.courses && (
                  <p className="text-[11px] text-left" dir="ltr">
                    <strong>Courses:</strong> {edu.courses}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-2">
          <h2 className={sectionTitleClass}>Skills</h2>
          <ul className="text-[11px] text-gray-800 flex flex-wrap gap-1">
            {skills.map((skill, idx) => (
              <li key={idx} className="w-fit text-left" dir="ltr">
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-2">
          <h2 className={sectionTitleClass}>Certifications</h2>
          <ul className="list-disc list-inside text-[11px] text-gray-700">
            {certifications.map((cert, idx) => (
              <li key={idx} className="leading-tight text-left" dir="ltr">
                {cert.title} — {cert.issuer} ({cert.year})
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages & Interests */}
      {(languages.length > 0 || interests.length > 0) && (
        <section className="mb-0">
          <div className="space-y-2">
            {languages.length > 0 && (
              <div>
                <h2 className={sectionTitleClass}>Languages</h2>
                <ul className="flex flex-wrap gap-1 text-[11px] text-gray-700">
                  {languages.map((lang, idx) => (
                    <li
                      key={idx}
                      className="bg-gray-100 px-1.5 py-0.5 rounded-full text-left"
                      dir="ltr"
                    >
                      {lang.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {interests.length > 0 && interests.some(Boolean) && (
              <div>
                <h2 className={sectionTitleClass}>Interests</h2>
                <ul className="flex flex-wrap gap-1 text-[11px] text-gray-700">
                  {interests.filter(Boolean).map((int, idx) => (
                    <li
                      key={idx}
                      className="bg-gray-100 px-1.5 py-0.5 rounded-full text-left"
                      dir="ltr"
                    >
                      {int}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default TemplateTwo;
