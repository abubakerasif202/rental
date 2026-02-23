import React, { useState } from "react";
import {
  Layout,
  Database,
  BarChart3,
  Settings,
  Key,
  CreditCard,
  Shield,
  Terminal,
  GitCommit,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { LoadingProvider } from "./context/LoadingContext";
import LoadingIndicator from "./components/LoadingIndicator";
import Dashboard from "./components/Dashboard";
import SchemaViewer from "./components/SchemaViewer";
import ArchitectureDocs from "./components/ArchitectureDocs";
import PaymentArchitecture from "./components/PaymentArchitecture";
import SecurityCompliance from "./components/SecurityCompliance";
import ApiDocs from "./components/ApiDocs";
import RentalLifecycle from "./components/RentalLifecycle";
import TestingStrategy from "./components/TestingStrategy";
import Booking from "./components/Booking";
import { Calendar } from "lucide-react";

// Navigation State Enum
export enum Tab {
  DASHBOARD = "DASHBOARD",
  BOOKING = "BOOKING",
  SCHEMA = "SCHEMA",
  API = "API",
  LIFECYCLE = "LIFECYCLE",
  PAYMENTS = "PAYMENTS",
  TESTING = "TESTING",
  SECURITY = "SECURITY",
  ARCHITECTURE = "ARCHITECTURE",
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <Dashboard onTabChange={handleTabChange} />;
      case Tab.BOOKING:
        return <Booking />;
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
      <div className="flex h-full w-full bg-[#F4F4F5]">
        <LoadingIndicator />

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] text-zinc-400 flex flex-col flex-shrink-0 transition-transform duration-300 border-r border-zinc-800/50 lg:static lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-white">
                <div className="bg-white text-black p-1.5 rounded-md">
                  <Key className="w-4 h-4" />
                </div>
                <span className="font-semibold text-lg tracking-widest text-white uppercase">
                  RentFlow
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Prestige Fleet Management
              </p>
            </div>
            <button
              className="lg:hidden text-zinc-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              <li>
                <button
                  onClick={() => handleTabChange(Tab.DASHBOARD)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === Tab.DASHBOARD
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  Live Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange(Tab.BOOKING)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === Tab.BOOKING
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange(Tab.SCHEMA)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === Tab.SCHEMA
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Database className="w-5 h-5" />
                  Database Schema
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange(Tab.LIFECYCLE)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === Tab.LIFECYCLE
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <GitCommit className="w-5 h-5" />
                  Lifecycle Logic
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange(Tab.API)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === Tab.API
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Terminal className="w-5 h-5" />
                  API Reference
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange(Tab.PAYMENTS)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === Tab.PAYMENTS
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Payment System
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange(Tab.TESTING)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === Tab.TESTING
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  Testing Strategy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange(Tab.SECURITY)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === Tab.SECURITY
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  Security & Compliance
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange(Tab.ARCHITECTURE)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === Tab.ARCHITECTURE
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Layout className="w-5 h-5" />
                  System Architecture
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white cursor-pointer transition-colors">
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Settings</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-white w-full">
          <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-zinc-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-zinc-900 truncate">
                {activeTab === Tab.DASHBOARD && "Operational Overview"}
                {activeTab === Tab.SCHEMA && "PostgreSQL Production Schema"}
                {activeTab === Tab.API && "REST API Documentation"}
                {activeTab === Tab.LIFECYCLE && "Rental State Logic"}
                {activeTab === Tab.PAYMENTS && "Payment System Architecture"}
                {activeTab === Tab.TESTING && "Quality Assurance Strategy"}
                {activeTab === Tab.SECURITY && "Security & Compliance"}
                {activeTab === Tab.ARCHITECTURE && "Technical Architecture"}
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <span className="hidden md:inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                v2.4.0-stable
              </span>
              <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                <img
                  src="https://picsum.photos/100/100"
                  alt="Avatar"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4 md:p-6 bg-[#F4F4F5]">
            {renderContent()}
          </div>
        </main>
      </div>
    </LoadingProvider>
  );
};

export default App;
