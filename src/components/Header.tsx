import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  UploadCloud, 
  Sliders, 
  Settings, 
  Sparkles, 
  Eye, 
  FileText,
  RotateCcw,
  Building,
  CheckCircle2
} from 'lucide-react';
import { RFQMetadata } from '../types';

interface HeaderProps {
  metadata: RFQMetadata;
  onExportExcel: () => void;
  isExporting: boolean;
  exportStatus: string;
  onOpenColumnManager: () => void;
  onOpenBatchUpload: () => void;
  onOpenMetadata: () => void;
  onToggleSupplierView: () => void;
  isSupplierView: boolean;
  onLoadSampleData: () => void;
  onClearAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metadata,
  onExportExcel,
  isExporting,
  exportStatus,
  onOpenColumnManager,
  onOpenBatchUpload,
  onOpenMetadata,
  onToggleSupplierView,
  isSupplierView,
  onLoadSampleData,
  onClearAll,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: App Identity & Project Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  China Factory RFQ &amp; Excel Generator
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  .XLSX With Images
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">{metadata.projectName}</span>
                <span>•</span>
                <span className="font-mono text-slate-500">{metadata.rfqNumber}</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={onOpenMetadata}
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" /> Edit Project Info
                </button>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Customize inputs / columns */}
            <button
              type="button"
              onClick={onOpenColumnManager}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs hover:border-slate-400 transition-colors"
              title="Customize input fields and bilingual headers"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Customize Inputs
            </button>

            {/* Batch upload photos */}
            <button
              type="button"
              onClick={onOpenBatchUpload}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs hover:border-slate-400 transition-colors"
              title="Upload multiple product photos at once"
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
              Upload Photos
            </button>

            {/* Supplier Preview Mode Toggle */}
            <button
              type="button"
              onClick={onToggleSupplierView}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors shadow-2xs ${
                isSupplierView
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title="View or let factory sales rep fill online"
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              {isSupplierView ? 'Exit Supplier View' : 'Supplier Fill Mode'}
            </button>

            {/* Primary Action: Export to Excel */}
            <button
              type="button"
              disabled={isExporting}
              onClick={onExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg shadow-xs transition-colors"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{exportStatus || 'Exporting...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export Excel (.xlsx)</span>
                </>
              )}
            </button>

            {/* Reset / Sample Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors"
                title="Options"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 hidden group-hover:block z-50 text-xs">
                <button
                  type="button"
                  onClick={onLoadSampleData}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Load Sample RFQ
                </button>
                <button
                  type="button"
                  onClick={onClearAll}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                  Clear All Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
