// src/components/dashboard/StatsCards.jsx

import React from 'react';
import { StatsCard } from '../cards/StatsCard';
import { Library, Play, Check, Heart } from 'lucide-react';

export const StatsCards = ({ series, accentColor }) => {
  const stats = [
    { label: 'TOTAL SERIES', value: series.length, icon: Library },
    { label: 'CURRENTLY ACTIVE', value: series.filter(s => s.status === 'watching').length, icon: Play },
    { label: 'FINISHED LIST', value: series.filter(s => s.status === 'completed').length, icon: Check },
    { label: 'TOP FAVORITES', value: series.filter(s => s.isFavorite).length, icon: Heart }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, i) => (
        <StatsCard key={i} {...stat} accentColor={accentColor} />
      ))}
    </div>
  );
};