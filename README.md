# 🛡️ RippleShield — Consequence-Aware Open-Source Software Supply Chain Security

> See the dependency. Predict the ripple. Break the chain.

RippleShield is an intelligent software supply-chain risk analysis platform designed to understand how vulnerabilities in open-source dependencies can propagate through interconnected software ecosystems.

Instead of treating dependency vulnerabilities as isolated findings, RippleShield models the complete dependency ecosystem as an interactive graph, enriches dependencies with security intelligence, calculates contextual ecosystem risk, simulates compromise scenarios, visualizes downstream blast radius, and compares potential mitigation strategies.

The platform is built around a simple question:

"If this dependency is compromised, what happens next — and where should we intervene to stop the ripple?"

Deployed Link: https://rippleshield.vercel.app/

---

## Overview

Modern applications rely on hundreds of direct and transitive open-source dependencies.

A vulnerability in a low-level package can therefore affect much more than the package itself. It may propagate through other dependencies, services, applications, and critical business functions.

Traditional Software Composition Analysis (SCA) tools are effective at identifying vulnerable components, but security teams still need additional context to determine:

- Which dependency is structurally important?
- How many downstream components depend on it?
- Which applications and services could be affected?
- How far could a compromise propagate?
- Which critical paths are exposed?
- Which dependency should be remediated first?
- Which intervention can reduce the greatest downstream exposure?

RippleShield addresses this problem by representing the software supply chain as an interconnected dependency graph.

---

## Core Workflow

RippleShield follows a five-stage workflow:

MAP
 |
 v
ASSESS
 |
 v
SIMULATE
 |
 v
PRIORITIZE
 |
 v
MITIGATE

### MAP
Build the dependency ecosystem from an SBOM or supported dependency manifest.

### ASSESS
Enrich dependencies with vulnerability and threat intelligence and calculate contextual ecosystem risk.

### SIMULATE
Model how a compromise could propagate through downstream dependencies, applications, and services.

### PRIORITIZE
Identify dependencies, paths, applications, and services with significant downstream exposure.

### MITIGATE
Compare candidate remediation actions and estimate which intervention provides the greatest risk reduction relative to effort.

---

# Key Features

## 1. Dependency Digital Twin

RippleShield converts software dependency information into an interactive representation of the software ecosystem.

The dependency graph can represent:

- Applications
- Services
- Direct dependencies
- Transitive dependencies
- Shared dependencies
- Dependency relationships
- Critical business services

Users can:

- Search dependencies
- Zoom and pan across the graph
- Inspect individual dependency nodes
- Highlight upstream dependencies
- Highlight downstream dependents
- Filter dependencies by risk
- Trace dependency paths
- Identify highly connected dependency nodes

The graph provides the structural foundation for risk and simulation analysis.

---

## 2. Contextual Ripple Risk

A vulnerability's severity alone does not necessarily describe its importance within a particular software ecosystem.

For example:

Dependency A
- CVSS: 9.8
- Dependents: 1
- Critical Services: 0

may have less ecosystem-level impact than:

Dependency B
- CVSS: 7.2
- Dependents: 17
- Critical Services: 3

RippleShield therefore considers multiple contextual signals, including:

- Vulnerability severity
- Exploitation likelihood
- Dependency reach
- Number of downstream dependents
- Business/service criticality
- Exposure
- Propagation depth
- Critical-path involvement

Conceptually:

Ripple Risk =
Exploitability
+ Dependency Reach
+ Criticality
+ Exposure
+ Propagation

The Ripple Risk Score is a prototype-level prioritization mechanism and is not intended to replace established vulnerability scoring systems.

---

## 3. Ripple / Blast-Radius Simulation

RippleShield allows users to simulate what could happen if a dependency were compromised.

Example:

Vulnerable Dependency
        |
        +----------+
        |          |
        v          v
    Package A  Package B
        |          |
        v          v
    Service A  Service B
        |          |
        +-----+----+
              |
              v
       Critical Service

The simulator identifies:

