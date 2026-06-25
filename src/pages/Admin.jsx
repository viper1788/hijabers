import React, { useState, useEffect, useRef } from 'react'
import { getAllOrders, updateOrderStatus, getAllProducts, createProduct, updateProduct, deleteProduct, signIn, signOut, getSession } from '../lib/api.js'
import { supabase } from '../lib/supabase.js'
import { CATEGORIES } from '../data/products.js'

const G = "#C1983C", D = "#2A1F0E", C = "#FDFBF7", LB = "#F7F2E8"
const serif = "'Cormorant Garamond',serif"
const sans = "'Didact Gothic',sans-serif"

const STATUS = {
  baru: { bg:'#FEF3C7', color:'#92400E', label:'Baru' },
  diproses: { bg:'#DBEAFE', color:'#1E40AF', label:'Diproses' },
  dikirim: { bg:'#D1FAE5', color:'#065F46', label:'Dikirim' },
  selesai: { bg:'#F3F4F6', color:'#374151', label:'Selesai' },
}

const ZONES_LABEL = {
  zona1:'Jawa & Bali', zona2:'Sumatera/Kal/Sul', zona3:'NTB/NTT/Maluku', zona4:'Papua'
}

const PRESET_COLORS = [
  { name:'Cream', hex:'#F5ECD7' },
  { name:'Sage Green', hex:'#A8B59C' },
  { name:'Dusty Rose', hex:'#E8C5C8' },
  { name:'Warm Brown', hex:'#C9A882' },
  { name:'Off White', hex:'#F0EDE8' },
  { name:'Classic Black', hex:'#2B2B2B' },
  { name:'Navy', hex:'#1B2A4A' },
  { name:'Mocha', hex:'#8B6B4A' },
]

// ── UPLOAD IMAGE TO SUPABASE STORAGE ──
async function uploadImage(file, folder = 'general') {
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { data, error } = await supabase.storage.from('products').upload(fileName, file, {
    cacheControl: '3600', upsert: false
  })
  if (error) throw error
  const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName)
  return urlData.publicUrl
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

  async function handleLogin() {
    if (!email || !password) { setError('Email dan password wajib diisi'); return }
    setLoading(true); setError('')
    try { await signIn(email, password); onLogin() }
    catch { setError('Email atau password salah!') }
    finally { setLoading(false) }
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
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="form-input" placeholder="Masukkan email" onKeyDown={e=>e.key==='Enter'&&handleLogin()} autoComplete="off" />
        </div>
        <div style={{ marginBottom:24 }}>
          <label className="form-label">Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="form-input" placeholder="Masukkan password" onKeyDown={e=>e.key==='Enter'&&handleLogin()} autoComplete="off" />
        </div>
        {error && <div style={{ background:'#FEE2E2', color:'#991B1B', padding:'10px 16px', borderRadius:4, fontSize:12, marginBottom:16 }}>{error}</div>}
        <button onClick={handleLogin} disabled={loading} style={{ width:'100%', padding:'14px', background:`linear-gradient(135deg,${G},#D4AA50,${G})`, color:C, border:'none', borderRadius:4, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:loading?'not-allowed':'pointer', fontFamily:sans, boxShadow:'0 6px 20px rgba(193,152,60,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          {loading ? <><div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid white', borderRadius:'50%', animation:'spin 1s linear infinite' }} />Masuk...</> : 'Masuk'}
        </button>
      </div>
    </div>
  )
}

