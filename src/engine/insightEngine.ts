import {
  CompanyProfile,
  ComputedPeriodMetrics,
  ResearchInsight,
  ResearchBrief,
} from '../types/financials';
import {
  computeCompanyMetrics,
  calculateCAGR,
  formatCurrency,
  formatPercent,
  formatRatio,
} from './metricsCalculator';

/**
 * Deterministic, rule-based engine that generates an evidence-backed Research Brief
 * for a company across selected reporting periods.
 */
export function generateResearchBrief(
  company: CompanyProfile,
  selectedPeriods?: string[]
): ResearchBrief {
  const periods = selectedPeriods && selectedPeriods.length >= 2 ? selectedPeriods : company.periods;
  const metrics = computeCompanyMetrics(company, periods);

  if (metrics.length < 2) {
    throw new Error('At least 2 periods are required to calculate comparative trends.');
  }

  const firstM = metrics[0];
  const lastM = metrics[metrics.length - 1];
  const periodCount = metrics.length;
  const firstPeriod = firstM.period;
  const lastPeriod = lastM.period;

  const positiveSignals: ResearchInsight[] = [];
  const risks: ResearchInsight[] = [];
  const opportunities: ResearchInsight[] = [];
  const missingInformation: ResearchInsight[] = [];
  const suggestedQuestions: ResearchInsight[] = [];

  // 1. REVENUE GROWTH ANALYSIS
  const cagr = calculateCAGR(firstM.revenue, lastM.revenue, periodCount);
  const revenueTotalGrowth = firstM.revenue > 0 ? ((lastM.revenue - firstM.revenue) / firstM.revenue) * 100 : 0;

  if (revenueTotalGrowth > 30) {
    positiveSignals.push({
      id: 'rev-strong-expansion',
      category: 'positive_signal',
      title: 'Strong Multi-Period Revenue Expansion',
      summary: `Top-line revenue expanded by ${formatPercent(revenueTotalGrowth)} from ${formatCurrency(firstM.revenue)} in ${firstPeriod} to ${formatCurrency(lastM.revenue)} in ${lastPeriod} (CAGR: ${cagr ? formatPercent(cagr) : 'N/A'}).`,
      detailedInterpretation: 'Sustained top-line expansion indicates rising commercial adoption and scale. A compounding revenue base provides structural operating leverage if fixed overhead is controlled.',
      evidenceType: 'measured_fact',
      severityOrSignificance: 'high',
      supportingEvidence: {
        metricName: 'Revenue Growth',
        periodsEvaluated: [firstPeriod, lastPeriod],
        startValue: formatCurrency(firstM.revenue),
        endValue: formatCurrency(lastM.revenue),
        changeFormatted: `${formatPercent(revenueTotalGrowth)} total (${cagr ? formatPercent(cagr) + ' CAGR' : ''})`,
        formula: '((Revenue_latest - Revenue_base) / Revenue_base) * 100',
        sourceLineItems: [
          { name: `${firstPeriod} Revenue`, value: formatCurrency(firstM.revenue) },
          { name: `${lastPeriod} Revenue`, value: formatCurrency(lastM.revenue) },
        ],
        methodologyNote: 'Evaluated across all selected periods using reported Income Statement revenue lines.',
      },
    });
  } else if (revenueTotalGrowth < 0) {
    risks.push({
      id: 'rev-contraction',
      category: 'risk',
      title: 'Top-Line Revenue Contraction',
      summary: `Reported revenue declined from ${formatCurrency(firstM.revenue)} (${firstPeriod}) to ${formatCurrency(lastM.revenue)} (${lastPeriod}), contracting by ${formatPercent(revenueTotalGrowth)}.`,
      detailedInterpretation: 'Shrinking revenues typically stem from demand softness, loss of volume, pricing compression, or customer churn. Continued contraction impairs fixed-cost absorption.',
      evidenceType: 'measured_fact',
      severityOrSignificance: 'high',
      supportingEvidence: {
        metricName: 'Revenue Growth',
        periodsEvaluated: [firstPeriod, lastPeriod],
        startValue: formatCurrency(firstM.revenue),
        endValue: formatCurrency(lastM.revenue),
        changeFormatted: formatPercent(revenueTotalGrowth),
        formula: '((Revenue_latest - Revenue_base) / Revenue_base) * 100',
        sourceLineItems: [
          { name: `${firstPeriod} Revenue`, value: formatCurrency(firstM.revenue) },
          { name: `${lastPeriod} Revenue`, value: formatCurrency(lastM.revenue) },
        ],
        methodologyNote: 'Comparison between the oldest and newest selected periods.',
      },
    });
  }

  // 2. OPERATING MARGIN & OPERATING LEVERAGE
  const opMarginDelta = lastM.operatingMargin - firstM.operatingMargin;
  if (opMarginDelta > 4.0) {
    positiveSignals.push({
      id: 'op-margin-expansion',
      category: 'positive_signal',
      title: 'Operating Margin Expansion & Operating Leverage',
      summary: `Operating margin expanded from ${formatPercent(firstM.operatingMargin)} in ${firstPeriod} to ${formatPercent(lastM.operatingMargin)} in ${lastPeriod} (+${opMarginDelta.toFixed(1)} percentage points).`,
      detailedInterpretation: 'Operating profit is growing faster than sales, reflecting fixed cost dilution, production efficiencies, or increased pricing power.',
      evidenceType: 'measured_fact',
      severityOrSignificance: 'high',
      supportingEvidence: {
        metricName: 'Operating Margin (EBIT Margin)',
        periodsEvaluated: [firstPeriod, lastPeriod],
        startValue: formatPercent(firstM.operatingMargin),
        endValue: formatPercent(lastM.operatingMargin),
        changeFormatted: `+${opMarginDelta.toFixed(1)} pts (${(opMarginDelta * 100).toFixed(0)} bps)`,
        formula: '(Operating Income / Revenue) * 100',
        sourceLineItems: [
          { name: `${firstPeriod} Operating Income`, value: formatCurrency(firstM.operatingIncome) },
          { name: `${firstPeriod} Revenue`, value: formatCurrency(firstM.revenue) },
          { name: `${lastPeriod} Operating Income`, value: formatCurrency(lastM.operatingIncome) },
          { name: `${lastPeriod} Revenue`, value: formatCurrency(lastM.revenue) },
        ],
      },
    });
  } else if (opMarginDelta < -3.0) {
    risks.push({
      id: 'op-margin-compression',
      category: 'risk',
      title: 'Operating Margin Deterioration',
      summary: `Operating margin compressed by ${Math.abs(opMarginDelta).toFixed(1)} percentage points from ${formatPercent(firstM.operatingMargin)} (${firstPeriod}) to ${formatPercent(lastM.operatingMargin)} (${lastPeriod}).`,
      detailedInterpretation: 'Rising cost of goods, elevated wages, or administrative overhead outpaced sales growth, eroding profitability per dollar of revenue.',
      evidenceType: 'measured_fact',
      severityOrSignificance: 'high',
      supportingEvidence: {
        metricName: 'Operating Margin',
        periodsEvaluated: [firstPeriod, lastPeriod],
        startValue: formatPercent(firstM.operatingMargin),
        endValue: formatPercent(lastM.operatingMargin),
        changeFormatted: `${opMarginDelta.toFixed(1)} pts`,
        formula: '(Operating Income / Revenue) * 100',
        sourceLineItems: [
          { name: `${firstPeriod} Op. Income`, value: formatCurrency(firstM.operatingIncome) },
          { name: `${lastPeriod} Op. Income`, value: formatCurrency(lastM.operatingIncome) },
        ],
      },
    });
  }

  // 3. CASH FLOW & FREE CASH FLOW QUALITY
  const cumulativeFCF = metrics.reduce((acc, m) => acc + m.freeCashFlow, 0);
  const latestFCF = lastM.freeCashFlow;
  const latestNetIncome = lastM.netIncome;

  if (latestFCF > 0 && cumulativeFCF > 0) {
    positiveSignals.push({
      id: 'fcf-positive-conversion',
      category: 'positive_signal',
      title: 'Consistent Free Cash Flow Generation',
      summary: `Generated ${formatCurrency(cumulativeFCF)} in cumulative Free Cash Flow across the ${periodCount} periods, delivering ${formatCurrency(latestFCF)} in ${lastPeriod}.`,
      detailedInterpretation: 'Strong cash conversion validates that reported accounting profits translate into genuine liquidity after capital expenditures, funding internal growth without external debt.',
      evidenceType: 'measured_fact',
      severityOrSignificance: 'medium',
      supportingEvidence: {
        metricName: 'Free Cash Flow (FCF)',
        periodsEvaluated: periods,
        startValue: formatCurrency(firstM.freeCashFlow),
        endValue: formatCurrency(lastM.freeCashFlow),
        changeFormatted: `Cumulative: ${formatCurrency(cumulativeFCF)}`,
        formula: 'Operating Cash Flow - Capital Expenditures',
        sourceLineItems: [
          { name: `${lastPeriod} Operating Cash Flow`, value: formatCurrency(lastM.operatingCashFlow) },
          { name: `${lastPeriod} Capital Expenditures`, value: formatCurrency(lastM.capex) },
          { name: `${lastPeriod} Net Income`, value: formatCurrency(latestNetIncome) },
        ],
      },
    });
  } else if (latestFCF < 0) {
    risks.push({
      id: 'fcf-negative-drain',
      category: 'risk',
      title: 'Negative Free Cash Flow (Cash Drain)',
      summary: `Free Cash Flow remained negative at ${formatCurrency(latestFCF)} in ${lastPeriod} (Cumulative FCF: ${formatCurrency(cumulativeFCF)}).`,
      detailedInterpretation: 'Operations or heavy capital reinvestment are burning cash. Persistent negative free cash flow necessitates external debt financing or equity dilution to remain solvent.',
      evidenceType: 'measured_fact',
      severityOrSignificance: 'high',
      supportingEvidence: {
        metricName: 'Free Cash Flow',
        periodsEvaluated: [lastPeriod],
        startValue: formatCurrency(firstM.freeCashFlow),
        endValue: formatCurrency(lastM.freeCashFlow),
        changeFormatted: formatCurrency(latestFCF),
        formula: 'Operating Cash Flow - Capital Expenditures',
        sourceLineItems: [
          { name: `${lastPeriod} Operating Cash Flow`, value: formatCurrency(lastM.operatingCashFlow) },
          { name: `${lastPeriod} Capex Outflow`, value: formatCurrency(lastM.capex) },
        ],
      },
    });
  }

  // 4. BALANCE SHEET, DEBT & SOLVENCY
  const latestDebt = lastM.totalDebt;
  const latestCash = lastM.cashAndEquiv;
  const latestNetDebt = lastM.netDebt;
  const debtToOCF = lastM.debtToOperatingCashFlow;

  if (latestNetDebt <= 0) {
    positiveSignals.push({
      id: 'net-cash-balance-sheet',
      category: 'positive_signal',
      title: 'Net Cash Fortress Balance Sheet',
      summary: `Holds ${formatCurrency(latestCash)} in liquid cash reserves against ${formatCurrency(latestDebt)} in debt, representing a net cash buffer of ${formatCurrency(Math.abs(latestNetDebt))}.`,
      detailedInterpretation: 'Negative net debt insulates the business from interest rate volatility and provides structural resilience during macroeconomic shocks.',
      evidenceType: 'measured_fact',
      severityOrSignificance: 'medium',
      supportingEvidence: {
        metricName: 'Net Debt',
        periodsEvaluated: [lastPeriod],
        startValue: formatCurrency(firstM.netDebt),
        endValue: formatCurrency(lastM.netDebt),
        changeFormatted: `${formatCurrency(latestNetDebt)} (Net Cash)`,
        formula: 'Total Debt - (Cash + Short-Term Investments)',
        sourceLineItems: [
          { name: `${lastPeriod} Cash & Short-Term Investments`, value: formatCurrency(latestCash) },
          { name: `${lastPeriod} Total Debt`, value: formatCurrency(latestDebt) },
        ],
      },
    });

    opportunities.push({
      id: 'opp-capital-deployment',
      category: 'opportunity',
      title: 'Strategic Capital Reinvestment & Shareholder Return Runway',
      summary: `Substantial liquidity (${formatCurrency(latestCash)}) with zero net debt creates headroom for accretive M&A, R&D acceleration, or opportunistic share repurchases.`,
      detailedInterpretation: 'Management possesses discretionary capital allocation flexibility without requiring punitive debt covenants or dilutive equity offerings.',
      evidenceType: 'interpretation',
      severityOrSignificance: 'medium',
      supportingEvidence: {
        metricName: 'Net Cash Cushion',
        periodsEvaluated: [lastPeriod],
        startValue: 'N/A',
        endValue: formatCurrency(Math.abs(latestNetDebt)),
        changeFormatted: `Cash Surplus: ${formatCurrency(Math.abs(latestNetDebt))}`,
        formula: 'Cash - Total Debt',
        sourceLineItems: [
          { name: 'Cash and ST Investments', value: formatCurrency(latestCash) },
          { name: 'Total Debt', value: formatCurrency(latestDebt) },
        ],
      },
    });
  } else if (debtToOCF && debtToOCF > 4.0) {
    risks.push({
      id: 'elevated-debt-burden',
      category: 'risk',
      title: 'Elevated Leverage & Debt Service Vulnerability',
      summary: `Total debt of ${formatCurrency(latestDebt)} stands at ${formatRatio(debtToOCF)} times annual Operating Cash Flow (${formatCurrency(lastM.operatingCashFlow)}).`,
      detailedInterpretation: 'When Debt-to-OCF exceeds 4.0x, an outsized share of cash generation must be diverted to principal amortization and debt service rather than reinvestment.',
      evidenceType: 'measured_fact',
      severityOrSignificance: 'high',
      supportingEvidence: {
        metricName: 'Debt to Operating Cash Flow',
        periodsEvaluated: [lastPeriod],
        startValue: firstM.debtToOperatingCashFlow ? formatRatio(firstM.debtToOperatingCashFlow) : 'N/A',
        endValue: formatRatio(debtToOCF),
        changeFormatted: `${formatRatio(debtToOCF)} leverage multiple`,
        formula: 'Total Debt / Operating Cash Flow',
        sourceLineItems: [
          { name: `${lastPeriod} Total Debt`, value: formatCurrency(latestDebt) },
          { name: `${lastPeriod} Operating Cash Flow`, value: formatCurrency(lastM.operatingCashFlow) },
        ],
      },
    });
  }

  // 5. INTEREST COVERAGE / DILUTION RISK
  const lastRaw = company.statements[lastPeriod];
  const firstRaw = company.statements[firstPeriod];
  if (lastRaw && firstRaw) {
    const shareCountChange = ((lastRaw.income.sharesOutstanding - firstRaw.income.sharesOutstanding) / firstRaw.income.sharesOutstanding) * 100;
    if (shareCountChange > 15) {
      risks.push({
        id: 'shareholder-dilution',
        category: 'risk',
        title: 'Material Equity Dilution Over Time',
        summary: `Diluted shares outstanding rose from ${firstRaw.income.sharesOutstanding.toFixed(1)}M (${firstPeriod}) to ${lastRaw.income.sharesOutstanding.toFixed(1)}M (${lastPeriod}), representing a ${formatPercent(shareCountChange)} expansion in share count.`,
        detailedInterpretation: 'Heavy reliance on stock-based compensation or secondary public equity raises dilutes existing shareholder per-share earnings power and voting equity.',
        evidenceType: 'measured_fact',
        severityOrSignificance: 'medium',
        supportingEvidence: {
          metricName: 'Shares Outstanding Dilution',
          periodsEvaluated: [firstPeriod, lastPeriod],
          startValue: `${firstRaw.income.sharesOutstanding.toFixed(1)}M`,
          endValue: `${lastRaw.income.sharesOutstanding.toFixed(1)}M`,
          changeFormatted: formatPercent(shareCountChange),
          formula: '((Shares_latest - Shares_base) / Shares_base) * 100',
          sourceLineItems: [
            { name: `${firstPeriod} Diluted Shares`, value: `${firstRaw.income.sharesOutstanding.toFixed(1)}M` },
            { name: `${lastPeriod} Diluted Shares`, value: `${lastRaw.income.sharesOutstanding.toFixed(1)}M` },
          ],
        },
      });
    }

    // Operating profit runway for R&D biotech
    if (lastM.operatingIncome < 0 && latestCash > 0) {
      const annualBurn = Math.abs(lastM.freeCashFlow < 0 ? lastM.freeCashFlow : lastM.operatingIncome);
      const runwayMonths = annualBurn > 0 ? (latestCash / annualBurn) * 12 : 999;
      if (runwayMonths < 24) {
        risks.push({
          id: 'cash-runway-risk',
          category: 'risk',
          title: 'Limited Estimated Cash Runway',
          summary: `Current cash balances (${formatCurrency(latestCash)}) cover approximately ${runwayMonths.toFixed(0)} months of current burn rate (${formatCurrency(annualBurn)}/yr).`,
          detailedInterpretation: 'Without imminent commercial revenue milestones or external capital raises, cash depletion will compel financing under potentially dilutive market conditions.',
          evidenceType: 'interpretation',
          severityOrSignificance: 'high',
          supportingEvidence: {
            metricName: 'Estimated Cash Runway',
            periodsEvaluated: [lastPeriod],
            startValue: 'N/A',
            endValue: `${runwayMonths.toFixed(0)} months`,
            changeFormatted: `${runwayMonths.toFixed(0)} mo estimated runway`,
            formula: '(Cash & ST Investments / Annual Cash Burn) * 12',
            sourceLineItems: [
              { name: 'Liquid Cash & ST Investments', value: formatCurrency(latestCash) },
              { name: 'Estimated Annual Cash Burn', value: formatCurrency(annualBurn) },
            ],
            methodologyNote: 'Hypothetical forward estimate assuming constant baseline burn without new financing.',
          },
        });
      }
    }
  }

  // 6. STRATEGIC OPPORTUNITIES
  if (lastM.grossMargin > 60 && lastM.operatingMargin > 15) {
    opportunities.push({
      id: 'opp-pricing-power',
      category: 'opportunity',
      title: 'High Gross Margin Software/IP Moat',
      summary: `Gross margins exceeding ${formatPercent(lastM.grossMargin)} provide substantial structural headroom to absorb localized inflation or reinvest in customer acquisition.`,
      detailedInterpretation: 'Businesses with gross margins > 60% retain strong unit economics, meaning incremental revenue flows predominantly into gross profit.',
      evidenceType: 'interpretation',
      severityOrSignificance: 'high',
      supportingEvidence: {
        metricName: 'Gross Margin Buffer',
        periodsEvaluated: [lastPeriod],
        startValue: formatPercent(firstM.grossMargin),
        endValue: formatPercent(lastM.grossMargin),
        changeFormatted: formatPercent(lastM.grossMargin),
        formula: '(Gross Profit / Revenue) * 100',
        sourceLineItems: [
          { name: `${lastPeriod} Gross Profit`, value: formatCurrency(lastM.grossProfit) },
          { name: `${lastPeriod} Total Revenue`, value: formatCurrency(lastM.revenue) },
        ],
      },
    });
  }

  // 7. MISSING INFORMATION & DATA LIMITATIONS (Strict Grounding)
  company.explicitDataLimitations.forEach((limitationText, idx) => {
    missingInformation.push({
      id: `missing-info-${idx}`,
      category: 'missing_info',
      title: limitationText.split(' not ')[0] || 'Unreported Disclosure Item',
      summary: limitationText,
      detailedInterpretation: 'This metric is absent from the primary financial statements and notes. Investors cannot conclude on unit churn, pricing elasticity, or renewal dynamics from consolidated tables alone.',
      evidenceType: 'measured_fact',
      severityOrSignificance: 'medium',
      supportingEvidence: {
        metricName: 'Omitted Statement Line',
        periodsEvaluated: periods,
        startValue: 'Undisclosed',
        endValue: 'Undisclosed',
        changeFormatted: 'Not Reported',
        formula: 'N/A (Omission verified across financial disclosures)',
        sourceLineItems: [
          { name: 'Audited Statement Footnotes', value: 'Not Broken Down' },
        ],
        methodologyNote: 'Deterministic check against mandatory financial statement schedule lines.',
      },
    });
  });

  // 8. SUGGESTED RESEARCH QUESTIONS FOR INVESTORS
  suggestedQuestions.push({
    id: 'q-segment-growth',
    category: 'research_question',
    title: 'Customer Cohort & Unit Volume Deconstruction',
    summary: `What proportion of the ${formatPercent(revenueTotalGrowth)} revenue change came from price increases versus net new customer expansion?`,
    detailedInterpretation: 'Understanding volume vs price drivers reveals whether growth is sustainable through customer adoption or vulnerable to price elasticity limits.',
    evidenceType: 'interpretation',
    severityOrSignificance: 'medium',
    supportingEvidence: {
      metricName: 'Revenue Drivers',
      periodsEvaluated: [firstPeriod, lastPeriod],
      startValue: formatCurrency(firstM.revenue),
      endValue: formatCurrency(lastM.revenue),
      changeFormatted: formatPercent(revenueTotalGrowth),
      formula: 'Revenue Variance Analysis',
      sourceLineItems: [
        { name: 'Total Revenue Change', value: formatCurrency(lastM.revenue - firstM.revenue) },
      ],
    },
  });

  if (lastM.totalDebt > 0) {
    suggestedQuestions.push({
      id: 'q-debt-refinancing',
      category: 'research_question',
      title: 'Debt Maturity Wall & Floating Rate Exposure',
      summary: `What is the weighted average maturity of the ${formatCurrency(lastM.totalDebt)} debt load, and what fraction is subject to floating interest rates?`,
      detailedInterpretation: 'If significant maturities come due in a high-rate environment, refinancing could cause interest expenses to escalate, squeezing net profit margins.',
      evidenceType: 'interpretation',
      severityOrSignificance: 'high',
      supportingEvidence: {
        metricName: 'Total Debt & Interest Burden',
        periodsEvaluated: [lastPeriod],
        startValue: 'N/A',
        endValue: formatCurrency(lastM.totalDebt),
        changeFormatted: formatCurrency(lastM.totalDebt),
        formula: 'Total Debt = Short-term Debt + Long-term Debt',
        sourceLineItems: [
          { name: `${lastPeriod} Total Debt`, value: formatCurrency(lastM.totalDebt) },
          { name: `${lastPeriod} Interest Expense`, value: formatCurrency(lastRaw.income.interestExpense) },
        ],
      },
    });
  }

  if (lastM.operatingIncome < 0) {
    suggestedQuestions.push({
      id: 'q-breakeven-timeline',
      category: 'research_question',
      title: 'Path to Operating Breakeven & R&D Milestones',
      summary: `What clinical or operational milestones are required to transition from the current operating loss of ${formatCurrency(lastM.operatingIncome)} to cash-flow neutrality?`,
      detailedInterpretation: 'Investors need visibility into whether current operating spend represents discretionary front-loaded R&D or an unsustainable structural deficit.',
      evidenceType: 'interpretation',
      severityOrSignificance: 'high',
      supportingEvidence: {
        metricName: 'Operating Loss',
        periodsEvaluated: [lastPeriod],
        startValue: formatCurrency(firstM.operatingIncome),
        endValue: formatCurrency(lastM.operatingIncome),
        changeFormatted: formatCurrency(lastM.operatingIncome),
        formula: 'Revenue - Total Operating Costs',
        sourceLineItems: [
          { name: `${lastPeriod} Operating Loss`, value: formatCurrency(lastM.operatingIncome) },
          { name: `${lastPeriod} R&D Outlay`, value: formatCurrency(lastRaw.income.rAndD) },
        ],
      },
    });
  }

  const avgOperatingMargin =
    metrics.reduce((acc, m) => acc + m.operatingMargin, 0) / metrics.length;

  return {
    company,
    generatedAt: new Date().toISOString(),
    periodsAnalyzed: periods,
    executiveSnapshot: {
      businessModelSummary: company.businessModel,
      financialHealthScorecard: {
        growthTrend:
          revenueTotalGrowth > 20
            ? 'Accelerating / Strong Growth'
            : revenueTotalGrowth > 0
            ? 'Moderate Expansion'
            : 'Contraction / Deceleration',
        profitabilityStatus:
          lastM.operatingMargin > 15
            ? 'High Profitability'
            : lastM.operatingMargin > 0
            ? 'Marginally Profitable'
            : 'Loss-Making / Capital Burn',
        cashGenerationQuality:
          cumulativeFCF > 0 && latestFCF > 0
            ? 'Self-Funding / Cash Generative'
            : 'Cash Consuming / Deficit',
        balanceSheetRisk:
          latestNetDebt <= 0
            ? 'Low Risk (Net Cash Cushion)'
            : (debtToOCF ?? 0) > 4
            ? 'Elevated Solvency Watchpoint'
            : 'Moderate Leverage',
      },
      rawMetricsSummary: {
        cagrRevenue: cagr,
        avgOperatingMargin,
        cumulativeFCF,
        latestNetDebt,
      },
    },
    positiveSignals,
    risks,
    opportunities,
    missingInformation,
    suggestedQuestions,
  };
}
