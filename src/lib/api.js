import { supabase } from './supabase.js'

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
  const itemsList = order.items
    .map(i => `  - ${i.name} (${i.color}, ${i.size}) x${i.qty} = Rp ${(i.price * i.qty).toLocaleString('id-ID')}`)
    .join('\n')

  return encodeURIComponent(
    `Halo Hijabers Collective! 🌿\n\n` +
    `Saya ingin konfirmasi pesanan berikut:\n\n` +
    `*Kode Order:* ${order.order_code}\n` +
    `*Nama:* ${order.customer_name}\n` +
    `*HP:* ${order.customer_phone}\n` +
    `*Alamat:* ${order.customer_address}, ${order.customer_city}, ${order.customer_province}\n\n` +
    `*Produk:*\n${itemsList}\n\n` +
    `*Subtotal:* Rp ${order.subtotal.toLocaleString('id-ID')}\n` +
    `*Ongkir:* Rp ${order.shipping_cost.toLocaleString('id-ID')}\n` +
    `*TOTAL: Rp ${order.total.toLocaleString('id-ID')}*\n\n` +
    `*Pembayaran:*\nTransfer BCA: 7560515655\na/n Weta Novinie\n\n` +
    `Mohon konfirmasi ketersediaan produk. Terima kasih! 🙏`
  )
}

export const WA_NUMBER = '6208561010367'
