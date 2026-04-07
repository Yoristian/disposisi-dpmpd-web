import React from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

const ManajemenUser = ({ dataUsers, handleOpenUserModal, handleDeleteUser, Breadcrumbs }) => {
  return (
    <div className="animate-fadeIn">
      <Breadcrumbs />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Pengguna</h1>
          <p className="text-sm text-gray-500">Kelola daftar akses pengguna.</p>
        </div>
        
        <button 
          onClick={() => handleOpenUserModal('add')} 
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-600/30 hover:bg-purple-700 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-purple-600 transition-all duration-200"
        >
          <Plus size={16} /><span>Tambah User</span>
        </button>
      </div>
      
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">No</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Info Akun</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {dataUsers.map((u, i) => (
              <tr key={u.id_user} className="even:bg-gray-50/50 hover:bg-purple-50/40 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{i + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold shadow-inner">
                      {u.nama_lengkap.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{u.nama_lengkap}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{u.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/20 shadow-sm">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset shadow-sm ${u.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.status === 'Aktif' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-1.5">
                    <button 
                      onClick={() => handleOpenUserModal('edit', u)} 
                      className="text-gray-400 hover:text-purple-600 p-1.5 hover:bg-purple-50 rounded-lg transition-colors" 
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(u.id_user)} 
                      className="text-gray-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors" 
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {dataUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <Users size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-900 font-medium">Belum ada pengguna.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManajemenUser;