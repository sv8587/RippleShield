import React, { useState, useEffect } from 'react';
import { GraphNode, GraphLink, ImpactPath } from '../types';
import { IMPACT_PATHS_FOLLOW_REDIRECTS } from '../data/mockDataset';
import { DependencyGraph } from '../components/graph/DependencyGraph';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  Play, 
  RotateCcw, 
  Layers, 
  Activity, 
  ShieldAlert, 
  Server, 
  Lock, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2,
  Sliders,
  Sparkles,
  GitFork,
  Wrench,
  AlertTriangle
} from 'lucide-react';

interface RippleSimulatorViewProps {
  nodes: GraphNode[];
  links: GraphLink[];
  initialNodeId?: string;
  onNavigateToMitigation: () => void;
  onSelectNode: (node: GraphNode) => void;
}

export const RippleSimulatorView: React.FC<RippleSimulatorViewProps> = ({
  nodes,
  links,
  initialNodeId = 'dep-follow-redirects',
  onNavigateToMitigation,
  onSelectNode,
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState(initialNodeId);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: Idle, 1: Source, 2: Direct, 3: Transitive, 4: Apps, 5: Critical, 6: Done
  const [simulationCompleted, setSimulationCompleted] = useState(false);
  const [activePathId, setActivePathId] = useState<string | null>(null);

  // Counterfactual What-If State (Section 9)
  const [counterfactualMode, setCounterfactualMode] = useState<'current' | 'what_if'>('current');
  const [whatIfAssumption, setWhatIfAssumption] = useState<'compromised' | 'patched'>('patched');

  const activeNode = nodes.find((n) => n.id === selectedPackageId) || nodes[0];

  // Run the 5-step ripple propagation sequence
  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationCompleted(false);
    setSimulationStep(1);

    // Sequence timing
    const step2Timer = setTimeout(() => setSimulationStep(2), 700);
    const step3Timer = setTimeout(() => setSimulationStep(3), 1400);
    const step4Timer = setTimeout(() => setSimulationStep(4), 2100);
    const step5Timer = setTimeout(() => setSimulationStep(5), 2800);
    const stepDoneTimer = setTimeout(() => {
      setSimulationStep(6);
      setIsSimulating(false);
      setSimulationCompleted(true);
    }, 3500);

    return () => {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      clearTimeout(step4Timer);
      clearTimeout(step5Timer);
      clearTimeout(stepDoneTimer);
    };
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationStep(0);
    setSimulationCompleted(false);
    setActivePathId(null);
  };

  const stepLabels = [
    'Ready for injection',
    '1. Target dependency compromised (follow-redirects turns red)',
    '2. Direct dependents highlighted (axios, got-client)',
    '3. Transitive dependencies highlighted (express, qs, parsers)',
    '4. Connected applications highlighted (Checkout, Auth, Portal)',
    '5. Business-critical Tier-1 services compromised (Payment API)',
    'Simulation Complete: Blast Radius Computed',
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Top Banner Context & Philosophy */}
      <div className="p-4 rounded-lg bg-[#111925] border border-[#263244] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-100 font-display flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              RIPPLE EFFECT PROPAGATION SIMULATOR
            </h2>
            <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-[10px] font-mono text-red-300 font-bold">
              Dynamic Blast Radius Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Predict how an upstream zero-day or dependency compromise cascades across downstream application tiers and critical services.
          </p>
        </div>

        {/* Counterfactual State Toggle (Section 9) */}
        <div className="flex items-center gap-2 bg-[#0B111A] border border-[#263244] p-1 rounded-lg">
          <button
            onClick={() => setCounterfactualMode('current')}
            className={`text-xs font-mono px-3 py-1.5 rounded transition-all ${
              counterfactualMode === 'current'
                ? 'bg-[#192333] text-slate-100 font-semibold border border-[#263244] shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Current State
          </button>
          <button
            onClick={() => {
              setCounterfactualMode('what_if');
              setWhatIfAssumption('patched');
            }}
            className={`text-xs font-mono px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              counterfactualMode === 'what_if'
                ? 'bg-blue-600/30 text-cyan-300 font-semibold border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            What-If Counterfactual
          </button>
        </div>
      </div>

      {/* Control Bar: Select Dependency & Simulate Button */}
      <div className="p-4 rounded-lg bg-[#111925] border border-[#263244] flex flex-wrap items-center justify-between gap-4">
        {/* Left: Package Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Select Root Dependency:
          </label>
          <select
            value={selectedPackageId}
            onChange={(e) => {
              setSelectedPackageId(e.target.value);
              resetSimulation();
            }}
            disabled={isSimulating}
            className="bg-[#0B111A] border border-[#263244] text-xs font-mono text-cyan-300 font-semibold rounded px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          >
            <option value="dep-follow-redirects">follow-redirects v1.15.9 (CRITICAL - 92)</option>
            <option value="dep-axios">axios v1.6.8 (HIGH - 86)</option>
            <option value="dep-jsonwebtoken">jsonwebtoken v8.5.1 (CRITICAL - 88)</option>
            <option value="dep-minimist">minimist v1.2.5 (HIGH - 76)</option>
            <option value="dep-qs">qs v6.11.0 (HIGH - 74)</option>
            <option value="dep-protobufjs">protobufjs v4.1.0 (MEDIUM - 38)</option>
          </select>
        </div>

        {/* Right: Simulation Action Buttons */}
        <div className="flex items-center gap-3">
          {simulationStep > 0 && (
            <button
              onClick={resetSimulation}
              disabled={isSimulating}
              className="px-3 py-2 rounded text-xs font-mono text-slate-300 hover:text-slate-100 hover:bg-[#192333] border border-[#263244] transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Graph
            </button>
          )}

          <button
            onClick={startSimulation}
            disabled={isSimulating}
            className={`px-5 py-2 rounded text-xs font-mono font-bold tracking-wide text-white transition-all flex items-center gap-2 shadow-lg ${
              isSimulating
                ? 'bg-blue-600/50 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 shadow-red-600/25 animate-pulse'
            }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'PROPAGATING COMPROMISE...' : 'SIMULATE COMPROMISE'}
          </button>
        </div>
      </div>

      {/* Progress sequence ticker during / after simulation */}
      {simulationStep > 0 && (
        <div className="p-3 rounded-lg bg-[#0B111A] border border-[#263244] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${simulationCompleted ? 'bg-emerald-400' : 'bg-red-500 animate-ping'}`} />
            <span className="text-slate-300">
              {stepLabels[simulationStep]}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <span
                key={stepNum}
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                  simulationStep >= stepNum
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                    : 'bg-[#151E2B] text-slate-600'
                }`}
              >
                {stepNum}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Counterfactual Compare Panel (What-If State) */}
      {counterfactualMode === 'what_if' && (
        <div className="p-4 rounded-lg bg-[#0B111A] border border-cyan-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Counterfactual Risk Reduction Analysis
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Simulate assumption:</span>
              <button
                onClick={() => setWhatIfAssumption('patched')}
                className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors ${
                  whatIfAssumption === 'patched'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-[#151E2B] text-slate-400 hover:text-slate-200'
                }`}
              >
                Assume Dependency is Patched
              </button>
              <button
                onClick={() => setWhatIfAssumption('compromised')}
                className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors ${
                  whatIfAssumption === 'compromised'
                    ? 'bg-red-600 text-white font-semibold'
                    : 'bg-[#151E2B] text-slate-400 hover:text-slate-200'
                }`}
              >
                Assume Compromised
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-3 rounded bg-[#111925] border border-[#263244] font-mono">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">CURRENT RISK</span>
              <span className="text-2xl font-bold text-red-400">92</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">High ecosystem exposure</span>
            </div>
            <div className="p-3 rounded bg-[#111925] border border-emerald-500/30 font-mono">
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">SIMULATED RISK</span>
              <span className="text-2xl font-bold text-emerald-400">31</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">After follow-redirects patch</span>
            </div>
            <div className="p-3 rounded bg-emerald-950/30 border border-emerald-500/40 font-mono">
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">RISK REDUCTION</span>
              <span className="text-2xl font-bold text-emerald-300">66%</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Smallest intervention: 1 pkg upgrade</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Graph during simulation */}
      <div className="space-y-2">
        <DependencyGraph
          nodes={nodes}
          links={links}
          selectedNodeId={selectedPackageId}
          onSelectNode={onSelectNode}
          simulatingNodeId={simulationStep > 0 ? selectedPackageId : null}
          simulationStep={simulationStep}
          height={560}
          showControls={true}
        />
      </div>

      {/* Post-Simulation Blast Radius Metrics (Section 8) */}
      {(simulationCompleted || simulationStep >= 4) && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Blast Radius KPI Cards */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              BLAST RADIUS RESULTS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-4 rounded-lg bg-[#111925] border border-red-500/40 font-mono">
                <span className="text-2xl font-bold text-red-400 block">17</span>
                <span className="text-xs text-slate-300 font-medium">Packages affected</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Transitive sub-tree</span>
              </div>
              <div className="p-4 rounded-lg bg-[#111925] border border-orange-500/40 font-mono">
                <span className="text-2xl font-bold text-orange-400 block">6</span>
                <span className="text-xs text-slate-300 font-medium">Applications affected</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Microservice runtimes</span>
              </div>
              <div className="p-4 rounded-lg bg-[#111925] border border-red-500/40 font-mono">
                <span className="text-2xl font-bold text-red-400 block">3</span>
                <span className="text-xs text-slate-300 font-medium">Critical services affected</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Tier-1 Payment & Auth</span>
              </div>
              <div className="p-4 rounded-lg bg-[#111925] border border-[#263244] font-mono">
                <span className="text-2xl font-bold text-cyan-400 block">4</span>
                <span className="text-xs text-slate-300 font-medium">Propagation depth</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Layer deep in stack</span>
              </div>
              <div className="p-4 rounded-lg bg-[#111925] border border-red-500/40 font-mono">
                <span className="text-2xl font-bold text-red-400 block">2</span>
                <span className="text-xs text-slate-300 font-medium">Critical paths exposed</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Direct data compromise</span>
              </div>
            </div>
          </div>

          {/* IMPACT PATHS (Section 8) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  IMPACT PATHS (CLICKABLE CASCADE VECTORS)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any propagation path below to inspect step-by-step structural vulnerabilities and asset exposure.
                </p>
              </div>

              <button
                onClick={onNavigateToMitigation}
                className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-600/20"
              >
                <Wrench className="w-3.5 h-3.5" />
                FIND MITIGATION FOR THIS CASCADE
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {IMPACT_PATHS_FOLLOW_REDIRECTS.map((path) => {
                const isActive = activePathId === path.id;

                return (
                  <div
                    key={path.id}
                    onClick={() => setActivePathId(isActive ? null : path.id)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#151E2B] border-cyan-400 shadow-xl shadow-cyan-500/10'
                        : 'bg-[#111925] border-[#263244] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <RiskBadge level={path.severity} size="sm" />
                      <span className="text-[10px] font-mono text-slate-400">
                        {path.steps.length} Hop Cascade
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 font-display">
                      {path.title}
                    </h4>
                    <p className="text-[11px] text-red-400 font-mono mt-1">
                      Target: {path.targetAsset}
                    </p>

                    {/* Step by step flow */}
                    <div className="mt-4 space-y-2 font-mono text-xs">
                      {path.steps.map((step, idx) => (
                        <div key={step.name} className="flex items-start gap-2">
                          <span className="text-[10px] text-slate-500 mt-0.5">{idx + 1}.</span>
                          <div className="flex-1">
                            <span className="text-slate-200 font-medium">{step.name}</span>
                            <span className="text-[10px] text-slate-400 block">{step.type}</span>
                            {isActive && (
                              <p className="text-[10px] text-slate-400 font-sans mt-1 p-2 rounded bg-[#0B111A] border border-[#263244]">
                                {step.detail}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
