import React from 'react'
import { 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  Shield, 
  ShieldAlert, 
  ShieldX, 
  ShieldCheck 
} from "lucide-react"
import { formatDate, getDaysRemaining } from '../../utils/dateUtils'
import Badge from '../ui/Badge'

const categoryColors = {
  electronics: "bg-blue-100 text-blue-800 border-blue-200",
  appliances: "bg-green-100 text-green-800 border-green-200",
  automotive: "bg-red-100 text-red-800 border-red-200",
  home_garden: "bg-purple-100 text-purple-800 border-purple-200",
  clothing: "bg-pink-100 text-pink-800 border-pink-200",
  furniture: "bg-orange-100 text-orange-800 border-orange-200",
  tools: "bg-yellow-100 text-yellow-800 border-yellow-200",
  sports: "bg-cyan-100 text-cyan-800 border-cyan-200",
  health_beauty: "bg-rose-100 text-rose-800 border-rose-200",
  other: "bg-gray-100 text-gray-800 border-gray-200"
}

const warrantyStatusConfig = {
  active: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: ShieldCheck,
    iconColor: "text-green-600"
  },
  expiring_soon: {
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: ShieldAlert,
    iconColor: "text-amber-600"
  },
  expired: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: ShieldX,
    iconColor: "text-red-600"
  },
  no_warranty: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Shield,
    iconColor: "text-gray-600"
  }
}

const InvoiceCard = ({ invoice, index }) => {
  const warrantyStatus = warrantyStatusConfig[invoice.warranty_status] || warrantyStatusConfig.no_warranty
  const StatusIcon = warrantyStatus.icon
  
  const daysRemaining = invoice.warranty_end_date 
    ? getDaysRemaining(invoice.warranty_end_date)
    : null

  return (
    <div 
      className="transform transition-all duration-500 ease-out"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'both',
        animation: 'fadeInUp 0.5s ease-out forwards'
      }}
    >
      <div className="group hover:shadow-xl transition-all duration-300 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-slate-700 transition-colors">
                  {invoice.product_name}
                </h3>
                <StatusIcon className={`w-5 h-5 ${warrantyStatus.iconColor}`} />
              </div>
              <p className="text-slate-600 font-medium">{invoice.vendor_name}</p>
            </div>
            {invoice.file_url && (
              <a 
                href__={invoice.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 hover:bg-gray-100 rounded-lg"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">
                {formatDate(invoice.purchase_date)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-900">
                {invoice.currency} {invoice.amount?.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={`${categoryColors[invoice.product_category]} border font-medium`}>
              {invoice.product_category?.replace(/_/g, ' ')}
            </Badge>
            <Badge className={`${warrantyStatus.color} border font-medium`}>
              {invoice.warranty_status?.replace(/_/g, ' ')}
            </Badge>
          </div>

          {invoice.warranty_end_date && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Warranty expires:</span>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">
                    {formatDate(invoice.warranty_end_date)}
                  </div>
                  {daysRemaining !== null && (
                    <div className={`text-xs ${
                      daysRemaining < 30 ? 'text-red-600' : 
                      daysRemaining < 90 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvoiceCard