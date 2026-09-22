import React, { useState, useRef } from 'react';
import { UploadCloud, X, Check, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { ProductItem } from '../types';
import { fileToBase64 } from '../utils/imageUtils';

interface BatchImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProducts: (newProducts: ProductItem[]) => void;
}

interface StagedImage {
  id: string;
  name: string;
  sku: string;
  base64: string;
  targetQty: number;
  specs: string;
}

export const BatchImageUploadModal: React.FC<BatchImageUploadModalProps> = ({
  isOpen,
  onClose,
  onAddProducts,
}) => {
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
  const [defaultQty, setDefaultQty] = useState<number>(1000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFiles = async (files: FileList | File[]) => {
    setIsProcessing(true);
    const newItems: StagedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const base64 = await fileToBase64(file);
        // Clean filename for SKU and Name
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        const sku = `SKU-${baseName.substring(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, '-')}`;
        const cleanTitle = baseName
          .replace(/[_-]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        newItems.push({
          id: `batch-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          name: cleanTitle || 'Sourced Product Item',
          sku: sku || `SKU-${i + 1}`,
          base64,
          targetQty: defaultQty,
          specs: '',
        });
      } catch (err) {
        console.error('Error reading image file:', file.name, err);
      }
    }

    setStagedImages(prev => [...prev, ...newItems]);
    setIsProcessing(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleRemoveStaged = (id: string) => {
    setStagedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleUpdateStaged = (id: string, field: keyof StagedImage, value: any) => {
    setStagedImages(prev =>
      prev.map(img => (img.id === id ? { ...img, [field]: value } : img))
    );
  };

  const handleConfirmAdd = () => {
    if (stagedImages.length === 0) return;

    const newProducts: ProductItem[] = stagedImages.map(st => ({
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      sku: st.sku,
      name: st.name,
      image: st.base64,
      targetQty: st.targetQty,
      buyerSpecs: st.specs,
      values: {},
      createdAt: Date.now(),
    }));

    onAddProducts(newProducts);
    setStagedImages([]);
    onClose();
  };

  return (
    <div id="batch-upload-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div id="batch-upload-modal" className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Upload Product Images</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select or drop multiple product photos to automatically create rows in your China RFQ Excel sheet
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop Zone */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Drag & drop product images here, or <span className="text-blue-600 underline">browse files</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports PNG, JPG, WEBP, SVG (multiple files supported). Row items will be generated automatically.
            </p>
            {isProcessing && (
              <p className="text-xs font-semibold text-blue-600 mt-2 animate-pulse">
                Processing and loading images...
              </p>
            )}
          </div>

          {/* Staged Items preview table */}
          {stagedImages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {stagedImages.length} Image{stagedImages.length > 1 ? 's' : ''} Ready to Add
                </span>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-600">Default Target Qty:</label>
                  <input
                    type="number"
                    value={defaultQty}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setDefaultQty(val);
                      setStagedImages(prev => prev.map(item => ({ ...item, targetQty: val })));
                    }}
                    className="w-20 text-xs px-2 py-1 border border-slate-300 rounded text-right focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setStagedImages([])}
                    className="text-xs text-rose-600 hover:underline ml-2"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {stagedImages.map((st, index) => (
                  <div key={st.id} className="p-2.5 bg-white flex items-center gap-3 hover:bg-slate-50">
                    <span className="text-xs font-mono text-slate-400 w-5 text-center">
                      {index + 1}
                    </span>
                    <img
                      src={st.base64}
                      alt={st.name}
                      className="w-12 h-12 object-contain rounded border border-slate-200 bg-slate-50"
                    />
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">SKU</label>
                        <input
                          type="text"
                          value={st.sku}
                          onChange={e => handleUpdateStaged(st.id, 'sku', e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-slate-200 rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">Product Title</label>
                        <input
                          type="text"
                          value={st.name}
                          onChange={e => handleUpdateStaged(st.id, 'name', e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-slate-200 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block font-medium">Target Qty (PCS)</label>
                        <input
                          type="number"
                          value={st.targetQty}
                          onChange={e => handleUpdateStaged(st.id, 'targetQty', Number(e.target.value))}
                          className="w-full text-xs px-2 py-1 border border-slate-200 rounded text-right"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStaged(st.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {stagedImages.length === 0
              ? 'Select photos to continue'
              : `${stagedImages.length} products will be inserted into the Excel sheet`}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={stagedImages.length === 0}
              onClick={handleConfirmAdd}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add {stagedImages.length > 0 ? stagedImages.length : ''} Products to Sheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
