export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type NodeType = 
  | 'application' 
  | 'service' 
  | 'direct_dep' 
  | 'transitive_dep';

export interface GraphNode {
  id: string;
  name: string;
  version: string;
  type: NodeType;
  risk: RiskLevel;
  rippleRisk: number; // 0 - 100
  cvss: number; // 0 - 10
  epss: number; // 0.0 - 1.0 (e.g., 0.74)
  inKev: boolean; // Known Exploited Vulnerabilities catalog
  dependentsCount: number; // Downstream reach
  dependenciesCount: number; // Upstream
  propagationDepth: number;
  criticalServicesCount: number;
  applicationsAffectedCount: number;
  license: string;
  ecosystem: string;
  vulnerabilityCount: number;
  cves: string[];
  isBusinessCritical?: boolean;
  dataSensitivity?: string;
  explanation: {
    summary: string;
    exploitability: string;
    dependencyReach: string;
    criticality: string;
    propagation: string;
    exposure: string;
  };
  // Coords for deterministic graph layout
  x?: number;
  y?: number;
  tier?: number; // 0: App, 1: Service, 2: Direct, 3: Transitive Tier 1, 4: Transitive Deep
}

export interface GraphLink {
  source: string;
  target: string;
  isCriticalPath?: boolean;
  type?: 'depends_on' | 'embeds' | 'calls';
}

export interface ImpactStep {
  nodeId: string;
  name: string;
  type: string;
  detail: string;
}

export interface ImpactPath {
  id: string;
  title: string;
  severity: RiskLevel;
  targetAsset: string;
  steps: ImpactStep[];
}

export interface MitigationOption {
  id: string;
  title: string;
  targetPackage: string;
  recommendedVersion: string;
  currentVersion: string;
  changesRequired: number;
  servicesProtected: number;
  initialRisk: number;
  projectedRisk: number;
  riskReductionPercentage: number;
  priority: 'IMMEDIATE' | 'HIGH' | 'MEDIUM';
  explanation: string;
  isRecommended: boolean;
  pullRequestSnippet: string;
}

export interface SimulationState {
  targetNodeId: string;
  isRunning: boolean;
  currentStep: number; // 0: Idle, 1: Source, 2: Direct, 3: Transitive, 4: Apps, 5: Critical Services, 6: Complete
  activeAffectedNodeIds: Set<string>;
  activeAffectedLinkKeys: Set<string>;
  counterfactualMode: 'current' | 'what_if_compromised' | 'what_if_patched';
}

export interface EcosystemStats {
  totalDependencies: number;
  dependenciesTrend: string;
  totalVulnerabilities: number;
  vulnerabilitiesImmediate: number;
  criticalNodesCount: number;
  totalApplications: number;
  averageBlastRadius: string;
  riskExposureLevel: RiskLevel;
  riskExposureTrend: string;
  ecosystemRiskScore: number;
}
