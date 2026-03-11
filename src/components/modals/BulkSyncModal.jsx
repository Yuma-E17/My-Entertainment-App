// src/components/modals/BulkSyncModal.jsx

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { isMissingMetadata } from '../../utils/helpers';

export const BulkSyncModal = ({ series, onClose, onStart }) => {
  const missing = series.filter(s => isMissingMetadata(s));
  const [selected, setSelected] = useState(() => new Set(missing.map(s => s.id)));

  const toggleAll = () => {
    if (selected.size === missing.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(missing.map(s => s.id)));
    }
  };

  const toggleItem = (id) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelected(newSet);
  };

  const handleStart = () => {
    const selectedSeries = series.filter(s => selected.has(s.id));
    onStart(selectedSeries);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-10">
      <div className="w-full max-w-2xl bg-[#0a0c10] border border-white/10 rounded-[3rem] p-10 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-black italic">Bulk Sync</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
            <X size={24} />
          </button>
        </div>
        <p className="text-white/40 text-xs mb-6">
          Select series missing metadata to sync.
        </p>

        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={toggleAll}
            className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300"
          >
            {selected.size === missing.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-white/30 text-xs">
            {selected.size} of {missing.length} selected
          </span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {missing.map(item => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                selected.has(item.id)
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center ${
                  selected.has(item.id) ? 'bg-blue-500 border-blue-500' : 'border-white/30'
                }`}
              >
                {selected.has(item.id) && <Check size={14} className="text-white" />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs text-white/40">{item.type} • {item.status}</p>
              </div>
              {item.image && <img src={item.image} className="w-10 h-12 object-cover rounded" alt="" />}
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleStart}
            disabled={selected.size === 0}
            className="flex-1 py-5 rounded-2xl bg-blue-500 text-black font-black text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all"
          >
            START SYNC ({selected.size})
          </button>
          <button
            onClick={onClose}
            className="px-8 py-5 rounded-2xl bg-white/5 text-white/40 font-black text-[11px] tracking-widest hover:bg-white/10 transition-all"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};