import React, { useState, useEffect, useRef } from 'react';
import { useInterview } from '../hooks/useInterview';
import DashboardLayout from '../components/DashboardLayout';
import QuestionCard from '../components/QuestionCard';
import AnswerEvaluator from '../components/AnswerEvaluator';
import InterviewSummary from '../components/InterviewSummary';
import axiosInstance from '../utils/axiosInstance';
import { BASE_URL, API_PATHS } from '../utils/apiPath';
import toast from 'react-hot-toast';
import { Play, Loader2, FileText, Target, ShieldQuestion, Upload, X, Maximize, AlertTriangle, Sliders, UserCheck } from 'lucide-react';

const InterviewPrep = () => {
  const { 
    loading, 
    sessionState, 
    questions, 
    currentQuestionIndex, 
    currentQuestion, 
    answers, 
    startInterview, 
    evaluateAnswer, 
    nextQuestion, 
    resetInterview,
    // Additive
    localAnswers,
    setLocalAnswers,
    integrityMetrics,
    typingAnalytics,
    questionTimes,
    overallReport,
    submitInterview,
    recordKeystroke,
    recordCopyAttempt,
    recordPasteAttempt,
    recordCutAttempt,
    recordTabSwitch,
    recordFullscreenExit,
    questionStartTime
  } = useInterview();

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [fetchingResumes, setFetchingResumes] = useState(true);

  const [inputMode, setInputMode] = useState('existing');
  const [resumeText, setResumeText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  // Setup options
  const [experience, setExperience] = useState('Mid-level');
  const [interviewLength, setInterviewLength] = useState('standard');

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenInitialized, setFullscreenInitialized] = useState(false);
  
  // Tab switch state
  const [showTabAlert, setShowTabAlert] = useState(false);
  
  // Submission protection
  const [isTerminating, setIsTerminating] = useState(false);
  const hiddenAt = useRef(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
        setResumes(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedResumeId(response.data[0]._id);
          if (response.data[0].profileInfo?.designation) {
            setTargetRole(response.data[0].profileInfo.designation);
          }
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setFetchingResumes(false);
      }
    };
    fetchResumes();
  }, []);

  // Monitor Fullscreen Exit
  useEffect(() => {
    if (sessionState !== 'active') return;

    const handleFullscreenChange = () => {
      const isCurrentlyFS = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFS);

      if (!isCurrentlyFS && sessionState === 'active') {
        recordFullscreenExit();
        toast.error("Warning: Fullscreen mode exited.");
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [sessionState]);

  const exitCount = integrityMetrics.fullscreenExitCount;

  // Monitor Tab Switch
  useEffect(() => {
    if (sessionState !== 'active') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenAt.current = Date.now();
      } else {
        if (hiddenAt.current) {
          const awayDuration = Date.now() - hiddenAt.current;
          if (awayDuration > 2000) {
            recordTabSwitch();
            setShowTabAlert(true);
          }
          hiddenAt.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionState]);

  const tabSwitchCount = integrityMetrics.tabSwitchCount;

  // Auto-submit if exitCount reaches 4
  useEffect(() => {
    if (sessionState === 'active' && exitCount >= 4 && !isTerminating) {
      setIsTerminating(true);
      toast.error("Interview terminated due to multiple fullscreen exits.");
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
      }
      submitInterview();
    }
  }, [exitCount, sessionState, isTerminating]);

  // Auto-submit if tabSwitchCount reaches 4
  useEffect(() => {
    if (sessionState === 'active' && tabSwitchCount >= 4 && !isTerminating) {
      setIsTerminating(true);
      toast.error("Interview terminated due to multiple tab switches.");
      setShowTabAlert(false);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
      }
      submitInterview();
    }
  }, [tabSwitchCount, sessionState, isTerminating]);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
          setFullscreenInitialized(true);
        })
        .catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
          toast.error("Could not enter fullscreen. Please check browser settings.");
        });
    }
  };

  const handleStart = () => {
    setIsTerminating(false);
    startInterview(
      inputMode === 'existing' ? selectedResumeId : null,
      targetRole,
      false,
      inputMode === 'upload' ? resumeText : '',
      experience,
      interviewLength
    );
    enterFullscreen();
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await fetch(
        `${BASE_URL}${API_PATHS.RESUME.EXTRACT_TEXT}`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || 'Failed to read PDF');
        return;
      }
      setResumeText(data.resumeText);
      setUploadedFileName(file.name);
      toast.success('Resume uploaded!');
    } catch (error) {
      toast.error('Failed to upload resume');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {sessionState === 'setup' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 text-left">
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldQuestion size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">AI Mock Interview</h1>
              <p className="text-gray-600">
                Practice answering behavioural and technical questions tailored specifically to your resume and your target role. Get instant feedback and scoring.
              </p>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Input Mode Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit mb-6">
                <button
                  onClick={() => {
                    setInputMode('existing');
                    setResumeText('');
                    setUploadedFileName('');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    inputMode === 'existing'
                      ? 'bg-white text-violet-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Resumes
                </button>
                <button
                  onClick={() => {
                    setInputMode('upload');
                    setResumeText('');
                    setUploadedFileName('');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    inputMode === 'upload'
                      ? 'bg-white text-violet-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Upload Resume PDF
                </button>
              </div>

              {/* Existing Flow */}
              {inputMode === 'existing' && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <FileText size={18} className="text-violet-500" /> Select Resume
                  </label>
                  {fetchingResumes ? (
                    <div className="animate-pulse h-12 bg-gray-100 rounded-lg"></div>
                  ) : (
                    <select
                      value={selectedResumeId}
                      onChange={(e) => {
                        setSelectedResumeId(e.target.value);
                        const res = resumes.find(r => r._id === e.target.value);
                        if (res && res.profileInfo?.designation) {
                          setTargetRole(res.profileInfo.designation);
                        }
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50"
                    >
                      {resumes.length === 0 && <option value="">No resumes found</option>}
                      {resumes.map(resume => (
                        <option key={resume._id} value={resume._id}>
                          {resume.title} {resume.profileInfo?.designation ? `- ${resume.profileInfo.designation}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* New Upload Flow */}
              {inputMode === 'upload' && (
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Upload size={18} className="text-violet-500" /> Upload Your Resume (PDF only, max 5MB)
                  </label>

                  {!uploadedFileName ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-violet-300 rounded-lg cursor-pointer bg-violet-50 hover:bg-violet-100 transition-colors">
                      {uploadLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 size={20} className="animate-spin text-violet-500" />
                          <span className="text-sm text-violet-600">Reading PDF...</span>
                        </div>
                      ) : (
                        <>
                          <Upload size={24} className="text-violet-400 mb-2" />
                          <span className="text-sm text-violet-600 font-medium">Click to upload PDF</span>
                          <span className="text-xs text-gray-400 mt-1">Max 5MB, text-based PDF only</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handlePDFUpload}
                        disabled={uploadLoading}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-green-600" />
                        <span className="text-sm text-green-700 font-medium">{uploadedFileName}</span>
                      </div>
                      <button
                        onClick={() => {
                          setUploadedFileName('');
                          setResumeText('');
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Target size={18} className="text-violet-500" /> Target Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50"
                />
              </div>

              {/* Additive Dropdowns: Interview Length and Experience Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Sliders size={18} className="text-violet-500" /> Interview Length
                  </label>
                  <select
                    value={interviewLength}
                    onChange={(e) => setInterviewLength(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50"
                  >
                    <option value="quick">Quick (5 Questions)</option>
                    <option value="standard">Standard (7 Questions)</option>
                    <option value="deep">Deep (10 Questions)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <UserCheck size={18} className="text-violet-500" /> Experience Level
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead / Executive">Lead / Executive</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={
                  loading ||
                  !targetRole.trim() ||
                  (inputMode === 'existing' && !selectedResumeId) ||
                  (inputMode === 'upload' && !resumeText)
                }
                className="w-full mt-4 py-4 bg-violet-600 text-white rounded-xl font-bold text-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Play size={24} />}
                {loading ? 'Generating Interview...' : 'Start Interview'}
              </button>
            </div>
          </div>
        )}

        {sessionState === 'active' && currentQuestion && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <QuestionCard 
              question={currentQuestion} 
              index={currentQuestionIndex} 
              total={questions.length} 
              startTime={questionStartTime}
            />
            <AnswerEvaluator 
              questionId={currentQuestion.id}
              localAnswers={localAnswers}
              setLocalAnswers={setLocalAnswers}
              onNext={currentQuestionIndex === questions.length - 1 ? submitInterview : nextQuestion}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
              recordKeystroke={recordKeystroke}
              recordCopyAttempt={recordCopyAttempt}
              recordPasteAttempt={recordPasteAttempt}
              recordCutAttempt={recordCutAttempt}
              loading={loading}
            />
          </div>
        )}

        {/* Tab Switch Alert Modal */}
        {sessionState === 'active' && showTabAlert && tabSwitchCount < 4 && !isTerminating && (
          <div className="fixed inset-0 bg-gray-900/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8 text-center animate-in fade-in zoom-in-95 duration-200 border border-orange-100">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Tab Switch Detected</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Navigating away from the interview tab is strictly prohibited.
              </p>
              
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 text-left">
                <span className="text-sm font-bold text-orange-800 block mb-1">
                  Tab Switches: {tabSwitchCount} / 4
                </span>
                <span className="text-xs text-orange-600 font-medium">
                  {tabSwitchCount === 1 && "Warning 1: Please do not leave this tab."}
                  {tabSwitchCount === 2 && "Warning 2: Integrity penalty applied. Tab switches are logged."}
                  {tabSwitchCount === 3 && "Warning 3: Severe integrity penalty applied. The next switch will terminate your interview."}
                </span>
              </div>

              <button
                onClick={() => setShowTabAlert(false)}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                Acknowledge & Continue
              </button>
            </div>
          </div>
        )}

        {/* Fullscreen Alert Modal */}
        {sessionState === 'active' && fullscreenInitialized && !isFullscreen && exitCount < 4 && !isTerminating && (
          <div className="fixed inset-0 bg-gray-900/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8 text-center animate-in fade-in zoom-in-95 duration-200 border border-red-100">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Fullscreen Mode Required</h3>
              <p className="text-gray-600 mb-6 text-sm">
                To ensure a fair and integral testing environment, this mock interview requires fullscreen mode.
              </p>
              
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-left">
                <span className="text-sm font-bold text-red-800 block mb-1">
                  Fullscreen Exits: {exitCount} / 4
                </span>
                <span className="text-xs text-red-600 font-medium">
                  {exitCount === 1 && "Warning 1: Please remain in fullscreen mode."}
                  {exitCount === 2 && "Warning 2: Integrity penalty applied. Exits are logged."}
                  {exitCount === 3 && "Warning 3: Severe integrity penalty applied. The next exit will terminate your interview."}
                </span>
              </div>

              <button
                onClick={enterFullscreen}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Maximize size={18} /> Re-enter Fullscreen
              </button>
            </div>
          </div>
        )}

        {sessionState === 'summary' && (
          <InterviewSummary 
            answers={answers} 
            report={overallReport}
            integrityMetrics={integrityMetrics}
            onPracticeAgain={resetInterview} 
          />
        )}

      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