- Direct downstream dependents
- Transitive downstream dependents
- Affected applications
- Affected services
- Propagation depth
- Critical paths
- Potential sensitive-service exposure

The affected nodes are highlighted in the dependency graph so users can visually follow the ripple.

---

## 4. What-If Analysis

RippleShield supports counterfactual analysis.

### Compromise Scenario

"What if this dependency is compromised?"

The platform calculates and visualizes the potential downstream blast radius.

### Patch Scenario

"What if this dependency is patched?"

The platform recalculates the dependency relationships and estimates the resulting reduction in ecosystem exposure.

This allows security teams to compare scenarios before implementing changes.

---

## 5. Mitigation Intelligence

RippleShield compares candidate remediation actions instead of simply producing a list of vulnerabilities.

Example:

| Intervention | Changes Required | Services Protected | Risk Before | Risk After | Estimated Reduction |
|---|---:|---:|---:|---:|---:|
| Patch Dependency A | 3 | 4 | 92 | 54 | 41% |
| Patch Dependency B | 1 | 2 | 92 | 63 | 31% |
| Patch Dependency X | 1 | 6 | 92 | 31 | 66% |

The mitigation engine evaluates:

Risk Reduction / Remediation Effort

The resulting recommendation is accompanied by an explanation of the dependency paths and metrics supporting it.

---

## 6. Explainable Risk

RippleShield does not treat risk scores as black boxes.

For every high-risk dependency, the platform can expose the factors contributing to the assessment.

Example:

WHY IS THIS DEPENDENCY HIGH RISK?

1. High exploitation likelihood
2. 17 downstream dependents
3. 3 critical services affected
4. Propagation depth of 4
5. 2 critical paths exposed

The analytical engine remains responsible for calculating the underlying metrics.

An optional AI explanation layer can convert structured analytical results into human-readable security insights without replacing the underlying calculations.

---

# SBOM Ingestion

RippleShield is designed around Software Bills of Materials (SBOMs).

Prototype input formats can include:

- CycloneDX JSON
- SPDX-compatible data
- package.json
- requirements.txt
- Additional dependency manifests through future adapters

Processing pipeline:

SBOM / Manifest
      |
      v
Parser
      |
      v
Components
      |
      v
Relationships
      |
      v
Dependency Graph
      |
      v
Security Enrichment
      |
      v
Risk Analysis

---

# Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Graph Visualization | React Flow / D3.js |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Python + FastAPI |
| Graph Analysis | NetworkX |
| Data | JSON / SBOM datasets |
| Vulnerability Intelligence | CVE/NVD, EPSS, CISA KEV-compatible data |
| Containerization | Docker |
| Deployment | Docker / Cloud |

---

## Why This Stack?

### React + TypeScript
Provides a strongly typed and highly interactive client suitable for building a security intelligence dashboard.

### React Flow / D3.js
Provides the visualization foundation for dependency relationships, downstream impact, and ripple simulation.

### FastAPI
Provides a lightweight API layer while allowing the analytical and graph-processing components to remain in Python.

### NetworkX
Provides graph construction, traversal, path analysis, and relationship processing for the prototype.

The graph layer can later be migrated to a dedicated graph database when larger ecosystems require persistent graph storage and distributed analysis.

### JSON / SBOM Data
Keeps the prototype self-contained and deterministic while maintaining a clear path toward production data sources.

### Docker
Provides reproducible environments for local development, demonstration, and deployment.

---

