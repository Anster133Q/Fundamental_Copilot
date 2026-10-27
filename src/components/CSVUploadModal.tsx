import React, { useState, useRef } from 'react';
import { CompanyProfile } from '../types/financials';
import { parseFinancialCSV, SAMPLE_CSV_TEMPLATE } from '../engine/csvParser';
import {
  X,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Download,
  Sparkles,
  FileText
} from 'lucide-react';

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (company: CompanyProfile) => void;
}

export const CSVUploadModal: React.FC<CSVUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [companyName, setCompanyName] = useState('Custom Enterprise Inc.');
  const [dragOver, setDragOver] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      setErrors([]);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setCsvContent(SAMPLE_CSV_TEMPLATE);
    setCompanyName('Alpha Robotics Corp.');
    setErrors([]);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fundamentals_copilot_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleValidateAndSubmit = () => {
    if (!csvContent.trim()) {
      setErrors(['Please upload a CSV file or paste CSV content before submitting.']);
      return;
    }

    setIsProcessing(true);
    const result = parseFinancialCSV(csvContent, companyName.trim() || 'Custom Financial Dataset');
    setIsProcessing(false);

    if (result.success && result.company) {
      onUploadSuccess(result.company);
      onClose();
    } else {
      setErrors(result.errors || ['Failed to parse CSV. Please check formatting.']);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-200">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <FileSpreadsheet className="w-4 h-4" />
              </span>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Upload Custom Financial Statement CSV
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict schema validation with instant brief generation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-5 space-y-4">
          {/* Company Name Input */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Company Name / Dataset Label:
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Acme Cloud Dynamics"
              className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
              dragOver
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,text/csv"
              className="hidden"
            />
            <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-white">
              Drag and drop your financial CSV here, or <span className="text-blue-400">browse</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports standard commas and parenthesized negative values e.g. (25.4)
            </p>
          </div>

          {/* Quick Demo Options */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <button
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors cursor-pointer font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Load Sample CSV (4 Periods)</span>
            </button>
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Template</span>
            </button>
          </div>

          {/* Preview / Raw Editor */}
          {csvContent && (
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                CSV Data Preview (First few lines)
              </label>
              <textarea
                value={csvContent}
                onChange={(e) => {
                  setCsvContent(e.target.value);
                  setErrors([]);
                }}
                rows={5}
                className="w-full font-mono text-[11px] bg-slate-950 text-slate-300 p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Validation Errors Box */}
          {errors.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                <AlertCircle className="w-4 h-4" />
                Validation Errors Detected:
              </div>
              <ul className="text-xs text-rose-300 list-disc pl-5 space-y-0.5">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleValidateAndSubmit}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Validate & Launch Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
