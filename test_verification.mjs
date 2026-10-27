import { calculatePeriodMetrics, computeCompanyMetrics, calculateCAGR, formatCurrency, formatPercent } from './src/engine/metricsCalculator.ts';
import { SAMPLE_COMPANIES } from './src/data/sampleCompanies.ts';
import { generateResearchBrief } from './src/engine/insightEngine.ts';
import { parseFinancialCSV, SAMPLE_CSV_TEMPLATE } from './src/engine/csvParser.ts';

console.log('=== FUNDAMENTALS COPILOT TEST SUITE ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Test Company Sample Dataset
assert(SAMPLE_COMPANIES.length === 4, '4 sample companies configured');
const [apex, nordic, vanguard, biogenesis] = SAMPLE_COMPANIES;
assert(apex.ticker === 'APEX', 'ApexCloud configured');
assert(nordic.ticker === 'NPM', 'Nordic Med configured');
assert(vanguard.ticker === 'VANG', 'Vanguard Fleet configured');
assert(biogenesis.ticker === 'BGT', 'BioGenesis configured');

// 2. Test Metrics Computation on ApexCloud
const apexMetrics = computeCompanyMetrics(apex);
assert(apexMetrics.length === 5, 'ApexCloud has 5 periods computed');
const latestApex = apexMetrics[4]; // FY24
assert(latestApex.revenue === 995, 'Apex FY24 revenue = 995');
assert(Math.round(latestApex.operatingMargin) === 21, 'Apex FY24 operating margin ~ 21% (EBIT leverage)');
assert(latestApex.freeCashFlow === 247, 'Apex FY24 FCF = OCF (295) - Capex (48) = 247');
assert(latestApex.netDebt === -560, 'Apex FY24 net cash = Total Debt (25) - Cash & ST (585) = -560 (Net cash)');

// 3. Test Division by Zero & Edge Cases
const edgePeriod = {
  period: 'FY99',
  income: { revenue: 0, cogs: 0, grossProfit: 0, rAndD: 0, sga: 0, operatingExpenses: 0, operatingIncome: 0, interestExpense: 0, taxExpense: 0, netIncome: 0, sharesOutstanding: 0 },
  balance: { cashAndEquivalents: 0, shortTermInvestments: 0, accountsReceivable: 0, inventory: 0, currentAssets: 0, totalAssets: 0, accountsPayable: 0, shortTermDebt: 0, longTermDebt: 0, totalDebt: 0, currentLiabilities: 0, totalLiabilities: 0, stockholdersEquity: 0 },
  cashFlow: { operatingCashFlow: 0, capex: 0, freeCashFlow: 0, investingCashFlow: 0, financingCashFlow: 0, dividendsPaid: 0, shareRepurchases: 0, netChangeInCash: 0 }
};
const edgeMetrics = calculatePeriodMetrics(edgePeriod);
assert(edgeMetrics.grossMargin === 0, 'Zero revenue safely returns 0% gross margin without NaN/Infinity');
assert(edgeMetrics.operatingMargin === 0, 'Zero revenue safely returns 0% operating margin');
assert(edgeMetrics.debtToOperatingCashFlow === null, 'Zero OCF returns null instead of Infinity');
assert(edgeMetrics.debtToEquity === null, 'Zero Equity returns null instead of Infinity');

// 4. Test Research Brief Generation across Archetypes
const apexBrief = generateResearchBrief(apex);
assert(apexBrief.positiveSignals.length > 0, 'ApexCloud generated positive signals');
assert(apexBrief.executiveSnapshot.financialHealthScorecard.growthTrend.includes('Growth'), 'Apex evaluated as strong growth');

const vanguardBrief = generateResearchBrief(vanguard);
assert(vanguardBrief.risks.length > 0, 'Vanguard generated risks');
const hasMarginRisk = vanguardBrief.risks.some(r => r.id === 'op-margin-compression');
const hasDebtRisk = vanguardBrief.risks.some(r => r.id === 'elevated-debt-burden');
assert(hasMarginRisk, 'Vanguard correctly identified operating margin compression');
assert(hasDebtRisk, 'Vanguard correctly identified elevated debt burden');

const bioBrief = generateResearchBrief(biogenesis);
const hasRunwayRisk = bioBrief.risks.some(r => r.id === 'cash-runway-risk');
assert(hasRunwayRisk, 'BioGenesis correctly identified cash runway risk');
assert(bioBrief.missingInformation.length > 0, 'BioGenesis identified data limitations');

// 5. Test Fact vs Hypothesis Tagging
const allApexInsights = [...apexBrief.positiveSignals, ...apexBrief.risks, ...apexBrief.opportunities];
const facts = allApexInsights.filter(i => i.evidenceType === 'measured_fact');
const hypotheses = allApexInsights.filter(i => i.evidenceType === 'interpretation');
assert(facts.length > 0, 'Contains measured facts');
assert(hypotheses.length > 0, 'Contains interpretive hypotheses');
assert(facts.every(f => f.supportingEvidence.formula), 'Every measured fact contains an explicit calculation formula');

// 6. Test CSV Parser
const csvResult = parseFinancialCSV(SAMPLE_CSV_TEMPLATE, 'Test Corp');
assert(csvResult.success === true, 'Sample CSV parsed successfully');
assert(csvResult.company?.periods.length === 4, 'Parsed 4 periods from sample CSV');
assert(csvResult.company?.statements['FY24'].income.revenue === 890, 'Parsed FY24 revenue correctly');

// Test Corrupted CSV
const corruptedCSV = `Period,Revenue,COGS\nFY21,100,50`;
const corruptResult = parseFinancialCSV(corruptedCSV);
assert(corruptResult.success === false, 'Corrupted CSV correctly rejected with missing columns');
assert(corruptResult.errors.length > 0, 'Helpful error messages returned for corrupted CSV');

// Test Negative in Parentheses: e.g. (35.5)
const parenCSV = `Period,Revenue,COGS,OperatingIncome,NetIncome,OperatingCashFlow,Capex,CashAndEquivalents,TotalDebt,StockholdersEquity
FY21,100,40,(15),(20),(10),5,50,20,100
FY22,120,45,(10),(15),(5),5,40,25,90`;
const parenResult = parseFinancialCSV(parenCSV);
assert(parenResult.success === true, 'Parenthesized negative numbers handled successfully');
assert(parenResult.company?.statements['FY21'].income.operatingIncome === -15, 'Parenthesized (15) correctly parsed as -15');

// 7. Test PDF Report Data Completeness & Metric Mapping
for (const company of SAMPLE_COMPANIES) {
  const brief = generateResearchBrief(company);
  const companyMetrics = computeCompanyMetrics(company, brief.periodsAnalyzed);
  
  assert(companyMetrics.length === brief.periodsAnalyzed.length, `${company.ticker} PDF table has matching columns for all ${brief.periodsAnalyzed.length} periods`);
  
  const revRow = companyMetrics.map(m => formatCurrency(m.revenue, company.currency, ''));
  assert(revRow.every(v => !v.includes('NaN') && !v.includes('undefined')), `${company.ticker} PDF revenue row contains clean formatted currency without NaN`);

  const fcfRow = companyMetrics.map(m => formatCurrency(m.freeCashFlow, company.currency, ''));
  assert(fcfRow.every(v => !v.includes('NaN') && !v.includes('undefined')), `${company.ticker} PDF FCF row contains clean formatted numbers`);

  const debtRow = companyMetrics.map(m => formatCurrency(m.netDebt, company.currency, ''));
  assert(debtRow.every(v => !v.includes('NaN') && !v.includes('undefined')), `${company.ticker} PDF Net Debt row contains clean formatted numbers`);

  assert(brief.positiveSignals.every(s => s.supportingEvidence.metricName && s.supportingEvidence.formula), `${company.ticker} all positive signals have metric name and formula for PDF export`);
  assert(brief.risks.every(r => r.supportingEvidence.metricName && r.supportingEvidence.formula), `${company.ticker} all risks have metric name and formula for PDF export`);
}

console.log(`\nResults: ${passedTests} / ${totalTests} tests passed.`);
if (passedTests === totalTests) {
  console.log('🎉 ALL ENGINE & DOMAIN LOGIC TESTS PASSED!\n');
}
