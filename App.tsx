import React, { useState } from 'react';
import { Layout, Database, BarChart3, Settings, Key, CreditCard, Shield, Terminal, GitCommit, Zap } from 'lucide-react';
import { LoadingProvider } from './context/LoadingContext';
import LoadingIndicator from './components/LoadingIndicator';
import Dashboard from './components/Dashboard';
import SchemaViewer from './components/SchemaViewer';
import ArchitectureDocs from './components/ArchitectureDocs';
import PaymentArchitecture from './components/PaymentArchitecture';
import SecurityCompliance from './components/SecurityCompliance';
import ApiDocs from './components/ApiDocs';
import RentalLifecycle from './components/RentalLifecycle';
import TestingStrategy from './components/TestingStrategy';

// Navigation State Enum
enum Tab {
  DASHBOARD = 'DASHBOARD',
  SCHEMA = 'SCHEMA',
  API = 'API',
  LIFECYCLE = 'LIFECYCLE',
  PAYMENTS = 'PAYMENTS',
  TESTING = 'TESTING',
  SECURITY = 'SECURITY',
  ARCHITECTURE = 'ARCHITECTURE',
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <Dashboard />;
      case Tab.SCHEMA:
        return <SchemaViewer />;
      case Tab.API:
        return <ApiDocs />;
      case Tab.LIFECYCLE:
        return <RentalLifecycle />;
      case Tab.PAYMENTS:
        return <PaymentArchitecture />;
      case Tab.TESTING:
        return <TestingStrategy />;
      case Tab.SECURITY:
        return <SecurityCompliance />;
      case Tab.ARCHITECTURE:
        return <ArchitectureDocs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <LoadingProvider>
      <div className="flex h-full w-full bg-slate-50">
        <LoadingIndicator />
        {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400">
            <Key className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-white">RentFlow</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">SaaS Admin & Architect</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <button
                onClick={() => setActiveTab(Tab.DASHBOARD)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === Tab.DASHBOARD
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Live Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab(Tab.SCHEMA)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === Tab.SCHEMA
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-5 h-5" />
                Database Schema
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab(Tab.LIFECYCLE)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === Tab.LIFECYCLE
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <GitCommit className="w-5 h-5" />
                Lifecycle Logic
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab(Tab.API)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === Tab.API
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-5 h-5" />
                API Reference
              </button>
            </li>
             <li>
              <button
                onClick={() => setActiveTab(Tab.PAYMENTS)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === Tab.PAYMENTS
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Payment System
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab(Tab.TESTING)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === Tab.TESTING
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-5 h-5" />
                Testing Strategy
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab(Tab.SECURITY)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === Tab.SECURITY
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-5 h-5" />
                Security & Compliance
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab(Tab.ARCHITECTURE)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === Tab.ARCHITECTURE
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Layout className="w-5 h-5" />
                System Architecture
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white cursor-pointer transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white flex-shrink-0">
          <h1 className="text-lg font-semibold text-slate-800">
            {activeTab === Tab.DASHBOARD && 'Operational Overview'}
            {activeTab === Tab.SCHEMA && 'PostgreSQL Production Schema'}
            {activeTab === Tab.API && 'REST API Documentation'}
            {activeTab === Tab.LIFECYCLE && 'Rental State Logic'}
            {activeTab === Tab.PAYMENTS && 'Payment System Architecture'}
            {activeTab === Tab.TESTING && 'Quality Assurance Strategy'}
            {activeTab === Tab.SECURITY && 'Security & Compliance'}
            {activeTab === Tab.ARCHITECTURE && 'Technical Architecture'}
          </h1>
          <div className="flex items-center gap-4">
             <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              v2.4.0-stable
            </span>
            <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://picsum.photos/100/100" alt="Avatar" className="h-full w-full object-cover"/>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-slate-50">
          {renderContent()}
        </div>
      </main>
    </div>
    </LoadingProvider>
  );
};

export default App;