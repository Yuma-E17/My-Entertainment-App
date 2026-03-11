// src/components/common/StarRating.jsx

import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ value, onRate, interactive = false }) => {
  if (interactive) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative flex items-center">
            <button
              onClick={() => onRate(star)}
              className="absolute inset-0 z-10 cursor-pointer"
              aria-label={`Rate ${star} stars`}
            />
            <Star
              size={18}
              className={star <= value ? "text-yellow-400 fill-current" : "text-white/10"}
            />
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm font-black">{value}</span>
        <Star size={14} className="text-yellow-400 fill-current" />
      </div>
    );
  }
};