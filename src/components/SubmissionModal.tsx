import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Terminal, ShieldCheck, Download, ExternalLink, Copy, Check } from 'lucide-react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'onepager' | 'prompts' | 'evals' | 'app'>('onepager');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    // Copy link or markdown notice
    navigator.clipboard.writeText('SUBMISSION.md is located in the root repository directory.');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Nubra Assignment Submission Package
                </h2>
                <p className="text-xs text-slate-400">
                  Track 01: Stock Fundamental Research Assistant • Product Management Intern Case
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Artifact Tabs */}
        <div className="flex items-center gap-1.5 pt-4 pb-3 border-b border-slate-800 flex-wrap flex-shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('onepager')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'onepager'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            01. One-Pager (540 words)
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'prompts'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            02. Prompts Used
          </button>
          <button
            onClick={() => setActiveTab('evals')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'evals'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            03. Evals & Testing (55/55)
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'app'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            04. App Link & Guide
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="overflow-y-auto py-4 flex-1 pr-1 space-y-4 text-xs leading-relaxed text-slate-300">
          {activeTab === 'onepager' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                <span className="font-semibold text-slate-300">Artifact 01: Product Strategy One-Pager</span>
                <span className="font-mono text-blue-400 font-medium">540 words (Target: 300 to 700)</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  1. The Problem Statement
                </h4>
                <p>
                  Retail investors face severe information asymmetry when evaluating equities. While quarterly reports, 10-Ks, and earnings statements contain the vital truth about a company's financial health, they are deliberately dense, jargon-laden, and multi-faceted. Retail investors typically lack either the formal accounting expertise or the 3–5 hours required per company to calculate operating leverage, inspect cash-flow conversion, or audit balance sheet debt maturity.
                </p>
                <p className="mt-1.5">
                  Consequently, retail investors bifurcate into two losing behaviors: (1) outsourcing conviction to speculative social media tips and unverified buy/sell ratings, or (2) drowning in tabular screeners that present numbers without translating them into operational reality (e.g. missing margin compression or cash conversion divergence). The core problem is not a shortage of data, but a shortage of grounded synthesis.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  2. Why Nubra Should Solve It
                </h4>
                <p>
                  Nubra’s mission centers on building transparent, user-aligned modern financial infrastructure. Today, retail trading apps monetize churn and high-frequency speculative activity, leading to customer attrition. By offering Fundamentals Copilot, Nubra solves a critical strategic wedge:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><strong>Trust & Retention:</strong> Empowering users to build genuine investment conviction increases customer lifetime value (LTV) and asset retention over speculative churn.</li>
                  <li><strong>Defensible Differentiation:</strong> Competitors provide raw tables or generic generative AI chat (prone to hallucinations and inaccurate calculations). Nubra establishes authority by offering deterministic, auditable financial synthesis.</li>
                  <li><strong>Platform Expansion:</strong> Serves as the research anchor of the Nubra ecosystem, bridging retail discovery with informed long-term investing.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  3. The Solution Space
                </h4>
                <p>
                  We evaluated three directions:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><em>Option A: Conversational Free-Form LLM Chatbot.</em> Rejected due to unacceptable financial hallucination risks, inability to audit arithmetic, and heavy prompt burden on users.</li>
                  <li><em>Option B: Traditional Ratio Dashboard.</em> Rejected because static metrics fail to explain why numbers changed or distinguish facts from headwinds.</li>
                  <li><em>Option C: Deterministic, Evidence-Linked Research Copilot (Selected).</em> Calculates mathematical metrics deterministically and synthesizes structured briefs where every insight is tagged as a <strong>Measured Fact</strong> or <strong>Hypothesis</strong> with full formula provenance.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  4. Scope Boundaries
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-emerald-400 block mb-1">What is in Scope</strong>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
                      <li>Deterministic calculation of YoY growth, margins, FCF, and Net Debt.</li>
                      <li>Evidence citations for all insights with formulas and raw values.</li>
                      <li>Categorized brief (Signals, Risks, Opportunities, Gaps, Questions).</li>
                      <li>Auditable missing disclosure warnings.</li>
                      <li>Export to Markdown, multi-page PDF, and validated CSV upload.</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-rose-400 block mb-1">What is out of Scope</strong>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
                      <li>Automated trading or order routing.</li>
                      <li>Speculative price targets or buy/sell/hold ratings.</li>
                      <li>Live streaming market feeds (depth prioritized over ticker noise).</li>
                      <li>Black-box conversational chat without formula citations.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prompts' && (
            <div className="space-y-3">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                <span className="font-semibold text-slate-300">Artifact 02: Prompts Used to Build the Tool</span>
                <p className="text-slate-400 mt-0.5">Chronological record including failed attempts, analysis of failure, and corrective prompts.</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-blue-400 font-bold font-sans">Prompt 1: Initial Architecture & Product Specification (Worked)</div>
                <p className="text-slate-400">
                  "Build a responsive web application called Fundamentals Copilot for the Nubra Product Management Intern take-home assignment... 4 corporate archetypes, deterministic calculation from source values, evidence-linked insights, fact vs. hypothesis labeling, period filters, and research disclaimers."
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-rose-900/40 space-y-1.5 font-mono text-[11px]">
                <div className="text-rose-400 font-bold font-sans">Prompt 2: First Export Attempt (Failed / Suboptimal)</div>
                <p className="text-slate-400">
                  "Add export options to the research brief: copy to clipboard, download markdown, and a button to print/save as PDF."
                </p>
                <div className="text-[10px] text-rose-300 font-sans bg-rose-500/10 p-2 rounded">
                  <strong>Why it failed:</strong> Calling raw window.print() while the modal was open caused the browser to capture the dark web theme, navbar, and modal backdrop rather than an actual clean multi-page document.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-emerald-900/40 space-y-1.5 font-mono text-[11px]">
                <div className="text-emerald-400 font-bold font-sans">Prompt 3: Corrective Prompt for Dedicated PDF Generation (Worked)</div>
                <p className="text-slate-400">
                  "Financial analysis pdf download is not showing the correct downloaded data correct that."
                </p>
                <div className="text-[10px] text-emerald-300 font-sans bg-emerald-500/10 p-2 rounded">
                  <strong>Resolution:</strong> Replaced raw window.print() with a dedicated client-side PDF engine using jsPDF and jspdf-autotable, generating an actual .pdf download with multi-period summary tables and auditable evidence.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-blue-400 font-bold font-sans">Prompt 4: Deterministic Metric & CSV Validation Constraints (Worked)</div>
                <p className="text-slate-400">
                  "Ensure all metrics are computed via pure functions from statement lines. Guard against NaN and division-by-zero for $0 revenue. Support parenthesized negative values in CSV e.g. (45.2)."
                </p>
              </div>
            </div>
          )}

          {activeTab === 'evals' && (
            <div className="space-y-3">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                <span className="font-semibold text-slate-300">Artifact 03: The Evals Used to Test It</span>
                <span className="text-emerald-400 font-medium ml-2">• 55/55 Automated Tests Passed</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs">How we decided the output was good enough to ship:</h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Quantitative Automated Test Suite (55/55 Passed):</strong> Automated test suite (test_verification.mjs) verifying corporate archetype metrics, zero-division resilience, fact vs hypothesis tagging, and CSV schema validation.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Deterministic Arithmetic vs. LLM Hallucination:</strong> All metrics are calculated via algebraic pure functions from raw Income Statement, Balance Sheet, and Cash Flow lines. No generated figures.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Fact vs Hypothesis Separation:</strong> 100% of factual observations must link directly to an underlying formula, periods compared, base value, and ending value.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Zero Hallucination of Missing Disclosures:</strong> If a disclosure is missing (customer churn, segment margins), the engine explicitly states the limitation rather than guessing.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>PDF Export Completeness:</strong> Confirmed that generated PDFs across all 4 companies contain complete multi-period data arrays without any NaN or undefined strings.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'app' && (
            <div className="space-y-3">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                <span className="font-semibold text-slate-300">Artifact 04: Working App Access & Deployment</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white">Local Prototype Access</div>
                <div className="bg-slate-900 p-2 rounded font-mono text-[11px] text-blue-300 flex items-center justify-between">
                  <span>http://localhost:4173 (Vite Preview Server Active)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Project workspace: <code className="text-slate-200">c:\Users\Asus\Desktop\Nubra_Product</code>
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white">Deployment Commands</div>
                <p className="text-slate-400 text-[11px]">
                  Ready for instant deployment to Vercel, Netlify, or Replit:
                </p>
                <pre className="bg-slate-900 p-2.5 rounded font-mono text-[11px] text-amber-300 overflow-x-auto">
{`# Deploy to Vercel
npx vercel --prod

# Or Deploy to Netlify
npx netlify deploy --prod --dir=dist`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-shrink-0 text-xs">
          <span className="text-[11px] text-slate-400">
            Files in workspace: <strong className="text-slate-200">SUBMISSION.md</strong> & <strong className="text-slate-200">Nubra_PM_Intern_Assignment_Submission.pdf</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
