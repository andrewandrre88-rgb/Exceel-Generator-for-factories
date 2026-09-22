import React from 'react';
import { X, Download, RefreshCw } from 'lucide-react';

interface ImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  sku: string;
  onReplaceImage?: (newBase64: string) => void;
}

export const ImageViewModal: React.FC<ImageViewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  sku,
  onReplaceImage,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${sku || 'product'}-photo.png`;
    a.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onReplaceImage) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        onReplaceImage(reader.result as string);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      id="image-view-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="image-view-modal"
        className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title || 'Product Image'}</h3>
            <span className="text-xs font-mono text-slate-500">{sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-slate-100/60 flex items-center justify-center min-h-[320px] max-h-[500px]">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[440px] max-w-full object-contain rounded-lg shadow-xs"
          />
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
          {onReplaceImage ? (
            <label className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              Replace Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
          ) : <div />}

          <button
            onClick={handleDownload}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-slate-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Photo
          </button>
        </div>
      </div>
    </div>
  );
};