# Architecture

                         +-------------------------+
                         |     RippleShield        |
                         |    Security Console     |
                         +------------+------------+
                                      |
                                      v
                         +-------------------------+
                         |      React Frontend     |
                         |                         |
                         | Overview                |
                         | Dependency Graph        |
                         | Risk Intelligence       |
                         | Ripple Simulator        |
                         | Mitigation Center       |
                         | Reports                 |
                         +------------+------------+
                                      |
                                  REST / JSON
                                      |
                                      v
                         +-------------------------+
                         |       FastAPI API       |
                         |                         |
                         | SBOM API                |
                         | Dependency API          |
                         | Risk API                |
                         | Simulation API          |
                         | Mitigation API          |
                         +------------+------------+
                                      |
              +-----------------------+-----------------------+
              |                       |                       |
              v                       v                       v
     +----------------+     +----------------+     +----------------+
     |  SBOM Parser   |     |   Risk Engine  |     | Ripple Simulator|
     |                |     |                |     |                |
     | Components     |     | Exploitability |     | Graph Traversal |
     | Versions       |     | Reach          |     | Blast Radius   |
     | Relationships  |     | Criticality    |     | Impact Paths   |
     +-------+--------+     +-------+--------+     +-------+--------+
             |                      |                      |
             +----------------------+----------------------+
                                    |
                                    v
                         +-------------------------+
                         |     Graph Engine        |
                         |        NetworkX         |
                         +------------+------------+
                                      |
                                      v
                         +-------------------------+
                         | Security Intelligence   |
                         |                         |
                         | CVE / NVD               |
                         | EPSS                    |
                         | CISA KEV                |
                         | SBOM Metadata           |
                         +-------------------------+

---

# System Components

## Frontend

The frontend provides the interactive security console.

Main views:

- Overview
- Dependency Graph
- Risk Intelligence
- Ripple Simulator
- Mitigation Center
- Reports

---

## Backend

The backend provides APIs for:

- SBOM processing
- Dependency analysis
- Risk calculation
- Blast-radius simulation
- Mitigation analysis
- Report generation

---

## Graph Engine

The graph engine represents:

Application
     |
     v
Service
     |
     v
Direct Dependency
     |
     v
Transitive Dependency

Relationships are represented as dependency edges.

The graph can be traversed in both directions.

### Upstream Analysis

Answers:

"What does this dependency rely on?"

### Downstream Analysis

Answers:

"What relies on this dependency?"

Downstream traversal is particularly important for ripple and blast-radius simulation.

---

# Data Model

## Dependency

```typescript
interface Dependency {
  id: string;
  name: string;
  version: string;
  ecosystem: string;

  type: "direct" | "transitive";

  riskScore: number;

  cvss?: number;
  epss?: number;
  kev?: boolean;

  dependents: string[];
  criticalServices: string[];

  propagationDepth: number;
}
```

---

## Application

```typescript
interface Application {
  id: string;
  name: string;

  criticality:
    | "low"
    | "medium"
    | "high"
    | "critical";

  dependencies: string[];
}
```

---

## Service

```typescript
interface Service {
  id: string;
  name: string;

  criticality:
    | "low"
    | "medium"
    | "high"
    | "critical";

  dataSensitivity?:
    | "low"
    | "medium"
    | "high";
}
```

---

## Dependency Relationship

```typescript
interface DependencyEdge {
  source: string;
  target: string;

  relationship: "depends_on";
}
```

---

## Ripple Simulation

```typescript
interface RippleSimulation {
  dependencyId: string;

  scenario:
    | "compromise"
    | "patch";

  affectedPackages: number;
  affectedApplications: number;
  affectedServices: number;

  propagationDepth: number;
  criticalPaths: number;

  riskBefore: number;
  riskAfter?: number;
}
```

---

## Mitigation Option

```typescript
interface MitigationOption {
  id: string;

  dependencyId: string;
  action: string;

  changesRequired: number;
  servicesProtected: number;

  riskBefore: number;
  riskAfter: number;

  estimatedReduction: number;
}
```

---

# Implemented Features

## Dependency Intelligence

- Interactive dependency graph
- Direct/transitive dependency classification
- Upstream relationship inspection
- Downstream relationship inspection
- Shared dependency identification
- Dependency search
- Risk-based filtering
- Dependency detail view

## Risk Intelligence

- Vulnerability metadata
- Contextual Ripple Risk
- Dependents count
- Critical service exposure
- Propagation depth
- Risk explanation
- Sortable risk table

## Ripple Simulation

