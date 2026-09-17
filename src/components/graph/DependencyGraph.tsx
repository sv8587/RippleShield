import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GraphNode, GraphLink, RiskLevel, NodeType } from '../../types';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Search, 
  Filter, 
  ShieldAlert, 
  Layers, 
  Sparkles,
  Play,
  ArrowRight,
  Eye,
  GitFork
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface DependencyGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNodeId?: string | null;
  onSelectNode: (node: GraphNode) => void;
  simulatingNodeId?: string | null;
  simulationStep?: number; // 0 to 6
  highlightMode?: 'downstream' | 'upstream' | 'both';
  filterType?: 'ALL' | 'DIRECT' | 'TRANSITIVE' | 'CRITICAL' | 'VULNERABLE';
  height?: string | number;
  showControls?: boolean;
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({
  nodes,
  links,
  selectedNodeId,
  onSelectNode,
  simulatingNodeId,
  simulationStep = 0,
  highlightMode = 'downstream',
  filterType = 'ALL',
  height = '620px',
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
  const [transform, setTransform] = useState({ x: 40, y: 30, scale: 0.88 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>(filterType);
  const [traceDirection, setTraceDirection] = useState<'downstream' | 'upstream'>(
    highlightMode === 'upstream' ? 'upstream' : 'downstream'
  );

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute connected nodes for selected / hovered node
  const activeFocusId = simulatingNodeId || selectedNodeId || hoveredNodeId;

  const connectedInfo = useMemo(() => {
    if (!activeFocusId) return { downstream: new Set<string>(), upstream: new Set<string>() };

    const downstream = new Set<string>();
    const upstream = new Set<string>();

    // BFS Downstream: edges where source == current
    const queueDown = [activeFocusId];
    while (queueDown.length > 0) {
      const curr = queueDown.shift()!;
      links.forEach((l) => {
        if (l.source === curr && !downstream.has(l.target)) {
          downstream.add(l.target);
          queueDown.push(l.target);
        }
      });
    }

    // BFS Upstream: edges where target == current
    const queueUp = [activeFocusId];
    while (queueUp.length > 0) {
      const curr = queueUp.shift()!;
      links.forEach((l) => {
        if (l.target === curr && !upstream.has(l.source)) {
          upstream.add(l.source);
          queueUp.push(l.source);
        }
      });
    }

    return { downstream, upstream };
  }, [activeFocusId, links]);

  // Simulation affected nodes based on step
  const simulationAffectedNodeIds = useMemo(() => {
    const affected = new Set<string>();
    if (!simulatingNodeId || simulationStep === 0) return affected;

    affected.add(simulatingNodeId);

    if (simulationStep >= 1) {
      // Step 1: Target compromised node
      affected.add(simulatingNodeId);
    }
    if (simulationStep >= 2) {
      // Step 2: Direct dependents (e.g. axios, qs)
      links.forEach((l) => {
        if (l.source === simulatingNodeId) affected.add(l.target);
      });
    }
    if (simulationStep >= 3) {
      // Step 3: Transitive dependencies
      const layer2Nodes = Array.from(affected);
      links.forEach((l) => {
        if (layer2Nodes.includes(l.source)) affected.add(l.target);
      });
    }
    if (simulationStep >= 4) {
      // Step 4: Applications & Services
      nodes.forEach((n) => {
        if (connectedInfo.downstream.has(n.id)) affected.add(n.id);
      });
    }
    if (simulationStep >= 5) {
      // Step 5: Critical services highlight
      nodes.forEach((n) => {
        if (n.isBusinessCritical && connectedInfo.downstream.has(n.id)) {
          affected.add(n.id);
        }
      });
    }

    return affected;
  }, [simulatingNodeId, simulationStep, links, nodes, connectedInfo]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = node.name.toLowerCase().includes(q) || node.id.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category filter
      if (activeFilter === 'DIRECT') return node.type === 'direct_dep';
      if (activeFilter === 'TRANSITIVE') return node.type === 'transitive_dep';
      if (activeFilter === 'CRITICAL') return node.risk === 'CRITICAL';
      if (activeFilter === 'VULNERABLE') return node.vulnerabilityCount > 0;
      if (activeFilter === 'SHARED') return node.dependentsCount > 4;

      return true;
    });
  }, [nodes, searchQuery, activeFilter]);

  // Node color mapping
  const getNodeColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return { border: '#EF4444', fill: '#1E1218', text: '#FCA5A5', glow: 'rgba(239, 68, 68, 0.4)' };
      case 'HIGH':
        return { border: '#F97316', fill: '#1E1612', text: '#FDBA74', glow: 'rgba(249, 115, 22, 0.35)' };
      case 'MEDIUM':
        return { border: '#F59E0B', fill: '#1A1811', text: '#FCD34D', glow: 'rgba(245, 158, 11, 0.3)' };
      case 'LOW':
      default:
        return { border: '#22C55E', fill: '#0E1A14', text: '#86EFAC', glow: 'rgba(34, 197, 94, 0.25)' };
    }
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.graph-node') || (e.target as HTMLElement).closest('.graph-control')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newScale = Math.min(2.2, Math.max(0.4, transform.scale * zoomFactor));
    setTransform((prev) => ({ ...prev, scale: newScale }));
  };

  const zoomIn = () => {
    setTransform((prev) => ({ ...prev, scale: Math.min(2.5, prev.scale * 1.2) }));
  };

  const zoomOut = () => {
    setTransform((prev) => ({ ...prev, scale: Math.max(0.4, prev.scale * 0.8) }));
  };

  const resetView = () => {
    setTransform({ x: 60, y: 40, scale: 0.85 });
    setSearchQuery('');
    setActiveFilter('ALL');
  };

  return (
    <div 
      ref={containerRef}
      id="dependency-network-container"
      className="relative w-full rounded-lg bg-[#070B12] border border-[#263244] overflow-hidden cyber-grid select-none"
      style={{ height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Top Floating Control Bar */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Search & Filter pills */}
          <div className="flex items-center gap-2 pointer-events-auto bg-[#111925]/90 border border-[#263244] p-1.5 rounded-lg shadow-xl backdrop-blur-md">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search node (e.g. follow-redirects)..."
                className="bg-[#0B111A] border border-[#263244] text-xs text-slate-200 placeholder-slate-500 rounded pl-8 pr-3 py-1 w-52 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="h-4 w-px bg-[#263244]" />

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-1">
              {(['ALL', 'CRITICAL', 'DIRECT', 'TRANSITIVE', 'SHARED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#192333]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Trace direction toggle & zoom toolbar */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Downstream vs Upstream Toggle */}
            <div className="flex items-center bg-[#111925]/90 border border-[#263244] p-1 rounded-lg backdrop-blur-md">
              <button
                onClick={() => setTraceDirection('downstream')}
                className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  traceDirection === 'downstream'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Highlight Downstream Blast Radius Impact"
              >
                <ArrowRight className="w-3 h-3" />
                Downstream Impact
              </button>
              <button
                onClick={() => setTraceDirection('upstream')}
                className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  traceDirection === 'upstream'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Highlight Upstream Root Dependencies"
              >
                <GitFork className="w-3 h-3 rotate-180" />
                Upstream Root
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center bg-[#111925]/90 border border-[#263244] p-1 rounded-lg backdrop-blur-md text-slate-300">
              <button
                onClick={zoomIn}
                className="p-1.5 rounded hover:bg-[#192333] hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={zoomOut}
                className="p-1.5 rounded hover:bg-[#192333] hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetView}
                className="p-1.5 rounded hover:bg-[#192333] hover:text-white transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        <defs>
          {/* Arrow markers */}
          <marker
            id="arrowhead-default"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#263244" />
          </marker>
          <marker
            id="arrowhead-critical"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#EF4444" />
          </marker>
          <marker
            id="arrowhead-active"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#22D3EE" />
          </marker>

          {/* Gradients */}
          <linearGradient id="grad-ripple-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="grad-ripple-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Scaled and Panned Group */}
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {/* Tier Guide Background Bands */}
          <g opacity={0.35} pointerEvents="none">
            <text x="140" y="30" fill="#64748B" fontSize="11" fontFamily="monospace" fontWeight="600">
              [LAYER 4: DEEP TRANSITIVE]
            </text>
            <text x="280" y="30" fill="#64748B" fontSize="11" fontFamily="monospace" fontWeight="600">
              [LAYER 3: INTERMEDIARY]
            </text>
            <text x="440" y="30" fill="#64748B" fontSize="11" fontFamily="monospace" fontWeight="600">
              [LAYER 2: DIRECT DEPS]
            </text>
            <text x="640" y="30" fill="#64748B" fontSize="11" fontFamily="monospace" fontWeight="600">
              [LAYER 1: MICROSERVICES]
            </text>
            <text x="820" y="30" fill="#64748B" fontSize="11" fontFamily="monospace" fontWeight="600">
              [LAYER 0: APPLICATIONS]
            </text>

            {/* Vertical column guides */}
            <line x1="140" y1="40" x2="140" y2="760" stroke="#192333" strokeDasharray="3 3" />
            <line x1="280" y1="40" x2="280" y2="760" stroke="#192333" strokeDasharray="3 3" />
            <line x1="440" y1="40" x2="440" y2="760" stroke="#192333" strokeDasharray="3 3" />
            <line x1="640" y1="40" x2="640" y2="760" stroke="#192333" strokeDasharray="3 3" />
            <line x1="820" y1="40" x2="820" y2="760" stroke="#192333" strokeDasharray="3 3" />
          </g>

          {/* Links / Edges */}
          <g className="graph-links">
            {links.map((link) => {
              const srcNode = nodes.find((n) => n.id === link.source);
              const tgtNode = nodes.find((n) => n.id === link.target);
              if (!srcNode || !tgtNode) return null;

              const x1 = srcNode.x || 100;
              const y1 = srcNode.y || 100;
              const x2 = tgtNode.x || 300;
              const y2 = tgtNode.y || 100;

              // Check if link is on active ripple path
              const isSimulatingActive =
                simulationAffectedNodeIds.has(link.source) &&
                simulationAffectedNodeIds.has(link.target);

              // Check if link connects to active selected/hovered node
              const isDownstreamHighlighted =
                traceDirection === 'downstream' &&
                (activeFocusId === link.source || connectedInfo.downstream.has(link.source)) &&
                connectedInfo.downstream.has(link.target);

              const isUpstreamHighlighted =
                traceDirection === 'upstream' &&
                (activeFocusId === link.target || connectedInfo.upstream.has(link.target)) &&
                connectedInfo.upstream.has(link.source);

              const isHighlighted = isSimulatingActive || isDownstreamHighlighted || isUpstreamHighlighted;

              // Quadratic curve control point for cleaner orthogonal routing
              const dx = x2 - x1;
              const cx1 = x1 + dx * 0.5;
              const cy1 = y1;
              const cx2 = x1 + dx * 0.5;
              const cy2 = y2;
              const pathData = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

              let strokeColor = '#1F2937';
              let strokeWidth = 1.2;
              let markerEnd = 'url(#arrowhead-default)';

              if (isSimulatingActive) {
                strokeColor = '#EF4444';
                strokeWidth = 2.5;
                markerEnd = 'url(#arrowhead-critical)';
              } else if (isHighlighted) {
                strokeColor = '#22D3EE';
                strokeWidth = 2.0;
                markerEnd = 'url(#arrowhead-active)';
              } else if (link.isCriticalPath) {
                strokeColor = '#374151';
                strokeWidth = 1.5;
              }

              return (
                <g key={`${link.source}->${link.target}`}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={isSimulatingActive ? '6 3' : undefined}
                    className={isSimulatingActive ? 'animate-pulse' : 'transition-colors duration-300'}
                    markerEnd={markerEnd}
                  />
                  {/* Subtle animated dot traversing active highlighted paths */}
                  {(isSimulatingActive || isHighlighted) && (
                    <circle r="2.5" fill={isSimulatingActive ? '#EF4444' : '#22D3EE'}>
                      <animateMotion path={pathData} dur="2.4s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="graph-nodes">
            {filteredNodes.map((node) => {
              const x = node.x || 200;
              const y = node.y || 200;

              const isSelected = selectedNodeId === node.id;
              const isSimulatingRoot = simulatingNodeId === node.id;
              const isSimAffected = simulationAffectedNodeIds.has(node.id);

              const isConnected =
                activeFocusId === node.id ||
                (traceDirection === 'downstream' && connectedInfo.downstream.has(node.id)) ||
                (traceDirection === 'upstream' && connectedInfo.upstream.has(node.id));

              const isDimmed = activeFocusId && !isConnected && !isSimAffected;

              // Node size correlates with downstream reach
              const baseRadius = 
                node.type === 'application' 
                  ? 24 
                  : node.type === 'service' 
                  ? 20 
                  : Math.max(14, Math.min(22, 12 + node.dependentsCount * 0.5));

              const colors = getNodeColor(node.risk);

              return (
                <g
                  key={node.id}
                  id={`node-${node.id}`}
                  className="graph-node cursor-pointer group"
                  transform={`translate(${x}, ${y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(node);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  opacity={isDimmed ? 0.25 : 1}
                >
                  {/* Ripple pulse wave for simulating root */}
                  {isSimulatingRoot && (
                    <>
                      <circle
                        cx="0"
                        cy="0"
                        r={baseRadius}
                        fill="none"
                        stroke="#EF4444"
                        className="animate-ripple"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r={baseRadius + 6}
                        fill="none"
                        stroke="#EF4444"
                        strokeOpacity="0.4"
                        className="animate-pulse"
                      />
                    </>
                  )}

                  {/* Highlight ring for selected or simulation-affected */}
                  {(isSelected || isSimAffected) && (
                    <circle
                      cx="0"
                      cy="0"
                      r={baseRadius + 5}
                      fill="none"
                      stroke={isSimAffected ? '#EF4444' : '#3B82F6'}
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                  )}

                  {/* Main Node Shape: App is Rounded Square, Service is Octagon/Hex, Deps are Circles */}
                  {node.type === 'application' ? (
                    <rect
                      x={-baseRadius}
                      y={-baseRadius}
                      width={baseRadius * 2}
                      height={baseRadius * 2}
                      rx="6"
                      fill={isSimAffected ? '#2A1116' : colors.fill}
                      stroke={isSimAffected ? '#EF4444' : colors.border}
                      strokeWidth={isSelected || isSimAffected ? 2.5 : 1.5}
                      className="transition-all duration-300 group-hover:stroke-cyan-400"
                    />
                  ) : node.type === 'service' ? (
                    <rect
                      x={-baseRadius}
                      y={-baseRadius}
                      width={baseRadius * 2}
                      height={baseRadius * 2}
                      rx="12"
                      fill={isSimAffected ? '#2A1116' : colors.fill}
                      stroke={isSimAffected ? '#EF4444' : colors.border}
                      strokeWidth={isSelected || isSimAffected ? 2.5 : 1.5}
                      className="transition-all duration-300 group-hover:stroke-cyan-400"
                    />
                  ) : (
                    <circle
                      cx="0"
                      cy="0"
                      r={baseRadius}
                      fill={isSimAffected ? '#2A1116' : colors.fill}
                      stroke={isSimAffected ? '#EF4444' : colors.border}
                      strokeWidth={isSelected || isSimAffected ? 2.5 : 1.5}
                      className="transition-all duration-300 group-hover:stroke-cyan-400"
                    />
                  )}

                  {/* Center glyph or score indicator */}
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill={isSimAffected ? '#F87171' : colors.text}
                    fontSize={node.type === 'application' ? 10 : 9}
                    fontFamily="monospace"
                    fontWeight="700"
                    pointerEvents="none"
                  >
                    {node.rippleRisk}
                  </text>

                  {/* KEV or Critical Indicator Dot */}
                  {node.inKev && (
                    <circle
                      cx={baseRadius - 2}
                      cy={-baseRadius + 2}
                      r="4"
                      fill="#EF4444"
                      stroke="#070B12"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Node Label Below */}
                  <g transform={`translate(0, ${baseRadius + 14})`}>
                    <rect
                      x={-(node.name.length * 3.5 + 8)}
                      y="-9"
                      width={node.name.length * 7 + 16}
                      height="17"
                      rx="3"
                      fill="#0B111A"
                      stroke="#263244"
                      strokeWidth="0.8"
                      className="group-hover:stroke-cyan-500 transition-colors"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill={isSelected ? '#38BDF8' : '#E2E8F0'}
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="500"
                      pointerEvents="none"
                    >
                      {node.name}
                    </text>
                  </g>

                  {/* Version Sublabel */}
                  <text
                    x="0"
                    y={baseRadius + 32}
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="8.5"
                    fontFamily="monospace"
                    pointerEvents="none"
                  >
                    v{node.version}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-4 bg-[#111925]/90 border border-[#263244] px-3 py-2 rounded-lg backdrop-blur-md text-[10px] font-mono text-slate-400">
        <span className="text-slate-200 font-semibold uppercase tracking-wider">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Critical Risk (85-100)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span>High Risk (70-84)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Medium (40-69)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Low Risk (0-39)</span>
        </div>
        <div className="h-3 w-px bg-[#263244]" />
        <div className="flex items-center gap-1.5">
          <rect className="w-2.5 h-2.5 rounded-sm bg-blue-500/20 border border-blue-400 inline-block" />
          <span>Application</span>
        </div>
        <div className="flex items-center gap-1.5">
          <circle className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-400 inline-block" />
          <span>Dependency Node</span>
        </div>
      </div>
    </div>
  );
};
