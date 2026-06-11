import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { createOrder, buildWhatsAppMessage, WA_NUMBER } from '../lib/api.js'
import { ZONES, calcShipping } from '../data/products.js'

const G = "#C1983C", D = "#2A1F0E", C = "#FDFBF7", LB = "#F7F2E8"
const serif = "'Cormorant Garamond',serif"
const sans = "'Didact Gothic',sans-serif"

const PROVINCES = [
  "DKI Jakarta","Jawa Barat","Jawa Tengah","Jawa Timur","DI Yogyakarta","Banten","Bali",
  "Aceh","Sumatera Utara","Sumatera Barat","Riau","Jambi","Sumatera Selatan","Bengkulu",
  "Lampung","Kepulauan Riau","Kepulauan Bangka Belitung","Kalimantan Barat","Kalimantan Tengah",
  "Kalimantan Selatan","Kalimantan Timur","Kalimantan Utara","Sulawesi Utara","Sulawesi Tengah",
  "Sulawesi Selatan","Sulawesi Tenggara","Gorontalo","Sulawesi Barat","Nusa Tenggara Barat",
  "Nusa Tenggara Timur","Maluku","Maluku Utara","Papua","Papua Barat"
]

const PROVINCE_ZONE = {
  "DKI Jakarta":"zona1","Jawa Barat":"zona1","Jawa Tengah":"zona1","Jawa Timur":"zona1",
  "DI Yogyakarta":"zona1","Banten":"zona1","Bali":"zona1",
  "Aceh":"zona2","Sumatera Utara":"zona2","Sumatera Barat":"zona2","Riau":"zona2",
  "Jambi":"zona2","Sumatera Selatan":"zona2","Bengkulu":"zona2","Lampung":"zona2",
  "Kepulauan Riau":"zona2","Kepulauan Bangka Belitung":"zona2","Kalimantan Barat":"zona2",
  "Kalimantan Tengah":"zona2","Kalimantan Selatan":"zona2","Kalimantan Timur":"zona2",
  "Kalimantan Utara":"zona2","Sulawesi Utara":"zona2","Sulawesi Tengah":"zona2",
  "Sulawesi Selatan":"zona2","Sulawesi Tenggara":"zona2","Gorontalo":"zona2","Sulawesi Barat":"zona2",
  "Nusa Tenggara Barat":"zona3","Nusa Tenggara Timur":"zona3","Maluku":"zona3","Maluku Utara":"zona3",
  "Papua":"zona4","Papua Barat":"zona4"
}