- Dependency compromise simulation
- Downstream graph traversal
- Blast-radius calculation
- Critical-path identification
- Affected application detection
- Affected service detection
- Propagation visualization

## Mitigation Center

- Candidate mitigation comparison
- Risk-before/risk-after comparison
- Estimated exposure reduction
- Services protected
- Changes required
- Explainable intervention recommendation

## SBOM

- SBOM upload workflow
- Component extraction
- Dependency relationship extraction
- Dependency graph generation
- Security enrichment pipeline

---

# Dashboard

## Overview

The Overview dashboard provides a high-level view of the software ecosystem.

Example metrics:

DEPENDENCIES       184
VULNERABILITIES     23
CRITICAL NODES       7
APPLICATIONS        23
BLAST RADIUS       4.7x
RISK EXPOSURE       HIGH

The dependency ecosystem is displayed as an interactive graph.

---

## Dependency Graph

The graph supports:

- Search
- Zoom
- Pan
- Node selection
- Risk filtering
- Direct/transitive filtering
- Upstream highlighting
- Downstream highlighting
- Dependency inspection
- Ripple simulation

Selecting a dependency opens its detailed security profile.

---

## Risk Intelligence

The risk table provides:

| Field | Description |
|---|---|
| Dependency | Package name |
| Version | Installed version |
| CVSS | Vulnerability severity |
| EPSS | Exploitation likelihood |
| KEV | Known Exploited Vulnerability status |
| Dependents | Downstream dependency count |
| Critical Services | Critical services reachable |
| Propagation Depth | Maximum downstream depth |
| Ripple Risk | Contextual ecosystem risk |

The table can be sorted by major risk signals.

---

## Ripple Simulator

The simulator visualizes:

Compromised Dependency
          |
          v
Direct Dependents
          |
          v
Transitive Dependents
          |
          v
Applications
          |
          v
Services
          |
          v
Critical Paths

Affected nodes are highlighted as the simulation progresses.

---

## Mitigation Center

The Mitigation Center provides:

CURRENT ECOSYSTEM RISK

92 / 100

Candidate interventions are compared using:

- Number of changes required
- Downstream services protected
- Resulting risk
- Estimated risk reduction

---

# Example Demo Data

The prototype uses a fictional enterprise software ecosystem for safe and deterministic demonstration.

Example applications:

- Checkout Service
- Authentication Service
- Customer Portal
- Payment Gateway
- Inventory API
- Analytics Service
- Notification Service

Example dependencies:

- follow-redirects
- axios
- express
- lodash
- jsonwebtoken
- qs
- body-parser
- jws
- uuid
- moment
- protobufjs
- minimist

The demo ecosystem includes:

- Direct dependencies
- Transitive dependencies
- Shared dependencies
- Vulnerable dependencies
- Critical dependencies
- Low-risk dependencies
- Multiple downstream paths

The dataset is deterministic so the prototype produces repeatable results during evaluation.

---

# Example Demo Scenario

A dependency is selected:

follow-redirects
Version: 1.15.9

RippleShield displays:

Ripple Risk:        92 / 100
Downstream:         17 packages
Applications:        6
Critical Services:  3
Propagation Depth:  4
Critical Paths:      2

The user selects:

SIMULATE COMPROMISE

RippleShield traverses the dependency graph and highlights the affected nodes.

The resulting analysis displays:

17 packages affected
6 applications affected
3 critical services affected
2 critical paths exposed

The user then selects:

FIND MITIGATION

The system compares candidate remediation actions.

Example:

Recommended Intervention

Upgrade dependency X

Changes required: 1
Services protected: 6

Risk:
92 -> 31

Estimated exposure reduction:
66%

The values above are illustrative prototype data and do not represent the security posture of a real organization.

---

