import React from 'react'

const Textarea = ({ 
  placeholder, 
  value, 
  onChange, 
  rows = 3,
  className = '', 
  disabled = false,
  required = false,
  ...props 
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
      required={required}
      className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100 disabled:cursor-not-allowed resize-vertical ${className}`}
      {...props}
    />
  )
}

export default Textarea