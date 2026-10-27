export interface IncomeStatement {
  revenue: number;
  cogs: number;
  grossProfit: number;
  rAndD: number;
  sga: number;
  operatingExpenses: number;
  operatingIncome: number; // EBIT
  interestExpense: number;
  taxExpense: number;
  netIncome: number;
  sharesOutstanding: number;
}

export interface BalanceSheet {
  cashAndEquivalents: number;
  shortTermInvestments: number;
  accountsReceivable: number;
  inventory: number;
  currentAssets: number;
  totalAssets: number;
  accountsPayable: number;
  shortTermDebt: number;
  longTermDebt: number;
  totalDebt: number;
  currentLiabilities: number;
  totalLiabilities: number;
  stockholdersEquity: number;
}

export interface CashFlowStatement {
  operatingCashFlow: number;
  capex: number;
  freeCashFlow: number; // dynamically computed
  investingCashFlow: number;
  financingCashFlow: number;
  dividendsPaid: number;
  shareRepurchases: number;
  netChangeInCash: number;
}

export interface PeriodFinancials {
  period: string; // e.g., 'FY20', 'FY21'
  income: IncomeStatement;
  balance: BalanceSheet;
  cashFlow: CashFlowStatement;
}

export interface ComputedPeriodMetrics {
  period: string;
  revenue: number;
  revenueGrowthYoY: number | null; // %
  grossProfit: number;
  grossMargin: number; // %
  operatingIncome: number;
  operatingMargin: number; // %
  netIncome: number;
  netMargin: number; // %
  operatingCashFlow: number;
  capex: number;
  freeCashFlow: number;
  fcfConversion: number | null; // FCF / Net Income %
  cashAndEquiv: number;
  totalDebt: number;
  netDebt: number; // Total Debt - (Cash + ST Investments)
  debtToOperatingCashFlow: number | null;
  debtToEquity: number | null;
  currentRatio: number | null;
  returnOnEquity: number | null; // %
}

export interface CompanyProfile {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  industry: string;
  currency: string;
  unit: string;
  isSimulated: boolean;
  verificationLabel: string;
  description: string;
  businessModel: string;
  keyRevenueDrivers: string[];
  periods: string[];
  statements: Record<string, { income: IncomeStatement; balance: BalanceSheet; cashFlow: CashFlowStatement }>;
  explicitDataLimitations: string[];
}

export type InsightCategory =
  | 'positive_signal'
  | 'risk'
  | 'opportunity'
  | 'missing_info'
  | 'research_question';

export type EvidenceType = 'measured_fact' | 'interpretation';

export interface SupportingEvidence {
  metricName: string;
  periodsEvaluated: string[];
  startValue: number | string;
  endValue: number | string;
  changeFormatted: string;
  formula: string;
  sourceLineItems: { name: string; value: string | number }[];
  methodologyNote?: string;
}

export interface ResearchInsight {
  id: string;
  category: InsightCategory;
  title: string;
  summary: string;
  detailedInterpretation: string;
  evidenceType: EvidenceType;
  severityOrSignificance: 'high' | 'medium' | 'low';
  supportingEvidence: SupportingEvidence;
}

export interface ResearchBrief {
  company: CompanyProfile;
  generatedAt: string;
  periodsAnalyzed: string[];
  executiveSnapshot: {
    businessModelSummary: string;
    financialHealthScorecard: {
      growthTrend: string;
      profitabilityStatus: string;
      cashGenerationQuality: string;
      balanceSheetRisk: string;
    };
    rawMetricsSummary: {
      cagrRevenue: number | null;
      avgOperatingMargin: number;
      cumulativeFCF: number;
      latestNetDebt: number;
    };
  };
  positiveSignals: ResearchInsight[];
  risks: ResearchInsight[];
  opportunities: ResearchInsight[];
  missingInformation: ResearchInsight[];
  suggestedQuestions: ResearchInsight[];
}
