import React from 'react';
import { CompanyProfile } from '../types/financials';
import { Sparkles, Calendar, Tag, ShieldAlert, Building2, HelpCircle } from 'lucide-react';

interface CompanyHeaderProps {
  company: CompanyProfile;
  selectedPeriods: string[];
  onPeriodToggle: (period: string) => void;
  onSetQuickPeriod: (type: 'all' | '3y') => void;
  onGenerateBrief: () => void;
  isGenerating?: boolean;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  company,
  selectedPeriods,
  onPeriodToggle,
  onSetQuickPeriod,
  onGenerateBrief,
  isGenerating = false,
}) => {
  const is3YActive =
    company.periods.length >= 3 &&
    selectedPeriods.length === 3 &&
    selectedPeriods[0] === company.periods[company.periods.length - 3];
  const isAllActive = selectedPeriods.length === company.periods.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Company Info Left */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {company.name}
            </h1>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              {company.ticker}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {company.sector} • {company.industry}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {company.description}
          </p>

          {/* Revenue Drivers & Model Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-medium">Model:</span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80">
              {company.businessModel}
            </span>
          </div>

          {/* Verification / Fictional Label */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="font-medium">{company.verificationLabel}</span>
            <span className="text-amber-400/70 hidden sm:inline">• For educational take-home research only</span>
          </div>
        </div>

        {/* Controls Right: Period Filter & Brief CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 flex-shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          {/* Period Filter Widget */}
          <div className="space-y-2 w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Reporting Periods:
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-md border border-slate-800">
                <button
                  onClick={() => onSetQuickPeriod('all')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    isAllActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({company.periods.length}Y)
                </button>
                <button
                  onClick={() => onSetQuickPeriod('3y')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    is3YActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Last 3Y
                </button>
              </div>
            </div>

            {/* Individual period checkboxes */}
            <div className="flex flex-wrap items-center gap-1.5 justify-start sm:justify-end">
              {company.periods.map((p) => {
                const isSelected = selectedPeriods.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => onPeriodToggle(p)}
                    className={`font-mono text-xs px-2.5 py-1 rounded-md border transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 font-semibold'
                        : 'bg-slate-800/50 text-slate-400 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button: Generate Research Brief */}
          <button
            onClick={onGenerateBrief}
            disabled={isGenerating || selectedPeriods.length < 2}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
              isGenerating
                ? 'bg-blue-700 text-blue-200 cursor-wait'
                : selectedPeriods.length < 2
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40 cursor-pointer'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>
              {isGenerating ? 'Synthesizing Brief...' : 'Generate Research Brief'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
