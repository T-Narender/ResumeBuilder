import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, AlertCircle, Code, Users, Clock } from 'lucide-react';

const getTypeIcon = (type) => {
  switch(type?.toLowerCase()) {
    case 'technical': return <Code size={16} />;
    case 'behavioural': return <Users size={16} />;
    case 'situational': return <AlertCircle size={16} />;
    default: return <HelpCircle size={16} />;
  }
};

const getTypeColor = (type) => {
  switch(type?.toLowerCase()) {
    case 'technical': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'behavioural': return 'bg-green-100 text-green-700 border-green-200';
    case 'situational': return 'bg-orange-100 text-orange-700 border-orange-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const QuestionCard = ({ question, index, total, startTime }) => {
  const [showHint, setShowHint] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    
    // Initial sync
    setElapsed(Math.floor((Date.now() - startTime) / 1000));
    
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!question) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 text-left">
      <div className="flex justify-between items-start mb-6">
        <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md border uppercase tracking-wider ${getTypeColor(question.type)}`}>
          {getTypeIcon(question.type)} {question.type || 'Question'}
        </span>
        <div className="flex flex-col items-end gap-2">
          <span className="text-sm font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            Question {index + 1} of {total}
          </span>
          {startTime && (
            <span className="text-sm font-mono font-bold text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-200 flex items-center gap-2 shadow-sm">
              <Clock size={16} className="text-violet-500" />
              {formatTime(elapsed)}
            </span>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-tight" dir="ltr">
        {question.question}
      </h2>

      {question.hint && (
        <div className="mt-4">
          <button 
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800 font-medium transition-colors"
          >
            {showHint ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          
          {showHint && (
            <div className="mt-3 p-4 bg-violet-50 border border-violet-100 rounded-lg text-sm text-gray-700 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300 text-left" dir="ltr">
              <strong className="text-violet-800">💡 Hint:</strong> {question.hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
