import { supabase, INVOICE_BUCKET } from './supabaseClient'

export class InvoiceService {
  static async create(invoiceData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('invoices')
      .insert([{ ...invoiceData, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async list(orderBy = '-created_at', limit = null) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    let query = supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)

    // Handle ordering
    const isDesc = orderBy.startsWith('-')
    const column = isDesc ? orderBy.substring(1) : orderBy
    query = query.order(column, { ascending: !isDesc })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async update(id, updates) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async delete(id) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
    return true
  }

  static async uploadFile(file) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from(INVOICE_BUCKET)
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(INVOICE_BUCKET)
      .getPublicUrl(fileName)

    return { file_url: publicUrl, path: fileName }
  }
}