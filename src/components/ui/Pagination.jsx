import React from 'react';
import { ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

const Pagination = ({ totalItems, itemsPerPage = 10, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4 rounded-b-2xl">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            <span className="font-bold text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari <span className="font-bold text-gray-900">{totalItems}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
              className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentPage(i + 1)} 
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 transition-all ${
                  currentPage === i + 1 
                    ? 'z-10 bg-purple-600 text-white shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600' 
                    : 'text-gray-900 ring-1 ring-inset ring-gray-200 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages} 
              className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 transition-colors"
            >
              <ChevronRightIcon size={16} aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;