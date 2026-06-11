import React, { useState, useEffect } from 'react'
import { getAllOrders, updateOrderStatus, getAllProducts, createProduct, updateProduct, deleteProduct } from '../lib/api.js'
import { CATEGORIES } from '../data/products.js'

const G = "#C1983C", D = "#2A1F0E", C = "#FDFBF7", LB = "#F7F2E8"
const serif = "'Cormorant Garamond',serif"
const sans = "'Didact Gothic',sans-serif"

const ADMIN_EMAIL = 'admin@hijabers.id'
const ADMIN_PASSWORD = 'hijabers2026'

const STATUS = {
  baru: { bg:'#FEF3C7', color:'#92400E', label:'Baru' },
  diproses: { bg:'#DBEAFE', color:'#1E40AF', label:'Diproses' },
  dikirim: { bg:'#D1FAE5', color:'#065F46', label:'Dikirim' },
  selesai: { bg:'#F3F4F6', color:'#374151', label:'Selesai' },
}

const ZONES_LABEL = {
  zona1:'Jawa & Bali', zona2:'Sumatera/Kal/Sul', zona3:'NTB/NTT/Maluku', zona4:'Papua'
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [])
  return (
    <div style={{ position:'fixed', top:24, right:24, zIndex:9999, background: type==='error'?'#991B1B':D, color:C, padding:'12px 20px', borderRadius:8, fontSize:12, fontFamily:sans, boxShadow:'0 8px 32px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', gap:8 }}>
      {type==='error'?'❌':'✅'} {msg}
    </div>
  )
}

function StatCard({ icon, label, value, sub, highlight }) {
  return (
    <div style={{ background:C, borderRadius:8, padding:'20px', border:`1px solid ${highlight?'rgba(193,152,60,0.35)':'rgba(193,152,60,0.12)'}`, boxShadow: highlight?'0 4px 20px rgba(193,152,60,0.12)':'0 2px 8px rgba(42,31,14,0.04)' }}>
      <div style={{ fontSize:28, marginBottom:10 }}>{icon}</div>
      <div style={{ fontSize:24, fontWeight:600, fontFamily:serif, color: highlight?G:D, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:11, fontWeight:700, color:D, marginBottom:2 }}>{label}</div>
      <div style={{ fontSize:10, color:'#9A8060' }}>{sub}</div>
    </div>
  )
}

// ── LOGIN ──
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin() {
    setLoading(true)
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        onLogin()
      } else {
        setError('Email atau password salah!')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#FDFBF7 0%,#F5EDD8 55%,#EDE0C4 100%)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:sans }}>
      <div style={{ background:C, borderRadius:8, padding:'48px 40px', width:'100%', maxWidth:400, boxShadow:'0 24px 80px rgba(42,31,14,0.1)', border:'1px solid rgba(193,152,60,0.15)' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <img src="/logo.png" alt="h" style={{ width:56, height:56, objectFit:'contain', marginBottom:16 }} />
          <div style={{ fontSize:18, fontWeight:700, letterSpacing:'0.22em', fontFamily:serif, color:D }}>HIJABERS</div>
          <div style={{ fontSize:8, letterSpacing:'0.45em', color:G, textTransform:'uppercase', marginTop:4 }}>ADMIN DASHBOARD</div>
        </div>

        <div style={{ marginBottom:16 }}>
          <label className="form-label">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email"
            className="form-input" placeholder="admin@hijabers.id"
            onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
        </div>

        <div style={{ marginBottom:24 }}>
          <label className="form-label">Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password"
            className="form-input" placeholder="••••••••"
            onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
        </div>

        {error && <div style={{ background:'#FEE2E2', color:'#991B1B', padding:'10px 16px', borderRadius:4, fontSize:12, marginBottom:16 }}>{error}</div>}

        <button onClick={handleLogin} disabled={loading}
          style={{ width:'100%', padding:'14px', background:`linear-gradient(135deg,${G},#D4AA50,${G})`, color:C, border:'none', borderRadius:4, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans, boxShadow:'0 6px 20px rgba(193,152,60,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          {loading ? <><div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid white', borderRadius:'50%', animation:'spin 1s linear infinite' }} />Masuk...</> : 'Masuk'}
        </button>
      </div>
    </div>
  )
}

