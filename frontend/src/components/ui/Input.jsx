import React from 'react';

const Input = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4 ">
      {label && (
        <label htmlFor={id} className="block  text-sm font-medium text-black mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border bg-transparent hover:bg-transparent hover:bg-opacity-80 border border-black ${
          error ? 'border-red-500' : 'border-gray-300'
        } text-black rounded-md shadow-sm  ${className}`}
        required={required}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;