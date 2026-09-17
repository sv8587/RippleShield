import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  RefreshCw, 
  UploadCloud, 
  Check, 
  Clock, 
  ShieldAlert, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { GraphNode } from '../../types';

interface TopHeaderProps {
  title: string;
  subtitle: string;
  onOpenUploadSBOM: () => void;
  onSelectNodeByName?: (name: string) => void;
  availableNodes?: GraphNode[];
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  subtitle,
  onOpenUploadSBOM,
  onSelectNodeByName,
  availableNodes = [],
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('Last scan: 2 min ago');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleRunScan = () => {
    setIsScanning(true);
    setScanMessage('Scanning dependencies & KEV...');
    setTimeout(() => {
      setIsScanning(false);
      setScanMessage('Last scan: just now');
    }, 1200);
  };

  const filteredSearchNodes = availableNodes.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 bg-[#0B111A] border-b border-[#263244] px-6 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: Page Title & Context */}
      <div>
        <h1 className="text-base font-bold text-slate-100 font-display tracking-tight flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-slate-400 font-sans">{subtitle}</p>
      </div>

      {/* Right: Actions, Search, Notifications, User */}
      <div className="flex items-center gap-3.5">
        {/* Global Node Quick Search */}
        <div className="relative">
          <div className="flex items-center bg-[#111925] border border-[#263244] rounded-md px-2.5 py-1.5 focus-within:border-blue-500 transition-colors">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search dependency or service..."
              className="bg-transparent text-xs text-slate-200 placeholder-slate-500 w-48 focus:outline-none font-mono"
            />
          </div>

          {/* Autocomplete dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-[#111925] border border-[#263244] rounded-md shadow-2xl z-50 overflow-hidden font-mono text-xs max-h-56 overflow-y-auto">
              {filteredSearchNodes.length > 0 ? (
                filteredSearchNodes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      if (onSelectNodeByName) onSelectNodeByName(n.name);
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#192333] flex items-center justify-between border-b border-[#263244]/50 last:border-0 text-slate-200"
                  >
                    <span>{n.name} <span className="text-[10px] text-slate-400">v{n.version}</span></span>
                    <span className="text-[10px] text-red-400 font-bold">{n.rippleRisk}/100</span>
                  </button>
                ))
              ) : (
                <div className="p-2.5 text-slate-500 text-center text-[11px]">No node matched</div>
              )}
            </div>
          )}
        </div>

        {/* Ingest SBOM Button */}
        <button
          onClick={onOpenUploadSBOM}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#111925] hover:bg-[#151E2B] border border-[#263244] text-xs font-mono font-medium text-cyan-300 hover:border-cyan-500/50 transition-colors"
          title="Upload Software Bill of Materials (SBOM)"
        >
          <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
          <span>Upload SBOM</span>
        </button>

        {/* Scan Status & Refresh button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono bg-[#111925] border border-[#263244] px-2.5 py-1.5 rounded">
            <Clock className="w-3 h-3 text-slate-500" />
            <span className="text-[11px]">{scanMessage}</span>
          </div>

          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold font-mono shadow-sm transition-all"
            title="Execute on-demand dependency supply chain assessment"
          >
            <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Run Scan'}</span>
          </button>
        </div>

        {/* Notifications Icon with popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded bg-[#111925] hover:bg-[#151E2B] border border-[#263244] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0B111A]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111925] border border-[#263244] rounded-lg shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#263244]">
                <span className="font-semibold text-slate-200 font-display">Security Alerts (3)</span>
                <span className="text-[10px] font-mono text-cyan-400 cursor-pointer">Mark read</span>
              </div>
              <div className="space-y-2.5 py-2">
                <div className="p-2 rounded bg-red-950/30 border border-red-500/30 text-slate-200">
                  <div className="flex items-center gap-1 text-red-400 font-bold font-mono text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    CISA KEV Alert: follow-redirects
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Active in-the-wild exploitation. 6 internal applications exposed.
                  </p>
                </div>
                <div className="p-2 rounded bg-[#151E2B] border border-[#263244] text-slate-300">
                  <span className="font-mono text-amber-400 font-semibold block text-[11px]">
                    Deep Transitive Vector: minimist v1.2.5
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Layer 4 prototype pollution affects Checkout & Analytics workers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs font-semibold text-slate-200">
          SA
        </div>
      </div>
    </header>
  );
};
