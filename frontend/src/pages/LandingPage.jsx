// import React, { useContext, useState } from "react";
// import Modal from "../components/Modal";
// import SignUp from "../components/SignUp";
// import {
//   ArrowRight,
//   Download,
//   LayoutTemplate,
//   Menu,
//   X,
//   Zap,
// } from "lucide-react";
// import { landingPageStyles } from "../assets/dummystyle";
// import { useUser } from "../context/UserContext"; // Change this line - use useUser instead of UserContext
// import { useNavigate, Link } from "react-router-dom";
// import { ProfileInfoCard } from "../components/Cards";
// import Login from "../components/Login";
// // import { set } from "mongoose";

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const { user } = useUser(); // Use the hook instead of context directly
//   const [openAuthModal, setOpenAuthModal] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState("login"); // 'login' or 'register'

//   // Redirect to dashboard if user is already logged in
//   React.useEffect(() => {
//     if (user) {
//       navigate("/dashboard");
//     }
//   }, [user, navigate]);

//   //handle CTA is the button on the hero section which is "Start Building" and "View Templates"
//   const handleCTA = () => {
//     if (!user) {
//       setOpenAuthModal(true);
//     } else {
//       navigate("/dashboard");
//     }
//   };
//   return (
//     <div className={landingPageStyles.container}>
//       {/* {HEADER} */}
//       <header className={landingPageStyles.header}>
//         <div className={landingPageStyles.headerContainer}>
//           <div className={landingPageStyles.logoContainer}>
//             <div className={landingPageStyles.logoIcon}>
//               <LayoutTemplate className={landingPageStyles.logoIconInner} />
//             </div>
//             <span className={landingPageStyles.logoText}>ResumeCraft</span>
//           </div>
//           {/* {Mobile Menu Btn} */}
//           <button
//             className={landingPageStyles.mobileMenuButton}
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             {mobileMenuOpen ? (
//               <X size={24} className={landingPageStyles.mobileMenuIcon} />
//             ) : (
//               <Menu size={24} className={landingPageStyles.mobileMenuIcon} />
//             )}
//           </button>
//           {/* {Desktop Navigation} */}
//           <div className="hidden md:flex items-center">
//             {user ? (
//               <ProfileInfoCard />
//             ) : (
//               <button
//                 className={landingPageStyles.desktopAuthButton}
//                 onClick={() => setOpenAuthModal(true)}
//               >
//                 <div
//                   className={landingPageStyles.desktopAuthButtonOverlay}
//                 ></div>
//                 <span className={landingPageStyles.desktopAuthButtonText}>
//                   Get Started
//                 </span>
//               </button>
//             )}
//           </div>
//         </div>
//         {/* {Mobile Menu} */}
//         {mobileMenuOpen && (
//           <div className={landingPageStyles.mobileMenu}>
//             <div className={landingPageStyles.mobileMenuContainer}>
//               {user ? (
//                 <div className={landingPageStyles.mobileUserInfo}>
//                   <div className={landingPageStyles.mobileUserWelcome}>
//                     Welcome Back
//                   </div>
//                   <button
//                     className={landingPageStyles.mobileDashboardButton}
//                     onClick={() => {
//                       navigate("/dashboard");
//                       setMobileMenuOpen(false);
//                     }}
//                   >
//                     Go to Dashboard
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   className={landingPageStyles.mobileAuthButton}
//                   onClick={() => {
//                     setOpenAuthModal(true);
//                     setMobileMenuOpen(false);
//                   }}
//                 >
//                   Get Started
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* {MAIN CONTENT} */}
//       <main className={landingPageStyles.main}>
//         <section className={landingPageStyles.heroSection}>
//           <div className={landingPageStyles.heroGrid}>
//             {/* {Left Content} */}
//             <div className={landingPageStyles.heroLeft}>
//               <div className={landingPageStyles.tagline}>
//                 Professional Resume Builder
//               </div>

//               <h1 className={landingPageStyles.heading}>
//                 <span className={landingPageStyles.headingText}>Craft</span>
//                 <span className={landingPageStyles.headingGradient}>
//                   Professional
//                 </span>
//                 <span className={landingPageStyles.headingText}>Resumes</span>
//               </h1>

//               <p className={landingPageStyles.description}>
//                 Create stunning resumes effortlessly with ResumeCraft. Stand out
//                 to employers with a polished, ATS-friendly resume that
//                 highlights your skills , Projects and experience.
//               </p>

//               <div className={landingPageStyles.ctaButtons}>
//                 <button
//                   className={landingPageStyles.primaryButton}
//                   onClick={handleCTA}
//                 >
//                   <div className={landingPageStyles.primaryButtonOverlay}></div>
//                   <span className={landingPageStyles.primaryButtonContent}>
//                     Start Building
//                     <ArrowRight
//                       className={landingPageStyles.primaryButtonIcon}
//                       size={18}
//                     />
//                   </span>
//                 </button>
//                 <button
//                   className={landingPageStyles.secondaryButton}
//                   onClick={handleCTA}
//                 >
//                   View Templates
//                 </button>
//               </div>
//             </div>
//             {/* Right Content - SVG Illustration */}
//             <div className={landingPageStyles.heroIllustration}>
//               <div className={landingPageStyles.heroIllustrationBg}></div>
//               <div className={landingPageStyles.heroIllustrationContainer}>
//                 <svg
//                   viewBox="0 0 400 500"
//                   className={landingPageStyles.svgContainer}
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   {/* Background */}
//                   <defs>
//                     <linearGradient
//                       id="bgGradient"
//                       x1="0%"
//                       y1="0%"
//                       x2="100%"
//                       y2="100%"
//                     >
//                       <stop offset="0%" stopColor="#8b5cf6" />
//                       <stop offset="100%" stopColor="#d946ef" />
//                     </linearGradient>
//                     <linearGradient
//                       id="cardGradient"
//                       x1="0%"
//                       y1="0%"
//                       x2="100%"
//                       y2="100%"
//                     >
//                       <stop offset="0%" stopColor="#ffffff" />
//                       <stop offset="100%" stopColor="#f8fafc" />
//                     </linearGradient>
//                   </defs>

//                   {/* SVG elements */}
//                   <rect
//                     x="50"
//                     y="50"
//                     width="300"
//                     height="400"
//                     rx="20"
//                     className={landingPageStyles.svgRect}
//                   />
//                   <circle
//                     cx="120"
//                     cy="120"
//                     r="25"
//                     className={landingPageStyles.svgCircle}
//                   />
//                   <rect
//                     x="160"
//                     y="105"
//                     width="120"
//                     height="8"
//                     rx="4"
//                     className={landingPageStyles.svgRectPrimary}
//                   />
//                   <rect
//                     x="160"
//                     y="120"
//                     width="80"
//                     height="6"
//                     rx="3"
//                     className={landingPageStyles.svgRectSecondary}
//                   />
//                   <rect
//                     x="70"
//                     y="170"
//                     width="260"
//                     height="4"
//                     rx="2"
//                     className={landingPageStyles.svgRectLight}
//                   />
//                   <rect
//                     x="70"
//                     y="185"
//                     width="200"
//                     height="4"
//                     rx="2"
//                     className={landingPageStyles.svgRectLight}
//                   />
//                   <rect
//                     x="70"
//                     y="200"
//                     width="240"
//                     height="4"
//                     rx="2"
//                     className={landingPageStyles.svgRectLight}
//                   />
//                   <rect
//                     x="70"
//                     y="230"
//                     width="60"
//                     height="6"
//                     rx="3"
//                     className={landingPageStyles.svgRectPrimary}
//                   />
//                   <rect
//                     x="70"
//                     y="250"
//                     width="40"
//                     height="15"
//                     rx="7"
//                     className={landingPageStyles.svgRectSkill}
//                   />
//                   <rect
//                     x="120"
//                     y="250"
//                     width="50"
//                     height="15"
//                     rx="7"
//                     className={landingPageStyles.svgRectSkill}
//                   />
//                   <rect
//                     x="180"
//                     y="250"
//                     width="45"
//                     height="15"
//                     rx="7"
//                     className={landingPageStyles.svgRectSkill}
//                   />
//                   <rect
//                     x="70"
//                     y="290"
//                     width="80"
//                     height="6"
//                     rx="3"
//                     className={landingPageStyles.svgRectSecondary}
//                   />
//                   <rect
//                     x="70"
//                     y="310"
//                     width="180"
//                     height="4"
//                     rx="2"
//                     className={landingPageStyles.svgRectLight}
//                   />
//                   <rect
//                     x="70"
//                     y="325"
//                     width="150"
//                     height="4"
//                     rx="2"
//                     className={landingPageStyles.svgRectLight}
//                   />
//                   <rect
//                     x="70"
//                     y="340"
//                     width="200"
//                     height="4"
//                     rx="2"
//                     className={landingPageStyles.svgRectLight}
//                   />

//                   {/* Animated elements */}
//                   <circle
//                     cx="320"
//                     cy="100"
//                     r="15"
//                     className={landingPageStyles.svgAnimatedCircle}
//                   >
//                     <animateTransform
//                       attributeName="transform"
//                       type="translate"
//                       values="0,0; 0,-10; 0,0"
//                       dur="3s"
//                       repeatCount="indefinite"
//                     />
//                   </circle>
//                   <rect
//                     x="30"
//                     y="300"
//                     width="12"
//                     height="12"
//                     rx="6"
//                     className={landingPageStyles.svgAnimatedRect}
//                   >
//                     <animateTransform
//                       attributeName="transform"
//                       type="translate"
//                       values="0,0; 5,0; 0,0"
//                       dur="2s"
//                       repeatCount="indefinite"
//                     />
//                   </rect>
//                   <polygon
//                     points="360,200 370,220 350,220"
//                     className={landingPageStyles.svgAnimatedPolygon}
//                   >
//                     <animateTransform
//                       attributeName="transform"
//                       type="rotate"
//                       values="0 360 210; 360 360 210; 0 360 210"
//                       dur="4s"
//                       repeatCount="indefinite"
//                     />
//                   </polygon>
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </section>
//         {/* {Features section} */}
//         <section className={landingPageStyles.featuresSection}>
//           <div className={landingPageStyles.featuresContainer}>
//             <div className={landingPageStyles.featuresHeader}>
//               <h2 className={landingPageStyles.featuresTitle}>
//                 Why Choose{" "}
//                 <span className={landingPageStyles.featuresTitleGradient}>
//                   ResumeCraft
//                 </span>
//               </h2>
//               <p className={landingPageStyles.featureDescription}>
//                 Everything you need to create a professional resume standout out
//               </p>
//             </div>
//             <div className={landingPageStyles.featuresGrid}>
//               {[
//                 {
//                   icon: <Zap className={landingPageStyles.featureIcon} />,
//                   title: "Lightning Fast",
//                   description:
//                     "Create professional resumes in under 5 minutes with our streamlined process",
//                   gradient: landingPageStyles.featureIconViolet,
//                   bg: landingPageStyles.featureCardViolet,
//                 },
//                 {
//                   icon: (
//                     <LayoutTemplate className={landingPageStyles.featureIcon} />
//                   ),
//                   title: "Pro Templates",
//                   description:
//                     "Choose from dozens of recruiter-approved, industry-specific templates",
//                   gradient: landingPageStyles.featureIconFuchsia,
//                   bg: landingPageStyles.featureCardFuchsia,
//                 },
//                 {
//                   icon: <Download className={landingPageStyles.featureIcon} />,
//                   title: "Instant Export",
//                   description:
//                     "Download high-quality PDFs instantly with perfect formatting",
//                   gradient: landingPageStyles.featureIconOrange,
//                   bg: landingPageStyles.featureCardOrange,
//                 },
//               ].map((feature, index) => (
//                 <div key={index} className={landingPageStyles.featureCard}>
//                   <div className={landingPageStyles.featureCardHover}></div>
//                   <div
//                     className={`${landingPageStyles.featureCardContent} ${feature.bg}`}
//                   >
//                     <div
//                       className={`${landingPageStyles.featureIconContainer} ${feature.gradient}`}
//                     >
//                       {feature.icon}
//                     </div>
//                     <h3 className={landingPageStyles.featureTitle}>
//                       {feature.title}
//                     </h3>
//                     <p className={landingPageStyles.featureDescription}>
//                       {feature.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//         {/* {CTA Section} */}
//         <section className={landingPageStyles.ctaSection}>
//           <div className={landingPageStyles.ctaContainer}>
//             <div className={landingPageStyles.ctaCard}>
//               <div className={landingPageStyles.ctaCardBg}></div>
//               <div className={landingPageStyles.ctaCardContent}>
//                 <h2 className={landingPageStyles.ctaTitle}>
//                   Ready to Build Your{" "}
//                   <span className={landingPageStyles.ctaTitleGradient}>
//                     Standout Resume?
//                   </span>
//                 </h2>
//                 <p className={landingPageStyles.ctaDescription}>
//                   Join thousands of satisfied users and take the first step
//                   towards your dream job.
//                 </p>
//                 <button
//                   className={landingPageStyles.ctaButton}
//                   onClick={handleCTA}
//                 >
//                   <div className={landingPageStyles.ctaButtonOverlay}></div>
//                   <span className={landingPageStyles.ctaButtonText}>
//                     Start Building Now
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//       {/* {FOOTER} */}
//       <footer className={landingPageStyles.footer}>
//         <div className={landingPageStyles.footerContainer}>
//           <p className={landingPageStyles.footerText}>
//             &copy; 2025 ResumeCraft. All rights reserved.
//           </p>
//         </div>
//       </footer>
//       {/* {Modal for Login and Signup} */}
//       {/* This modal will contain the login and signup forms */}
//       <Modal
//         isOpen={openAuthModal}
//         onClose={() => {
//           setOpenAuthModal(false);
//           setCurrentPage("login");
//         }}
//         hideHeader
//       >
//         <div>
//           {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
//           {currentPage === "signup" && (
//             <SignUp setCurrentPage={setCurrentPage} />
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default LandingPage;

import React, { useContext, useState } from "react";
import Modal from "../components/Modal";
import SignUp from "../components/SignUp";
import {
  ArrowRight,
  Download,
  LayoutTemplate,
  Menu,
  X,
  Zap,
  Brain,
  FileText,
  Sparkles,
} from "lucide-react";
import { landingPageStyles } from "../assets/dummystyle";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { ProfileInfoCard } from "../components/Cards";
import Login from "../components/Login";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className={landingPageStyles.container}>
      {/* HEADER */}
      <header className={landingPageStyles.header}>
        <div className={landingPageStyles.headerContainer}>
          <div className={landingPageStyles.logoContainer}>
            <div className={landingPageStyles.logoIcon}>
              <LayoutTemplate className={landingPageStyles.logoIconInner} />
            </div>
            <span className={landingPageStyles.logoText}>ResumeCraft AI</span>
          </div>

          {/* Mobile Menu Btn */}
          <button
            className={landingPageStyles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} className={landingPageStyles.mobileMenuIcon} />
            ) : (
              <Menu size={24} className={landingPageStyles.mobileMenuIcon} />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className={landingPageStyles.desktopAuthButton}
                onClick={() => setOpenAuthModal(true)}
              >
                <div
                  className={landingPageStyles.desktopAuthButtonOverlay}
                ></div>
                <span className={landingPageStyles.desktopAuthButtonText}>
                  Get Started
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={landingPageStyles.mobileMenu}>
            <div className={landingPageStyles.mobileMenuContainer}>
              {user ? (
                <div className={landingPageStyles.mobileUserInfo}>
                  <div className={landingPageStyles.mobileUserWelcome}>
                    Welcome Back
                  </div>
                  <button
                    className={landingPageStyles.mobileDashboardButton}
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <button
                  className={landingPageStyles.mobileAuthButton}
                  onClick={() => {
                    setOpenAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className={landingPageStyles.main}>
        {/* Hero Section */}
        <section className={landingPageStyles.heroSection}>
          <div className={landingPageStyles.heroGrid}>
            {/* Left Content */}
            <div className={landingPageStyles.heroLeft}>
              <div className={landingPageStyles.tagline}>
                AI-Powered Resume Builder
              </div>

              <h1 className={landingPageStyles.heading}>
                <span className={landingPageStyles.headingText}>Craft</span>
                <span className={landingPageStyles.headingGradient}>
                  Smarter Resumes
                </span>
                <span className={landingPageStyles.headingText}>with AI</span>
              </h1>

              <p className={landingPageStyles.description}>
                ResumeCraft AI helps you create professional resumes in minutes.
                Generate personalized summaries, refine project descriptions,
                and enhance your work experience — all powered by advanced AI.
              </p>

              <div className={landingPageStyles.ctaButtons}>
                <button
                  className={landingPageStyles.primaryButton}
                  onClick={handleCTA}
                >
                  <div className={landingPageStyles.primaryButtonOverlay}></div>
                  <span className={landingPageStyles.primaryButtonContent}>
                    Start Building with AI
                    <ArrowRight
                      className={landingPageStyles.primaryButtonIcon}
                      size={18}
                    />
                  </span>
                </button>
                <button
                  className={landingPageStyles.secondaryButton}
                  onClick={handleCTA}
                >
                  Explore Templates
                </button>
              </div>
            </div>

            {/* Right Content - Same SVG Illustration */}
            <div className={landingPageStyles.heroIllustration}>
              <div className={landingPageStyles.heroIllustrationBg}></div>
              <div className={landingPageStyles.heroIllustrationContainer}>
                {/* Keep your existing SVG here */}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={landingPageStyles.featuresSection}>
          <div className={landingPageStyles.featuresContainer}>
            <div className={landingPageStyles.featuresHeader}>
              <h2 className={landingPageStyles.featuresTitle}>
                Why Choose{" "}
                <span className={landingPageStyles.featuresTitleGradient}>
                  ResumeCraft AI
                </span>
              </h2>
              <p className={landingPageStyles.featureDescription}>
                Supercharge your resume creation process with built-in AI tools.
              </p>
            </div>

            <div className={landingPageStyles.featuresGrid}>
              {[
                {
                  icon: <Brain className={landingPageStyles.featureIcon} />,
                  title: "AI Summary Generator",
                  description:
                    "Instantly create professional summaries tailored to your profile using AI-powered suggestions.",
                  gradient: landingPageStyles.featureIconViolet,
                  bg: landingPageStyles.featureCardViolet,
                },
                {
                  icon: <FileText className={landingPageStyles.featureIcon} />,
                  title: "Smart Project Descriptions",
                  description:
                    "Describe your projects with precision — our AI refines your input into job-winning statements.",
                  gradient: landingPageStyles.featureIconFuchsia,
                  bg: landingPageStyles.featureCardFuchsia,
                },
                {
                  icon: <Sparkles className={landingPageStyles.featureIcon} />,
                  title: "Auto Work Experience Enhancer",
                  description:
                    "Enhance your work experience with action-driven and impactful AI-generated phrasing.",
                  gradient: landingPageStyles.featureIconOrange,
                  bg: landingPageStyles.featureCardOrange,
                },
                {
                  icon: <Zap className={landingPageStyles.featureIcon} />,
                  title: "Lightning Fast Builder",
                  description:
                    "Create, edit, and export AI-enhanced resumes in minutes with a smooth and intuitive interface.",
                  gradient: landingPageStyles.featureIconViolet,
                  bg: landingPageStyles.featureCardViolet,
                },
                {
                  icon: (
                    <LayoutTemplate className={landingPageStyles.featureIcon} />
                  ),
                  title: "Modern Templates",
                  description:
                    "Choose from elegant, ATS-optimized templates and let AI adapt your content perfectly.",
                  gradient: landingPageStyles.featureIconFuchsia,
                  bg: landingPageStyles.featureCardFuchsia,
                },
                {
                  icon: <Download className={landingPageStyles.featureIcon} />,
                  title: "Instant PDF Export",
                  description:
                    "Download clean, ready-to-send PDFs instantly — optimized for recruiters and job portals.",
                  gradient: landingPageStyles.featureIconOrange,
                  bg: landingPageStyles.featureCardOrange,
                },
              ].map((feature, index) => (
                <div key={index} className={landingPageStyles.featureCard}>
                  <div className={landingPageStyles.featureCardHover}></div>
                  <div
                    className={`${landingPageStyles.featureCardContent} ${feature.bg}`}
                  >
                    <div
                      className={`${landingPageStyles.featureIconContainer} ${feature.gradient}`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className={landingPageStyles.featureTitle}>
                      {feature.title}
                    </h3>
                    <p className={landingPageStyles.featureDescription}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={landingPageStyles.ctaSection}>
          <div className={landingPageStyles.ctaContainer}>
            <div className={landingPageStyles.ctaCard}>
              <div className={landingPageStyles.ctaCardBg}></div>
              <div className={landingPageStyles.ctaCardContent}>
                <h2 className={landingPageStyles.ctaTitle}>
                  Transform Your Resume with{" "}
                  <span className={landingPageStyles.ctaTitleGradient}>
                    the Power of AI
                  </span>
                </h2>
                <p className={landingPageStyles.ctaDescription}>
                  Experience how ResumeCraft AI turns your words into
                  professional brilliance — start creating today.
                </p>
                <button
                  className={landingPageStyles.ctaButton}
                  onClick={handleCTA}
                >
                  <div className={landingPageStyles.ctaButtonOverlay}></div>
                  <span className={landingPageStyles.ctaButtonText}>
                    Try AI Builder Now
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={landingPageStyles.footer}>
        <div className={landingPageStyles.footerContainer}>
          <p className={landingPageStyles.footerText}>
            &copy; 2025 ResumeCraft AI. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
