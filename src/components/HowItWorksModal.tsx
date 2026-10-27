import React from 'react';
import { X, ShieldCheck, Calculator, FileSearch, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <FileSearch className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                How Fundamentals Copilot Works
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Methodology, evidence-grounding standards, and operational limits.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Analytical Architecture */}
        <div className="mt-6 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            The 4-Step Evidence Pipeline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-mono text-xs font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Source Normalization</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Ingests raw reported Income Statement, Balance Sheet, and Cash Flow lines across 3–5 fiscal periods.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-mono text-xs font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Deterministic Computation</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Pure mathematical formulas compute margins, FCF conversion, Net Debt, and YoY growth. Zero black-box guessing.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono text-xs font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Fact vs Hypothesis Tagging</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Explicitly separates verified arithmetic observations (Measured Facts) from interpretive hypotheses.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-mono text-xs font-semibold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Disclosure Gap Auditing</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Flags missing financial footnotes (debt maturities, segment margins, churn) and suggests investor questions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Core Research Principles
          </h4>
          <ul className="text-xs text-slate-400 space-y-1.5 pl-5 list-disc">
            <li>
              <strong className="text-slate-300">Auditable Evidence:</strong> Every positive signal or risk card cites the exact line items, reporting periods, and arithmetic formula used.
            </li>
            <li>
              <strong className="text-slate-300">Fictional Data Labeling:</strong> Demonstration company datasets are clearly labeled as simulated to prevent misleading conclusions.
            </li>
            <li>
              <strong className="text-slate-300">No Hallucinated Figures:</strong> If a disclosure is absent (such as customer churn or segment margins), it is explicitly listed as a data limitation.
            </li>
          </ul>
        </div>

        {/* Regulatory & Functional Disclaimer */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300 block font-semibold mb-0.5">
              Visible Limitation & Non-Advice Disclaimer
            </strong>
            Fundamentals Copilot is an educational research aid built for retail investor workflow efficiency. It does <strong>not</strong> provide personalized investment advice, financial planning, automated trading, or buy/hold/sell recommendations. Always conduct independent due diligence before making investment decisions.
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
