"use client";

import { Input } from "./Inputs";
import { RatingInput } from "./ResumeSection";
import { Plus, Trash2 } from "lucide-react";
import {
  commonStyles,
  additionalInfoStyles,
  certificationInfoStyles,
  contactInfoStyles,
  educationDetailsStyles,
  profileInfoStyles,
  projectDetailStyles,
  skillsInfoStyles,
  workExperienceStyles,
} from "../assets/dummystyle";
import Summary from "./Summary";
import WorkExperienceAI from "./WorkExperienceAI";
import ProjectAI from "./ProjectAI"; // Add this import
import BulletInput from "./BulletInput";

// AdditionalInfoForm Component
export const AdditionalInfoForm = ({
  languages,
  interests,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className={additionalInfoStyles.container}>
      <h2 className={additionalInfoStyles.heading}>Additional Information</h2>

      {/* Languages Section */}
      <div className="mb-10">
        <h3 className={additionalInfoStyles.sectionHeading}>
          <div className={additionalInfoStyles.dotViolet}></div>
          Languages
        </h3>
        <div className="space-y-6">
          {languages?.map((lang, index) => (
            <div key={index} className={additionalInfoStyles.languageItem}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-left w-full">
                <Input
                  label="Language"
                  placeholder="e.g. English"
                  value={lang.name || ""}
                  onChange={({ target }) =>
                    updateArrayItem("languages", index, "name", target.value)
                  }
                />
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4 text-left w-full">
                    Proficiency
                  </label>
                  <RatingInput
                    value={lang.progress || 0}
                    total={5}
                    color="#8b5cf6"
                    bgColor="#e2e8f0"
                    onChange={(value) =>
                      updateArrayItem("languages", index, "progress", value)
                    }
                  />
                </div>
              </div>
              {languages.length > 1 && (
                <button
                  type="button"
                  className={commonStyles.trashButton}
                  onClick={() => removeArrayItem("languages", index)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className={`${commonStyles.addButtonBase} ${additionalInfoStyles.addButtonLanguage}`}
            onClick={() => addArrayItem("languages", { name: "", progress: 0 })}
          >
            <Plus size={16} /> Add Language
          </button>
        </div>
      </div>

      {/* Interests Section */}
      <div className="mb-6">
        <h3 className={additionalInfoStyles.sectionHeading}>
          <div className={additionalInfoStyles.dotOrange}></div>
          Interests
        </h3>
        <div className="space-y-4">
          {interests?.map((interest, index) => (
            <div key={index} className={additionalInfoStyles.interestItem}>
              <Input
                placeholder="e.g. Reading, Photography"
                value={interest || ""}
                onChange={({ target }) =>
                  updateArrayItem("interests", index, null, target.value)
                }
              />
              {interests.length > 1 && (
                <button
                  type="button"
                  className={commonStyles.trashButton}
                  onClick={() => removeArrayItem("interests", index)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className={`${commonStyles.addButtonBase} ${additionalInfoStyles.addButtonInterest}`}
            onClick={() => addArrayItem("interests", "")}
          >
            <Plus size={16} /> Add Interest
          </button>
        </div>
      </div>
    </div>
  );
};

// CertificationInfoForm Component
export const CertificationInfoForm = ({
  certifications,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className={certificationInfoStyles.container}>
      <h2 className={certificationInfoStyles.heading}>Certifications</h2>
      <div className="space-y-6 mb-6">
        {certifications.map((cert, index) => (
          <div key={index} className={certificationInfoStyles.item}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left w-full">
              <Input
                label="Certificate Title "
                placeholder="Full Stack Web Developer"
                value={cert.title || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "title", target.value)
                }
              />

              <Input
                label="Issuer"
                placeholder="Coursera / Google / etc."
                value={cert.issuer || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "issuer", target.value)
                }
              />

              <Input
                label="Year"
                placeholder="2024"
                value={cert.year || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "year", target.value)
                }
              />
            </div>

            {certifications.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className={`${commonStyles.addButtonBase} ${certificationInfoStyles.addButton}`}
          onClick={() =>
            addArrayItem({
              title: "",
              issuer: "",
              year: "",
            })
          }
        >
          <Plus size={16} />
          Add Certification
        </button>
      </div>
    </div>
  );
};

// ContactInfoForm Component
export const ContactInfoForm = ({ contactInfo, updateSection }) => {
  return (
    <div className={contactInfoStyles.container}>
      <h2 className={contactInfoStyles.heading}>Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left w-full">
        <div className="md:col-span-2 ">
          <Input
            label="Address"
            placeholder="Short Address"
            value={contactInfo.location || ""}
            onChange={({ target }) => updateSection("location", target.value)}
          />
        </div>

        <Input
          label="Email"
          placeholder="john@example.com"
          type="email"
          value={contactInfo.email || ""}
          onChange={({ target }) => updateSection("email", target.value)}
        />

        <Input
          label="Phone Number"
          placeholder="1234567890"
          value={contactInfo.phone || ""}
          onChange={({ target }) => updateSection("phone", target.value)}
        />

        <Input
          label="LinkedIn"
          placeholder="https://linkedin.com/in/username"
          value={contactInfo.linkedin || ""}
          onChange={({ target }) => updateSection("linkedin", target.value)}
        />

        <Input
          label="GitHub"
          placeholder="https://github.com/username"
          value={contactInfo.github || ""}
          onChange={({ target }) => updateSection("github", target.value)}
        />

        <div className="md:col-span-2 text-left w-full">
          <Input
            label="Portfolio / Website"
            placeholder="https://yourwebsite.com"
            value={contactInfo.website || ""}
            onChange={({ target }) => updateSection("website", target.value)}
          />
        </div>
      </div>
    </div>
  );
};

// EducationDetailsForm Component
export const EducationDetailsForm = ({
  educationInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className={educationDetailsStyles.container}>
      <h2 className={educationDetailsStyles.heading}>Education</h2>
      <div className="space-y-6 mb-6">
        {educationInfo.map((education, index) => (
          <div key={index} className={educationDetailsStyles.item}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left w-full">
              <Input
                label="Degree"
                placeholder="BTech in Computer Science"
                value={education.degree || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "degree", target.value)
                }
              />

              <Input
                label="Institution"
                placeholder="XYZ University"
                value={education.institution || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "institution", target.value)
                }
              />

              <Input
                label="Start Date"
                type="month"
                value={education.startDate || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "startDate", target.value)
                }
              />

              <Input
                label="End Date"
                type="month"
                value={education.endDate || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "endDate", target.value)
                }
              />
            </div>
            {educationInfo.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className={`${commonStyles.addButtonBase} ${educationDetailsStyles.addButton}`}
          onClick={() =>
            addArrayItem({
              degree: "",
              institution: "",
              startDate: "",
              endDate: "",
            })
          }
        >
          <Plus size={16} /> Add Education
        </button>
      </div>
    </div>
  );
};

// ProfileInfoForm Component
export const ProfileInfoForm = ({ profileData, updateSection }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold text-violet-700 mb-6 text-left">
        Personal Information
      </h2>

      {/* Pass profileData to Summary component */}
      <Summary profileData={profileData} />

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 text-left w-full">
              Full Name
            </label>
            <Input
              placeholder="John Doe"
              value={profileData.fullName || ""}
              onChange={({ target }) => updateSection("fullName", target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 text-left w-full">
              Designation
            </label>
            <Input
              placeholder="Full Stack Developer"
              value={profileData.designation || ""}
              onChange={({ target }) =>
                updateSection("designation", target.value)
              }
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-slate-700 text-left">
                Summary
              </label>
              {profileData.summary && (
                <span
                  className={`text-xs font-medium ${
                    profileData.summary
                      .trim()
                      .split(/\s+/)
                      .filter((w) => w.length > 0).length > 60
                      ? "text-red-500 font-bold"
                      : "text-slate-500"
                  }`}
                >
                  {
                    profileData.summary
                      .trim()
                      .split(/\s+/)
                      .filter((w) => w.length > 0).length
                  }{" "}
                  / 60 words
                </span>
              )}
            </div>
            <textarea
              className={`w-full rounded-xl border px-4 py-3 text-gray-800 font-medium bg-gray-50 focus:outline-none focus:ring-2 transition text-left ${
                profileData.summary &&
                profileData.summary
                  .trim()
                  .split(/\s+/)
                  .filter((w) => w.length > 0).length > 60
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-200 focus:ring-violet-300"
              }`}
              dir="ltr"
              rows={4}
              placeholder="Short introduction about yourself"
              value={profileData.summary || ""}
              onChange={({ target }) => updateSection("summary", target.value)}
            />
            {profileData.summary &&
              profileData.summary
                .trim()
                .split(/\s+/)
                .filter((w) => w.length > 0).length > 60 && (
                <p className="text-red-500 text-xs mt-1 text-left">
                  ⚠️ Recruiters read summaries in under 10 seconds. Keep it
                  under 60 words.
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ProjectDetailForm Component - Updated
export const ProjectDetailForm = ({
  projectInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className={projectDetailStyles.container}>
      <h2 className={projectDetailStyles.heading}>Projects</h2>
      <div className="space-y-6 mb-6">
        {projectInfo.map((project, index) => (
          <div key={index} className={projectDetailStyles.item}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left w-full">
              <div className="md:col-span-2">
                <Input
                  label="Project Name"
                  placeholder="AIResume Builder"
                  value={project.name || ""}
                  onChange={({ target }) =>
                    updateArrayItem(index, "name", target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-3 text-left w-full">
                  Tech Stack
                </label>
                <textarea
                  className={projectDetailStyles.textarea}
                  rows={2}
                  placeholder="React, Node.js, OpenAI API, MongoDB, Tailwind CSS"
                  value={(project.techStack || []).join(", ")}
                  onChange={({ target }) =>
                    updateArrayItem(
                      index,
                      "techStack",
                      target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </div>

              <Input
                label="GitHub Link"
                placeholder="https://github.com/username/project"
                value={project.github || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "github", target.value)
                }
              />

              <Input
                label="Live Demo URL"
                placeholder="https://yourproject.live"
                value={project.liveDemo || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "liveDemo", target.value)
                }
              />
            </div>

            {/* Add AI Description Generator */}
            <ProjectAI
              project={project}
              projectIndex={index}
              onProjectDataSelect={(projectData) => {
                updateArrayItem(index, "name", projectData.name || "");
                updateArrayItem(
                  index,
                  "techStack",
                  projectData.techStack || [],
                );
                updateArrayItem(index, "bullets", projectData.bullets || []);
                updateArrayItem(index, "github", projectData.github || "");
                updateArrayItem(index, "liveDemo", projectData.liveDemo || "");
              }}
            />

            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-700 mb-3 text-left w-full">
                Bullets
              </label>

              <div className="space-y-2">
                {(project.bullets && project.bullets.length > 0 ? project.bullets : [""])
                  .map((bullet, bulletIndex) => (
                    <BulletInput
                      key={bulletIndex}
                      value={bullet}
                      jobTitle={project.name || "Software Developer"}
                      onChange={(newValue) => {
                        const newBullets = [...(project.bullets || [])];
                        while (newBullets.length <= bulletIndex) {
                          newBullets.push("");
                        }
                        newBullets[bulletIndex] = newValue;
                        updateArrayItem(index, "bullets", newBullets);
                      }}
                      onRemove={
                        (project.bullets || []).length > 1
                          ? () => {
                              const newBullets = [...(project.bullets || [])];
                              newBullets.splice(bulletIndex, 1);
                              updateArrayItem(index, "bullets", newBullets);
                            }
                          : null
                      }
                    />
                  ))}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const newBullets = [...(project.bullets || [])];
                    newBullets.push("");
                    updateArrayItem(index, "bullets", newBullets);
                  }}
                  className="mt-2 flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800 font-medium px-3 py-1.5 bg-violet-50 hover:bg-violet-100 rounded-md transition-colors"
                >
                  <Plus size={14} /> Add Bullet Point
                </button>
              </div>
            </div>


            {projectInfo.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className={`${commonStyles.addButtonBase} ${projectDetailStyles.addButton}`}
          onClick={() =>
            addArrayItem({
              name: "",
              techStack: [],
              bullets: [],
              github: "",
              liveDemo: "",
            })
          }
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>
    </div>
  );
};

// SkillsInfoForm Component
export const SkillsInfoForm = ({
  skillsInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  const skillCategories = [
    "Programming Languages",
    "Frontend Technologies",
    "Backend Technologies",
    "Other Tools",
  ];

  return (
    <div className={skillsInfoStyles.container}>
      <h2 className={skillsInfoStyles.heading}>Skills</h2>
      <div className="space-y-6 mb-6">
        {skillsInfo.map((skill, index) => (
          <div key={index} className={skillsInfoStyles.item}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
              <Input
                label="Skill Name"
                placeholder="JavaScript"
                value={skill.name || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "name", target.value)
                }
              />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 text-left w-full">
                  Category
                </label>
                <select
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  value={skill.category || "Programming Languages"}
                  onChange={({ target }) =>
                    updateArrayItem(index, "category", target.value)
                  }
                >
                  {skillCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 text-left w-full">
                  Proficiency (
                  {skill.progress ? Math.round(skill.progress / 20) : 0}/5)
                </label>
                <div className="mt-2">
                  <RatingInput
                    value={skill.progress || 0}
                    total={5}
                    color="#f59e0b"
                    bgColor="#e2e8f0"
                    onChange={(newValue) =>
                      updateArrayItem(index, "progress", newValue)
                    }
                  />
                </div>
              </div>
            </div>

            {skillsInfo.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className={`${commonStyles.addButtonBase} ${skillsInfoStyles.addButton}`}
          onClick={() =>
            addArrayItem({
              name: "",
              category: "Programming Languages",
              progress: 0,
            })
          }
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>
    </div>
  );
};

// WorkExperienceForm Component - Updated
export const WorkExperienceForm = ({
  workExperience,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}) => {
  return (
    <div className={workExperienceStyles.container}>
      <h2 className={workExperienceStyles.heading}>Work Experience</h2>
      <div className="space-y-6 mb-6">
        {workExperience.map((experience, index) => (
          <div key={index} className={workExperienceStyles.item}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left w-full">
              <Input
                label="Company"
                placeholder="ABC Corp"
                value={experience.company || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "company", target.value)
                }
              />

              <Input
                label="Role"
                placeholder="Frontend Developer"
                value={experience.role || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "role", target.value)
                }
              />

              <Input
                label="Start Date"
                type="month"
                value={experience.startDate || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "startDate", target.value)
                }
              />

              <Input
                label="End Date"
                type="month"
                value={experience.endDate || ""}
                onChange={({ target }) =>
                  updateArrayItem(index, "endDate", target.value)
                }
              />
            </div>

            {/* Add AI Description Generator */}
            <WorkExperienceAI
              workExperience={experience}
              experienceIndex={index}
              onDescriptionSelect={(description) =>
                updateArrayItem(index, "description", description)
              }
            />

            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-700 mb-3 text-left w-full">
                Description (Bullet Points)
              </label>

              {experience.description &&
                !experience.description.includes("\n") &&
                experience.description.length > 80 && (
                  <div className="mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-start gap-2">
                    <span className="text-xl">💡</span>
                    <div>
                      <p className="text-sm text-indigo-800 font-medium">
                        Convert to ATS bullet points?
                      </p>
                      <p className="text-xs text-indigo-600 mb-2">
                        ATS systems and recruiters prefer bulleted lists over
                        long paragraphs.
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          // Simple naive split by sentences. In real app, we might use AI.
                          const newDesc = experience.description
                            .split(/(?<=[.?!])\s+/)
                            .map((sentence) => sentence.trim())
                            .filter((s) => s.length > 0)
                            .map((s) => s.replace(/^[•\-\*]\s*/, ""))
                            .join("\n");
                          updateArrayItem(index, "description", newDesc);
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 transition-colors"
                      >
                        Convert to Bullets
                      </button>
                    </div>
                  </div>
                )}

              <div className="space-y-2">
                {(experience.description || "")
                  .split("\n")
                  .map((bullet, bulletIndex) => (
                    <BulletInput
                      key={bulletIndex}
                      value={bullet}
                      jobTitle={experience.role}
                      onChange={(newValue) => {
                        const bullets = (experience.description || "").split(
                          "\n",
                        );
                        bullets[bulletIndex] = newValue;
                        updateArrayItem(
                          index,
                          "description",
                          bullets.join("\n"),
                        );
                      }}
                      onRemove={
                        (experience.description || "").split("\n").length > 1
                          ? () => {
                              const bullets = (
                                experience.description || ""
                              ).split("\n");
                              bullets.splice(bulletIndex, 1);
                              updateArrayItem(
                                index,
                                "description",
                                bullets.join("\n"),
                              );
                            }
                          : null
                      }
                    />
                  ))}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const currentDesc = experience.description || "";
                    const newDesc = currentDesc ? currentDesc + "\n" : "";
                    updateArrayItem(index, "description", newDesc);
                  }}
                  className="mt-2 flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800 font-medium px-3 py-1.5 bg-violet-50 hover:bg-violet-100 rounded-md transition-colors"
                >
                  <Plus size={14} /> Add Bullet Point
                </button>
              </div>
            </div>

            {workExperience.length > 1 && (
              <button
                type="button"
                className={commonStyles.trashButton}
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className={`${commonStyles.addButtonBase} ${workExperienceStyles.addButton}`}
          onClick={() =>
            addArrayItem({
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              description: "",
            })
          }
        >
          <Plus size={16} />
          Add Work Experience
        </button>
      </div>
    </div>
  );
};
