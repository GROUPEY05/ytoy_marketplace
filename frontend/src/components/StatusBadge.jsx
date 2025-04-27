// src/components/StatusBadge.jsx
import React from 'react';
import { ORDER_STATUS } from '../utils/constants';

const StatusBadge = ({ status }) => {
  const statusInfo = ORDER_STATUS[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  );
};

export default StatusBadge;