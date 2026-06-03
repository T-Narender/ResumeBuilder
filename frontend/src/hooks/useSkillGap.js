import { useState } from 'react';
import toast from 'react-hot-toast';
import { BASE_URL, API_PATHS } from '../utils/apiPath';

export const useSkillGap = () => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeGap = async (resumeId, jobDescription, regenerate = false, resumeText = '') => {
    if ((!resumeId && !resumeText) || !jobDescription.trim()) {
      toast.error('Please select or upload a resume and paste a job description');
      return;
    }

    setLoading(true);
    setAnalysisResult(null);
    try {
      const response = await fetch(`${BASE_URL}${API_PATHS.AI.SKILL_GAP}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: resumeId || undefined,
          resumeText: resumeText || undefined,
          jobDescription,
          regenerate
        }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setAnalysisResult(data);
      } else {
        toast.error(data.message || 'Failed to analyze skill gap');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    analysisResult,
    analyzeGap
  };
};
