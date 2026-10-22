import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { createOrder, buildWhatsAppMessage, WA_NUMBER } from '../lib/api.js'
import { rp, TIER2_MIN, TIER3_MIN } from '../lib/pricing.js'

const G = "#B8975A", D = "#2B2926", C = "#FAFAF8", LB = "#F2F0EC"
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

export default function CartCheckout() {
  const { cartItems, removeFromCart, updateQty, clearCart, cartTotal, cartWeight, cartPcs, tier, savings, nextTier, nextTierRemaining } = useCart()
  const weightKg = Math.max(0.1, Math.round(cartWeight/100)/10)
  const navigate = useNavigate()

  const [step, setStep] = useState('cart')
  const [submitting, setSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState(null)
  const [form, setForm] = useState({
    customer_name:'', customer_phone:'', customer_address:'',
    customer_city:'', customer_province:'', notes:''
  })
  const [formErrors, setFormErrors] = useState({})

  const grandTotal = cartTotal

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
        zone: 'konfirmasi',
        items: cartItems.map(i => ({ name: i.product.name, color: 'Semua warna', size: '-', qty: i.qty, series_qty: i.pcsPerSeries, pcs: i.pcs, price: i.unit })),
        tier, total_pcs: cartPcs, est_weight_kg: weightKg,
        subtotal: cartTotal, shipping_cost: 0, total: grandTotal,
      }
      const order = await createOrder(orderData)
      setOrderResult(order)
      const msg = buildWhatsAppMessage(order)
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
      clearCart()
      setStep('success')
    } catch {
      const fallbackOrder = {
        ...form,
        order_code: `HC-${Date.now().toString().slice(-6)}`,
        zone: 'konfirmasi',
        items: cartItems.map(i => ({ name: i.product.name, color: 'Semua warna', size: '-', qty: i.qty, series_qty: i.pcsPerSeries, pcs: i.pcs, price: i.unit })),
        tier, total_pcs: cartPcs, est_weight_kg: weightKg,
        subtotal: cartTotal, shipping_cost: 0, total: grandTotal,
      }
      const msg = buildWhatsAppMessage(fallbackOrder)
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
      clearCart()
      setOrderResult(fallbackOrder)
      setStep('success')
    } finally { setSubmitting(false) }
  }

  // ── EMPTY CART ──
  if (cartItems.length === 0 && step !== 'success') return (
    <div style={{ fontFamily:sans, paddingTop:72, minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20, textAlign:'center', padding:'72px 24px' }}>
      <div style={{ fontSize:64 }}>🛒</div>
      <h2 style={{ fontSize:28, fontWeight:400, fontFamily:serif, color:D }}>Keranjang Order <span style={{ fontStyle:'italic', color:G }}>Kosong</span></h2>
      <p style={{ fontSize:13, color:'#8A8680', maxWidth:300 }}>Belum ada model di keranjang. Pilih model dari katalog grosir.</p>
      <Link to="/shop" style={{ padding:'13px 32px', background:`linear-gradient(135deg,${G},#CDB07A)`, color:C, borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', fontFamily:sans, boxShadow:'0 6px 20px rgba(184,151,90,0.3)' }}>
        Lihat Katalog →
      </Link>
    </div>
  )

  // ── SUCCESS ──
  if (step === 'success') return (
    <div style={{ fontFamily:sans, paddingTop:72, minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20, textAlign:'center', padding:'72px 24px' }}>
      <div style={{ fontSize:64 }}>🎉</div>
      <h2 style={{ fontSize:32, fontWeight:400, fontFamily:serif, color:D }}>Pesanan <span style={{ fontStyle:'italic', color:G }}>Terkirim!</span></h2>
      {orderResult && <div style={{ fontSize:14, color:G, fontWeight:700, background:LB, padding:'8px 20px', borderRadius:20, border:`1px solid rgba(184,151,90,0.2)` }}>Kode: {orderResult.order_code}</div>}
      <p style={{ fontSize:13, color:'#6B6862', maxWidth:400, lineHeight:1.8 }}>
        WhatsApp sudah terbuka dengan detail order. Kirim pesan tersebut, lalu kami konfirmasi ongkir dan total akhir.
      </p>
      <div style={{ background:LB, border:`1px solid rgba(184,151,90,0.2)`, borderRadius:8, padding:'20px 28px', maxWidth:360, width:'100%' }}>
        <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:G, marginBottom:12 }}>Info Pembayaran</div>
        <div style={{ fontSize:13, color:D, lineHeight:2 }}>
          <div>🏦 Transfer BCA</div>
          <div style={{ fontSize:18, fontWeight:700, fontFamily:serif, letterSpacing:'0.1em' }}>7560515655</div>
          <div style={{ fontSize:11, color:'#8A8680' }}>a/n Weta Novinie</div>
          <div style={{ marginTop:8, fontSize:16, fontWeight:700, color:G }}>Total (belum ongkir): {rp(orderResult?.total||grandTotal)}</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        <Link to="/shop" style={{ padding:'12px 28px', background:`linear-gradient(135deg,${G},#CDB07A)`, color:C, borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', fontFamily:sans }}>Tambah Model</Link>
        <Link to="/" style={{ padding:'12px 28px', background:'transparent', color:D, border:`1px solid rgba(43,41,38,0.2)`, borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', fontFamily:sans }}>Kembali ke Home</Link>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily:sans, paddingTop:72 }}>
      {/* HEADER */}
      <div style={{ background:'linear-gradient(135deg,#F4F2EE,#EAE7E1)', padding:'32px 48px 24px', borderBottom:`1px solid rgba(184,151,90,0.15)` }}>
        <style>{`@media(max-width:768px){.cart-header-pad{padding:24px !important}}`}</style>
        <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:8 }}>✦ {step==='cart'?'Keranjang':'Checkout'}</div>
        <h1 style={{ fontSize:32, fontWeight:400, fontFamily:serif, color:D }}>
          {step==='cart' ? <>Keranjang <span style={{ fontStyle:'italic', color:G }}>Order</span></> : <>Data <span style={{ fontStyle:'italic', color:G }}>Pemesan</span></>}
        </h1>
        {/* Steps indicator */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:16 }}>
          {['cart','checkout'].map((s,i) => (
            <React.Fragment key={s}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background: step===s||(step==='checkout'&&s==='cart')?G:'rgba(184,151,90,0.2)', color: step===s||(step==='checkout'&&s==='cart')?C:'#8A8680', fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{i+1}</div>
                <span style={{ fontSize:11, color: step===s?D:'#8A8680', textTransform:'uppercase', letterSpacing:'0.1em' }}>{s==='cart'?'Keranjang':'Checkout'}</span>
              </div>
              {i===0 && <div style={{ flex:1, height:1, background:'rgba(184,151,90,0.2)', maxWidth:40 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:32, padding:'32px 48px 80px', maxWidth:1200, margin:'0 auto' }}>
        <style>{`@media(max-width:900px){.cart-layout{grid-template-columns:1fr !important; padding:24px !important}}`}</style>

        {/* LEFT */}
        <div>
          {/* ── STEP 1: CART ── */}
          {step==='cart' && (
            <div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {cartItems.map(item => {
                  const thumb = item.product.images?.[0] || null
                  const colorThumb = thumb
                  return (
                    <div key={item.key} style={{ background:C, borderRadius:4, border:`1px solid rgba(184,151,90,0.12)`, padding:'16px 20px', display:'flex', gap:16, alignItems:'center' }}>
                      {/* Product thumbnail */}
                      <div style={{ width:76, height:96, flexShrink:0, borderRadius:4, overflow:'hidden', background: colorThumb?'none':(item.product.bg||'linear-gradient(145deg,#ECE9E4,#E2DED7)'), display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(184,151,90,0.1)' }}>
                        {colorThumb
                          ? <img src={colorThumb} alt={item.product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                          : <span style={{ fontSize:28 }}>👗</span>
                        }
                      </div>
                      {/* Info */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:500, fontFamily:serif, color:D, marginBottom:2 }}>{item.product.name}</div>
                        <div style={{ fontSize:10, color:'#8A8680', letterSpacing:'0.1em', marginBottom:2 }}>
                          {item.qty} seri × {item.pcsPerSeries} pcs = {item.pcs} pcs · semua warna
                        </div>
                        <div style={{ fontSize:11, color:'#8A8680', marginBottom:8 }}>
                          {rp(item.unit)} /pcs {item.unit < item.normalUnit && <span style={{ textDecoration:'line-through', marginLeft:4 }}>{rp(item.normalUnit)}</span>}
                        </div>
                        <div style={{ fontSize:14, fontWeight:600, fontFamily:serif, color:D }}>{rp(item.subtotal)}</div>
                      </div>
                      {/* Qty */}
                      <div style={{ display:'flex', alignItems:'center', border:`1px solid rgba(184,151,90,0.2)`, borderRadius:4, overflow:'hidden', flexShrink:0 }}>
                        <button onClick={() => updateQty(item.key,-1)} style={{ width:32, height:32, border:'none', background:LB, cursor:'pointer', fontSize:16, color:D }}>−</button>
                        <span style={{ width:36, height:32, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:600, color:D, borderLeft:`1px solid rgba(184,151,90,0.15)`, borderRight:`1px solid rgba(184,151,90,0.15)` }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.key,1)} style={{ width:32, height:32, border:'none', background:LB, cursor:'pointer', fontSize:16, color:D }}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.key)} style={{ background:'none', border:'none', cursor:'pointer', color:'#C0A0A0', fontSize:18, flexShrink:0, padding:4 }}>🗑️</button>
                    </div>
                  )
                })}
              </div>

              {/* Tier banner */}
              <div style={{ background:LB, borderRadius:4, padding:'16px 20px', marginTop:20, border:`1px solid rgba(184,151,90,0.25)` }}>
                <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:G, marginBottom:8 }}>Harga Tier {tier} aktif</div>
                {nextTier ? (
                  <div style={{ fontSize:12, color:'#55524D', lineHeight:1.7 }}>Tambah belanja <b>{rp(nextTierRemaining)}</b> lagi untuk harga <b>Tier {nextTier}</b> (di atas {rp(nextTier===2?TIER2_MIN:TIER3_MIN)}).</div>
                ) : (
                  <div style={{ fontSize:12, color:'#55524D' }}>Anda sudah mendapat harga terendah (Tier 3) 🎉</div>
                )}
                {savings > 0 && <div style={{ fontSize:12, color:'#4F7F4F', marginTop:6, fontWeight:700 }}>Hemat {rp(savings)} dari harga normal</div>}
                <div style={{ fontSize:11, color:'#8A8680', marginTop:8 }}>Ongkir tidak dihitung di sini; kami konfirmasi terpisah via WhatsApp.</div>
              </div>

              <button onClick={() => setStep('checkout')} style={{ width:'100%', marginTop:20, padding:'14px', background:`linear-gradient(135deg,${G},#CDB07A,${G})`, color:C, border:'none', borderRadius:2, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans, boxShadow:'0 6px 20px rgba(184,151,90,0.3)' }}>
                Lanjut ke Checkout →
              </button>
            </div>
          )}

          {/* ── STEP 2: CHECKOUT FORM ── */}
          {step==='checkout' && (
            <div>
              <button onClick={() => setStep('cart')} style={{ background:'none', border:'none', cursor:'pointer', color:'#8A8680', fontSize:12, fontFamily:sans, marginBottom:24, display:'flex', alignItems:'center', gap:6 }}>
                ← Kembali ke Keranjang
              </button>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <style>{`@media(max-width:600px){.checkout-form-grid{grid-template-columns:1fr !important}}`}</style>
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Nama Lengkap *</label>
                  <input value={form.customer_name} onChange={e=>updateForm('customer_name',e.target.value)} className="form-input" placeholder="Nama penerima" />
                  {formErrors.customer_name && <div style={{ fontSize:10, color:'#DC2626', marginTop:4 }}>{formErrors.customer_name}</div>}
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Nomor HP / WhatsApp *</label>
                  <input value={form.customer_phone} onChange={e=>updateForm('customer_phone',e.target.value)} className="form-input" placeholder="08xxxxxxxxxx" type="tel" />
                  {formErrors.customer_phone && <div style={{ fontSize:10, color:'#DC2626', marginTop:4 }}>{formErrors.customer_phone}</div>}
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Alamat Lengkap *</label>
                  <textarea value={form.customer_address} onChange={e=>updateForm('customer_address',e.target.value)} className="form-input" placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan" rows={3} style={{ resize:'vertical' }} />
                  {formErrors.customer_address && <div style={{ fontSize:10, color:'#DC2626', marginTop:4 }}>{formErrors.customer_address}</div>}
                </div>
                <div>
                  <label className="form-label">Kota / Kabupaten *</label>
                  <input value={form.customer_city} onChange={e=>updateForm('customer_city',e.target.value)} className="form-input" placeholder="Nama kota" />
                  {formErrors.customer_city && <div style={{ fontSize:10, color:'#DC2626', marginTop:4 }}>{formErrors.customer_city}</div>}
                </div>
                <div>
                  <label className="form-label">Provinsi *</label>
                  <select value={form.customer_province} onChange={e=>updateForm('customer_province',e.target.value)} className="form-input" style={{ cursor:'pointer' }}>
                    <option value="">Pilih Provinsi</option>
                    {PROVINCES.map(p=><option key={p} value={p}>{p}</option>)}
                  </select>
                  {formErrors.customer_province && <div style={{ fontSize:10, color:'#DC2626', marginTop:4 }}>{formErrors.customer_province}</div>}
                </div>

                <div style={{ gridColumn:'1/-1' }}>
                  <label className="form-label">Catatan (opsional)</label>
                  <textarea value={form.notes} onChange={e=>updateForm('notes',e.target.value)} className="form-input" placeholder="Catatan untuk kami, ekspedisi yang diinginkan, dll." rows={2} style={{ resize:'vertical' }} />
                </div>
              </div>

              {/* Payment info */}
              <div style={{ background:'linear-gradient(135deg,#ECE9E4,#E2DED7)', borderRadius:4, padding:'20px', marginTop:20, border:`1px solid rgba(184,151,90,0.2)` }}>
                <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#8A6D35', marginBottom:12 }}>✦ Cara Pembayaran</div>
                <div style={{ fontSize:13, color:D, lineHeight:2 }}>
                  <div>Transfer ke rekening BCA:</div>
                  <div style={{ fontSize:22, fontWeight:700, fontFamily:serif, letterSpacing:'0.08em' }}>7560515655</div>
                  <div style={{ fontSize:12, color:'#6B6862' }}>a/n Weta Novinie</div>
                  <div style={{ marginTop:8, fontSize:12, color:'#6B6862' }}>Pembayaran dilakukan setelah total + ongkir kami konfirmasi via WhatsApp.</div>
                </div>
              </div>

              <button onClick={handleOrder} disabled={submitting}
                style={{ width:'100%', marginTop:20, padding:'16px', background: submitting?'#C0A88A':`linear-gradient(135deg,${G},#CDB07A,${G})`, color:C, border:'none', borderRadius:2, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', cursor: submitting?'not-allowed':'pointer', fontFamily:sans, boxShadow:'0 6px 20px rgba(184,151,90,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {submitting ? <><div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid white', borderRadius:'50%', animation:'spin 1s linear infinite' }} />Memproses...</> : '📱 Kirim Order via WhatsApp'}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div>
          <div style={{ background:C, borderRadius:4, border:`1px solid rgba(184,151,90,0.12)`, overflow:'hidden', position:'sticky', top:96 }}>
            <div style={{ padding:'16px 20px', borderBottom:`1px solid rgba(184,151,90,0.1)`, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:G }}>
              Ringkasan Order
            </div>
            <div style={{ padding:'16px 20px' }}>
              {cartItems.map(item => {
                const thumb = item.product.images?.[0] || null
                const colorThumb = thumb
                return (
                  <div key={item.key} style={{ display:'flex', gap:10, marginBottom:12, alignItems:'center' }}>
                    {/* Thumbnail */}
                    <div style={{ width:44, height:56, flexShrink:0, borderRadius:3, overflow:'hidden', background: colorThumb?'none':(item.product.bg||'linear-gradient(145deg,#ECE9E4,#E2DED7)'), display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(184,151,90,0.1)' }}>
                      {colorThumb
                        ? <img src={colorThumb} alt={item.product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        : <span style={{ fontSize:16 }}>👗</span>
                      }
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, color:D, fontWeight:500 }}>{item.product.name}</div>
                      <div style={{ fontSize:10, color:'#8A8680' }}>
                        {item.qty} seri · {item.pcs} pcs
                      </div>
                    </div>
                    <div style={{ fontSize:12, color:D, fontWeight:600, flexShrink:0 }}>
                      {rp(item.subtotal)}
                    </div>
                  </div>
                )
              })}

              <div style={{ borderTop:`1px solid rgba(184,151,90,0.1)`, paddingTop:12, marginTop:4, display:'flex', flexDirection:'column', gap:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#6B6862' }}>
                  <span>Total pcs</span><span>{cartPcs} pcs</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#6B6862' }}>
                  <span>Harga</span><span style={{ color:G, fontWeight:700 }}>Tier {tier}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#6B6862' }}>
                  <span>Ongkir</span><span>Dikonfirmasi terpisah</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:15, color:D, fontWeight:700, fontFamily:serif, paddingTop:8, borderTop:`1px solid rgba(184,151,90,0.1)` }}>
                  <span>Total</span>
                  <span style={{ color:G }}>{rp(grandTotal)}</span>
                </div>
              </div>

              <div style={{ marginTop:12, fontSize:10, color:'#8A8680', textAlign:'center' }}>
                ⚖️ Estimasi total berat: ± {weightKg} kg
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
