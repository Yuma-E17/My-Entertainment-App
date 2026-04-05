import React from 'react';
import { LayoutGrid, Play, Bookmark, Check, Ban, Heart, Plus, RefreshCw, Palette, Library, Layers, LogOut } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, onNewSeries, onBulkSync, onOpenSettings, onClose, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutGrid },
    { id: 'all', label: 'ALL SERIES', icon: Layers },
    { id: 'watching', label: 'ACTIVE', icon: Play },
    { id: 'planned', label: 'PLANNED', icon: Bookmark },
    { id: 'completed', label: 'FINISHED', icon: Check },
    { id: 'dropped', label: 'DROPPED', icon: Ban },
    { id: 'favorites', label: 'FAVORITES', icon: Heart },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <aside className="w-[280px] h-screen bg-black/40 border-r border-white/5 flex flex-col pt-12 px-8 backdrop-blur-2xl shrink-0 fixed top-0 left-0 z-50">
      <div className="flex items-center gap-4 mb-14">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl" style={{ backgroundColor: `#3b82f620`, color: '#3b82f6', border: '1px solid #3b82f640' }}>
          <Library size={24} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[11px] font-black italic tracking-widest text-white/90 whitespace-nowrap">MyEntertainmentList</h1>
          <span className="text-[15px] font-black text-white/30 tracking-[0.2em]">M E L</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-hide min-h-0 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
              activeTab === item.id ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={18} style={{ color: activeTab === item.id ? '#3b82f6' : 'inherit' }} />
            <span className="text-[11px] font-black tracking-widest uppercase">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="py-6 space-y-4 border-t border-white/5 flex-shrink-0">
        <button
          onClick={onNewSeries}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-[20px] bg-white text-black font-black text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={18} strokeWidth={3} /> NEW SERIES
        </button>
        <button
          onClick={onBulkSync}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-[20px] bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-[10px] font-black tracking-widest transition-colors border border-blue-500/20"
        >
          <RefreshCw size={16} /> BULK SYNC
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-[20px] bg-white/5 text-[10px] font-black text-white/30 hover:text-white tracking-widest transition-colors"
        >
          <Palette size={16} /> SETTINGS
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-[20px] bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[10px] font-black tracking-widest transition-colors border border-red-500/20"
        >
          <LogOut size={16} /> SIGN OUT
        </button>
      </div>
    </aside>
  );
};