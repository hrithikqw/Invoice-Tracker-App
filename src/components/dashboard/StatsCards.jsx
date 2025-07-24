import React from 'react'

const StatsCards = ({ title, value, icon: Icon, gradient, trend, delay = 0 }) => {
  return (
    <div 
      className="transform transition-all duration-500 ease-out"
      style={{ 
        animationDelay: `${delay}s`,
        animationFillMode: 'both',
        animation: 'fadeInUp 0.5s ease-out forwards'
      }}
    >
      <div className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300 group">
        <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
        <div className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                {title}
              </p>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-slate-900">
                  {value}
                </p>
                {trend && (
                  <p className="text-sm text-slate-500 font-medium">
                    {trend}
                  </p>
                )}
              </div>
            </div>
            <div className={`p-4 rounded-2xl ${gradient} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCards