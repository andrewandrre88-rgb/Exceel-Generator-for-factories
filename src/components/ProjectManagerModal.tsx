import React, { useState, useEffect } from 'react';
import { SavedProject, getUserProjectsFromFirestore, deleteProjectFromFirestore } from '../lib/firestoreProjects';
import { useAuth } from '../context/AuthContext';
import { Folder, Trash2, ArrowRight, CloudUpload, Clock, FileSpreadsheet, X, Check, Plus } from 'lucide-react';
import { RFQMetadata, ColumnDefinition, ProductItem } from '../types';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: {
    id: string;
    metadata: RFQMetadata;
    columns: ColumnDefinition[];
    products: ProductItem[];
  };
  onSaveCurrentToCloud: () => Promise<void>;
  onLoadProject: (project: SavedProject) => void;
  isSaving: boolean;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  currentProject,
  onSaveCurrentToCloud,
  onLoadProject,
  isSaving,
}) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await getUserProjectsFromFirestore(user.uid);
      setProjects(list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    } catch (e) {
      console.warn('Error fetching projects:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchProjects();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await onSaveCurrentToCloud();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      await fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this saved RFQ project from the cloud?')) return;
    setDeletingId(id);
    try {
      await deleteProjectFromFirestore(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div id="project-manager-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4">
      <div id="project-manager-modal" className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Cloud RFQ Projects</h2>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                Synced with your Google Account ({user?.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Project Banner & Save Button */}
        <div className="p-3 sm:p-4 bg-blue-50/70 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-blue-900">
              Active Workspace: <span className="font-bold">{currentProject.metadata.projectName}</span>
            </div>
            <div className="text-[11px] text-blue-700">
              {currentProject.products.length} products • Ref #{currentProject.metadata.rfqNumber} • {currentProject.metadata.targetCurrency}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved to Cloud!</span>
              </>
            ) : isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-3.5 h-3.5" />
                <span>Save Active to Cloud</span>
              </>
            )}
          </button>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Saved Projects ({projects.length})
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Loading saved inquiries...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
              <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-medium text-slate-600">No cloud projects saved yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Save Active to Cloud" above to store your first inquiry</p>
            </div>
          ) : (
            projects.map(proj => {
              const isCurrent = proj.id === currentProject.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    onLoadProject(proj);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isCurrent
                      ? 'border-blue-300 bg-blue-50/50 hover:bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                          {proj.projectName}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-600 text-white rounded">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-mono text-slate-600">{proj.rfqNumber}</span>
                        <span>•</span>
                        <span>{proj.products?.length || 0} products</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-700">{proj.targetCurrency || 'RMB (¥)'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated {new Date(proj.updatedAt).toLocaleDateString()} at {new Date(proj.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={deletingId === proj.id}
                      onClick={(e) => handleDelete(proj.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete project from cloud"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-1.5 text-slate-400 group-hover:text-blue-600 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Click any project to switch to it</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
