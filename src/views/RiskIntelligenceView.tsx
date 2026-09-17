import React, { useState, useMemo } from 'react';
import { RISK_TABLE_DATA } from '../data/mockDataset';
import { GraphNode } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  HelpCircle, 
  Activity, 
  Wrench, 
  Search, 
  Download, 
  Filter, 
  Layers, 
  ShieldAlert,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface RiskIntelligenceViewProps {
  nodes: GraphNode[];
  onSelectNode: (node: GraphNode) => void;
  onSimulate: (nodeId: string) => void;
  onMitigate: (nodeId: string) => void;
  onExplainRisk: (node: GraphNode) => void;
}

type SortField = 'rippleRisk' | 'cvss' | 'epss' | 'dependentsCount' | 'criticalServicesCount' | 'propagationDepth';
type SortOrder = 'asc' | 'desc';

export const RiskIntelligenceView: React.FC<RiskIntelligenceViewProps> = ({
  nodes,
  onSelectNode,
  onSimulate,
  onMitigate,
  onExplainRisk,
}) => {
  const [sortField, setSortField] = useState<SortField>('rippleRisk');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedData = useMemo(() => {
    return [...RISK_TABLE_DATA]
      .filter((item) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (!item.name.toLowerCase().includes(q) && !item.version.includes(q)) return false;
        }
        if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [sortField, sortOrder, searchQuery, statusFilter]);

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-600 inline ml-1" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-cyan-400 inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-cyan-400 inline ml-1" />
    );
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header Context */}
      <div className="p-4 rounded-lg bg-[#111925] border border-[#263244] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-100 font-display flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            CONSEQUENCE-AWARE RISK PRIORITIZATION
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Prioritize dependencies by <strong>ecosystem consequence</strong>, not severity alone. Structural cascade reach and critical service downstream connectivity elevate true operational exposure.
          </p>
        </div>

        {/* Philosophy Comparison Box */}
        <div className="p-2.5 rounded bg-[#0B111A] border border-[#263244] text-[11px] font-mono text-slate-400 flex items-center gap-3">
          <div className="text-right">
            <span className="text-slate-500 block">CVSS-Only Lens:</span>
            <span className="text-slate-300 font-semibold">protobufjs (CVSS 9.8)</span>
          </div>
          <span className="text-cyan-400 font-bold text-sm">vs</span>
          <div>
            <span className="text-cyan-400 block font-semibold">RippleShield Lens:</span>
            <span className="text-red-400 font-bold">follow-redirects (Risk 92)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111925] p-3 rounded-lg border border-[#263244]">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by package name or version..."
              className="w-full bg-[#0B111A] border border-[#263244] text-xs text-slate-200 placeholder-slate-500 rounded pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1">
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#192333]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Displaying {sortedData.length} analyzed components</span>
        </div>
      </div>

      {/* Main Sortable Table */}
      <div className="bg-[#111925] border border-[#263244] rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[#263244] bg-[#151E2B] text-slate-400 select-none text-[11px]">
                <th className="py-3 px-4 font-semibold">Dependency</th>
                <th className="py-3 px-3 font-semibold">Version</th>
                <th 
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-200"
                  onClick={() => handleSort('cvss')}
                >
                  CVSS {renderSortIndicator('cvss')}
                </th>
                <th 
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-200"
                  onClick={() => handleSort('epss')}
                >
                  EPSS {renderSortIndicator('epss')}
                </th>
                <th className="py-3 px-3 font-semibold">KEV</th>
                <th 
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-200"
                  onClick={() => handleSort('dependentsCount')}
                >
                  Dependents {renderSortIndicator('dependentsCount')}
                </th>
                <th 
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-200"
                  onClick={() => handleSort('criticalServicesCount')}
                >
                  Critical Services {renderSortIndicator('criticalServicesCount')}
                </th>
                <th 
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-200"
                  onClick={() => handleSort('propagationDepth')}
                >
                  Propagation Depth {renderSortIndicator('propagationDepth')}
                </th>
                <th 
                  className="py-3 px-4 font-semibold cursor-pointer text-cyan-400 hover:text-cyan-300"
                  onClick={() => handleSort('rippleRisk')}
                >
                  Ripple Risk {renderSortIndicator('rippleRisk')}
                </th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#263244]/60">
              {sortedData.map((row) => {
                const fullNode = nodes.find((n) => n.id === row.id) || nodes[0];
                const isHero = row.id === 'dep-follow-redirects';

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-[#151E2B] transition-colors ${
                      isHero ? 'bg-red-950/15 font-semibold' : ''
                    }`}
                  >
                    {/* Dependency */}
                    <td className="py-3 px-4 text-slate-100 font-semibold flex items-center gap-2">
                      <span className="font-mono text-cyan-300 hover:underline cursor-pointer" onClick={() => onSelectNode(fullNode)}>
                        {row.name}
                      </span>
                      {isHero && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/60 border border-red-500/50 text-red-300 font-bold">
                          Top Risk
                        </span>
                      )}
                    </td>

                    {/* Version */}
                    <td className="py-3 px-3 text-slate-400">
                      v{row.version}
                    </td>

                    {/* CVSS */}
                    <td className="py-3 px-3 font-bold text-amber-400">
                      {row.cvss > 0 ? row.cvss.toFixed(1) : '0.0'}
                    </td>

                    {/* EPSS */}
                    <td className="py-3 px-3 font-semibold text-cyan-300">
                      {row.epss.toFixed(2)}
                    </td>

                    {/* KEV */}
                    <td className="py-3 px-3">
                      {row.inKev ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 border border-red-500/50 text-red-400">
                          YES
                        </span>
                      ) : (
                        <span className="text-slate-500">NO</span>
                      )}
                    </td>

                    {/* Dependents */}
                    <td className="py-3 px-3 text-slate-200">
                      <span className="font-bold">{row.dependentsCount}</span>
                      <span className="text-[10px] text-slate-500 ml-1">pkgs</span>
                    </td>

                    {/* Critical Services */}
                    <td className="py-3 px-3">
                      {row.criticalServicesCount > 0 ? (
                        <span className="font-bold text-red-400">
                          {row.criticalServicesCount} tier-1
                        </span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>

                    {/* Propagation Depth */}
                    <td className="py-3 px-3 text-slate-300">
                      Layer <span className="font-bold text-cyan-400">{row.propagationDepth}</span>
                    </td>

                    {/* Ripple Risk */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100">
                          {row.rippleRisk}
                        </span>
                        <div className="w-16 h-1.5 bg-[#0B111A] rounded-full overflow-hidden border border-[#263244]">
                          <div
                            className={`h-full rounded-full ${
                              row.rippleRisk >= 85
                                ? 'bg-red-500'
                                : row.rippleRisk >= 70
                                ? 'bg-orange-500'
                                : row.rippleRisk >= 40
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${row.rippleRisk}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <RiskBadge level={row.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onExplainRisk(fullNode)}
                          className="px-2 py-1 rounded bg-[#0B111A] hover:bg-[#192333] border border-[#263244] text-[11px] text-cyan-300 font-medium transition-colors"
                          title="Explain Risk Synthesis"
                        >
                          Explain Risk
                        </button>
                        <button
                          onClick={() => onSimulate(fullNode.id)}
                          className="p-1 rounded bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 text-blue-300 transition-colors"
                          title="Simulate Compromise Propagation"
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMitigate(fullNode.id)}
                          className="p-1 rounded bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/40 text-cyan-300 transition-colors"
                          title="Find Smallest Mitigation"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
