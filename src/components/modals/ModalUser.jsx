import React, { useState } from 'react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import InputField from '../ui/InputField';

const ModalUser = ({ 
  isOpen, 
  onClose, 
  modalMode, 
  formUser, 
  setFormUser, 
  handleSave, 
  isSaving 
}) => {
  // State untuk toggle visibilitas password
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg border border-white max-h-[90vh] overflow-y-auto">
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white/90 sticky top-0 z-10">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            {modalMode === 'add' ? 'Tambah Pengguna' : 'Edit Pengguna'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors" 
            title="Tutup (Esc)"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSave} className="space-y-5">
            <InputField label="Nama Lengkap" autoFocus required value={formUser.nama_lengkap} onChange={e => setFormUser({...formUser, nama_lengkap: e.target.value})} placeholder="Nama lengkap..." />
            <InputField label="Username" required value={formUser.username} onChange={e => setFormUser({...formUser, username: e.target.value})} placeholder="Username unik..." />
            
            {/* CUSTOM INPUT PASSWORD DENGAN TOMBOL MATA */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={formUser.password} 
                  onChange={e => setFormUser({...formUser, password: e.target.value})} 
                  placeholder="Password..." 
                  className="w-full rounded-xl border-0 py-3 pl-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm transition-all bg-gray-50 focus:bg-white hover:bg-white disabled:bg-gray-100 disabled:text-gray-500"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-purple-600 z-10 bg-transparent transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <InputField label="Email" type="email" value={formUser.email || ''} onChange={e => setFormUser({...formUser, email: e.target.value})} placeholder="Alamat email..." />
              <InputField label="Telepon" required value={formUser.telepon || ''} onChange={e => setFormUser({...formUser, telepon: e.target.value})} placeholder="08xxxxxxxx" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Role <span className="text-red-500">*</span></label>
                <select required value={formUser.role} onChange={e => setFormUser({...formUser, role: e.target.value})} className="w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm transition-all bg-gray-50 focus:bg-white hover:bg-white">
                  <option value="Admin">Admin</option>
                  <option value="Sekretaris">Sekretaris</option>
                  <option value="Pimpinan">Pimpinan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Status <span className="text-red-500">*</span></label>
                <select required value={formUser.status} onChange={e => setFormUser({...formUser, status: e.target.value})} className="w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm transition-all bg-gray-50 focus:bg-white hover:bg-white">
                  <option value="Aktif">Aktif</option>
                  <option value="Non-Aktif">Non-Aktif</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">Batal</button>
              <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-600/30 disabled:opacity-70 transition-all hover:-translate-y-0.5">
                {isSaving ? <><Loader2 size={16} className="animate-spin" /> ...</> : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalUser;