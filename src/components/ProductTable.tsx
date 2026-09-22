import React, { useState } from 'react';
import { ColumnDefinition, ProductItem } from '../types';
import { calculateCartons, calculateTotalCbm } from '../utils/calculations';
import { fileToBase64 } from '../utils/imageUtils';
import { ProductCardMobile } from './ProductCardMobile';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Camera, 
  Maximize2, 
  HelpCircle, 
  AlertCircle,
  Search,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';

interface ProductTableProps {
  products: ProductItem[];
  columns: ColumnDefinition[];
  exchangeRateUsdToCny?: number;
  enableExchangeRate?: boolean;
  onUpdateProduct: (id: string, updates: Partial<ProductItem>) => void;
  onUpdateProductValue: (id: string, columnId: string, value: any) => void;
  onDeleteProduct: (id: string) => void;
  onDuplicateProduct: (id: string) => void;
  onAddProduct: () => void;
  onViewImage: (image: string, title: string, sku: string, productId: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  columns,
  exchangeRateUsdToCny = 7.25,
  enableExchangeRate = true,
  onUpdateProduct,
  onUpdateProductValue,
  onDeleteProduct,
  onDuplicateProduct,
  onAddProduct,
  onViewImage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unquoted'>('all');
  // Auto-detect or let user toggle Card view vs Table view (defaults to cards on small screens, table on lg)
  const [viewLayout, setViewLayout] = useState<'auto' | 'table' | 'cards'>('auto');

  const activeColumns = columns
    .filter(c => c.enabled)
    .sort((a, b) => a.order - b.order);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      searchTerm === '' ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.buyerSpecs && p.buyerSpecs.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterMode === 'unquoted') {
      const hasFob = p.values.fobPrice && Number(p.values.fobPrice) > 0;
      return !hasFob;
    }
    return true;
  });

  const handleInlineImageUpload = async (productId: string, file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      const base64 = await fileToBase64(file);
      onUpdateProduct(productId, { image: base64 });
    } catch (e) {
      console.error('Failed to read image', e);
    }
  };

  return (
    <div id="product-table-wrapper" className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
      {/* Table toolbar */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU, product name, or material specs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle (Grid / Table) */}
          <div className="flex bg-slate-200/70 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setViewLayout('auto')}
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                viewLayout === 'auto'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Responsive: Cards on Mobile/iPad, Table on Desktop"
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('cards')}
              className={`p-1 px-1.5 rounded-md font-medium transition-colors ${
                viewLayout === 'cards'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mobile Card Layout"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('table')}
              className={`p-1 px-1.5 rounded-md font-medium transition-colors ${
                viewLayout === 'table'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full Spreadsheet Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick filter */}
          <div className="flex bg-slate-200/70 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setFilterMode('unquoted')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'unquoted'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Missing Quote
            </button>
          </div>

          <button
            onClick={onAddProduct}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Row
          </button>
        </div>
      </div>

      {/* Mobile Card Layout (Shown on small screens / tablets or if cards layout selected) */}
      <div className={`${viewLayout === 'cards' ? 'block' : viewLayout === 'table' ? 'hidden' : 'block lg:hidden'} p-3 space-y-3 bg-slate-100/50`}>
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200 p-6">
            <p className="font-semibold text-slate-600 text-sm">No products found</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add Row" to create products for this inquiry.</p>
          </div>
        ) : (
          filteredProducts.map((prod, idx) => (
            <ProductCardMobile
              key={prod.id}
              product={prod}
              index={idx}
              columns={columns}
              exchangeRateUsdToCny={exchangeRateUsdToCny}
              enableExchangeRate={enableExchangeRate}
              onUpdateProduct={onUpdateProduct}
              onUpdateProductValue={onUpdateProductValue}
              onDeleteProduct={onDeleteProduct}
              onDuplicateProduct={onDuplicateProduct}
              onViewImage={onViewImage}
            />
          ))
        )}
      </div>

      {/* Spreadsheet grid (Shown on desktop or if user forces table view) */}
      <div className={`${viewLayout === 'table' ? 'block' : viewLayout === 'cards' ? 'hidden' : 'hidden lg:block'} overflow-x-auto min-h-[380px] max-h-[65vh]`}>
        <table className="w-full text-left border-collapse border-spacing-0">
          <thead>
            {/* Top group row: Buyer columns vs Factory fillable */}
            <tr className="border-b border-slate-200 text-[11px] font-semibold tracking-wider">
              <th className="bg-slate-100 text-slate-500 text-center py-1.5 px-2 border-r border-slate-200 w-12 sticky left-0 z-20">
                #
              </th>
              <th className="bg-slate-100 text-slate-600 text-center py-1.5 px-3 border-r border-slate-200 w-24 sticky left-12 z-20">
                IMAGE
              </th>
              {activeColumns.map(col => {
                const isSupplier = col.filledBy === 'supplier';
                return (
                  <th
                    key={`group-${col.id}`}
                    className={`py-1 px-2.5 border-r border-slate-200 text-center uppercase text-[10px] ${
                      isSupplier
                        ? 'bg-amber-100/80 text-amber-900 font-bold'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isSupplier ? 'Factory Fills / 工厂填写' : 'Buyer Specs / 采购要求'}
                  </th>
                );
              })}
              <th className="bg-slate-100 text-slate-500 text-center py-1.5 px-3 w-16">
                ACTIONS
              </th>
            </tr>

            {/* Main Header with bilingual titles and badges */}
            <tr className="border-b border-slate-300 text-xs font-bold text-slate-700 select-none">
              <th className="bg-slate-50 text-center py-2.5 px-2 border-r border-slate-200 sticky left-0 z-20">
                No.
              </th>
              <th className="bg-slate-50 text-center py-2.5 px-3 border-r border-slate-200 sticky left-12 z-20">
                Product Photo
              </th>

              {activeColumns.map(col => {
                const isSupplier = col.filledBy === 'supplier';
                return (
                  <th
                    key={col.id}
                    style={{ minWidth: col.width || 130 }}
                    className={`py-2 px-3 border-r border-slate-200 ${
                      isSupplier ? 'bg-amber-50/70 text-amber-950' : 'bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate">{col.labelEn}</span>
                        {col.requiredBySupplier && (
                          <span
                            className="text-[9px] text-rose-600 font-bold bg-rose-50 px-1 py-0.2 rounded"
                            title="Mandatory for supplier to fill"
                          >
                            *REQ
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">
                        {col.labelZh}
                      </span>
                    </div>
                  </th>
                );
              })}

              <th className="bg-slate-50 text-center py-2 px-2 text-slate-500">
                Tools
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-xs">
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={activeColumns.length + 3}
                  className="py-16 text-center text-slate-400"
                >
                  <p className="font-semibold text-slate-600 text-sm">No products found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Click "Add Row" or "Batch Upload Photos" to create products for this inquiry.
                  </p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => {
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
                  <tr
                    key={product.id}
                    className="hover:bg-blue-50/20 group transition-colors"
                  >
                    {/* 1. Row index */}
                    <td className="py-2 px-2 text-center font-mono font-medium text-slate-400 border-r border-slate-200 bg-white group-hover:bg-slate-50/60 sticky left-0 z-10">
                      {index + 1}
                    </td>

                    {/* 2. Image Cell with thumbnail & drag/upload */}
                    <td className="py-1.5 px-2 text-center border-r border-slate-200 bg-white group-hover:bg-slate-50/60 sticky left-12 z-10">
                      <div className="relative w-16 h-16 mx-auto rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center group/img">
                        {product.image ? (
                          <>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain cursor-pointer"
                              onClick={() =>
                                onViewImage(product.image, product.name, product.sku, product.id)
                              }
                            />
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                              <button
                                type="button"
                                onClick={() =>
                                  onViewImage(product.image, product.name, product.sku, product.id)
                                }
                                className="p-1 bg-white/90 text-slate-800 rounded hover:bg-white"
                                title="Enlarge photo"
                              >
                                <Maximize2 className="w-3 h-3" />
                              </button>
                              <label
                                className="p-1 bg-white/90 text-slate-800 rounded hover:bg-white cursor-pointer"
                                title="Change photo"
                              >
                                <Camera className="w-3 h-3" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => {
                                    if (e.target.files?.[0]) {
                                      handleInlineImageUpload(product.id, e.target.files[0]);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </>
                        ) : (
                          <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <Camera className="w-5 h-5 mb-0.5" />
                            <span className="text-[9px] font-medium">+ Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                if (e.target.files?.[0]) {
                                  handleInlineImageUpload(product.id, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </td>

                    {/* 3. Dynamic Columns */}
                    {activeColumns.map(col => {
                      const isSupplier = col.filledBy === 'supplier';
                      const cellBg = isSupplier ? 'bg-amber-50/30' : 'bg-white';

                      // Handle primary ProductItem fields (sku, name, buyerSpecs, targetQty)
                      if (col.id === 'sku') {
                        return (
                          <td key={col.id} className={`p-1.5 border-r border-slate-200 ${cellBg}`}>
                            <input
                              type="text"
                              value={product.sku}
                              placeholder="e.g. SK-001"
                              onChange={e => onUpdateProduct(product.id, { sku: e.target.value })}
                              className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-blue-500 rounded font-mono font-medium focus:bg-white focus:outline-hidden"
                            />
                          </td>
                        );
                      }

                      if (col.id === 'name') {
                        return (
                          <td key={col.id} className={`p-1.5 border-r border-slate-200 ${cellBg}`}>
                            <textarea
                              rows={2}
                              value={product.name}
                              placeholder="Product name / item description..."
                              onChange={e => onUpdateProduct(product.id, { name: e.target.value })}
                              className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-blue-500 rounded font-semibold text-slate-800 resize-none focus:bg-white focus:outline-hidden"
                            />
                          </td>
                        );
                      }

                      if (col.id === 'buyerSpecs') {
                        return (
                          <td key={col.id} className={`p-1.5 border-r border-slate-200 ${cellBg}`}>
                            <textarea
                              rows={2}
                              value={product.buyerSpecs || ''}
                              placeholder="Colors, material, packaging specs..."
                              onChange={e =>
                                onUpdateProduct(product.id, { buyerSpecs: e.target.value })
                              }
                              className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-slate-600 resize-none focus:bg-white focus:outline-hidden"
                            />
                          </td>
                        );
                      }

                      if (col.id === 'targetQty') {
                        return (
                          <td key={col.id} className={`p-1.5 border-r border-slate-200 ${cellBg}`}>
                            <input
                              type="number"
                              value={product.targetQty || ''}
                              placeholder="3000"
                              onChange={e =>
                                onUpdateProduct(product.id, {
                                  targetQty: e.target.value ? Number(e.target.value) : undefined,
                                })
                              }
                              className="w-full px-2 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-right font-medium focus:bg-white focus:outline-hidden"
                            />
                          </td>
                        );
                      }

                      // Cartons - auto calculated or manual override
                      if (col.id === 'cartons') {
                        const manualVal = product.values.cartons;
                        const displayVal =
                          manualVal !== undefined && manualVal !== '' ? manualVal : autoCartons || '';
                        const isAuto = !manualVal && autoCartons > 0;

                        return (
                          <td key={col.id} className={`p-1.5 border-r border-slate-200 ${cellBg}`}>
                            <div className="relative flex items-center">
                              <input
                                type="number"
                                value={displayVal}
                                placeholder="Auto"
                                onChange={e =>
                                  onUpdateProductValue(product.id, 'cartons', e.target.value)
                                }
                                className={`w-full px-2 py-1 text-xs border rounded text-right font-medium focus:bg-white focus:outline-hidden ${
                                  isAuto
                                    ? 'border-transparent text-slate-700 bg-slate-100/50'
                                    : 'border-blue-300 text-blue-900 bg-blue-50/50'
                                }`}
                              />
                              {isAuto && (
                                <span
                                  className="absolute left-1.5 text-[9px] font-bold text-slate-400 pointer-events-none"
                                  title="Calculated from Qty / Units per Carton"
                                >
                                  calc
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      }

                      // CBM - auto calculated or manual override
                      if (col.id === 'cbm') {
                        const manualVal = product.values.cbm;
                        const displayVal =
                          manualVal !== undefined && manualVal !== '' ? manualVal : autoCbm || '';
                        const isAuto = !manualVal && autoCbm > 0;

                        return (
                          <td key={col.id} className={`p-1.5 border-r border-slate-200 ${cellBg}`}>
                            <div className="relative flex items-center">
                              <input
                                type="number"
                                step="0.001"
                                value={displayVal}
                                placeholder="Auto"
                                onChange={e =>
                                  onUpdateProductValue(product.id, 'cbm', e.target.value)
                                }
                                className={`w-full px-2 py-1 text-xs border rounded text-right font-medium focus:bg-white focus:outline-hidden ${
                                  isAuto
                                    ? 'border-transparent text-slate-700 bg-slate-100/50'
                                    : 'border-blue-300 text-blue-900 bg-blue-50/50'
                                }`}
                              />
                              {isAuto && (
                                <span
                                  className="absolute left-1.5 text-[9px] font-bold text-slate-400 pointer-events-none"
                                  title="Calculated from L x W x H * Cartons"
                                >
                                  calc
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      }

                      // Generic dynamic value from product.values[col.id]
                      const rawValue = product.values[col.id] ?? '';
                      const isNumber =
                        col.type === 'number' ||
                        col.type === 'currency_usd' ||
                        col.type === 'currency_cny';

                      // Converted value preview
                      let convertedPreview: string | null = null;
                      if (enableExchangeRate && rawValue && !isNaN(Number(rawValue)) && Number(rawValue) > 0) {
                        const numVal = Number(rawValue);
                        if (col.type === 'currency_cny' && exchangeRateUsdToCny > 0) {
                          convertedPreview = `≈ $${(numVal / exchangeRateUsdToCny).toFixed(2)} USD`;
                        } else if (col.type === 'currency_usd' && exchangeRateUsdToCny > 0) {
                          convertedPreview = `≈ ¥${(numVal * exchangeRateUsdToCny).toFixed(2)} RMB`;
                        }
                      }

                      return (
                        <td key={col.id} className={`p-1.5 border-r border-slate-200 ${cellBg}`}>
                          <div className="relative flex flex-col justify-center">
                            <div className="relative flex items-center">
                              {col.type === 'currency_usd' && (
                                <span className="absolute left-2 text-slate-400 text-xs pointer-events-none">
                                  $
                                </span>
                              )}
                              {col.type === 'currency_cny' && (
                                <span className="absolute left-2 text-slate-400 text-xs pointer-events-none">
                                  ¥
                                </span>
                              )}
                              <input
                                type={isNumber ? 'number' : 'text'}
                                step={col.type.startsWith('currency') ? '0.01' : 'any'}
                                value={rawValue}
                                placeholder={col.placeholder || ''}
                                onChange={e =>
                                  onUpdateProductValue(product.id, col.id, e.target.value)
                                }
                                className={`w-full py-1 text-xs border border-transparent hover:border-slate-300 focus:border-blue-500 rounded focus:bg-white focus:outline-hidden ${
                                  isNumber ? 'text-right pr-2' : 'px-2'
                                } ${
                                  col.type.startsWith('currency') ? 'pl-5 font-semibold text-slate-900' : ''
                                }`}
                              />
                            </div>
                            {convertedPreview && (
                              <div className="text-[10px] text-right text-emerald-600 font-mono pr-2 -mt-0.5 leading-none">
                                {convertedPreview}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* 4. Action buttons */}
                    <td className="py-2 px-2 text-center bg-white group-hover:bg-slate-50/60">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onDuplicateProduct(product.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
                          title="Duplicate item"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(product.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom bar of table with quick Add Row button */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <button
          type="button"
          onClick={onAddProduct}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Sourcing Product Item
        </button>

        <span className="text-xs text-slate-400">
          Tip: You can drag & drop any image file directly onto the photo cell to replace it
        </span>
      </div>
    </div>
  );
};
