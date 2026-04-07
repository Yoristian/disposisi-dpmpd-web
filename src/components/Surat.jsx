import React, { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2, CheckCircle, ChevronUp, ChevronDown, Search, Filter, Calendar } from "lucide-react";

const Surat = ({
  activePage, dataSurat, debouncedSearch, statusFilter, dateFilter, searchTerm, setSearchTerm, setStatusFilter, setDateFilter,
  currentPage, ITEMS_PER_PAGE, currentUser, handleOpenSuratModal,
  handleDeleteSurat, isLoading, Breadcrumbs, TableSkeleton, EmptyState,
  StatusBadge, renderPagination,
}) => {

  const type = activePage.split("-")[1];
  const [sortConfig, setSortConfig] = useState({ key: "tgl_surat", direction: "desc" });
  
  // State untuk fitur Bulk Action (Massal)
  const [selectedItems, setSelectedItems] = useState([]);

  // Reset pilihan jika berpindah halaman atau mengganti filter
  useEffect(() => {
    setSelectedItems([]);
  }, [currentPage, activePage, debouncedSearch, statusFilter, dateFilter]);

  const filteredData = dataSurat.filter((s) => {
    const matchType = s.jenis_surat.toLowerCase() === type;
    const matchSearch = s.no_surat?.toLowerCase().includes(debouncedSearch.toLowerCase()) || s.perihal?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchStatus = statusFilter ? s.status_alur === statusFilter : true;
    const matchDate = (!dateFilter.start || new Date(s.tgl_surat) >= new Date(dateFilter.start)) && (!dateFilter.end || new Date(s.tgl_surat) <= new Date(dateFilter.end));
    return matchType && matchSearch && matchStatus && matchDate;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key === "tgl_surat" || sortConfig.key === "tgl_diterima_dikirim") {
      const dateA = new Date(a[sortConfig.key] || 0);
      const dateB = new Date(b[sortConfig.key] || 0);
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }
    const valA = (a[sortConfig.key] || "").toString().toLowerCase();
    const valB = (b[sortConfig.key] || "").toString().toLowerCase();
    return sortConfig.direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const paginatedData = sortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  // Handler Checkbox
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(paginatedData.map(item => item.id_surat));
    } else {
      setSelectedItems([]);
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
  };

  const SortableHeader = ({ label, sortKey, align = "left" }) => (
    <th onClick={() => requestSort(sortKey)} className={`px-6 py-4 text-${align} text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors group select-none`}>
      <div className={`flex items-center gap-1 ${align === "center" ? "justify-center" : ""}`}>
        {label}
        <span className="text-gray-300 group-hover:text-purple-600 transition-colors">
          {sortConfig.key === sortKey ? (sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <span className="w-3.5 h-3.5 inline-block opacity-0 group-hover:opacity-100"><ChevronDown size={14} /></span>}
        </span>
      </div>
    </th>
  );

  return (
    <div className="animate-fadeIn">
      <Breadcrumbs />

      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Surat {type === "masuk" ? "Masuk" : "Keluar"}</h1>
          <p className="text-sm text-gray-500 mt-1">Total: {filteredData.length} dokumen.</p>
        </div>

        {currentUser.role === "Admin" && (
          <button onClick={() => handleOpenSuratModal("add")} className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700 hover:-translate-y-0.5 transition-all duration-300">
            <Plus size={18} /><span>Tambah Data</span>
          </button>
        )}
      </div>

      {/* TOOLBAR: SEARCH & FILTER */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} 
            placeholder="Cari nomor surat atau perihal..." 
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" 
          />
        </div>

        {/* Filter Dropdown & Date Range */}
        <div className="flex flex-wrap md:flex-nowrap gap-4">
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)} 
              className="w-full pl-11 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none transition-all cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="Diajukan">Diajukan</option>
              <option value="Diproses">Diproses</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Dikembalikan">Dikembalikan</option>
            </select>
          </div>

          <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-xl px-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-transparent transition-all overflow-hidden">
            <Calendar className="text-gray-400 shrink-0" size={18} />
            <input 
              type="date" value={dateFilter.start} onChange={e => setDateFilter({...dateFilter, start: e.target.value})} 
              className="bg-transparent border-0 text-sm py-2.5 pl-3 pr-1 focus:ring-0 outline-none w-[125px] text-gray-600 cursor-pointer" 
              title="Tanggal Mulai"
            />
            <span className="text-gray-300 px-1">-</span>
            <input 
              type="date" value={dateFilter.end} onChange={e => setDateFilter({...dateFilter, end: e.target.value})} 
              className="bg-transparent border-0 text-sm py-2.5 pl-1 pr-1 focus:ring-0 outline-none w-[125px] text-gray-600 cursor-pointer" 
              title="Tanggal Akhir"
            />
          </div>
        </div>
      </div>

      {/* BULK ACTION BAR (Muncul jika ada baris dicentang) */}
      {selectedItems.length > 0 && currentUser.role === "Admin" && (
        <div className="mb-4 flex items-center justify-between bg-purple-50 px-5 py-3 rounded-xl border border-purple-100 animate-fadeIn">
          <span className="text-sm font-bold text-purple-800 flex items-center gap-2">
            <CheckCircle size={18} /> {selectedItems.length} dokumen terpilih
          </span>
          <button 
            onClick={() => handleDeleteSurat(selectedItems)} 
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-bold rounded-lg hover:bg-rose-500 transition-colors shadow-sm shadow-rose-500/30"
          >
            <Trash2 size={16} /> Hapus Terpilih
          </button>
        </div>
      )}

      {isLoading ? <TableSkeleton /> : (
        <>
          {filteredData.length === 0 ? <EmptyState title="Surat" onAdd={() => handleOpenSuratModal("add")} /> : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    {/* CHECKBOX HEADER */}
                    {currentUser.role === "Admin" && (
                      <th className="px-6 py-4 text-center w-12">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.length === paginatedData.length && paginatedData.length > 0} 
                          onChange={toggleSelectAll} 
                          className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-600 focus:ring-2 cursor-pointer transition-all"
                        />
                      </th>
                    )}
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">No</th>
                    <SortableHeader label="Kode" sortKey="no_agenda" align="center" />
                    <SortableHeader label="Nomor" sortKey="no_surat" />
                    <SortableHeader label="Tgl Surat" sortKey="tgl_surat" align="center" />
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Perihal</th>
                    <SortableHeader label={type === "masuk" ? "Asal" : "Tujuan"} sortKey={type === "masuk" ? "asal_surat" : "tujuan_surat"} />
                    <SortableHeader label="Status" sortKey="status_alur" align="center" />
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {paginatedData.map((item, i) => {
                    const isSelected = selectedItems.includes(item.id_surat);
                    return (
                      <tr key={item.id_surat} className={`transition-colors ${isSelected ? 'bg-purple-50/60' : 'even:bg-gray-50/30 hover:bg-purple-50/40'}`}>
                        {/* CHECKBOX BODY */}
                        {currentUser.role === "Admin" && (
                          <td className="px-6 py-4 text-center">
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => toggleSelectItem(item.id_surat)} 
                              className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-600 focus:ring-2 cursor-pointer transition-all"
                            />
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm text-gray-500 text-center">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                        <td className="px-6 py-4 text-sm text-center">{item.no_agenda || "-"}</td>
                        <td className="px-6 py-4 font-semibold">{item.no_surat || "-"}</td>
                        <td className="px-6 py-4 text-center">{item.tgl_surat ? new Date(item.tgl_surat).toLocaleDateString("id-ID") : "-"}</td>
                        <td className="px-6 py-4"><div className="text-sm text-gray-600 line-clamp-2 max-w-[220px]">{item.perihal || "-"}</div></td>
                        <td className="px-6 py-4">{item.jenis_surat === "Masuk" ? item.asal_surat : item.tujuan_surat}</td>
                        <td className="px-6 py-4 text-center"><StatusBadge status={item.status_alur} /></td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleOpenSuratModal("view", item)} className="text-gray-400 hover:text-purple-600 p-2 hover:bg-purple-50 rounded-xl" title="Lihat"><Eye size={18} /></button>
                            
                            {currentUser.role === "Sekretaris" && item.status_alur === "Diajukan" && (
                              <button onClick={() => handleOpenSuratModal("verify_sekretaris", item)} className="text-purple-500 hover:text-purple-700 p-2 hover:bg-purple-100 rounded-xl" title="Verifikasi"><CheckCircle size={18} /></button>
                            )}
                            
                            {currentUser.role === "Pimpinan" && item.status_alur === "Diproses" && (
                              <button onClick={() => handleOpenSuratModal("verify_pimpinan", item)} className="text-emerald-500 hover:text-emerald-700 p-2 hover:bg-emerald-100 rounded-xl" title="Setujui"><CheckCircle size={18} /></button>
                            )}

                            {currentUser.role === "Admin" && (
                              <>
                                <button onClick={() => handleOpenSuratModal("edit", item)} className="text-gray-400 hover:text-purple-600 p-2 hover:bg-purple-50 rounded-xl" title="Edit"><Edit size={18} /></button>
                                <button onClick={() => handleDeleteSurat(item.id_surat)} className="text-gray-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-xl" title="Hapus"><Trash2 size={18} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {renderPagination(filteredData.length)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Surat;