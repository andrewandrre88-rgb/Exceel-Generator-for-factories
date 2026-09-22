import React from 'react';
import { ColumnDefinition, ProductItem, RFQMetadata } from '../types';
import { calculateCartons, calculateTotalCbm } from '../utils/calculations';
import { 
  CheckCircle2, 
  Building2, 
  Download, 
  Printer, 
  ArrowLeft, 
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

interface SupplierResponseViewProps {
  products: ProductItem[];
  columns: ColumnDefinition[];
  metadata: RFQMetadata;
  onUpdateProductValue: (id: string, columnId: string, value: any) => void;
  onExportExcel: () => void;
  onClose: () => void;
  isExporting: boolean;
}

export const SupplierResponseView: React.FC<SupplierResponseViewProps> = ({
  products,
  columns,
  metadata,
  onUpdateProductValue,
  onExportExcel,
  onClose,
  isExporting,
}) => {
  const activeColumns = columns
    .filter(c => c.enabled)
    .sort((a, b) => a.order - b.order);

  const supplierColumns = activeColumns.filter(c => c.filledBy === 'supplier');
  const buyerColumns = activeColumns.filter(c => c.filledBy === 'buyer');

  return (
    <div className="bg-slate-100 min-h-screen pb-16">
      {/* Top Banner */}
      <div className="bg-amber-600 text-white px-4 py-2.5 shadow-xs sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 bg-amber-700 hover:bg-amber-800 px-2.5 py-1 rounded transition-colors text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Editor
          </button>
          <span>
            ★ Factory Sourcing View (供应商在线报价模式) - Yellow cells are for your factory quotation
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1 bg-amber-700/80 hover:bg-amber-800 text-xs px-2.5 py-1 rounded font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={onExportExcel}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs px-3 py-1 rounded font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* RFQ Header Card */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Official Factory Inquiry / 采购询价单
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {metadata.projectName}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                <span>RFQ #: {metadata.rfqNumber}</span>
                <span>•</span>
                <span>Date: {metadata.inquiryDate}</span>
                <span>•</span>
                <span className="text-amber-700 font-semibold">
                  Deadline: {metadata.deadlineDate}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
              <div>
                <span className="text-slate-400 font-medium">Buyer:</span>{' '}
                <span className="font-bold text-slate-800">{metadata.buyerCompany}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Contact:</span>{' '}
                <span className="text-slate-700">{metadata.buyerContact}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Trade Term:</span>{' '}
                <span className="font-semibold text-slate-900">{metadata.tradeTerm}</span> (
                {metadata.destinationPort})
              </div>
            </div>
          </div>

          {/* Bilingual Supplier Notice */}
          <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200/80 text-xs space-y-1.5 text-amber-950">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              【供应商报价指引 / Instructions for Suppliers】:
            </div>
            <p className="leading-relaxed">
              {metadata.instructionsZh ||
                '请在下方黄色高亮输入框内填写贵司最优惠的FOB/EXW单价、装箱数、外箱规格尺寸、单箱毛重以及大货生产交期。'}
            </p>
            <p className="text-amber-800/90 leading-relaxed font-sans">
              {metadata.instructionsEn ||
                'Please fill in your best unit quotation (FOB/EXW), master carton packing dimensions, gross weight, and lead time in the highlighted inputs.'}
            </p>
          </div>
        </div>

        {/* Product Cards for Factory to Fill */}
        <div className="space-y-4">
          {products.map((product, idx) => {
            const autoCartons = calculateCartons(
              product.targetQty,
              product.values.unitsPerCarton
            );
            const autoCbm = calculateTotalCbm(
              product.targetQty,
              product.values.unitsPerCarton,
              product.values.cartons,
              product.values.boxLength,
              product.values.boxWidth,
              product.values.boxHeight
            );

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden"
              >
                {/* Item header */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {product.sku}
                    </span>
                    <span className="text-sm font-bold text-slate-900 ml-1">
                      {product.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                      Target Qty: {(product.targetQty || 0).toLocaleString()} PCS
                    </span>
                  </div>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-5">
                  {/* Photo & Buyer specs */}
                  <div className="md:col-span-1 flex flex-col items-center sm:items-start gap-3">
                    <div className="w-36 h-36 rounded-lg border border-slate-200 bg-slate-50 p-1 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">No Image</span>
                      )}
                    </div>
                    {product.buyerSpecs && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 w-full">
                        <span className="font-bold text-slate-700 block mb-0.5">
                          Buyer Specifications (要求):
                        </span>
                        {product.buyerSpecs}
                      </div>
                    )}
                  </div>

                  {/* Supplier fillable fields grid */}
                  <div className="md:col-span-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Factory Fill-In Fields (请供应商填写下列表格):
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {supplierColumns.map(col => {
                        const rawVal = product.values[col.id] ?? '';
                        const isNumber =
                          col.type === 'number' ||
                          col.type === 'currency_usd' ||
                          col.type === 'currency_cny';

                        return (
                          <div
                            key={col.id}
                            className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/70"
                          >
                            <label className="block text-[11px] font-bold text-amber-950 mb-1">
                              {col.labelEn}
                              <span className="block text-[10px] font-normal text-amber-800">
                                {col.labelZh}
                              </span>
                            </label>

                            <div className="relative flex items-center">
                              {col.type === 'currency_usd' && (
                                <span className="absolute left-2.5 text-xs text-amber-700 pointer-events-none font-bold">
                                  $
                                </span>
                              )}
                              {col.type === 'currency_cny' && (
                                <span className="absolute left-2.5 text-xs text-amber-700 pointer-events-none font-bold">
                                  ¥
                                </span>
                              )}
                              <input
                                type={isNumber ? 'number' : 'text'}
                                step={col.type.startsWith('currency') ? '0.01' : 'any'}
                                value={rawVal}
                                placeholder={col.placeholder || 'Enter value...'}
                                onChange={e =>
                                  onUpdateProductValue(product.id, col.id, e.target.value)
                                }
                                className={`w-full text-xs py-1.5 border border-amber-300 rounded bg-white font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                                  col.type.startsWith('currency')
                                    ? 'pl-6 pr-2 text-right'
                                    : isNumber
                                    ? 'text-right px-2'
                                    : 'px-2'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Calculated overview for this item */}
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400">Total Cartons:</span>{' '}
                        <span className="font-bold text-slate-800">
                          {product.values.cartons || autoCartons || '-'} CTNS
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Est. Volume:</span>{' '}
                        <span className="font-bold text-slate-800">
                          {product.values.cbm || autoCbm || '-'} CBM (m³)
                        </span>
                      </div>
                      {product.values.boxWeight && (
                        <div>
                          <span className="text-slate-400">Total Wt:</span>{' '}
                          <span className="font-bold text-slate-800">
                            {(
                              (Number(product.values.cartons) || autoCartons) *
                              Number(product.values.boxWeight)
                            ).toFixed(1)}{' '}
                            KG
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
