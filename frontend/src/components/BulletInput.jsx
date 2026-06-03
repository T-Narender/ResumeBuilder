import React from 'react';
import { useBulletImprover } from '../hooks/useBulletImprover';
import { Sparkles, Check, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const BulletInput = ({ value, onChange, jobTitle, onRemove }) => {
  const { 
    loading, 
    currentSuggestion, 
    totalSuggestions, 
    currentIndex, 
    improveBullet, 
    nextSuggestion, 
    prevSuggestion, 
    clearSuggestions 
  } = useBulletImprover();

  const handleImprove = (e) => {
    e.preventDefault();
    improveBullet(value, jobTitle);
  };

  const handleAccept = (e) => {
    e.preventDefault();
    if (currentSuggestion) {
      onChange(currentSuggestion.improved);
      clearSuggestions();
    }
  };

  const handleDiscard = (e) => {
    e.preventDefault();
    clearSuggestions();
  }

  return (
    <div className="mb-2">
      <div className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-h-[40px] p-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-left"
          rows={2}
          placeholder="e.g. Developed a new feature..."
          dir="ltr"
        />
        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={handleImprove}
            disabled={loading || !value.trim()}
            className="px-3 py-1.5 h-[34px] bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 disabled:opacity-50 text-sm flex items-center justify-center gap-1 font-medium transition-colors"
            title="Improve with AI"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Improve
          </button>
          {onRemove && (
            <button 
               onClick={(e) => { e.preventDefault(); onRemove(); }} 
               className="px-3 py-1.5 h-[34px] text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors flex items-center justify-center"
               title="Remove bullet point"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {currentSuggestion && (
        <div className="mt-2 p-3 bg-violet-50 border border-violet-200 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-violet-700">AI Suggestion</span>
            <div className="flex gap-2 items-center text-xs text-violet-600">
              {totalSuggestions > 1 && (
                <>
                  <button onClick={(e) => { e.preventDefault(); prevSuggestion(); }} className="hover:text-violet-800 p-1"><ChevronLeft size={14}/></button>
                  <span className="font-medium">{currentIndex + 1} / {totalSuggestions}</span>
                  <button onClick={(e) => { e.preventDefault(); nextSuggestion(); }} className="hover:text-violet-800 p-1"><ChevronRight size={14}/></button>
                </>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-800 mb-2 text-left font-medium" dir="ltr">{currentSuggestion.improved}</p>
          <p className="text-xs text-violet-600 italic mb-3 text-left" dir="ltr">Why: {currentSuggestion.explanation}</p>
          
          <div className="flex gap-2">
            <button 
              onClick={handleAccept}
              className="flex-1 flex justify-center items-center gap-1 bg-violet-600 text-white py-1.5 rounded-md text-xs font-medium hover:bg-violet-700 transition-colors"
            >
              <Check size={14} /> Accept
            </button>
            <button 
              onClick={handleDiscard}
              className="flex-1 flex justify-center items-center gap-1 bg-white border border-gray-300 text-gray-700 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <X size={14} /> Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulletInput;
