import React from 'react';
import { ChevronRight, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const AnswerEvaluator = ({ 
  questionId,
  localAnswers,
  setLocalAnswers,
  onNext, 
  isLastQuestion,
  recordKeystroke,
  recordCopyAttempt,
  recordPasteAttempt,
  recordCutAttempt,
  loading
}) => {
  
  const answer = localAnswers[questionId] || '';

  const handleKeyDown = (e) => {
    // 1. Typing Analytics
    if (recordKeystroke) {
      recordKeystroke(e.key);
    }

    // 2. Prevent Keyboard Shortcuts (Ctrl+C, Ctrl+V, Ctrl+X, Cmd equivalents)
    const isModifier = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    if (isModifier && key === 'c') {
      e.preventDefault();
      recordCopyAttempt?.();
      toast.error('Copying is disabled during the interview.', { id: 'copy-toast' });
    }
    if (isModifier && key === 'v') {
      e.preventDefault();
      recordPasteAttempt?.();
      toast.error('Pasting is disabled during the interview.', { id: 'paste-toast' });
    }
    if (isModifier && key === 'x') {
      e.preventDefault();
      recordCutAttempt?.();
      toast.error('Cutting is disabled during the interview.', { id: 'cut-toast' });
    }
  };

  // 3. Prevent Context Menu (Right Click)
  const handleContextMenu = (e) => {
    e.preventDefault();
    toast.error('Right-click is disabled during the interview.', { id: 'context-toast' });
  };

  // 4. Prevent Native Copy/Paste/Cut Events (Catch-all)
  const handleCopy = (e) => {
    e.preventDefault();
    recordCopyAttempt?.();
    toast.error('Copying is disabled during the interview.', { id: 'copy-toast' });
  };

  const handlePaste = (e) => {
    e.preventDefault();
    recordPasteAttempt?.();
    toast.error('Pasting is disabled during the interview.', { id: 'paste-toast' });
  };

  const handleCut = (e) => {
    e.preventDefault();
    recordCutAttempt?.();
    toast.error('Cutting is disabled during the interview.', { id: 'cut-toast' });
  };

  const handleChange = (e) => {
    setLocalAnswers(prev => ({ ...prev, [questionId]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="mt-6 text-left">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Your Answer</label>
          <textarea
            value={answer}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onContextMenu={handleContextMenu}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onCut={handleCut}
            placeholder="Type your answer here... (Copy/Paste disabled)"
            className="w-full min-h-[200px] p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 text-sm leading-relaxed resize-y"
            dir="ltr"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !answer.trim()}
          className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : (isLastQuestion ? <Send size={20} /> : <ChevronRight size={20} />)}
          {loading ? 'Processing...' : (isLastQuestion ? 'Submit Interview' : 'Next Question')}
        </button>
      </form>
    </div>
  );
};

export default AnswerEvaluator;
