import { supabase } from './supabase.js'
import { CATEGORIES as DEFAULT_CATEGORIES } from '../data/products.js'

// ─────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// ─────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true })
  if (error) throw error
  return data
}

export async function getProductsByCategory(category) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('id', { ascending: true })
  if (error) throw error
  return data
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .not('badge', 'is', null)
    .order('id', { ascending: true })
    .limit(6)
  if (error) throw error
  return data
}

export async function searchProducts(query) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
  if (error) throw error
  return data
}

export async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

// ─────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────

function generateOrderCode() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `HC-${timestamp}${random}`
}

export async function createOrder(orderData) {
  const order = {
    ...orderData,
    order_code: generateOrderCode(),
    status: 'baru',
  }
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
  if (error) throw error
  return data[0]
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

// ─────────────────────────────────────────
// WHATSAPP
// ─────────────────────────────────────────

export function buildWhatsAppMessage(order) {
  const fmt = n => 'Rp ' + Math.round(n || 0).toLocaleString('id-ID')
  const itemsList = order.items
    .map(i => `  - ${i.name}: ${i.qty} seri x ${i.series_qty} pcs = ${i.pcs} pcs @ ${fmt(i.price)} = ${fmt(i.price * i.pcs)}`)
    .join('\n')

  return encodeURIComponent(
    `Halo Hijabers Collective! 🌿\n\n` +
    `Saya ingin order grosir:\n\n` +
    `*Kode Order:* ${order.order_code}\n` +
    `*Nama:* ${order.customer_name}\n` +
    `*HP:* ${order.customer_phone}\n` +
    `*Alamat:* ${order.customer_address}, ${order.customer_city}, ${order.customer_province}\n\n` +
    `*Produk (semua warna per seri):*\n${itemsList}\n\n` +
    `*Harga:* Tier ${order.tier || 1}\n` +
    `*Total pcs:* ${order.total_pcs || ''}\n` +
    `*Est. berat:* ${order.est_weight_kg || ''} kg\n` +
    `*TOTAL (belum ongkir): ${fmt(order.total)}*\n\n` +
    (order.notes ? `*Catatan:* ${order.notes}\n\n` : '') +
    `Mohon konfirmasi ongkir & ketersediaan. Terima kasih! 🙏`
  )
}

export const WA_NUMBER = '6208561010367'


// ─────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────

// Daftar nama kategori (urut). Fallback ke daftar bawaan bila tabel belum ada.
export async function getCategories() {
  try {
    const { data, error } = await supabase.from('categories').select('name').order('sort_order').order('id')
    if (error || !data || data.length === 0) return DEFAULT_CATEGORIES
    return data.map(c => c.name)
  } catch { return DEFAULT_CATEGORIES }
}

export async function addCategory(name) {
  const { data: last } = await supabase.from('categories').select('sort_order').order('sort_order', { ascending: false }).limit(1)
  const next = (last?.[0]?.sort_order || 0) + 1
  const { error } = await supabase.from('categories').insert([{ name: name.trim(), sort_order: next }])
  if (error) throw error
}

export async function renameCategory(oldName, newName) {
  const n = newName.trim()
  const { error } = await supabase.from('categories').update({ name: n }).eq('name', oldName)
  if (error) throw error
  const { error: e2 } = await supabase.from('products').update({ category: n }).eq('category', oldName)
  if (e2) throw e2
}

// Hanya boleh hapus kategori yang tidak punya produk
export async function deleteCategory(name) {
  const { count, error: e1 } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('category', name)
  if (e1) throw e1
  if (count > 0) throw new Error(`Masih ada ${count} produk di kategori ini. Pindahkan produknya dulu.`)
  const { error } = await supabase.from('categories').delete().eq('name', name)
  if (error) throw error
}
