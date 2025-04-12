// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ children, className = '', hoverable = false, padding = true }) => {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${hoverable ? 'transition-shadow hover:shadow-lg' : ''}
        ${padding ? 'p-4' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;