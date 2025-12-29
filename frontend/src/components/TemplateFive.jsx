"use client";
import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../utils/helper";

const sectionTitleClass =
  "text-sm font-bold uppercase tracking-wide border-b border-black mt-2 mb-3 pt-1 pb-2 text-left";

const TemplateFive = ({ resumeData = {}, containerWidth }) => {
  const {
    profileInfo = {},
    contactInfo = {},
    education = [],
    workExperience = [],
    projects = [],
    skills = [],
    certifications = [],
    languages = [],
    interests = [],
  } = resumeData;

  const skillGroups = {
    "Programming Languages": [],
    "Frontend Technologies": [],
    "Backend Technologies": [],
    "Other Tools": [],
  };

  skills.forEach((skill) => {
    const category = skill?.category || "Other Tools";
    if (skillGroups[category]) {
      skillGroups[category].push(skill.name);
    } else {
      skillGroups["Other Tools"].push(skill.name);
    }
  });

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
      className="p-6 bg-white text-black font-serif max-w-4xl mx-auto text-left"
      dir="ltr"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : undefined,
        height: "1123px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h1
          className="text-xl font-bold tracking-wide uppercase text-left"
          dir="ltr"
        >
          {profileInfo.fullName || "Your Full Name"}
        </h1>
        <p className="text-sm italic text-left" dir="ltr">
          {profileInfo.designation || "Your Title"}
        </p>
        <div
          className="text-sm flex justify-center gap-4 flex-wrap text-left"
          dir="ltr"
        >
          {contactInfo.phone && <span>📞 {contactInfo.phone}</span>}
          {contactInfo.email && (
            <a href={`mailto:${contactInfo.email}`} className="hover:underline">
              ✉ {contactInfo.email}
            </a>
          )}
          {contactInfo.linkedin && (
            <a href={contactInfo.linkedin} className="hover:underline">
              🔗 LinkedIn
            </a>
          )}
          {contactInfo.github && (
            <a href={contactInfo.github} className="hover:underline">
              💻 GitHub
            </a>
          )}
          {contactInfo.website && (
            <a href={contactInfo.website} className="hover:underline">
              🌐 Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {profileInfo.summary && (
        <section className="mb-4">
          <h2 className={sectionTitleClass}>Summary</h2>
          <p
            className="text-sm text-gray-800 leading-relaxed text-left"
            dir="ltr"
          >
            {profileInfo.summary}
          </p>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className={sectionTitleClass}>Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-left" dir="ltr">
                  {edu.institution}
                </span>
                <span className="italic text-right">
                  {formatYearMonth(edu.startDate)} –{" "}
                  {formatYearMonth(edu.endDate)}
                </span>
              </div>
              <p className="italic text-sm text-left" dir="ltr">
                {edu.degree}
              </p>
              {edu.location && (
                <p className="text-sm text-left" dir="ltr">
                  {edu.location}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {filteredWorkExperience.length > 0 && (
        <section className="mb-4">
          <h2 className={sectionTitleClass}>Work Experience</h2>
          {filteredWorkExperience.map((exp, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-left" dir="ltr">
                  {exp.company}
                </span>
                <span className="italic text-right">
                  {formatYearMonth(exp.startDate)} –{" "}
                  {formatYearMonth(exp.endDate)}
                </span>
              </div>
              <p className="italic text-sm text-left" dir="ltr">
                {exp.role}
              </p>
              {exp.location && (
                <p className="text-sm text-gray-600 text-left" dir="ltr">
                  {exp.location}
                </p>
              )}
              <div className="mt-1 text-left" dir="ltr">
                <p className="text-sm text-gray-700">{exp.description}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className={sectionTitleClass}>Projects</h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-semibold text-sm text-left" dir="ltr">
                {proj.title}
              </h3>
              <div
                className="text-sm text-gray-700 mt-1 text-left space-y-0.5"
                dir="ltr"
              >
                {proj.description?.split("\n").map((line, i) => (
                  <p key={i}>{line.trim() && `• ${line.trim()}`}</p>
                ))}
              </div>
              <div className="flex gap-2 mt-1 text-sm">
                {proj.github && (
                  <a
                    href={proj.github}
                    className="text-blue-600 hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {proj.liveDemo && (
                  <a
                    href={proj.liveDemo}
                    className="text-blue-600 hover:underline"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Technical Skills */}
      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className={sectionTitleClass}>Technical Skills</h2>
          <div className="space-y-2">
            {Object.entries(skillGroups).map(
              ([category, items]) =>
                items.length > 0 && (
                  <div key={category}>
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {items.map((name, idx) => (
                        <span
                          key={`${category}-${idx}`}
                          className="bg-gray-100 px-2 py-1 rounded text-left"
                          dir="ltr"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-4">
          <h2 className={sectionTitleClass}>Certifications</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {certifications.map((cert, idx) => (
              <li key={idx} className="text-left" dir="ltr">
                {cert.title} — {cert.issuer} ({cert.year})
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages & Interests */}
      {(languages.length > 0 || interests.length > 0) && (
        <section className="mb-0">
          <div className="space-y-3">
            {languages.length > 0 && (
              <div>
                <h2 className={sectionTitleClass}>Languages</h2>
                <div className="flex flex-wrap gap-1 text-sm">
                  {languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 px-2 py-1 rounded text-left"
                      dir="ltr"
                    >
                      {lang.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {interests.length > 0 && interests.some(Boolean) && (
              <div>
                <h2 className={sectionTitleClass}>Interests</h2>
                <div className="flex flex-wrap gap-1 text-sm">
                  {interests.filter(Boolean).map((int, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 px-2 py-1 rounded text-left"
                      dir="ltr"
                    >
                      {int}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default TemplateFive;
