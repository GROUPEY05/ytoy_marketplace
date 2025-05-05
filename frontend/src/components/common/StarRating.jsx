import React from 'react';
import PropTypes from 'prop-types';

const StarRating = ({ rating, maxRating = 5, size = 'md', onChange, interactive = false }) => {
  const renderStar = (index) => {
    // Déterminer le type d'étoile à afficher (pleine, vide ou demi)
    let starType = 'bi-star';
    if (rating >= index + 1) {
      starType = 'bi-star-fill';
    } else if (rating >= index + 0.5) {
      starType = 'bi-star-half';
    }
    
    // Déterminer la taille de l'étoile
    let fontSize = '1rem';
    switch (size) {
      case 'sm':
        fontSize = '0.875rem';
        break;
      case 'lg':
        fontSize = '1.25rem';
        break;
      case 'xl':
        fontSize = '1.5rem';
        break;
      default:
        fontSize = '1rem';
    }
    
    return (
      <i
        key={index}
        className={`bi ${starType}`}
        style={{ 
          color: '#FFD700', 
          cursor: interactive ? 'pointer' : 'default',
          fontSize
        }}
        onClick={() => interactive && onChange && onChange(index + 1)}
        onMouseEnter={() => interactive && onChange && onChange(index + 1)}
      />
    );
  };
  
  return (
    <div className="star-rating d-inline-flex align-items-center">
      {[...Array(maxRating)].map((_, index) => renderStar(index))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  maxRating: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  onChange: PropTypes.func,
  interactive: PropTypes.bool
};

export default StarRating;
