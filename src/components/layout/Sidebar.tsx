import React from 'react';
import { 
  LayoutDashboard, 
  GitFork, 
  ShieldAlert, 
  Activity, 
  Wrench, 
  FileText, 
  Settings, 
  Sliders, 
  Server, 
  Radio, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenDemoGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  onOpenDemoGuide,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: undefined },
    { id: 'graph', label: 'Dependency Graph', icon: GitFork, badge: 'Live' },
    { id: 'risk-intelligence', label: 'Risk Intelligence', icon: ShieldAlert, badge: '7 Critical' },
    { id: 'ripple-simulator', label: 'Ripple Simulator', icon: Activity, badge: 'Simulate' },
    { id: 'mitigation-center', label: 'Mitigation Center', icon: Wrench, badge: '-66% ROI' },
    { id: 'reports', label: 'Reports', icon: FileText, badge: undefined },
  ];

  return (
    <aside className="w-64 bg-[#0B111A] border-r border-[#263244] flex flex-col justify-between shrink-0 select-none z-30">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#263244] flex items-center gap-3">
          {/* Logo: Shield intersected by dependency graph/ripple */}
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#070B12] rounded-[7px] flex items-center justify-center relative overflow-hidden">
              {/* Geometric shield mark */}
              <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" />
                {/* Intersecting ripple nodes */}
                <circle cx="12" cy="11" r="2.5" fill="#3B82F6" stroke="#22D3EE" strokeWidth="1.2" />
                <path d="M8 8l4 3 4-3" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 13.5v3.5" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm tracking-wider text-slate-100">
                RIPPLESHIELD
              </span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 block font-semibold">
              Supply Chain Intelligence
            </span>
          </div>
        </div>

        {/* Philosophy tag snippet */}
        <div className="mx-3 my-3 p-2.5 rounded bg-[#111925] border border-[#263244] text-[11px] font-mono text-slate-400">
          <span className="text-slate-200 font-semibold block text-[10px] tracking-wide text-cyan-300">
            CONSEQUENCE ENGINE
          </span>
          <span className="text-[10px] text-slate-400">
            "See the dependency. Predict the ripple. Break the chain."
          </span>
        </div>

        {/* Primary Navigation */}
        <nav className="px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const isSimulator = item.id === 'ripple-simulator';

            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#151E2B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    } ${isSimulator && isActive ? 'animate-pulse' : ''}`}
                  />
                  <span className={isActive ? 'font-semibold text-slate-100' : ''}>
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded tracking-wider font-semibold ${
                      isSimulator
                        ? 'bg-red-950/60 border border-red-500/40 text-red-300'
                        : isActive
                        ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300'
                        : 'bg-[#192333] border border-[#263244] text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom Section */}
      <div className="p-3 border-t border-[#263244] space-y-2.5">
        {/* Guided Demo Button */}
        {onOpenDemoGuide && (
          <button
            onClick={onOpenDemoGuide}
            className="w-full py-2 px-2.5 rounded bg-gradient-to-r from-blue-900/40 to-cyan-900/30 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 text-xs font-mono font-medium flex items-center justify-between transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="text-[11px]">8-Step Demo Flow</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        )}

        {/* System Status Indicator */}
        <div className="p-2 rounded bg-[#070B12] border border-[#263244] flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 text-[10px]">Graph Engine</span>
          </div>
          <span className="text-emerald-400 text-[10px] font-semibold">184 Nodes Sync</span>
        </div>

        {/* Settings button */}
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
            activeView === 'settings'
              ? 'bg-[#151E2B] text-slate-100 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#151E2B]'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </button>

        {/* User Profile */}
        <div className="pt-2 border-t border-[#263244]/80 flex items-center gap-2.5 px-1">
          <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400/40 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold">
            RS
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-200 truncate">SecOps Lead</p>
            <p className="text-[10px] text-slate-500 truncate font-mono">secops@enterprise.internal</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
