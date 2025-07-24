import React from 'react'

const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '', 
  disabled = false,
  required = false,
  ...props 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  )
}

export default Input