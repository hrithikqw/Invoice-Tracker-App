import React from 'react'

export const Select = ({ value, onValueChange, children, className = '', disabled = false }) => {
  return (
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-100 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </select>
  )
}

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
)