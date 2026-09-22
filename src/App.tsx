import React, { useState, useEffect } from 'react';
import { ColumnDefinition, ProductItem, RFQMetadata } from './types';
import { DEFAULT_COLUMNS } from './data/defaultColumns';
import { SAMPLE_PRODUCTS, INITIAL_METADATA } from './data/sampleProducts';
import { exportToChinaSupplierExcel } from './utils/excelExport';

import { Header } from './components/Header';
import { SummaryStats } from './components/SummaryStats';
import { ProductTable } from './components/ProductTable';
import { ColumnManagerModal } from './components/ColumnManagerModal';
import { BatchImageUploadModal } from './components/BatchImageUploadModal';
import { RFQMetadataModal } from './components/RFQMetadataModal';
import { ImageViewModal } from './components/ImageViewModal';
import { SupplierResponseView } from './components/SupplierResponseView';

import { 
  FileSpreadsheet, 
  UploadCloud, 
  Sliders, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';

const STORAGE_KEY_PRODUCTS = 'china_rfq_products_v1';
const STORAGE_KEY_COLUMNS = 'china_rfq_columns_v1';
const STORAGE_KEY_METADATA = 'china_rfq_metadata_v1';

export default function App() {
  // Load initial state with localStorage fallbacks
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load products from localStorage', e);
    }
    return SAMPLE_PRODUCTS;
  });

  const [columns, setColumns] = useState<ColumnDefinition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COLUMNS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load columns from localStorage', e);
    }
    return DEFAULT_COLUMNS;
  });

  const [metadata, setMetadata] = useState<RFQMetadata>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_METADATA);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load metadata from localStorage', e);
    }
    return INITIAL_METADATA;
  });

  // UI Modal states
  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isSupplierView, setIsSupplierView] = useState(false);

  // Lightbox Image View state
  const [activeImageModal, setActiveImageModal] = useState<{
    open: boolean;
    image: string;
    title: string;
    sku: string;
    productId: string;
  }>({
    open: false,
    image: '',
    title: '',
    sku: '',
    productId: '',
  });

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Storage quota exceeded for products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COLUMNS, JSON.stringify(columns));
    } catch (e) {
      console.warn('Storage save error for columns', e);
    }
  }, [columns]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_METADATA, JSON.stringify(metadata));
    } catch (e) {
      console.warn('Storage save error for metadata', e);
    }
  }, [metadata]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Product mutation handlers
  const handleUpdateProduct = (id: string, updates: Partial<ProductItem>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleUpdateProductValue = (id: string, columnId: string, value: any) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        return {
          ...p,
          values: {
            ...p.values,
            [columnId]: value,
          },
        };
      })
    );
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product row removed');
  };

  const handleDuplicateProduct = (id: string) => {
    const item = products.find(p => p.id === id);
    if (!item) return;

    const duplicated: ProductItem = {
      ...item,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sku: `${item.sku}-COPY`,
      createdAt: Date.now(),
    };

    setProducts(prev => [...prev, duplicated]);
    showToast(`Duplicated ${item.sku}`);
  };

  const handleAddProduct = () => {
    const newItem: ProductItem = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sku: `SKU-${products.length + 1}`,
      name: 'New Sourcing Item',
      image: '',
      targetQty: 1000,
      buyerSpecs: '',
      values: {
        portOfLoading: metadata.departurePortPreference?.split('/')[0]?.trim() || 'Ningbo',
      },
      createdAt: Date.now(),
    };

    setProducts(prev => [...prev, newItem]);
    showToast('New product row added');
  };

  const handleBatchAddProducts = (newItems: ProductItem[]) => {
    setProducts(prev => [...prev, ...newItems]);
    showToast(`Added ${newItems.length} products to Excel sheet`);
  };

  const handleReplaceImage = (productId: string, newBase64: string) => {
    handleUpdateProduct(productId, { image: newBase64 });
    setActiveImageModal(prev => ({ ...prev, image: newBase64 }));
    showToast('Product photo updated');
  };

  const handleExportExcel = async () => {
    if (products.length === 0) {
      alert('Please add at least one product before exporting to Excel.');
      return;
    }

    try {
      setIsExporting(true);
      setExportStatus('Building Excel...');
      await exportToChinaSupplierExcel(products, columns, metadata, status => {
        setExportStatus(status);
      });
      showToast('Excel workbook (.xlsx) successfully generated with embedded photos!');
    } catch (err) {
      console.error('Export error', err);
      alert('Failed to generate Excel file: ' + String(err));
    } finally {
      setIsExporting(false);
      setExportStatus('');
    }
  };

  const handleLoadSampleData = () => {
    if (confirm('Replace current items with sample China sourcing products?')) {
      setProducts(SAMPLE_PRODUCTS);
      setColumns(DEFAULT_COLUMNS);
      setMetadata(INITIAL_METADATA);
      showToast('Loaded sample sourcing inquiry');
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all products from the sheet?')) {
      setProducts([]);
      showToast('All items cleared');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header Bar */}
      <Header
        metadata={metadata}
        onExportExcel={handleExportExcel}
        isExporting={isExporting}
        exportStatus={exportStatus}
        onOpenColumnManager={() => setIsColumnManagerOpen(true)}
        onOpenBatchUpload={() => setIsBatchUploadOpen(true)}
        onOpenMetadata={() => setIsMetadataOpen(true)}
        onToggleSupplierView={() => setIsSupplierView(!isSupplierView)}
        isSupplierView={isSupplierView}
        onLoadSampleData={handleLoadSampleData}
        onClearAll={handleClearAll}
      />

      {/* Main Content Area */}
      {isSupplierView ? (
        <SupplierResponseView
          products={products}
          columns={columns}
          metadata={metadata}
          onUpdateProductValue={handleUpdateProductValue}
          onExportExcel={handleExportExcel}
          onClose={() => setIsSupplierView(false)}
          isExporting={isExporting}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-4">
          {/* Quick Notice Banner */}
          <div className="bg-blue-50/80 border border-blue-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-blue-950">
                  China Factory Quotation Sheet Builder
                </p>
                <p className="text-blue-800/80 mt-0.5">
                  Embeds your uploaded product photos directly into Excel (.xlsx) rows with bilingual English &amp; Chinese column headers for seamless factory communication.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsBatchUploadOpen(true)}
                className="px-3 py-1.5 bg-white text-blue-700 hover:bg-blue-100/60 font-semibold rounded-lg border border-blue-300 transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Upload Multiple Images
              </button>
              <button
                type="button"
                onClick={() => setIsColumnManagerOpen(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                Customize Inputs
              </button>
            </div>
          </div>

          {/* Sourcing Metrics and Container utilization */}
          <SummaryStats products={products} currency={metadata.targetCurrency} />

          {/* Spreadsheet Table */}
          <ProductTable
            products={products}
            columns={columns}
            onUpdateProduct={handleUpdateProduct}
            onUpdateProductValue={handleUpdateProductValue}
            onDeleteProduct={handleDeleteProduct}
            onDuplicateProduct={handleDuplicateProduct}
            onAddProduct={handleAddProduct}
            onViewImage={(image, title, sku, productId) =>
              setActiveImageModal({ open: true, image, title, sku, productId })
            }
          />
        </main>
      )}

      {/* Column Manager Modal */}
      <ColumnManagerModal
        isOpen={isColumnManagerOpen}
        onClose={() => setIsColumnManagerOpen(false)}
        columns={columns}
        onSaveColumns={newCols => {
          setColumns(newCols);
          showToast('Updated quotation columns');
        }}
      />

      {/* Batch Image Upload Modal */}
      <BatchImageUploadModal
        isOpen={isBatchUploadOpen}
        onClose={() => setIsBatchUploadOpen(false)}
        onAddProducts={handleBatchAddProducts}
      />

      {/* RFQ Project Metadata Modal */}
      <RFQMetadataModal
        isOpen={isMetadataOpen}
        onClose={() => setIsMetadataOpen(false)}
        metadata={metadata}
        onSaveMetadata={newMeta => {
          setMetadata(newMeta);
          showToast('Project information saved');
        }}
      />

      {/* Photo Lightbox / Replacer Modal */}
      <ImageViewModal
        isOpen={activeImageModal.open}
        onClose={() => setActiveImageModal(prev => ({ ...prev, open: false }))}
        imageUrl={activeImageModal.image}
        title={activeImageModal.title}
        sku={activeImageModal.sku}
        onReplaceImage={newBase64 =>
          handleReplaceImage(activeImageModal.productId, newBase64)
        }
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