// ── PRODUCT FORM ──
function ProductForm({ editItem, onSave, onClose }) {
  const [form, setForm] = useState({
    name: editItem?.name || '',
    category: editItem?.category || 'Wide Pants',
    price: editItem?.price ? String(editItem.price) : '',
    stock: editItem?.stock ? String(editItem.stock) : '',
    weight: editItem?.weight ? String(editItem.weight) : '',
    description: editItem?.description || '',
    badge: editItem?.badge || '',
    sizes: editItem?.sizes ? (Array.isArray(editItem.sizes) ? editItem.sizes.join(', ') : '') : '',
  })

  const [images, setImages] = useState(editItem?.images || [])
  const [colorImages, setColorImages] = useState(editItem?.color_images || [])
  const [newColor, setNewColor] = useState({ name:'', hex:'#F5ECD7' })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const mainImgRef = useRef()
  const colorImgRefs = useRef({})

  // Upload main images
  async function handleMainImages(files) {
    setUploading(true)
    try {
      const urls = await Promise.all(Array.from(files).map(f => uploadImage(f, 'main')))
      setImages(prev => [...prev, ...urls])
    } catch { alert('Gagal upload foto') }
    finally { setUploading(false) }
  }

  // Upload color image
  async function handleColorImage(file, colorName) {
    setUploading(true)
    try {
      const url = await uploadImage(file, 'colors')
      setColorImages(prev => prev.map(c => c.name === colorName ? { ...c, image_url: url } : c))
    } catch { alert('Gagal upload foto warna') }
    finally { setUploading(false) }
  }

  // Add color
  function addColor() {
    if (!newColor.name.trim()) return
    if (colorImages.find(c => c.name === newColor.name)) return
    setColorImages(prev => [...prev, { name: newColor.name.trim(), hex: newColor.hex, image_url: null }])
    setNewColor({ name:'', hex:'#F5ECD7' })
  }

  // Remove color
  function removeColor(name) {
    setColorImages(prev => prev.filter(c => c.name !== name))
  }

  // Remove main image
  function removeImage(url) {
    setImages(prev => prev.filter(i => i !== url))
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.stock) { alert('Nama, harga, dan stok wajib diisi!'); return }
    setSaving(true)
    try {
      const sizesArray = form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : []
      const data = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        weight: Number(form.weight) || 300,
        description: form.description,
        badge: form.badge || null,
        slug: form.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''),
        sizes: sizesArray,
        colors: colorImages.map(c => c.name),
        images: images,
        color_images: colorImages,
        bg: 'linear-gradient(145deg,#F0E4C8,#E8D5A8)',
      }
      await onSave(data)
      onClose()
    } catch (e) { alert('Gagal simpan: ' + e.message) }
    finally { setSaving(false) }
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(42,31,14,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24, overflowY:'auto' }}>
      <div style={{ background:C, borderRadius:12, padding:'32px', width:'100%', maxWidth:560, boxShadow:'0 24px 80px rgba(0,0,0,0.2)', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
          <h2 style={{ fontSize:20, fontFamily:serif, color:D }}>{editItem?'Edit Produk':'Tambah Produk'}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#9A8060' }}>✕</button>
        </div>

        {/* Basic Info */}
        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:24 }}>
          <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:G, borderBottom:`1px solid rgba(193,152,60,0.15)`, paddingBottom:8 }}>Info Produk</div>

          <div>
            <label className="form-label">Nama Produk *</label>
            <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className="form-input" placeholder="Linen Wide Pants" />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label className="form-label">Harga (Rp) *</label>
              <input type="number" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} className="form-input" placeholder="189000" />
            </div>
            <div>
              <label className="form-label">Stok *</label>
              <input type="number" value={form.stock} onChange={e=>setForm(p=>({...p,stock:e.target.value}))} className="form-input" placeholder="20" />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label className="form-label">Berat (gram)</label>
              <input type="number" value={form.weight} onChange={e=>setForm(p=>({...p,weight:e.target.value}))} className="form-input" placeholder="300" />
            </div>
            <div>
              <label className="form-label">Kategori</label>
              <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} className="form-input" style={{ cursor:'pointer' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Ukuran (pisahkan dengan koma, kosongkan jika 1 ukuran)</label>
            <input value={form.sizes} onChange={e=>setForm(p=>({...p,sizes:e.target.value}))} className="form-input" placeholder="S, M, L, XL" />
          </div>

          <div>
            <label className="form-label">Badge</label>
            <select value={form.badge} onChange={e=>setForm(p=>({...p,badge:e.target.value}))} className="form-input" style={{ cursor:'pointer' }}>
              <option value="">Tidak ada</option>
              <option value="Best Seller">Best Seller</option>
              <option value="New">New</option>
              <option value="Sale">Sale</option>
            </select>
          </div>

          <div>
            <label className="form-label">Deskripsi</label>
            <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} className="form-input" rows={3} placeholder="Deskripsi produk..." style={{ resize:'vertical' }} />
          </div>
        </div>

        {/* Main Photos */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:G, borderBottom:`1px solid rgba(193,152,60,0.15)`, paddingBottom:8, marginBottom:14 }}>
            Foto Produk Utama
          </div>

          {/* Thumbnails */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
            {images.map((url, i) => (
              <div key={i} style={{ position:'relative', width:72, height:72 }}>
                <img src={url} alt="" style={{ width:72, height:72, objectFit:'cover', borderRadius:4, border:'1px solid rgba(193,152,60,0.2)' }} />
                <button onClick={() => removeImage(url)} style={{ position:'absolute', top:-6, right:-6, width:18, height:18, borderRadius:'50%', background:'#DC2626', color:'white', border:'none', cursor:'pointer', fontSize:10, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
              </div>
            ))}
            <div onClick={() => mainImgRef.current?.click()} style={{ width:72, height:72, border:'2px dashed rgba(193,152,60,0.3)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:24, color:'rgba(193,152,60,0.5)', transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=G}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(193,152,60,0.3)'}>
              {uploading ? '⏳' : '+'}
            </div>
          </div>
          <input ref={mainImgRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e=>handleMainImages(e.target.files)} />
          <p style={{ fontSize:10, color:'#9A8060' }}>Upload multiple foto — foto pertama akan jadi thumbnail utama</p>
        </div>

        {/* Color Variants */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:G, borderBottom:`1px solid rgba(193,152,60,0.15)`, paddingBottom:8, marginBottom:14 }}>
            Varian Warna
          </div>

          {/* Add color */}
          <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
            <input value={newColor.name} onChange={e=>setNewColor(p=>({...p,name:e.target.value}))} className="form-input" placeholder="Nama warna (e.g. Cream)" style={{ flex:1, minWidth:120 }}
              onKeyDown={e=>e.key==='Enter'&&addColor()} />
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <label style={{ fontSize:10, color:'#9A8060' }}>Hex:</label>
              <input type="color" value={newColor.hex} onChange={e=>setNewColor(p=>({...p,hex:e.target.value}))} style={{ width:36, height:36, border:'1px solid rgba(193,152,60,0.2)', borderRadius:4, cursor:'pointer', padding:2 }} />
            </div>
            <button onClick={addColor} style={{ padding:'8px 16px', background:D, color:C, border:'none', borderRadius:4, fontSize:11, cursor:'pointer', fontFamily:sans, whiteSpace:'nowrap' }}>+ Tambah</button>
          </div>

          {/* Preset colors */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
            {PRESET_COLORS.map(pc => (
              <button key={pc.name} onClick={() => setNewColor(pc)}
                style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', border:`1px solid rgba(193,152,60,0.2)`, borderRadius:20, background:'transparent', cursor:'pointer', fontSize:10, fontFamily:sans }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:pc.hex, border:'1px solid rgba(0,0,0,0.1)' }} />
                {pc.name}
              </button>
            ))}
          </div>

          {/* Color list */}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {colorImages.map(c => (
              <div key={c.name} style={{ display:'flex', alignItems:'center', gap:10, background:LB, borderRadius:4, padding:'10px 12px', border:'1px solid rgba(193,152,60,0.1)' }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:c.hex, border:'1px solid rgba(0,0,0,0.1)', flexShrink:0 }} />
                <span style={{ fontSize:12, color:D, flex:1 }}>{c.name}</span>

                {/* Color photo */}
                {c.image_url ? (
                  <div style={{ position:'relative' }}>
                    <img src={c.image_url} alt={c.name} style={{ width:48, height:48, objectFit:'cover', borderRadius:4 }} />
                    <button onClick={() => setColorImages(prev => prev.map(x => x.name===c.name ? {...x,image_url:null} : x))}
                      style={{ position:'absolute', top:-4, right:-4, width:14, height:14, borderRadius:'50%', background:'#DC2626', color:'white', border:'none', cursor:'pointer', fontSize:8, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                  </div>
                ) : (
                  <div onClick={() => colorImgRefs.current[c.name]?.click()}
                    style={{ width:48, height:48, border:'2px dashed rgba(193,152,60,0.3)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16, color:'rgba(193,152,60,0.5)' }}>
                    📷
                  </div>
                )}
                <input ref={el => colorImgRefs.current[c.name] = el} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>e.target.files[0]&&handleColorImage(e.target.files[0],c.name)} />

                <button onClick={() => removeColor(c.name)} style={{ background:'none', border:'none', cursor:'pointer', color:'#DC2626', fontSize:14, flexShrink:0 }}>🗑️</button>
              </div>
            ))}
            {colorImages.length === 0 && (
              <p style={{ fontSize:11, color:'#9A8060', fontStyle:'italic' }}>Belum ada varian warna. Tambah warna di atas.</p>
            )}
          </div>
        </div>

        {/* Save */}
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={onClose} style={{ flex:1, padding:'12px', border:'1px solid rgba(193,152,60,0.3)', borderRadius:4, background:'transparent', color:D, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans }}>Batal</button>
          <button onClick={handleSave} disabled={saving||uploading}
            style={{ flex:2, padding:'12px', background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, border:'none', borderRadius:4, fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', cursor:saving?'not-allowed':'pointer', fontFamily:sans, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {saving ? <><div style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid white', borderRadius:'50%', animation:'spin 1s linear infinite' }} />Menyimpan...</> : editItem?'Update Produk':'Simpan Produk'}
          </button>
        </div>
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
              {[['Customer',selected.customer_name],['HP/WA',selected.customer_phone],['Kota',selected.customer_city],['Provinsi',selected.customer_province],['Zona',ZONES_LABEL[selected.zone]||selected.zone],['Total',`Rp ${(selected.total||0).toLocaleString('id-ID')}`]].map(([lbl,val]) => (
                <div key={lbl} style={{ background:LB, borderRadius:6, padding:'10px 14px' }}>
                  <div style={{ fontSize:9, color:'#9A8060', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:3 }}>{lbl}</div>
                  <div style={{ fontSize:13, color:D, fontWeight:600 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ background:LB, borderRadius:6, padding:'10px 14px', marginBottom:16 }}>
              <div style={{ fontSize:9, color:'#9A8060', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:3 }}>Alamat</div>
              <div style={{ fontSize:12, color:D }}>{selected.customer_address}</div>
            </div>
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
            {selected.notes && <div style={{ background:'#FFFBEB', border:'1px solid #FCD34D', borderRadius:6, padding:'10px 14px', marginBottom:16, fontSize:12, color:'#92400E' }}>📝 {selected.notes}</div>}
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
            <a href={`https://wa.me/${selected.customer_phone?.replace(/^0/,'62')}?text=Halo%20${encodeURIComponent(selected.customer_name)}%2C%20update%20pesanan%20${selected.order_code}%20Anda%20sekarang%20*${STATUS[selected.status]?.label}*.%20Terima%20kasih!%20🌿`}
              target="_blank" rel="noreferrer" style={{ display:'block', background:'#25D366', color:'#fff', padding:'12px', borderRadius:6, textAlign:'center', fontSize:12, letterSpacing:'0.15em', textTransform:'uppercase', textDecoration:'none', fontFamily:sans }}>
              📱 Hubungi via WhatsApp
            </a>
          </div>
        </div>
      )}

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
                  <td style={{ padding:'12px 16px', fontSize:11, color:'#9A8060', whiteSpace:'nowrap' }}>{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
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

// ── MAIN ADMIN ──
export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)

  const showToast = (msg, type='success') => setToast({ msg, type })

  useEffect(() => {
    async function checkSession() {
      try { const s = await getSession(); if (s) setLoggedIn(true) } catch {}
      finally { setCheckingSession(false) }
    }
    checkSession()
  }, [])

  useEffect(() => { if (loggedIn) loadData() }, [loggedIn])

  async function loadData() {
    setLoading(true)
    try {
      const [o, p] = await Promise.all([getAllOrders(), getAllProducts()])
      setOrders(o || []); setProducts(p || [])
    } catch { showToast('Gagal memuat data', 'error') }
    finally { setLoading(false) }
  }

  async function handleLogout() {
    try { await signOut() } catch {}
    setLoggedIn(false); setOrders([]); setProducts([])
  }

  async function handleStatusChange(id, status) {
    try { await updateOrderStatus(id, status); setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)); showToast(`Status diupdate ke ${STATUS[status]?.label}`) }
    catch { showToast('Gagal update status', 'error') }
  }

  async function handleSaveProduct(data) {
    if (editItem) {
      const p = await updateProduct(editItem.id, data)
      setProducts(prev => prev.map(x => x.id === editItem.id ? p : x))
      showToast('Produk diupdate!')
    } else {
      const p = await createProduct(data)
      setProducts(prev => [...prev, p])
      showToast('Produk ditambahkan!')
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm('Hapus produk ini?')) return
    try { await deleteProduct(id); setProducts(prev => prev.filter(p => p.id !== id)); showToast('Produk dihapus!') }
    catch { showToast('Gagal hapus produk', 'error') }
  }

  if (checkingSession) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(160deg,#FDFBF7 0%,#F5EDD8 55%,#EDE0C4 100%)' }}>
      <div style={{ width:32, height:32, border:`3px solid rgba(193,152,60,0.2)`, borderTop:`3px solid ${G}`, borderRadius:'50%', animation:'spin 1s linear infinite' }} />
    </div>
  )

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />

  const tabs = [{ id:'dashboard', icon:'📊', label:'Dashboard' }, { id:'orders', icon:'📦', label:'Orders' }, { id:'products', icon:'🧥', label:'Produk' }]
  const newOrders = orders.filter(o => o.status === 'baru').length
  const totalRevenue = orders.filter(o => o.status === 'selesai').reduce((s, o) => s + (o.total||0), 0)

  return (
    <div style={{ minHeight:'100vh', background:LB, fontFamily:sans, display:'flex' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {showForm && (
        <ProductForm
          editItem={editItem}
          onSave={handleSaveProduct}
          onClose={() => { setShowForm(false); setEditItem(null) }}
        />
      )}

      {/* SIDEBAR */}
      <div className="admin-sidebar" style={{ width:220, background:D, position:'fixed', top:0, left:0, height:'100vh', display:'flex', flexDirection:'column', zIndex:50 }}>
        <style>{`@media(max-width:768px){.admin-sidebar{display:none !important} .admin-main{margin-left:0 !important} .admin-mobile-tabs{display:flex !important}}`}</style>
        <div style={{ padding:'28px 24px 20px', borderBottom:'1px solid rgba(193,152,60,0.15)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src="/logo.png" alt="h" style={{ width:32, height:32, objectFit:'contain' }} />
            <div>
              <div style={{ fontSize:13, fontWeight:700, letterSpacing:'0.2em', fontFamily:serif, color:C, lineHeight:1 }}>HIJABERS</div>
              <div style={{ fontSize:6, letterSpacing:'0.4em', color:G, textTransform:'uppercase', marginTop:3 }}>ADMIN</div>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:'16px 12px' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderRadius:6, border:'none', cursor:'pointer', marginBottom:4, background: activeTab===tab.id?'rgba(193,152,60,0.15)':'transparent', color: activeTab===tab.id?G:'rgba(253,251,247,0.55)', fontSize:12, fontFamily:sans, textAlign:'left', transition:'all 0.2s' }}>
              {tab.icon} {tab.label}
              {tab.id==='orders' && newOrders > 0 && <span style={{ marginLeft:'auto', background:G, color:C, borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700 }}>{newOrders}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding:'16px 12px', borderTop:'1px solid rgba(193,152,60,0.1)' }}>
          <button onClick={handleLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderRadius:6, border:'none', cursor:'pointer', background:'transparent', color:'rgba(253,251,247,0.4)', fontSize:12, fontFamily:sans }}>🚪 Logout</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="admin-main" style={{ marginLeft:220, flex:1, padding:'32px' }}>
        <div className="admin-mobile-tabs" style={{ display:'none', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:8 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding:'8px 16px', borderRadius:20, border:'none', cursor:'pointer', background: activeTab===tab.id?D:'#E8DFD0', color: activeTab===tab.id?C:D, fontSize:11, fontFamily:sans, whiteSpace:'nowrap', flexShrink:0 }}>
              {tab.icon} {tab.label}
            </button>
          ))}
          <button onClick={handleLogout} style={{ padding:'8px 16px', borderRadius:20, border:'1px solid #FCA5A5', cursor:'pointer', background:'transparent', color:'#DC2626', fontSize:11, fontFamily:sans, whiteSpace:'nowrap', flexShrink:0 }}>🚪 Logout</button>
        </div>

        {loading ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, flexDirection:'column', gap:16 }}>
            <div style={{ width:32, height:32, border:`3px solid rgba(193,152,60,0.2)`, borderTop:`3px solid ${G}`, borderRadius:'50%', animation:'spin 1s linear infinite' }} />
            <span style={{ fontSize:12, color:'#9A8060' }}>Memuat data...</span>
          </div>
        ) : (
          <>
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
                <div style={{ background:C, borderRadius:8, border:'1px solid rgba(193,152,60,0.12)', overflow:'hidden' }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(193,152,60,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <h2 style={{ fontSize:16, fontWeight:400, fontFamily:serif, color:D }}>Order Terbaru</h2>
                    <button onClick={() => setActiveTab('orders')} style={{ fontSize:10, color:G, background:'none', border:'none', cursor:'pointer', borderBottom:`1px solid ${G}`, fontFamily:sans }}>Lihat Semua →</button>
                  </div>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead><tr style={{ background:LB }}>{['Order ID','Customer','Total','Status'].map(h => <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9A8060', fontWeight:400 }}>{h}</th>)}</tr></thead>
                      <tbody>
                        {orders.length === 0 ? <tr><td colSpan={4} style={{ padding:'32px', textAlign:'center', color:'#9A8060', fontSize:12, fontStyle:'italic' }}>Belum ada order</td></tr>
                        : orders.slice(0,5).map(o => (
                          <tr key={o.id} style={{ borderBottom:'1px solid rgba(193,152,60,0.07)' }}>
                            <td style={{ padding:'12px 16px', fontSize:12, color:G, fontWeight:700 }}>{o.order_code}</td>
                            <td style={{ padding:'12px 16px', fontSize:12, color:D }}>{o.customer_name}</td>
                            <td style={{ padding:'12px 16px', fontSize:12, color:D, fontWeight:600 }}>Rp {(o.total||0).toLocaleString('id-ID')}</td>
                            <td style={{ padding:'12px 16px' }}><span style={{ background:STATUS[o.status||'baru']?.bg, color:STATUS[o.status||'baru']?.color, padding:'3px 10px', borderRadius:20, fontSize:10 }}>{STATUS[o.status||'baru']?.label}</span></td>
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
                <div style={{ marginBottom:28, display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:16 }}>
                  <div>
                    <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:6 }}>Management</div>
                    <h1 style={{ fontSize:28, fontWeight:400, fontFamily:serif, color:D }}>Kelola Produk</h1>
                  </div>
                  <button onClick={() => { setEditItem(null); setShowForm(true) }}
                    style={{ padding:'12px 24px', background:`linear-gradient(135deg,${G},#D4AA50,${G})`, color:C, border:'none', borderRadius:4, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans, boxShadow:'0 4px 16px rgba(193,152,60,0.3)' }}>
                    + Tambah Produk
                  </button>
                </div>

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
                      <div style={{ height:140, background: p.images?.[0] ? 'none' : (p.bg||'linear-gradient(145deg,#F0E4C8,#E8D5A8)'), display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                        {p.images?.[0]
                          ? <img src={p.images[0]} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                          : <span style={{ fontSize:40 }}>👗</span>
                        }
                        {p.badge && <span style={{ position:'absolute', top:8, left:8, background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, fontSize:8, padding:'2px 8px', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:sans }}>{p.badge}</span>}
                        <span style={{ position:'absolute', top:8, right:8, background:'rgba(253,251,247,0.9)', color:D, fontSize:9, padding:'2px 8px', borderRadius:20, fontFamily:sans }}>{p.category}</span>
                      </div>
                      <div style={{ padding:'14px' }}>
                        <div style={{ fontSize:14, fontWeight:500, fontFamily:serif, color:D, marginBottom:2 }}>{p.name}</div>
                        <div style={{ fontSize:15, fontWeight:600, color:D, marginBottom:4 }}>Rp {(p.price||0).toLocaleString('id-ID')}</div>
                        {/* Color dots */}
                        {p.color_images?.length > 0 && (
                          <div style={{ display:'flex', gap:4, marginBottom:8 }}>
                            {p.color_images.map(c => <div key={c.name} title={c.name} style={{ width:12, height:12, borderRadius:'50%', background:c.hex, border:'1px solid rgba(0,0,0,0.1)' }} />)}
                          </div>
                        )}
                        <div style={{ display:'flex', gap:12, fontSize:10, color:'#9A8060', marginBottom:12 }}>
                          <span>📦 {p.stock||0}</span>
                          <span>⚖️ {p.weight||300}g</span>
                          <span>🖼️ {p.images?.length||0} foto</span>
                        </div>
                        <div style={{ display:'flex', gap:8 }}>
                          <button onClick={() => { setEditItem(p); setShowForm(true) }} style={{ flex:1, padding:'7px', border:'1px solid rgba(193,152,60,0.3)', borderRadius:4, background:'transparent', color:D, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans }}>✏️ Edit</button>
                          <button onClick={() => handleDeleteProduct(p.id)} style={{ padding:'7px 10px', border:'1px solid #FCA5A5', borderRadius:4, background:'transparent', color:'#DC2626', fontSize:10, cursor:'pointer', fontFamily:sans }}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
