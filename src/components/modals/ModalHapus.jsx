import React from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

const ModalHapus = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isSaving, 
  type 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-bounce-short border border-white">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-rose-50/50">
            <AlertTriangle size={36} className="text-rose-500" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">Hapus Data?</h3>
          <p className="text-sm text-gray-500">
            Tindakan ini bersifat permanen dan data {type === 'surat' ? 'surat' : 'pengguna'} tidak dapat dikembalikan.
          </p>
        </div>
        
        <div className="bg-gray-50 px-8 py-5 flex justify-center gap-3 border-t border-gray-100">
          <button 
            onClick={onClose} 
            className="px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isSaving} 
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-500 shadow-lg shadow-rose-500/30 disabled:opacity-70 transition-all hover:-translate-y-0.5"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalHapus;