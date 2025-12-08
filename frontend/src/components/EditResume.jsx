import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  buttonStyles,
  containerStyles,
  iconStyles,
  statusStyles,
} from "../assets/dummystyle";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowLeft,
  Download,
  Loader,
  Loader2,
  Palette,
  Save,
  Trash2,
  Check,
} from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { TitleInput } from "./Inputs";
import { fixTailwindColors } from "../utils/color";
import StepProgress from "./StepProgress";
import { ProfileInfoForm } from "./Forms";
import { ContactInfoForm } from "./Forms";
import RenderResume from "./RenderResume";
import Modal from "./Modal";
import ThemeSelector from "./ThemeSelector";
import { WorkExperienceForm } from "./Forms";
import { EducationDetailsForm } from "./Forms";
import { SkillsInfoForm } from "./Forms";
import { ProjectDetailForm } from "./Forms";
import { CertificationInfoForm } from "./Forms";
import { AdditionalInfoForm } from "./Forms";
import html2canvas from "html2canvas";
import "./A4.css";

//Resize observer hook
const useResizeObserver = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useCallback((node) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        setSize({ width, height });
      });
      resizeObserver.observe(node);
    }
  }, []);
  return { ...size, ref };
};

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const thumbnailRef = useRef(null);
  const canvasRef = useRef(null); // visible modal preview used by html2canvas

  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("profile-info");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [printStarted, setPrintStarted] = useState(false);
  const [printCompleted, setPrintCompleted] = useState(false);

  const { width: previewWidth, ref: previewContainerRef } = useResizeObserver();

  const [resumeData, setResumeData] = useState({
    title: "Professional Resume",
    thumbnailLink: "",
    profileInfo: {
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "modern",
      colorPalette: [],
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [""],
  });

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resumeData.profileInfo.fullName) completedFields++;
    if (resumeData.profileInfo.designation) completedFields++;
    if (resumeData.profileInfo.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resumeData.contactInfo.email) completedFields++;
    if (resumeData.contactInfo.phone) completedFields++;

    // Work Experience
    resumeData.workExperience.forEach((exp) => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resumeData.education.forEach((edu) => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resumeData.skills.forEach((skill) => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resumeData.projects.forEach((project) => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resumeData.certifications.forEach((cert) => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resumeData.languages.forEach((lang) => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += resumeData.interests.length;
    completedFields += resumeData.interests.filter(
      (i) => i.trim() !== ""
    ).length;

    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
    return percentage;
  };

  useEffect(() => {
    calculateCompletion();
  }, [resumeData]);

  // Alternative download method using html2canvas and jsPDF (single-page, improved quality, black text, preserve links)
  const downloadWithCanvas = async () => {
    try {
      setIsDownloading(true);

      const jspdfModule = await import("jspdf").catch(() => null);
      const JsPDF =
        (jspdfModule && (jspdfModule.jsPDF || jspdfModule.default)) ||
        window?.jsPDF;
      if (!JsPDF) throw new Error("jsPDF not available");

      const source = canvasRef.current || thumbnailRef.current;
      if (!source) {
        toast.error("Resume preview not available for download");
        return;
      }

      // Clone node and inline computed styles
      const fixedNode = fixTailwindColors(source);

      // Ensure the clone is A4-sized and visible for capture
      fixedNode.style.transform = "none";
      fixedNode.style.zoom = "1";
      fixedNode.style.width = "210mm";
      fixedNode.style.minHeight = "297mm";
      fixedNode.style.boxSizing = "border-box";
      fixedNode.style.background = "#ffffff";
      fixedNode.style.display = "block";
      fixedNode.style.color = "#000000";

      // Force black text and remove colored backgrounds/shadows that cover sections
      fixedNode.querySelectorAll("*").forEach((el) => {
        try {
          // Force black text for better PDF rendering
          const computedStyle = window.getComputedStyle(el);

          // Only override text color if it's not already dark
          el.style.color = "#000000";
          el.style.webkitTextFillColor = "#000000";

          // Remove backgrounds that might hide text, but preserve structure
          if (el.tagName !== "BODY" && el !== fixedNode) {
            el.style.backgroundImage = "none";
            el.style.backgroundColor = "transparent";
            el.style.background = "transparent";
          }

          // Remove shadows and gradients that cause rendering issues
          el.style.boxShadow = "none";
          el.style.textShadow = "none";
          el.style.backgroundClip = "border-box";
          el.style.webkitBackgroundClip = "border-box";

          // Ensure text is visible and renders properly
          el.style.opacity = computedStyle.opacity === "0" ? "0" : "1";
          el.style.visibility =
            computedStyle.visibility === "hidden" ? "hidden" : "visible";

          // Handle links - keep them black without underline
          if (el.tagName === "A") {
            el.style.color = "#000000";
            el.style.textDecoration = "none";
            el.setAttribute("target", "_blank");
          }

          // Handle SVG elements
          if (el instanceof SVGElement) {
            el.style.fill = "#000000";
            if (!el.style.stroke) el.style.stroke = "#000000";
          }
        } catch (e) {
          /* ignore styling errors */
        }
      });

      // Wait for fonts & images to be ready (Improves text rendering)
      await document.fonts?.ready.catch(() => {});
      const imgs = Array.from(fixedNode.querySelectorAll("img"));
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise((res) => {
              if (img.complete) return res();
              img.onload = img.onerror = res;
            })
        )
      );

      // Allow layout to settle
      await new Promise((r) => setTimeout(r, 500));

      // Capture bounding rect and anchors BEFORE canvas render
      const fixedRect = fixedNode.getBoundingClientRect();

      // Collect anchors with positions (MUST be done before html2canvas)
      const anchors = Array.from(fixedNode.querySelectorAll("a[href]"))
        .map((a) => {
          try {
            const href = a.getAttribute("href");
            if (!href || href === "#") return null;
            const r = a.getBoundingClientRect();
            // Store coordinates relative to the fixedNode's bounding box
            return {
              href,
              left: r.left - fixedRect.left,
              top: r.top - fixedRect.top,
              width: r.width,
              height: r.height,
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      // High DPI canvas for sharp output
      const dpiScale = Math.min(3, Math.max(2, window.devicePixelRatio || 1));
      const canvas = await html2canvas(fixedNode, {
        scale: dpiScale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 15000,
        letterRendering: true,
        removeContainer: true,
        foreignObjectRendering: false,
      });

      // cleanup cloned node if appended
      if (fixedNode.parentNode === document.body) {
        document.body.removeChild(fixedNode);
      }

      // Convert to image
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new JsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;

      // Fit image to single A4 page (scale down if taller)
      const imgWidthMmFull = pageWidth;
      const imgHeightMmFull = (canvas.height * imgWidthMmFull) / canvas.width;

      let finalImgWidthMm = imgWidthMmFull;
      let finalImgHeightMm = imgHeightMmFull;

      if (imgHeightMmFull > pageHeight) {
        finalImgHeightMm = pageHeight;
        finalImgWidthMm = (canvas.width * finalImgHeightMm) / canvas.height;
      }

      const xOffset = (pageWidth - finalImgWidthMm) / 2;

      // Add image to PDF
      pdf.addImage(
        imgData,
        "PNG",
        xOffset,
        0,
        finalImgWidthMm,
        finalImgHeightMm,
        "",
        "FAST"
      );

      // Map anchors to PDF links (FIX for non-working links)
      if (anchors.length > 0) {
        // The scale from DOM pixels to canvas pixels (accounts for DPI)
        const canvasScale = dpiScale;

        // The scale from canvas pixels to PDF millimeters
        const canvasPxToMm = finalImgWidthMm / canvas.width;

        // Combined scale: DOM pixels -> PDF millimeters
        const domPxToMm = canvasPxToMm * canvasScale;

        anchors.forEach((a) => {
          try {
            // Convert DOM pixel coordinates to PDF millimeters
            const xMm = a.left * domPxToMm;
            const yMm = a.top * domPxToMm;
            const wMm = a.width * domPxToMm;
            const hMm = a.height * domPxToMm;

            // Add clickable link to PDF
            // pdf.link expects: x, y, width, height, { url }
            pdf.link(xOffset + xMm, yMm, wMm, hMm, { url: a.href });
          } catch (e) {
            console.error("Link mapping error:", e, a);
          }
        });
      }

      pdf.save(
        `${(resumeData.title || "resume").replace(/[^a-z0-9-_\. ]/gi, "_")}.pdf`
      );

      setDownloadSuccess(true);
      toast.success("Resume downloaded successfully!");
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("downloadWithCanvas error:", err);
      toast.error("Failed to generate PDF. Try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Validate Inputs
  const validateAndNext = (e) => {
    const errors = [];

    switch (currentPage) {
      case "profile-info":
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!(fullName || "").trim()) errors.push("Full Name is required");
        if (!(designation || "").trim()) errors.push("Designation is required");
        if (!(summary || "").trim()) errors.push("Summary is required");
        break;

      case "contact-info":
        const { email, phone } = resumeData.contactInfo;
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
          errors.push("Valid email is required.");
        if (!phone.trim() || !/^\d{10}$/.test(phone))
          errors.push("Valid 10-digit phone number is required");
        break;

      case "work-experience":
        // Work experience is now optional - only validate if entries with content exist
        if (resumeData.workExperience && resumeData.workExperience.length > 0) {
          // Filter out completely empty entries before validation
          const filledExperiences = resumeData.workExperience.filter(
            (exp) =>
              exp.company?.trim() ||
              exp.role?.trim() ||
              exp.startDate ||
              exp.endDate ||
              exp.description?.trim()
          );

          filledExperiences.forEach(
            ({ company, role, startDate, endDate }, index) => {
              if (!company || !company.trim())
                errors.push(`Company is required in experience ${index + 1}`);
              if (!role || !role.trim())
                errors.push(`Role is required in experience ${index + 1}`);
              if (!startDate || !endDate)
                errors.push(
                  `Start and End dates are required in experience ${index + 1}`
                );
            }
          );
        }
        break;

      case "education-info":
        resumeData.education.forEach(
          ({ degree, institution, startDate, endDate }, index) => {
            if (!degree.trim())
              errors.push(`Degree is required in education ${index + 1}`);
            if (!institution.trim())
              errors.push(`Institution is required in education ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(
                `Start and End dates are required in education ${index + 1}`
              );
          }
        );
        break;

      case "skills":
        resumeData.skills.forEach(({ name, progress }, index) => {
          if (!name.trim())
            errors.push(`Skill name is required in skill ${index + 1}`);
          if (progress < 1 || progress > 100)
            errors.push(
              `Skill progress must be between 1 and 100 in skill ${index + 1}`
            );
        });
        break;

      case "projects":
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim())
            errors.push(`Project Title is required in project ${index + 1}`);
          if (!description.trim())
            errors.push(
              `Project description is required in project ${index + 1}`
            );
        });
        break;

      case "certifications":
        resumeData.certifications.forEach(({ title, issuer }, index) => {
          if (!title.trim())
            errors.push(
              `Certification Title is required in certification ${index + 1}`
            );
          if (!issuer.trim())
            errors.push(`Issuer is required in certification ${index + 1}`);
        });
        break;

      case "additionalInfo":
        if (
          resumeData.languages.length === 0 ||
          !resumeData.languages[0].name?.trim()
        ) {
          errors.push("At least one language is required");
        }
        if (
          resumeData.interests.length === 0 ||
          !resumeData.interests[0]?.trim()
        ) {
          errors.push("At least one interest is required");
        }
        break;

      default:
        break;
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", "));
      return;
    }

    setErrorMsg("");
    goToNextStep();
  };

  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "additionalInfo") setOpenPreviewModal(true);

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);

      const percent = Math.round((nextIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "profile-info") navigate("/dashboard");

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);

      const percent = Math.round((prevIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) =>
              updateSection("profileInfo", key, value)
            }
            onNext={validateAndNext}
          />
        );

      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key, value) =>
              updateSection("contactInfo", key, value)
            }
          />
        );

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData?.workExperience}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("workExperience", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("workExperience", index)
            }
          />
        );

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData?.education}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("education", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        );

      case "skills":
        return (
          <SkillsInfoForm
            skillsInfo={resumeData?.skills}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("skills", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        );

      case "projects":
        return (
          <ProjectDetailForm
            projectInfo={resumeData?.projects}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("projects", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        );

      case "certifications":
        return (
          <CertificationInfoForm
            certifications={resumeData?.certifications}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("certifications", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("certifications", index)
            }
          />
        );

      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(section, index, key, value) =>
              updateArrayItem(section, index, key, value)
            }
            addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
            removeArrayItem={(section, index) =>
              removeArrayItem(section, index)
            }
          />
        );

      default:
        return null;
    }
  };

  //Update section for resume
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  //Update Array
  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];

      if (key === null) {
        updatedArray[index] = value;
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        };
      }

      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  //Adding new item in array
  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  //Removing item from array
  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  //Fetch resume details by id
  const fetchResumeDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.GET_BY_ID(resumeId)
      );

      if (response.data && response.data.profileInfo) {
        const resumeInfo = response.data;

        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo?.title || "Untitled",
          template: resumeInfo?.template || prevState?.template,
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
          workExperience: resumeInfo?.workExperience || [],
          education: resumeInfo?.education || prevState?.education,
          skills: resumeInfo?.skills || prevState?.skills,
          projects: resumeInfo?.projects || prevState?.projects,
          certifications:
            resumeInfo?.certifications || prevState?.certifications,
          languages: resumeInfo?.languages || prevState?.languages,
          interests: resumeInfo?.interests || prevState?.interests,
        }));
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      toast.error("Failed to load resume data");
    }
  };

  //it will help in choosing the preview as well as helps in downloading the resume and saves the resume as a image
  const uploadResumeImages = async () => {
    try {
      setIsLoading(true);

      const thumbnailElement = thumbnailRef.current;
      if (!thumbnailElement) {
        throw new Error("Thumbnail element not found");
      }

      const fixedThumbnail = fixTailwindColors(thumbnailElement);

      const thumbnailCanvas = await html2canvas(fixedThumbnail, {
        scale: 0.5,
        backgroundColor: "#FFFFFF",
        logging: false,
      });

      document.body.removeChild(fixedThumbnail);

      const thumbnailDataUrl = thumbnailCanvas.toDataURL("image/png");
      if (!thumbnailDataUrl || !thumbnailDataUrl.includes(",")) {
        throw new Error("Invalid thumbnail data URL");
      }
      const thumbnailFile = dataURLtoFile(
        thumbnailDataUrl,
        `thumbnail-${resumeId}.png`
      );

      const formData = new FormData();
      formData.append("thumbnail", thumbnailFile);

      const uploadResponse = await axiosInstance.put(
        API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { thumbnailLink } = uploadResponse.data;
      await updateResumeDetails(thumbnailLink);

      toast.success("Resume Updated Successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error Uploading Images:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsLoading(false);
    }
  };

  //Update resume details
  const updateResumeDetails = async (thumbnailLink) => {
    try {
      setIsLoading(true);

      await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), {
        ...resumeData,
        thumbnailLink: thumbnailLink || "",
        completion: completionPercentage,
      });
    } catch (err) {
      console.error("Error updating resume:", err);
      toast.error("Failed to update resume details");
    } finally {
      setIsLoading(false);
    }
  };

  //Delete function for resume
  const handleDeleteResume = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success("Resume deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTheme = (theme) => {
    setResumeData((prev) => ({
      ...prev,
      template: {
        theme: theme,
        colorPalette: [],
      },
    }));
  };

  useEffect(() => {
    if (resumeId) {
      fetchResumeDetailsById();
    }
  }, [resumeId]);

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-br from-violet-50 to-white min-h-screen px-2 sm:px-6 pb-16">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-violet-100/50 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4">
            <TitleInput
              title={resumeData.title}
              setTitle={(value) =>
                setResumeData((prev) => ({
                  ...prev,
                  title: value,
                }))
              }
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setOpenThemeSelector(true)}
                className={buttonStyles.theme}
              >
                <Palette size={28} />
                <span className="text-sm">Theme</span>
              </button>
              <button
                onClick={handleDeleteResume}
                className={buttonStyles.delete}
                disabled={isLoading}
              >
                <Trash2 size={16} />
                <span className="text-sm">Delete</span>
              </button>
              <button
                onClick={() => setOpenPreviewModal(true)}
                className={buttonStyles.download}
              >
                <Download size={16} />
                <span className="text-sm">Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full lg:basis-1/2 lg:w-1/2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="mb-6">
              <StepProgress progress={progress} />
              <div className="flex items-center gap-2 mt-2">
                <div className={statusStyles.completionBadge}>
                  <div className={iconStyles.pulseDot}></div>
                  <span className="text-xs text-gray-600">
                    Completion: {completionPercentage}%
                  </span>
                </div>
                {errorMsg && (
                  <div className={statusStyles.error}>
                    <AlertCircle size={16} />
                    {errorMsg}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-6">{renderForm()}</div>
            <div className="flex flex-wrap gap-3 justify-end items-center">
              <button
                className={buttonStyles.save}
                onClick={goBack}
                disabled={isLoading}
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                className={buttonStyles.save}
                onClick={uploadResumeImages}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {isLoading ? "Saving..." : "Save & Exit"}
              </button>
              <button
                className={buttonStyles.next}
                onClick={validateAndNext}
                disabled={isLoading}
              >
                {currentPage === "additionalInfo" && <Download size={16} />}
                {currentPage === "additionalInfo"
                  ? "Preview & Download"
                  : "Next"}
                {currentPage === "additionalInfo" && (
                  <ArrowLeft size={16} className="rotate-180" />
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="hidden lg:block w-full lg:basis-1/2 lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="text-center mb-4">
                <div className={statusStyles.completionBadge}>
                  <div className={iconStyles.pulseDot}></div>
                  <span>Preview - {completionPercentage}% Complete</span>
                </div>
              </div>
              <div
                className="preview-container relative flex justify-center"
                ref={previewContainerRef}
              >
                <div className={containerStyles.previewInner}>
                  <RenderResume
                    key={`preview-${resumeData?.template?.theme}`}
                    templateId={resumeData?.template?.theme || ""}
                    resumeData={resumeData}
                    containerWidth={previewWidth}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Selector Modal */}
        <Modal
          isOpen={openThemeSelector}
          onClose={() => setOpenThemeSelector(false)}
          title="Change Theme"
        >
          <div className={containerStyles.modalContent}>
            <ThemeSelector
              selectedTemplate={resumeData?.template?.theme}
              setSelectedTemplate={updateTheme}
              onClose={() => setOpenThemeSelector(false)}
            />
          </div>
        </Modal>

        {/* Preview Modal */}
        <Modal
          isOpen={openPreviewModal}
          onClose={() => setOpenPreviewModal(false)}
          title={resumeData.title}
          showActionBtn={true}
          actionBtnText={
            isDownloading
              ? "Downloading..."
              : downloadSuccess
              ? "Downloaded ✓"
              : "Download PDF"
          }
          actionBtnIcon={
            isDownloading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : downloadSuccess ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Download size={16} />
            )
          }
          onActionClick={downloadWithCanvas}
          actionBtnDisabled={isDownloading}
        >
          <div className="relative">
            <div className="text-center mb-4">
              <div className={statusStyles.modalBadge}>
                <div className={iconStyles.pulseDot}></div>
                <span>Completion: {completionPercentage}%</span>
              </div>
            </div>

            {/* Visible Preview Container */}
            <div className="bg-gray-100 rounded-xl p-6 max-h-[80vh] overflow-auto">
              <div
                ref={canvasRef} // <-- attach ref here so html2canvas captures the visible preview
                className="bg-white shadow-2xl mx-auto rounded-lg overflow-hidden"
                style={{
                  width: "210mm",
                  maxWidth: "210mm",
                  minHeight: "297mm",
                  transform: "scale(0.6)",
                  transformOrigin: "top center",
                }}
                dir="ltr"
              >
                <div className="w-full h-full">
                  <RenderResume
                    key={`modal-preview-${resumeData?.template?.theme}`}
                    templateId={resumeData?.template?.theme || "modern"}
                    resumeData={resumeData}
                    containerWidth={794}
                    singlePage={true}
                  />
                </div>
              </div>
            </div>
            {/* Alternative Download Button (now primary download) */}
            <div className="text-center mt-4">
              <button
                onClick={downloadWithCanvas}
                disabled={isDownloading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isDownloading ? "Generating PDF..." : "Download PDF"}
              </button>
            </div>
          </div>
        </Modal>

        {/* Hidden thumbnail for image upload */}
        <div style={{ display: "none" }} ref={thumbnailRef}>
          <div className={containerStyles.hiddenThumbnail}>
            <RenderResume
              key={`thumbnail-${resumeData?.template?.theme}`}
              templateId={resumeData?.template?.theme || ""}
              resumeData={resumeData}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditResume;

// Converts a dataURL to a File object
function dataURLtoFile(dataurl, filename) {
  if (!dataurl || !dataurl.includes(",")) {
    throw new Error("Invalid dataURL format");
  }
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
