import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  AreaChart,
  Area,
} from 'recharts';
import { ComputedPeriodMetrics, CompanyProfile } from '../types/financials';
import { formatCurrency, formatPercent } from '../engine/metricsCalculator';
import { BarChart3, LineChart, DollarSign, Shield, Activity } from 'lucide-react';

interface ChartsSectionProps {
  metrics: ComputedPeriodMetrics[];
  company: CompanyProfile;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ metrics, company }) => {
  const [activeChartTab, setActiveChartTab] = useState<'revenue_margin' | 'cash_flow' | 'debt_solvency'>('revenue_margin');

  if (!metrics || metrics.length === 0) return null;

  // Prepare chart payload
  const chartData = metrics.map((m) => ({
    period: m.period,
    revenue: m.revenue,
    grossProfit: m.grossProfit,
    operatingIncome: m.operatingIncome,
    netIncome: m.netIncome,
    operatingMargin: parseFloat(m.operatingMargin.toFixed(1)),
    netMargin: parseFloat(m.netMargin.toFixed(1)),
    operatingCashFlow: m.operatingCashFlow,
    capex: m.capex,
    freeCashFlow: m.freeCashFlow,
    totalDebt: m.totalDebt,
    cashAndEquiv: m.cashAndEquiv,
    netDebt: m.netDebt,
  }));

  // Custom tooltips with units
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl text-xs backdrop-blur-xs font-mono">
          <p className="font-semibold text-white mb-1.5 pb-1 border-b border-slate-800">
            {label} Performance
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              const isPercentage = entry.name.toLowerCase().includes('margin') || entry.name.toLowerCase().includes('rate');
              return (
                <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                    {entry.name}:
                  </span>
                  <span className="font-semibold text-slate-100">
                    {isPercentage ? formatPercent(entry.value) : formatCurrency(entry.value, company.currency, company.unit)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6">
      {/* Header with Chart Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Financial Performance Trajectory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive multi-period financial trends (Currency: {company.currency} in {company.unit})
          </p>
        </div>

        {/* Chart View Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveChartTab('revenue_margin')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeChartTab === 'revenue_margin'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Revenue & Margins
          </button>
          <button
            onClick={() => setActiveChartTab('cash_flow')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeChartTab === 'cash_flow'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cash Flow & Capex
          </button>
          <button
            onClick={() => setActiveChartTab('debt_solvency')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeChartTab === 'debt_solvency'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Debt & Liquidity
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="pt-6">
        {activeChartTab === 'revenue_margin' && (
          <div>
            <div className="h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="period" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis
                    yAxisId="left"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(v) => `${company.currency}${v}`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }}
                    iconType="circle"
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    name="Revenue"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="operatingMargin"
                    name="Operating Margin %"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="netMargin"
                    name="Net Margin %"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: '#f59e0b' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
              <span>Primary Y-Axis: Total Revenue ({company.currency}{company.unit})</span>
              <span>Secondary Y-Axis: Operating & Net Margin (%)</span>
            </div>
          </div>
        )}

        {activeChartTab === 'cash_flow' && (
          <div>
            <div className="h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="period" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(v) => `${company.currency}${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="operatingCashFlow"
                    name="Operating Cash Flow"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="capex"
                    name="Capital Expenditures (Capex)"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Line
                    type="monotone"
                    dataKey="freeCashFlow"
                    name="Free Cash Flow (FCF)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
              <span>Rule: Free Cash Flow = Operating Cash Flow minus Capex</span>
              <span className="text-emerald-400 font-mono font-medium">
                Latest FCF: {formatCurrency(chartData[chartData.length - 1].freeCashFlow)}
              </span>
            </div>
          </div>
        )}

        {activeChartTab === 'debt_solvency' && (
          <div>
            <div className="h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="period" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(v) => `${company.currency}${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="cashAndEquiv"
                    name="Cash & Liquid Reserves"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="totalDebt"
                    name="Total Debt Obligations"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
              <span>Net Debt = Total Debt - Cash & Liquid Reserves</span>
              <span className="font-mono text-slate-300">
                Net Position: {formatCurrency(chartData[chartData.length - 1].netDebt)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
