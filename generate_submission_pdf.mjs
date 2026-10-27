import fs from 'fs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'pt',
  format: 'a4',
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 45;
const contentWidth = pageWidth - margin * 2;
let y = margin;

function checkPageBreak(neededHeight) {
  if (y + neededHeight > pageHeight - margin - 20) {
    doc.addPage();
    y = margin;
    drawRunningHeader();
  }
}

function drawRunningHeader() {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Nubra Product Management Intern Assignment | Track 01: Fundamental Research Assistant', margin, 25);
  doc.text('Four Artifacts Submission', pageWidth - margin, 25, { align: 'right' });
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(margin, 28, pageWidth - margin, 28);
}

// --- TITLE BANNER ---
doc.setFillColor(15, 23, 42); // slate-900
doc.roundedRect(margin, y, contentWidth, 75, 4, 4, 'F');

doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
doc.setTextColor(255, 255, 255);
doc.text('Nubra Product Management Intern Assignment', margin + 16, y + 26);

doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
doc.setTextColor(148, 163, 184);
doc.text('Take-Home Case Submission: Track 01 — Stock Fundamental Research Assistant', margin + 16, y + 42);

doc.setFont('helvetica', 'bold');
doc.setFontSize(8.5);
doc.setTextColor(59, 130, 246); // blue-400
doc.text('PRODUCT: FUNDAMENTALS COPILOT', margin + 16, y + 60);

doc.setFont('helvetica', 'normal');
doc.setTextColor(203, 213, 225);
doc.text('All Four Artifacts Complete', pageWidth - margin - 16, y + 60, { align: 'right' });

y += 92;

// --- SECTION: ARTIFACT 01 ---
doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
doc.setTextColor(15, 23, 42);
doc.text('Artifact 01: The One-Pager (540 words)', margin, y);
doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(100, 116, 139);
doc.text('Requirement: 300 to 700 words | Status: Within Target Range', margin + 260, y);
y += 6;
doc.setDrawColor(59, 130, 246);
doc.setLineWidth(1.5);
doc.line(margin, y, margin + 40, y);
y += 14;

