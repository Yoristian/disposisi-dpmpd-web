import React from 'react';
import { X, Info, Paperclip, CheckCircle, AlertCircle, Loader2, Check } from 'lucide-react';
import InputField from '../ui/InputField';
import StatusBadge from '../ui/StatusBadge';

const ModalSurat = ({ 
  isOpen, 
  onClose, 
  modalMode, 
  formSurat, 
  setFormSurat, 
  handleSave, 
  isSaving, 
  currentUser, 
  selectedFile, 
  setSelectedFile 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-5 border-b border-gray-100 flex justify-between items-center z-10">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            {modalMode === 'add' ? 'Tambah Surat' : 
             modalMode === 'edit' ? 'Edit Surat' : 
             modalMode === 'view' ? 'Detail Surat' : 'Verifikasi Surat'}
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
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="No. Agenda" autoFocus value={formSurat.no_agenda} onChange={e => setFormSurat({...formSurat, no_agenda: e.target.value})} disabled={modalMode === 'view' || modalMode.includes('verify')} required placeholder="Nomor agenda..." />
              <InputField label="No. Surat" value={formSurat.no_surat} onChange={e => setFormSurat({...formSurat, no_surat: e.target.value})} disabled={modalMode === 'view' || modalMode.includes('verify')} required placeholder="Nomor surat..." />
              <InputField label="Tgl. Surat" type="date" value={formSurat.tgl_surat} onChange={e => setFormSurat({...formSurat, tgl_surat: e.target.value})} disabled={modalMode === 'view' || modalMode.includes('verify')} required />
              <InputField label="Tgl. Diterima/Dikirim" type="date" value={formSurat.tgl_diterima_dikirim} onChange={e => setFormSurat({...formSurat, tgl_diterima_dikirim: e.target.value})} disabled={modalMode === 'view' || modalMode.includes('verify')} required />

              {formSurat.jenis_surat === 'Masuk' ? (
                 <InputField label="Asal Surat" value={formSurat.asal_surat} onChange={e => setFormSurat({...formSurat, asal_surat: e.target.value})} disabled={modalMode === 'view' || modalMode.includes('verify')} required placeholder="Instansi pengirim..." />
              ) : (
                 <InputField label="Tujuan Surat" value={formSurat.tujuan_surat} onChange={e => setFormSurat({...formSurat, tujuan_surat: e.target.value})} disabled={modalMode === 'view' || modalMode.includes('verify')} required placeholder="Instansi tujuan..." />
              )}
              
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center">
                  Divisi Terkait <span className="text-red-500 ml-1">*</span>
                  <Info size={14} className="text-gray-400 ml-1.5 cursor-help" title="Unit yang menangani dokumen ini." />
                </label>
                <input 
                  type="text" disabled={modalMode === 'view' || modalMode.includes('verify')} required 
                  value={formSurat.divisi_terkait || ''} onChange={e => setFormSurat({...formSurat, divisi_terkait: e.target.value})} 
                  className="w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm transition-all bg-gray-50 focus:bg-white hover:bg-white disabled:bg-gray-100 disabled:text-gray-500" 
                  placeholder="Contoh: IT, Keuangan..."
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                 <InputField label="Perihal" isTextarea value={formSurat.perihal} onChange={e => setFormSurat({...formSurat, perihal: e.target.value})} disabled={modalMode === 'view' || modalMode.includes('verify')} required placeholder="Ringkasan isi surat..." />
              </div>

              {/* Field Upload File */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-gray-800 mb-2">Dokumen (PDF/Word)</label>
                {modalMode === 'view' || modalMode.includes('verify') ? (
                  <div className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-sm font-medium text-gray-600 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Paperclip size={18} /></div>
                    {formSurat.file_surat ? formSurat.file_surat : "Tidak ada file terlampir"}
                  </div>
                ) : (
                  <input 
                    type="file" accept=".pdf,.doc,.docx" 
                    onChange={e => setSelectedFile(e.target.files[0])}
                    className="w-full block text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 border border-gray-200 rounded-xl bg-gray-50 transition-colors"
                  />
                )}
                {modalMode === 'edit' && formSurat.file_surat && !selectedFile && (
                  <p className="text-xs text-purple-600 mt-2 font-semibold flex items-center gap-1">
                    <CheckCircle size={12}/> File tersimpan: {formSurat.file_surat}
                  </p>
                )}
              </div>

              {/* INPUT CATATAN */}
              {(modalMode === 'verify_sekretaris' || formSurat.catatan_sekretaris) && (
                <div className="col-span-1 md:col-span-2">
                   <InputField label="Catatan Sekretaris" isTextarea value={formSurat.catatan_sekretaris || ''} onChange={e => setFormSurat({...formSurat, catatan_sekretaris: e.target.value})} disabled={modalMode !== 'verify_sekretaris'} placeholder="Opsional..." />
                </div>
              )}

              {(modalMode === 'verify_pimpinan' || formSurat.catatan_pimpinan) && (
                <div className="col-span-1 md:col-span-2">
                   <InputField label="Catatan Pimpinan" isTextarea value={formSurat.catatan_pimpinan || ''} onChange={e => setFormSurat({...formSurat, catatan_pimpinan: e.target.value})} disabled={modalMode !== 'verify_pimpinan'} placeholder="Opsional..." />
                </div>
              )}

              {/* STATUS ALUR DISPOSISI - STEPPER & TOMBOL AKSI */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <label className="block text-sm font-bold text-gray-800 mb-4">
                  Progress Disposisi
                </label>
                
                {/* Visual Progress Bar (Stepper) - DIUBAH JADI 3 STATUS */}
                <div className="relative flex items-center justify-between w-full mb-8 px-2">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
                  
                  {['Diajukan', 'Diproses', 'Disetujui'].map((step, index) => {
                    const stepsArray = ['Diajukan', 'Diproses', 'Disetujui'];
                    let currentIndex = stepsArray.indexOf(formSurat.status_alur);
                    
                    const isReturned = formSurat.status_alur === 'Dikembalikan';
                    if (isReturned) currentIndex = 0; 
                    
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex && !isReturned;
                    const isError = index === currentIndex && isReturned;

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all duration-300 ${
                          isCompleted ? 'bg-emerald-500 text-white ring-4 ring-emerald-50' :
                          isActive ? 'bg-purple-600 text-white ring-4 ring-purple-100 scale-110' :
                          isError ? 'bg-red-500 text-white ring-4 ring-red-100' :
                          'bg-white text-gray-400 border-2 border-gray-200'
                        }`}>
                          {isCompleted ? <Check size={16} strokeWidth={3} /> : (index + 1)}
                        </div>
                        <span className={`absolute top-10 text-[10px] sm:text-xs font-bold whitespace-nowrap ${
                          isActive ? 'text-purple-600' : isError ? 'text-red-500' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
                        }`}>
                          {isError && index === 0 ? 'Dikembalikan' : step}
                        </span>
                      </div>
                    );
                  })}

                  <div 
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full z-0 transition-all duration-500 ${formSurat.status_alur === 'Dikembalikan' ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ 
                      width: formSurat.status_alur === 'Dikembalikan' ? '0%' : 
                             formSurat.status_alur === 'Diproses' ? '50%' : 
                             formSurat.status_alur === 'Disetujui' ? '100%' : '0%' 
                    }}
                  ></div>
                </div>

                {/* AREA TOMBOL AKSI */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                  
                  {modalMode === 'verify_sekretaris' && (
                    <>
                      <button 
                        type="button" disabled={isSaving}
                        onClick={(e) => { e.preventDefault(); formSurat.status_alur = 'Diproses'; handleSave(e); }} 
                        className="flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all bg-indigo-600 text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-500 flex justify-center items-center gap-2"
                      >
                        {isSaving && formSurat.status_alur === 'Diproses' ? <Loader2 size={16} className="animate-spin" /> : null}
                        Teruskan
                      </button>
                      <button 
                        type="button" disabled={isSaving}
                        onClick={(e) => { e.preventDefault(); formSurat.status_alur = 'Dikembalikan'; handleSave(e); }} 
                        className="flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all bg-red-500 text-white shadow-md shadow-red-500/30 hover:bg-red-400 flex justify-center items-center gap-2"
                      >
                        {isSaving && formSurat.status_alur === 'Dikembalikan' ? <Loader2 size={16} className="animate-spin" /> : null}
                        Kembalikan
                      </button>
                    </>
                  )}

                  {modalMode === 'verify_pimpinan' && (
                    <>
                      <button 
                        type="button" disabled={isSaving}
                        onClick={(e) => { e.preventDefault(); formSurat.status_alur = 'Disetujui'; handleSave(e); }} 
                        className="flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all bg-emerald-500 text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-400 flex justify-center items-center gap-2"
                      >
                        {isSaving && formSurat.status_alur === 'Disetujui' ? <Loader2 size={16} className="animate-spin" /> : null}
                        Setujui
                      </button>
                      <button 
                        type="button" disabled={isSaving}
                        onClick={(e) => { e.preventDefault(); formSurat.status_alur = 'Dikembalikan'; handleSave(e); }} 
                        className="flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all bg-red-500 text-white shadow-md shadow-red-500/30 hover:bg-red-400 flex justify-center items-center gap-2"
                      >
                        {isSaving && formSurat.status_alur === 'Dikembalikan' ? <Loader2 size={16} className="animate-spin" /> : null}
                        Kembalikan
                      </button>
                    </>
                  )}

                  {modalMode === 'edit' && currentUser?.role === 'Admin' && (
                    <div className="w-full">
                      {formSurat.status_alur === 'Dikembalikan' ? (
                        <button 
                          type="button" disabled={isSaving} onClick={(e) => handleSave(e)} 
                          className="w-full py-3 px-4 rounded-xl text-sm font-bold transition-all bg-purple-600 text-white shadow-md shadow-purple-600/30 hover:bg-purple-700 hover:-translate-y-0.5 flex justify-center items-center gap-2"
                        >
                          {isSaving ? <Loader2 size={16} className="animate-spin" /> : null} Ajukan Ulang
                        </button>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-3 text-sm font-medium text-gray-500 text-center border border-gray-200">
                          Sedang diproses. Status terkunci.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {(modalMode === 'edit' || modalMode === 'view') && formSurat.status_alur === 'Dikembalikan' && (
                  <p className="text-xs text-red-600 mt-4 font-bold flex items-center gap-1.5 bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle size={16}/> Dokumen dikembalikan! Periksa catatan dan ajukan ulang.
                  </p>
                )}
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">Batal</button>
              
              {modalMode === 'add' && (
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-600/30 disabled:opacity-70 transition-all hover:-translate-y-0.5">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : null} Simpan
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalSurat;