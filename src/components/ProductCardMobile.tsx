import React, { useState } from 'react';
import { ColumnDefinition, ProductItem } from '../types';
import { calculateCartons, calculateTotalCbm } from '../utils/calculations';
import { fileToBase64 } from '../utils/imageUtils';
import { 
  Camera, 
  Maximize2, 
  Trash2, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Package, 
  Boxes, 
  Coins, 
  Layers,
  Sparkles
} from 'lucide-react';

interface ProductCardMobileProps {
  product: ProductItem;
  index: number;
  columns: ColumnDefinition[];
  exchangeRateUsdToCny?: number;
  enableExchangeRate?: boolean;
  onUpdateProduct: (id: string, updates: Partial<ProductItem>) => void;
  onUpdateProductValue: (id: string, columnId: string, value: any) => void;
  onDeleteProduct: (id: string) => void;
  onDuplicateProduct: (id: string) => void;
  onViewImage: (image: string, title: string, sku: string, productId: string) => void;
}

export const ProductCardMobile: React.FC<ProductCardMobileProps> = ({
  product,
  index,
  columns,
  exchangeRateUsdToCny = 7.25,
  enableExchangeRate = true,
  onUpdateProduct,
  onUpdateProductValue,
  onDeleteProduct,
  onDuplicateProduct,
  onViewImage,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'supplier' | 'buyer' | 'specs'>('supplier');

  const activeColumns = columns.filter(c => c.enabled).sort((a, b) => a.order - b.order);
  const supplierCols = activeColumns.filter(c => c.filledBy === 'supplier');
  const buyerCols = activeColumns.filter(c => c.filledBy === 'buyer' && c.id !== 'sku' && c.id !== 'name' && c.id !== 'targetQty' && c.id !== 'buyerSpecs');

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      onUpdateProduct(product.id, { image: base64 });
    }
  };

  const autoCartons = calculateCartons(product.targetQty, product.values.unitsPerCarton);
  const autoCbm = calculateTotalCbm(
    product.targetQty,
    product.values.unitsPerCarton,
    product.values.cartons,
    product.values.boxLength,
    product.values.boxWidth,
    product.values.boxHeight
  );

  const fobRmb = Number(product.values.fobPrice) || 0;
  const fobUsd = exchangeRateUsdToCny > 0 ? (fobRmb / exchangeRateUsdToCny).toFixed(2) : '0.00';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
      {/* Top Header Card Bar */}
      <div className="p-3.5 flex items-start gap-3 bg-slate-50/80 border-b border-slate-100">
        {/* Photo Box */}
        <div className="relative w-20 h-20 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0 flex items-center justify-center group shadow-2xs">
          {product.image ? (
            <>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => onViewImage(product.image, product.name, product.sku, product.id)}
              />
              <button
                type="button"
                onClick={() => onViewImage(product.image, product.name, product.sku, product.id)}
                className="absolute inset-0 bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50/60 cursor-pointer p-1 transition-colors">
              <Camera className="w-5 h-5 text-slate-300" />
              <span className="text-[9px] mt-1 font-semibold text-slate-500">Upload</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFile}
              />
            </label>
          )}

          {/* Quick Change camera icon if photo exists */}
          {product.image && (
            <label className="absolute bottom-1 right-1 p-1 bg-white/90 hover:bg-white text-slate-700 rounded-md shadow-xs cursor-pointer">
              <Camera className="w-3 h-3 text-slate-600" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFile}
              />
            </label>
          )}
        </div>

        {/* Primary Product Inputs (Name, SKU, Target Qty) */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-slate-400 font-mono">
              #{index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onDuplicateProduct(product.id)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded"
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteProduct(product.id)}
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <input
            type="text"
            value={product.name}
            onChange={e => onUpdateProduct(product.id, { name: e.target.value })}
            placeholder="Product title (English)..."
            className="w-full text-xs font-bold text-slate-900 px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500 truncate"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight block">
                SKU / Ref
              </label>
              <input
                type="text"
                value={product.sku}
                onChange={e => onUpdateProduct(product.id, { sku: e.target.value })}
                placeholder="SKU-001"
                className="w-full text-xs font-mono px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight block">
                Target Qty (PCS)
              </label>
              <input
                type="number"
                value={product.targetQty || ''}
                onChange={e => onUpdateProduct(product.id, { targetQty: Number(e.target.value) || 0 })}
                placeholder="1000"
                className="w-full text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Factory RMB Quick Quote Bar */}
      <div className="p-3 bg-amber-50/70 border-b border-amber-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold text-xs">
            ¥
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
              FOB Price / 离岸单价 (RMB)
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-amber-900">¥</span>
              <input
                type="number"
                step="0.01"
                value={product.values.fobPrice || ''}
                onChange={e => onUpdateProductValue(product.id, 'fobPrice', e.target.value)}
                placeholder="0.00"
                className="w-24 px-2 py-1 text-xs font-bold text-slate-900 bg-white border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              {enableExchangeRate && fobRmb > 0 && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded border border-emerald-200">
                  ≈ ${fobUsd} USD
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Calculated Packaging Stats */}
        <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-white/80 px-2.5 py-1.5 rounded-lg border border-amber-200/70">
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Cartons</span>
            <span className="font-bold text-slate-800">{autoCartons} CTNS</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Volume</span>
            <span className="font-bold text-slate-800">{autoCbm} m³</span>
          </div>
        </div>
      </div>

      {/* Accordion Toggle for Detailed Supplier Inputs & Buyer Specs */}
      <div className="p-2 bg-slate-50 flex items-center justify-between border-t border-slate-100">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('supplier');
              setIsExpanded(true);
            }}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
              isExpanded && activeTab === 'supplier'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-amber-950 hover:bg-amber-100/60'
            }`}
          >
            Factory Quotation ({supplierCols.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('specs');
              setIsExpanded(true);
            }}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
              isExpanded && activeTab === 'specs'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Buyer Specs
          </button>
          {buyerCols.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('buyer');
                setIsExpanded(true);
              }}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                isExpanded && activeTab === 'buyer'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Custom Cols ({buyerCols.length})
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1 text-[11px]"
        >
          <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Details Body */}
      {isExpanded && (
        <div className="p-3.5 border-t border-slate-200 space-y-3 bg-white">
          {activeTab === 'supplier' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supplierCols.map(col => {
                const val = product.values[col.id] ?? '';
                return (
                  <div key={col.id} className="p-2.5 rounded-lg bg-amber-50/40 border border-amber-200/60 space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-950">
                      <span className="truncate">{col.labelEn}</span>
                      <span className="text-[10px] text-amber-700/80 font-normal">{col.labelZh}</span>
                    </div>

                    <input
                      type={col.type === 'number' || col.type === 'currency_cny' || col.type === 'currency_usd' ? 'number' : 'text'}
                      value={val}
                      onChange={e => onUpdateProductValue(product.id, col.id, e.target.value)}
                      placeholder={col.placeholder || `Enter ${col.labelEn}...`}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-amber-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Product Material, Colors &amp; Quality Specifications / 规格要求
                </label>
                <textarea
                  rows={3}
                  value={product.buyerSpecs || ''}
                  onChange={e => onUpdateProduct(product.id, { buyerSpecs: e.target.value })}
                  placeholder="e.g. 100% Cotton 280GSM, double stitch seams, customized woven label on side seam, PMS 286C blue..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Chinese Product Name / 中文品名
                </label>
                <input
                  type="text"
                  value={product.nameZh || ''}
                  onChange={e => onUpdateProduct(product.id, { nameZh: e.target.value })}
                  placeholder="例如: 纯棉定制圆领T恤"
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {activeTab === 'buyer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {buyerCols.map(col => {
                const val = product.values[col.id] ?? '';
                return (
                  <div key={col.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span className="truncate">{col.labelEn}</span>
                      <span className="text-[10px] text-slate-500">{col.labelZh}</span>
                    </div>

                    <input
                      type={col.type === 'number' ? 'number' : 'text'}
                      value={val}
                      onChange={e => onUpdateProductValue(product.id, col.id, e.target.value)}
                      placeholder={col.placeholder || `Enter ${col.labelEn}...`}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
