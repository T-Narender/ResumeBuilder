"use client";
import React, { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../utils/helper";

const TemplateSix = ({ resumeData = {}, containerWidth }) => {
  const {
    profileInfo = {},
    contactInfo = {},
    workExperience = [],
    education = [],
    projects = [],
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
  const [baseWidth, setBaseWidth] = useState(850);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current && containerWidth > 0) {
      setBaseWidth(resumeRef.current.offsetWidth);
      setScale(containerWidth / resumeRef.current.offsetWidth);
    }
  }, [containerWidth]);

  return (
    <div
      ref={resumeRef}
      className="bg-white text-gray-900 font-light p-6 max-w-4xl mx-auto"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
        width: `${baseWidth}px`,
        height: "1123px",
      }}
    >
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{profileInfo.fullName}</h1>
        <p className="text-sm">{profileInfo.designation}</p>
        <p className="text-xs text-gray-600">
          {contactInfo.email} | {contactInfo.phone}
        </p>
      </header>

      {/* Timeline Experience */}
      {filteredWorkExperience.length > 0 && (
        <section>
          <h2 className="font-semibold uppercase text-sm border-b pb-1 mb-3">
            Experience
          </h2>
          <div className="relative border-l-2 border-gray-300 pl-4 space-y-4">
            {filteredWorkExperience.map((exp, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-3 top-1 w-3 h-3 bg-violet-600 rounded-full"></div>
                <h3 className="text-sm font-bold">
                  {exp.role} — {exp.company}
                </h3>
                <p className="text-xs text-gray-500">
                  {formatYearMonth(exp.startDate)} -{" "}
                  {formatYearMonth(exp.endDate)}
                </p>
                <p className="text-xs">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold uppercase text-sm border-b pb-1 mb-3">
            Projects
          </h2>
          {projects.map((proj, i) => (
            <div key={i} className="mb-2">
              <h3 className="text-sm font-bold">{proj.title}</h3>
              <p className="text-xs">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mt-6">
          <h2 className="font-semibold uppercase text-sm border-b pb-1 mb-3">
            Education
          </h2>
          {education.map((edu, i) => (
            <div key={i} className="mb-2">
              <h3 className="text-sm font-bold">{edu.degree}</h3>
              <p className="text-xs italic">{edu.institution}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
export default TemplateSix;