// ── ORDERS TAB ──
function OrdersTab({ orders, onStatusChange }) {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {[['all','Semua'],['baru','Baru'],['diproses','Diproses'],['dikirim','Dikirim'],['selesai','Selesai']].map(([val,lbl]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{ padding:'6px 16px', borderRadius:20, border:`1px solid`, borderColor: filter===val ? D : 'rgba(193,152,60,0.2)', background: filter===val ? D : 'transparent', color: filter===val ? C : D, fontSize:11, cursor:'pointer', fontFamily:sans }}>
            {lbl} {val==='all'?`(${orders.length})`:val==='baru'?`(${orders.filter(o=>o.status==='baru').length})`:''}
          </button>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(42,31,14,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:C, borderRadius:12, padding:'32px', width:'100%', maxWidth:480, boxShadow:'0 24px 80px rgba(0,0,0,0.2)', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
              <div>
                <div style={{ fontSize:10, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:4 }}>Detail Order</div>
                <h2 style={{ fontSize:20, fontFamily:serif, color:D }}>{selected.order_code}</h2>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#9A8060' }}>✕</button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
              {[
                ['Customer', selected.customer_name],
                ['HP/WA', selected.customer_phone],
                ['Kota', selected.customer_city],
                ['Provinsi', selected.customer_province],
                ['Zona', ZONES_LABEL[selected.zone]||selected.zone],
                ['Total', `Rp ${(selected.total||0).toLocaleString('id-ID')}`],
              ].map(([lbl,val]) => (
                <div key={lbl} style={{ background:LB, borderRadius:6, padding:'10px 14px' }}>
                  <div style={{ fontSize:9, color:'#9A8060', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:3 }}>{lbl}</div>
                  <div style={{ fontSize:13, color:D, fontWeight:600 }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Full address */}
            <div style={{ background:LB, borderRadius:6, padding:'10px 14px', marginBottom:16 }}>
              <div style={{ fontSize:9, color:'#9A8060', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:3 }}>Alamat</div>
              <div style={{ fontSize:12, color:D }}>{selected.customer_address}</div>
            </div>

            {/* Items */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:9, color:'#9A8060', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:10 }}>Produk Dipesan</div>
              {(selected.items||[]).map((item,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(193,152,60,0.08)' }}>
                  <div>
                    <div style={{ fontSize:12, color:D, fontWeight:500 }}>{item.name}</div>
                    <div style={{ fontSize:10, color:'#9A8060' }}>{item.color} · {item.size} · x{item.qty}</div>
                  </div>
                  <div style={{ fontSize:12, color:D, fontWeight:600 }}>Rp {((item.price||0)*item.qty).toLocaleString('id-ID')}</div>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0 4px', fontSize:12, color:'#9A8060' }}>
                <span>Ongkir</span><span>Rp {(selected.shipping_cost||0).toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0 0', fontSize:14, color:D, fontWeight:700, fontFamily:serif, borderTop:'1px solid rgba(193,152,60,0.1)' }}>
                <span>Total</span><span style={{ color:G }}>Rp {(selected.total||0).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {selected.notes && (
              <div style={{ background:'#FFFBEB', border:'1px solid #FCD34D', borderRadius:6, padding:'10px 14px', marginBottom:16, fontSize:12, color:'#92400E' }}>
                📝 Catatan: {selected.notes}
              </div>
            )}

            {/* Status update */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:9, color:'#9A8060', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:8 }}>Update Status</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {Object.entries(STATUS).map(([key,val]) => (
                  <button key={key} onClick={() => { onStatusChange(selected.id, key); setSelected({...selected, status:key}) }}
                    style={{ padding:'6px 14px', borderRadius:20, border: selected.status===key?`2px solid ${G}`:'1px solid rgba(193,152,60,0.2)', background: selected.status===key?'rgba(193,152,60,0.1)':'transparent', color:D, fontSize:11, cursor:'pointer', fontFamily:sans }}>
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            <a href={`https://wa.me/${selected.customer_phone?.replace(/^0/,'62')}?text=Halo%20${encodeURIComponent(selected.customer_name)}%2C%20update%20pesanan%20${selected.order_code}%20Anda%20sekarang%20*${STATUS[selected.status]?.label}*.%20Terima%20kasih%20sudah%20berbelanja%20di%20Hijabers%20Collective!%20🌿`}
              target="_blank" rel="noreferrer"
              style={{ display:'block', background:'#25D366', color:'#fff', padding:'12px', borderRadius:6, textAlign:'center', fontSize:12, letterSpacing:'0.15em', textTransform:'uppercase', textDecoration:'none', fontFamily:sans }}>
              📱 Hubungi via WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background:C, borderRadius:8, border:'1px solid rgba(193,152,60,0.12)', overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:LB }}>
                {['Order ID','Customer','Zona','Total','Status','Tanggal','Aksi'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9A8060', fontWeight:400, whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:'48px', textAlign:'center', color:'#9A8060', fontSize:13, fontStyle:'italic' }}>Belum ada order</td></tr>
              ) : filtered.map(order => (
                <tr key={order.id} style={{ borderBottom:'1px solid rgba(193,152,60,0.07)', transition:'background 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#FDFAF4'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'12px 16px', fontSize:12, color:G, fontWeight:700 }}>{order.order_code}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ fontSize:12, color:D, fontWeight:600 }}>{order.customer_name}</div>
                    <div style={{ fontSize:10, color:'#9A8060' }}>{order.customer_phone}</div>
                  </td>
                  <td style={{ padding:'12px 16px', fontSize:11, color:'#7A6040' }}>{ZONES_LABEL[order.zone]||order.zone}</td>
                  <td style={{ padding:'12px 16px', fontSize:12, color:D, fontWeight:600 }}>Rp {(order.total||0).toLocaleString('id-ID')}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <select value={order.status||'baru'} onChange={e=>onStatusChange(order.id,e.target.value)}
                      style={{ background:STATUS[order.status||'baru']?.bg, color:STATUS[order.status||'baru']?.color, border:'none', padding:'4px 8px', borderRadius:20, fontSize:10, cursor:'pointer', fontFamily:sans }}>
                      {Object.entries(STATUS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:'12px 16px', fontSize:11, color:'#9A8060', whiteSpace:'nowrap' }}>
                    {new Date(order.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    <button onClick={() => setSelected(order)} style={{ fontSize:10, color:G, background:'none', border:'none', cursor:'pointer', borderBottom:`1px solid ${G}`, fontFamily:sans }}>Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── PRODUCTS TAB ──
function ProductsTab({ products, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ name:'', category:'Wide Pants', price:'', stock:'', weight:'', description:'', badge:'' })

  function openAdd() { setEditItem(null); setForm({ name:'', category:'Wide Pants', price:'', stock:'', weight:'', description:'', badge:'' }); setShowForm(true) }
  function openEdit(p) { setEditItem(p); setForm({ name:p.name, category:p.category, price:String(p.price||''), stock:String(p.stock||''), weight:String(p.weight||''), description:p.description||'', badge:p.badge||'' }); setShowForm(true) }

  function handleSave() {
    if (!form.name || !form.price || !form.stock) return
    const data = { ...form, price:Number(form.price), stock:Number(form.stock), weight:Number(form.weight)||300, slug:form.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''), badge:form.badge||null }
    if (editItem) { onEdit(editItem.id, data) } else { onAdd(data) }
    setShowForm(false)
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:20 }}>
        <button onClick={openAdd}
          style={{ padding:'12px 24px', background:`linear-gradient(135deg,${G},#D4AA50,${G})`, color:C, border:'none', borderRadius:4, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans, boxShadow:'0 4px 16px rgba(193,152,60,0.3)' }}>
          + Tambah Produk
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(42,31,14,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:C, borderRadius:12, padding:'32px', width:'100%', maxWidth:480, boxShadow:'0 24px 80px rgba(0,0,0,0.2)', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
              <h2 style={{ fontSize:20, fontFamily:serif, color:D }}>{editItem?'Edit Produk':'Tambah Produk'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#9A8060' }}>✕</button>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { label:'Nama Produk *', key:'name', placeholder:'Linen Wide Pants' },
                { label:'Harga (Rp) *', key:'price', placeholder:'189000', type:'number' },
                { label:'Stok *', key:'stock', placeholder:'20', type:'number' },
                { label:'Berat (gram)', key:'weight', placeholder:'300', type:'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="form-label">{f.label}</label>
                  <input type={f.type||'text'} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                    className="form-input" placeholder={f.placeholder} />
                </div>
              ))}

              <div>
                <label className="form-label">Kategori</label>
                <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} className="form-input" style={{ cursor:'pointer' }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Badge (opsional)</label>
                <select value={form.badge} onChange={e=>setForm(p=>({...p,badge:e.target.value}))} className="form-input" style={{ cursor:'pointer' }}>
                  <option value="">Tidak ada</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>

              <div>
                <label className="form-label">Deskripsi</label>
                <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}
                  className="form-input" rows={3} placeholder="Deskripsi produk..." style={{ resize:'vertical' }} />
              </div>
            </div>

            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              <button onClick={() => setShowForm(false)} style={{ flex:1, padding:'12px', border:'1px solid rgba(193,152,60,0.3)', borderRadius:4, background:'transparent', color:D, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans }}>Batal</button>
              <button onClick={handleSave} style={{ flex:2, padding:'12px', background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, border:'none', borderRadius:4, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans }}>
                {editItem?'Update':'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
        {products.length === 0 ? (
          <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'64px', color:'#9A8060' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📦</div>
            <p style={{ fontFamily:serif, fontStyle:'italic' }}>Belum ada produk. Tambah produk pertama kamu!</p>
          </div>
        ) : products.map(p => (
          <div key={p.id} style={{ background:C, borderRadius:8, border:'1px solid rgba(193,152,60,0.12)', overflow:'hidden', transition:'box-shadow 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow='0 8px 32px rgba(193,152,60,0.1)'}
            onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
            <div style={{ height:120, background:p.bg||'linear-gradient(145deg,#F0E4C8,#E8D5A8)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
              <span style={{ fontSize:40 }}>👗</span>
              {p.badge && <span style={{ position:'absolute', top:8, left:8, background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, fontSize:8, padding:'2px 8px', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:sans }}>{p.badge}</span>}
              <span style={{ position:'absolute', top:8, right:8, background:'rgba(253,251,247,0.9)', color:D, fontSize:9, padding:'2px 8px', borderRadius:20, fontFamily:sans }}>{p.category}</span>
            </div>
            <div style={{ padding:'14px' }}>
              <div style={{ fontSize:14, fontWeight:500, fontFamily:serif, color:D, marginBottom:2 }}>{p.name}</div>
              <div style={{ fontSize:15, fontWeight:600, color:D, marginBottom:6 }}>Rp {(p.price||0).toLocaleString('id-ID')}</div>
              <div style={{ display:'flex', gap:12, fontSize:10, color:'#9A8060', marginBottom:12 }}>
                <span>📦 Stok: {p.stock||0}</span>
                <span>⚖️ {p.weight||300}g</span>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => openEdit(p)} style={{ flex:1, padding:'7px', border:'1px solid rgba(193,152,60,0.3)', borderRadius:4, background:'transparent', color:D, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans }}>✏️ Edit</button>
                <button onClick={() => onDelete(p.id)} style={{ padding:'7px 10px', border:'1px solid #FCA5A5', borderRadius:4, background:'transparent', color:'#DC2626', fontSize:10, cursor:'pointer', fontFamily:sans }}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── MAIN ADMIN ──
export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type='success') => setToast({ msg, type })

  useEffect(() => { if (loggedIn) loadData() }, [loggedIn])

  async function loadData() {
    setLoading(true)
    try {
      const [o, p] = await Promise.all([getAllOrders(), getAllProducts()])
      setOrders(o || [])
      setProducts(p || [])
    } catch { showToast('Gagal memuat data', 'error') }
    finally { setLoading(false) }
  }

  async function handleStatusChange(id, status) {
    try {
      await updateOrderStatus(id, status)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
      showToast(`Status diupdate ke ${STATUS[status]?.label}`)
    } catch { showToast('Gagal update status', 'error') }
  }

  async function handleAddProduct(data) {
    try {
      const p = await createProduct(data)
      setProducts(prev => [...prev, p])
      showToast('Produk ditambahkan!')
    } catch { showToast('Gagal tambah produk', 'error') }
  }

  async function handleEditProduct(id, data) {
    try {
      const p = await updateProduct(id, data)
      setProducts(prev => prev.map(x => x.id === id ? p : x))
      showToast('Produk diupdate!')
    } catch { showToast('Gagal update produk', 'error') }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm('Hapus produk ini?')) return
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      showToast('Produk dihapus!', 'error')
    } catch { showToast('Gagal hapus produk', 'error') }
  }

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />

  const tabs = [
    { id:'dashboard', icon:'📊', label:'Dashboard' },
    { id:'orders', icon:'📦', label:'Orders' },
    { id:'products', icon:'🧥', label:'Produk' },
  ]

  const newOrders = orders.filter(o => o.status === 'baru').length
  const totalRevenue = orders.filter(o => o.status === 'selesai').reduce((s, o) => s + (o.total||0), 0)

  return (
    <div style={{ minHeight:'100vh', background:LB, fontFamily:sans, display:'flex' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* SIDEBAR */}
      <div style={{ width:220, background:D, position:'fixed', top:0, left:0, height:'100vh', display:'flex', flexDirection:'column', zIndex:50 }}>
        <style>{`@media(max-width:768px){.admin-sidebar{display:none !important} .admin-main{margin-left:0 !important} .admin-mobile-tabs{display:flex !important}}`}</style>
        <div className="admin-sidebar" style={{ padding:'28px 24px 20px', borderBottom:'1px solid rgba(193,152,60,0.15)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src="/logo.png" alt="h" style={{ width:32, height:32, objectFit:'contain' }} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, letterSpacing:'0.2em', fontFamily:serif, color:C, lineHeight:1 }}>HIJABERS</div>
              <div style={{ fontSize:6, letterSpacing:'0.4em', color:G, textTransform:'uppercase', marginTop:3 }}>ADMIN</div>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'16px 12px' }} className="admin-sidebar">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderRadius:6, border:'none', cursor:'pointer', marginBottom:4, background: activeTab===tab.id ? 'rgba(193,152,60,0.15)' : 'transparent', color: activeTab===tab.id ? G : 'rgba(253,251,247,0.55)', fontSize:12, fontFamily:sans, textAlign:'left', transition:'all 0.2s' }}>
              {tab.icon} {tab.label}
              {tab.id==='orders' && newOrders > 0 && <span style={{ marginLeft:'auto', background:G, color:C, borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700 }}>{newOrders}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding:'16px 12px', borderTop:'1px solid rgba(193,152,60,0.1)' }} className="admin-sidebar">
          <button onClick={() => setLoggedIn(false)} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderRadius:6, border:'none', cursor:'pointer', background:'transparent', color:'rgba(253,251,247,0.4)', fontSize:12, fontFamily:sans }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="admin-main" style={{ marginLeft:220, flex:1, padding:'32px' }}>
        {/* Mobile tabs */}
        <div className="admin-mobile-tabs" style={{ display:'none', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:8 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding:'8px 16px', borderRadius:20, border:'none', cursor:'pointer', background: activeTab===tab.id ? D : '#E8DFD0', color: activeTab===tab.id ? C : D, fontSize:11, fontFamily:sans, whiteSpace:'nowrap', flexShrink:0 }}>
              {tab.icon} {tab.label}
            </button>
          ))}
          <button onClick={() => setLoggedIn(false)} style={{ padding:'8px 16px', borderRadius:20, border:'1px solid #FCA5A5', cursor:'pointer', background:'transparent', color:'#DC2626', fontSize:11, fontFamily:sans, whiteSpace:'nowrap', flexShrink:0 }}>🚪 Logout</button>
        </div>

        {loading ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, flexDirection:'column', gap:16 }}>
            <div style={{ width:32, height:32, border:`3px solid rgba(193,152,60,0.2)`, borderTop:`3px solid ${G}`, borderRadius:'50%', animation:'spin 1s linear infinite' }} />
            <span style={{ fontSize:12, color:'#9A8060' }}>Memuat data...</span>
          </div>
        ) : (
          <>
            {/* DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div>
                <div style={{ marginBottom:28 }}>
                  <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:6 }}>Overview</div>
                  <h1 style={{ fontSize:28, fontWeight:400, fontFamily:serif, color:D }}>Dashboard</h1>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:32 }}>
                  <StatCard icon="📦" label="Total Order" value={orders.length} sub="Semua waktu" />
                  <StatCard icon="🔔" label="Order Baru" value={newOrders} sub="Perlu diproses" highlight={newOrders>0} />
                  <StatCard icon="🧥" label="Produk" value={products.length} sub="Terdaftar" />
                  <StatCard icon="💰" label="Revenue" value={`Rp ${(totalRevenue/1000).toFixed(0)}k`} sub="Order selesai" />
                </div>
                {/* Recent orders */}
                <div style={{ background:C, borderRadius:8, border:'1px solid rgba(193,152,60,0.12)', overflow:'hidden' }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(193,152,60,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <h2 style={{ fontSize:16, fontWeight:400, fontFamily:serif, color:D }}>Order Terbaru</h2>
                    <button onClick={() => setActiveTab('orders')} style={{ fontSize:10, color:G, background:'none', border:'none', cursor:'pointer', borderBottom:`1px solid ${G}`, fontFamily:sans }}>Lihat Semua →</button>
                  </div>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr style={{ background:LB }}>
                          {['Order ID','Customer','Total','Status'].map(h => (
                            <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9A8060', fontWeight:400 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length === 0 ? (
                          <tr><td colSpan={4} style={{ padding:'32px', textAlign:'center', color:'#9A8060', fontSize:12, fontStyle:'italic' }}>Belum ada order</td></tr>
                        ) : orders.slice(0,5).map(o => (
                          <tr key={o.id} style={{ borderBottom:'1px solid rgba(193,152,60,0.07)' }}>
                            <td style={{ padding:'12px 16px', fontSize:12, color:G, fontWeight:700 }}>{o.order_code}</td>
                            <td style={{ padding:'12px 16px', fontSize:12, color:D }}>{o.customer_name}</td>
                            <td style={{ padding:'12px 16px', fontSize:12, color:D, fontWeight:600 }}>Rp {(o.total||0).toLocaleString('id-ID')}</td>
                            <td style={{ padding:'12px 16px' }}>
                              <span style={{ background:STATUS[o.status||'baru']?.bg, color:STATUS[o.status||'baru']?.color, padding:'3px 10px', borderRadius:20, fontSize:10 }}>
                                {STATUS[o.status||'baru']?.label}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div style={{ marginBottom:28 }}>
                  <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:6 }}>Management</div>
                  <h1 style={{ fontSize:28, fontWeight:400, fontFamily:serif, color:D }}>Daftar Order</h1>
                </div>
                <OrdersTab orders={orders} onStatusChange={handleStatusChange} />
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div style={{ marginBottom:28 }}>
                  <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:6 }}>Management</div>
                  <h1 style={{ fontSize:28, fontWeight:400, fontFamily:serif, color:D }}>Kelola Produk</h1>
                </div>
                <ProductsTab products={products} onAdd={handleAddProduct} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
