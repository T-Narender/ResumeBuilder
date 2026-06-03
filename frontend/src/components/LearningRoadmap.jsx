import React from 'react';
import { ExternalLink, PlayCircle, Book, Code } from 'lucide-react';

const getResourceIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'course': return <PlayCircle size={14} />;
    case 'book': return <Book size={14} />;
    case 'project': return <Code size={14} />;
    default: return <ExternalLink size={14} />;
  }
};

const LearningRoadmap = ({ roadmap }) => {
  if (!roadmap || roadmap.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 text-left">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Roadmap</h2>
      
      <div className="relative border-l-2 border-violet-200 ml-3 md:ml-4 space-y-8">
        {roadmap.map((phase, i) => (
          <div key={i} className="relative pl-6 md:pl-8">
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-violet-500"></span>
            
            <div className="mb-1">
              <span className="inline-block px-2 py-1 bg-violet-100 text-violet-800 text-xs font-bold rounded-md mb-2">
                {phase.week}
              </span>
              <h3 className="text-lg font-bold text-gray-800">{phase.focus}</h3>
              <p className="text-sm text-gray-500 mt-1">Suggested time: {phase.dailyHours} hours/day</p>
            </div>

            <div className="mt-4 space-y-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resources to Use</h4>
              {phase.resources?.map((res, j) => (
                <a 
                  key={j} 
                  href={res.url !== '#' ? res.url : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-violet-50 hover:border-violet-200 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-violet-500 bg-violet-100 p-2 rounded-md">
                      {getResourceIcon(res.type)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-violet-700 transition-colors">
                        {res.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{res.type}</p>
                    </div>
                  </div>
                  {res.url && res.url !== '#' && <ExternalLink size={14} className="text-gray-400 group-hover:text-violet-500" />}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningRoadmap;
