import React from "react";

// Composant Card
export function Card({ children, className = "", ...props }) {
  return (
    <div className={`rounded-lg shadow-md p-4 bg-white ${className}`} {...props}>
      {children}
    </div>
  );
}

// Composant CardContent
export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-2 ${className}`} {...props}>
      {children}
    </div>
  );
}
