import React from 'react'
import { Filter, Search, X } from "lucide-react"
import { Card, CardContent } from '../ui/Card'
import { Select, SelectItem } from '../ui/Select'
import Button from '../ui/Button'
import Input from '../ui/Input'

const FilterControls = ({ 
  filters, 
  setFilters, 
  searchQuery, 
  setSearchQuery, 
  totalCount 
}) => {
  const clearFilters = () => {
    setFilters({
      category: "all",
      warranty_status: "all",
      date_range: "all"
    })
    setSearchQuery("")
  }

  const hasActiveFilters = filters.category !== "all" || 
                          filters.warranty_status !== "all" || 
                          filters.date_range !== "all" ||
                          searchQuery !== ""

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Filter className="w-5 h-5" />
            <span>Filter & Search</span>
            <span className="text-sm font-normal text-slate-500">
              ({totalCount} invoice{totalCount !== 1 ? 's' : ''})
            </span>
          </div>

          <div className="flex flex-1 flex-wrap gap-4 items-center">
            <div className="relative min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                placeholder="Search products, vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200 focus:border-slate-400"
              />
            </div>

            <Select
              value={filters.category}
              onValueChange={(value) => setFilters(prev => ({...prev, category: value}))}
              className="w-48 border-slate-200"
            >
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="appliances">Appliances</SelectItem>
              <SelectItem value="automotive">Automotive</SelectItem>
              <SelectItem value="home_garden">Home & Garden</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="health_beauty">Health & Beauty</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </Select>

            <Select
              value={filters.warranty_status}
              onValueChange={(value) => setFilters(prev => ({...prev, warranty_status: value}))}
              className="w-48 border-slate-200"
            >
              <SelectItem value="all">All Warranties</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="no_warranty">No Warranty</SelectItem>
            </Select>

            <Select
              value={filters.date_range}
              onValueChange={(value) => setFilters(prev => ({...prev, date_range: value}))}
              className="w-48 border-slate-200"
            >
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="last_30">Last 30 days</SelectItem>
              <SelectItem value="last_90">Last 3 months</SelectItem>
              <SelectItem value="last_year">Last year</SelectItem>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FilterControls