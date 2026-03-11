import React, { useState, useRef } from 'react';
import { X, Palette, Download, Upload, RotateCcw, Key, Layout, Tag } from 'lucide-react';
import { THEMES } from '../../utils/constants';

export const SettingsModal = ({
  settings,
  setSettings,
  onClose,
  onExport,
  onImport,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const fileInputRef = useRef();

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data', icon: Download },
    { id: 'keyboard', label: 'Shortcuts', icon: Key },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'statuses', label: 'Statuses', icon: Tag },
  ];

  const handleThemeChange = (themeId) => {
    setSettings({ ...settings, theme: themeId });
  };

  const handleCustomColor = (e) => {
    setSettings({ ...settings, customAccent: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-10">
      <div className="w-full max-w-4xl bg-[#0a0c10] border border-white/10 rounded-[3rem] overflow-hidden flex">
        <div className="w-64 bg-black/40 p-6 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all ${
                activeTab === tab.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 p-10 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black italic">Settings</h2>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
              <X size={24} />
            </button>
          </div>

          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <div>
                <label className="text-xs font-black text-white/30 uppercase tracking-widest block mb-4">Theme Presets</label>
                <div className="grid grid-cols-3 gap-4">
                  {Object.values(THEMES).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        settings.theme === t.id ? 'border-white bg-white/10' : 'border-transparent opacity-50 hover:opacity-100 hover:bg-white/5'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: t.accent }} />
                      <span className="text-[9px] font-black uppercase">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-white/30 uppercase tracking-widest block mb-4">Custom Accent</label>
                <input
                  type="color"
                  value={settings.customAccent || THEMES[settings.theme]?.accent}
                  onChange={handleCustomColor}
                  className="w-full h-12 rounded-xl bg-transparent border border-white/10"
                />
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <button onClick={onExport} className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 text-xs font-black uppercase tracking-widest">
                <Download size={18} /> Export Data
              </button>
              <button onClick={() => fileInputRef.current.click()} className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 text-xs font-black uppercase tracking-widest">
                <Upload size={18} /> Import Data
              </button>
              <input type="file" ref={fileInputRef} onChange={onImport} accept=".json" className="hidden" />
              <button onClick={onReset} className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-xs font-black uppercase tracking-widest">
                <RotateCcw size={18} /> Reset to Default
              </button>
            </div>
          )}

          {activeTab === 'keyboard' && (
            <div className="space-y-4">
              <h3 className="text-lg font-black mb-4">Keyboard Shortcuts</h3>
              <div className="space-y-2 text-sm">
                <p><kbd className="px-2 py-1 bg-white/10 rounded">Ctrl+K</kbd> – Focus search</p>
                <p><kbd className="px-2 py-1 bg-white/10 rounded">N</kbd> – New series</p>
                <p><kbd className="px-2 py-1 bg-white/10 rounded">E</kbd> – Edit selected</p>
                <p><kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd> – Close modal</p>
                <p><kbd className="px-2 py-1 bg-white/10 rounded">?</kbd> – Show help</p>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-6">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Show progress bars on cards</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.showProgressBars}
                    onChange={(e) => setSettings({ ...settings, showProgressBars: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${settings.showProgressBars ? 'bg-blue-500' : 'bg-white/20'}`} />
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settings.showProgressBars ? 'translate-x-6' : ''}`} />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Wide cards with splash art</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.wideLayout}
                    onChange={(e) => setSettings({ ...settings, wideLayout: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${settings.wideLayout ? 'bg-blue-500' : 'bg-white/20'}`} />
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settings.wideLayout ? 'translate-x-6' : ''}`} />
                </div>
              </label>
            </div>
          )}

          {activeTab === 'statuses' && (
            <div className="space-y-4">
              <h3 className="text-lg font-black">Custom Statuses</h3>
              <div className="space-y-2">
                {settings.customStatuses?.map((status, idx) => (
                  <div key={status.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                    <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: status.color + '20', color: status.color }}>
                      {status.label}
                    </span>
                    <button
                      onClick={() => {
                        const newStatuses = settings.customStatuses.filter((_, i) => i !== idx);
                        setSettings({ ...settings, customStatuses: newStatuses });
                      }}
                      className="ml-auto text-red-400 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Status label"
                  className="flex-1 p-2 bg-white/5 rounded-lg border border-white/10 text-sm"
                  id="newStatusLabel"
                />
                <input
                  type="color"
                  className="w-10 h-10 p-1 bg-white/5 rounded-lg border border-white/10"
                  id="newStatusColor"
                  defaultValue="#ffffff"
                />
                <button
                  onClick={() => {
                    const label = document.getElementById('newStatusLabel').value;
                    const color = document.getElementById('newStatusColor').value;
                    if (!label) return;
                    const newStatus = { id: Date.now(), label, color };
                    setSettings({ ...settings, customStatuses: [...(settings.customStatuses || []), newStatus] });
                    document.getElementById('newStatusLabel').value = '';
                  }}
                  className="px-4 py-2 bg-blue-500 text-black rounded-lg text-sm font-black"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};