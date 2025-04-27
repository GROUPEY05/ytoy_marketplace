// src/components/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  const pages = [];
  
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }
  
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-4">
      <div className="flex w-0 flex-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium ${
            currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          Précédent
        </button>
      </div>
      <div className="hidden md:flex">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
              page === currentPage
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <div className="flex w-0 flex-1 justify-end">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium ${
            currentPage === lastPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          Suivant
        </button>
      </div>
    </nav>
  );
};

export default Pagination;