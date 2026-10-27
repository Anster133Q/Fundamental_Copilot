import React, { useState } from 'react';
import { CompanyProfile, ComputedPeriodMetrics } from '../types/financials';
import { formatCurrency, formatPercent } from '../engine/metricsCalculator';
import { Table, FileSpreadsheet, ArrowUpDown, Info, HelpCircle } from 'lucide-react';

interface StatementsTableProps {
  company: CompanyProfile;
  metrics: ComputedPeriodMetrics[];
  selectedPeriods: string[];
}

export const StatementsTable: React.FC<StatementsTableProps> = ({
  company,
  metrics,
  selectedPeriods,
}) => {
  const [activeStatement, setActiveStatement] = useState<'income' | 'balance' | 'cashflow'>('income');
  const [inspectFormula, setInspectFormula] = useState<string | null>(null);

  const periods = selectedPeriods;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6">
      {/* Table Subheader & Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            Financial Statements Breakdown
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Normalized statement lines (All figures in {company.currency} {company.unit})
          </p>
        </div>

        {/* Statement Selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveStatement('income')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeStatement === 'income'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Income Statement
          </button>
          <button
            onClick={() => setActiveStatement('balance')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeStatement === 'balance'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setActiveStatement('cashflow')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeStatement === 'cashflow'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cash Flow Statement
          </button>
        </div>
      </div>

      {/* Formula hint banner */}
      {inspectFormula && (
        <div className="mt-4 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
          <span className="flex items-center gap-2 font-mono">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            {inspectFormula}
          </span>
          <button
            onClick={() => setInspectFormula(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5"
          >
            Clear
          </button>
        </div>
      )}

      {/* Responsive Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-medium bg-slate-950/40">
              <th className="py-2.5 px-3 font-semibold text-slate-300">Financial Line Item</th>
              {periods.map((p) => (
                <th key={p} className="py-2.5 px-3 text-right font-mono font-semibold text-slate-300">
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {/* INCOME STATEMENT ROWS */}
            {activeStatement === 'income' && (
              <>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                    Total Revenue
                  </td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.income;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right text-slate-100 font-semibold">
                        {stmt ? formatCurrency(stmt.revenue, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors text-slate-400">
                  <td className="py-2.5 px-3 font-sans pl-6">
                    Cost of Goods Sold (COGS)
                  </td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.income;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right">
                        {stmt ? formatCurrency(stmt.cogs, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Gross Profit (Calculated) */}
                <tr
                  className="bg-slate-950/50 hover:bg-slate-800/60 transition-colors cursor-pointer"
                  onClick={() => setInspectFormula('Gross Profit = Total Revenue - Cost of Goods Sold')}
                  title="Click to view formula"
                >
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200 flex items-center gap-1.5">
                    Gross Profit
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Calculated
                    </span>
                  </td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.income;
                    const gp = stmt ? stmt.grossProfit ?? (stmt.revenue - stmt.cogs) : null;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right text-emerald-400 font-medium">
                        {gp !== null ? formatCurrency(gp, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors text-slate-400">
                  <td className="py-2.5 px-3 font-sans pl-6">Research & Development (R&D)</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.income;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right">
                        {stmt ? formatCurrency(stmt.rAndD, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors text-slate-400">
                  <td className="py-2.5 px-3 font-sans pl-6">Selling, General & Admin (SG&A)</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.income;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right">
                        {stmt ? formatCurrency(stmt.sga, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Operating Income / EBIT (Calculated) */}
                <tr
                  className="bg-slate-950/60 hover:bg-slate-800/60 transition-colors cursor-pointer"
                  onClick={() => setInspectFormula('Operating Income (EBIT) = Gross Profit - Operating Expenses')}
                  title="Click to view formula"
                >
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200 flex items-center gap-1.5">
                    Operating Income (EBIT)
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Calculated
                    </span>
                  </td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.income;
                    return (
                      <td
                        key={p}
                        className={`py-2.5 px-3 text-right font-semibold ${
                          (stmt?.operatingIncome ?? 0) >= 0 ? 'text-white' : 'text-rose-400'
                        }`}
                      >
                        {stmt ? formatCurrency(stmt.operatingIncome, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Operating Margin % */}
                <tr
                  className="hover:bg-slate-800/40 transition-colors text-xs text-slate-300 cursor-pointer"
                  onClick={() => setInspectFormula('Operating Margin = (Operating Income / Revenue) * 100')}
                >
                  <td className="py-2 px-3 font-sans pl-6 text-slate-400">
                    Operating Margin %
                  </td>
                  {periods.map((p) => {
                    const m = metrics.find((x) => x.period === p);
                    return (
                      <td
                        key={p}
                        className={`py-2 px-3 text-right ${
                          (m?.operatingMargin ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {m ? formatPercent(m.operatingMargin) : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors text-slate-400">
                  <td className="py-2.5 px-3 font-sans pl-6">Interest Expense</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.income;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right">
                        {stmt ? formatCurrency(stmt.interestExpense, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Net Income */}
                <tr className="bg-slate-800/30 hover:bg-slate-800/60 transition-colors font-semibold">
                  <td className="py-2.5 px-3 font-sans text-slate-100">
                    Net Income (Loss)
                  </td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.income;
                    return (
                      <td
                        key={p}
                        className={`py-2.5 px-3 text-right font-bold ${
                          (stmt?.netIncome ?? 0) >= 0 ? 'text-white' : 'text-rose-400'
                        }`}
                      >
                        {stmt ? formatCurrency(stmt.netIncome, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              </>
            )}

            {/* BALANCE SHEET ROWS */}
            {activeStatement === 'balance' && (
              <>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                    Cash & Cash Equivalents
                  </td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.balance;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right text-emerald-400 font-semibold">
                        {stmt ? formatCurrency(stmt.cashAndEquivalents, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors text-slate-400">
                  <td className="py-2.5 px-3 font-sans pl-6">Short-Term Investments</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.balance;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right">
                        {stmt ? formatCurrency(stmt.shortTermInvestments, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors text-slate-400">
                  <td className="py-2.5 px-3 font-sans pl-6">Accounts Receivable</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.balance;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right">
                        {stmt ? formatCurrency(stmt.accountsReceivable, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="bg-slate-950/40 hover:bg-slate-800/60 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-300">Total Current Assets</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.balance;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right text-slate-200">
                        {stmt ? formatCurrency(stmt.currentAssets, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors font-semibold">
                  <td className="py-2.5 px-3 font-sans text-slate-100">Total Assets</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.balance;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right text-white">
                        {stmt ? formatCurrency(stmt.totalAssets, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors text-slate-400">
                  <td className="py-2.5 px-3 font-sans pl-6">Short-Term Debt</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.balance;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right">
                        {stmt ? formatCurrency(stmt.shortTermDebt, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors text-slate-400">
                  <td className="py-2.5 px-3 font-sans pl-6">Long-Term Debt</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.balance;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right">
                        {stmt ? formatCurrency(stmt.longTermDebt, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Total Debt (Calculated) */}
                <tr
                  className="bg-slate-950/50 hover:bg-slate-800/60 transition-colors cursor-pointer"
                  onClick={() => setInspectFormula('Total Debt = Short-Term Debt + Long-Term Debt')}
                >
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200 flex items-center gap-1.5">
                    Total Debt
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Calculated
                    </span>
                  </td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.balance;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right text-rose-400 font-semibold">
                        {stmt ? formatCurrency(stmt.totalDebt, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Net Debt (Calculated) */}
                <tr
                  className="bg-slate-950/80 hover:bg-slate-800/60 transition-colors cursor-pointer"
                  onClick={() => setInspectFormula('Net Debt = Total Debt - (Cash & Cash Equivalents + Short-Term Investments)')}
                >
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200 flex items-center gap-1.5">
                    Net Debt Position
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Calculated
                    </span>
                  </td>
                  {periods.map((p) => {
                    const m = metrics.find((x) => x.period === p);
                    const isNetCash = (m?.netDebt ?? 0) <= 0;
                    return (
                      <td
                        key={p}
                        className={`py-2.5 px-3 text-right font-bold ${
                          isNetCash ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {m ? formatCurrency(m.netDebt, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors font-semibold">
                  <td className="py-2.5 px-3 font-sans text-slate-100">Stockholders' Equity</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.balance;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right text-white">
                        {stmt ? formatCurrency(stmt.stockholdersEquity, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              </>
            )}

            {/* CASH FLOW ROWS */}
            {activeStatement === 'cashflow' && (
              <>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                    Operating Cash Flow (OCF)
                  </td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.cashFlow;
                    return (
                      <td
                        key={p}
                        className={`py-2.5 px-3 text-right font-semibold ${
                          (stmt?.operatingCashFlow ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {stmt ? formatCurrency(stmt.operatingCashFlow, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors text-slate-400">
                  <td className="py-2.5 px-3 font-sans pl-6">Capital Expenditures (Capex Outflow)</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.cashFlow;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right text-rose-400/90">
                        {stmt ? formatCurrency(stmt.capex, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Free Cash Flow (Calculated) */}
                <tr
                  className="bg-slate-950/70 hover:bg-slate-800/60 transition-colors cursor-pointer"
                  onClick={() => setInspectFormula('Free Cash Flow = Operating Cash Flow - Capital Expenditures')}
                >
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200 flex items-center gap-1.5">
                    Free Cash Flow (FCF)
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Calculated
                    </span>
                  </td>
                  {periods.map((p) => {
                    const m = metrics.find((x) => x.period === p);
                    return (
                      <td
                        key={p}
                        className={`py-2.5 px-3 text-right font-bold ${
                          (m?.freeCashFlow ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {m ? formatCurrency(m.freeCashFlow, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors text-slate-400">
                  <td className="py-2.5 px-3 font-sans pl-6">Cash Dividends Paid</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.cashFlow;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right">
                        {stmt ? formatCurrency(stmt.dividendsPaid, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                <tr className="hover:bg-slate-800/40 transition-colors text-slate-400">
                  <td className="py-2.5 px-3 font-sans pl-6">Common Share Repurchases</td>
                  {periods.map((p) => {
                    const stmt = company.statements[p]?.cashFlow;
                    return (
                      <td key={p} className="py-2.5 px-3 text-right">
                        {stmt ? formatCurrency(stmt.shareRepurchases, company.currency, '') : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-2">
        <span>Click any row tagged "Calculated" to display formula</span>
        <span>Units: {company.currency} {company.unit}</span>
      </div>
    </div>
  );
};
