import React, { useState } from 'react';
import { Printer, ChevronUp, ChevronDown, Search, Filter, Calendar, FileSpreadsheet, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const History = ({
  activePage, dataHistory, currentPage, ITEMS_PER_PAGE,
  isLoading, Breadcrumbs, TableSkeleton, EmptyState, renderPagination
}) => {
  const type = activePage.split('-')[1];
  const [sortConfig, setSortConfig] = useState({ key: 'waktu_aksi', direction: 'desc' });

  // STATE UNTUK PENCARIAN & FILTER
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  // ----------------------------------------------------
  // LOGIKA FILTERING
  // Catatan: matchType diperlonggar agar history surat
  // yang sudah dihapus (id_surat NULL) tetap bisa muncul
  // berdasarkan keterangan, bukan hanya relasi surat.
  // ----------------------------------------------------
  const filteredHistory = dataHistory.filter(h => {
    // Jika id_surat NULL (surat sudah dihapus), cek keterangan mengandung jenis surat
    const matchType = h.surat
      ? h.surat.jenis_surat.toLowerCase() === type
      : h.keterangan?.toLowerCase().includes(type === 'masuk' ? 'masuk' : 'keluar');

    const searchLower = searchTerm.toLowerCase();
    const matchSearch =
      h.surat?.no_surat?.toLowerCase().includes(searchLower) ||
      h.users?.nama_lengkap?.toLowerCase().includes(searchLower) ||
      h.aksi?.toLowerCase().includes(searchLower) ||
      h.keterangan?.toLowerCase().includes(searchLower); // cari di keterangan juga

    const matchRole = roleFilter ? h.users?.role === roleFilter : true;

    // ----------------------------------------------------
    // OPSI FILTER DISESUAIKAN DENGAN AKSI NYATA DI APP.JSX:
    // 'Dibuat', 'Diperbarui', 'Diteruskan', 'Diajukan Ulang',
    // 'Disetujui', 'Dikembalikan', 'Dihapus'
    // ----------------------------------------------------
    const matchStatus = statusFilter ? h.aksi === statusFilter : true;

    const matchDate =
      (!dateFilter.start || new Date(h.waktu_aksi) >= new Date(dateFilter.start + 'T00:00:00')) &&
      (!dateFilter.end   || new Date(h.waktu_aksi) <= new Date(dateFilter.end   + 'T23:59:59'));

    return matchType && matchSearch && matchRole && matchStatus && matchDate;
  });

  // LOGIKA SORTING
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortConfig.key === 'waktu_aksi') {
      return sortConfig.direction === 'asc'
        ? new Date(a.waktu_aksi) - new Date(b.waktu_aksi)
        : new Date(b.waktu_aksi) - new Date(a.waktu_aksi);
    }
    if (sortConfig.key === 'no_surat') {
      const valA = a.surat?.no_surat || '';
      const valB = b.surat?.no_surat || '';
      return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    if (sortConfig.key === 'aktor') {
      const valA = a.users?.nama_lengkap || '';
      const valB = b.users?.nama_lengkap || '';
      return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    if (sortConfig.key === 'tindakan') {
      const valA = a.aksi || '';
      const valB = b.aksi || '';
      return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return 0;
  });

  const paginatedHistory = sortedHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // EXPORT CSV
  const exportToCSV = () => {
    const toastId = toast.loading('Menyiapkan file CSV...');
    const headers = ['No', 'Waktu Aksi', 'Nomor Surat', 'Nama Aktor', 'Role', 'Tindakan', 'Keterangan'];
    const csvData = filteredHistory.map((item, index) => [
      index + 1,
      new Date(item.waktu_aksi).toLocaleString('id-ID'),
      item.surat?.no_surat || '-',
      item.users?.nama_lengkap || '-',
      item.users?.role || '-',
      item.aksi || '-',
      (item.keterangan || '-').replace(/\n/g, ' ')
    ]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(str => `"${String(str).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Riwayat_Surat_${type}_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Berhasil diexport ke CSV!', { id: toastId });
  };

  // EXPORT EXCEL (.xlsx)
  const exportToExcel = () => {
    const toastId = toast.loading('Menyiapkan file Excel...');
    try {
      const excelData = filteredHistory.map((item, index) => ({
        'No': index + 1,
        'Waktu Aksi': new Date(item.waktu_aksi).toLocaleString('id-ID'),
        'Nomor Surat': item.surat?.no_surat || '-',
        'Nama Aktor': item.users?.nama_lengkap || '-',
        'Role': item.users?.role || '-',
        'Tindakan': item.aksi || '-',
        'Keterangan': (item.keterangan || '-').replace(/\n/g, ' ')
      }));
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      worksheet['!cols'] = [
        { wch: 5 }, { wch: 20 }, { wch: 25 },
        { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 50 }
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Riwayat ${type}`);
      XLSX.writeFile(workbook, `Riwayat_Surat_${type}_${new Date().getTime()}.xlsx`);
      toast.success('Berhasil diexport ke Excel!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengexport Excel', { id: toastId });
    }
  };

  // CETAK TABEL
  const handlePrintTable = () => {
    const printWindow = window.open('', '_blank');
    const tableRows = filteredHistory.map((item, index) => `
      <tr>
        <td style="text-align:center;">${index + 1}</td>
        <td>${new Date(item.waktu_aksi).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
        <td>${item.surat?.no_surat || '<i style="color:#999">Surat dihapus</i>'}</td>
        <td>
          <strong>${item.users?.nama_lengkap || '-'}</strong><br/>
          <small>${item.users?.role || '-'}</small>
        </td>
        <td>
          <strong>${item.aksi || '-'}</strong><br/>
          <small>${item.keterangan || '-'}</small>
        </td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Riwayat Surat ${type}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h2 { text-transform: capitalize; text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 13px; }
            th { background-color: #f8fafc; font-weight: bold; text-align: center; }
            @media print { body { padding: 0; } @page { margin: 1cm; } }
          </style>
        </head>
        <body>
          <h2>Laporan Riwayat Surat ${type === 'masuk' ? 'Masuk' : 'Keluar'}</h2>
          <table>
            <thead>
              <tr>
                <th width="5%">No</th>
                <th width="15%">Waktu</th>
                <th width="20%">Nomor Surat</th>
                <th width="25%">Aktor</th>
                <th width="35%">Status & Keterangan</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows || '<tr><td colspan="5" style="text-align:center;">Data kosong</td></tr>'}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
  };

  const SortableHeader = ({ label, sortKey, align = 'left' }) => (
    <th
      onClick={() => requestSort(sortKey)}
      className={`px-6 py-4 text-${align} text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors group select-none`}
    >
      <div className={`flex items-center gap-1 ${align === 'center' ? 'justify-center' : ''}`}>
        {label}
        <span className="text-gray-300 group-hover:text-purple-600 transition-colors">
          {sortConfig.key === sortKey ? (
            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
          ) : (
            <span className="w-3.5 h-3.5 inline-block opacity-0 group-hover:opacity-100"><ChevronDown size={14} /></span>
          )}
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
            Riwayat {type === 'masuk' ? 'Masuk' : 'Keluar'}
          </h1>
          <p className="text-sm text-gray-500">Log aktivitas {filteredHistory.length} dokumen.</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 rounded-xl bg-purple-100 px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <FileText size={18} /><span>CSV</span>
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <FileSpreadsheet size={18} /><span>Excel</span>
          </button>
          <button
            onClick={handlePrintTable}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-800/30 hover:bg-slate-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <Printer size={18} /><span>Cetak</span>
          </button>
        </div>
      </div>

      {/* TOOLBAR: SEARCH & FILTER */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari no surat, aktor, tindakan, atau keterangan..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Dropdown & Date Range */}
        <div className="flex flex-wrap md:flex-nowrap gap-4">

          {/* Filter Tindakan — disesuaikan dengan aksi nyata dari App.jsx */}
          <div className="relative min-w-[170px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="w-full pl-11 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none transition-all cursor-pointer"
            >
              <option value="">Semua Tindakan</option>
              <option value="Dibuat">Dibuat</option>
              <option value="Diperbarui">Diperbarui</option>
              <option value="Diajukan Ulang">Diajukan Ulang</option>
              <option value="Diteruskan">Diteruskan</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Dikembalikan">Dikembalikan</option>
              <option value="Dihapus">Dihapus</option>
            </select>
          </div>

          {/* Filter Role */}
          <div className="relative min-w-[160px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
              className="w-full pl-11 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none transition-all cursor-pointer"
            >
              <option value="">Semua Role</option>
              <option value="Admin">Admin</option>
              <option value="Sekretaris">Sekretaris</option>
              <option value="Pimpinan">Pimpinan</option>
            </select>
          </div>

          {/* Filter Rentang Tanggal */}
          <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-xl px-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-600 focus-within:border-transparent transition-all overflow-hidden">
            <Calendar className="text-gray-400 shrink-0" size={18} />
            <input
              type="date" value={dateFilter.start} onChange={e => setDateFilter({ ...dateFilter, start: e.target.value })}
              className="bg-transparent border-0 text-sm py-2.5 pl-3 pr-1 focus:ring-0 outline-none w-[125px] text-gray-600 cursor-pointer"
              title="Tanggal Mulai"
            />
            <span className="text-gray-300 px-1">-</span>
            <input
              type="date" value={dateFilter.end} onChange={e => setDateFilter({ ...dateFilter, end: e.target.value })}
              className="bg-transparent border-0 text-sm py-2.5 pl-1 pr-1 focus:ring-0 outline-none w-[125px] text-gray-600 cursor-pointer"
              title="Tanggal Akhir"
            />
          </div>
        </div>
      </div>

      {isLoading ? <TableSkeleton /> : (
        <>
          {filteredHistory.length === 0 ? (
            <EmptyState title={`Riwayat Surat ${type}`} />
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">No</th>
                    <SortableHeader label="Waktu" sortKey="waktu_aksi" />
                    <SortableHeader label="Nomor Surat" sortKey="no_surat" />
                    <SortableHeader label="Aktor" sortKey="aktor" />
                    <SortableHeader label="Tindakan" sortKey="tindakan" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {paginatedHistory.map((item, index) => (
                    <tr key={item.id_history || index} className="even:bg-gray-50/30 hover:bg-purple-50/40 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {((currentPage - 1) * ITEMS_PER_PAGE) + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {new Date(item.waktu_aksi).toLocaleString('id-ID', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        {item.surat?.no_surat
                          ? item.surat.no_surat
                          : <span className="text-xs text-gray-400 italic">Surat dihapus</span>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold mr-3 shadow-sm">
                            {item.users?.nama_lengkap?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <span className="block text-sm font-medium text-gray-800">
                              {item.users?.nama_lengkap || <span className="text-xs text-gray-400 italic">User dihapus</span>}
                            </span>
                            <span className="block text-xs font-semibold text-purple-600">{item.users?.role || '-'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border mb-1.5 shadow-sm
                          ${item.aksi === 'Disetujui'     ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            item.aksi === 'Dikembalikan'  ? 'bg-rose-50 text-rose-700 border-rose-100'         :
                            item.aksi === 'Dihapus'       ? 'bg-red-50 text-red-700 border-red-100'            :
                            item.aksi === 'Diteruskan'    ? 'bg-blue-50 text-blue-700 border-blue-100'         :
                            item.aksi === 'Dibuat'        ? 'bg-purple-50 text-purple-700 border-purple-100'   :
                            'bg-gray-50 text-gray-700 border-gray-100'
                          }`}
                        >
                          {item.aksi}
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.keterangan}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPagination(filteredHistory.length)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;