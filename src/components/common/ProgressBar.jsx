// src/components/common/ProgressBar.jsx

import React from 'react';

export const ProgressBar = ({ progress, accentColor }) => {
  return (
    <div className="w-full h-1 bg-white/10 rounded-full mt-2">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: accentColor }}
      />
    </div>
  );
};