import React from 'react';
import { AlertCircle, Clock, BookOpen } from 'lucide-react';

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'intermediate': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const GapCard = ({ missingSkill }) => {
  const { skill, importance, learningTime, difficulty } = missingSkill;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow text-left">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-800">{skill}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${getDifficultyColor(difficulty)}`}>
          {difficulty || 'Unknown'}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 flex gap-2 items-start">
        <AlertCircle size={16} className="text-violet-500 shrink-0 mt-0.5" />
        <span>{importance}</span>
      </p>

      <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-gray-400" />
          <span>Est. Time: {learningTime}</span>
        </div>
      </div>
    </div>
  );
};

export default GapCard;
