import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle, Filter, X } from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const Dashboard = ({ dataSurat, handleDashboardCardClick }) => {
  // 1. STATE UNTUK FILTER TANGGAL & JENIS
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [jenisFilter, setJenisFilter] = useState('Semua'); // 'Semua', 'Masuk', 'Keluar'

  // 2. FUNGSI FILTER DATA TERPADU
  const filteredData = dataSurat.filter(surat => {
    // A. Filter Tanggal
    const dateToCompare = surat.tgl_surat || surat.created_at;
    let isAfterStart = true;
    let isBeforeEnd = true;

    if (dateToCompare) {
      const d = new Date(dateToCompare);
      d.setHours(0, 0, 0, 0);

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        isAfterStart = d >= start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        isBeforeEnd = d <= end;
      }
    }

    // B. Filter Jenis Surat
    const isJenisMatch = jenisFilter === 'Semua' || surat.jenis_surat === jenisFilter;

    // Data lolos jika memenuhi kedua kriteria (Tanggal & Jenis)
    return isAfterStart && isBeforeEnd && isJenisMatch;
  });

  // 3. KALKULASI DATA DARI filteredData
  const countDiajukan = filteredData.filter(s => s.status_alur === 'Diajukan').length;
  const countDiproses = filteredData.filter(s => s.status_alur === 'Diproses').length;
  const countDisetujui = filteredData.filter(s => s.status_alur === 'Disetujui').length;
  const countDikembalikan = filteredData.filter(s => s.status_alur === 'Dikembalikan').length;

  const statusChartData = [
    { name: 'Diajukan', value: countDiajukan, color: '#9333ea' },
    { name: 'Diproses', value: countDiproses, color: '#4f46e5' },
    { name: 'Disetujui', value: countDisetujui, color: '#059669' },
    { name: 'Dikembalikan', value: countDikembalikan, color: '#e11d48' }
  ].filter(item => item.value > 0);

  const countMasuk = filteredData.filter(s => s.jenis_surat === 'Masuk').length;
  const countKeluar = filteredData.filter(s => s.jenis_surat === 'Keluar').length;
  
  const jenisChartData = [
    { name: 'Masuk', jumlah: countMasuk, fill: '#9333ea' },
    { name: 'Keluar', jumlah: countKeluar, fill: '#c084fc' }
  ];

  const StatCard = ({ title, count, icon, onClick, colorClass, bgLightClass, shadowHoverClass }) => (
    <div 
      onClick={onClick} 
      className={`bg-white rounded-[2rem] p-6 border border-gray-100 hover:shadow-xl ${shadowHoverClass} transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[160px] group`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-14 h-14 rounded-full ${bgLightClass} ${colorClass} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
        <h3 className="text-4xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">{count}</h3>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white text-sm py-2 px-3 rounded-xl shadow-xl border border-gray-700">
          <p className="font-semibold">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fadeIn">
      {/* HEADER & FILTER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
        
        <div className="flex items-center bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm w-full xl:w-auto overflow-x-auto">
          <div className="pl-3 pr-2 text-gray-400 hidden sm:block">
            <Filter size={18} />
          </div>

          {/* Filter Jenis Surat */}
          <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 mr-2 flex-shrink-0">
            <select 
              value={jenisFilter}
              onChange={(e) => setJenisFilter(e.target.value)}
              className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 outline-none w-full cursor-pointer font-medium"
            >
              <option value="Semua">Semua Surat</option>
              <option value="Masuk">Surat Masuk</option>
              <option value="Keluar">Surat Keluar</option>
            </select>
          </div>

          {/* Filter Tanggal */}
          <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 flex-shrink-0">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 outline-none w-auto cursor-pointer"
            />
            <span className="mx-2 text-gray-400 text-sm">ke</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 outline-none w-auto cursor-pointer"
            />
          </div>
          
          {/* Tombol Reset Filter */}
          {(startDate || endDate || jenisFilter !== 'Semua') && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); setJenisFilter('Semua'); }}
              className="ml-2 p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors flex-shrink-0"
              title="Reset Filter"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      
      {/* KARTU STATISTIK (Mem-passing jenisFilter ke handler) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Diajukan" count={countDiajukan} onClick={() => handleDashboardCardClick('Diajukan', jenisFilter)} 
          icon={<AlertCircle size={28} />} colorClass="text-purple-600" bgLightClass="bg-purple-50" shadowHoverClass="hover:shadow-purple-100/50 hover:border-purple-200"
        />
        <StatCard 
          title="Diproses" count={countDiproses} onClick={() => handleDashboardCardClick('Diproses', jenisFilter)} 
          icon={<Clock size={28} />} colorClass="text-indigo-600" bgLightClass="bg-indigo-50" shadowHoverClass="hover:shadow-indigo-100/50 hover:border-indigo-200"
        />
        <StatCard 
          title="Disetujui" count={countDisetujui} onClick={() => handleDashboardCardClick('Disetujui', jenisFilter)} 
          icon={<CheckCircle size={28} />} colorClass="text-emerald-600" bgLightClass="bg-emerald-50" shadowHoverClass="hover:shadow-emerald-100/50 hover:border-emerald-200"
        />
        <StatCard 
          title="Dikembalikan" count={countDikembalikan} onClick={() => handleDashboardCardClick('Dikembalikan', jenisFilter)} 
          icon={<XCircle size={28} />} colorClass="text-rose-600" bgLightClass="bg-rose-50" shadowHoverClass="hover:shadow-rose-100/50 hover:border-rose-200"
        />
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Distribusi Status</h3>
            <p className="text-sm text-gray-500">Persentase dokumen berdasarkan alur.</p>
          </div>
          
          <div className="flex-1 min-h-[280px] relative">
            {filteredData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                    {statusChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Tidak ada data untuk filter ini.</div>}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Volume Surat</h3>
            <p className="text-sm text-gray-500">Perbandingan surat masuk & keluar.</p>
          </div>

          <div className="flex-1 min-h-[280px] relative mt-4">
            {filteredData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jenisChartData} barSize={60}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="jumlah" radius={[8, 8, 8, 8]}>
                    {jenisChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Tidak ada data untuk filter ini.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;