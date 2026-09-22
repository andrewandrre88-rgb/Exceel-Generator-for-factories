import React, { useState, useEffect } from 'react';
import { ColumnDefinition, ProductItem, RFQMetadata } from './types';
import { DEFAULT_COLUMNS } from './data/defaultColumns';
import { SAMPLE_PRODUCTS, INITIAL_METADATA } from './data/sampleProducts';
import { exportToChinaSupplierExcel } from './utils/excelExport';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { saveProjectToFirestore, SavedProject } from './lib/firestoreProjects';

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

const STORAGE_KEY_PRODUCTS = 'china_rfq_products_v2';
const STORAGE_KEY_COLUMNS = 'china_rfq_columns_v2';
const STORAGE_KEY_METADATA = 'china_rfq_metadata_v2';
const STORAGE_KEY_PROJECT_ID = 'china_rfq_project_id_v2';

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [projectId, setProjectId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PROJECT_ID) || `rfq-${Date.now()}`;
  });

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
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);

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

  // Sync project ID
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROJECT_ID, projectId);
  }, [projectId]);

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
    }, 3200);
  };

  const handleSaveToCloud = async () => {
    if (!user) {
      showToast('Please sign in to save projects to Google Firebase');
      return;
    }
    setIsSavingToCloud(true);
    try {
      await saveProjectToFirestore(user.uid, user.email || '', {
        id: projectId,
        projectName: metadata.projectName || 'China Factory RFQ',
        rfqNumber: metadata.rfqNumber || 'RFQ-001',
        metadata,
        columns,
        products,
      });
      showToast('Saved inquiry project to Google Firestore!');
    } catch (err) {
      console.error('Failed to save to cloud:', err);
      showToast('Error saving project to cloud');
    } finally {
      setIsSavingToCloud(false);
    }
  };

  const handleLoadCloudProject = (proj: SavedProject) => {
    setProjectId(proj.id);
    setMetadata(proj.metadata);
    setColumns(proj.columns || DEFAULT_COLUMNS);
    setProducts(proj.products || []);
    showToast(`Switched to: ${proj.projectName}`);
  };

  // Product mutations
  const handleUpdateProduct = (id: string, updates: Partial<ProductItem>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleUpdateProductValue = (
    productId: string,
    fieldId: string,
    value: any
  ) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        return {
          ...p,
          values: {
            ...p.values,
            [fieldId]: value,
          },
        };
      })
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product removed');
  };

  const handleDuplicateProduct = (productId: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const duplicated: ProductItem = {
      ...target,
      id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: `${target.name} (Copy)`,
      sku: target.sku ? `${target.sku}-COPY` : '',
      createdAt: Date.now(),
    };
    setProducts(prev => [...prev, duplicated]);
    showToast('Product duplicated');
  };

  const handleAddProduct = () => {
    const newProd: ProductItem = {
      id: 'prod-' + Date.now(),
      name: `New Item ${products.length + 1}`,
      sku: `SKU-${1000 + products.length + 1}`,
      targetQty: 1000,
      image: '',
      buyerSpecs: '',
      values: {
        fobPrice: '',
        exwPrice: '',
        cartons: '',
        unitsPerCarton: '',
        boxLength: '',
        boxWidth: '',
        boxHeight: '',
        boxWeight: '',
        leadTime: '',
      },
      createdAt: Date.now(),
    };
    setProducts(prev => [...prev, newProd]);
    showToast('Added new product row');
  };

  const handleBatchAddProducts = (newProducts: ProductItem[]) => {
    setProducts(prev => [...prev, ...newProducts]);
    showToast(`Added ${newProducts.length} items from image batch`);
  };

  const handleReplaceImage = (productId: string, newBase64: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, image: newBase64 } : p))
    );
    showToast('Updated product photo');
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

  // Auth Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400">Loading Google Firebase Authentication...</p>
      </div>
    );
  }

  // Not logged in and not guest mode: Show modern Login Page
  if (!user && !isGuestMode) {
    return <LoginPage onContinueAsGuest={() => setIsGuestMode(true)} />;
  }

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
        user={user}
        onSignOut={() => {
          signOut();
          setIsGuestMode(false);
        }}
        onOpenProjectManager={() => setIsProjectManagerOpen(true)}
      />

      {/* Main Content Area */}
      {isSupplierView ? (
        <SupplierResponseView
          products={products}
          columns={columns}
          metadata={metadata}
          onUpdateProductValue={handleUpdateProductValue}
          onClose={() => setIsSupplierView(false)}
          onExportExcel={handleExportExcel}
          isExporting={isExporting}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-3.5 sm:py-5 space-y-3 sm:space-y-4">
          {/* Quick Notice Banner */}
          <div className="bg-blue-50/80 border border-blue-200/90 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
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
              {user && (
                <button
                  type="button"
                  onClick={handleSaveToCloud}
                  disabled={isSavingToCloud}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{isSavingToCloud ? 'Saving...' : 'Sync to Cloud'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsBatchUploadOpen(true)}
                className="px-3 py-1.5 bg-white text-blue-700 hover:bg-blue-100/60 font-semibold rounded-lg border border-blue-300 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Upload Multiple Images
              </button>
              <button
                type="button"
                onClick={() => setIsColumnManagerOpen(true)}
                className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 font-semibold rounded-lg border border-slate-300 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                Customize Inputs
              </button>
            </div>
          </div>

          {/* Project Summary KPI Bar */}
          <SummaryStats
            products={products}
            currency={metadata.targetCurrency}
            exchangeRateUsdToCny={metadata.exchangeRateUsdToCny}
            enableExchangeRate={metadata.enableExchangeRate}
          />

          {/* Spreadsheet Table */}
          <ProductTable
            products={products}
            columns={columns}
            exchangeRateUsdToCny={metadata.exchangeRateUsdToCny}
            enableExchangeRate={metadata.enableExchangeRate}
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

      {/* Project Manager Modal */}
      <ProjectManagerModal
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
        currentProject={{
          id: projectId,
          metadata,
          columns,
          products,
        }}
        onSaveCurrentToCloud={handleSaveToCloud}
        onLoadProject={handleLoadCloudProject}
        isSaving={isSavingToCloud}
      />

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
