import React, { useState } from 'react';
import { UploadCloud, FileJson, CheckCircle2, Loader2, X, AlertCircle } from 'lucide-react';

interface UploadSBOMModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestSuccess: () => void;
}

export const UploadSBOMModal: React.FC<UploadSBOMModalProps> = ({
  isOpen,
  onClose,
  onIngestSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'cyclonedx' | 'spdx'>('cyclonedx');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const analysisSteps = [
    { label: 'Parsing SBOM Schema & Package Manifest', progress: 25 },
    { label: 'Building Dependency Graph & Topological Hierarchy', progress: 50 },
    { label: 'Enriching Vulnerabilities (NVD, OSV, CISA KEV)', progress: 75 },
    { label: 'Calculating Ripple Risk & Propagation Radius', progress: 100 },
  ];

  const handleStartAnalysis = () => {
    setIsProcessing(true);
    setStepIndex(0);

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < 3) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsProcessing(false);
          setIsDone(true);
          return 3;
        }
      });
    }, 600);
  };

  const handleFinish = () => {
    setIsDone(false);
    setIsProcessing(false);
    setFile(null);
    onIngestSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="upload-sbom-dialog"
        className="w-full max-w-lg bg-[#111925] border border-[#263244] rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#263244] flex items-center justify-between bg-[#151E2B]/80">
          <div className="flex items-center gap-2.5">
            <UploadCloud className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100 font-display">
              Ingest Software Bill of Materials (SBOM)
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-[#192333] transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!isProcessing && !isDone ? (
            <>
              {/* Format selection */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                  Target Specification Standard
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormat('cyclonedx')}
                    className={`p-3 rounded border text-left transition-all ${
                      format === 'cyclonedx'
                        ? 'border-blue-500 bg-blue-500/10 text-slate-100'
                        : 'border-[#263244] bg-[#0B111A] text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span className="font-semibold text-xs block text-cyan-400 font-mono">CycloneDX 1.5</span>
                    <span className="text-[11px] text-slate-400">JSON Component Dependency Graph</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('spdx')}
                    className={`p-3 rounded border text-left transition-all ${
                      format === 'spdx'
                        ? 'border-blue-500 bg-blue-500/10 text-slate-100'
                        : 'border-[#263244] bg-[#0B111A] text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span className="font-semibold text-xs block text-cyan-400 font-mono">SPDX 2.3</span>
                    <span className="text-[11px] text-slate-400">ISO/IEC 5962 Standard JSON</span>
                  </button>
                </div>
              </div>

              {/* Upload Drop Zone */}
              <div
                onClick={() => {
                  // Simulate picking a sample SBOM
                  setFile(new File(['{}'], 'enterprise-production-bom.json', { type: 'application/json' }));
                }}
                className="border-2 border-dashed border-[#263244] hover:border-blue-500/60 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-[#0B111A] transition-colors group"
              >
                <div className="p-3 rounded-full bg-[#151E2B] text-cyan-400 group-hover:scale-110 transition-transform mb-3">
                  <FileJson className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-slate-200">
                  {file ? file.name : 'Click to select SBOM file (.json) or drag & drop'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  Accepts CycloneDX 1.4/1.5 & SPDX 2.3 JSON (Simulated fast parser)
                </p>
              </div>

              {/* Sample note */}
              <div className="p-3 rounded bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Clicking the dropzone above will automatically load the enterprise sample manifest (<code className="font-mono text-cyan-300">production-stack-sbom.json</code>) with 184 dependencies and 23 applications.
                </span>
              </div>
            </>
          ) : isProcessing ? (
            /* Progress State */
            <div className="py-6 space-y-6 text-center">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
                <h4 className="text-sm font-semibold text-slate-100 font-display">
                  Analyzing Dependency Ecosystem...
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Parsing topological dependencies and mapping cascade vectors
                </p>
              </div>

              <div className="space-y-3 text-left">
                {analysisSteps.map((step, idx) => {
                  const isCurrent = idx === stepIndex;
                  const isFinished = idx < stepIndex;

                  return (
                    <div key={step.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className={`${isCurrent ? 'text-cyan-400 font-semibold' : isFinished ? 'text-slate-300' : 'text-slate-600'}`}>
                          {step.label}
                        </span>
                        <span className="text-slate-500">
                          {isFinished ? '100%' : isCurrent ? `${step.progress}%` : 'Pending'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0B111A] rounded-full overflow-hidden border border-[#263244]">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isFinished ? 'bg-cyan-500' : isCurrent ? 'bg-blue-500 animate-pulse' : 'bg-transparent'
                          }`}
                          style={{ width: isFinished ? '100%' : isCurrent ? `${step.progress}%` : '0%' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Done State */
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-slate-100 font-display">
                Analysis Complete
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Successfully ingested and computed consequence topology for <strong className="text-slate-200">184 packages</strong> across <strong className="text-slate-200">23 connected applications</strong>.
              </p>
              <div className="inline-block p-2.5 rounded bg-[#0B111A] border border-[#263244] text-xs font-mono text-cyan-400">
                Identified 7 critical consequence nodes requiring attention.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#263244] bg-[#151E2B]/80 flex items-center justify-end gap-3">
          {!isDone ? (
            <>
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="px-3.5 py-1.5 rounded text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-[#192333] border border-[#263244] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStartAnalysis}
                disabled={isProcessing}
                className="px-4 py-1.5 rounded text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
              >
                Ingest & Analyze
              </button>
            </>
          ) : (
            <button
              onClick={handleFinish}
              className="px-4 py-1.5 rounded text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
            >
              Load In Ecosystem Graph
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
