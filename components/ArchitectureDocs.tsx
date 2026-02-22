import React, { useState } from "react";
import {
  Server,
  Shield,
  Globe,
  Database,
  Layers,
  Lock,
  GitBranch,
  HardDrive,
  Scale,
  ArrowRightLeft,
  Users,
  LayoutGrid,
} from "lucide-react";

const ArchitectureDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"stack" | "tenancy">("tenancy");

  const stackDecisions = [
    {
      title: "Backend Service",
      icon: Server,
      tech: "Node.js (NestJS) or Go",
      desc: "Selected for high concurrency handling required by fleet telemetry processing and rapid API responses. NestJS offers structured modularity, while Go provides raw performance.",
      tags: ["API REST", "GraphQL", "Microservices"],
    },
    {
      title: "Database & Storage",
      icon: Database,
      tech: "PostgreSQL 16 + Redis",
      desc: "PostgreSQL handles relational data (Rentals, Users) with strong consistency. JSONB columns used for flexible audit logs. Redis handles session caching and real-time vehicle availability locks.",
      tags: ["ACID Compliance", "Geo-spatial", "Caching"],
    },
    {
      title: "Authentication",
      icon: Lock,
      tech: "OAuth2 / OIDC (Auth0)",
      desc: "Offloaded identity management to ensure PCI-DSS compliance and robust security. Supports multi-factor authentication (MFA) for admin access.",
      tags: ["JWT", "RBAC", "MFA"],
    },
    {
      title: "Infrastructure",
      icon: Globe,
      tech: "AWS (ECS/Fargate) or GCP (Cloud Run)",
      desc: "Containerized stateless deployment for auto-scaling during peak holiday seasons. Infrastructure as Code (Terraform) for reproducible environments.",
      tags: ["Docker", "Terraform", "CI/CD"],
    },
    {
      title: "Security",
      icon: Shield,
      tech: "Row Level Security (RLS)",
      desc: "Implemented directly in PostgreSQL. Ensures strict tenant isolation at the database layer, preventing data leakage between car rental companies sharing the platform.",
      tags: ["Encryption at Rest", "WAF", "Audit Logging"],
    },
    {
      title: "Frontend",
      icon: Layers,
      tech: "React 18 + Tailwind",
      desc: "SPA architecture for responsive dashboard. Uses React Query for state management and optimistic UI updates for booking operations.",
      tags: ["TypeScript", "Vite", "Recharts"],
    },
  ];

  const renderStack = () => (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stackDecisions.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 rounded-lg">
                  <item.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm font-mono text-emerald-600 font-medium">
                    {item.tech}
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              {item.desc}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl p-8 text-center border border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-2">
          ER Diagram Visualization
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          The logical relationship between key entities in the system.
        </p>

        {/* Simple CSS-based Diagram Representation */}
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex flex-col items-center gap-8 min-w-[600px]">
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-300 w-48">
              Tenants <br />
              <span className="text-xs opacity-70">(Partition Root)</span>
            </div>

            <div className="flex gap-12 relative">
              <div className="absolute top-[-32px] left-1/2 w-0.5 h-8 bg-slate-700 -translate-x-1/2"></div>
              <div className="absolute top-[-2px] left-10 right-10 h-0.5 bg-slate-700"></div>
              <div className="absolute top-[-2px] left-10 w-0.5 h-4 bg-slate-700"></div>
              <div className="absolute top-[-2px] right-10 w-0.5 h-4 bg-slate-700"></div>
              <div className="absolute top-[-2px] left-1/2 w-0.5 h-4 bg-slate-700"></div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 w-32 text-sm">
                Users
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 w-32 text-sm">
                Vehicles
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 w-32 text-sm">
                Clients
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-[-32px] left-1/2 w-0.5 h-8 bg-slate-700 -translate-x-1/2"></div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 w-48 font-bold shadow-lg shadow-emerald-900/20">
                Rentals <br />
                <span className="text-xs opacity-70">(Core Transaction)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTenancy = () => (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Strategy Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border-2 border-emerald-500/20 shadow-sm overflow-hidden flex flex-col relative">
          <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold rounded-bl-lg">
            RECOMMENDED
          </div>
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white border border-slate-200 rounded-lg">
                <Database className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Shared Database (Row Isolation)
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              All tenants share tables. Logic isolated by{" "}
              <code className="text-xs bg-slate-200 px-1 rounded">
                tenant_id
              </code>
              .
            </p>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
              Pros & Cons
            </h4>
            <ul className="space-y-3 mb-6 flex-1">
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <div className="mt-1 w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <span>Cost Efficient: Single DB instance.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <div className="mt-1 w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <span>Agile Schema: Migrate once for all users.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <div className="mt-1 w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">
                  ✕
                </div>
                <span>"Noisy Neighbor" risk (performance contention).</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <div className="mt-1 w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">
                  ✕
                </div>
                <span>Complex single-tenant backup/restore.</span>
              </li>
            </ul>
            <div className="bg-slate-900 text-slate-300 p-3 rounded text-xs font-mono">
              SELECT * FROM rentals WHERE tenant_id = 'uuid';
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col opacity-80 hover:opacity-100 transition-opacity">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white border border-slate-200 rounded-lg">
                <HardDrive className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Database per Tenant (Silo)
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              Separate DB instance or Schema for every customer.
            </p>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
              Pros & Cons
            </h4>
            <ul className="space-y-3 mb-6 flex-1">
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <div className="mt-1 w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <span>Perfect Isolation (Security & Compliance).</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <div className="mt-1 w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <span>No "Noisy Neighbor" effect.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <div className="mt-1 w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">
                  ✕
                </div>
                <span>High Infrastructure Cost (Overhead).</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <div className="mt-1 w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">
                  ✕
                </div>
                <span>Migration nightmare (1000s of DBs).</span>
              </li>
            </ul>
            <div className="bg-slate-900 text-slate-300 p-3 rounded text-xs font-mono">
              // Connect to 'tenant_db_123'
              <br />
              SELECT * FROM rentals;
            </div>
          </div>
        </div>
      </div>

      {/* Scale Strategy */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
          <Scale className="w-5 h-5 text-emerald-400" />
          Scaling Roadmap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-700 -z-10"></div>

          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center absolute -top-4 left-4 border-4 border-slate-900">
              1
            </div>
            <h4 className="font-bold text-emerald-400 mb-2 mt-2">
              Shared DB + RLS
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Start here. Single Postgres Cluster. Use Row Level Security (RLS)
              to enforce isolation. Scale vertically (more CPU/RAM) up to 10k
              tenants.
            </p>
          </div>

          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 relative">
            <div className="w-8 h-8 rounded-full bg-slate-600 text-white font-bold flex items-center justify-center absolute -top-4 left-4 border-4 border-slate-900">
              2
            </div>
            <h4 className="font-bold text-emerald-400 mb-2 mt-2">
              Read Replicas
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Offload heavy reporting queries to Read-Only replicas. Keep the
              Primary node focused on transactional writes (Booking/Payments).
            </p>
          </div>

          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 relative">
            <div className="w-8 h-8 rounded-full bg-slate-600 text-white font-bold flex items-center justify-center absolute -top-4 left-4 border-4 border-slate-900">
              3
            </div>
            <h4 className="font-bold text-emerald-400 mb-2 mt-2">
              Hybrid / Sharding
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Move top 1% "Enterprise" tenants to dedicated DBs (Silo). Shard
              the remaining "Shared DB" by Tenant ID ranges if needed.
            </p>
          </div>
        </div>
      </div>

      {/* Migration Logic */}
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
        <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2 mb-4">
          <ArrowRightLeft className="w-5 h-5" />
          Migration Plan: Shared to Silo
        </h3>
        <p className="text-sm text-amber-800 mb-4 max-w-3xl">
          When a tenant grows too large (e.g., &gt;1M rentals/year), migrate
          them to a dedicated database without downtime.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
            <span className="text-xs font-bold text-amber-500 uppercase">
              Step 1
            </span>
            <p className="text-sm font-medium text-slate-800 mt-1">
              Snapshot & Replicate
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Set up logical replication (CDC) filtering by{" "}
              <code className="bg-slate-100 px-1">tenant_id</code> to the new
              DB.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
            <span className="text-xs font-bold text-amber-500 uppercase">
              Step 2
            </span>
            <p className="text-sm font-medium text-slate-800 mt-1">
              Flip the Switch
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Update the Tenant Catalog Service to point the tenant's connection
              string to the new DB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-900">
          System Architecture
        </h2>
        <p className="text-slate-600 mt-2">
          High-level technical decisions, database topology, and scaling
          strategies for RentFlow.
        </p>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("tenancy")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "tenancy"
              ? "text-emerald-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Multi-tenancy Strategy
          {activeTab === "tenancy" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("stack")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "stack"
              ? "text-emerald-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Tech Stack & Diagram
          {activeTab === "stack" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === "stack" ? renderStack() : renderTenancy()}
    </div>
  );
};

export default ArchitectureDocs;
