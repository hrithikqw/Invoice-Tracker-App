import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Textarea from '../ui/Textarea'
import { Select, SelectItem } from '../ui/Select'
import Badge from '../ui/Badge'
import { Save, X, Calendar, Shield, DollarSign } from "lucide-react"
import { CATEGORIES, CURRENCIES } from '../../utils/constants'
import { calculateWarrantyEndDate } from '../../utils/dateUtils'
import { format } from "date-fns"

const InvoiceForm = ({ 
  extractedData, 
  onSave, 
  onCancel, 
  isProcessing 
}) => {
  const [formData, setFormData] = useState({
    vendor_name: "",
    invoice_number: "",
    purchase_date: "",
    product_name: "",
    product_category: "",
    amount: "",
    currency: "USD",
    warranty_period_months: "",
    warranty_start_date: "",
    warranty_end_date: "",
    notes: "",
    serial_number: "",
    file_url: ""
  })

  // Update form when extracted data changes
  useEffect(() => {
    if (extractedData) {
      setFormData(prev => ({
        ...prev,
        ...extractedData,
        warranty_start_date: extractedData.purchase_date || extractedData.warranty_start_date || "",
      }))
    }
  }, [extractedData])

  // Calculate warranty end date when warranty period or start date changes
  useEffect(() => {
    if (formData.warranty_start_date && formData.warranty_period_months) {
      const endDate = calculateWarrantyEndDate(formData.warranty_start_date, formData.warranty_period_months)
      if (endDate) {
        setFormData(prev => ({
          ...prev,
          warranty_end_date: format(endDate, "yyyy-MM-dd")
        }))
      }
    }
  }, [formData.warranty_start_date, formData.warranty_period_months])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert string numbers to actual numbers
    const processedData = {
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      warranty_period_months: formData.warranty_period_months ? parseInt(formData.warranty_period_months) : null,
    }

    onSave(processedData)
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xl bg-white">
        <CardHeader className="pb-6 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Review Invoice Details
            <Badge variant="outline" className="ml-auto">
              AI Extracted
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Purchase Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="vendor_name" className="text-sm font-medium text-slate-700">
                    Vendor Name *
                  </label>
                  <Input
                    id="vendor_name"
                    value={formData.vendor_name}
                    onChange={(e) => handleInputChange('vendor_name', e.target.value)}
                    placeholder="e.g., Best Buy, Amazon"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="invoice_number" className="text-sm font-medium text-slate-700">
                    Invoice Number
                  </label>
                  <Input
                    id="invoice_number"
                    value={formData.invoice_number}
                    onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                    placeholder="Invoice or receipt number"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="purchase_date" className="text-sm font-medium text-slate-700">
                    Purchase Date *
                  </label>
                  <Input
                    id="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => handleInputChange('purchase_date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium text-slate-700">
                    Amount *
                  </label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleInputChange('currency', value)}
                      className="w-24"
                    >
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.value}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="0.00"
                      required
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="product_name" className="text-sm font-medium text-slate-700">
                    Product Name *
                  </label>
                  <Input
                    id="product_name"
                    value={formData.product_name}
                    onChange={(e) => handleInputChange('product_name', e.target.value)}
                    placeholder="e.g., MacBook Pro, Samsung TV"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="product_category" className="text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <Select
                    value={formData.product_category}
                    onValueChange={(value) => handleInputChange('product_category', value)}
                  >
                    <SelectItem value="">Select category</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="serial_number" className="text-sm font-medium text-slate-700">
                    Serial Number
                  </label>
                  <Input
                    id="serial_number"
                    value={formData.serial_number}
                    onChange={(e) => handleInputChange('serial_number', e.target.value)}
                    placeholder="Product serial number (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Warranty Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Warranty Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="warranty_period_months" className="text-sm font-medium text-slate-700">
                    Warranty Period (Months)
                  </label>
                  <Input
                    id="warranty_period_months"
                    type="number"
                    min="0"
                    max="120"
                    value={formData.warranty_period_months}
                    onChange={(e) => handleInputChange('warranty_period_months', e.target.value)}
                    placeholder="12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="warranty_start_date" className="text-sm font-medium text-slate-700">
                    Warranty Start Date
                  </label>
                  <Input
                    id="warranty_start_date"
                    type="date"
                    value={formData.warranty_start_date}
                    onChange={(e) => handleInputChange('warranty_start_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="warranty_end_date" className="text-sm font-medium text-slate-700">
                    Warranty End Date
                  </label>
                  <Input
                    id="warranty_end_date"
                    type="date"
                    value={formData.warranty_end_date}
                    onChange={(e) => handleInputChange('warranty_end_date', e.target.value)}
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium text-slate-700">
                Notes
              </label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional notes about this purchase or warranty..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isProcessing ? "Saving..." : "Save Invoice"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default InvoiceForm