# API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/sbom/upload | Upload and analyze SBOM |
| GET | /api/graph | Retrieve dependency graph |
| GET | /api/dependencies | List dependencies |
| GET | /api/dependencies/:id | Get dependency details |
| GET | /api/risk | Retrieve risk intelligence |
| GET | /api/risk/:id/explain | Explain dependency risk |
| GET | /api/blast-radius/:id | Calculate downstream impact |
| POST | /api/simulate | Run compromise/patch simulation |
| GET | /api/mitigations/:id | Generate mitigation options |
| GET | /api/reports | Retrieve reports |

---

## Example Simulation Request

```http
POST /api/simulate
Content-Type: application/json
```

```json
{
  "dependencyId": "follow-redirects",
  "scenario": "compromise"
}
```

Example response:

```json
{
  "dependency": "follow-redirects",
  "scenario": "compromise",
  "affectedPackages": 17,
  "affectedApplications": 6,
  "affectedServices": 3,
  "propagationDepth": 4,
  "criticalPaths": 2
}
```

---

# Explainability

RippleShield follows an explainability-first approach.

Every major risk result should be able to answer:

WHAT?
High ecosystem risk

WHY?
- High exploitation likelihood
- Large downstream reach
- Multiple critical services
- Deep propagation path
- Critical-path involvement

IMPACT?
6 applications
3 critical services
2 critical paths

ACTION?
Review and remediate the dependency

This allows security analysts to understand the reasoning behind a prioritization rather than relying solely on a numeric score.

---

# AI Architecture

AI is intentionally not responsible for silently making security decisions.

The core analytical pipeline is:

Dependency Data
      |
      v
Graph Analysis
      |
      v
Security Metrics
      |
      v
Risk Calculation
      |
      v
Simulation
      |
      v
Mitigation Analysis

An optional AI explanation layer can then process the structured results:

Structured Results
      |
      v
AI Explanation Layer
      |
      v
Human-readable Security Insight

Example:

"dependency-X is prioritized because it has significant downstream reach and connects to multiple critical services through several dependency paths."

The underlying metrics remain traceable to the dependency graph and security data.

---

# Security Design Principles

## Explainability

Risk assessments should be supported by visible evidence.

## Context Over Severity

Vulnerability severity is one input rather than the complete ecosystem risk picture.

## Human-in-the-Loop

RippleShield provides decision support rather than automatically declaring a package or organization compromised.

## Deterministic Core

Graph traversal and core risk calculations should remain reproducible.

## Uncertainty Awareness

Incomplete dependency information should not be presented as complete certainty.

## Least Privilege

Future repository and CI/CD integrations should use the minimum permissions required for analysis.

---

# Scalability

RippleShield is designed to scale from a single repository to organization-wide software ecosystems.

## Developer Level

Repository
    |
    v
SBOM
    |
    v
RippleShield
    |
    v
Dependency Risk

## Team Level

Repository A ─┐
Repository B ─┼──> Central Dependency Graph
Repository C ─┘
                         |
                         v
                    Team Risk View

## Enterprise Level

Repositories
Applications
Services
Containers
CI/CD Pipelines
        |
        v
Organization-wide
Supply Chain Graph
        |
        v
Central Risk Intelligence

The prototype can later replace the local graph-processing layer with a persistent graph database for larger dependency ecosystems.

---

# CI/CD Integration

A future production workflow can integrate RippleShield into software delivery pipelines.

Developer Push
      |
      v
Build
      |
      v
Generate SBOM
      |
      v
RippleShield Analysis
      |
      v
Risk Assessment
      |
      v
Blast-Radius Analysis
      |
      v
Mitigation / Review
      |
      v
Deployment

Potential integrations include:

- GitHub
- GitLab
- CI/CD platforms
- Container registries
- SBOM generators
- Existing SCA platforms
- Security operations platforms

---

# Reports

RippleShield can provide:

## Supply Chain Overview

Summary of ecosystem composition and overall risk.

## Critical Dependency Report

Dependencies with significant downstream exposure.

## Blast Radius Report

Affected applications, services, paths, and propagation depth for a selected scenario.

## Mitigation Report

Candidate interventions and estimated risk reduction.

Future report formats can include:

