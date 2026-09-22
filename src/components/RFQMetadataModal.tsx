import React, { useState, useEffect } from 'react';
import { RFQMetadata } from '../types';
import { X, FileSpreadsheet, Building2, Globe, Calendar, Check, ArrowRightLeft, DollarSign } from 'lucide-react';

interface RFQMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: RFQMetadata;
  onSaveMetadata: (newMeta: RFQMetadata) => void;
}

export const RFQMetadataModal: React.FC<RFQMetadataModalProps> = ({
  isOpen,
  onClose,
  metadata,
  onSaveMetadata,
}) => {
  const [form, setForm] = useState<RFQMetadata>(metadata);

  useEffect(() => {
    setForm(metadata);
  }, [metadata, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMetadata(form);
    onClose();
  };

  return (
    <div id="rfq-metadata-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4">
      <div id="rfq-metadata-modal" className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">RFQ &amp; Project Settings</h2>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              These details appear in the top banner of the exported China Factory Excel workbook
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project / Inquiry Title
              </label>
              <input
                type="text"
                required
                value={form.projectName}
                onChange={e => setForm({ ...form, projectName: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                RFQ Tracking Number
              </label>
              <input
                type="text"
                value={form.rfqNumber}
                onChange={e => setForm({ ...form, rfqNumber: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Buyer Company Name (Your Company)
              </label>
              <input
                type="text"
                value={form.buyerCompany}
                onChange={e => setForm({ ...form, buyerCompany: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Buyer Contact Name & Email
              </label>
              <input
                type="text"
                value={form.buyerContact}
                onChange={e => setForm({ ...form, buyerContact: e.target.value })}
                placeholder="e.g. John Doe (sourcing@company.com)"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Supplier / Factory Name
              </label>
              <input
                type="text"
                value={form.supplierName}
                onChange={e => setForm({ ...form, supplierName: e.target.value })}
                placeholder="e.g. Ningbo Excellence Hardware Co., Ltd."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supplier Contact Person / Rep
              </label>
              <input
                type="text"
                value={form.supplierContact}
                onChange={e => setForm({ ...form, supplierContact: e.target.value })}
                placeholder="e.g. Vivian Wang (Sales Dept)"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trade Terms (Incoterm)
              </label>
              <select
                value={form.tradeTerm}
                onChange={e => setForm({ ...form, tradeTerm: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="FOB">FOB (Free On Board - Standard China Port)</option>
                <option value="EXW">EXW (Ex-Works - Factory Door)</option>
                <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                <option value="DDP">DDP (Delivered Duty Paid)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Settlement Currency
              </label>
              <select
                value={form.targetCurrency}
                onChange={e => setForm({ ...form, targetCurrency: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-semibold text-slate-900"
              >
                <option value="RMB (¥)">RMB / CNY (¥) - Chinese Yuan (Preferred for China Factories)</option>
                <option value="USD">USD ($) - Standard International US Dollar</option>
                <option value="EUR">EUR (€) - Euros</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destination Port / Country
              </label>
              <input
                type="text"
                value={form.destinationPort}
                onChange={e => setForm({ ...form, destinationPort: e.target.value })}
                placeholder="e.g. Los Angeles / Rotterdam / Sydney"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Port of Departure in China
              </label>
              <input
                type="text"
                value={form.departurePortPreference}
                onChange={e => setForm({ ...form, departurePortPreference: e.target.value })}
                placeholder="e.g. Ningbo / Shenzhen / Shanghai / Yiwu"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Currency Exchange & Conversion Options for Excel */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">
                  Currency Exchange &amp; Conversion for Excel Sheet
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableExchangeRate ?? true}
                  onChange={e => setForm({ ...form, enableExchangeRate: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-2 text-xs font-medium text-slate-700">
                  {(form.enableExchangeRate ?? true) ? 'Active' : 'Disabled'}
                </span>
              </label>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Define the exchange rate to display in the Excel top RFQ header and automatically compute converted prices (e.g. USD to RMB ¥ or RMB ¥ to USD) on exported Excel sheets.
            </p>

            {(form.enableExchangeRate ?? true) && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      USD to CNY Exchange Rate (1 USD = ¥ RMB)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">¥</span>
                      <input
                        type="number"
                        step="0.001"
                        min="1"
                        value={form.exchangeRateUsdToCny ?? 7.25}
                        onChange={e => setForm({ ...form, exchangeRateUsdToCny: parseFloat(e.target.value) || 0 })}
                        className="w-full text-xs pl-7 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono font-semibold"
                        placeholder="7.25"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Standard China bank FX reference ~7.20 - 7.30</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      USD to EUR Exchange Rate (1 USD = € EUR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">€</span>
                      <input
                        type="number"
                        step="0.001"
                        min="0.1"
                        value={form.exchangeRateUsdToEur ?? 0.92}
                        onChange={e => setForm({ ...form, exchangeRateUsdToEur: parseFloat(e.target.value) || 0 })}
                        className="w-full text-xs pl-7 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono font-semibold"
                        placeholder="0.92"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">European currency settlement rate</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.addConvertedCurrencyColumns ?? true}
                      onChange={e => setForm({ ...form, addConvertedCurrencyColumns: e.target.checked })}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Add auto-converted currency price columns to exported Excel sheet (RMB ¥ ⇄ USD $)
                    </span>
                  </label>
                  <p className="text-[10px] text-slate-500 ml-6 mt-0.5">
                    When checked, the exported .xlsx file will contain dedicated side-by-side calculated columns with Excel formulas converting prices between RMB and USD based on your set benchmark exchange rate.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instructions for Supplier (English)
            </label>
            <textarea
              rows={2}
              value={form.instructionsEn}
              onChange={e => setForm({ ...form, instructionsEn: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instructions for Supplier (Chinese 中文说明)
            </label>
            <textarea
              rows={2}
              value={form.instructionsZh}
              onChange={e => setForm({ ...form, instructionsZh: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Project Info
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
