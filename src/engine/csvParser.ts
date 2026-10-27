import { CompanyProfile } from '../types/financials';

export interface CSVParseResult {
  success: boolean;
  company?: CompanyProfile;
  errors?: string[];
  warnings?: string[];
}

/**
 * Validates and converts an uploaded CSV string into a CompanyProfile.
 * Expected CSV Header format:
 * Period,Revenue,COGS,OperatingExpenses,OperatingIncome,NetIncome,OperatingCashFlow,Capex,CashAndEquivalents,TotalDebt,StockholdersEquity
 */
export function parseFinancialCSV(csvContent: string, companyName: string = 'Uploaded Company'): CSVParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const lines = csvContent
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 3) {
    return {
      success: false,
      errors: ['CSV must contain at least a header row and 2 period rows (minimum 2 periods for trend analysis).'],
    };
  }

  const rawHeaders = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Standardize headers
  const requiredColumns = [
    'period',
    'revenue',
    'cogs',
    'operatingincome',
    'netincome',
    'operatingcashflow',
    'capex',
    'cashandequivalents',
    'totaldebt',
    'stockholdersequity',
  ];

  const headerIndices: Record<string, number> = {};
  rawHeaders.forEach((h, idx) => {
    // strip special chars or spaces
    const cleanHeader = h.replace(/[^a-z0-9]/g, '');
    headerIndices[cleanHeader] = idx;
  });

  const missingColumns = requiredColumns.filter(col => headerIndices[col] === undefined);
  if (missingColumns.length > 0) {
    return {
      success: false,
      errors: [
        `Missing required columns in CSV header: ${missingColumns.join(', ')}.`,
        'Expected headers: Period, Revenue, COGS, OperatingIncome, NetIncome, OperatingCashFlow, Capex, CashAndEquivalents, TotalDebt, StockholdersEquity',
      ],
    };
  }

  const parseNumber = (val: string, colName: string, rowIdx: number): number | null => {
    if (!val || val.trim() === '') return 0;
    let clean = val.trim().replace(/\$/g, '').replace(/,/g, '');
    
    // Check for parenthesized negative numbers e.g. (45.2)
    if (clean.startsWith('(') && clean.endsWith(')')) {
      clean = '-' + clean.slice(1, -1);
    }

    const parsed = parseFloat(clean);
    if (isNaN(parsed)) {
      errors.push(`Row ${rowIdx + 1}: Invalid numeric value "${val}" in column "${colName}".`);
      return null;
    }
    return parsed;
  };

  const periods: string[] = [];
  const statements: CompanyProfile['statements'] = {};

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(c => c.trim());
    if (row.length < 2) continue;

    const periodVal = row[headerIndices['period']];
    if (!periodVal) {
      errors.push(`Row ${i + 1}: Missing period identifier.`);
      continue;
    }

    const rev = parseNumber(row[headerIndices['revenue']], 'Revenue', i);
    const cogs = parseNumber(row[headerIndices['cogs']], 'COGS', i);
    const opInc = parseNumber(row[headerIndices['operatingincome']], 'OperatingIncome', i);
    const netInc = parseNumber(row[headerIndices['netincome']], 'NetIncome', i);
    const ocf = parseNumber(row[headerIndices['operatingcashflow']], 'OperatingCashFlow', i);
    const capex = parseNumber(row[headerIndices['capex']], 'Capex', i);
    const cash = parseNumber(row[headerIndices['cashandequivalents']], 'CashAndEquivalents', i);
    const debt = parseNumber(row[headerIndices['totaldebt']], 'TotalDebt', i);
    const equity = parseNumber(row[headerIndices['stockholdersequity']], 'StockholdersEquity', i);

    if (rev === null || cogs === null || opInc === null || netInc === null || ocf === null || capex === null || cash === null || debt === null || equity === null) {
      continue;
    }

    if (periods.includes(periodVal)) {
      errors.push(`Duplicate period "${periodVal}" found on row ${i + 1}.`);
      continue;
    }

    periods.push(periodVal);

    const grossProfit = rev - cogs;
    const operatingExpenses = grossProfit - opInc;

    statements[periodVal] = {
      income: {
        revenue: rev,
        cogs,
        grossProfit,
        rAndD: 0,
        sga: Math.max(0, operatingExpenses),
        operatingExpenses,
        operatingIncome: opInc,
        interestExpense: 0,
        taxExpense: 0,
        netIncome: netInc,
        sharesOutstanding: 100,
      },
      balance: {
        cashAndEquivalents: cash,
        shortTermInvestments: 0,
        accountsReceivable: 0,
        inventory: 0,
        currentAssets: cash * 1.2,
        totalAssets: equity + debt,
        accountsPayable: 0,
        shortTermDebt: 0,
        longTermDebt: debt,
        totalDebt: debt,
        currentLiabilities: debt * 0.2,
        totalLiabilities: debt,
        stockholdersEquity: equity,
      },
      cashFlow: {
        operatingCashFlow: ocf,
        capex: Math.abs(capex),
        freeCashFlow: ocf - Math.abs(capex),
        investingCashFlow: -Math.abs(capex),
        financingCashFlow: 0,
        dividendsPaid: 0,
        shareRepurchases: 0,
        netChangeInCash: ocf - Math.abs(capex),
      },
    };
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  if (periods.length < 2) {
    return {
      success: false,
      errors: ['At least 2 valid period rows are required for comparative metrics calculation.'],
    };
  }

  const company: CompanyProfile = {
    id: `custom-${Date.now()}`,
    name: companyName,
    ticker: 'CUSTOM',
    sector: 'User Upload',
    industry: 'User Provided Dataset',
    currency: '$',
    unit: 'M',
    isSimulated: true,
    verificationLabel: 'User-Uploaded Custom Dataset (Unverified)',
    description: 'Custom financial dataset uploaded via CSV file.',
    businessModel: 'Model details not supplied in raw financial statements.',
    keyRevenueDrivers: ['Refer to specific management notes or filings.'],
    periods,
    statements,
    explicitDataLimitations: [
      'Balance sheet line items (Accounts Receivable, Inventory, Working Capital) not detailed in CSV format',
      'R&D and SG&A breakdown aggregated into generic operating expense line',
      'Interest expense and tax provisions not reported separately',
    ],
  };

  return { success: true, company, warnings };
}

export const SAMPLE_CSV_TEMPLATE = `Period,Revenue,COGS,OperatingIncome,NetIncome,OperatingCashFlow,Capex,CashAndEquivalents,TotalDebt,StockholdersEquity
FY21,500.0,200.0,75.0,55.0,90.0,30.0,120.0,40.0,350.0
FY22,620.0,240.0,105.0,80.0,125.0,35.0,165.0,35.0,420.0
FY23,750.0,285.0,140.0,110.0,170.0,40.0,210.0,30.0,510.0
FY24,890.0,330.0,185.0,145.0,220.0,45.0,270.0,25.0,620.0`;