- PDF
- JSON
- CSV
- SBOM-compatible exports

---

# Project Structure

rippleshield/
|
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardLayout/
│   │   │   ├── Sidebar/
│   │   │   ├── TopBar/
│   │   │   ├── MetricCard/
│   │   │   ├── DependencyGraph/
│   │   │   ├── DependencyDrawer/
│   │   │   ├── RiskTable/
│   │   │   ├── RiskExplanation/
│   │   │   ├── RippleSimulator/
│   │   │   └── MitigationCard/
│   │   │
│   │   ├── pages/
│   │   │   ├── Overview/
│   │   │   ├── DependencyGraph/
│   │   │   ├── RiskIntelligence/
│   │   │   ├── RippleSimulator/
│   │   │   ├── MitigationCenter/
│   │   │   └── Reports/
│   │   │
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── sbom.py
│   │   │   ├── dependencies.py
│   │   │   ├── risk.py
│   │   │   ├── simulation.py
│   │   │   └── mitigation.py
│   │   │
│   │   ├── engines/
│   │   │   ├── graph_builder.py
│   │   │   ├── risk_engine.py
│   │   │   ├── ripple_simulator.py
│   │   │   └── mitigation_optimizer.py
│   │   │
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── data/
│   ├── demo-sbom.json
│   ├── dependencies.json
│   ├── vulnerabilities.json
│   ├── applications.json
│   ├── services.json
│   └── sample-graph.json
│
├── tests/
│   ├── test_graph.py
│   ├── test_risk.py
│   ├── test_simulation.py
│   └── test_mitigation.py
│
├── docs/
│   ├── architecture.md
│   ├── methodology.md
│   └── screenshots/
│
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── README.md
└── LICENSE

---

# Local Setup

## Requirements

- Node.js 20+
- npm
- Python 3.10+
- pip
- Git

Optional:

- Docker
- Docker Compose

---

## Clone Repository

```bash
git clone https://github.com/<YOUR-USERNAME>/rippleshield.git

cd rippleshield
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

The frontend will typically be available at:

http://localhost:5173

---

# Backend Setup

Open another terminal:

```bash
cd backend
```

Create a virtual environment.

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv

source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

The API will typically be available at:

http://localhost:8000

Interactive API documentation:

http://localhost:8000/docs

---

# Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Example:

```env
API_HOST=0.0.0.0
API_PORT=8000
NODE_ENV=development
```

If external vulnerability-intelligence APIs are enabled, credentials must be stored as environment variables or deployment secrets.

Never commit:

.env
API keys
Access tokens
Private credentials

---

# Docker

Build and run the complete stack:

```bash
docker compose up --build
```

Stop the stack:

```bash
docker compose down
```

---

# Production Build

Frontend:

```bash
cd frontend

npm run build
```

Backend:

```bash
cd backend

uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

# Deployment

The prototype is designed to support containerized deployment.

Recommended production architecture:

Reverse Proxy
      |
      v
React Client
      |
      v
FastAPI API
      |
      +----------------+----------------+
      |                |                |
      v                v                v
 Graph Store      Database       Object Storage
      |                |                |
      +----------------+----------------+
                       |
                       v
              Security Intelligence

Potential production components include:

- PostgreSQL
- Neo4j or another graph database
- S3/GCS/Azure Blob Storage
- Redis
- Container orchestration
- CI/CD integration
- Centralized logging
- Monitoring

The prototype's local JSON/in-memory components should be replaced with durable infrastructure for production workloads.

---

# Testing

The project should maintain automated tests around the core analytical boundaries.

Recommended coverage includes:

- SBOM parsing
- Component extraction
- Dependency relationship extraction
- Graph construction
- Direct/transitive classification
- Downstream traversal
- Propagation depth
- Blast-radius calculation
- Risk calculation
- Mitigation comparison
- API validation
- Invalid SBOM handling
- Missing dependency relationships

Run backend tests:

```bash
cd backend

pytest
```

Run frontend tests:

