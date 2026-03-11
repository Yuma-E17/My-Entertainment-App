// src/components/modals/SearchModal.jsx

import React from 'react';
import { X, RefreshCw } from 'lucide-react';

export const SearchModal = ({ results, searching, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-10">
      <div className="bg-[#0a0c10] border border-white/10 rounded-[3rem] p-10 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black italic">Select correct title</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
            <X size={24} />
          </button>
        </div>
        {searching ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="animate-spin" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map((res, idx) => (
              <div
                key={idx}
                onClick={() => onSelect(res)}
                className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 cursor-pointer flex gap-4"
              >
                {res.image && <img src={res.image} className="w-16 h-20 object-cover rounded" alt="" />}
                <div className="flex-1">
                  <p className="font-bold text-sm">{res.title}</p>
                  <p className="text-xs text-white/60 line-clamp-2">{res.description?.slice(0, 100)}</p>
                  {res.genres && res.genres.length > 0 && (
                    <p className="text-[10px] text-white/40 mt-1">{res.genres.slice(0, 3).join(', ')}</p>
                  )}
                  <p className="text-[10px] text-white/40 mt-1">Source: {res.sourceApi}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};