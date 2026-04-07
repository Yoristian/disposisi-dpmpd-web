import React from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const Dashboard = ({ dataSurat, handleDashboardCardClick }) => {
  const countDiajukan = dataSurat.filter(s => s.status_alur === 'Diajukan').length;
  const countDiproses = dataSurat.filter(s => s.status_alur === 'Diproses').length;
  const countDisetujui = dataSurat.filter(s => s.status_alur === 'Disetujui').length;
  const countDikembalikan = dataSurat.filter(s => s.status_alur === 'Dikembalikan').length;

  // Standar Warna Status
  const statusChartData = [
    { name: 'Diajukan', value: countDiajukan, color: '#9333ea' },     // purple-600
    { name: 'Diproses', value: countDiproses, color: '#4f46e5' },     // indigo-600
    { name: 'Disetujui', value: countDisetujui, color: '#059669' },    // emerald-600
    { name: 'Dikembalikan', value: countDikembalikan, color: '#e11d48' } // rose-600
  ].filter(item => item.value > 0);

  const countMasuk = dataSurat.filter(s => s.jenis_surat === 'Masuk').length;
  const countKeluar = dataSurat.filter(s => s.jenis_surat === 'Keluar').length;
  
  const jenisChartData = [
    { name: 'Masuk', jumlah: countMasuk, fill: '#9333ea' },  // purple-600
    { name: 'Keluar', jumlah: countKeluar, fill: '#c084fc' } // purple-400
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
      <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Diajukan" count={countDiajukan} onClick={() => handleDashboardCardClick('Diajukan')} 
          icon={<AlertCircle size={28} />} colorClass="text-purple-600" bgLightClass="bg-purple-50" shadowHoverClass="hover:shadow-purple-100/50 hover:border-purple-200"
        />
        <StatCard 
          title="Diproses" count={countDiproses} onClick={() => handleDashboardCardClick('Diproses')} 
          icon={<Clock size={28} />} colorClass="text-indigo-600" bgLightClass="bg-indigo-50" shadowHoverClass="hover:shadow-indigo-100/50 hover:border-indigo-200"
        />
        <StatCard 
          title="Disetujui" count={countDisetujui} onClick={() => handleDashboardCardClick('Disetujui')} 
          icon={<CheckCircle size={28} />} colorClass="text-emerald-600" bgLightClass="bg-emerald-50" shadowHoverClass="hover:shadow-emerald-100/50 hover:border-emerald-200"
        />
        <StatCard 
          title="Dikembalikan" count={countDikembalikan} onClick={() => handleDashboardCardClick('Dikembalikan')} 
          icon={<XCircle size={28} />} colorClass="text-rose-600" bgLightClass="bg-rose-50" shadowHoverClass="hover:shadow-rose-100/50 hover:border-rose-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Distribusi Status</h3>
            <p className="text-sm text-gray-500">Persentase dokumen berdasarkan alur.</p>
          </div>
          
          <div className="flex-1 min-h-[280px] relative">
            {dataSurat.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                    {statusChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Data kosong.</div>}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Volume Surat</h3>
            <p className="text-sm text-gray-500">Perbandingan surat masuk & keluar.</p>
          </div>

          <div className="flex-1 min-h-[280px] relative mt-4">
            {dataSurat.length > 0 ? (
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
            ) : <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Data kosong.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;