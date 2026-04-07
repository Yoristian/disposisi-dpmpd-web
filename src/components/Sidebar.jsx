import React from 'react';
import { LayoutDashboard, Inbox, Send, History as HistoryIcon, Archive, Users, LogOut, Menu } from 'lucide-react';

const Sidebar = ({ currentUser, activePage, setActivePage, setSearchTerm, setCurrentPage, handleLogout, isMobileMenuOpen, setIsMobileMenuOpen }) => {

  const handleMenuClick = (page) => {
    setActivePage(page);
    setSearchTerm('');
    setCurrentPage(1);
    setIsMobileMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.split(' ');
    return words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  const NavItem = ({ id, icon: Icon, label, isActive }) => (
    // Mengurangi jarak margin-bottom menjadi lebih rapat (mb-0.5 di mobile, mb-1 di desktop)
    <div className="relative group flex justify-center w-full mb-0.5 lg:mb-1">
      <button
        onClick={() => handleMenuClick(id)}
        className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl lg:rounded-2xl transition-all duration-300 ${
          isActive
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 scale-105'
            : 'text-gray-400 hover:bg-purple-50 hover:text-purple-600'
        }`}
      >
        <Icon className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
      </button>

      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 bg-gray-800 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
        {label}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 h-11 w-11 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 text-gray-700"
        onClick={() => setIsMobileMenuOpen(prev => !prev)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Container */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-20 lg:w-24 bg-white/80 backdrop-blur-xl border-r border-gray-100 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col h-full py-4 lg:py-6 items-center`}>

        {/* Profile Section (Mengurangi margin-bottom agar lebih rapat ke ikon) */}
        <div className="mb-3 lg:mb-5 flex flex-col items-center shrink-0">
          <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl lg:rounded-2xl shadow-lg text-white bg-gradient-to-tr from-purple-600 to-indigo-600">
            <span className="font-extrabold text-xl lg:text-2xl">{getInitials(currentUser?.nama_lengkap)}</span>
          </div>
          <p className="mt-2 lg:mt-3 text-[10px] lg:text-sm font-semibold text-gray-800 text-center leading-tight px-1 hidden lg:block">{currentUser?.nama_lengkap}</p>
          <p className="text-[8px] lg:text-[10px] text-gray-500 uppercase mt-0.5 lg:mt-1 tracking-wider hidden lg:block">{currentUser?.role}</p>
        </div>

        {/* Menu Section (Menghapus class overflow-y-auto dan scroll-smooth) */}
        <div className="flex-1 w-full flex flex-col pb-2">
          <nav className="flex flex-col w-full">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" isActive={activePage === 'dashboard'} />
            
            {/* Mengurangi margin vertikal pada titik pemisah */}
            <div className="flex justify-center my-0.5 lg:my-1"><div className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-gray-200"></div></div>
            
            <NavItem id="surat-masuk" icon={Inbox} label="Surat Masuk" isActive={activePage === 'surat-masuk'} />
            <NavItem id="surat-keluar" icon={Send} label="Surat Keluar" isActive={activePage === 'surat-keluar'} />
            
            {/* Mengurangi margin vertikal pada titik pemisah */}
            <div className="flex justify-center my-0.5 lg:my-1"><div className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-gray-200"></div></div>
            
            <NavItem id="history-masuk" icon={HistoryIcon} label="Riwayat Masuk" isActive={activePage === 'history-masuk'} />
            <NavItem id="history-keluar" icon={Archive} label="Riwayat Keluar" isActive={activePage === 'history-keluar'} />
          </nav>

          {currentUser?.role === 'Admin' && (
            // Mengurangi padding dan margin pada bagian Admin
            <div className="w-full pt-2 lg:pt-4 mt-1 lg:mt-2 border-t border-gray-100 flex flex-col">
              <NavItem id="manajemen-user" icon={Users} label="Manajemen User" isActive={activePage === 'manajemen-user'} />
            </div>
          )}
        </div>

        {/* Logout Section */}
        <div className="mt-auto shrink-0">
          <button onClick={handleLogout} className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl lg:rounded-2xl transition" title="Keluar">
            <LogOut className="w-[20px] h-[20px]" />
          </button>
        </div>
      </aside>

      {/* Overlay Background Mobile */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
    </>
  );
};

export default Sidebar;