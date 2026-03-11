// src/components/cards/StatsCard.jsx

import React from 'react';

export const StatsCard = ({ icon: Icon, label, value, accentColor }) => {
  return (
    <div className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group hover:-translate-y-1">
      <Icon size={24} className="mb-8 opacity-20 group-hover:opacity-100 transition-opacity" style={{ color: accentColor }} />
      <p className="text-5xl font-black italic tracking-tighter">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-2">{label}</p>
    </div>
  );
};