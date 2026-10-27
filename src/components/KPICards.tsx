import React, { useState } from 'react';
import { ComputedPeriodMetrics, CompanyProfile } from '../types/financials';
import {
  formatCurrency,
  formatPercent,
  formatRatio,
} from '../engine/metricsCalculator';
import {
  TrendingUp,
  TrendingDown,
  Info,
  DollarSign,
  Activity,
  Layers,
  Scale,
  ShieldAlert,
  HelpCircle,
  X
} from 'lucide-react';

interface KPICardsProps {
  metrics: ComputedPeriodMetrics[];
  company: CompanyProfile;
}

interface FormulaModalData {
  title: string;
  metricValue: string;
  formula: string;
  inputs: { label: string; value: string }[];
  explanation: string;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics, company }) => {
  const [activeFormula, setActiveFormula] = useState<FormulaModalData | null>(null);

  if (!metrics || metrics.length === 0) return null;

  const latest = metrics[metrics.length - 1];
  const previous = metrics.length > 1 ? metrics[metrics.length - 2] : null;
  const first = metrics[0];

  // 1. Revenue & YoY Growth
  const revGrowth = latest.revenueGrowthYoY;
  const revCard: FormulaModalData = {
    title: 'Revenue & YoY Growth Rate',
    metricValue: `${formatCurrency(latest.revenue, company.currency, company.unit)} (${formatPercent(revGrowth)})`,
    formula: '((Revenue_latest - Revenue_previous) / |Revenue_previous|) * 100',
    inputs: [
      { label: `${latest.period} Revenue`, value: formatCurrency(latest.revenue, company.currency, company.unit) },
      { label: `${previous ? previous.period : 'Base'} Revenue`, value: previous ? formatCurrency(previous.revenue, company.currency, company.unit) : 'N/A' },
    ],
    explanation: 'Measures percentage change in total net revenue year-over-year. Indicates business expansion velocity.',
  };

  // 2. Operating Margin (EBIT Margin)
  const opMarginDelta = previous ? latest.operatingMargin - previous.operatingMargin : 0;
  const opMarginCard: FormulaModalData = {
    title: 'Operating Margin (EBIT Margin)',
    metricValue: formatPercent(latest.operatingMargin),
    formula: '(Operating Income / Total Revenue) * 100',
    inputs: [
      { label: `${latest.period} Operating Income`, value: formatCurrency(latest.operatingIncome, company.currency, company.unit) },
      { label: `${latest.period} Total Revenue`, value: formatCurrency(latest.revenue, company.currency, company.unit) },
    ],
    explanation: 'Represents operating profitability before interest and taxes. Reflects cost structure and operational leverage.',
  };

  // 3. Net Profit & Net Margin
  const netProfitCard: FormulaModalData = {
    title: 'Net Profit & Net Margin',
    metricValue: `${formatCurrency(latest.netIncome, company.currency, company.unit)} (${formatPercent(latest.netMargin)})`,
    formula: '(Net Income / Total Revenue) * 100',
    inputs: [
      { label: `${latest.period} Net Income`, value: formatCurrency(latest.netIncome, company.currency, company.unit) },
      { label: `${latest.period} Total Revenue`, value: formatCurrency(latest.revenue, company.currency, company.unit) },
    ],
    explanation: 'Bottom-line residual earnings available to equity shareholders after all operating costs, interest, and taxes.',
  };

  // 4. Operating Cash Flow & FCF
  const fcfCard: FormulaModalData = {
    title: 'Free Cash Flow (FCF) & Operating Cash Flow',
    metricValue: `OCF: ${formatCurrency(latest.operatingCashFlow)} | FCF: ${formatCurrency(latest.freeCashFlow)}`,
    formula: 'Free Cash Flow = Operating Cash Flow - Capital Expenditures',
    inputs: [
      { label: `${latest.period} Operating Cash Flow`, value: formatCurrency(latest.operatingCashFlow, company.currency, company.unit) },
      { label: `${latest.period} Capital Expenditures (Capex)`, value: formatCurrency(latest.capex, company.currency, company.unit) },
    ],
    explanation: 'Pure cash generated after funding necessary capital reinvestment. Essential for funding acquisitions, dividends, or debt reduction.',
  };

  // 5. Total Debt & Net Debt
  const isNetCash = latest.netDebt <= 0;
  const debtCard: FormulaModalData = {
    title: 'Total Debt & Net Debt Position',
    metricValue: isNetCash ? `Net Cash: ${formatCurrency(Math.abs(latest.netDebt))}` : `Net Debt: ${formatCurrency(latest.netDebt)}`,
    formula: 'Net Debt = Total Debt - (Cash & Cash Equivalents + Short-Term Investments)',
    inputs: [
      { label: `${latest.period} Total Debt`, value: formatCurrency(latest.totalDebt, company.currency, company.unit) },
      { label: `${latest.period} Liquid Cash & Investments`, value: formatCurrency(latest.cashAndEquiv, company.currency, company.unit) },
    ],
    explanation: 'Determines financial leverage. Negative net debt means liquid reserves exceed all outstanding debt obligations.',
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
        {/* Card 1: Revenue & Growth */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors relative group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Revenue ({latest.period})
            </span>
            <button
              onClick={() => setActiveFormula(revCard)}
              className="text-slate-500 hover:text-blue-400 p-0.5 rounded transition-colors"
              title="Inspect formula & calculation"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-white font-mono tracking-tight">
              {formatCurrency(latest.revenue, company.currency, company.unit)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              {revGrowth !== null ? (
                <>
                  {revGrowth >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  <span
                    className={`font-mono font-medium ${
                      revGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatPercent(revGrowth)} YoY
                  </span>
                </>
              ) : (
                <span className="text-slate-500">Base period</span>
              )}
            </div>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-1.5 mt-1">
            <span>Prior: {previous ? formatCurrency(previous.revenue) : 'N/A'}</span>
            <span className="font-mono text-slate-400">Formula: YoY %</span>
          </div>
        </div>

        {/* Card 2: Operating Margin */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors relative group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Operating Margin
            </span>
            <button
              onClick={() => setActiveFormula(opMarginCard)}
              className="text-slate-500 hover:text-blue-400 p-0.5 rounded transition-colors"
              title="Inspect formula & calculation"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-white font-mono tracking-tight">
              {formatPercent(latest.operatingMargin)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              <span
                className={`font-mono font-medium ${
                  latest.operatingMargin >= 15
                    ? 'text-emerald-400'
                    : latest.operatingMargin > 0
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                EBIT: {formatCurrency(latest.operatingIncome)}
              </span>
              {previous && (
                <span className="text-[11px] text-slate-500">
                  ({opMarginDelta >= 0 ? '+' : ''}
                  {opMarginDelta.toFixed(1)} pts)
                </span>
              )}
            </div>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-1.5 mt-1">
            <span>Gross: {formatPercent(latest.grossMargin)}</span>
            <span className="font-mono text-slate-400">EBIT / Rev</span>
          </div>
        </div>

        {/* Card 3: Net Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors relative group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Net Income ({latest.period})
            </span>
            <button
              onClick={() => setActiveFormula(netProfitCard)}
              className="text-slate-500 hover:text-blue-400 p-0.5 rounded transition-colors"
              title="Inspect formula & calculation"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="my-2">
            <div
              className={`text-xl font-bold font-mono tracking-tight ${
                latest.netIncome >= 0 ? 'text-white' : 'text-rose-400'
              }`}
            >
              {formatCurrency(latest.netIncome, company.currency, company.unit)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-slate-400">Net Margin:</span>
              <span
                className={`font-mono font-medium ${
                  latest.netMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatPercent(latest.netMargin)}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-1.5 mt-1">
            <span>ROE: {latest.returnOnEquity !== null ? formatPercent(latest.returnOnEquity) : 'N/A'}</span>
            <span className="font-mono text-slate-400">NI / Rev</span>
          </div>
        </div>

        {/* Card 4: Operating Cash Flow & FCF */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors relative group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Free Cash Flow
            </span>
            <button
              onClick={() => setActiveFormula(fcfCard)}
              className="text-slate-500 hover:text-blue-400 p-0.5 rounded transition-colors"
              title="Inspect formula & calculation"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="my-2">
            <div
              className={`text-xl font-bold font-mono tracking-tight ${
                latest.freeCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCurrency(latest.freeCashFlow, company.currency, company.unit)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
              <span>OCF:</span>
              <span className="font-mono text-slate-300 font-medium">
                {formatCurrency(latest.operatingCashFlow)}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-1.5 mt-1">
            <span>Capex: {formatCurrency(latest.capex)}</span>
            <span className="font-mono text-slate-400">OCF - Capex</span>
          </div>
        </div>

        {/* Card 5: Debt & Solvency */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors relative group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Liquidity & Debt
            </span>
            <button
              onClick={() => setActiveFormula(debtCard)}
              className="text-slate-500 hover:text-blue-400 p-0.5 rounded transition-colors"
              title="Inspect formula & calculation"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="my-2">
            <div
              className={`text-xl font-bold font-mono tracking-tight ${
                isNetCash ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {isNetCash
                ? `+${formatCurrency(Math.abs(latest.netDebt))}`
                : `-${formatCurrency(latest.netDebt)}`}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              <span className="text-slate-400">
                {isNetCash ? 'Net Cash Buffer' : 'Net Debt'}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-1.5 mt-1">
            <span>Debt: {formatCurrency(latest.totalDebt)}</span>
            <span className="font-mono text-slate-400">Debt - Cash</span>
          </div>
        </div>
      </div>

      {/* Formula Inspector Modal / Popover */}
      {activeFormula && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl text-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-white">{activeFormula.title}</h4>
                <div className="text-xs font-mono text-blue-400 mt-0.5">
                  Computed Output: {activeFormula.metricValue}
                </div>
              </div>
              <button
                onClick={() => setActiveFormula(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Mathematical Formula
                </span>
                <code className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-amber-300 block">
                  {activeFormula.formula}
                </code>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Source Input Line Items
                </span>
                <div className="bg-slate-950/60 rounded border border-slate-800 divide-y divide-slate-800/60 text-xs">
                  {activeFormula.inputs.map((inp, idx) => (
                    <div key={idx} className="flex justify-between p-2">
                      <span className="text-slate-400">{inp.label}</span>
                      <span className="font-mono text-white font-medium">{inp.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed bg-slate-800/40 p-2.5 rounded border border-slate-800">
                {activeFormula.explanation}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setActiveFormula(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
