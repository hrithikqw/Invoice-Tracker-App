import { differenceInDays, addMonths, format } from 'date-fns'

export const calculateWarrantyStatus = (warrantyEndDate) => {
  if (!warrantyEndDate) return 'no_warranty'
  
  const daysRemaining = differenceInDays(new Date(warrantyEndDate), new Date())
  
  if (daysRemaining < 0) return 'expired'
  if (daysRemaining <= 30) return 'expiring_soon'
  return 'active'
}

export const calculateWarrantyEndDate = (startDate, months) => {
  if (!startDate || !months) return null
  return addMonths(new Date(startDate), parseInt(months))
}

export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  return format(new Date(date), formatStr)
}

export const getDaysRemaining = (endDate) => {
  return differenceInDays(new Date(endDate), new Date())
}