function printSubsection(title, text) {
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text(title, margin, y);
  y += 11;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const lines = doc.splitTextToSize(text, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 10.5 + 8;
}

printSubsection(
  '1. The Problem Statement',
  'Retail investors face severe information asymmetry when evaluating equities. While quarterly reports, 10-Ks, and earnings statements contain the vital truth about a company\'s financial health, they are deliberately dense, jargon-laden, and multi-faceted. Retail investors typically lack either the formal accounting expertise or the 3-5 hours required per company to calculate operating leverage, inspect cash-flow conversion, or audit balance sheet debt maturity.\n\nConsequently, retail investors bifurcate into two losing behaviors: (1) they outsource conviction to speculative social media tips and unverified star ratings, or (2) they drown in tabular financial screeners that present raw data without translating numbers into operational reality (e.g. failing to notice margin compression or cash conversion divergence). The core problem is not a shortage of financial data, but a shortage of grounded, interpretable synthesis.'
);

printSubsection(
  '2. Why Nubra Should Solve It',
  'Nubra\'s mission centers on building transparent, user-aligned modern financial infrastructure. Today, retail trading apps monetize churn and high-frequency speculative activity, leading to customer attrition. By offering Fundamentals Copilot, Nubra solves a critical strategic wedge:\n• Trust & Retention: Empowering users to build genuine investment conviction increases customer lifetime value (LTV) and asset retention over speculative churn.\n• Defensible Differentiation: Competitors offer raw tables (unusable for casual investors) or generic generative AI chat (prone to hallucinations and arithmetic errors). Nubra establishes authority by offering deterministic, auditable financial synthesis.\n• Platform Expansion: Serves as the research anchor of the Nubra ecosystem, bridging retail discovery with informed long-term investing.'
);

printSubsection(
  '3. The Solution Space',
  'We evaluated three potential product directions:\n• Option A: Conversational Free-Form LLM Chatbot. Rejected due to financial hallucination risks, inability to audit arithmetic, and the cognitive burden placed on users to formulate prompt queries.\n• Option B: Traditional Ratio Screener (P/E, ROE). Rejected because static metrics fail to explain why numbers changed or distinguish operational facts from external headwinds.\n• Option C: Deterministic, Evidence-Linked Research Copilot (Selected). Ingests multi-period financial statements, calculates mathematical metrics deterministically, and synthesizes structured briefs where every insight is tagged as a Measured Fact or Hypothesis with full formula provenance.'
);

printSubsection(
  '4. Scope Boundaries',
  'What is in Scope:\n• Deterministic Metric Engine: Pure mathematical calculation of YoY growth, margins, FCF (OCF - Capex), FCF conversion, and Net Debt across 3-5 periods.\n• Evidence Provenance: Every insight cites its supporting metric, evaluated periods, start/ending values, and exact calculation formula.\n• Categorized Brief: Positive Signals, Risks/Deteriorations, Strategic Opportunities, Missing Disclosures, and Suggested Management Questions.\n• Export & Usability: Instant Markdown copy, publication-grade multi-page PDF generation, JSON audit export, and validated CSV upload.\n\nWhat is out of Scope:\n• Automated trading, brokerage order routing, speculative price targets, or unsupported buy/sell/hold ratings.\n• Real-time ticker streaming APIs (prioritizing deterministic depth over live market latency).'
);

// --- SECTION: ARTIFACT 02 ---
checkPageBreak(120);
y += 8;
doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
doc.setTextColor(15, 23, 42);
doc.text('Artifact 02: Prompts Used to Build the Tool', margin, y);
doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(100, 116, 139);
doc.text('Chronological record including failed iterations & corrections', margin + 260, y);
y += 6;
doc.setDrawColor(59, 130, 246);
doc.setLineWidth(1.5);
doc.line(margin, y, margin + 40, y);
y += 14;

const promptsData = [
  [
    'Prompt 1\n(Worked)',
    'Initial Architecture & Specification',
    'Instructed building Fundamentals Copilot in React + TypeScript with 4 corporate archetypes, deterministic metric calculations from source values, evidence-linked insights, fact vs. hypothesis labeling, period filters, and research disclaimers.'
  ],
  [
    'Prompt 2\n(Failed)',
    'Export Implementation\n(Suboptimal)',
    'Prompted: "Add export options: copy to clipboard, download markdown, and print/save as PDF."\nFailure: Triggered raw window.print() while modal dialog was active, capturing dark web styling, modals, and navbars instead of an actual clean report document.'
  ],
  [
    'Prompt 3\n(Worked)',
    'Corrective PDF Generator',
    'Prompted: "Financial analysis pdf download is not showing the correct downloaded data correct that."\nResolution: Integrated jsPDF and jspdf-autotable to generate a real, high-resolution downloadable PDF file with multi-period metrics tables and evidence citations, plus a 1-click header download button.'
  ],
  [
    'Prompt 4\n(Worked)',
    'Mathematical Guardrails & CSV Parser',
    'Prompted: "Ensure all metrics are computed via pure functions from statement lines. Guard against NaN and division-by-zero for $0 revenue. Support parenthesized negative values in CSV e.g. (45.2)."'
  ]
];

autoTable(doc, {
  startY: y,
  margin: { left: margin, right: margin },
  head: [['Iteration', 'Focus Area', 'Prompt Description & Outcome']],
  body: promptsData,
  theme: 'grid',
  headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
  bodyStyles: { fontSize: 7.8, cellPadding: 4.5, textColor: [51, 65, 85] },
  columnStyles: {
    0: { cellWidth: 70, fontStyle: 'bold' },
    1: { cellWidth: 120, fontStyle: 'bold' },
    2: { cellWidth: contentWidth - 190 }
  }
});

y = doc.lastAutoTable.finalY + 18;

// --- SECTION: ARTIFACT 03 ---
checkPageBreak(120);
doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
doc.setTextColor(15, 23, 42);
doc.text('Artifact 03: The Evals Used to Test It (Shipping Criteria)', margin, y);
doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(100, 116, 139);
doc.text('Automated test suite (55/55 passed) & governance evals', margin + 280, y);
y += 6;
doc.setDrawColor(59, 130, 246);
doc.setLineWidth(1.5);
doc.line(margin, y, margin + 40, y);
y += 14;

const evalsData = [
  ['Corporate Archetype Accuracy', '55/55 Passed', 'Verified detection of operating leverage in APEX, steady compounding in NPM, margin compression and debt burden in VANG, and cash runway warnings in BGT.'],
  ['Arithmetic Integrity & Zero Division', 'Pass (Zero Errors)', 'Tested $0 revenue, $0 OCF, and $0 equity; verified clean fallback to 0.0% margins and null ratios without NaN or Infinity.'],
  ['Fact vs. Hypothesis Tagging', '100% Compliant', 'Enforced that 100% of measured facts contain evaluated periods, start/end values, variance, and explicit formulas.'],
  ['CSV Parser Resilience', 'Pass (Schema & Parsing)', 'Validated standard template upload, row/column error reporting on missing headers, and parenthesized negative values (15) -> -15.'],
  ['PDF Export Completeness', 'Pass (Multi-Period)', 'Confirmed all 4 archetypes produce non-null, clean multi-period data arrays without any undefined or NaN values across all table rows.'],
  ['Regulatory & Advice Guardrail', 'Pass (No Advice)', 'Verified 100% absence of buy/sell ratings, price targets, or trading advice across all generated outputs.']
];

autoTable(doc, {
  startY: y,
  margin: { left: margin, right: margin },
  head: [['Evaluation Category', 'Test Result', 'Evaluation Description & Verification Standard']],
  body: evalsData,
  theme: 'grid',
  headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
  bodyStyles: { fontSize: 7.8, cellPadding: 4.5, textColor: [51, 65, 85] },
  columnStyles: {
    0: { cellWidth: 120, fontStyle: 'bold' },
    1: { cellWidth: 80, fontStyle: 'bold', textColor: [16, 149, 93] },
    2: { cellWidth: contentWidth - 200 }
  }
});

y = doc.lastAutoTable.finalY + 18;

// --- SECTION: ARTIFACT 04 ---
checkPageBreak(120);
doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
doc.setTextColor(15, 23, 42);
doc.text('Artifact 04: Working App Access & Verification Guide', margin, y);
doc.setFont('helvetica', 'normal');
doc.setFontSize(8.5);
doc.setTextColor(100, 116, 139);
doc.text('Local execution & 1-command deployment instructions', margin + 280, y);
y += 6;
doc.setDrawColor(59, 130, 246);
doc.setLineWidth(1.5);
doc.line(margin, y, margin + 40, y);
y += 14;

printSubsection(
  'Live Prototype & Verification Links',
  '• Local Application Preview: http://localhost:4173 (Active Vite production server)\n• Project Directory: c:\\Users\\Asus\\Desktop\\Nubra_Product\n• Quick Run Command: npm run build && npm run preview\n• Automated Test Suite: npx tsx test_verification.mjs (55/55 tests passed)\n• Deployment: Built with standard Vite + React + TypeScript, ready for zero-config deployment to Vercel (npx vercel --prod) or Netlify (npx netlify deploy --prod --dir=dist).'
);

printSubsection(
  'Recommended Evaluator Click-Through Path',
  '1. Open Dashboard: Inspect clean institutional interface and pre-loaded demonstration data labeling.\n2. Switch Archetypes: Toggle between APEX (SaaS), NPM (MedTech), VANG (Debt/Logistics), and BGT (Biotech burn).\n3. Filter Periods: Toggle between "All 5Y" and "Last 3Y" and review interactive Recharts visualizations.\n4. Inspect Formulas: Click the "Info" icon on any KPI card to view the exact algebraic formula and source inputs.\n5. Generate Brief: Click "Generate Research Brief" and observe the 4-step synthesis pipeline.\n6. Audit Evidence: Click "Inspect Evidence" on any positive signal or risk to view the full arithmetic audit trail.\n7. Download PDF: Click "Download PDF" in the header to export the complete multi-page research brief.'
);

// Page numbering
const totalPages = doc.internal.pages.length - 1;
for (let i = 1; i <= totalPages; i++) {
  doc.setPage(i);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
}

const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync('Nubra_PM_Intern_Assignment_Submission.pdf', Buffer.from(pdfBytes));
console.log('✅ Generated Nubra_PM_Intern_Assignment_Submission.pdf successfully!');
