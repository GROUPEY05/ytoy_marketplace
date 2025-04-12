import React, { useState, useRef, useEffect } from 'react';

const Popover = ({ trigger, content, position = 'bottom' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const positions = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      
      {isOpen && (
        <div className={`absolute z-10 ${positions[position]}`}>
          <div className="bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-4">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default Popover;
