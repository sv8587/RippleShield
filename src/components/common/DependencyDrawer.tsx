import React from 'react';
import { GraphNode } from '../../types';
import { RiskBadge } from './RiskBadge';
import { RiskGauge } from './RiskGauge';
import { 
  X, 
  ExternalLink, 
  GitFork, 
  ShieldAlert, 
  Layers, 
  Server, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  FileCode,
  Lock
} from 'lucide-react';

interface DependencyDrawerProps {
  node: GraphNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSimulate: (nodeId: string) => void;
  onMitigate: (nodeId: string) => void;
  onExplainRisk: (node: GraphNode) => void;
  onViewChain?: (nodeId: string) => void;
}

export const DependencyDrawer: React.FC<DependencyDrawerProps> = ({
  node,
  isOpen,
  onClose,
  onSimulate,
  onMitigate,
  onExplainRisk,
  onViewChain,
}) => {
  if (!isOpen || !node) return null;

  return (
    <aside
      id="dependency-details-drawer"
      className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-[#111925] border-l border-[#263244] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out"
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#263244] bg-[#151E2B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Node Intelligence Inspector
            </span>
            <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
              {node.name}
              <span className="text-xs font-normal text-slate-400">v{node.version}</span>
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge level={node.risk} size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#192333] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
        {/* RIPPLE RISK CARD */}
        <div className="p-4 rounded-lg bg-[#0B111A] border border-[#263244] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Ripple Consequence Score
              </span>
              <button
                onClick={() => onExplainRisk(node)}
                className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-0.5 text-[10px] font-semibold underline decoration-cyan-400/50"
                title="Explain Risk"
              >
                [Why?]
              </button>
            </div>
            <p className="text-slate-400 text-[11px] max-w-[220px] leading-tight">
              Ecosystem consequence based on exploitability, reach, criticality and propagation.
            </p>
            <div className="pt-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-red-950/40 border border-red-500/30 text-red-300 font-semibold">
                {node.rippleRisk >= 85 ? 'IMMEDIATE ECOSYSTEM THREAT' : 'MONITORED COMPONENT'}
              </span>
            </div>
          </div>
          <RiskGauge score={node.rippleRisk} size={88} showCategory={false} label="" />
        </div>

        {/* IDENTITY */}
        <div>
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            Component Identity
          </h4>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div className="p-2.5 rounded bg-[#151E2B] border border-[#263244]">
              <span className="text-[10px] text-slate-500 block">Package Ecosystem</span>
              <span className="text-slate-200 font-medium">{node.ecosystem}</span>
            </div>
            <div className="p-2.5 rounded bg-[#151E2B] border border-[#263244]">
              <span className="text-[10px] text-slate-500 block">License</span>
              <span className="text-slate-200 font-medium">{node.license}</span>
            </div>
            <div className="p-2.5 rounded bg-[#151E2B] border border-[#263244]">
              <span className="text-[10px] text-slate-500 block">Dependency Type</span>
              <span className="text-cyan-400 font-medium capitalize">
                {node.type.replace('_', ' ')}
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#151E2B] border border-[#263244]">
              <span className="text-[10px] text-slate-500 block">Installed Version</span>
              <span className="text-slate-200 font-medium">{node.version}</span>
            </div>
          </div>
        </div>

        {/* DEPENDENCY POSITION */}
        <div>
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-cyan-400" />
            Topological Position
          </h4>
          <div className="grid grid-cols-3 gap-2 font-mono text-center">
            <div className="p-2.5 rounded bg-[#151E2B] border border-[#263244]">
              <span className="text-[10px] text-slate-500 block">Dependents</span>
              <span className="text-base font-bold text-slate-100">{node.dependentsCount}</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">downstream</span>
            </div>
            <div className="p-2.5 rounded bg-[#151E2B] border border-[#263244]">
              <span className="text-[10px] text-slate-500 block">Dependencies</span>
              <span className="text-base font-bold text-slate-100">{node.dependenciesCount}</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">upstream</span>
            </div>
            <div className="p-2.5 rounded bg-[#151E2B] border border-[#263244]">
              <span className="text-[10px] text-slate-500 block">Prop. Depth</span>
              <span className="text-base font-bold text-cyan-400">Layer {node.propagationDepth}</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">nested tiers</span>
            </div>
          </div>
        </div>

        {/* SECURITY SIGNALS */}
        <div>
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            Vulnerability Telemetry
          </h4>
          <div className="p-3 rounded bg-[#151E2B] border border-[#263244] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Known Vulnerabilities:</span>
              <span className="font-mono font-semibold text-slate-200">
                {node.vulnerabilityCount > 0 ? `${node.vulnerabilityCount} Reported` : '0 Clean'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">CVSS Base Score:</span>
              <span className="font-mono font-bold text-amber-400">
                {node.cvss > 0 ? node.cvss.toFixed(1) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">EPSS Exploit Likelihood:</span>
              <span className="font-mono font-bold text-cyan-400">
                {(node.epss * 100).toFixed(0)}% (Percentile)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">CISA KEV Catalog:</span>
              <span className="font-mono font-semibold">
                {node.inKev ? (
                  <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-400">
                    YES (Active Exploitation)
                  </span>
                ) : (
                  <span className="text-slate-400">No</span>
                )}
              </span>
            </div>
            {node.cves.length > 0 && (
              <div className="pt-2 border-t border-[#263244]/80 flex flex-wrap gap-1.5">
                {node.cves.map((cve) => (
                  <span
                    key={cve}
                    className="px-2 py-0.5 rounded bg-[#101722] border border-[#263244] text-[10px] font-mono text-red-300"
                  >
                    {cve}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ECOSYSTEM IMPACT */}
        <div>
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-amber-400" />
            Downstream Ecosystem Impact
          </h4>
          <div className="space-y-2 font-mono">
            <div className="p-2.5 rounded bg-[#151E2B] border border-[#263244] flex items-center justify-between">
              <span className="text-slate-400">Applications Reached:</span>
              <span className="text-slate-100 font-bold">{node.applicationsAffectedCount} Applications</span>
            </div>
            <div className="p-2.5 rounded bg-[#151E2B] border border-[#263244] flex items-center justify-between">
              <span className="text-slate-400">Tier-1 Critical Services:</span>
              <span className="text-red-400 font-bold">{node.criticalServicesCount} Services</span>
            </div>
            {node.dataSensitivity && (
              <div className="p-2.5 rounded bg-red-950/20 border border-red-500/30">
                <span className="text-[10px] text-red-400 font-semibold block uppercase">
                  Data Sensitivity Exposure:
                </span>
                <span className="text-slate-200 text-xs mt-0.5 block font-sans">
                  {node.dataSensitivity}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* WHY THIS MATTERS */}
        <div>
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Why This Component Matters
          </h4>
          <div className="p-3.5 rounded bg-[#0B111A] border border-[#263244] text-slate-300 leading-relaxed">
            {node.explanation.summary}
          </div>
        </div>
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 border-t border-[#263244] bg-[#151E2B] flex flex-col gap-2">
        <button
          onClick={() => onSimulate(node.id)}
          className="w-full py-2.5 px-4 rounded text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 font-mono"
        >
          <Activity className="w-4 h-4" />
          SIMULATE COMPROMISE
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onMitigate(node.id)}
            className="py-2 px-3 rounded text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition-colors flex items-center justify-center gap-1.5 font-mono"
          >
            Find Mitigation
          </button>
          <button
            onClick={() => onExplainRisk(node)}
            className="py-2 px-3 rounded text-xs font-medium text-slate-300 bg-[#192333] hover:bg-[#202c40] border border-[#263244] transition-colors flex items-center justify-center gap-1.5 font-mono"
          >
            Explain Risk
          </button>
        </div>
      </div>
    </aside>
  );
};
