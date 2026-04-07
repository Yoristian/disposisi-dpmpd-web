import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ activePage, setActivePage }) => {
  const pathMap = {
    'dashboard': 'Dashboard',
    'surat-masuk': 'Surat Masuk',
    'surat-keluar': 'Surat Keluar',
    'history-masuk': 'Riwayat Masuk',
    'history-keluar': 'Riwayat Keluar',
    'manajemen-user': 'Manajemen User'
  };

  return (
    <nav className="flex mb-5 text-sm text-gray-400">
      <ol className="flex items-center space-x-2">
        <li>
          <button 
            onClick={() => setActivePage('dashboard')} 
            className="flex items-center hover:text-purple-600 transition-colors" 
            title="Dashboard"
          >
            <Home size={16} />
          </button>
        </li>
        <li><ChevronRight size={14} className="mx-1" /></li>
        <li className="font-semibold text-gray-800">{pathMap[activePage] || 'Halaman'}</li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;