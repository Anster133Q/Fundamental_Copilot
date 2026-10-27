import { PeriodFinancials, ComputedPeriodMetrics, CompanyProfile } from '../types/financials';

/**
 * Deterministically computes financial metrics for a single period,
 * using source values and comparing against the prior period if available.
 */
export function calculatePeriodMetrics(
  current: PeriodFinancials,
  previous?: PeriodFinancials
): ComputedPeriodMetrics {
  const inc = current.income;
  const bal = current.balance;
  const cf = current.cashFlow;

  // Revenue & Growth
  const revenue = inc.revenue;
  let revenueGrowthYoY: number | null = null;
  if (previous && previous.income.revenue && previous.income.revenue !== 0) {
    revenueGrowthYoY = ((revenue - previous.income.revenue) / Math.abs(previous.income.revenue)) * 100;
  }

  // Profitability margins
  const grossProfit = inc.grossProfit ?? (inc.revenue - inc.cogs);
  const grossMargin = revenue !== 0 ? (grossProfit / revenue) * 100 : 0;

  const operatingIncome = inc.operatingIncome;
  const operatingMargin = revenue !== 0 ? (operatingIncome / revenue) * 100 : 0;

  const netIncome = inc.netIncome;
  const netMargin = revenue !== 0 ? (netIncome / revenue) * 100 : 0;

  // Cash flows
  const operatingCashFlow = cf.operatingCashFlow;
  const capex = Math.abs(cf.capex); // Standardize capex as positive capital expenditure outflow
  const freeCashFlow = operatingCashFlow - capex;

  // FCF Conversion (FCF / Net Income)
  let fcfConversion: number | null = null;
  if (netIncome !== 0) {
    fcfConversion = (freeCashFlow / netIncome) * 100;
  }

  // Liquidity & Solvency
  const cashAndEquiv = bal.cashAndEquivalents + (bal.shortTermInvestments || 0);
  const totalDebt = bal.totalDebt ?? (bal.shortTermDebt + bal.longTermDebt);
  const netDebt = totalDebt - cashAndEquiv;

  let debtToOperatingCashFlow: number | null = null;
  if (operatingCashFlow > 0) {
    debtToOperatingCashFlow = totalDebt / operatingCashFlow;
  }

  let debtToEquity: number | null = null;
  if (bal.stockholdersEquity > 0) {
    debtToEquity = totalDebt / bal.stockholdersEquity;
  }

  let currentRatio: number | null = null;
  if (bal.currentLiabilities > 0) {
    currentRatio = bal.currentAssets / bal.currentLiabilities;
  }

  let returnOnEquity: number | null = null;
  if (bal.stockholdersEquity > 0) {
    returnOnEquity = (netIncome / bal.stockholdersEquity) * 100;
  }

  return {
    period: current.period,
    revenue,
    revenueGrowthYoY,
    grossProfit,
    grossMargin,
    operatingIncome,
    operatingMargin,
    netIncome,
    netMargin,
    operatingCashFlow,
    capex,
    freeCashFlow,
    fcfConversion,
    cashAndEquiv,
    totalDebt,
    netDebt,
    debtToOperatingCashFlow,
    debtToEquity,
    currentRatio,
    returnOnEquity,
  };
}

/**
 * Computes metrics across an ordered array of periods for a company.
 */
export function computeCompanyMetrics(
  company: CompanyProfile,
  selectedPeriods?: string[]
): ComputedPeriodMetrics[] {
  const periodsToUse = selectedPeriods || company.periods;
  const results: ComputedPeriodMetrics[] = [];

  for (let i = 0; i < periodsToUse.length; i++) {
    const period = periodsToUse[i];
    const raw = company.statements[period];
    if (!raw) continue;

    const currentPeriodFinancials: PeriodFinancials = {
      period,
      income: raw.income,
      balance: raw.balance,
      cashFlow: raw.cashFlow,
    };

    // Find previous period in the full dataset for correct YoY calculation
    const allIndex = company.periods.indexOf(period);
    let previousPeriodFinancials: PeriodFinancials | undefined = undefined;
    if (allIndex > 0) {
      const prevPeriodName = company.periods[allIndex - 1];
      const prevRaw = company.statements[prevPeriodName];
      if (prevRaw) {
        previousPeriodFinancials = {
          period: prevPeriodName,
          income: prevRaw.income,
          balance: prevRaw.balance,
          cashFlow: prevRaw.cashFlow,
        };
      }
    }

    results.push(calculatePeriodMetrics(currentPeriodFinancials, previousPeriodFinancials));
  }

  return results;
}

/**
 * Calculates Compound Annual Growth Rate (CAGR) between two values over N periods.
 */
export function calculateCAGR(startValue: number, endValue: number, numberOfPeriods: number): number | null {
  if (startValue <= 0 || endValue <= 0 || numberOfPeriods <= 1) {
    return null;
  }
  return (Math.pow(endValue / startValue, 1 / (numberOfPeriods - 1)) - 1) * 100;
}

// Visual Formatting Helpers
export function formatCurrency(
  val: number | null | undefined,
  currency: string = '$',
  unit: string = 'M'
): string {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  const isNegative = val < 0;
  const abs = Math.abs(val);
  const formatted = abs >= 1000 ? abs.toLocaleString(undefined, { maximumFractionDigits: 1 }) : abs.toFixed(1);
  return `${isNegative ? '-' : ''}${currency}${formatted}${unit ? ' ' + unit : ''}`;
}

export function formatPercent(val: number | null | undefined, decimals: number = 1): string {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(decimals)}%`;
}

export function formatRatio(val: number | null | undefined, suffix: string = 'x'): string {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `${val.toFixed(2)}${suffix}`;
}

export function formatNumber(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return val.toLocaleString(undefined, { maximumFractionDigits: 1 });
}
