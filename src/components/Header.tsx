import React, { useState } from 'react';
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
  CheckCircle2, 
  ArrowRightLeft, 
  Folder, 
  LogOut, 
  User as UserIcon,
  Menu,
  X
} from 'lucide-react';
import { RFQMetadata } from '../types';
import { User } from '../lib/firebase';

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
  user?: User | null;
  onSignOut?: () => void;
  onOpenProjectManager?: () => void;
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
  user,
  onSignOut,
  onOpenProjectManager,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Main Bar */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: App Identity & Project Info */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 tracking-tight truncate">
                  China Factory RFQ
                </h1>
                <span className="hidden xs:inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  .XLSX + Photos
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700 truncate max-w-[120px] sm:max-w-[200px]">
                  {metadata.projectName}
                </span>
                <span>•</span>
                <span className="font-mono text-slate-500 hidden sm:inline">{metadata.rfqNumber}</span>
                <span className="hidden sm:inline">•</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] sm:text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                  ¥ RMB
                </span>
                <span>•</span>
                <button
                  type="button"
                  onClick={onOpenMetadata}
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" /> <span className="hidden sm:inline">Edit Project</span> Info
                </button>
              </div>
            </div>
          </div>

          {/* Right Desktop / iPad Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Currency Exchange Quick Setting */}
            <button
              type="button"
              onClick={onOpenMetadata}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs hover:border-slate-400 transition-colors"
              title="Configure currency exchange rates"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
              <span>FX: 1 USD = ¥{metadata.exchangeRateUsdToCny || 7.25}</span>
            </button>

            {/* Customize inputs / columns */}
            <button
              type="button"
              onClick={onOpenColumnManager}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs hover:border-slate-400 transition-colors"
              title="Customize input fields and bilingual headers"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Inputs</span>
            </button>

            {/* Batch upload photos */}
            <button
              type="button"
              onClick={onOpenBatchUpload}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs hover:border-slate-400 transition-colors"
              title="Upload multiple product photos at once"
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
              <span>Photos</span>
            </button>

            {/* Supplier Preview Mode Toggle */}
            <button
              type="button"
              onClick={onToggleSupplierView}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors shadow-2xs ${
                isSupplierView
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title="View or let factory sales rep fill online"
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>{isSupplierView ? 'Exit Supplier' : 'Supplier Fill'}</span>
            </button>

            {/* Cloud Projects Button */}
            {onOpenProjectManager && (
              <button
                type="button"
                onClick={onOpenProjectManager}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-2xs transition-colors"
                title="Save and load your inquiry projects in Firestore"
              >
                <Folder className="w-3.5 h-3.5 text-blue-600" />
                <span>Projects</span>
              </button>
            )}

            {/* Primary Action: Export to Excel */}
            <button
              type="button"
              disabled={isExporting}
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg shadow-xs transition-colors"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{exportStatus || 'Exporting...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Excel</span>
                </>
              )}
            </button>

            {/* User Account / Profile & Dropdown */}
            {user && (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1.5 pl-1 pr-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-slate-200"
                  title={user.email || 'Logged in'}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden xl:inline max-w-[80px] truncate text-[11px] font-semibold text-slate-800">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </button>

                <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 hidden group-hover:block z-50 text-xs">
                  <div className="px-3.5 py-2 border-b border-slate-100 mb-1">
                    <p className="font-bold text-slate-900 truncate">{user.displayName || 'Google User'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  {onOpenProjectManager && (
                    <button
                      type="button"
                      onClick={onOpenProjectManager}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <Folder className="w-4 h-4 text-blue-600" />
                      <span>Saved Cloud Projects</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onLoadSampleData}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Load Sample RFQ Data</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClearAll}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-500" />
                    <span>Clear All Products</span>
                  </button>

                  {onSignOut && (
                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={onSignOut}
                        className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Mobile / iPad Compact Toolbar */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            {/* Quick Export Button */}
            <button
              type="button"
              disabled={isExporting}
              onClick={onExportExcel}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg shadow-xs transition-colors shrink-0"
            >
              {isExporting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Navigation Drawer for Mobile & Tablet */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenColumnManager();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <Sliders className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Inputs &amp; Columns</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenBatchUpload();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <UploadCloud className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Upload Photos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenMetadata();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <Settings className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Project &amp; FX Rate</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleSupplierView();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold ${
                isSupplierView
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Eye className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isSupplierView ? 'Exit Supplier' : 'Supplier Fill Mode'}</span>
            </button>

            {onOpenProjectManager && (
              <button
                type="button"
                onClick={() => {
                  onOpenProjectManager();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-700"
              >
                <Folder className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Cloud Projects</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onLoadSampleData();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Load Sample</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClearAll();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700"
            >
              <RotateCcw className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Clear Products</span>
            </button>

            {user && onSignOut && (
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 hover:bg-rose-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-rose-600"
              >
                <LogOut className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Sign Out ({user.displayName?.split(' ')[0] || 'User'})</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

