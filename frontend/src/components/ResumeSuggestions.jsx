import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileEdit, ArrowRight } from 'lucide-react';

const ResumeSuggestions = ({ suggestions, resumeId }) => {
  const navigate = useNavigate();

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 text-left">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Resume Wins</h2>
      <p className="text-gray-600 mb-6">
        Based on the skills you already have, we suggest making these updates to your resume to better match the job description.
      </p>

      <div className="space-y-4">
        {suggestions.map((sug, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 rounded-lg bg-blue-50 border border-blue-100">
            <div>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded uppercase tracking-wider mb-2">
                Section: {sug.section}
              </span>
              <p className="text-sm text-gray-800 font-medium">{sug.suggestion}</p>
            </div>
            
            <button 
              onClick={() => navigate(`/edit-resume/${resumeId}`)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white text-blue-700 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
            >
              <FileEdit size={16} /> Edit Resume <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeSuggestions;
