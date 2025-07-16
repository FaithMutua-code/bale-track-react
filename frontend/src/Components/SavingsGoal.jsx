import React from 'react';

const SavingsGoal = ({ title, current, target }) => {
  const percentage = Math.round((current / target) * 100);
  
  return (
    <div className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
      <h3 className="text-xs md:text-sm font-semibold text-dark dark:text-white mb-2">{title}</h3>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-1">
        <div 
          className="bg-primary h-2 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Ksh {current.toLocaleString()}</span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
};

export default SavingsGoal;