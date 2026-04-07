import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Toaster, toast } from 'react-hot-toast'; 

// ==========================================
// IMPORT KOMPONEN HALAMAN
// ==========================================
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ManajemenUser from './components/ManajemenUser';
import Surat from './components/Surat';
import History from './components/History';

// ==========================================
// IMPORT KOMPONEN UI & MODAL BARU
// ==========================================
import Breadcrumbs from './components/ui/Breadcrumbs';
import TableSkeleton from './components/ui/TableSkeleton';
import EmptyState from './components/ui/EmptyState';
import StatusBadge from './components/ui/StatusBadge';
import Pagination from './components/ui/Pagination';

import ModalSurat from './components/modals/ModalSurat';
import ModalUser from './components/modals/ModalUser';
import ModalHapus from './components/modals/ModalHapus';

const ITEMS_PER_PAGE = 10;

const App = () => {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Data States
  const [dataSurat, setDataSurat] = useState([]);
  const [dataUsers, setDataUsers] = useState([]);
  const [dataHistory, setDataHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal & Form States
  const [isSuratModalOpen, setIsSuratModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [selectedData, setSelectedData] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: null });
  
  const [selectedFile, setSelectedFile] = useState(null);

  const initialFormSurat = {
    no_agenda: '', no_surat: '', tgl_surat: '', tgl_diterima_dikirim: '', 
    perihal: '', asal_surat: '', tujuan_surat: '', jenis_surat: 'Masuk', status_alur: 'Diajukan',
    divisi_terkait: '', catatan_sekretaris: '', catatan_pimpinan: '', file_surat: ''
  };
  const [formSurat, setFormSurat] = useState(initialFormSurat);

  const initialFormUser = {
    nama_lengkap: '', email: '', telepon: '', username: '', password: '', role: 'Sekretaris', status: 'Aktif'
  };
  const [formUser, setFormUser] = useState(initialFormUser);
  const [isSaving, setIsSaving] = useState(false);

  // ==========================================
  // 2. EFFECTS & FETCHING
  // ==========================================
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFilter({ start: '', end: '' });
    setCurrentPage(1);
  }, [activePage]);

  useEffect(() => {
    if (!currentUser) return;
    fetchData();
  }, [activePage, currentUser]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSuratModalOpen(false);
        setIsUserModalOpen(false);
        setDeleteModal({ isOpen: false, type: '', id: null });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activePage === 'dashboard' || activePage.includes('surat-')) {
        const { data, error } = await supabase.from('surat').select('*').order('created_at', { ascending: false });
        if (!error && data) setDataSurat(data);
      }
      if (activePage === 'manajemen-user') {
        const { data, error } = await supabase.from('users').select('*').order('id_user', { ascending: false });
        if (!error && data) setDataUsers(data);
      }
      if (activePage.includes('history-')) {
        const { data, error } = await supabase.from('history_surat').select('*, surat(*), users(*)').order('waktu_aksi', { ascending: false });
        if (!error && data) setDataHistory(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data.'); 
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // 3. HANDLERS CRUD
  // ==========================================
  const handleLogin = (user) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  const handleDashboardCardClick = (status) => {
    setStatusFilter(status);
    setActivePage('surat-masuk');
  };

  const handleOpenSuratModal = (mode, data = null) => {
    setModalMode(mode);
    setSelectedData(data);
    setSelectedFile(null); 
    
    if (data && mode !== 'add') {
      setFormSurat(data);
    } else {
      const jenis = activePage === 'surat-keluar' ? 'Keluar' : 'Masuk';
      setFormSurat({ ...initialFormSurat, jenis_surat: jenis });
    }
    setIsSuratModalOpen(true);
  };

  const handleSaveSurat = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let dataToSave = { ...formSurat };

      if (dataToSave.jenis_surat === 'Masuk') {
        dataToSave.tujuan_surat = dataToSave.tujuan_surat || 'DPMPD Kabupaten Tangerang';
      } else {
        dataToSave.asal_surat = dataToSave.asal_surat || 'DPMPD Kabupaten Tangerang';
      }

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('dokumen_surat').upload(fileName, selectedFile);
        if (uploadError) throw uploadError;
        dataToSave.file_surat = fileName;
      }

      if (modalMode === 'add') {
        dataToSave.status_alur = 'Diajukan'; 
      } else if (modalMode === 'edit') {
        if (dataToSave.status_alur === 'Dikembalikan') dataToSave.status_alur = 'Diajukan';
      }

      if (modalMode === 'add') {
        const { error } = await supabase.from('surat').insert([dataToSave]);
        if (error) throw error;
        toast.success('Data tersimpan.'); 
      } else if (modalMode === 'edit' || modalMode.includes('verify')) {
        const { error } = await supabase.from('surat').update(dataToSave).eq('id_surat', selectedData.id_surat);
        if (error) throw error;
        toast.success('Data diperbarui.'); 
      }

      setIsSuratModalOpen(false);
      fetchData(); 
    } catch (error) {
      toast.error("Gagal menyimpan."); 
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSurat = (id) => setDeleteModal({ isOpen: true, type: 'surat', id }); 

  const handleOpenUserModal = (mode, data = null) => {
    setModalMode(mode);
    setSelectedData(data);
    if (data && mode === 'edit') setFormUser(data);
    else setFormUser(initialFormUser);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (modalMode === 'add') {
        const { error } = await supabase.from('users').insert([formUser]);
        if (error) throw error;
        toast.success('Pengguna ditambahkan.'); 
      } else if (modalMode === 'edit') {
        const { error } = await supabase.from('users').update(formUser).eq('id_user', selectedData.id_user);
        if (error) throw error;
        toast.success('Pengguna diperbarui.'); 
      }
      setIsUserModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Gagal menyimpan."); 
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = (id) => setDeleteModal({ isOpen: true, type: 'user', id }); 

  // ========================================================
  // FUNGSI EXECUTE DELETE DIPERBARUI UNTUK MENDUKUNG MASSAL
  // ========================================================
  const executeDelete = async () => {
    setIsSaving(true);
    try {
      // Pastikan deleteIds selalu berupa array (agar bisa memproses tunggal maupun massal)
      const deleteIds = Array.isArray(deleteModal.id) ? deleteModal.id : [deleteModal.id];

      if (deleteModal.type === 'surat') {
        // Gunakan .in() alih-alih .eq()
        const { error } = await supabase.from('surat').delete().in('id_surat', deleteIds);
        if (error) throw error;
        
        toast.success(deleteIds.length > 1 ? `${deleteIds.length} Data dihapus.` : 'Data dihapus.');
      } else if (deleteModal.type === 'user') {
        const { error } = await supabase.from('users').delete().in('id_user', deleteIds);
        if (error) throw error;
        toast.success('Pengguna dihapus.');
      }
      
      fetchData();
      setDeleteModal({ isOpen: false, type: '', id: null });
    } catch (error) {
      toast.error("Gagal menghapus data.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportExcel = (type) => alert(`Exporting ${type} to Excel...`);
  const handlePrint = (type) => window.print();

  // Wrapper untuk pagination agar kompatibel dengan komponen anak yang sudah ada
  const renderPaginationWrapper = (totalItems) => (
    <Pagination 
      totalItems={totalItems} 
      itemsPerPage={ITEMS_PER_PAGE} 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage} 
    />
  );

  // Wrapper untuk breadcrumbs
  const BreadcrumbsWrapper = () => (
    <Breadcrumbs activePage={activePage} setActivePage={setActivePage} />
  );

  // ==========================================
  // 4. RENDER KONTEN UTAMA
  // ==========================================
  const renderContent = () => {
    if (activePage === 'dashboard') {
      return <Dashboard dataSurat={dataSurat} handleDashboardCardClick={handleDashboardCardClick} />;
    }
    if (activePage === 'manajemen-user') {
      return <ManajemenUser dataUsers={dataUsers} handleOpenUserModal={handleOpenUserModal} handleDeleteUser={handleDeleteUser} Breadcrumbs={BreadcrumbsWrapper} />;
    }
    if (activePage.includes('surat-')) {
      return <Surat activePage={activePage} dataSurat={dataSurat} debouncedSearch={debouncedSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} dateFilter={dateFilter} setDateFilter={setDateFilter} currentPage={currentPage} ITEMS_PER_PAGE={ITEMS_PER_PAGE} currentUser={currentUser} handleOpenSuratModal={handleOpenSuratModal} handleDeleteSurat={handleDeleteSurat} isLoading={isLoading} Breadcrumbs={BreadcrumbsWrapper} TableSkeleton={TableSkeleton} EmptyState={EmptyState} StatusBadge={StatusBadge} renderPagination={renderPaginationWrapper} />;
    }
    if (activePage.includes('history-')) {
      return <History activePage={activePage} dataHistory={dataHistory} currentPage={currentPage} ITEMS_PER_PAGE={ITEMS_PER_PAGE} isLoading={isLoading} handleExportExcel={handleExportExcel} handlePrint={handlePrint} Breadcrumbs={BreadcrumbsWrapper} TableSkeleton={TableSkeleton} EmptyState={EmptyState} renderPagination={renderPaginationWrapper} />;
    }
  };

  // ==========================================
  // 5. MAIN RENDER APP
  // ==========================================
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-gray-800 selection:bg-purple-200 selection:text-purple-900">
      
      {/* Konfigurasi Notifikasi (Toast) yang seragam dan elegan */}
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          style: { 
            borderRadius: '12px', 
            background: '#1e1b4b', // Warna ungu sangat gelap
            color: '#ffffff', 
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          },
          success: { iconTheme: { primary: '#a855f7', secondary: '#fff' } }, // Aksen ungu
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }, // Aksen merah
        }} 
      />

      <Sidebar 
        activePage={activePage} setActivePage={setActivePage} setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage} isMobileMenuOpen={isSidebarOpen} 
        setIsMobileMenuOpen={setIsSidebarOpen} currentUser={currentUser} handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen relative z-0 bg-slate-50 overflow-hidden">
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto w-full relative">
          <div className="max-w-[1600px] mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Render Komponen Modals Eksternal */}
      <ModalSurat 
        isOpen={isSuratModalOpen} 
        onClose={() => setIsSuratModalOpen(false)} 
        modalMode={modalMode} 
        formSurat={formSurat} 
        setFormSurat={setFormSurat} 
        handleSave={handleSaveSurat} 
        isSaving={isSaving} 
        currentUser={currentUser} 
        selectedFile={selectedFile} 
        setSelectedFile={setSelectedFile} 
      />

      <ModalUser 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        modalMode={modalMode} 
        formUser={formUser} 
        setFormUser={setFormUser} 
        handleSave={handleSaveUser} 
        isSaving={isSaving} 
      />

      <ModalHapus 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, type: '', id: null })} 
        onConfirm={executeDelete} 
        isSaving={isSaving} 
        type={deleteModal.type} 
      />

    </div>
  );
};

export default App;