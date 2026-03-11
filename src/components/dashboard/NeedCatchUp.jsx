// src/components/dashboard/NeedCatchUp.jsx

import React from 'react';
import { SeriesCard } from '../cards/SeriesCard';
import { isUpToDate } from '../../utils/helpers';

export const NeedCatchUp = ({ series, accentColor, settings, onEdit }) => {
  const needCatchUp = series
    .filter(s => s.status === 'watching' && !isUpToDate(s))
    .slice(0, 4);

  if (needCatchUp.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8" style={{ color: accentColor }}>
        Need to Catch Up
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {needCatchUp.map(item => (
          <SeriesCard
            key={item.id}
            item={item}
            accentColor={accentColor}
            settings={settings}
            onClick={() => onEdit(item)}
          />
        ))}
      </div>
    </div>
  );
};