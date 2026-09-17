import React, { useState } from 'react';
import { MITIGATION_OPTIONS_FOLLOW_REDIRECTS } from '../data/mockDataset';
import { MitigationOption } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  Wrench, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  GitPullRequest, 
  TrendingDown, 
  FileCode,
  Zap,
  RotateCcw
} from 'lucide-react';

interface MitigationCenterViewProps {
  onApplyMitigation?: (newRiskScore: number) => void;
  onNavigateToGraph?: () => void;
}

export const MitigationCenterView: React.FC<MitigationCenterViewProps> = ({
  onApplyMitigation,
  onNavigateToGraph,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('opt-a');
  const [appliedOptionId, setAppliedOptionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedOption = 
    MITIGATION_OPTIONS_FOLLOW_REDIRECTS.find((opt) => opt.id === selectedOptionId) ||
    MITIGATION_OPTIONS_FOLLOW_REDIRECTS[0];

  const handleApply = (opt: MitigationOption) => {
    setAppliedOptionId(opt.id);
    if (onApplyMitigation) {
      onApplyMitigation(opt.projectedRisk);
    }
  };

  const handleReset = () => {
    setAppliedOptionId(null);
    if (onApplyMitigation) {
      onApplyMitigation(92);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner Context */}
      <div className="p-4 rounded-lg bg-[#111925] border border-[#263244] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-100 font-display flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              MINIMUM INTERVENTION OPTIMIZATION
            </h2>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold">
              Break the Chain
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Find the smallest code or configuration change that achieves the largest downstream consequence reduction across your dependency tree.
          </p>
        </div>

        {/* Global Risk Header indicator */}
        <div className="flex items-center gap-4 bg-[#0B111A] border border-[#263244] p-2.5 rounded-lg font-mono text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">CURRENT ECOSYSTEM RISK</span>
            <span className={`text-xl font-bold ${appliedOptionId ? 'text-emerald-400' : 'text-red-400'}`}>
              {appliedOptionId ? selectedOption.projectedRisk : 92}
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </span>
          </div>
          {appliedOptionId && (
            <div className="border-l border-[#263244] pl-3">
              <span className="text-emerald-400 text-[10px] font-bold block uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Patched Virtually
              </span>
              <button
                onClick={handleReset}
                className="text-[10px] text-slate-400 underline hover:text-slate-200 mt-0.5 flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5" /> Reset to Baseline
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Intervention Banner Callout */}
      <div className="p-5 rounded-lg bg-gradient-to-r from-blue-950/30 to-[#111925] border border-cyan-500/40 relative overflow-hidden shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Recommended Intervention
              </span>
              <RiskBadge level="IMMEDIATE" size="sm" />
            </div>

            <h3 className="text-base font-bold text-slate-100 font-display">
              Option A: Patch follow-redirects to v1.15.11
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              <strong className="text-cyan-300">Why recommended:</strong> Recommended because one single dependency upgrade removes 6 downstream exposure paths while requiring changes to only one package.
            </p>
          </div>

          <div className="text-right shrink-0 font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Risk Reduction</span>
            <span className="text-3xl font-bold text-emerald-400">66%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">92 → 31 Exposure</span>
          </div>
        </div>

        {/* Visual Bar Before vs After Comparison */}
        <div className="mt-4 pt-4 border-t border-[#263244]/80 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>RISK BEFORE INTERVENTION:</span>
            <span className="text-red-400 font-bold">92 / 100 (HIGH EXPOSURE)</span>
          </div>
          <div className="w-full h-3 bg-[#0B111A] rounded-full overflow-hidden border border-[#263244]">
            <div className="h-full bg-red-500 rounded-full" style={{ width: '92%' }} />
          </div>

          <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1">
            <span>RISK AFTER RECOMMENDED INTERVENTION:</span>
            <span className="text-emerald-400 font-bold">31 / 100 (-66% REDUCTION)</span>
          </div>
          <div className="w-full h-3 bg-[#0B111A] rounded-full overflow-hidden border border-[#263244]">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: '31%' }} />
          </div>
        </div>
      </div>

      {/* Generated Mitigation Options Grid */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
          Evaluated Intervention Options ({MITIGATION_OPTIONS_FOLLOW_REDIRECTS.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MITIGATION_OPTIONS_FOLLOW_REDIRECTS.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isApplied = appliedOptionId === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#151E2B] border-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'bg-[#111925] border-[#263244] hover:border-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {opt.id.toUpperCase()}
                    </span>
                    <RiskBadge level={opt.priority} size="sm" />
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 font-display">
                    {opt.title}
                  </h4>

                  <div className="mt-3 space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Changes required:</span>
                      <strong className="text-slate-200">{opt.changesRequired} package</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Services protected:</span>
                      <strong className="text-cyan-300">{opt.servicesProtected} applications</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Risk transition:</span>
                      <strong className="text-slate-100">
                        {opt.initialRisk} → <span className="text-emerald-400">{opt.projectedRisk}</span>
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Risk reduction:</span>
                      <strong className="text-emerald-400">{opt.riskReductionPercentage}%</strong>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] text-slate-400 leading-relaxed font-sans">
                    {opt.explanation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#263244] flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(opt);
                    }}
                    className={`w-full py-1.5 px-3 rounded text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      isApplied
                        ? 'bg-emerald-600 text-white shadow'
                        : opt.isRecommended
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                        : 'bg-[#192333] hover:bg-[#202c40] text-slate-200 border border-[#263244]'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Virtual Patch Active
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        Test Apply Intervention
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Option Execution Manifest & Terminal Snippet */}
      <div className="p-5 rounded-lg bg-[#111925] border border-[#263244] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">
              Intervention Implementation Snippet ({selectedOption.targetPackage})
            </h4>
          </div>

          <button
            onClick={() => handleCopyCode(selectedOption.pullRequestSnippet)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B111A] hover:bg-[#192333] border border-[#263244] text-[11px] font-mono text-cyan-300 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Lockfile Directive'}</span>
          </button>
        </div>

        <pre className="p-3.5 rounded bg-[#070B12] border border-[#263244] font-mono text-xs text-slate-300 overflow-x-auto">
          <code>{selectedOption.pullRequestSnippet}</code>
        </pre>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Apply this directive to your root <code className="text-slate-200 font-mono">package.json</code> or resolution lockfile.</span>
          {onNavigateToGraph && (
            <button
              onClick={onNavigateToGraph}
              className="text-cyan-400 hover:text-cyan-300 underline font-mono flex items-center gap-1"
            >
              Verify in Dependency Graph
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
