import React from 'react';
import { 
  GraphNode, 
  GraphLink, 
  EcosystemStats 
} from '../types';
import { DependencyGraph } from '../components/graph/DependencyGraph';
import { 
  Layers, 
  ShieldAlert, 
  Server, 
  Radio, 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  Zap,
  Lock,
  ChevronRight,
  GitFork
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

interface OverviewViewProps {
  stats: EcosystemStats;
  nodes: GraphNode[];
  links: GraphLink[];
  onSelectNode: (node: GraphNode) => void;
  onNavigateToSimulator: (nodeId?: string) => void;
  onNavigateToMitigation: () => void;
  onNavigateToRiskIntel: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stats,
  nodes,
  links,
  onSelectNode,
  onNavigateToSimulator,
  onNavigateToMitigation,
  onNavigateToRiskIntel,
}) => {
  const kpis = [
    {
      label: 'DEPENDENCIES',
      value: stats.totalDependencies,
      trend: stats.dependenciesTrend,
      trendPositive: false,
      icon: Layers,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      subtext: 'Direct & transitive packages',
    },
    {
      label: 'VULNERABILITIES',
      value: stats.totalVulnerabilities,
      trend: `${stats.vulnerabilitiesImmediate} immediate attention`,
      trendPositive: false,
      icon: ShieldAlert,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      subtext: 'Known CVE security advisories',
    },
    {
      label: 'CRITICAL NODES',
      value: stats.criticalNodesCount,
      trend: 'High downstream exposure',
      trendPositive: false,
      icon: Radio,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      subtext: 'Multi-service cascade roots',
    },
    {
      label: 'APPLICATIONS',
      value: stats.totalApplications,
      trend: 'Connected applications',
      trendPositive: true,
      icon: Server,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      subtext: 'Microservices & internal apps',
    },
    {
      label: 'BLAST RADIUS',
      value: stats.averageBlastRadius,
      trend: 'Avg downstream reach of critical nodes',
      trendPositive: false,
      icon: Zap,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      subtext: 'Consequence multiplier',
    },
    {
      label: 'RISK EXPOSURE',
      value: stats.riskExposureLevel,
      trend: stats.riskExposureTrend,
      trendPositive: true,
      icon: Activity,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      subtext: 'Ecosystem severity index',
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner: Problem Statement & Value Proposition */}
      <div className="p-4 rounded-lg bg-[#111925] border border-[#263244] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blue-500/10 border border-blue-500/30 text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-400">
                PARADIGM SHIFT: CONSEQUENCE-AWARE
              </span>
              <span className="px-1.5 py-0.5 rounded bg-blue-950 text-[10px] font-mono text-blue-300 border border-blue-800">
                MAP → ASSESS → SIMULATE → PRIORITIZE → MITIGATE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Traditional tools ask: <span className="text-slate-400 italic">"Which dependency is vulnerable?"</span>{' '}
              <strong className="text-slate-100">RippleShield asks:</strong>{' '}
              <span className="text-cyan-300 font-semibold">"What happens if it fails? How large is the downstream blast radius?"</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToSimulator('dep-follow-redirects')}
            className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Activity className="w-3.5 h-3.5" />
            Launch Ripple Simulation
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="p-4 rounded-lg bg-[#111925] border border-[#263244] hover:border-slate-600 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1.5">
                  <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                    {kpi.label}
                  </span>
                  <div className={`p-1.5 rounded ${kpi.bg} ${kpi.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
                  {kpi.value}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#263244]/60">
                <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1 leading-tight">
                  {kpi.trendPositive ? (
                    <TrendingDown className="w-3 h-3 text-emerald-400 inline" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                  )}
                  <span className={kpi.trendPositive ? 'text-emerald-400' : 'text-slate-300'}>
                    {kpi.trend}
                  </span>
                </p>
                <span className="text-[9.5px] text-slate-500 block mt-0.5">
                  {kpi.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Centerpiece Visualization: Dependency Ecosystem Graph */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-100 font-display flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              DEPENDENCY ECOSYSTEM
            </h2>
            <p className="text-xs text-slate-400">
              Interactive topological network. Node size indicates downstream blast radius; border color encodes consequence severity.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Showing 184 packages across 5 tiers</span>
          </div>
        </div>

        {/* Network Graph */}
        <DependencyGraph
          nodes={nodes}
          links={links}
          onSelectNode={onSelectNode}
          height={560}
          showControls={true}
        />
      </div>

      {/* Bottom Row: Critical Hotspots & Quick Simulator Callouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hotspot 1: follow-redirects alert */}
        <div className="p-4 rounded-lg bg-[#111925] border border-red-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                HIGHEST CONSEQUENCE NODE
              </span>
              <RiskBadge level="CRITICAL" size="sm" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              follow-redirects <span className="text-slate-400 font-normal">v1.15.9</span>
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Reaches <strong className="text-cyan-300">17 downstream packages</strong> and{' '}
              <strong className="text-red-400">3 business-critical services</strong> (Checkout, Payment API, Auth).
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#263244] flex items-center justify-between">
            <span className="font-mono text-xs text-slate-400">
              Ripple Score: <strong className="text-red-400 text-sm">92/100</strong>
            </span>
            <button
              onClick={() => onNavigateToSimulator('dep-follow-redirects')}
              className="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-mono font-semibold transition-colors flex items-center gap-1"
            >
              Simulate Ripple
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hotspot 2: Mitigation ROI Highlight */}
        <div className="p-4 rounded-lg bg-[#111925] border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                HIGHEST RISK REDUCTION ROI
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                -66% EXPOSURE
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 font-display">
              Single-Package Upgrade Vector
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Patching <strong>follow-redirects to v1.15.11</strong> protects 6 applications and drops ecosystem risk from <strong className="text-red-400">92</strong> to <strong className="text-emerald-400">31</strong> with 1 code change.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#263244] flex items-center justify-between">
            <span className="font-mono text-xs text-slate-400">
              Effort: <strong className="text-slate-200">1 Package Change</strong>
            </span>
            <button
              onClick={onNavigateToMitigation}
              className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold transition-colors flex items-center gap-1"
            >
              Mitigation Center
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hotspot 3: Prioritized Consequence Table Link */}
        <div className="p-4 rounded-lg bg-[#111925] border border-[#263244] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                PRIORITIZATION ENGINE
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                7 Monitored
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 font-display">
              Ecosystem Risk vs CVSS Severity
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Why protobufjs (CVSS 9.8) is ranked lower priority (Ripple 38) than follow-redirects (CVSS 8.1, Ripple 92) based on structural blast radius.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#263244] flex items-center justify-between">
            <span className="font-mono text-xs text-slate-400">
              Sort by: <strong className="text-slate-200">Downstream Impact</strong>
            </span>
            <button
              onClick={onNavigateToRiskIntel}
              className="px-2.5 py-1 rounded bg-[#192333] hover:bg-[#202c40] border border-[#263244] text-slate-300 text-xs font-mono font-semibold transition-colors flex items-center gap-1"
            >
              View Ranking
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
