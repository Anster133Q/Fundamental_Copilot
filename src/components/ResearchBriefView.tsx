import React, { useState } from 'react';
import type { ResearchBrief, ResearchInsight, InsightCategory } from '../types/financials';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileQuestion,
  HelpCircle,
  Copy,
  Download,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldCheck,
  Layers,
  Check,
  FileDown
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../engine/metricsCalculator';
import { generateFinancialAnalysisPDF } from '../engine/pdfGenerator';

interface ResearchBriefViewProps {
  brief: ResearchBrief;
  onOpenExport: () => void;
  onCopyBrief: () => void;
  copied: boolean;
}

export const ResearchBriefView: React.FC<ResearchBriefViewProps> = ({
  brief,
  onOpenExport,
  onCopyBrief,
  copied,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedInsights, setExpandedInsights] = useState<Record<string, boolean>>({
    // Expand the first positive signal and risk by default
    ...(brief.positiveSignals[0] ? { [brief.positiveSignals[0].id]: true } : {}),
    ...(brief.risks[0] ? { [brief.risks[0].id]: true } : {}),
  });

  const toggleInsight = (id: string) => {
    setExpandedInsights((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allIds: Record<string, boolean> = {};
    allInsightsList.forEach((ins) => {
      allIds[ins.id] = true;
    });
    setExpandedInsights(allIds);
  };

  const collapseAll = () => {
    setExpandedInsights({});
  };

  // Combine all insights
  const allInsightsList: ResearchInsight[] = [
    ...brief.positiveSignals,
    ...brief.risks,
    ...brief.opportunities,
    ...brief.missingInformation,
    ...brief.suggestedQuestions,
  ];

  // Filtering
  const filteredInsights = allInsightsList.filter((ins) => {
    const matchesCategory =
      selectedCategory === 'all' || ins.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      ins.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.supportingEvidence.metricName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const getCategoryBadge = (category: InsightCategory) => {
    switch (category) {
      case 'positive_signal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Positive Signal
          </span>
        );
      case 'risk':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            Risk / Vulnerability
          </span>
        );
      case 'opportunity':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Lightbulb className="w-3 h-3" />
            Opportunity
          </span>
        );
      case 'missing_info':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30">
            <FileQuestion className="w-3 h-3" />
            Data Limitation
          </span>
        );
      case 'research_question':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <HelpCircle className="w-3 h-3" />
            Research Question
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Memo Header & Quick Export Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Fundamental Research Brief: {brief.company.name} ({brief.company.ticker})
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Evaluated across periods: <span className="font-mono text-slate-300 font-semibold">{brief.periodsAnalyzed.join(', ')}</span> • Generated on {new Date(brief.generatedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Action buttons: Copy / Download PDF / Export */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => generateFinancialAnalysisPDF(brief)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-blue-500/40 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold transition-all shadow-sm cursor-pointer"
              title="Download publication-grade Financial Analysis PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-blue-400" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onCopyBrief}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Brief</span>
                </>
              )}
            </button>
            <button
              onClick={onOpenExport}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>More Formats</span>
            </button>
          </div>
        </div>

        {/* Executive Snapshot Card */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Revenue Trajectory
            </span>
            <div className="text-sm font-semibold text-white">
              {brief.executiveSnapshot.financialHealthScorecard.growthTrend}
            </div>
            <div className="text-[11px] font-mono text-blue-400 mt-1">
              {brief.executiveSnapshot.rawMetricsSummary.cagrRevenue !== null
                ? `CAGR: ${formatPercent(brief.executiveSnapshot.rawMetricsSummary.cagrRevenue)}`
                : 'Comparative Growth'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Operating Profitability
            </span>
            <div className="text-sm font-semibold text-white">
              {brief.executiveSnapshot.financialHealthScorecard.profitabilityStatus}
            </div>
            <div className="text-[11px] font-mono text-emerald-400 mt-1">
              Avg Margin: {formatPercent(brief.executiveSnapshot.rawMetricsSummary.avgOperatingMargin)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Cash Generation Quality
            </span>
            <div className="text-sm font-semibold text-white">
              {brief.executiveSnapshot.financialHealthScorecard.cashGenerationQuality}
            </div>
            <div className="text-[11px] font-mono text-slate-300 mt-1">
              Cumul. FCF: {formatCurrency(brief.executiveSnapshot.rawMetricsSummary.cumulativeFCF)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
              Balance Sheet Health
            </span>
            <div className="text-sm font-semibold text-white">
              {brief.executiveSnapshot.financialHealthScorecard.balanceSheetRisk}
            </div>
            <div className="text-[11px] font-mono text-amber-400 mt-1">
              Net Position: {formatCurrency(brief.executiveSnapshot.rawMetricsSummary.latestNetDebt)}
            </div>
          </div>
        </div>

        {/* Business Model Summary */}
        <div className="mt-4 p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Layers className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white font-medium">Business Model Snapshot: </strong>
            {brief.executiveSnapshot.businessModelSummary}
          </div>
        </div>
      </div>

      {/* Insight Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Insights ({allInsightsList.length})
          </button>
          <button
            onClick={() => setSelectedCategory('positive_signal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
              selectedCategory === 'positive_signal'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Positive Signals ({brief.positiveSignals.length})
          </button>
          <button
            onClick={() => setSelectedCategory('risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
              selectedCategory === 'risk'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Risks ({brief.risks.length})
          </button>
          <button
            onClick={() => setSelectedCategory('opportunity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'opportunity'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Opportunities ({brief.opportunities.length})
          </button>
          <button
            onClick={() => setSelectedCategory('missing_info')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'missing_info'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Data Limitations ({brief.missingInformation.length})
          </button>
          <button
            onClick={() => setSelectedCategory('research_question')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'research_question'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Questions ({brief.suggestedQuestions.length})
          </button>
        </div>

        {/* Search input & bulk collapse controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <button
              onClick={expandAll}
              className="px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Expand all
            </button>
            <span>•</span>
            <button
              onClick={collapseAll}
              className="px-2 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Collapse all
            </button>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            No research insights found matching your current filter.
          </div>
        ) : (
          filteredInsights.map((insight) => {
            const isExpanded = !!expandedInsights[insight.id];
            const ev = insight.supportingEvidence;

            return (
              <div
                key={insight.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all hover:border-slate-700/80 shadow-sm"
              >
                {/* Header row */}
                <div
                  onClick={() => toggleInsight(insight.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none hover:bg-slate-800/30 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getCategoryBadge(insight.category)}

                      {/* Fact vs Hypothesis Tag */}
                      <span
                        className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold ${
                          insight.evidenceType === 'measured_fact'
                            ? 'bg-slate-800 text-slate-300 border border-slate-700'
                            : 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/50'
                        }`}
                      >
                        {insight.evidenceType === 'measured_fact'
                          ? 'Measured Fact'
                          : 'Hypothesis / Interpretation'}
                      </span>

                      {/* Evaluated Periods */}
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        Periods: {ev.periodsEvaluated.join(' → ')}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                      {insight.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {insight.summary}
                    </p>
                  </div>

                  {/* Toggle arrow button */}
                  <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                    <span className="text-[11px] text-blue-400 hidden sm:inline font-medium">
                      {isExpanded ? 'Hide Evidence' : 'Inspect Evidence'}
                    </span>
                    <button className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Evidence & Calculation Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/50 space-y-4">
                    {/* Deep interpretation */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-slate-200 block mb-1">
                        Analytical Context & Significance:
                      </strong>
                      {insight.detailedInterpretation}
                    </div>

                    {/* Evidence Inspector Box */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-blue-400" />
                          Auditable Mathematical Evidence
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          Metric: <strong className="text-slate-200">{ev.metricName}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                            Base Value ({ev.periodsEvaluated[0]})
                          </span>
                          <span className="font-mono text-sm font-semibold text-white">
                            {ev.startValue}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                            Latest Value ({ev.periodsEvaluated[ev.periodsEvaluated.length - 1]})
                          </span>
                          <span className="font-mono text-sm font-semibold text-white">
                            {ev.endValue}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                            Measured Variance
                          </span>
                          <span className="font-mono text-sm font-semibold text-emerald-400">
                            {ev.changeFormatted}
                          </span>
                        </div>
                      </div>

                      {/* Formula & Source Line items */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                          Applied Calculation Formula
                        </span>
                        <code className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-amber-300 block">
                          {ev.formula}
                        </code>
                      </div>

                      {ev.sourceLineItems && ev.sourceLineItems.length > 0 && (
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                            Reported Source Inputs
                          </span>
                          <div className="bg-slate-950 rounded border border-slate-800 divide-y divide-slate-800 text-xs">
                            {ev.sourceLineItems.map((item, idx) => (
                              <div key={idx} className="flex justify-between p-2">
                                <span className="text-slate-400">{item.name}</span>
                                <span className="font-mono text-slate-200 font-medium">
                                  {item.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {ev.methodologyNote && (
                        <p className="text-[11px] text-slate-500 italic">
                          Note: {ev.methodologyNote}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
