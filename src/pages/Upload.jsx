import React, { useState } from 'react';
import { supabase, INVOICES_BUCKET } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, ArrowLeft } from 'lucide-react';
import { addMonths, format } from 'date-fns';

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    vendor_name: '',
    invoice_number: '',
    purchase_date: '',
    product_name: '',
    product_category: 'electronics',
    amount: '',
    currency: 'USD',
    warranty_period_months: '',
    warranty_start_date: '',
    warranty_end_date: '',
    notes: '',
    serial_number: '',
  });

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'appliances', label: 'Appliances' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'home_garden', label: 'Home & Garden' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'tools', label: 'Tools' },
    { value: 'sports', label: 'Sports' },
    { value: 'health_beauty', label: 'Health & Beauty' },
    { value: 'other', label: 'Other' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate warranty end date
    if (field === 'warranty_period_months' || field === 'warranty_start_date') {
      const startDate = field === 'warranty_start_date' ? value : formData.warranty_start_date;
      const months = field === 'warranty_period_months' ? parseInt(value) : parseInt(formData.warranty_period_months);
      
      if (startDate && months) {
        const endDate = addMonths(new Date(startDate), months);
        setFormData(prev => ({ ...prev, warranty_end_date: format(endDate, 'yyyy-MM-dd') }));
      }
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(INVOICES_BUCKET)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(INVOICES_BUCKET)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const invoiceData = {
        ...formData,
        user_id: user.id,
        amount: parseFloat(formData.amount),
        warranty_period_months: formData.warranty_period_months ? parseInt(formData.warranty_period_months) : null,
      };

      const { error } = await supabase
        .from('invoices')
        .insert([invoiceData]);

      if (error) throw error;

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Upload Invoice</h1>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Purchase Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.vendor_name}
                  onChange={(e) => handleInputChange('vendor_name', e.target.value)}
                  placeholder="e.g., Best Buy, Amazon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.invoice_number}
                  onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                  placeholder="Receipt/Invoice #"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.purchase_date}
                  onChange={(e) => handleInputChange('purchase_date', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <div className="flex">
                  <select
                    className="rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm"
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.product_name}
                  onChange={(e) => handleInputChange('product_name', e.target.value)}
                  placeholder="e.g., MacBook Pro, Samsung TV"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="input-field"
                  value={formData.product_category}
                  onChange={(e) => handleInputChange('product_category', e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Warranty Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warranty Period (Months)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  className="input-field"
                  value={formData.warranty_period_months}
                  onChange={(e) => handleInputChange('warranty_period_months', e.target.value)}
                  placeholder="12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warranty Start Date
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.warranty_start_date}
                  onChange={(e) => handleInputChange('warranty_start_date', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warranty End Date
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.warranty_end_date}
                  onChange={(e) => handleInputChange('warranty_end_date', e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.serial_number}
                onChange={(e) => handleInputChange('serial_number', e.target.value)}
                placeholder="Product serial number (optional)"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                rows={3}
                className="input-field"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional notes about this purchase or warranty..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="btn btn-primary flex items-center space-x-2"
            >
              <UploadIcon className="h-4 w-4" />
              <span>{uploading ? 'Saving...' : 'Save Invoice'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;