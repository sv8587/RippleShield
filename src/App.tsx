import React, { useState, useMemo } from 'react';
import { 
  MOCK_NODES, 
  MOCK_LINKS, 
  ECOSYSTEM_STATS 
} from './data/mockDataset';
import { GraphNode, EcosystemStats } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { OverviewView } from './views/OverviewView';
import { DependencyGraphView } from './views/DependencyGraphView';
import { RiskIntelligenceView } from './views/RiskIntelligenceView';
import { RippleSimulatorView } from './views/RippleSimulatorView';
import { MitigationCenterView } from './views/MitigationCenterView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { DependencyDrawer } from './components/common/DependencyDrawer';
import { ExplainRiskModal } from './components/common/ExplainRiskModal';
import { UploadSBOMModal } from './components/common/UploadSBOMModal';
import { DemoGuideModal } from './components/common/DemoGuideModal';

export default function App() {
  const [activeView, setActiveView] = useState<string>('overview');
  const [nodes, setNodes] = useState<GraphNode[]>(MOCK_NODES);
  const [links] = useState(MOCK_LINKS);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [explainModalNode, setExplainModalNode] = useState<GraphNode | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);

  // Active simulated ecosystem risk (default 92, reducible to 31 in Mitigation Center)
  const [ecosystemRiskScore, setEcosystemRiskScore] = useState<number>(92);
  const [isMitigated, setIsMitigated] = useState<boolean>(false);

  // Compute dynamic stats based on mitigation
  const currentStats: EcosystemStats = useMemo(() => {
    if (isMitigated) {
      return {
        ...ECOSYSTEM_STATS,
        riskExposureLevel: 'LOW',
        riskExposureTrend: '↓ 66% with intervention',
        criticalNodesCount: 2,
        vulnerabilitiesImmediate: 1,
      };
    }
    return ECOSYSTEM_STATS;
  }, [isMitigated]);

  // Handle node selection from graph or list
  const handleSelectNode = (node: GraphNode) => {
    setSelectedNode(node);
    setIsDrawerOpen(true);
  };

  const handleSelectNodeByName = (name: string) => {
    const found = nodes.find((n) => n.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setSelectedNode(found);
      setIsDrawerOpen(true);
    }
  };

  // Handle opening Explain Risk modal
  const handleOpenExplainRisk = (node: GraphNode) => {
    setExplainModalNode(node);
    setIsExplainModalOpen(true);
  };

  // Quick navigation to simulator with pre-selected node
  const handleNavigateToSimulator = (nodeId?: string) => {
    if (nodeId) {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) setSelectedNode(node);
    }
    setActiveView('ripple-simulator');
  };

  // Quick navigation to mitigation
  const handleNavigateToMitigation = () => {
    setActiveView('mitigation-center');
  };

  // Handle virtual patch application from Mitigation Center
  const handleApplyMitigation = (newRiskScore: number) => {
    setEcosystemRiskScore(newRiskScore);
    setIsMitigated(newRiskScore < 50);
  };

  // Ingested SBOM handler
  const handleSBOMUploaded = (newCount: number) => {
    // Notify user
  };

  // Demo Guide 8-step executor
  const handleExecuteDemoStep = (stepNumber: number) => {
    const followRedirectsNode = nodes.find((n) => n.id === 'dep-follow-redirects') || nodes[0];

    switch (stepNumber) {
      case 1:
        setActiveView('overview');
        setIsDrawerOpen(false);
        setIsExplainModalOpen(false);
        break;
      case 2:
        setActiveView('overview');
        break;
      case 3:
        setActiveView('graph');
        setIsDrawerOpen(false);
        break;
      case 4:
        setActiveView('graph');
        setSelectedNode(followRedirectsNode);
        setIsDrawerOpen(true);
        break;
      case 5:
        setExplainModalNode(followRedirectsNode);
        setIsExplainModalOpen(true);
        break;
      case 6:
        setActiveView('ripple-simulator');
        setIsExplainModalOpen(false);
        setIsDrawerOpen(false);
        setSelectedNode(followRedirectsNode);
        break;
      case 7:
        setActiveView('ripple-simulator');
        break;
      case 8:
        setActiveView('mitigation-center');
        break;
      default:
        setActiveView('overview');
    }
  };

  // View context titles
  const viewMeta: Record<string, { title: string; subtitle: string }> = {
    overview: {
      title: 'Supply Chain Overview',
      subtitle: 'Understand where dependency risk exists and how it can propagate.',
    },
    graph: {
      title: 'Dependency Graph',
      subtitle: 'Interactive topological mapping of direct and deep transitive open-source packages.',
    },
    'risk-intelligence': {
      title: 'Risk Intelligence',
      subtitle: 'Prioritize dependencies by ecosystem consequence, not severity alone.',
    },
    'ripple-simulator': {
      title: 'Ripple Simulator',
      subtitle: 'Simulate how a dependency compromise propagates through your ecosystem.',
    },
    'mitigation-center': {
      title: 'Mitigation Center',
      subtitle: 'Find the intervention that reduces the greatest downstream exposure.',
    },
    reports: {
      title: 'Reports & Governance',
      subtitle: 'Executive summaries, exportable JSON manifests, and consequence audits.',
    },
    settings: {
      title: 'Settings & Algorithms',
      subtitle: 'Calibrate EPSS, KEV exploitation, and downstream depth consequence multipliers.',
    },
  };

  const currentMeta = viewMeta[activeView] || viewMeta.overview;

  return (
    <div className="flex h-screen w-screen bg-[#070B12] text-slate-100 overflow-hidden font-sans select-none">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          onOpenUploadSBOM={() => setIsUploadModalOpen(true)}
          onSelectNodeByName={handleSelectNodeByName}
          availableNodes={nodes}
        />

        {/* Dynamic View Scroll Area */}
        <main className="flex-1 overflow-y-auto px-6 py-5 cyber-scrollbar">
          {activeView === 'overview' && (
            <OverviewView
              stats={currentStats}
              nodes={nodes}
              links={links}
              onSelectNode={handleSelectNode}
              onNavigateToSimulator={handleNavigateToSimulator}
              onNavigateToMitigation={handleNavigateToMitigation}
              onNavigateToRiskIntel={() => setActiveView('risk-intelligence')}
            />
          )}

          {activeView === 'graph' && (
            <DependencyGraphView
              nodes={nodes}
              links={links}
              selectedNode={selectedNode}
              onSelectNode={handleSelectNode}
              onSimulate={handleNavigateToSimulator}
              onMitigate={() => setActiveView('mitigation-center')}
              onExplainRisk={handleOpenExplainRisk}
            />
          )}

          {activeView === 'risk-intelligence' && (
            <RiskIntelligenceView
              nodes={nodes}
              onSelectNode={handleSelectNode}
              onSimulate={handleNavigateToSimulator}
              onMitigate={() => setActiveView('mitigation-center')}
              onExplainRisk={handleOpenExplainRisk}
            />
          )}

          {activeView === 'ripple-simulator' && (
            <RippleSimulatorView
              nodes={nodes}
              links={links}
              initialNodeId={selectedNode?.id || 'dep-follow-redirects'}
              onNavigateToMitigation={handleNavigateToMitigation}
              onSelectNode={handleSelectNode}
            />
          )}

          {activeView === 'mitigation-center' && (
            <MitigationCenterView
              onApplyMitigation={handleApplyMitigation}
              onNavigateToGraph={() => setActiveView('graph')}
            />
          )}

          {activeView === 'reports' && <ReportsView />}

          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Interactive Inspection Slide-out Drawer */}
      <DependencyDrawer
        isOpen={isDrawerOpen}
        node={selectedNode}
        onClose={() => setIsDrawerOpen(false)}
        onSimulate={handleNavigateToSimulator}
        onMitigate={() => {
          setIsDrawerOpen(false);
          setActiveView('mitigation-center');
        }}
        onExplainRisk={handleOpenExplainRisk}
      />

      {/* Explain Risk Modal */}
      <ExplainRiskModal
        isOpen={isExplainModalOpen}
        node={explainModalNode}
        onClose={() => setIsExplainModalOpen(false)}
        onSimulate={handleNavigateToSimulator}
        onMitigate={() => {
          setIsExplainModalOpen(false);
          setActiveView('mitigation-center');
        }}
      />

      {/* Upload SBOM Ingestion Modal */}
      <UploadSBOMModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleSBOMUploaded}
      />

      {/* Guided 8-Step Presentation Demo Modal */}
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onExecuteStep={handleExecuteDemoStep}
      />
    </div>
  );
}
