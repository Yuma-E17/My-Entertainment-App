import React from 'react';
import { Clock } from 'lucide-react'; // <-- ADD THIS

export const ActivityLog = ({ log, accentColor }) => {
  if (log.length === 0) return null;
  return (
    <div className="mt-16">
      <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8" style={{ color: accentColor }}>
        Recent Activity
      </h3>
      <div className="space-y-2">
        {log.slice(0, 10).map(entry => (
          <div key={entry.id} className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center gap-3">
            <Clock size={16} className="text-white/30" />
            <span className="text-sm">{entry.action} <span className="font-bold">{entry.seriesTitle}</span></span>
            <span className="text-xs text-white/30 ml-auto">{new Date(entry.timestamp).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};