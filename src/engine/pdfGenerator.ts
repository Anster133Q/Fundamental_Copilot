import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResearchBrief } from '../types/financials';
import { computeCompanyMetrics, formatCurrency, formatPercent } from './metricsCalculator';

/**
 * Generates and downloads a publication-grade Financial Analysis PDF document
 * containing executive scorecards, multi-period financial tables, evidence-backed
 * positive signals, risks, data limitations, and management questions.
 */
export function generateFinancialAnalysisPDF(brief: ResearchBrief): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const { company, executiveSnapshot, periodsAnalyzed } = brief;
  const metrics = computeCompanyMetrics(company, periodsAnalyzed);

  // Helper to check page break
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawPageHeader();
    }
  };

  // Running header
  const drawPageHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Fundamentals Copilot | ${company.name} (${company.ticker}) Financial Analysis Brief`, margin, 25);
    doc.text(`Periods: ${periodsAnalyzed.join(', ')}`, pageWidth - margin, 25, { align: 'right' });
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 28, pageWidth - margin, 28);
  };

  // --- 1. COVER / HEADER BANNER ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 75, 4, 4, 'F');

  // Title & Subtitle inside banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(`${company.name} (${company.ticker})`, margin + 14, y + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Sector: ${company.sector} | Industry: ${company.industry} | Units: ${company.currency} in ${company.unit}`, margin + 14, y + 40);

  // Verification Tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(245, 158, 11); // amber-400
  doc.text(`STATUS: ${company.verificationLabel.toUpperCase()}`, margin + 14, y + 58);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 14, y + 58, { align: 'right' });

  y += 88;

  // --- 2. EXECUTIVE SCORECARD ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Executive Snapshot & Financial Health Scorecard', margin, y);
  y += 12;

  const scorecardData = [
    [
      { content: 'Revenue Growth', styles: { fontStyle: 'bold' as const } },
      executiveSnapshot.financialHealthScorecard.growthTrend,
      { content: 'Operating Profitability', styles: { fontStyle: 'bold' as const } },
      executiveSnapshot.financialHealthScorecard.profitabilityStatus,
    ],
    [
      { content: 'Cash Generation Quality', styles: { fontStyle: 'bold' as const } },
      executiveSnapshot.financialHealthScorecard.cashGenerationQuality,
      { content: 'Balance Sheet Health', styles: { fontStyle: 'bold' as const } },
      executiveSnapshot.financialHealthScorecard.balanceSheetRisk,
    ],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: scorecardData,
    theme: 'grid',
    styles: { fontSize: 8.5, cellPadding: 5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 110, fillColor: [241, 245, 249] },
      2: { cellWidth: 110, fillColor: [241, 245, 249] },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 14;

  // Business Model description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const splitModel = doc.splitTextToSize(`Business Model: ${company.businessModel}`, contentWidth);
  doc.text(splitModel, margin, y);
  y += splitModel.length * 11 + 10;

  // --- 3. MULTI-PERIOD FINANCIAL PERFORMANCE TABLE ---
  checkPageBreak(140);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Financial Performance & Calculated Metrics Summary', margin, y);
  y += 8;

  const tableHeaders = ['Financial Line Item', ...periodsAnalyzed];

  const tableRows = [
    ['Total Revenue', ...metrics.map((m) => formatCurrency(m.revenue, company.currency, ''))],
    ['YoY Revenue Growth %', ...metrics.map((m) => (m.revenueGrowthYoY !== null ? formatPercent(m.revenueGrowthYoY) : 'N/A'))],
    ['Gross Profit', ...metrics.map((m) => formatCurrency(m.grossProfit, company.currency, ''))],
    ['Gross Margin %', ...metrics.map((m) => formatPercent(m.grossMargin))],
    ['Operating Income (EBIT)', ...metrics.map((m) => formatCurrency(m.operatingIncome, company.currency, ''))],
    ['Operating Margin %', ...metrics.map((m) => formatPercent(m.operatingMargin))],
    ['Net Income', ...metrics.map((m) => formatCurrency(m.netIncome, company.currency, ''))],
    ['Net Margin %', ...metrics.map((m) => formatPercent(m.netMargin))],
    ['Operating Cash Flow', ...metrics.map((m) => formatCurrency(m.operatingCashFlow, company.currency, ''))],
    ['Capex Outflow', ...metrics.map((m) => formatCurrency(m.capex, company.currency, ''))],
    ['Free Cash Flow (FCF)', ...metrics.map((m) => formatCurrency(m.freeCashFlow, company.currency, ''))],
    ['Cash & ST Investments', ...metrics.map((m) => formatCurrency(m.cashAndEquiv, company.currency, ''))],
    ['Total Debt', ...metrics.map((m) => formatCurrency(m.totalDebt, company.currency, ''))],
    ['Net Debt Position', ...metrics.map((m) => formatCurrency(m.netDebt, company.currency, ''))],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [tableHeaders],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'right',
    },
    bodyStyles: { fontSize: 7.5, cellPadding: 3.5, textColor: [30, 41, 59], halign: 'right' },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold', cellWidth: 140 },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  y = (doc as any).lastAutoTable.finalY + 18;

  // --- 4. POSITIVE SIGNALS (MEASURED FACTS) ---
  checkPageBreak(100);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 149, 93); // green
  doc.text(`3. Positive Signals (${brief.positiveSignals.length}) - [MEASURED FACTS]`, margin, y);
  y += 12;

  brief.positiveSignals.forEach((sig) => {
    checkPageBreak(65);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${sig.title}`, margin, y);
    y += 11;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(sig.summary, contentWidth - 10);
    doc.text(splitSummary, margin + 8, y);
    y += splitSummary.length * 10;

    // Evidence citation
    const ev = sig.supportingEvidence;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Evidence: ${ev.metricName} [${ev.periodsEvaluated.join('->')}] | Base: ${ev.startValue} | Latest: ${ev.endValue} | Delta: ${ev.changeFormatted} | Formula: ${ev.formula}`,
      margin + 8,
      y
    );
    y += 14;
  });

  // --- 5. RISKS & STRUCTURAL VULNERABILITIES ---
  checkPageBreak(100);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(225, 29, 72); // rose-600
  doc.text(`4. Risks & Structural Vulnerabilities (${brief.risks.length}) - [MEASURED FACTS]`, margin, y);
  y += 12;

  brief.risks.forEach((risk) => {
    checkPageBreak(65);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${risk.title}`, margin, y);
    y += 11;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(risk.summary, contentWidth - 10);
    doc.text(splitSummary, margin + 8, y);
    y += splitSummary.length * 10;

    // Evidence citation
    const ev = risk.supportingEvidence;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Evidence: ${ev.metricName} [${ev.periodsEvaluated.join('->')}] | Base: ${ev.startValue} | Latest: ${ev.endValue} | Delta: ${ev.changeFormatted} | Formula: ${ev.formula}`,
      margin + 8,
      y
    );
    y += 14;
  });

  // --- 6. STRATEGIC OPPORTUNITIES ---
  if (brief.opportunities.length > 0) {
    checkPageBreak(70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(79, 70, 229); // indigo
    doc.text('5. Strategic Opportunities - [HYPOTHESES]', margin, y);
    y += 12;

    brief.opportunities.forEach((opp) => {
      checkPageBreak(50);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`• ${opp.title}`, margin, y);
      y += 11;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const splitOpp = doc.splitTextToSize(opp.summary, contentWidth - 10);
      doc.text(splitOpp, margin + 8, y);
      y += splitOpp.length * 10 + 6;
    });
  }

  // --- 7. MISSING INFORMATION & DATA LIMITATIONS ---
  if (brief.missingInformation.length > 0) {
    checkPageBreak(70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('6. Explicit Data Limitations & Missing Disclosures', margin, y);
    y += 12;

    brief.missingInformation.forEach((miss) => {
      checkPageBreak(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`• ${miss.title}:`, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const splitMiss = doc.splitTextToSize(miss.summary, contentWidth - 15);
      doc.text(splitMiss, margin + 12, y + 10);
      y += splitMiss.length * 10 + 12;
    });
  }

  // --- 8. SUGGESTED MANAGEMENT QUESTIONS ---
  if (brief.suggestedQuestions.length > 0) {
    checkPageBreak(80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(2, 132, 199); // sky-600
    doc.text('7. Suggested Follow-Up Research & Management Questions', margin, y);
    y += 12;

    brief.suggestedQuestions.forEach((q, idx) => {
      checkPageBreak(45);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${idx + 1}. ${q.title}`, margin, y);
      y += 10;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const splitQ = doc.splitTextToSize(q.summary, contentWidth - 10);
      doc.text(splitQ, margin + 8, y);
      y += splitQ.length * 10 + 6;
    });
  }

  // --- 9. REGULATORY DISCLAIMER BOX ---
  checkPageBreak(50);
  y += 10;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('REGULATORY & COMPLIANCE DISCLAIMER', margin + 8, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  const disclaimer = 'Fundamentals Copilot is an educational research aid built for retail investor due diligence. It does NOT provide personalized investment advice, trading recommendations, or buy/sell ratings. All demonstration figures are simulated.';
  doc.text(doc.splitTextToSize(disclaimer, contentWidth - 16), margin + 8, y + 23);

  // Add page numbers
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
  }

  // Save PDF file directly to user device
  const fileName = `${company.ticker}_Financial_Analysis_Research_Brief.pdf`;
  doc.save(fileName);
}
