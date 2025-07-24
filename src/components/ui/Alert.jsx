import React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

const Alert = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: AlertTriangle
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: AlertCircle
    }
  }
  
  const { container, icon: Icon } = variants[variant]
  
  return (
    <div className={`p-4 border rounded-md ${container} ${className}`}>
      <div className="flex">
        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

export const AlertDescription = ({ children, className = '' }) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
)

export default Alert