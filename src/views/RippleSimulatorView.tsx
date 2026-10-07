import React, { useState } from 'react';
import { GraphNode } from '../types';
import { DependencyGraph } from '../components/graph/DependencyGraph';
import { MOCK_NODES, MOCK_LINKS } from '../data/mockDataset';
import {
  Play,
  RotateCcw,
  ShieldAlert,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sliders,
  Sparkles,
  Wrench
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

interface RippleSimulatorViewProps {
  nodes?: GraphNode[];
  selectedNode?: GraphNode | null;
  onSelectNode: (node: GraphNode) => void;
  onNavigateToMitigation: () => void;
}

export const RippleSimulatorView: React.FC<RippleSimulatorViewProps> = ({
  nodes = MOCK_NODES,
  selectedNode,
  onSelectNode,
  onNavigateToMitigation,
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    selectedNode?.id || 'dep-follow-redirects'
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [simulationCompleted, setSimulationCompleted] = useState<boolean>(false);

  // Counterfactual comparison state (Section 9)
  const [counterfactualMode, setCounterfactualMode] = useState<'current' | 'what_if'>('current');
  const [whatIfAssumption, setWhatIfAssumption] = useState<'patched' | 'compromised'>('patched');

  // Selected propagation path for inspection
  const [activePathId, setActivePathId] = useState<string | null>('path-checkout');

  // Simulation step timer
  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);
    setSimulationCompleted(false);

    const stepInterval = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          setIsSimulating(false);
          setSimulationCompleted(true);
          return 5;
        }
        return prev + 1;
      });
    }, 600);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationStep(0);
    setSimulationCompleted(false);
  };

  // Static impact paths for follow-redirects
  const IMPACT_PATHS_FOLLOW_REDIRECTS = [
    {
      id: 'path-checkout',
      title: 'Critical Path 1: Core Checkout Revenue Service',
      severity: 'CRITICAL',
      targetAsset: 'Checkout Service (Application Tier)',
      steps: [
        { name: 'follow-redirects v1.15.9', type: 'Layer 4 Root Dependency', detail: 'CVE-2024-28849 unauthorized sensitive headers leakage' },
        { name: 'axios v1.6.8', type: 'Layer 2 Direct Dependency', detail: 'Exposes HTTP request abstraction with default followRedirects true' },
        { name: 'Payment Gateway API', type: 'Layer 1 Microservice', detail: 'Handles automated card authorization and external webhooks' },
        { name: 'Checkout Service', type: 'Layer 0 Critical Application', detail: 'Processes customer orders; direct access to session tokens' },
      ],
    },
    {
      id: 'path-auth',
      title: 'Critical Path 2: User Authentication & JWT Broker',
      severity: 'CRITICAL',
      targetAsset: 'Authentication Service',
      steps: [
        { name: 'follow-redirects v1.15.9', type: 'Layer 4 Root Dependency', detail: 'Header confidentiality compromise vector' },
        { name: 'express v4.19.2', type: 'Layer 2 Direct Dependency', detail: 'Middleware routing pipeline invokes affected proxy handler' },
        { name: 'Authentication Service', type: 'Layer 0 Critical Application', detail: 'Single sign-on broker and OAuth2 session tokens' },
      ],
    },
    {
      id: 'path-portal',
      title: 'High Severity Path 3: Customer Facing Web Portal',
      severity: 'HIGH',
      targetAsset: 'Customer Web Portal',
      steps: [
        { name: 'follow-redirects v1.15.9', type: 'Layer 4 Root Dependency', detail: 'Downstream SSR fetch request chain' },
        { name: 'Notification Service', type: 'Layer 1 Microservice', detail: 'Sends transactional confirmation emails with order links' },
        { name: 'Customer Web Portal', type: 'Layer 0 End-User Application', detail: 'Frontline customer interface and account settings' },
      ],
    },
  ];

  const stepLabels: Record<number, string> = {
    1: 'Compromising Layer 4 Root Dependency (follow-redirects)...',
    2: 'Cascading through Layer 3 Intermediary Packages (uuid, body-parser)...',
    3: 'Infecting Layer 2 Direct Dependencies (axios, express)...',
    4: 'Breaching Layer 1 Infrastructure Microservices (Payment Gateway API)...',
    5: 'Blast Radius Complete: 3 Critical Applications Impacted!',
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-10">
      {/* Simulator Header & Context */}
      <div className="p-3.5 sm:p-4 rounded-lg bg-[#111925] border border-[#263244] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-100 font-display flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              RIPPLE EFFECT PROPAGATION SIMULATOR
            </h2>
            <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-[9px] sm:text-[10px] font-mono text-red-300 font-bold">
              Dynamic Blast Radius Engine
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
            Predict how an upstream zero-day or dependency compromise cascades across downstream application tiers and critical services.
          </p>
        </div>

        {/* Counterfactual State Toggle */}
        <div className="w-full sm:w-auto flex items-center justify-start sm:justify-end gap-1.5 sm:gap-2 bg-[#0B111A] border border-[#263244] p-1 rounded-lg">
          <button
            onClick={() => setCounterfactualMode('current')}
            className={`flex-1 sm:flex-initial text-center text-xs font-mono px-3 py-1.5 rounded transition-all ${counterfactualMode === 'current'
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
            className={`flex-1 sm:flex-initial text-center text-xs font-mono px-2.5 sm:px-3 py-1.5 rounded transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${counterfactualMode === 'what_if'
                ? 'bg-blue-600/30 text-cyan-300 font-semibold border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>What-If</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Select Dependency & Simulate Button */}
      <div className="p-3.5 sm:p-4 rounded-lg bg-[#111925] border border-[#263244] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Package Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Select Root Dependency:
          </label>
          <select
            value={selectedPackageId}
            onChange={(e) => {
              setSelectedPackageId(e.target.value);
              resetSimulation();
            }}
            disabled={isSimulating}
            className="w-full sm:w-auto bg-[#0B111A] border border-[#263244] text-xs font-mono text-cyan-300 font-semibold rounded px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
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
        <div className="flex items-center gap-2 sm:gap-3">
          {simulationStep > 0 && (
            <button
              onClick={resetSimulation}
              disabled={isSimulating}
              className="px-3 py-2 rounded text-xs font-mono text-slate-300 hover:text-slate-100 hover:bg-[#192333] border border-[#263244] transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={startSimulation}
            disabled={isSimulating}
            className={`flex-1 sm:flex-initial justify-center px-4 sm:px-5 py-2 rounded text-xs font-mono font-bold tracking-wide text-white transition-all flex items-center gap-2 shadow-lg ${isSimulating
                ? 'bg-blue-600/50 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 shadow-red-600/25 animate-pulse'
              }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'PROPAGATING...' : 'SIMULATE COMPROMISE'}</span>
          </button>
        </div>
      </div>

      {/* Progress sequence ticker */}
      {simulationStep > 0 && (
        <div className="p-3 rounded-lg bg-[#0B111A] border border-[#263244] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${simulationCompleted ? 'bg-emerald-400' : 'bg-red-500 animate-ping'}`} />
            <span className="text-slate-300">
              {stepLabels[simulationStep]}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 self-end sm:self-auto">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <span
                key={stepNum}
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${simulationStep >= stepNum
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
        <div className="p-3.5 sm:p-4 rounded-lg bg-[#0B111A] border border-cyan-500/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              Counterfactual Risk Reduction Analysis
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Simulate assumption:</span>
              <button
                onClick={() => setWhatIfAssumption('patched')}
                className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors ${whatIfAssumption === 'patched'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-[#151E2B] text-slate-400 hover:text-slate-200'
                  }`}
              >
                Assume Patched
              </button>
              <button
                onClick={() => setWhatIfAssumption('compromised')}
                className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors ${whatIfAssumption === 'compromised'
                    ? 'bg-red-600 text-white font-semibold'
                    : 'bg-[#151E2B] text-slate-400 hover:text-slate-200'
                  }`}
              >
                Assume Compromised
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-2">
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
          links={MOCK_LINKS}
          selectedNodeId={selectedPackageId}
          onSelectNode={onSelectNode}
          simulatingNodeId={simulationStep > 0 ? selectedPackageId : null}
          simulationStep={simulationStep}
          height={typeof window !== 'undefined' && window.innerWidth < 640 ? 400 : 560}
          showControls={true}
        />
      </div>

      {/* Post-Simulation Blast Radius Metrics */}
      {(simulationCompleted || simulationStep >= 4) && (
        <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
          {/* Blast Radius KPI Cards */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              BLAST RADIUS RESULTS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
              <div className="p-3 sm:p-4 rounded-lg bg-[#111925] border border-red-500/40 font-mono">
                <span className="text-xl sm:text-2xl font-bold text-red-400 block">17</span>
                <span className="text-xs text-slate-300 font-medium">Packages affected</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 block mt-0.5">Transitive sub-tree</span>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-[#111925] border border-orange-500/40 font-mono">
                <span className="text-xl sm:text-2xl font-bold text-orange-400 block">6</span>
                <span className="text-xs text-slate-300 font-medium">Applications affected</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 block mt-0.5">Microservice runtimes</span>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-[#111925] border border-red-500/40 font-mono">
                <span className="text-xl sm:text-2xl font-bold text-red-400 block">3</span>
                <span className="text-xs text-slate-300 font-medium">Critical services</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 block mt-0.5">Tier-1 Payment & Auth</span>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-[#111925] border border-[#263244] font-mono">
                <span className="text-xl sm:text-2xl font-bold text-cyan-400 block">4</span>
                <span className="text-xs text-slate-300 font-medium">Propagation depth</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 block mt-0.5">Layers deep in stack</span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3 sm:p-4 rounded-lg bg-[#111925] border border-red-500/40 font-mono">
                <span className="text-xl sm:text-2xl font-bold text-red-400 block">2</span>
                <span className="text-xs text-slate-300 font-medium">Critical paths exposed</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 block mt-0.5">Direct data compromise</span>
              </div>
            </div>
          </div>

          {/* IMPACT PATHS */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  IMPACT PATHS (CLICKABLE CASCADE VECTORS)
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  Click any propagation path below to inspect step-by-step structural vulnerabilities and asset exposure.
                </p>
              </div>

              <button
                onClick={onNavigateToMitigation}
                className="w-full sm:w-auto justify-center px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-600/20"
              >
                <Wrench className="w-3.5 h-3.5" />
                FIND MITIGATION FOR THIS CASCADE
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
              {IMPACT_PATHS_FOLLOW_REDIRECTS.map((path) => {
                const isActive = activePathId === path.id;

                return (
                  <div
                    key={path.id}
                    onClick={() => setActivePathId(isActive ? null : path.id)}
                    className={`p-3.5 sm:p-4 rounded-lg border transition-all cursor-pointer ${isActive
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
                    <div className="mt-3 sm:mt-4 space-y-2 font-mono text-xs">
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
