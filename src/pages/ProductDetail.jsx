import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductBySlug, getRelated } from '../lib/api.js'
import { getBySlug, getRelated as getRelatedLocal } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'

const G = "#C1983C", D = "#2A1F0E", C = "#FDFBF7", LB = "#F7F2E8"
const serif = "'Cormorant Garamond',serif"
const sans = "'Didact Gothic',sans-serif"

const COLORS_MAP = {
  "Cream":"#F5ECD7","Sage Green":"#A8B59C","Dusty Rose":"#E8C5C8",
  "Warm Brown":"#C9A882","Off White":"#F0EDE8","Classic Black":"#2B2B2B",
  "Navy":"#1B2A4A","Mocha":"#8B6B4A"
}

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    loadProduct()
  }, [slug])

  async function loadProduct() {
    setLoading(true)
    setError(null)
    try {
      const data = await getProductBySlug(slug)
      const p = data || getBySlug(slug)
      if (!p) { setError('Produk tidak ditemukan'); setLoading(false); return }
      setProduct(p)
      setSelectedColor((p.colors || [])[0] || null)
      setSelectedSize((p.sizes || [])[0] || null)
      // Load related
      try {
        const rel = await getRelated(p)
        setRelated(rel && rel.length > 0 ? rel : getRelatedLocal(p))
      } catch {
        setRelated(getRelatedLocal(p))
      }
    } catch {
      const p = getBySlug(slug)
      if (p) {
        setProduct(p)
        setSelectedColor((p.colors || [])[0] || null)
        setSelectedSize((p.sizes || [])[0] || null)
        setRelated(getRelatedLocal(p))
      } else {
        setError('Produk tidak ditemukan')
      }
    } finally {
      setLoading(false)
    }
  }

  // Get related products from Supabase
  async function getRelated(p) {
    const { getAllProducts } = await import('../lib/api.js')
    const all = await getAllProducts()
    return all.filter(x => x.category === p.category && x.id !== p.id).slice(0, 3)
  }

  function handleAddToCart() {
    if (!selectedColor || !selectedSize) return
    addToCart(product, selectedColor, selectedSize, qty)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  function handleBuyNow() {
    if (!selectedColor || !selectedSize) return
    addToCart(product, selectedColor, selectedSize, qty)
    navigate('/cart')
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'80vh', flexDirection:'column', gap:16 }}>
      <div style={{ width:36, height:36, border:`3px solid rgba(193,152,60,0.2)`, borderTop:`3px solid ${G}`, borderRadius:'50%', animation:'spin 1s linear infinite' }} />
      <span style={{ fontSize:12, color:'#9A8060', fontFamily:sans }}>Memuat produk...</span>
    </div>
  )

  if (error) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'80vh', flexDirection:'column', gap:16, textAlign:'center' }}>
      <div style={{ fontSize:48 }}>🔍</div>
      <h2 style={{ fontFamily:serif, color:D, fontWeight:400 }}>{error}</h2>
      <Link to="/shop" style={{ color:G, fontSize:12, borderBottom:`1px solid ${G}` }}>← Kembali ke Shop</Link>
    </div>
  )

  return (
    <div style={{ fontFamily:sans, paddingTop:72 }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:88, right:24, zIndex:999, background:D, color:C, padding:'12px 20px', borderRadius:8, fontSize:12, boxShadow:'0 8px 32px rgba(0,0,0,0.15)', display:'flex', alignItems:'center', gap:8, animation:'fadeUp 0.3s ease' }}>
          ✅ Ditambahkan ke keranjang!
        </div>
      )}

      {/* BREADCRUMB */}
      <div style={{ padding:'16px 48px', borderBottom:`1px solid rgba(193,152,60,0.08)`, display:'flex', gap:8, alignItems:'center', fontSize:11, color:'#9A8060' }}>
        <style>{`@media(max-width:768px){.breadcrumb{padding:12px 24px !important}}`}</style>
        <Link to="/" style={{ color:'#9A8060', textDecoration:'none' }}>Home</Link>
        <span>/</span>
        <Link to="/shop" style={{ color:'#9A8060', textDecoration:'none' }}>Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color:'#9A8060', textDecoration:'none' }}>{product.category}</Link>
        <span>/</span>
        <span style={{ color:D }}>{product.name}</span>
      </div>

      {/* MAIN PRODUCT */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, padding:'48px 48px', maxWidth:1200, margin:'0 auto' }}>
        <style>{`
          @media(max-width:768px){
            .product-main{grid-template-columns:1fr !important; padding:24px !important; gap:32px !important}
          }
        `}</style>

        {/* LEFT — IMAGE */}
        <div>
          {/* Main image */}
          <div style={{ aspectRatio:'3/4', background: product.bg || 'linear-gradient(145deg,#F0E4C8,#E8D5A8)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', border:'1px solid rgba(193,152,60,0.15)', marginBottom:12, boxShadow:'0 8px 40px rgba(42,31,14,0.08)' }}>
            <img src="/logo.png" alt="" style={{ position:'absolute', width:80, height:80, objectFit:'contain', opacity:0.06, bottom:16, right:16 }} />
            <div style={{ textAlign:'center', zIndex:2 }}>
              <span style={{ fontSize:96 }}>👗</span>
              <p style={{ fontSize:11, color:'rgba(42,31,14,0.35)', letterSpacing:'0.15em', textTransform:'uppercase', marginTop:12, fontFamily:sans }}>Foto Produk</p>
            </div>
            {product.badge && (
              <div style={{ position:'absolute', top:16, left:16, background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', padding:'4px 10px', fontFamily:sans }}>
                {product.badge}
              </div>
            )}
          </div>
          {/* Thumbnail row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ aspectRatio:'1', background:'linear-gradient(145deg,#F5ECD7,#EDD9B8)', borderRadius:4, border: i===1 ? `2px solid ${G}` : '2px solid transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity: i===1 ? 1 : 0.5 }}>
                <span style={{ fontSize:24 }}>👗</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — DETAILS */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Category */}
          <div style={{ fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:G }}>
            {product.category}
          </div>

          {/* Name */}
          <h1 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D, lineHeight:1.2 }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display:'flex', alignItems:'center', gap:12, paddingBottom:20, borderBottom:`1px solid rgba(193,152,60,0.15)` }}>
            <span style={{ fontSize:28, fontWeight:600, fontFamily:serif, color:D }}>
              Rp {(product.price||0).toLocaleString('id-ID')}
            </span>
            <span style={{ fontSize:11, color:'#6B9B6B', background:'#E8F5E8', padding:'3px 10px', borderRadius:20 }}>
              Stok: {product.stock || 20}
            </span>
          </div>

          {/* Description */}
          <p style={{ fontSize:13, lineHeight:1.85, color:'#7A6040', fontWeight:300 }}>
            {product.description}
          </p>

          {/* Color selector */}
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9A8060', marginBottom:10 }}>
              Warna: <span style={{ color:D, fontWeight:600 }}>{selectedColor}</span>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {(product.colors || []).map(cn => (
                <button key={cn} onClick={() => setSelectedColor(cn)}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', border:`2px solid`, borderColor: selectedColor===cn ? D : 'rgba(193,152,60,0.2)', borderRadius:4, background: selectedColor===cn ? D : 'transparent', cursor:'pointer', transition:'all 0.2s' }}>
                  <div style={{ width:12, height:12, borderRadius:'50%', background:COLORS_MAP[cn]||'#ccc', border:'1px solid rgba(0,0,0,0.1)', flexShrink:0 }} />
                  <span style={{ fontSize:11, color: selectedColor===cn ? C : D, fontFamily:sans }}>{cn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9A8060', marginBottom:10 }}>
              Ukuran: <span style={{ color:D, fontWeight:600 }}>{selectedSize}</span>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {(product.sizes || []).map(s => (
                <button key={s} onClick={() => setSelectedSize(s)}
                  style={{ width:44, height:44, border:`2px solid`, borderColor: selectedSize===s ? D : 'rgba(193,152,60,0.2)', borderRadius:4, background: selectedSize===s ? D : 'transparent', color: selectedSize===s ? C : D, fontSize:12, cursor:'pointer', fontFamily:sans, fontWeight: selectedSize===s ? 700 : 400, transition:'all 0.2s' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9A8060', marginBottom:10 }}>Jumlah</div>
            <div style={{ display:'flex', alignItems:'center', gap:0, width:'fit-content', border:`1px solid rgba(193,152,60,0.25)`, borderRadius:4, overflow:'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q-1))}
                style={{ width:40, height:40, border:'none', background:LB, cursor:'pointer', fontSize:18, color:D, display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='#E8D5A8'}
                onMouseLeave={e=>e.currentTarget.style.background=LB}>−</button>
              <span style={{ width:48, height:40, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:600, color:D, borderLeft:`1px solid rgba(193,152,60,0.2)`, borderRight:`1px solid rgba(193,152,60,0.2)` }}>{qty}</span>
              <button onClick={() => setQty(q => q+1)}
                style={{ width:40, height:40, border:'none', background:LB, cursor:'pointer', fontSize:18, color:D, display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='#E8D5A8'}
                onMouseLeave={e=>e.currentTarget.style.background=LB}>+</button>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', paddingTop:8 }}>
            <button onClick={handleAddToCart}
              disabled={!selectedColor || !selectedSize}
              style={{ flex:1, minWidth:140, padding:'14px 24px', background:`linear-gradient(135deg,${G},#D4AA50,${G})`, color:C, border:'none', borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans, boxShadow:'0 6px 20px rgba(193,152,60,0.3)', transition:'all 0.3s', opacity: (!selectedColor||!selectedSize) ? 0.6 : 1 }}>
              + Keranjang
            </button>
            <button onClick={handleBuyNow}
              disabled={!selectedColor || !selectedSize}
              style={{ flex:1, minWidth:140, padding:'14px 24px', background:'transparent', color:D, border:`1px solid rgba(42,31,14,0.3)`, borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans, transition:'all 0.3s', opacity: (!selectedColor||!selectedSize) ? 0.6 : 1 }}>
              Beli Sekarang
            </button>
          </div>

          {/* Shipping info */}
          <div style={{ background:LB, borderRadius:4, padding:'16px', border:`1px solid rgba(193,152,60,0.12)` }}>
            <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:G, marginBottom:10 }}>Info Pengiriman</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {[
                ['🚚','Zona 1 (Jawa & Bali)','Gratis ongkir'],
                ['📦','Zona 2 (Sumatera, Kalimantan, Sulawesi)','Rp 15.000 + Rp 10.000/kg'],
                ['📦','Zona 3 (NTB, NTT, Maluku)','Rp 25.000 + Rp 15.000/kg'],
                ['📦','Zona 4 (Papua)','Rp 35.000 + Rp 20.000/kg'],
              ].map(([icon, zone, rate]) => (
                <div key={zone} style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#7A6040' }}>
                  <span>{icon} {zone}</span>
                  <span style={{ fontWeight:600, color:D }}>{rate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weight info */}
          <div style={{ fontSize:11, color:'#9A8060' }}>
            ⚖️ Berat produk: {product.weight || 300}g
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <section style={{ padding:'0 48px 80px', borderTop:`1px solid rgba(193,152,60,0.1)`, paddingTop:48 }}>
          <style>{`@media(max-width:768px){.related-section{padding:0 24px 56px !important; padding-top:40px !important}}`}</style>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:8 }}>✦ Mungkin Kamu Suka</div>
            <h2 style={{ fontSize:28, fontWeight:400, fontFamily:serif, color:D }}>
              Produk <span style={{ fontStyle:'italic', color:G }}>Serupa</span>
            </h2>
          </div>
          <div className="prod-grid">
            {related.map(p => (
              <Link key={p.id} to={`/shop/${p.slug}`} style={{ textDecoration:'none', color:'inherit', display:'block', transition:'transform 0.3s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-5px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                <div className="prod-img" style={{ borderRadius:4, background:p.bg||'linear-gradient(145deg,#F0E4C8,#E8D5A8)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, border:'1px solid rgba(193,152,60,0.15)' }}>
                  <span style={{ fontSize:48 }}>👗</span>
                  {p.badge && <div style={{ position:'absolute', top:10, left:10, background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, fontSize:8, padding:'3px 8px', fontFamily:sans }}>{p.badge}</div>}
                </div>
                <div style={{ fontSize:14, fontFamily:serif, color:D, marginBottom:2 }}>{p.name}</div>
                <div style={{ fontSize:9, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:6 }}>{p.category}</div>
                <div style={{ fontSize:14, fontWeight:600, fontFamily:serif, color:D }}>Rp {(p.price||0).toLocaleString('id-ID')}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
