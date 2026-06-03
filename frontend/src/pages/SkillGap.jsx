import React, { useState, useEffect } from 'react';
import { useSkillGap } from '../hooks/useSkillGap';
import DashboardLayout from '../components/DashboardLayout';
import SkillBuckets from '../components/SkillBuckets';
import GapCard from '../components/GapCard';
import LearningRoadmap from '../components/LearningRoadmap';
import ResumeSuggestions from '../components/ResumeSuggestions';
import axiosInstance from '../utils/axiosInstance';
import { BASE_URL, API_PATHS } from '../utils/apiPath';
import toast from 'react-hot-toast';
import { Search, ChevronLeft, Loader2, FileText, Target, Upload, X } from 'lucide-react';

const SkillGap = () => {
  const { loading, analysisResult, analyzeGap } = useSkillGap();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [fetchingResumes, setFetchingResumes] = useState(true);

  const [inputMode, setInputMode] = useState('existing');
  const [resumeText, setResumeText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
        setResumes(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedResumeId(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setFetchingResumes(false);
      }
    };
    fetchResumes();
  }, []);

  const handleAnalyze = () => {
    analyzeGap(
      inputMode === 'existing' ? selectedResumeId : null,
      jobDescription,
      false,
      inputMode === 'upload' ? resumeText : ''
    );
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

  const selectedResume = resumes.find(r => r._id === selectedResumeId);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {!analysisResult ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 text-left">
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">Skill Gap Analyzer</h1>
              <p className="text-gray-600">
                Compare your current resume against a target job description to discover missing skills, get a personalized learning roadmap, and see what you can add right now.
              </p>
            </div>

            <div className="space-y-8 max-w-3xl mx-auto">
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
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <FileText size={18} className="text-violet-500" /> 1. Select Your Resume
                  </label>
                  {fetchingResumes ? (
                    <div className="animate-pulse h-12 bg-gray-100 rounded-lg"></div>
                  ) : (
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
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
                  {selectedResume && (
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg mt-2 flex flex-wrap gap-2">
                      <span className="text-xs font-semibold text-blue-800 uppercase w-full mb-1">Current Skills on Resume:</span>
                      {selectedResume.skills?.map((s, i) => (
                        <span key={i} className="text-xs bg-white text-blue-700 border border-blue-200 px-2 py-1 rounded-md">
                          {s.name}
                        </span>
                      ))}
                      {(!selectedResume.skills || selectedResume.skills.length === 0) && (
                        <span className="text-xs text-blue-600 italic">No skills listed</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* New Upload Flow */}
              {inputMode === 'upload' && (
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Upload size={18} className="text-violet-500" /> 1. Upload Your Resume (PDF only, max 5MB)
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

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Target size={18} className="text-violet-500" /> 2. Paste Target Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="w-full min-h-[200px] p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 text-sm leading-relaxed text-left"
                  dir="ltr"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={
                  loading || 
                  !jobDescription.trim() ||
                  (inputMode === 'existing' && !selectedResumeId) ||
                  (inputMode === 'upload' && !resumeText)
                }
                className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
                {loading ? 'Analyzing...' : 'Analyze Gaps'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-800">Analysis Results</h1>
              <button 
                onClick={() => analyzeGap(
                  inputMode === 'existing' ? selectedResumeId : null,
                  jobDescription,
                  false,
                  inputMode === 'upload' ? resumeText : ''
                )} 
                disabled={loading}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-violet-600 transition-colors"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Re-analyze
              </button>
            </div>

            <SkillBuckets analysis={analysisResult} />

            {analysisResult.missingSkills && analysisResult.missingSkills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-left">Prioritized Gap List</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysisResult.missingSkills.map((skill, i) => (
                    <GapCard key={i} missingSkill={skill} />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LearningRoadmap roadmap={analysisResult.roadmap} />
              <ResumeSuggestions suggestions={analysisResult.resumeSuggestions} resumeId={inputMode === 'existing' ? selectedResumeId : null} />
            </div>

            <div className="mt-12 text-center">
               <button 
                onClick={() => window.location.reload()} 
                className="flex items-center gap-2 mx-auto text-violet-600 font-medium hover:text-violet-800 transition-colors bg-violet-50 px-6 py-3 rounded-full"
              >
                <ChevronLeft size={20} /> Analyze Another Job
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SkillGap;