```bash
cd frontend

npm test
```

---

# Example Test Scenario

Given the dependency graph:

A → B → C → D

and dependency B is selected for simulation:

B
|
v
C
|
v
D

The simulator should identify the downstream nodes reachable from B.

Expected conceptual result:

Affected downstream packages = 2
Propagation depth = 2

The exact expected values depend on how graph depth and node categories are represented by the implementation.

---

# Known Limitations

The current project is a hackathon prototype.

## Prototype Data

The demonstration environment may use fictional or controlled dependency data.

## Risk Model

The Ripple Risk Score is a prototype prioritization model and should not be interpreted as an industry-standard security score.

## External Intelligence

External security feeds may be cached or represented by deterministic demo data during evaluation.

## Business Criticality

Criticality values in the demo dataset are illustrative.

## Mitigation Estimates

Risk-reduction values represent analytical estimates rather than guaranteed real-world security outcomes.

## Graph Completeness

An incomplete SBOM or missing dependency relationship can result in an incomplete representation of the ecosystem.

## Authentication

A production deployment requires enterprise-grade authentication and authorization.

## Production Storage

Production deployments should use persistent databases and durable storage rather than local prototype storage.

---

# Security Considerations

RippleShield is designed as a security decision-support platform.

Production deployments should implement:

- Authentication
- Role-based authorization
- Secure secret storage
- Encryption in transit
- Encryption at rest
- Audit logging
- Repository access controls
- Tenant isolation
- API rate limiting
- Input validation
- SBOM upload validation

Uploaded SBOMs should be treated as untrusted input.

SBOM processing should validate:

- File type
- File size
- JSON structure
- Component fields
- Relationship structure

External API credentials should never be embedded in frontend code.

---

# Privacy and Data Handling

When deployed against real repositories, RippleShield should follow secure data-handling practices.

Recommended production controls include:

- Private repository access
- Encrypted communication
- Encryption at rest
- Role-based access control
- Secret management
- Audit logging
- Data retention policies
- Tenant isolation

The core dependency-analysis workflow does not require storing source-code contents when an appropriate SBOM is available.

---

# Responsible Use

RippleShield provides analytical decision support.

A high Ripple Risk Score does not mean that a package has been compromised.

Similarly, being connected to a critical service does not establish that exploitation has occurred.

The platform is intended to help security teams:

- Investigate
- Prioritize
- Simulate
- Compare
- Mitigate

Final security decisions should remain with qualified human security professionals.

---

# Business Strategy

RippleShield follows a developer-to-enterprise SaaS model.

## Community

Free:

- Local SBOM analysis
- Dependency graph
- Basic risk intelligence
- Basic reports

## Pro

Subscription:

- Continuous monitoring
- Historical risk
- CI/CD integration
- Advanced analytics
- Automated reporting

## Enterprise

Annual licensing:

- Organization-wide dependency graph
- Multi-project monitoring
- SSO/RBAC
- Compliance reporting
- Private deployment
- Centralized supply-chain intelligence

---

# Target Users

## Security Teams

Understand and prioritize ecosystem-level software supply-chain exposure.

## DevSecOps Teams

Integrate dependency intelligence into development pipelines.

## Engineering Teams

Understand the consequences of dependency changes.

## CISOs and Security Leadership

Obtain organization-wide visibility into software supply-chain exposure.

## SaaS Organizations

Monitor shared dependencies across large application ecosystems.

---

# Roadmap

## Phase 1 — Hackathon MVP

- Interactive dependency graph
- SBOM ingestion
- Vulnerability enrichment
- Ripple Risk
- Blast-radius simulation
- Critical-path analysis
- Mitigation comparison
- Explainable risk

## Phase 2 — Developer Integration

- GitHub integration
- GitLab integration
- Automated SBOM generation
- Pull-request dependency analysis
- CI/CD integration
- Dependency-change alerts
- Historical risk tracking

## Phase 3 — Enterprise Intelligence

