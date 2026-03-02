import { Question } from '../types';

export const ALL_QUESTIONS: Question[] = [
  // ── Pathway 1: Independent Linux Foundation ────────────────────────────────
  {
    id: 1,
    category: 'Linux Independence',
    categoryIcon: '🐧',
    question: 'A vendor restricts RHEL source code, leaving your 500-server estate at immediate supply chain risk. What is the fastest sovereignty fix with zero OS changes?',
    options: [
      'Transition to an independent, EU-headquartered patch supply chain for the existing OS',
      'Migrate the entire fleet to a community-driven distribution',
      'Maintain current subscriptions and hope for a policy reversal',
      'Move to an unmanaged, upstream-only stream',
    ],
    correct: 0,
    explanation:
      '💡 SUSE PATHWAY 1a — SUSE Multi-Linux Support lets you decouple your support and patch supply chain from the OS vendor instantly. Your RHEL systems stay untouched while patches now flow through an EU-headquartered company.',
    difficulty: 'easy',
  },
  {
    id: 2,
    category: 'Linux Independence',
    categoryIcon: '🐧',
    question: 'Auditors demand NIS2 compliance for software transparency and long-term infrastructure stability. Which capability ensures binaries match audited source code?',
    options: [
      'Standard enterprise subscriptions with 10-year lifecycles',
      'Community-led long-term support (LTS)',
      'Cloud-native automated patching services',
      'Reproducible builds with SLSA Level 3 supply chain and SBOMs',
    ],
    correct: 3,
    explanation:
      '💡 SUSE PATHWAY 1b — SLES is the only enterprise Linux with SLSA Level 3 provenance, SBOMs per package, EAL4+ certification, and a 16-year support lifecycle — the gold standard for NIS2, DORA, and federal security compliance.',
    difficulty: 'medium',
  },
  {
    id: 3,
    category: 'Linux Independence',
    categoryIcon: '🐧',
    question: 'You manage 800 mixed RHEL and Ubuntu servers with inconsistent patching across the fleet. What is the most efficient fix for multi-distro compliance?',
    options: [
      'Standardize on a single distribution via a 6-month migration project',
      'Use a unified management plane to centralize patching and configuration across all Linux types',
      'Deploy vendor-specific management consoles for each distribution',
      'Develop custom Ansible playbooks for each OS version',
    ],
    correct: 1,
    explanation:
      '💡 SUSE PATHWAY 1c — SUSE Multi-Linux Manager provides a single pane of glass across RHEL, Ubuntu, and SLES. Unified patch management, one compliance audit trail, consistent security posture — without forcing a full migration.',
    difficulty: 'medium',
  },

  // ── Pathway 2: Virtualization Independence ────────────────────────────────
  {
    id: 4,
    category: 'Virtualization',
    categoryIcon: '⚙️',
    question: 'VMware licensing costs tripled after an acquisition and 200 VMs need moving. Which move best restores infrastructure independence?',
    options: [
      'Negotiate a multi-year renewal with the current provider',
      'Move all virtualized workloads to a single public cloud hyperscaler',
      'Adopt an open-source, KVM-based virtualization platform that is air-gap capable',
      'Migrate to a different proprietary, closed-source hypervisor',
    ],
    correct: 2,
    explanation:
      '💡 SUSE PATHWAY 2a — SUSE Virtualization runs your existing VMs on open, auditable KVM. No license fees, air-gap capable for regulated environments, and you control your own upgrade cycle.',
    difficulty: 'medium',
  },
  {
    id: 5,
    category: 'Virtualization',
    categoryIcon: '⚙️',
    question: 'You are modernizing the stack to run legacy VMs and containers together under one operational model. What is the best way to achieve this?',
    options: [
      'Converge VMs and containers on a single Kubernetes-native platform',
      'Run a traditional hypervisor for VMs and a separate stack for Kubernetes',
      'Maintain a proprietary virtualization layer and run containers inside VMs',
      'Decommission all VMs and force immediate containerization',
    ],
    correct: 0,
    explanation:
      '💡 SUSE PATHWAY 2b — SUSE Virtualization + Rancher Prime makes Kubernetes your single operational standard for both traditional and cloud-native workloads. One API, one management plane, one team skill set.',
    difficulty: 'hard',
  },

  // ── Pathway 3: Hybrid & Multi-Cloud ───────────────────────────────────────
  {
    id: 6,
    category: 'Cloud Strategy',
    categoryIcon: '☁️',
    question: 'Your workloads span AWS and Azure with no unified compliance or security view. What is the way to get a single view across all providers?',
    options: [
      'Consolidate all operations on a single global hyperscaler',
      'Build a custom meta-orchestration layer in-house',
      'Standardize infrastructure using only cloud-native IaC tools',
      'Implement a single control plane that abstracts and manages clusters across any environment',
    ],
    correct: 3,
    explanation:
      '💡 SUSE PATHWAY 3a — SUSE Rancher Prime abstracts away the underlying cloud. Skills become portable, policies enforced uniformly, and governance is consistent across hybrid infrastructure — without consolidating on one cloud.',
    difficulty: 'medium',
  },
  {
    id: 7,
    category: 'Cloud Strategy',
    categoryIcon: '☁️',
    question: "Legal flags US CLOUD Act risk for your sensitive algorithms running on public cloud. Where do 'Crown Jewel' workloads belong?",
    options: [
      'A dedicated sovereign landing zone under local jurisdictional control',
      'A public cloud region with a Data Processing Agreement (DPA)',
      'Hyperscaler-managed encryption on a global cloud',
      'A standard "EU Data Boundary" program managed by a non-EU entity',
    ],
    correct: 0,
    explanation:
      '💡 SUSE PATHWAY 3b — The US CLOUD Act (2018) can compel any US company to hand over data stored anywhere. Encryption alone does NOT block this. The only real fix: repatriate Crown Jewel workloads to infrastructure you control.',
    difficulty: 'hard',
  },

  // ── Pathway 4: Software Supply Chain Security ─────────────────────────────
  {
    id: 8,
    category: 'Supply Chain Security',
    categoryIcon: '🔗',
    question: 'You have 300+ unvetted Docker images and an EU Cyber Resilience Act audit in 90 days. What is the fastest compliant fix for container supply chains?',
    options: [
      'Block all public registries and require manual builds',
      'Adopt a curated, audited source for container images with SBOM and SLSA provenance',
      'Shift workloads to a different public container registry',
      'Scan existing public images using basic vulnerability tools',
    ],
    correct: 1,
    explanation:
      '💡 SUSE PATHWAY 4a — SUSE Application Collection ships every image with a full SBOM, SLSA Level 3 provenance, clear licenses, and regular CVE scans. Developer velocity stays high; every image is pre-vetted for CRA compliance.',
    difficulty: 'medium',
  },
  {
    id: 9,
    category: 'Supply Chain Security',
    categoryIcon: '🔗',
    question: 'Your developers work on a classified, air-gapped network and still need secure, updated container images. How do you supply them without internet access?',
    options: [
      'Build and audit all images from scratch on the local network',
      'Allow temporary internet access for pulls, then disconnect',
      'Mirror a curated application collection to an internal private registry',
      'Manually transfer public images via physical media quarterly',
    ],
    correct: 2,
    explanation:
      '💡 SUSE PATHWAY 4b — SUSE Private Registry (mirroring SUSE Application Collection) gives you a fully air-gapped, internally-operated image supply chain. Full chain of custody — mandatory for classified and defense environments.',
    difficulty: 'hard',
  },

  // ── Pathway 5: Private & Sovereign AI ─────────────────────────────────────
  {
    id: 10,
    category: 'Sovereign AI',
    categoryIcon: '🤖',
    question: 'Customer data cannot leave EU jurisdiction, but public AI APIs like OpenAI or Azure would expose it. How do you deliver AI without data leaving premises?',
    options: [
      'Use public AI APIs with data anonymization layers',
      'Use a "Sovereign AI" service provided via a foreign cloud API',
      'Prohibit all AI usage until global regulations are finalized',
      'Deploy open-weight LLMs on hardened infrastructure within your own firewall',
    ],
    correct: 3,
    explanation:
      '💡 SUSE PATHWAY 5a — SUSE AI runs open-weight LLMs on your own on-premise GPU infrastructure. AI processing stays inside your firewall — no CLOUD Act exposure, no data residency risk, EU AI Act compliant from day one.',
    difficulty: 'medium',
  },
  {
    id: 11,
    category: 'Sovereign AI',
    categoryIcon: '🤖',
    question: 'Your CISO detects staff sending sensitive documents to unapproved external AI tools. What is the immediate action to stop data exposure?',
    options: [
      'Block all known AI domains at the network perimeter',
      'Use observability and security tools to detect and govern unauthorized AI API calls',
      'Conduct an internal survey on AI tool usage',
      'Issue a policy memo banning unsanctioned AI tools',
    ],
    correct: 1,
    explanation:
      '💡 SUSE PATHWAY 5b — SUSE Security and Observability detect unauthorized AI API calls leaving your network right now. You gain visibility before exposure occurs — and the data to build a proper AI governance strategy.',
    difficulty: 'medium',
  },

  // ── Pathway 7: Sovereign Operational Support ──────────────────────────────
  {
    id: 12,
    category: 'Sovereign Support',
    categoryIcon: '⚖️',
    question: 'Your open-source stack is sovereign, but support engineers operate outside EU jurisdiction. How do you close this jurisdictional support gap?',
    options: [
      'Sign a standard GDPR Data Processing Agreement',
      'Limit support sessions to end-to-end encrypted tools',
      'Implement localized support provided exclusively by regional engineers under local law',
      'Build an entirely internal support team and remove vendor access',
    ],
    correct: 2,
    explanation:
      '💡 SUSE PATHWAY 7a — Even a sovereign stack carries risk if support operates under a different legal jurisdiction. SUSE Sovereign Premium Support provides EU-based engineers under EU law — the "last mile" of sovereignty.',
    difficulty: 'hard',
  },

  // ── Pathway 6: Edge & Disconnected Operations ─────────────────────────────
  {
    id: 13,
    category: 'Edge Computing',
    categoryIcon: '🌐',
    question: '3,000 utility substations face regular WAN drops, causing cloud-dependent architecture to fail. What keeps substations running autonomously?',
    options: [
      'A constant connection to a proprietary cloud-based controller',
      'High-availability WAN failover using satellite links',
      'Deployment of a traditional, heavy-weight server OS at each site',
      'A purpose-built stack designed for self-sufficient, disconnected operations',
    ],
    correct: 3,
    explanation:
      '💡 SUSE PATHWAY 6a — SUSE Edge (SLE Micro + K3s) makes each site a self-sufficient island of compute. Sites run autonomously regardless of WAN connectivity — non-negotiable for utilities, telcos, and defense.',
    difficulty: 'hard',
  },
  {
    id: 14,
    category: 'Edge Computing',
    categoryIcon: '🌐',
    question: 'Managing 10,000 nationwide telecom nodes site-by-site is impossible and security must be maintained at scale. How do you manage this massive, decentralized estate as a single unit?',
    options: [
      'Manage the entire edge estate as a single logical fleet with centralized policy enforcement',
      'Use traditional automation scripts across all sites',
      'Outsource edge management to a global cloud provider',
      'Manually patch sites during scheduled maintenance windows',
    ],
    correct: 0,
    explanation:
      '💡 SUSE PATHWAY 6b — SUSE Rancher Prime + SUSE Edge turns thousands of autonomous sites into a single managed fleet. Policy, updates, and rollbacks as fleet operations — SEAL-4 security posture without on-site visits.',
    difficulty: 'hard',
  },

  // ── General Sovereignty Concepts ─────────────────────────────────────────
  {
    id: 15,
    category: 'Supply Chain Security',
    categoryIcon: '📦',
    question: 'The EU Cyber Resilience Act mandates software transparency for all European products. What is the primary function of an SBOM?',
    options: [
      'It documents software licensing costs for enterprise procurement teams',
      'It provides a full component inventory for vulnerability tracking and compliance',
      'It acts as a performance benchmark for containerized apps',
      'It is a legal disclaimer for user data privacy',
    ],
    correct: 1,
    explanation:
      '💡 SUSE PATHWAY 4a — An SBOM is a machine-readable inventory of every library and dependency inside software. EU CRA mandates SBOMs for products sold in Europe. SUSE Application Collection ships them automatically, making compliance a feature.',
    difficulty: 'medium',
  },
  {
    id: 16,
    category: 'Cloud Strategy',
    categoryIcon: '☁️',
    question: 'Your board needs a framework to measure digital independence across infrastructure dimensions. What do the EU\'s SEAL levels measure?',
    options: [
      'The physical encryption strength of storage devices',
      'The energy efficiency of EU data centers',
      'Sovereignty effectiveness across jurisdictional, data, and operational dimensions',
      'The GDPR adequacy of international data transfers',
    ],
    correct: 2,
    explanation:
      '💡 The SEAL framework measures sovereign infrastructure maturity across Strategic, Economic, Access, and Legal dimensions. SUSE pathways are explicitly mapped to SEAL levels — from SEAL-3 (Multi-Linux Support) to SEAL-4 (full on-premise + EU support).',
    difficulty: 'hard',
  },
];

/** Pick N random questions from the full pool */
export function pickQuestions(n: number): Question[] {
  const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, ALL_QUESTIONS.length));
}

export const GAME_CONFIG = {
  totalQuestions: 10,
  timePerQuestion: 20, // seconds
  basePoints: 1000,
  maxSpeedBonus: 500,
};
