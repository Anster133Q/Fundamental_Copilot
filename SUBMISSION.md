# Nubra Product Management Intern Assignment: Submission Package
**Candidate Submission for Take-Home Case: Track 01 — Stock Fundamental Research Assistant**  
**Product Built:** Fundamentals Copilot  
**Author:** Product Management Intern Candidate  
**Submission Contact:** shylashree@zanskar.xyz  

---

## Table of Contents
1. [Artifact 01: One-Pager (Problem Statement, Why Nubra, Solution Space, Scope)](#artifact-01-one-pager)
2. [Artifact 02: Prompts Used to Build the Tool](#artifact-02-the-prompts-used-to-build-the-tool)
3. [Artifact 03: Evals Used to Test It (Shipping Criteria)](#artifact-03-the-evals-used-to-test-it)
4. [Artifact 04: Link & Deployment Guide for the Working App](#artifact-04-working-app-access--deployment-guide)

---

# Artifact 01: One-Pager

**Word Count:** 540 words *(Requirement: 300 to 700 words)*

### 1. The Problem Statement
Retail investors face severe information asymmetry when evaluating equities. While quarterly reports, 10-Ks, and earnings statements contain the vital truth about a company's financial health, they are deliberately dense, jargon-laden, and multi-faceted. Retail investors typically lack either the formal accounting expertise or the 3–5 hours required per company to calculate operating leverage, inspect cash-flow conversion, or audit balance sheet debt maturity.

Consequently, retail investors bifurcate into two losing behaviors:
1. They outsource conviction to speculative social media tips, opaque financial blogs, and unverified buy/sell star ratings.
2. They drown in tabular financial screeners that present raw data without translating numbers into operational reality (e.g., failing to notice that rising revenue is being cannibalized by margin compression or that reported net income is not converting into real free cash flow).

The core problem is **not a shortage of financial data, but a shortage of grounded, interpretable synthesis**.

### 2. Why Nubra Should Solve It
Nubra’s mission centers on building transparent, user-aligned modern financial infrastructure. Today, retail trading apps monetize churn and high-frequency speculative activity, leading to retail capital depletion and customer attrition. 

By offering **Fundamentals Copilot**, Nubra solves a critical strategic wedge:
- **Trust & Retention:** Empowering users to build genuine investment conviction increases customer lifetime value (LTV) and asset retention over speculative churn.
- **Defensible Differentiation:** Competitors provide either raw tables (unusable for casual investors) or generic generative AI chat (prone to hallucinations and inaccurate financial calculations). Nubra establishes authority by offering deterministic, auditable financial synthesis.
- **Platform Expansion:** Serves as the research anchor of the Nubra ecosystem, bridging retail discovery with informed long-term investing.

### 3. The Solution Space
We evaluated three potential product directions:
- *Option A: Conversational Free-Form LLM Chatbot.* Rejected due to unacceptable financial hallucination risks, inability to audit arithmetic, and cognitive burden on users to formulate prompt queries.
- *Option B: Traditional Ratio Dashboard (P/E, ROE screener).* Rejected because static metrics fail to explain *why* numbers changed over time or distinguish operational facts from external headwinds.
- *Option C: Deterministic, Evidence-Linked Research Copilot (Selected).* Ingests multi-period financial statements, calculates mathematical metrics deterministically, and synthesizes structured briefs where every insight is tagged as a **Measured Fact** or **Hypothesis** with full formula provenance.

### 4. What is in Scope
- **Deterministic Metric Engine:** Dynamic computation of YoY growth, gross/operating/net margins, FCF (OCF - Capex), FCF conversion, and Net Debt across 3–5 periods.
- **Evidence Provenance:** Every insight cites its supporting metric, evaluated periods, start/ending values, and formula.
- **Categorized Brief:** Positive Signals, Risks/Deteriorations, Strategic Opportunities, Missing Disclosures, and Suggested Management Questions.
- **Auditable Disclosures:** Explicitly highlighting what primary financial statements *cannot* conclude (e.g., customer churn, debt schedules).
- **Export & Usability:** Instant Markdown copying, multi-page PDF generation, JSON audit export, and validated CSV upload.

### 5. What is out of Scope
- Automated trading or brokerage order routing.
- Speculative price targets or buy/sell/hold ratings.
- Real-time ticker streaming APIs (prioritizing deterministic depth over live latency).
- Black-box conversational chat without formula citations.

---

# Artifact 02: The Prompts Used to Build the Tool

Here is the chronological record of prompt iterations used to direct and refine the build of **Fundamentals Copilot**, including the prompts that failed and how they were corrected:

### Prompt 1: Initial Architecture & Product Specification (Worked)
```text
Build a responsive web application called Fundamentals Copilot for the Nubra Product Management Intern take-home assignment.

Problem: Retail investors struggle to interpret financial statements and convert financial numbers into a structured view of a company's growth, profitability, risks, opportunities and unanswered research questions.
Target user: An individual investor who understands basic investing but does not have the time or expertise to analyse multiple financial statements.
Core value proposition: Help a user turn company financial data into an understandable, evidence-backed research brief. This is a research aid, not a buy/sell recommendation engine.

User journey:
1. Open dashboard introducing product and purpose.
2. Select demonstration company with fictional/verified label.
3. Explore financial performance across 3–5 periods.
4. Review calculated metrics and charts for revenue growth, operating margin, net profit, debt and operating cash flow.
5. Click "Generate Research Brief."
6. View report: snapshot, positive signals, risks, opportunities, missing info, suggested questions.
7. Expand each insight to see supporting metric, period, calculation/source.
8. Copy or export report.

Requirements:
- React + TypeScript, restrained institutional UI.
- Deterministic calculation from source values, no hardcoding.
- Distinguish measured facts from interpretations/hypotheses.
- Validate missing/negative numbers. No buy/sell advice.
```

### Prompt 2: First Attempt at Report Export (Failed / Suboptimal)
```text
Add export options to the research brief: copy to clipboard, download markdown, and a button to print/save as PDF.
```
- **Why it failed / suboptimal behavior:** Triggered raw `window.print()` while the `ExportModal` dialog was open. The browser print engine captured the dark background, screen navigation bar, and modal backdrop instead of outputting an actual clean, paginated financial research document.

### Prompt 3: Corrective Prompt for Dedicated PDF Generation (Worked)
```text
Financial analysis pdf download is not showing the correct downloaded data correct that.
```
- **Resolution:** Replaced raw `window.print()` with a dedicated client-side PDF engine using `jspdf` and `jspdf-autotable`. Formatted a dedicated multi-page document featuring:
  1. Header banner with company metadata and data verification labels.
  2. Executive health scorecard.
  3. Full multi-period financial metrics summary table.
  4. Explicit positive signals and risks with auditable evidence citations.
  5. Missing disclosures and earnings call questions.
  6. Added a 1-click "Download PDF" button directly to the Research Brief page header.

### Prompt 4: Deterministic Metric & CSV Validation Constraints (Worked)
```text
Ensure that all metrics (Operating Margin, Free Cash Flow, Net Debt, CAGR) are computed via pure functions from raw statement lines. If revenue is zero or negative, guard against NaN and division-by-zero. Support parenthesized negative values in CSV uploads e.g. (45.2).
```

---

# Artifact 03: The Evals Used to Test It

To ensure **Fundamentals Copilot** was production-grade, reliable, and safe for retail investors, we applied a multi-tier evaluation framework comprising **55 automated checks**, financial sanity verification, and qualitative UX criteria.

### 1. Quantitative Automated Test Suite (55/55 Passed)
An automated test runner (`test_verification.mjs`) was executed via `npx tsx` covering:
- **Corporate Archetype Fidelity (4/4 Companies):**
  - High-Growth SaaS (`APEX`): Verified margin expansion (-2.4% → 21.4%), positive FCF inflection ($247M), and net cash surplus ($560M).
  - Mature MedTech (`NPM`): Verified steady ~26% operating margins, zero debt, and high cash conversion.
  - Cyclical Logistics (`VANG`): Verified margin compression (11.2% → 3.8%), rising debt ($1,050M), and negative FCF (-$80M).
  - Clinical Biotech (`BGT`): Verified persistent operating losses, high R&D burn ($125M), and cash runway warning (<6 months).
- **Mathematical Integrity & Zero Division:**
  - Ingested periods with $0 revenue, $0 OCF, and $0 equity; verified that margins return `0.0%` and ratios return `null` rather than `NaN` or `Infinity`.
- **Fact vs. Hypothesis Grounding:**
  - 100% of insights labeled `measured_fact` strictly contain: evaluated periods, base value, ending value, measured delta, and applied mathematical formula.
- **CSV Parser Resilience:**
  - Valid schema parsing across 4 periods.
  - Rejection of malformed CSVs with missing required headers.
  - Parsing parenthesized negative accounting entries (e.g. `(15.0)` correctly parsed as `-15.0`).
- **PDF Report Completeness:**
  - Validated that all 4 companies generate non-null, clean multi-period data arrays without any `undefined` or `NaN` strings across every table row.

### 2. Financial Logic & Sanity Checks
- **No Calculated Output Hardcoding:** Every metric is computed at runtime from source statements (`grossProfit = revenue - cogs`, `operatingMargin = (operatingIncome / revenue) * 100`, `fcf = ocf - capex`).
- **Cash Flow Divergence Detection:** Ensured the engine flags instances where net income is positive but Free Cash Flow is negative (working capital/capex drag).
- **Solvency Risk Trigger:** Ensured debt warnings only trigger when `Debt / OCF > 4.0x` or when net debt is significantly positive.

### 3. Product & Governance Guardrails (Shipping Criteria)
- **Zero Hallucination Standard:** If a data point is missing from statements (e.g., customer churn or segment EBIT), the app is prohibited from inventing it. Instead, it must populate the **"Explicit Data Limitations"** section.
- **No Buy/Sell Recommendations:** Evaluated all text output to ensure total absence of investment advice, price targets, or trading signals.
- **Data Labeling:** All pre-loaded demonstration data is explicitly badged as **"Simulated Demonstration Data (Pre-loaded)"**.

---

# Artifact 04: Working App Access & Deployment Guide

### Live Demo & Repository Access
- **Live Production URL:** [https://fundamentals-copilot.vercel.app](https://fundamentals-copilot.vercel.app)
- **GitHub Repository:** [https://github.com/Anster133Q/Fundamental_Copilot](https://github.com/Anster133Q/Fundamental_Copilot)
- **Local Application URL:** `http://localhost:4173` (Vite preview)

### How to Run Locally

```bash
# 1. Navigate to the project directory
cd Nubra_Product

# 2. Install dependencies (if not already installed)
npm install

# 3. Run the development server
npm run dev
# -> Opens http://localhost:5173

# 4. Or run the production preview build
npm run build
npm run preview
# -> Opens http://localhost:4173

# 5. Execute the automated test suite (55 tests)
npx tsx test_verification.mjs
```

### Complete User Click-Through Verification Path
1. **Explore Dashboard:** Open `http://localhost:4173`. Observe the institutional interface and verification badges.
2. **Switch Companies:** Toggle between `APEX` (SaaS growth), `NPM` (MedTech compounder), `VANG` (debt/margin compression), and `BGT` (biotech burn).
3. **Filter Periods:** Switch between "All Periods (5Y)" and "Last 3Y". Watch KPI cards and charts recalculate dynamically.
4. **Inspect Formulas:** Click the "Info" icon on any KPI card (e.g. Operating Margin) to see the exact formula and source inputs.
5. **Generate Brief:** Click **"Generate Research Brief"** and observe the synthesis pipeline.
6. **Inspect Evidence:** On any positive signal or risk card, click **"Inspect Evidence"** to expand the mathematical audit trail.
7. **Download PDF:** Click the **"Download PDF"** button in the header to receive the formatted multi-page research brief.
8. **Test CSV Upload:** Click **"Upload CSV"**, click **"Load Sample CSV"**, and click **"Validate & Launch Analysis"** to analyze custom data.
