import React from 'react';
import { Inbox, Plus } from 'lucide-react';

const EmptyState = ({ title, onAdd }) => (
  <div className="bg-white rounded-[2rem] border border-gray-100 p-16 text-center flex flex-col items-center justify-center shadow-sm">
    <div className="bg-purple-50 p-5 rounded-full mb-5 ring-8 ring-purple-50/50">
      <Inbox size={36} className="text-purple-600" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-1">Data Kosong</h3>
    <p className="text-sm text-gray-500 mb-6 max-w-sm">
      Belum ada data {title.toLowerCase()} yang tersimpan.
    </p>
    {onAdd && (
      <button 
        onClick={onAdd} 
        className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition-all hover:-translate-y-0.5"
      >
        <Plus size={18} /> Tambah Data
      </button>
    )}
  </div>
);

export default EmptyState;