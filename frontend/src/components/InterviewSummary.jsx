import React, { useState } from 'react';
import { Trophy, RefreshCcw, ArrowRight, ChevronDown, ChevronUp, CheckCircle2, XCircle, Clock, ShieldAlert, FileText, Target, Award, ShieldCheck, Keyboard, Code, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScoreCard = ({ title, score, icon: Icon, colorClass }) => (
  <div className={`bg-white rounded-xl border p-5 flex flex-col items-center justify-center text-center shadow-sm ${colorClass}`}>
    <div className="mb-3 opacity-80"><Icon size={28} /></div>
    <span className="text-sm font-bold uppercase tracking-wider mb-1 opacity-70">{title}</span>
    <div className="text-3xl font-black">
      {score !== undefined ? score : '--'}<span className="text-lg opacity-50">{score !== undefined ? (title.includes('Score') ? '/10' : '%') : ''}</span>
    </div>
  </div>
);

const InterviewSummary = ({ answers, report, integrityMetrics, onPracticeAgain }) => {
  const navigate = useNavigate();
  const [openAccordion, setOpenAccordion] = useState(null);
  
  if (!answers || answers.length === 0) return null;

  // Fallback for backward compatibility (older sessions without report)
  const isLegacy = !report;
  
  const totalLegacyScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
  const avgScore = isLegacy ? Math.round((totalLegacyScore / answers.length) * 10) / 10 : report.overallScore;

  const getOverallColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreColorClass = (score, isPercentage = false) => {
    const threshold = isPercentage ? 80 : 8;
    const midThreshold = isPercentage ? 50 : 5;
    if (score === undefined) return 'text-gray-500 border-gray-200 bg-gray-50';
    if (score >= threshold) return 'text-green-700 border-green-200 bg-green-50';
    if (score >= midThreshold) return 'text-orange-700 border-orange-200 bg-orange-50';
    return 'text-red-700 border-red-200 bg-red-50';
  };

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // Combine data safely (legacy answers array vs report evaluations array)
  const evaluations = isLegacy ? answers : (report.evaluations || answers);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left pb-12">
      
      {/* Header & Overall Score */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500"></div>
        <div className="w-20 h-20 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} />
        </div>
        <h1 className="text-4xl font-black text-gray-800 mb-2">Interview Report</h1>
        <p className="text-gray-500 mb-8">Comprehensive analysis of your interview performance.</p>
        
        <div className="flex flex-col items-center justify-center mb-8">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Overall Score</span>
          <div className={`text-7xl font-black ${getOverallColor(avgScore)} drop-shadow-sm`}>
            {avgScore}<span className="text-4xl text-gray-300">/10</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          {onPracticeAgain && (
            <button 
              onClick={onPracticeAgain}
              className="px-8 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <RefreshCcw size={18} /> Practice Again
            </button>
          )}
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            Back to Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Premium Score Grid */}
      {!isLegacy && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <ScoreCard title="Technical Score" score={report.technicalScore} icon={Code} colorClass={getScoreColorClass(report.technicalScore)} />
          <ScoreCard title="Communication Score" score={report.communicationScore} icon={Users} colorClass={getScoreColorClass(report.communicationScore)} />
          <ScoreCard title="Confidence Score" score={report.confidenceScore} icon={Target} colorClass={getScoreColorClass(report.confidenceScore)} />
          <ScoreCard title="Integrity Score" score={report.integrityScore} icon={ShieldCheck} colorClass={getScoreColorClass(report.integrityScore, true)} />
          <ScoreCard title="Fluency Score" score={report.typingFluencyScore} icon={Keyboard} colorClass={getScoreColorClass(report.typingFluencyScore, true)} />
        </div>
      )}

      {/* Overall Feedback */}
      {report?.overallFeedback && (
        <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl shadow-sm border border-violet-100 p-8">
          <h2 className="text-xl font-bold text-violet-900 mb-4 flex items-center gap-2">
            <FileText size={24} /> Overall Feedback
          </h2>
          <p className="text-violet-800 leading-relaxed text-lg" dir="ltr">{report.overallFeedback}</p>
        </div>
      )}

      {/* Integrity Metrics Summary */}
      {integrityMetrics && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShieldAlert size={24} className="text-orange-500" /> Integrity Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="text-2xl font-black text-gray-700">{integrityMetrics.tabSwitchCount}</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Tab Switches</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="text-2xl font-black text-gray-700">{integrityMetrics.fullscreenExitCount}</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">FS Exits</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="text-2xl font-black text-gray-700">{integrityMetrics.copyAttempts}</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Copy</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="text-2xl font-black text-gray-700">{integrityMetrics.pasteAttempts}</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Paste</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="text-2xl font-black text-gray-700">{integrityMetrics.cutAttempts}</div>
              <div className="text-xs font-bold text-gray-500 uppercase mt-1">Cut</div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Q&A Accordion */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 px-2">Detailed Q&A Breakdown</h2>
        {evaluations.map((evalItem, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200">
            {/* Accordion Header */}
            <button 
              onClick={() => toggleAccordion(idx)}
              className="w-full text-left p-6 flex items-start justify-between hover:bg-gray-50 transition-colors gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold tracking-wider">
                    Q{idx + 1}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    <Clock size={12} /> {evalItem.timeSpent || 'N/A'}
                  </span>
                  <span className={`text-sm font-bold px-2.5 py-1 rounded-md ${evalItem.score >= 8 ? 'bg-green-100 text-green-700' : evalItem.score >= 5 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    Score: {evalItem.score}/10
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 leading-snug" dir="ltr">{evalItem.question}</h3>
              </div>
              <div className="mt-1 text-gray-400">
                {openAccordion === idx ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
            </button>

            {/* Accordion Body */}
            {openAccordion === idx && (
              <div className="p-6 pt-0 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                
                <div className="mt-6 mb-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Your Answer</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed italic" dir="ltr">
                    "{evalItem.answer}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 rounded-lg p-5 border border-green-100">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle2 size={18} /> Strengths
                    </h4>
                    <ul className="space-y-2">
                      {(evalItem.strengths || evalItem.strongPoints || []).map((pt, i) => (
                        <li key={i} className="text-sm text-green-700 flex items-start gap-2 leading-relaxed">
                          <span className="text-green-500 mt-0.5">•</span> <span dir="ltr">{pt}</span>
                        </li>
                      ))}
                      {(!evalItem.strengths && !evalItem.strongPoints) && <span className="text-sm text-gray-500 italic">No specific strengths listed.</span>}
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-5 border border-orange-100">
                    <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                      <XCircle size={18} /> Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {(evalItem.improvements || []).map((pt, i) => (
                        <li key={i} className="text-sm text-orange-700 flex items-start gap-2 leading-relaxed">
                          <span className="text-orange-500 mt-0.5">•</span> <span dir="ltr">{pt}</span>
                        </li>
                      ))}
                      {(!evalItem.improvements || evalItem.improvements.length === 0) && <span className="text-sm text-gray-500 italic">No specific improvements listed.</span>}
                    </ul>
                  </div>
                </div>

                {/* General Feedback Fallback (for older backend data) */}
                {evalItem.feedback && (!evalItem.strengths && !evalItem.improvements) && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Feedback</h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed" dir="ltr">
                      {evalItem.feedback}
                    </p>
                  </div>
                )}

                {(evalItem.exampleAnswer || evalItem.sampleAnswer) && (
                  <div className="bg-violet-50 rounded-lg p-5 border border-violet-100">
                    <h4 className="font-bold text-violet-900 mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                      <Award size={16} /> Example Strong Answer
                    </h4>
                    <p className="text-sm text-violet-800 leading-relaxed" dir="ltr">
                      "{evalItem.exampleAnswer || evalItem.sampleAnswer}"
                    </p>
                  </div>
                )}

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewSummary;
