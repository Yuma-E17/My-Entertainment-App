// src/components/cards/KeyboardHelp.jsx

import React from 'react';
import { X } from 'lucide-react';

export const KeyboardHelp = ({ onClose }) => {
  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Focus search bar' },
    { keys: ['N'], description: 'New series' },
    { keys: ['E'], description: 'Edit selected series' },
    { keys: ['Esc'], description: 'Close any modal' },
    { keys: ['?'], description: 'Show this help' },
  ];

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0a0c10] border border-white/10 rounded-3xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black italic">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {shortcuts.map(({ keys, description }, idx) => (
            <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex gap-2">
                {keys.map((key, i) => (
                  <kbd key={i} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-mono">
                    {key}
                  </kbd>
                ))}
              </div>
              <span className="text-sm text-white/70">{description}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/30 mt-6 text-center">
          Press <kbd className="px-2 py-0.5 bg-white/10 rounded">?</kbd> anytime to reopen
        </p>
      </div>
    </div>
  );
};