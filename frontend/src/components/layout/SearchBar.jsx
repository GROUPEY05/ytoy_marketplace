import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Recherche effectuée pour:', searchTerm);
    // Ici vous pouvez ajouter la logique pour traiter la recherche
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                className="form-control rounded-start"
                placeholder="cherchez ici..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  borderRight: 'none',
                  borderColor: '#ced4da',
                  borderRadius: '25px 0 0 25px',
                  height: '40px'
                }}
              />
               <div 
                className="position-absolute" 
                style={{ 
                  top: '50%', 
                  right: '15px', 
                  transform: 'translateY(-50%)',
                  cursor: 'pointer'
                }}
                onClick={handleSubmit}
              >
                <FaSearch color="#6c757d" />
              </div>
              <button class='btn btn-orange btn-success' type='submit'>
              Rechercher
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;