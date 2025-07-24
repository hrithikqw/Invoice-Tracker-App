import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { 
  Plus, 
  FileText, 
  Shield, 
  AlertTriangle,
  Calendar,
  DollarSign 
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, expiring: 0, active: 0 });

  useEffect(() => {
    if (user) {
      loadInvoices();
    }
  }, [user]);

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate warranty status for each invoice
      const processedInvoices = data.map(invoice => {
        if (!invoice.warranty_end_date) {
          return { ...invoice, warranty_status: 'no_warranty' };
        }

        const daysRemaining = differenceInDays(new Date(invoice.warranty_end_date), new Date());
        let status = 'expired';
        if (daysRemaining > 30) status = 'active';
        else if (daysRemaining > 0) status = 'expiring_soon';

        return { ...invoice, warranty_status: status };
      });

      setInvoices(processedInvoices);

      // Calculate stats
      const total = processedInvoices.length;
      const expiring = processedInvoices.filter(inv => inv.warranty_status === 'expiring_soon').length;
      const active = processedInvoices.filter(inv => inv.warranty_status === 'active').length;
      
      setStats({ total, expiring, active });
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/upload"
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Invoice</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Invoices"
          value={stats.total}
          icon={FileText}
          color="bg-blue-500"
        />
        <StatsCard
          title="Expiring Soon"
          value={stats.expiring}
          icon={AlertTriangle}
          color="bg-yellow-500"
        />
        <StatsCard
          title="Active Warranties"
          value={stats.active}
          icon={Shield}
          color="bg-green-500"
        />
      </div>

      {/* Invoices List */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
        </div>
        <div className="p-6">
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by uploading your first invoice.</p>
              <div className="mt-6">
                <Link to="/upload" className="btn btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Invoice
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {invoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="card p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const InvoiceCard = ({ invoice }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    expiring_soon: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800',
    no_warranty: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">{invoice.product_name}</h3>
          <p className="text-sm text-gray-600">{invoice.vendor_name}</p>
          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(invoice.purchase_date), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {invoice.currency} {invoice.amount}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className={`badge ${statusColors[invoice.warranty_status]}`}>
            {invoice.warranty_status.replace('_', ' ')}
          </span>
          {invoice.warranty_end_date && (
            <p className="text-xs text-gray-500 mt-1">
              Expires: {format(new Date(invoice.warranty_end_date), 'MMM d, yyyy')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;