import React, { useState } from 'react';
import { GraphNode, GraphLink } from '../types';
import { DependencyGraph } from '../components/graph/DependencyGraph';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskGauge } from '../components/common/RiskGauge';
import { 
  Activity, 
  Wrench, 
  ShieldAlert, 
  HelpCircle, 
  GitFork, 
  Server, 
  Layers, 
  CheckCircle2,
  Maximize2
} from 'lucide-react';

interface DependencyGraphViewProps {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNode: GraphNode | null;
  onSelectNode: (node: GraphNode) => void;
  onSimulate: (nodeId: string) => void;
  onMitigate: (nodeId: string) => void;
  onExplainRisk: (node: GraphNode) => void;
}

export const DependencyGraphView: React.FC<DependencyGraphViewProps> = ({
  nodes,
  links,
  selectedNode,
  onSelectNode,
  onSimulate,
  onMitigate,
  onExplainRisk,
}) => {
  // Default to follow-redirects if none selected
  const activeNode = selectedNode || nodes.find((n) => n.id === 'dep-follow-redirects') || nodes[0];

  return (
    <div className="space-y-4 pb-6">
      {/* Top Banner Context */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-100 font-display flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Topological Dependency Graph
          </h2>
          <p className="text-xs text-slate-400">
            Interactive consequence canvas. Click any node to inspect upstream callers, downstream dependents, and blast radius propagation paths.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 bg-[#111925] border border-[#263244] px-2.5 py-1 rounded">
            Selected: <strong className="text-cyan-400">{activeNode.name}</strong> (Risk {activeNode.rippleRisk}/100)
          </span>
        </div>
      </div>

      {/* Main Grid: Full interactive Graph Canvas (left/center) + Real-time Node Inspector Panel (right) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
        {/* Graph Canvas Component (takes 3 cols on xl) */}
        <div className="xl:col-span-3">
          <DependencyGraph
            nodes={nodes}
            links={links}
            selectedNodeId={activeNode.id}
            onSelectNode={onSelectNode}
            height={680}
            showControls={true}
          />
        </div>

        {/* Real-time Node Intelligence Panel (takes 1 col on xl) */}
        <div className="bg-[#111925] border border-[#263244] rounded-lg p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#263244]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                  Active Inspector
                </span>
                <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                  {activeNode.name}
                  <span className="text-xs font-normal text-slate-400">v{activeNode.version}</span>
                </h3>
              </div>
              <RiskBadge level={activeNode.risk} size="sm" />
            </div>

            {/* Risk Gauge Header */}
            <div className="py-4 flex items-center justify-between border-b border-[#263244]">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 block font-semibold uppercase">
                  Ripple Risk Score
                </span>
                <span className="text-2xl font-mono font-bold text-slate-100 block">
                  {activeNode.rippleRisk}
                  <span className="text-xs text-slate-400 font-normal"> / 100</span>
                </span>
                <button
                  onClick={() => onExplainRisk(activeNode)}
                  className="text-cyan-400 hover:text-cyan-300 text-[11px] font-mono underline font-semibold flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  Why is this risk score?
                </button>
              </div>
              <RiskGauge score={activeNode.rippleRisk} size={76} showCategory={false} label="" />
            </div>

            {/* Technical Attributes Table */}
            <div className="py-3 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">Type:</span>
                <span className="text-cyan-300 font-medium capitalize">
                  {activeNode.type.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">Used By:</span>
                <span className="font-semibold text-slate-200">
                  {activeNode.applicationsAffectedCount} applications
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">Dependents:</span>
                <span className="font-semibold text-slate-200">
                  {activeNode.dependentsCount} packages
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">Propagation Depth:</span>
                <span className="font-semibold text-cyan-400">
                  Layer {activeNode.propagationDepth}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">Known Vulnerabilities:</span>
                <span className="font-semibold text-red-400">
                  {activeNode.vulnerabilityCount} CVEs
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">CVSS Base:</span>
                <span className="font-semibold text-amber-400">
                  {activeNode.cvss > 0 ? activeNode.cvss.toFixed(1) : '0.0'}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">EPSS Exploit Prob:</span>
                <span className="font-semibold text-cyan-300">
                  {(activeNode.epss * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">CISA KEV Status:</span>
                <span>
                  {activeNode.inKev ? (
                    <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-bold border border-red-500/40">
                      YES (Exploited)
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">No</span>
                  )}
                </span>
              </div>
            </div>

            {/* Summary Text */}
            <div className="p-3 rounded bg-[#0B111A] border border-[#263244] text-[11px] text-slate-300 leading-relaxed font-sans mt-2">
              <span className="font-mono text-[10px] uppercase text-slate-400 block font-semibold mb-1">
                Consequence Context
              </span>
              {activeNode.explanation.summary}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-[#263244]">
            <button
              onClick={() => onSimulate(activeNode.id)}
              className="w-full py-2.5 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
            >
              <Activity className="w-4 h-4" />
              SIMULATE COMPROMISE
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onMitigate(activeNode.id)}
                className="py-2 px-2.5 rounded bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Wrench className="w-3.5 h-3.5" />
                Find Mitigation
              </button>
              <button
                onClick={() => onExplainRisk(activeNode)}
                className="py-2 px-2.5 rounded bg-[#192333] hover:bg-[#202c40] border border-[#263244] text-slate-300 text-xs font-mono font-medium transition-colors flex items-center justify-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Explain Risk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
