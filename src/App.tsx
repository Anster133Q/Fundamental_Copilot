import React, { useState, useMemo } from 'react';
import { SAMPLE_COMPANIES } from './data/sampleCompanies';
import { CompanyProfile, ResearchBrief } from './types/financials';
import { computeCompanyMetrics } from './engine/metricsCalculator';
import { generateResearchBrief } from './engine/insightEngine';

import { Navbar } from './components/Navbar';
import { HowItWorksModal } from './components/HowItWorksModal';
import { CompanyHeader } from './components/CompanyHeader';
import { KPICards } from './components/KPICards';
import { ChartsSection } from './components/ChartsSection';
import { StatementsTable } from './components/StatementsTable';
import { ResearchBriefView } from './components/ResearchBriefView';
import { ExportModal } from './components/ExportModal';
import { CSVUploadModal } from './components/CSVUploadModal';
import { SubmissionModal } from './components/SubmissionModal';

import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Layers,
  HelpCircle,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export function App() {
  // State
  const [companies, setCompanies] = useState<CompanyProfile[]>(SAMPLE_COMPANIES);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(SAMPLE_COMPANIES[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'brief'>('overview');

  // Modals
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isCSVUploadOpen, setIsCSVUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  // Loading animation state for synthesis
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizingStep, setSynthesizingStep] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Active company
  const activeCompany = useMemo(() => {
    return companies.find((c) => c.id === selectedCompanyId) || companies[0];
  }, [companies, selectedCompanyId]);

  // Selected periods state
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>(activeCompany.periods);

  // Update periods when company changes
  const handleSelectCompany = (id: string) => {
    setSelectedCompanyId(id);
    const target = companies.find((c) => c.id === id);
    if (target) {
      setSelectedPeriods(target.periods);
    }
  };

  // Toggle individual period
  const handlePeriodToggle = (period: string) => {
    if (selectedPeriods.includes(period)) {
      if (selectedPeriods.length <= 2) {
        // Keep at least 2 periods for comparative metrics
        return;
      }
      setSelectedPeriods(selectedPeriods.filter((p) => p !== period));
    } else {
      // Re-insert period in chronological order
      const newPeriods = activeCompany.periods.filter(
        (p) => selectedPeriods.includes(p) || p === period
      );
      setSelectedPeriods(newPeriods);
    }
  };

  // Set quick periods (All or Last 3)
  const handleSetQuickPeriod = (type: 'all' | '3y') => {
    if (type === 'all') {
      setSelectedPeriods(activeCompany.periods);
    } else {
      if (activeCompany.periods.length >= 3) {
        setSelectedPeriods(activeCompany.periods.slice(-3));
      } else {
        setSelectedPeriods(activeCompany.periods);
      }
    }
  };

  // Compute metrics for active periods
  const computedMetrics = useMemo(() => {
    return computeCompanyMetrics(activeCompany, selectedPeriods);
  }, [activeCompany, selectedPeriods]);

  // Generate or memoize research brief
  const researchBrief = useMemo<ResearchBrief | null>(() => {
    if (selectedPeriods.length < 2) return null;
    return generateResearchBrief(activeCompany, selectedPeriods);
  }, [activeCompany, selectedPeriods]);

  // Trigger Research Brief flow with interactive transition
  const handleGenerateBrief = () => {
    setIsSynthesizing(true);
    setSynthesizingStep('Ingesting statements and validating arithmetic line items...');

    setTimeout(() => {
      setSynthesizingStep('Computing margins, FCF conversion, and net debt metrics...');
    }, 450);

    setTimeout(() => {
      setSynthesizingStep('Auditing disclosure gaps and drafting follow-up questions...');
    }, 900);

    setTimeout(() => {
      setIsSynthesizing(false);
      setActiveTab('brief');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1350);
  };

  // Custom CSV Upload Handler
  const handleUploadSuccess = (uploadedCompany: CompanyProfile) => {
    setCompanies((prev) => [uploadedCompany, ...prev]);
    setSelectedCompanyId(uploadedCompany.id);
    setSelectedPeriods(uploadedCompany.periods);
    setActiveTab('overview');
  };

  // Copy Brief directly
  const handleCopyBrief = () => {
    if (!researchBrief) return;
    const { company, executiveSnapshot, periodsAnalyzed } = researchBrief;
    const text = `# Fundamental Research Brief: ${company.name} (${company.ticker})
Date: ${new Date().toLocaleDateString()} | Periods: ${periodsAnalyzed.join(', ')}
Status: ${company.verificationLabel}

Health Summary:
- Revenue Growth: ${executiveSnapshot.financialHealthScorecard.growthTrend}
- Operating Profitability: ${executiveSnapshot.financialHealthScorecard.profitabilityStatus}
- Cash Generation: ${executiveSnapshot.financialHealthScorecard.cashGenerationQuality}
- Balance Sheet: ${executiveSnapshot.financialHealthScorecard.balanceSheetRisk}

Positive Signals:
${researchBrief.positiveSignals.map((s) => `- ${s.title}: ${s.summary}`).join('\n')}

Risks:
${researchBrief.risks.map((r) => `- ${r.title}: ${r.summary}`).join('\n')}

Data Limitations:
${researchBrief.missingInformation.map((m) => `- ${m.title}: ${m.summary}`).join('\n')}

Suggested Research Questions:
${researchBrief.suggestedQuestions.map((q) => `- ${q.title}: ${q.summary}`).join('\n')}

Disclaimer: Research aid only. Not investment advice.`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onSelectCompany={handleSelectCompany}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenCSVUpload={() => setIsCSVUploadOpen(true)}
        onOpenSubmission={() => setIsSubmissionOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGenerateBrief={handleGenerateBrief}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Intro Hero Banner (shown on overview if first time or for context) */}
        {activeTab === 'overview' && (
          <div className="bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-slate-900 border border-blue-500/20 rounded-2xl p-5 sm:p-6 mb-6 shadow-md relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <Sparkles className="w-3 h-3" />
                  PRODUCT DEMONSTRATION
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Turn Complex Statements into Evidence-Linked Research Briefs
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Select a demonstration archetype below, inspect calculated margins and cash flows, and generate a structured research memo with transparent mathematical derivations.
                </p>
              </div>

              {/* Quick company pills for fast exploration */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Try Archetype:</span>
                {companies.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCompany(c.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      c.id === selectedCompanyId
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {c.ticker} ({c.sector.slice(0, 10)})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Company Header with Period Selector */}
        <CompanyHeader
          company={activeCompany}
          selectedPeriods={selectedPeriods}
          onPeriodToggle={handlePeriodToggle}
          onSetQuickPeriod={handleSetQuickPeriod}
          onGenerateBrief={handleGenerateBrief}
          isGenerating={isSynthesizing}
        />

        {/* TAB 1: OVERVIEW & FINANCIALS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Metric Cards */}
            <KPICards metrics={computedMetrics} company={activeCompany} />

            {/* Interactive Charts */}
            <ChartsSection metrics={computedMetrics} company={activeCompany} />

            {/* Tabular Statements Breakdown */}
            <StatementsTable
              company={activeCompany}
              metrics={computedMetrics}
              selectedPeriods={selectedPeriods}
            />

            {/* Bottom Call to Action to synthesize brief */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <h3 className="text-sm font-semibold text-white">
                Ready to synthesize these metrics into a complete research memo?
              </h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Fundamentals Copilot will audit trends across the {selectedPeriods.length} selected periods, highlight positive signals, surface margin or debt risks, and formulate targeted management questions.
              </p>
              <button
                onClick={handleGenerateBrief}
                disabled={isSynthesizing || selectedPeriods.length < 2}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Research Brief</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: RESEARCH BRIEF */}
        {activeTab === 'brief' && researchBrief && (
          <ResearchBriefView
            brief={researchBrief}
            onOpenExport={() => setIsExportOpen(true)}
            onCopyBrief={handleCopyBrief}
            copied={copiedNotification}
          />
        )}
      </main>

      {/* Synthesis Progress Overlay Modal */}
      {isSynthesizing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Synthesizing Evidence-Backed Brief
              </h3>
              <p className="text-xs text-blue-400 font-mono mt-2 animate-pulse">
                {synthesizingStep}
              </p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      )}

      {/* Footer & Compliance Disclaimer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400 font-medium">Fundamentals Copilot</span>
            <span>• Nubra Product Management Intern Assignment</span>
          </div>
          <div className="text-[11px] text-slate-400 text-center md:text-right max-w-xl">
            <strong className="text-slate-300">Disclaimer: </strong>
            This application is an educational and analytical research aid. It does not provide personalized investment advice, trading execution, or buy/sell recommendations. All demonstration data is fictional or user-supplied.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <CSVUploadModal
        isOpen={isCSVUploadOpen}
        onClose={() => setIsCSVUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {researchBrief && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          brief={researchBrief}
        />
      )}

      <SubmissionModal
        isOpen={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
      />
    </div>
  );
}

export default App;
