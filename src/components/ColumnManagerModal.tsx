import React, { useState } from 'react';
import { ColumnDefinition, FieldType } from '../types';
import { 
  X, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Eye, 
  EyeOff, 
  Trash2, 
  Sliders, 
  HelpCircle,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { DEFAULT_COLUMNS } from '../data/defaultColumns';

interface ColumnManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnDefinition[];
  onSaveColumns: (cols: ColumnDefinition[]) => void;
}

export const ColumnManagerModal: React.FC<ColumnManagerModalProps> = ({
  isOpen,
  onClose,
  columns,
  onSaveColumns,
}) => {
  const [localCols, setLocalCols] = useState<ColumnDefinition[]>(columns);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingColId, setEditingColId] = useState<string | null>(null);

  // New field form state
  const [newLabelEn, setNewLabelEn] = useState('');
  const [newLabelZh, setNewLabelZh] = useState('');
  const [newType, setNewType] = useState<FieldType>('text');
  const [newFilledBy, setNewFilledBy] = useState<'buyer' | 'supplier'>('supplier');
  const [newRequired, setNewRequired] = useState(true);
  const [newUnit, setNewUnit] = useState('');
  const [newPlaceholder, setNewPlaceholder] = useState('');

  if (!isOpen) return null;

  const handleToggleColumn = (id: string) => {
    setLocalCols(prev =>
      prev.map(c => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localCols.length) return;

    const updated = [...localCols];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Re-index orders
    const reordered = updated.map((col, idx) => ({ ...col, order: idx + 1 }));
    setLocalCols(reordered);
  };

  const handleRemoveCustomColumn = (id: string) => {
    setLocalCols(prev => prev.filter(c => c.id !== id));
  };

  const handleCreateCustomColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelEn.trim()) return;

    const id = `custom_${Date.now()}`;
    const newCol: ColumnDefinition = {
      id,
      labelEn: newLabelEn.trim(),
      labelZh: newLabelZh.trim() || newLabelEn.trim(),
      category: 'custom',
      type: newType,
      requiredBySupplier: newRequired,
      filledBy: newFilledBy,
      enabled: true,
      order: localCols.length + 1,
      width: 140,
      unit: newUnit.trim() || undefined,
      placeholder: newPlaceholder.trim() || undefined,
      isCustom: true,
    };

    setLocalCols(prev => [...prev, newCol]);
    setIsAddingNew(false);
    // Reset form
    setNewLabelEn('');
    setNewLabelZh('');
    setNewType('text');
    setNewFilledBy('supplier');
    setNewRequired(true);
    setNewUnit('');
    setNewPlaceholder('');
  };

  const applyPreset = (presetName: 'standard' | 'minimal' | 'fba' | 'oem') => {
    let targetIds: string[] = [];
    if (presetName === 'minimal') {
      targetIds = ['sku', 'name', 'targetQty', 'fobPrice', 'moq', 'leadTime'];
    } else if (presetName === 'fba') {
      targetIds = ['sku', 'name', 'buyerSpecs', 'targetQty', 'fobPrice', 'exwPrice', 'unitsPerCarton', 'boxLength', 'boxWidth', 'boxHeight', 'boxWeight', 'cartons', 'cbm', 'leadTime'];
    } else if (presetName === 'oem') {
      targetIds = ['sku', 'name', 'buyerSpecs', 'targetQty', 'fobPrice', 'exwPrice', 'moq', 'sampleCost', 'leadTime', 'portOfLoading', 'customNotes'];
    } else {
      // standard - all default active
      targetIds = DEFAULT_COLUMNS.map(c => c.id);
    }

    setLocalCols(prev =>
      prev.map(c => ({
        ...c,
        enabled: targetIds.includes(c.id),
      }))
    );
  };

  const handleSaveAndClose = () => {
    onSaveColumns(localCols);
    onClose();
  };

  return (
    <div id="column-manager-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div id="column-manager-modal" className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Customize Excel Quotation Columns</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select, reorder, and configure the inputs the Chinese factory needs to fill (with English & Chinese bilingual headers)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset quick buttons */}
        <div className="px-6 py-3 bg-blue-50/70 border-b border-blue-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-blue-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('standard')}
            className="text-xs font-medium px-2.5 py-1 rounded bg-white text-slate-700 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            All Standard China Sourcing
          </button>
          <button
            type="button"
            onClick={() => applyPreset('fba')}
            className="text-xs font-medium px-2.5 py-1 rounded bg-white text-slate-700 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            Amazon FBA / Master Carton Packaging
          </button>
          <button
            type="button"
            onClick={() => applyPreset('minimal')}
            className="text-xs font-medium px-2.5 py-1 rounded bg-white text-slate-700 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            Quick Price & MOQ Check
          </button>
          <button
            type="button"
            onClick={() => applyPreset('oem')}
            className="text-xs font-medium px-2.5 py-1 rounded bg-white text-slate-700 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            Custom OEM / Tooling
          </button>
          <button
            type="button"
            onClick={() => setLocalCols(DEFAULT_COLUMNS)}
            className="ml-auto text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100 space-y-1">
          {localCols.map((col, idx) => {
            const isSupplier = col.filledBy === 'supplier';
            return (
              <div
                key={col.id}
                className={`py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors ${
                  col.enabled ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleColumn(col.id)}
                    className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                      col.enabled
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'border border-slate-300 text-transparent hover:border-slate-400'
                    }`}
                    title={col.enabled ? 'Enabled in Excel' : 'Disabled'}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-800">{col.labelEn}</span>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {col.labelZh}
                      </span>
                      {col.unit && (
                        <span className="text-[11px] text-slate-400">({col.unit})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                          isSupplier
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isSupplier ? 'Factory Fills (工厂填写)' : 'Buyer Input (买家提供)'}
                      </span>
                      {col.requiredBySupplier && (
                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                          Required
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 capitalize">
                        Type: {col.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded hover:bg-slate-200 transition-colors"
                    title="Move column earlier"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === localCols.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded hover:bg-slate-200 transition-colors"
                    title="Move column later"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  {col.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomColumn(col.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Delete custom field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add custom field section */}
        {isAddingNew ? (
          <form
            onSubmit={handleCreateCustomColumn}
            className="p-4 bg-slate-50 border-t border-slate-200 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Create New Custom Field
              </span>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Column Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Carton Barcode / Tariff Code"
                  value={newLabelEn}
                  onChange={e => setNewLabelEn(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chinese Translation (中文名称)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 外箱条形码 / 海关HS编码"
                  value={newLabelZh}
                  onChange={e => setNewLabelZh(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Field Type
                </label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as FieldType)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                >
                  <option value="text">Text (General string / info)</option>
                  <option value="number">Number (Quantity / Count)</option>
                  <option value="currency_usd">Currency ($ USD)</option>
                  <option value="currency_cny">Currency (¥ RMB)</option>
                  <option value="boolean">Yes / No</option>
                  <option value="date">Date</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Who fills this field?
                </label>
                <select
                  value={newFilledBy}
                  onChange={e => setNewFilledBy(e.target.value as 'buyer' | 'supplier')}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                >
                  <option value="supplier">China Factory / Supplier (工厂填写)</option>
                  <option value="buyer">Buyer / My Team (采购商输入)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unit Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. pcs, cm, days, %, kg"
                  value={newUnit}
                  onChange={e => setNewUnit(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Placeholder / Guide Hint
                </label>
                <input
                  type="text"
                  placeholder="e.g. Specify if Pantone matching included"
                  value={newPlaceholder}
                  onChange={e => setNewPlaceholder(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={newRequired}
                  onChange={e => setNewRequired(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Mark as Mandatory for Supplier (必填项)
              </label>

              <button
                type="submit"
                className="px-3.5 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
              >
                Add Field to Sheet
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-white px-3 py-1.5 rounded border border-blue-200 hover:border-blue-300 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" /> Add Custom Field (自定义列)
            </button>
            <span className="text-xs text-slate-400">
              {localCols.filter(c => c.enabled).length} of {localCols.length} columns active
            </span>
          </div>
        )}

        {/* Footer actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            Apply Column Changes
          </button>
        </div>
      </div>
    </div>
  );
};
