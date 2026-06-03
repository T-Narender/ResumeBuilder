import React from 'react';

const SkillBuckets = ({ analysis }) => {
  if (!analysis) return null;

  const { matchPercentage, hasSkills, missingSkills, partialSkills } = analysis;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-8 items-center border-b pb-6 mb-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="text-violet-600"
              strokeDasharray={`${matchPercentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{matchPercentage}%</span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Skill Match Overview</h2>
          <p className="text-gray-600">Based on the job description, here is how your current skills align with the requirements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {/* Has Skills */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            You Have These
          </h3>
          <div className="flex flex-wrap gap-2">
            {hasSkills?.map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
                {skill}
              </span>
            ))}
            {(!hasSkills || hasSkills.length === 0) && <span className="text-sm text-green-600 italic">None matched</span>}
          </div>
        </div>

        {/* Partial Skills */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Needs Improvement
          </h3>
          <div className="flex flex-col gap-2">
            {partialSkills?.map((item, i) => (
              <div key={i} className="text-sm">
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-md mr-2 inline-block mb-1">
                  {item.skill}
                </span>
                <span className="text-amber-700 text-xs">{item.gap}</span>
              </div>
            ))}
            {(!partialSkills || partialSkills.length === 0) && <span className="text-sm text-amber-600 italic">None found</span>}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingSkills?.map((item, i) => (
              <span key={i} className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-md">
                {item.skill}
              </span>
            ))}
            {(!missingSkills || missingSkills.length === 0) && <span className="text-sm text-red-600 italic">None missing!</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillBuckets;