export default function CartCheckout() {
  const { cartItems, removeFromCart, updateQty, clearCart, cartTotal, cartWeight } = useCart()
  const navigate = useNavigate()

  const [step, setStep] = useState('cart') // cart | checkout | success
  const [submitting, setSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState(null)

  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', customer_address: '',
    customer_city: '', customer_province: '', notes: ''
  })
  const [formErrors, setFormErrors] = useState({})

  const selectedZone = form.customer_province ? PROVINCE_ZONE[form.customer_province] || 'zona2' : null
  const shippingCost = selectedZone ? calcShipping(selectedZone, cartWeight) : 0
  const grandTotal = cartTotal + shippingCost
  const zoneInfo = ZONES.find(z => z.value === selectedZone)

  const updateForm = (key, val) => {
    setForm(p => ({ ...p, [key]: val }))
    setFormErrors(p => ({ ...p, [key]: '' }))
  }

  function validateForm() {
    const errors = {}
    if (!form.customer_name.trim()) errors.customer_name = 'Nama wajib diisi'
    if (!form.customer_phone.trim()) errors.customer_phone = 'Nomor HP wajib diisi'
    if (!form.customer_address.trim()) errors.customer_address = 'Alamat wajib diisi'
    if (!form.customer_city.trim()) errors.customer_city = 'Kota wajib diisi'
    if (!form.customer_province) errors.customer_province = 'Provinsi wajib dipilih'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleOrder() {
    if (!validateForm()) return
    setSubmitting(true)
    try {
      const orderData = {
        ...form,
        zone: selectedZone,
        items: cartItems.map(i => ({
          name: i.product.name,
          color: i.color,
          size: i.size,
          qty: i.qty,
          price: i.product.price,
        })),
        subtotal: cartTotal,
        shipping_cost: shippingCost,
        total: grandTotal,
      }
      const order = await createOrder(orderData)
      setOrderResult(order)
      // Open WhatsApp
      const msg = buildWhatsAppMessage(order)
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
      clearCart()
      setStep('success')
    } catch (err) {
      // Even if Supabase fails, still send via WhatsApp
      const fallbackOrder = {
        ...form,
        order_code: `HC-${Date.now().toString().slice(-6)}`,
        zone: selectedZone,
        items: cartItems.map(i => ({ name:i.product.name, color:i.color, size:i.size, qty:i.qty, price:i.product.price })),
        subtotal: cartTotal,
        shipping_cost: shippingCost,
        total: grandTotal,
      }
      const msg = buildWhatsAppMessage(fallbackOrder)
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
      clearCart()
      setOrderResult(fallbackOrder)
      setStep('success')
    } finally {
      setSubmitting(false)
    }
  }

  // ── EMPTY CART ──
  if (cartItems.length === 0 && step !== 'success') return (
    <div style={{ fontFamily:sans, paddingTop:72, minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20, textAlign:'center', padding:'72px 24px' }}>
      <div style={{ fontSize:64 }}>🛒</div>
      <h2 style={{ fontSize:28, fontWeight:400, fontFamily:serif, color:D }}>Keranjang <span style={{ fontStyle:'italic', color:G }}>Kosong</span></h2>
      <p style={{ fontSize:13, color:'#9A8060', maxWidth:300 }}>Belum ada produk di keranjangmu. Yuk mulai belanja!</p>
      <Link to="/shop" style={{ padding:'13px 32px', background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', fontFamily:sans, boxShadow:'0 6px 20px rgba(193,152,60,0.3)' }}>
        Shop Now →
      </Link>
    </div>
  )

  // ── SUCCESS ──
  if (step === 'success') return (
    <div style={{ fontFamily:sans, paddingTop:72, minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20, textAlign:'center', padding:'72px 24px' }}>
      <div style={{ fontSize:64 }}>🎉</div>
      <h2 style={{ fontSize:32, fontWeight:400, fontFamily:serif, color:D }}>Pesanan <span style={{ fontStyle:'italic', color:G }}>Terkirim!</span></h2>
      {orderResult && <div style={{ fontSize:14, color:G, fontWeight:700, background:LB, padding:'8px 20px', borderRadius:20, border:`1px solid rgba(193,152,60,0.2)` }}>Kode: {orderResult.order_code}</div>}
      <p style={{ fontSize:13, color:'#7A6040', maxWidth:400, lineHeight:1.8 }}>
        WhatsApp sudah terbuka otomatis dengan detail pesananmu. Silakan kirim pesan tersebut ke kami untuk konfirmasi.
      </p>
      {/* Payment reminder */}
      <div style={{ background:LB, border:`1px solid rgba(193,152,60,0.2)`, borderRadius:8, padding:'20px 28px', maxWidth:360, width:'100%' }}>
        <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:G, marginBottom:12 }}>Info Pembayaran</div>
        <div style={{ fontSize:13, color:D, lineHeight:2 }}>
          <div>🏦 Transfer BCA</div>
          <div style={{ fontSize:18, fontWeight:700, fontFamily:serif, letterSpacing:'0.1em' }}>7560515655</div>
          <div style={{ fontSize:11, color:'#9A8060' }}>a/n Weta Novinie</div>
          <div style={{ marginTop:8, fontSize:16, fontWeight:700, color:G }}>Total: Rp {(orderResult?.total||grandTotal).toLocaleString('id-ID')}</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        <Link to="/shop" style={{ padding:'12px 28px', background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', fontFamily:sans }}>
          Lanjut Belanja
        </Link>
        <Link to="/" style={{ padding:'12px 28px', background:'transparent', color:D, border:`1px solid rgba(42,31,14,0.2)`, borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', fontFamily:sans }}>
          Kembali ke Home
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily:sans, paddingTop:72 }}>
      {/* HEADER */}
      <div style={{ background:'linear-gradient(135deg,#F5EDD8,#EDE0C4)', padding:'32px 48px 24px', borderBottom:`1px solid rgba(193,152,60,0.15)` }}>
        <style>{`@media(max-width:768px){.cart-header{padding:24px !important}}`}</style>
        <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:8 }}>✦ {step === 'cart' ? 'Keranjang' : 'Checkout'}</div>
        <h1 style={{ fontSize:32, fontWeight:400, fontFamily:serif, color:D }}>
          {step === 'cart' ? <>Keranjang <span style={{ fontStyle:'italic', color:G }}>Belanja</span></> : <>Detail <span style={{ fontStyle:'italic', color:G }}>Pengiriman</span></>}
        </h1>
        {/* Steps */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:16 }}>
          {['cart','checkout'].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background: step===s||( step==='checkout' && s==='cart') ? G : 'rgba(193,152,60,0.2)', color: step===s||(step==='checkout'&&s==='cart') ? C : '#9A8060', fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{i+1}</div>
                <span style={{ fontSize:11, color: step===s ? D : '#9A8060', textTransform:'uppercase', letterSpacing:'0.1em' }}>{s==='cart'?'Keranjang':'Checkout'}</span>
              </div>
              {i === 0 && <div style={{ flex:1, height:1, background:'rgba(193,152,60,0.2)', maxWidth:40 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:32, padding:'32px 48px 80px', maxWidth:1200, margin:'0 auto' }}>
        <style>{`@media(max-width:900px){.cart-layout{grid-template-columns:1fr !important; padding:24px !important}}`}</style>

        {/* LEFT */}
        <div>
          {/* ── STEP 1: CART ── */}
          {step === 'cart' && (
            <div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {cartItems.map(item => (
                  <div key={item.key} style={{ background:C, borderRadius:4, border:`1px solid rgba(193,152,60,0.12)`, padding:'16px 20px', display:'flex', gap:16, alignItems:'center' }}>
                    {/* Image */}
                    <div style={{ width:72, height:88, background: item.product.bg||'linear-gradient(145deg,#F0E4C8,#E8D5A8)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontSize:28 }}>👗</span>
                    </div>
                    {/* Info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:500, fontFamily:serif, color:D, marginBottom:2 }}>{item.product.name}</div>
                      <div style={{ fontSize:10, color:'#9A8060', letterSpacing:'0.1em', marginBottom:8 }}>
                        {item.color} · {item.size}
                      </div>
                      <div style={{ fontSize:14, fontWeight:600, fontFamily:serif, color:D }}>
                        Rp {(item.product.price * item.qty).toLocaleString('id-ID')}
                      </div>
                    </div>
                    {/* Qty */}
                    <div style={{ display:'flex', alignItems:'center', gap:0, border:`1px solid rgba(193,152,60,0.2)`, borderRadius:4, overflow:'hidden', flexShrink:0 }}>
                      <button onClick={() => updateQty(item.key, -1)} style={{ width:32, height:32, border:'none', background:LB, cursor:'pointer', fontSize:16, color:D }}>−</button>
                      <span style={{ width:36, height:32, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:600, color:D, borderLeft:`1px solid rgba(193,152,60,0.15)`, borderRight:`1px solid rgba(193,152,60,0.15)` }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.key, 1)} style={{ width:32, height:32, border:'none', background:LB, cursor:'pointer', fontSize:16, color:D }}>+</button>
                    </div>
                    {/* Remove */}
                    <button onClick={() => removeFromCart(item.key)} style={{ background:'none', border:'none', cursor:'pointer', color:'#C0A0A0', fontSize:18, flexShrink:0, padding:4 }}>🗑️</button>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('checkout')} style={{ width:'100%', marginTop:20, padding:'14px', background:`linear-gradient(135deg,${G},#D4AA50,${G})`, color:C, border:'none', borderRadius:2, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans, boxShadow:'0 6px 20px rgba(193,152,60,0.3)' }}>
                Lanjut ke Checkout →
              </button>
            </div>
          )}

          {/* ── STEP 2: CHECKOUT FORM ── */}
          {step === 'checkout' && (
            <div>
              <button onClick={() => setStep('cart')} style={{ background:'none', border:'none', cursor:'pointer', color:'#9A8060', fontSize:12, fontFamily:sans, marginBottom:24, display:'flex', alignItems:'center', gap:6 }}>
                ← Kembali ke Keranjang
              </button>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <style>{`@media(max-width:600px){.form-grid{grid-template-columns:1fr !important}}`}</style>

                {/* Name */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Nama Lengkap *</label>
                  <input value={form.customer_name} onChange={e=>updateForm('customer_name',e.target.value)}
                    className="form-input" placeholder="Nama penerima" />
                  {formErrors.customer_name && <div style={{ fontSize:10, color:'#DC2626', marginTop:4 }}>{formErrors.customer_name}</div>}
                </div>

                {/* Phone */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Nomor HP / WhatsApp *</label>
                  <input value={form.customer_phone} onChange={e=>updateForm('customer_phone',e.target.value)}
                    className="form-input" placeholder="08xxxxxxxxxx" type="tel" />
                  {formErrors.customer_phone && <div style={{ fontSize:10, color:'#DC2626', marginTop:4 }}>{formErrors.customer_phone}</div>}
                </div>

                {/* Address */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Alamat Lengkap *</label>
                  <textarea value={form.customer_address} onChange={e=>updateForm('customer_address',e.target.value)}
                    className="form-input" placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan" rows={3}
                    style={{ resize:'vertical' }} />
                  {formErrors.customer_address && <div style={{ fontSize:10, color:'#DC2626', marginTop:4 }}>{formErrors.customer_address}</div>}
                </div>

                {/* City */}
                <div>
                  <label className="form-label">Kota / Kabupaten *</label>
                  <input value={form.customer_city} onChange={e=>updateForm('customer_city',e.target.value)}
                    className="form-input" placeholder="Nama kota" />
                  {formErrors.customer_city && <div style={{ fontSize:10, color:'#DC2626', marginTop:4 }}>{formErrors.customer_city}</div>}
                </div>

                {/* Province */}
                <div>
                  <label className="form-label">Provinsi *</label>
                  <select value={form.customer_province} onChange={e=>updateForm('customer_province',e.target.value)}
                    className="form-input" style={{ cursor:'pointer' }}>
                    <option value="">Pilih Provinsi</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {formErrors.customer_province && <div style={{ fontSize:10, color:'#DC2626', marginTop:4 }}>{formErrors.customer_province}</div>}
                </div>

                {/* Zone info */}
                {selectedZone && (
                  <div style={{ gridColumn:'1/-1', background:LB, borderRadius:4, padding:'12px 16px', border:`1px solid rgba(193,152,60,0.15)` }}>
                    <div style={{ fontSize:10, color:G, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:4 }}>Zona Pengiriman Terdeteksi</div>
                    <div style={{ fontSize:13, color:D, fontWeight:600 }}>{zoneInfo?.label}</div>
                    <div style={{ fontSize:12, color:'#7A6040', marginTop:2 }}>
                      Ongkir: {shippingCost === 0 ? <span style={{ color:'#6B9B6B', fontWeight:700 }}>GRATIS 🎉</span> : `Rp ${shippingCost.toLocaleString('id-ID')}`}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Catatan (opsional)</label>
                  <textarea value={form.notes} onChange={e=>updateForm('notes',e.target.value)}
                    className="form-input" placeholder="Instruksi khusus, warna alternatif, dll." rows={2}
                    style={{ resize:'vertical' }} />
                </div>
              </div>

              {/* Payment info */}
              <div style={{ background:'linear-gradient(135deg,#F0E4C8,#E8D5A8)', borderRadius:4, padding:'20px', marginTop:20, border:`1px solid rgba(193,152,60,0.2)` }}>
                <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9A6E1A', marginBottom:12 }}>✦ Cara Pembayaran</div>
                <div style={{ fontSize:13, color:D, lineHeight:2 }}>
                  <div>Transfer ke rekening BCA:</div>
                  <div style={{ fontSize:22, fontWeight:700, fontFamily:serif, letterSpacing:'0.08em' }}>7560515655</div>
                  <div style={{ fontSize:12, color:'#7A6040' }}>a/n Weta Novinie</div>
                  <div style={{ marginTop:8, fontSize:12, color:'#7A6040' }}>
                    Setelah klik "Pesan via WhatsApp", kirim pesan tersebut ke kami beserta bukti transfer.
                  </div>
                </div>
              </div>

              <button onClick={handleOrder} disabled={submitting}
                style={{ width:'100%', marginTop:20, padding:'16px', background: submitting ? '#C0A88A' : `linear-gradient(135deg,${G},#D4AA50,${G})`, color:C, border:'none', borderRadius:2, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily:sans, boxShadow:'0 6px 20px rgba(193,152,60,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {submitting ? (
                  <><div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid white', borderRadius:'50%', animation:'spin 1s linear infinite' }} />Memproses...</>
                ) : '📱 Pesan via WhatsApp'}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div>
          <div style={{ background:C, borderRadius:4, border:`1px solid rgba(193,152,60,0.12)`, overflow:'hidden', position:'sticky', top:96 }}>
            <div style={{ padding:'16px 20px', borderBottom:`1px solid rgba(193,152,60,0.1)`, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:G }}>
              Ringkasan Order
            </div>
            <div style={{ padding:'16px 20px' }}>
              {/* Items */}
              {cartItems.map(item => (
                <div key={item.key} style={{ display:'flex', justifyContent:'space-between', marginBottom:10, gap:8 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, color:D, fontWeight:500 }}>{item.product.name}</div>
                    <div style={{ fontSize:10, color:'#9A8060' }}>{item.color} · {item.size} · x{item.qty}</div>
                  </div>
                  <div style={{ fontSize:12, color:D, fontWeight:600, flexShrink:0 }}>
                    Rp {(item.product.price * item.qty).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}

              <div style={{ borderTop:`1px solid rgba(193,152,60,0.1)`, paddingTop:12, marginTop:4, display:'flex', flexDirection:'column', gap:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#7A6040' }}>
                  <span>Subtotal</span>
                  <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#7A6040' }}>
                  <span>Ongkir {zoneInfo ? `(${zoneInfo.label.split('—')[0].trim()})` : ''}</span>
                  <span style={{ color: shippingCost===0 && selectedZone ? '#6B9B6B' : '#7A6040', fontWeight: shippingCost===0 && selectedZone ? 700 : 400 }}>
                    {!selectedZone ? '—' : shippingCost === 0 ? 'GRATIS' : `Rp ${shippingCost.toLocaleString('id-ID')}`}
                  </span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:15, color:D, fontWeight:700, fontFamily:serif, paddingTop:8, borderTop:`1px solid rgba(193,152,60,0.1)` }}>
                  <span>Total</span>
                  <span style={{ color:G }}>Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Weight info */}
              <div style={{ marginTop:12, fontSize:10, color:'#9A8060', textAlign:'center' }}>
                ⚖️ Total berat: {cartWeight}g
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
