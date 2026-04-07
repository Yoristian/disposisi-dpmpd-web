import React from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    'Diajukan': { color: 'bg-purple-50 text-purple-700 ring-purple-600/20', icon: <AlertCircle size={14} className="mr-1.5" /> },
    'Diproses': { color: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20', icon: <Clock size={14} className="mr-1.5" /> },
    'Disetujui': { color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', icon: <CheckCircle size={14} className="mr-1.5" /> },
    'Dikembalikan': { color: 'bg-rose-50 text-rose-700 ring-rose-600/20', icon: <XCircle size={14} className="mr-1.5" /> },
    'Selesai (Diinfokan)': { color: 'bg-slate-50 text-slate-700 ring-slate-600/20', icon: <CheckCircle size={14} className="mr-1.5" /> }
  };
  
  const currentStyle = styles[status] || { color: 'bg-gray-50 text-gray-600 ring-gray-500/10', icon: null };
  
  return (
    <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold ring-1 ring-inset shadow-sm ${currentStyle.color}`}>
      {currentStyle.icon} {status}
    </span>
  );
};

export default StatusBadge;