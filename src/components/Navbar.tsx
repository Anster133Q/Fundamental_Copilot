import React from 'react';
import { CompanyProfile } from '../types/financials';
import {
  FileText,
  HelpCircle,
  Upload,
  Layers,
  Sparkles,
  Info,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  companies: CompanyProfile[];
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
  onOpenHowItWorks: () => void;
  onOpenCSVUpload: () => void;
  onOpenSubmission: () => void;
  activeTab: 'overview' | 'brief';
  setActiveTab: (tab: 'overview' | 'brief') => void;
  onGenerateBrief: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  onOpenHowItWorks,
  onOpenCSVUpload,
  onOpenSubmission,
  activeTab,
  setActiveTab,
  onGenerateBrief,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-all">
      {/* Top micro-banner: Research purpose & disclaimer indicator */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/60 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            RESEARCH AID
          </span>
          <span className="hidden sm:inline text-slate-400">
            Fundamentals Copilot — Nubra Take-Home Assignment
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 truncate max-w-[280px] sm:max-w-none">
            Evidence-backed statement analysis for retail investors. No buy/sell ratings.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSubmission}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 transition-colors cursor-pointer"
            title="View Nubra Case 4 Artifacts submission"
          >
            <span>Assignment Case (4 Artifacts)</span>
          </button>
          <button
            onClick={onOpenHowItWorks}
            className="text-slate-400 hover:text-blue-400 flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How it works</span>
          </button>
        </div>
      </div>

      {/* Main navigation toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 text-base tracking-tight">
                Fundamentals<span className="text-blue-400">Copilot</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Financial Statement Research & Brief Engine
            </p>
          </div>
        </div>

        {/* Company Quick-Selector & Tabs */}
        <div className="flex items-center gap-3">
          {/* Company Picker Dropdown */}
          <div className="relative">
            <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-lg p-1 text-xs">
              <span className="text-slate-400 px-2 font-medium hidden md:inline">Company:</span>
              <div className="relative">
                <select
                  value={selectedCompanyId}
                  onChange={(e) => onSelectCompany(e.target.value)}
                  className="bg-slate-900 text-slate-100 font-medium py-1.5 pl-2.5 pr-8 rounded-md border border-slate-700/80 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer text-xs"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.ticker})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Navigation View Tabs */}
          <nav className="hidden lg:flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Financial Overview & Charts
            </button>
            <button
              onClick={() => setActiveTab('brief')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'brief'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Research Brief
            </button>
          </nav>

          {/* Action: Upload CSV */}
          <button
            onClick={onOpenCSVUpload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Upload custom company financial statement CSV"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Upload CSV</span>
          </button>

          {/* Primary CTA: Generate Brief */}
          {activeTab === 'overview' && (
            <button
              onClick={onGenerateBrief}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-sm shadow-blue-600/30 hover:shadow-blue-600/50 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Brief</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Subnav Tabs */}
      <div className="lg:hidden border-t border-slate-800/60 bg-slate-950/70 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1 text-xs font-medium rounded ${
            activeTab === 'overview' ? 'bg-slate-800 text-blue-400' : 'text-slate-400'
          }`}
        >
          Financial Overview
        </button>
        <button
          onClick={() => setActiveTab('brief')}
          className={`px-3 py-1 text-xs font-medium rounded flex items-center gap-1 ${
            activeTab === 'brief' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          Research Brief
        </button>
      </div>
    </header>
  );
};
