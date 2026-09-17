import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldAlert, 
  Server, 
  CheckCircle2, 
  Save, 
  Radio, 
  RefreshCw,
  GitBranch
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [epssWeight, setEpssWeight] = useState(40);
  const [depthMultiplier, setDepthMultiplier] = useState(25);
  const [reachWeight, setReachWeight] = useState(35);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-8 max-w-4xl">
      {/* Header */}
      <div className="p-4 rounded-lg bg-[#111925] border border-[#263244]">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-100 font-display flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          SYSTEM CONFIGURATION & CONSEQUENCE WEIGHTS
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Tune algorithmic weights for Ripple Consequence scoring, integration webhooks, and automated scanning schedules.
        </p>
      </div>

      {/* Algorithm Tuning Panel */}
      <div className="p-5 rounded-lg bg-[#111925] border border-[#263244] space-y-5">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold border-b border-[#263244] pb-2">
          Ripple Score Algorithm Parameters
        </h3>

        <div className="space-y-4 font-mono text-xs">
          {/* EPSS Weight */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Exploitability Weight (EPSS & CISA KEV):</span>
              <span className="text-cyan-400 font-bold">{epssWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={epssWeight}
              onChange={(e) => setEpssWeight(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-sans block">
              Prioritizes vulnerabilities with active in-the-wild exploitation activity.
            </span>
          </div>

          {/* Depth Multiplier */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Propagation Depth Multiplier:</span>
              <span className="text-cyan-400 font-bold">{depthMultiplier}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={depthMultiplier}
              onChange={(e) => setDepthMultiplier(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-sans block">
              Penalizes deeply nested transitive components that are harder to inspect and patch.
            </span>
          </div>

          {/* Reach Weight */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Downstream Reach & Blast Radius Weight:</span>
              <span className="text-cyan-400 font-bold">{reachWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={reachWeight}
              onChange={(e) => setReachWeight(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-sans block">
              Scales score with total downstream dependent count and connected revenue services.
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#263244] flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Parameters Saved' : 'Save Algorithm Weights'}</span>
          </button>
        </div>
      </div>

      {/* Connected Integrations */}
      <div className="p-5 rounded-lg bg-[#111925] border border-[#263244] space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold border-b border-[#263244] pb-2">
          Connected Repositories & Build Pipelines
        </h3>

        <div className="space-y-2.5 font-mono text-xs">
          <div className="p-3 rounded bg-[#0B111A] border border-[#263244] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <GitBranch className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-slate-200 font-semibold">enterprise/checkout-microservices</span>
                <span className="text-[10px] text-slate-500 block">GitHub App Integration • Webhook active</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Synced
            </span>
          </div>

          <div className="p-3 rounded bg-[#0B111A] border border-[#263244] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-200 font-semibold">CISA Known Exploited Vulnerabilities (KEV)</span>
                <span className="text-[10px] text-slate-500 block">Automated catalog feed • Hourly polling</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Live Feed
            </span>
          </div>

          <div className="p-3 rounded bg-[#0B111A] border border-[#263244] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-200 font-semibold">FIRST EPSS Data API</span>
                <span className="text-[10px] text-slate-500 block">Exploitation Prediction Scoring System</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> v2024.1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
