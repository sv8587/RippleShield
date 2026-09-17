import React from 'react';
import { GraphNode } from '../../types';
import { RiskBadge } from './RiskBadge';
import { ShieldAlert, GitFork, Server, Layers, Lock, AlertTriangle, ArrowRight, X } from 'lucide-react';

interface ExplainRiskModalProps {
  node: GraphNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSimulate?: (nodeId: string) => void;
  onMitigate?: (nodeId: string) => void;
}

export const ExplainRiskModal: React.FC<ExplainRiskModalProps> = ({
  node,
  isOpen,
  onClose,
  onSimulate,
  onMitigate,
}) => {
  if (!isOpen || !node) return null;

  const signals = [
    {
      num: '01',
      title: 'Exploitability Signal',
      icon: ShieldAlert,
      value: `EPSS ${(node.epss * 100).toFixed(0)}% • ${node.inKev ? 'CISA KEV Listed' : 'Unlisted KEV'}`,
      description: node.explanation.exploitability,
      impact: node.epss > 0.5 ? 'CRITICAL WEIGHT' : 'ELEVATED WEIGHT',
      barPercent: Math.min(100, node.epss * 120),
    },
    {
      num: '02',
      title: 'Dependency Reach',
      icon: GitFork,
      value: `${node.dependentsCount} downstream packages`,
      description: node.explanation.dependencyReach,
      impact: node.dependentsCount > 10 ? 'HIGH CASCADE' : 'MODERATE CASCADE',
      barPercent: Math.min(100, (node.dependentsCount / 20) * 100),
    },
    {
      num: '03',
      title: 'Target Criticality',
      icon: Server,
      value: `${node.criticalServicesCount} Tier-1 critical business services`,
      description: node.explanation.criticality,
      impact: node.criticalServicesCount >= 2 ? 'REVENUE CRITICAL' : 'STANDARD',
      barPercent: Math.min(100, (node.criticalServicesCount / 3) * 100),
    },
    {
      num: '04',
      title: 'Propagation Depth',
      icon: Layers,
      value: `Depth Layer ${node.propagationDepth} in tree`,
      description: node.explanation.propagation,
      impact: node.propagationDepth >= 3 ? 'DEEP TRANSITIVE' : 'SHALLOW DIRECT',
      barPercent: Math.min(100, (node.propagationDepth / 4) * 100),
    },
    {
      num: '05',
      title: 'Blast Radius Exposure',
      icon: Lock,
      value: `${node.applicationsAffectedCount} Applications Exposed`,
      description: node.explanation.exposure,
      impact: 'HIGH EXPOSURE',
      barPercent: 90,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="explain-risk-dialog"
        className="w-full max-w-2xl bg-[#111925] border border-[#263244] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#263244] flex items-center justify-between bg-[#151E2B]/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-semibold text-slate-100 font-display">
                  WHY IS RIPPLE RISK {node.rippleRisk}?
                </h3>
                <RiskBadge level={node.risk} size="sm" />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Target: <span className="text-cyan-400 font-medium">{node.name}</span> v{node.version} ({node.type.replace('_', ' ')})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#192333] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Natural language synthesis box */}
          <div className="p-4 rounded-md bg-[#0B111A] border border-[#263244] text-slate-200">
            <p className="font-mono text-xs uppercase tracking-wider text-cyan-400 mb-1 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Consequence Synthesis
            </p>
            <p className="leading-relaxed text-slate-300">
              "{node.explanation.summary}"
            </p>
          </div>

          {/* 5 Contributing Signals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Contributing Risk Signals ({signals.length})
            </h4>

            <div className="space-y-2.5">
              {signals.map((sig) => {
                const Icon = sig.icon;
                return (
                  <div
                    key={sig.num}
                    className="p-3.5 rounded bg-[#151E2B] border border-[#263244]/80 hover:border-blue-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded bg-[#101722] border border-[#263244] text-blue-400 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-500">{sig.num}</span>
                            <span className="font-medium text-slate-200 text-xs">{sig.title}</span>
                          </div>
                          <p className="text-xs font-mono text-cyan-400 mt-0.5 font-semibold">
                            {sig.value}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 leading-normal">
                            {sig.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101722] border border-[#263244] text-amber-400">
                          {sig.impact}
                        </span>
                        <div className="w-24 h-1.5 bg-[#101722] rounded-full mt-2 overflow-hidden border border-[#263244]">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-red-500 rounded-full"
                            style={{ width: `${sig.barPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consequence conclusion banner */}
          <div className="p-3 rounded bg-blue-950/30 border border-blue-500/30 text-xs text-blue-300 flex items-center justify-between">
            <span>
              Combined, these multi-tier structural signals elevate this component above isolated CVSS ratings.
            </span>
            <span className="font-mono text-cyan-300 font-semibold shrink-0 ml-2">
              Ripple Score: {node.rippleRisk}/100
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#263244] bg-[#151E2B]/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-[#192333] border border-[#263244] transition-colors"
          >
            Close
          </button>
          {onMitigate && (
            <button
              onClick={() => {
                onClose();
                onMitigate(node.id);
              }}
              className="px-3.5 py-1.5 rounded text-xs font-medium text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 transition-colors flex items-center gap-1.5"
            >
              Find Mitigation
            </button>
          )}
          {onSimulate && (
            <button
              onClick={() => {
                onClose();
                onSimulate(node.id);
              }}
              className="px-4 py-1.5 rounded text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
            >
              Simulate Compromise
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
