import { useState, useEffect } from 'react'
import { InvoiceService } from '../lib/invoiceService'

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadInvoices = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await InvoiceService.list('-created_at')
      setInvoices(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createInvoice = async (invoiceData) => {
    try {
      const newInvoice = await InvoiceService.create(invoiceData)
      setInvoices(prev => [newInvoice, ...prev])
      return newInvoice
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateInvoice = async (id, updates) => {
    try {
      const updatedInvoice = await InvoiceService.update(id, updates)
      setInvoices(prev => prev.map(inv => 
        inv.id === id ? updatedInvoice : inv
      ))
      return updatedInvoice
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteInvoice = async (id) => {
    try {
      await InvoiceService.delete(id)
      setInvoices(prev => prev.filter(inv => inv.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  return {
    invoices,
    loading,
    error,
    loadInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice
  }
}