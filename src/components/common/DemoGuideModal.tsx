import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  X, 
  Activity, 
  Wrench, 
  GitFork, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteStep: (stepNumber: number) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onExecuteStep,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Step 1: The Overview Dashboard',
      subtitle: 'Establish ecosystem scale and concentration of consequence',
      description:
        'Point out the 184 dependencies and 23 applications, but emphasize that only 7 critical nodes account for the majority of structural downstream risk.',
      actionLabel: 'Go to Overview',
      execute: () => onExecuteStep(1),
    },
    {
      step: 2,
      title: 'Step 2: Core Philosophy Callout',
      subtitle: 'Consequence-Aware vs Vulnerability-Only',
      description:
        '"Traditional tools ask: Which dependency is vulnerable? RippleShield asks: What happens if it fails? Where should we intervene to stop the ripple?"',
      actionLabel: 'Inspect Philosophy Banner',
      execute: () => onExecuteStep(2),
    },
    {
      step: 3,
      title: 'Step 3: Dependency Topological Graph',
      subtitle: 'Explore direct and deep transitive package structures',
      description:
        'Navigate to the live network graph. Show how low-level libraries (layer 4) underpin high-level customer-facing applications.',
      actionLabel: 'Open Dependency Graph',
      execute: () => onExecuteStep(3),
    },
    {
      step: 4,
      title: 'Step 4: Select follow-redirects',
      subtitle: 'Inspect the high-consequence zero-day node',
      description:
        'Select follow-redirects. Notice it has 17 downstream dependents, affects 6 applications, touches 3 critical services, and sits at layer 4 depth.',
      actionLabel: 'Inspect follow-redirects Node',
      execute: () => onExecuteStep(4),
    },
    {
      step: 5,
      title: 'Step 5: Explain Risk Breakdown',
      subtitle: 'Why is this high risk compared to CVSS-alone?',
      description:
        'Open the multi-signal Explain Risk dialog. See the exact weighted synthesis of EPSS, KEV exploitation, downstream reach, and critical service exposure.',
      actionLabel: 'Open Explain Risk Dialog',
      execute: () => onExecuteStep(5),
    },
    {
      step: 6,
      title: 'Step 6: Launch Ripple Simulator',
      subtitle: 'Simulate compromise propagation in real-time',
      description:
        'Trigger the 5-step ripple propagation sequence. Watch the compromise spread from follow-redirects → direct dependents → transitive layers → applications → Tier-1 critical services.',
      actionLabel: 'Launch Simulator & Propagate',
      execute: () => onExecuteStep(6),
    },
    {
      step: 7,
      title: 'Step 7: Blast Radius & Impact Paths',
      subtitle: 'Verify critical service cascading paths',
      description:
        'Examine the computed blast radius: 17 packages affected, 3 critical services (Checkout, Payment API, Auth). Click the cascade paths to trace the compromise vector to customer transaction data.',
      actionLabel: 'Review Blast Radius & Paths',
      execute: () => onExecuteStep(7),
    },
    {
      step: 8,
      title: 'Step 8: Mitigation Center (Climax)',
      subtitle: 'Minimum intervention for maximum consequence reduction',
      description:
        'Navigate to Mitigation Center. Show Option A: 1 package upgrade to follow-redirects v1.15.11 reduces ecosystem risk by 66% (92 → 31) while protecting 6 applications. Apply the virtual patch to verify!',
      actionLabel: 'View Mitigation & Apply Patch',
      execute: () => onExecuteStep(8),
    },
  ];

  const activeStepData = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      steps[nextStep - 1].execute();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      steps[prevStep - 1].execute();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0B111A] border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#111925] border-b border-[#263244] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-blue-600/20 text-cyan-300 border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">
                Guided Presentation Walkthrough
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Official 8-Step Consequence-Aware Security Workflow
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#192333]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="px-5 py-2.5 bg-[#070B12] border-b border-[#263244] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((s) => (
              <button
                key={s.step}
                onClick={() => {
                  setCurrentStep(s.step);
                  s.execute();
                }}
                className={`w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                  currentStep === s.step
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30 scale-110'
                    : currentStep > s.step
                    ? 'bg-blue-900/60 text-cyan-300 border border-blue-500/40'
                    : 'bg-[#151E2B] text-slate-500'
                }`}
              >
                {s.step}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-cyan-400 font-semibold">
            Step {currentStep} of {steps.length}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
              {activeStepData.subtitle}
            </span>
            <h4 className="text-lg font-bold text-slate-100 font-display mt-1">
              {activeStepData.title}
            </h4>
          </div>

          <div className="p-4 rounded-lg bg-[#111925] border border-[#263244] text-sm text-slate-300 leading-relaxed font-sans">
            {activeStepData.description}
          </div>

          <div className="pt-2">
            <button
              onClick={() => activeStepData.execute()}
              className="w-full py-2.5 px-4 rounded bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
            >
              <Activity className="w-4 h-4" />
              {activeStepData.actionLabel}
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-[#111925] border-t border-[#263244] flex items-center justify-between font-mono text-xs">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-3 py-1.5 rounded bg-[#0B111A] text-slate-300 hover:text-white border border-[#263244] disabled:opacity-40 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === steps.length}
            className="px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 transition-colors flex items-center gap-1 font-semibold"
          >
            Next Step
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