- Organization-wide dependency graph
- Multi-repository analysis
- Role-based access control
- SSO
- Audit logs
- Enterprise reporting
- Private deployment
- Multi-tenant architecture

## Phase 4 — Predictive Supply-Chain Intelligence

- Emerging-risk detection
- Attack-path forecasting
- Dependency-change impact prediction
- Advanced graph learning
- Automated security recommendations
- Continuous software supply-chain digital twin

---

# Future Vision

RippleShield aims to evolve from a dependency analysis platform into a continuously updated Software Supply Chain Digital Twin.

The long-term system will connect:

Every Dependency
       |
       v
Every Relationship
       |
       v
Every Vulnerability
       |
       v
Every Critical Service
       |
       v
Every Potential Ripple
       |
       v
Every Possible Intervention

The long-term objective is to provide security teams with a continuously updated answer to:

"If something goes wrong here, what happens next?"

and:

"Where can we intervene to contain the ripple?"

---

# Hackathon Demonstration Flow

The recommended prototype demonstration is:

1. Open Overview
2. Show ecosystem statistics
3. Open Dependency Graph
4. Select a high-risk dependency
5. Explain why it is high risk
6. Click "Simulate Compromise"
7. Watch the ripple propagate
8. Inspect affected applications/services
9. Open Mitigation Center
10. Compare interventions
11. Show simulated risk reduction

The core narrative is:

DISCOVER
    ↓
UNDERSTAND
    ↓
SIMULATE
    ↓
PRIORITIZE
    ↓
MITIGATE

---

# Submission Checklist

Before submitting the project, verify:

- [ ] Application starts successfully from a clean environment.
- [ ] Demo dataset loads correctly.
- [ ] Dependency graph renders correctly.
- [ ] Dependency search works.
- [ ] Dependency details open correctly.
- [ ] Risk metrics are internally consistent.
- [ ] Ripple simulation works.
- [ ] Affected graph nodes correspond to simulation results.
- [ ] Propagation paths are visible.
- [ ] Mitigation comparison works.
- [ ] Risk-before/risk-after values are consistent.
- [ ] No secrets are committed.
- [ ] `.env` is excluded from Git.
- [ ] README matches the actual implementation.
- [ ] GitHub repository is publicly accessible when required.
- [ ] Prototype can operate using local demo data if external APIs fail.
- [ ] All screenshots and recordings contain no confidential information.
- [ ] Repository contains no unnecessary credentials or private data.
- [ ] The final demo follows the required hackathon submission format.

---

# Project Status

HACKATHON PROTOTYPE

Dependency Mapping        ██████████ 100%
Risk Intelligence         ██████████ 100%
Ripple Simulation         ██████████ 100%
Blast-Radius Analysis     ██████████ 100%
Mitigation Analysis       █████████░  90%
SBOM Ingestion            ████████░░  80%
External Integrations     ███░░░░░░░  30%
Enterprise Infrastructure ██░░░░░░░░  20%

Update these percentages before submission so they accurately reflect the actual repository implementation.

---

# Contributing

Contributions are welcome.

Create a feature branch:

```bash
git checkout -b feature/<feature-name>
```

Make your changes and run the relevant tests.

Commit:

```bash
git add .

git commit -m "feat: add <feature>"
```

Push:

```bash
git push origin feature/<feature-name>
```

For significant changes, include:

- Problem description
- Proposed solution
- Technical approach
- Testing information
- Screenshots for UI changes

---

# License

This project is released under the terms specified in the repository's LICENSE file.

---

# Team

## RippleShield

### Consequence-Aware Open-Source Software Supply Chain Security

Team Members:

- Stuti Verma
- Aryansh Gupta
- Aaron Anish Thadathil
- Shaurya Agarwal
- Rithvik Chandra

---

# 🛡️ RippleShield

## SEE THE DEPENDENCY.

## PREDICT THE RIPPLE.

## BREAK THE CHAIN.

RippleShield transforms software supply-chain security from vulnerability counting into consequence-aware security decision intelligence.
