import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Calendar, 
  CheckCircle2, 
  ShieldAlert, 
  Activity, 
  Wrench, 
  Layers, 
  Eye, 
  X 
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

export const ReportsView: React.FC = () => {
  const [activePreviewReport, setActivePreviewReport] = useState<string | null>(null);

  const reports = [
    {
      id: 'supply-chain-audit',
      title: 'Enterprise Supply Chain Security Assessment',
      subtitle: 'Comprehensive audit of 184 dependencies across 23 microservices',
      date: 'Generated today at 10:45 AM',
      author: 'RippleShield Intelligence Core',
      type: 'Executive Brief',
      status: 'CRITICAL ATTENTION',
      highlights: [
        '7 dependencies with high downstream exposure identified',
        'follow-redirects poses immediate risk across 6 internal services',
        'Average downstream reach of critical nodes: 4.7x',
      ],
      filename: 'RippleShield-SupplyChain-Assessment.json',
    },
    {
      id: 'critical-nodes',
      title: 'Critical Consequence Nodes & KEV Correlation',
      subtitle: 'Downstream exposure ranking prioritizing CISA KEV catalogue entries',
      date: 'Generated 2 hours ago',
      author: 'Vulnerability Engine',
      type: 'Technical Audit',
      status: 'HIGH RISK',
      highlights: [
        'follow-redirects (CVSS 8.1, EPSS 74%) mapped to payment pipelines',
        'jsonwebtoken and jws signature bypass risk in Auth Service',
        'Transitive prototype pollution in minimist and qs',
      ],
      filename: 'RippleShield-Critical-Nodes.json',
    },
    {
      id: 'blast-radius',
      title: 'Downstream Blast Radius & Cascade Analysis',
      subtitle: 'Simulated propagation pathways impacting Tier-1 revenue applications',
      date: 'Generated 1 day ago',
      author: 'Cascade Simulator',
      type: 'Topology Mapping',
      status: 'ACTION REQUIRED',
      highlights: [
        'Payment Gateway & Checkout cart direct exposure validated',
        'Identity master signing key path documented',
        'Multi-layer dependency reach of 17 packages',
      ],
      filename: 'RippleShield-BlastRadius-Topology.json',
    },
    {
      id: 'mitigation-roi',
      title: 'Minimum Intervention Risk Reduction Plan',
      subtitle: 'Optimized package upgrade roadmap maximizing risk reduction with minimal code change',
      date: 'Generated 3 days ago',
      author: 'Optimization Engine',
      type: 'Remediation Roadmap',
      status: 'READY TO MERGE',
      highlights: [
        '1 package upgrade yields 66% ecosystem risk reduction',
        'Virtual validation confirmed zero breaking changes',
        'Lockfile resolution PR prepared for deployment',
      ],
      filename: 'RippleShield-Mitigation-Plan.json',
    },
  ];

  const handleDownload = (filename: string, title: string) => {
    const data = {
      report: title,
      generatedAt: new Date().toISOString(),
      platform: 'RippleShield Consequence-Aware Supply Chain Intelligence',
      totalDependencies: 184,
      criticalNodes: 7,
      recommendedIntervention: {
        package: 'follow-redirects',
        targetVersion: '1.15.11',
        riskReduction: '66%',
        servicesProtected: 6,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className="p-4 rounded-lg bg-[#111925] border border-[#263244] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-100 font-display flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            GOVERNANCE, AUDIT & EXPORT REPORTS
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Export executive summaries, SBOM topological graphs, and consequence analyses for SOC compliance and engineering leads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload('RippleShield-Full-Ecosystem-Audit.json', 'Complete Supply Chain Consequence Audit')}
            className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            Download Complete Audit (JSON)
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-5 rounded-lg bg-[#111925] border border-[#263244] hover:border-slate-500 transition-colors flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                  {report.type}
                </span>
                <RiskBadge level={report.status.includes('CRITICAL') ? 'CRITICAL' : 'HIGH'} size="sm" />
              </div>

              <h3 className="text-sm font-bold text-slate-100 font-display">
                {report.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {report.subtitle}
              </p>

              <div className="mt-4 pt-3 border-t border-[#263244] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-semibold">
                  Key Findings
                </span>
                {report.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#263244] flex items-center justify-between font-mono text-xs">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {report.date}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePreviewReport(report.title)}
                  className="px-2.5 py-1 rounded bg-[#0B111A] hover:bg-[#192333] border border-[#263244] text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
                <button
                  onClick={() => handleDownload(report.filename, report.title)}
                  className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 text-blue-300 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Download className="w-3 h-3" />
                  Export
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {activePreviewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#111925] border border-[#263244] rounded-lg shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#263244]">
              <h4 className="text-sm font-bold text-slate-100 font-display">
                Report Preview: {activePreviewReport}
              </h4>
              <button
                onClick={() => setActivePreviewReport(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded bg-[#070B12] border border-[#263244] font-mono text-xs text-slate-300 space-y-2">
              <p className="text-cyan-400 font-bold">RIPPLESHIELD SUPPLY CHAIN REPORT</p>
              <p className="text-slate-400">Generated: {new Date().toLocaleDateString()} for Enterprise DevSecOps</p>
              <div className="h-px bg-[#263244] my-2" />
              <p>Total Evaluated Dependencies: 184</p>
              <p>Critical Consequence Nodes: 7</p>
              <p>Max Propagation Blast Radius: 17 downstream packages, 6 apps</p>
              <p>Recommended Immediate Action: Upgrade follow-redirects to v1.15.11</p>
              <p className="text-emerald-400">Projected System Risk Reduction: 66% (Score: 92 → 31)</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActivePreviewReport(null)}
                className="px-3 py-1.5 rounded text-xs font-mono text-slate-300 border border-[#263244]"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownload('report-export.json', activePreviewReport);
                  setActivePreviewReport(null);
                }}
                className="px-3.5 py-1.5 rounded text-xs font-mono bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Full Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
