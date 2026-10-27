# Fundamentals Copilot
> Evidence-Backed Financial Statement Research Aid for Retail Investors
> **Nubra Product Management Intern Take-Home Assignment**

---

## 📌 Executive Summary

Retail investors face a persistent hurdle when assessing equities: financial statements are dense, unstructured, and filled with accounting jargon. Investors often swing between two extremes:
1. Blindly relying on simplistic, unverified social media tips or opaque buy/sell "ratings".
2. Spending hours manually calculating margins, cash conversions, and debt ratios across multi-year SEC filings.

**Fundamentals Copilot** bridges this gap. It acts as an **evidence-backed research assistant**:
- **Calculates financial metrics dynamically** from source statements.
- **Distinguishes measured facts from interpretive hypotheses**.
- **Explicitly identifies missing disclosures** that primary statements cannot conclude on.
- **Never hallucinates data** or issues buy/sell recommendations.

---

## 🚀 Key Features

1. **Deterministic Financial Metric Engine**
   - Pure arithmetic calculations for Revenue Growth (YoY & CAGR), Gross Margin, Operating Margin, Net Profit, Operating Cash Flow, Capex, Free Cash Flow (FCF), FCF Conversion, and Net Debt.
   - Zero hardcoding of outputs.
   - Interactive Formula Inspector on every metric card and statement line.

2. **Pre-Loaded Corporate Archetypes (Simulated Data)**
   - **ApexCloud Technologies (`APEX`)**: High-growth SaaS with operating leverage inflection and a net cash balance sheet.
   - **Nordic Precision Medical (`NPM`)**: Mature, high-margin, zero-debt medical diagnostic compounder.
   - **Vanguard Fleet & Freight (`VANG`)**: Asset-heavy cyclical logistics with margin compression and elevated debt load.
   - **BioGenesis Therapeutics (`BGT`)**: Clinical biotech with erratic milestone revenue, high R&D burn, and limited runway.

3. **Rule-Based Research Brief Generator**
   - Executive snapshot with health scorecard.
   - 🟢 **Positive Signals (Measured Facts)**
   - 🔴 **Risks & Vulnerabilities (Measured Facts)**
   - 🟣 **Strategic Opportunities (Hypotheses)**
   - ⚪ **Missing Information & Disclosures Not Present**
   - 🔵 **Suggested Questions for Management & Earnings Calls**

4. **Transparent Evidence Inspector**
   - Every insight expands to reveal the supporting metric, reporting periods compared, base and ending values, exact delta, applied mathematical formula, and source inputs.

5. **Interactive Financial Visualizations**
   - Revenue & Operating Margin Trajectory (Bar + Line Composed Chart).
   - Cash Flow Quality (Operating Cash Flow vs Capex vs Free Cash Flow).
   - Solvency & Capital Structure (Cash Reserves vs Total Debt).

6. **Export & Sharing Suite**
   - Copy to Clipboard (Formatted Markdown ready for Notion/Obsidian/Email).
   - Download Markdown Report (`.md`).
   - Download Machine-Readable Audit Data (`.json`).
   - Print / Save as PDF (`@media print` clean layout).

7. **Validated CSV Upload Tool**
   - Drag-and-drop CSV importer with downloadable template.
   - Schema validation, handling of negative parenthesized figures `(45.2)`.
   - Clear row-by-row error feedback.

8. **Compliance & Regulatory Guardrails**
   - Visible disclaimers stating that the application is a research aid, not personalized financial advice or a recommendation to buy/sell securities.
   - "How It Works" guide modal detailing the 4-step pipeline and ethical limits.

---

## 🛠️ Tech Stack

- **Frontend:** React 18+, TypeScript, Vite
- **Styling:** Tailwind CSS (Institutional dark workstation theme)
- **Visualizations:** Recharts
- **Icons:** Lucide React
- **Testing:** Node.js + tsx automated test suite (31/31 assertions passed)

---

## 🏁 Quickstart

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Or build and run production preview
npm run build
npm run preview
```

### Running Automated Tests
```bash
npx tsx test_verification.mjs
```
Expected output:
```
=== FUNDAMENTALS COPILOT TEST SUITE ===
Results: 31 / 31 tests passed.
🎉 ALL ENGINE & DOMAIN LOGIC TESTS PASSED!
```

---

## 📄 License & Attribution
Developed for the **Nubra Product Management Intern take-home assignment**. All company demonstration datasets are simulated for educational research purposes.
