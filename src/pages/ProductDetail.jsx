import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductBySlug } from '../lib/api.js'
import { getBySlug, getRelated as getRelatedLocal } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'

const G = "#C1983C", D = "#2A1F0E", C = "#FDFBF7", LB = "#F7F2E8"
const serif = "'Cormorant Garamond',serif"
const sans = "'Didact Gothic',sans-serif"

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { window.scrollTo(0,0); loadProduct() }, [slug])

  async function loadProduct() {
    setLoading(true); setError(null)
    try {
      const data = await getProductBySlug(slug)
      const p = data || getBySlug(slug)
      if (!p) { setError('Produk tidak ditemukan'); setLoading(false); return }
      setProduct(p)
      const firstColor = p.color_images?.[0]?.name || (Array.isArray(p.colors) ? p.colors[0] : null)
      setSelectedColor(firstColor)
      const sizes = Array.isArray(p.sizes) ? p.sizes : []
      setSelectedSize(sizes[0] || null)
      setActiveIndex(0)
      try {
        const { getAllProducts } = await import('../lib/api.js')
        const all = await getAllProducts()
        setRelated((all||[]).filter(x => x.category===p.category && x.id!==p.id).slice(0,3))
      } catch { setRelated(getRelatedLocal(p)) }
    } catch {
      const p = getBySlug(slug)
      if (p) {
        setProduct(p)
        setSelectedColor((p.colors||[])[0]||null)
        setSelectedSize((Array.isArray(p.sizes)?p.sizes:[])[0]||null)
        setRelated(getRelatedLocal(p))
      } else { setError('Produk tidak ditemukan') }
    } finally { setLoading(false) }
  }

  // Build full image list
  function getAllImages() {
    if (!product) return []
    const imgs = [...(product.images||[])]
    // Add color images that aren't already in main images
    if (product.color_images?.length > 0) {
      product.color_images.forEach(c => {
        if (c.image_url && !imgs.includes(c.image_url)) imgs.push(c.image_url)
      })
    }
    return imgs
  }

  const allImages = getAllImages()

  // When color selected, jump to that color's image
  function selectColor(name) {
    setSelectedColor(name)
    const colorObj = product?.color_images?.find(c => c.name === name)
    if (colorObj?.image_url) {
      const idx = allImages.indexOf(colorObj.image_url)
      if (idx !== -1) setActiveIndex(idx)
    }
  }

  const prevImage = useCallback(() => {
    setActiveIndex(i => i === 0 ? allImages.length - 1 : i - 1)
  }, [allImages.length])

  const nextImage = useCallback(() => {
    setActiveIndex(i => i === allImages.length - 1 ? 0 : i + 1)
  }, [allImages.length])

  // Keyboard navigation
  useEffect(() => {
    const fn = e => {
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [prevImage, nextImage])

  function getColorHex(name) {
    const colorObj = product?.color_images?.find(c => c.name === name)
    if (colorObj?.hex) return colorObj.hex
    const map = { "Cream":"#F5ECD7","Sage Green":"#A8B59C","Dusty Rose":"#E8C5C8","Warm Brown":"#C9A882","Off White":"#F0EDE8","Classic Black":"#2B2B2B","Navy":"#1B2A4A","Mocha":"#8B6B4A" }
    return map[name] || '#ccc'
  }

  function handleAddToCart() {
    addToCart(product, selectedColor||'Default', selectedSize||'One Size', qty)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  function handleBuyNow() {
    addToCart(product, selectedColor||'Default', selectedSize||'One Size', qty)
    navigate('/cart')
  }

  const colorList = product?.color_images?.length > 0
    ? product.color_images.map(c => c.name)
    : (Array.isArray(product?.colors) ? product.colors : [])

  const sizeList = Array.isArray(product?.sizes) ? product.sizes : []
  const currentImage = allImages[activeIndex] || null

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
      <div style={{ padding:'14px 48px', borderBottom:`1px solid rgba(193,152,60,0.08)`, display:'flex', gap:8, alignItems:'center', fontSize:11, color:'#9A8060', flexWrap:'wrap' }}>
        <style>{`@media(max-width:768px){.breadcrumb-bar{padding:10px 24px !important}}`}</style>
        <Link to="/" style={{ color:'#9A8060', textDecoration:'none' }}>Home</Link>
        <span>/</span>
        <Link to="/shop" style={{ color:'#9A8060', textDecoration:'none' }}>Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} style={{ color:'#9A8060', textDecoration:'none' }}>{product.category}</Link>
        <span>/</span>
        <span style={{ color:D }}>{product.name}</span>
      </div>

      {/* MAIN PRODUCT LAYOUT */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, padding:'40px 48px', maxWidth:1200, margin:'0 auto' }}>
        <style>{`
          .product-main-layout { display:grid; grid-template-columns:1fr 1fr; gap:56px; padding:40px 48px; max-width:1200px; margin:0 auto; }
          @media(max-width:768px){
            .product-main-layout { grid-template-columns:1fr !important; padding:20px 24px !important; gap:24px !important; }
            .nav-arrow { width:36px !important; height:36px !important; font-size:16px !important; }
          }
        `}</style>

        {/* LEFT — IMAGES */}
        <div>
          {/* Main image with nav arrows */}
          <div style={{ aspectRatio:'3/4', background: currentImage ? 'none' : (product.bg||'linear-gradient(145deg,#F0E4C8,#E8D5A8)'), borderRadius:4, overflow:'hidden', marginBottom:10, border:'1px solid rgba(193,152,60,0.12)', boxShadow:'0 8px 40px rgba(42,31,14,0.08)', position:'relative' }}>
            {currentImage ? (
              <img src={currentImage} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            ) : (
              <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
                <span style={{ fontSize:80 }}>👗</span>
                <p style={{ fontSize:10, color:'rgba(42,31,14,0.3)', letterSpacing:'0.15em', textTransform:'uppercase' }}>Foto Produk</p>
              </div>
            )}

            {product.badge && (
              <div style={{ position:'absolute', top:14, left:14, background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', padding:'4px 10px', fontFamily:sans }}>
                {product.badge}
              </div>
            )}

            {/* Prev / Next arrows */}
            {allImages.length > 1 && (
              <>
                <button className="nav-arrow" onClick={prevImage}
                  style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', width:44, height:44, borderRadius:'50%', background:'rgba(253,251,247,0.92)', border:'none', cursor:'pointer', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 12px rgba(42,31,14,0.15)', transition:'all 0.2s', zIndex:2 }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(253,251,247,1)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(253,251,247,0.92)'}>
                  ‹
                </button>
                <button className="nav-arrow" onClick={nextImage}
                  style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', width:44, height:44, borderRadius:'50%', background:'rgba(253,251,247,0.92)', border:'none', cursor:'pointer', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 12px rgba(42,31,14,0.15)', transition:'all 0.2s', zIndex:2 }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(253,251,247,1)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(253,251,247,0.92)'}>
                  ›
                </button>
                {/* Image counter */}
                <div style={{ position:'absolute', bottom:12, right:12, background:'rgba(42,31,14,0.5)', color:C, fontSize:10, padding:'3px 8px', borderRadius:20, fontFamily:sans }}>
                  {activeIndex+1} / {allImages.length}
                </div>
              </>
            )}
          </div>

          {/* ALL Thumbnails — no limit */}
          {allImages.length > 1 && (
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {allImages.map((img, i) => {
                const colorForImg = product.color_images?.find(c => c.image_url === img)
                return (
                  <div key={i} onClick={() => setActiveIndex(i)}
                    style={{ width:64, height:64, borderRadius:4, overflow:'hidden', border:`2px solid`, borderColor: activeIndex===i ? G : 'transparent', cursor:'pointer', opacity: activeIndex===i ? 1 : 0.65, transition:'all 0.2s', flexShrink:0, position:'relative' }}>
                    <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    {/* Color indicator dot */}
                    {colorForImg && (
                      <div style={{ position:'absolute', bottom:2, right:2, width:10, height:10, borderRadius:'50%', background:colorForImg.hex, border:'1.5px solid white' }} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* RIGHT — DETAILS */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:G }}>{product.category}</div>

          <h1 style={{ fontSize:34, fontWeight:400, fontFamily:serif, color:D, lineHeight:1.2 }}>{product.name}</h1>

          <div style={{ display:'flex', alignItems:'center', gap:12, paddingBottom:18, borderBottom:`1px solid rgba(193,152,60,0.15)` }}>
            <span style={{ fontSize:26, fontWeight:600, fontFamily:serif, color:D }}>Rp {(product.price||0).toLocaleString('id-ID')}</span>
            <span style={{ fontSize:11, color:'#6B9B6B', background:'#E8F5E8', padding:'3px 10px', borderRadius:20 }}>Stok: {product.stock||20}</span>
          </div>

          <p style={{ fontSize:13, lineHeight:1.85, color:'#7A6040', fontWeight:300 }}>{product.description}</p>

          {/* COLOR SELECTOR */}
          {colorList.length > 0 && (
            <div>
              <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9A8060', marginBottom:10 }}>
                Warna: <span style={{ color:D, fontWeight:600 }}>{selectedColor}</span>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {colorList.map(cn => {
                  const colorObj = product.color_images?.find(c => c.name === cn)
                  const isSelected = selectedColor === cn
                  return (
                    <button key={cn} onClick={() => selectColor(cn)}
                      style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', border:`2px solid`, borderColor: isSelected ? D : 'rgba(193,152,60,0.2)', borderRadius:4, background: isSelected ? D : 'transparent', cursor:'pointer', transition:'all 0.2s' }}>
                      {colorObj?.image_url ? (
                        <img src={colorObj.image_url} alt={cn} style={{ width:20, height:20, objectFit:'cover', borderRadius:2, flexShrink:0 }} />
                      ) : (
                        <div style={{ width:14, height:14, borderRadius:'50%', background:getColorHex(cn), border:'1px solid rgba(0,0,0,0.1)', flexShrink:0 }} />
                      )}
                      <span style={{ fontSize:11, color: isSelected ? C : D, fontFamily:sans }}>{cn}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR */}
          {sizeList.length > 0 && (
            <div>
              <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9A8060', marginBottom:10 }}>
                Ukuran: <span style={{ color:D, fontWeight:600 }}>{selectedSize}</span>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {sizeList.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    style={{ width:44, height:44, border:`2px solid`, borderColor: selectedSize===s ? D : 'rgba(193,152,60,0.2)', borderRadius:4, background: selectedSize===s ? D : 'transparent', color: selectedSize===s ? C : D, fontSize:12, cursor:'pointer', fontFamily:sans, fontWeight: selectedSize===s ? 700 : 400, transition:'all 0.2s' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QTY */}
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9A8060', marginBottom:10 }}>Jumlah</div>
            <div style={{ display:'flex', alignItems:'center', width:'fit-content', border:`1px solid rgba(193,152,60,0.25)`, borderRadius:4, overflow:'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ width:40, height:40, border:'none', background:LB, cursor:'pointer', fontSize:18, color:D, transition:'background 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='#E8D5A8'}
                onMouseLeave={e=>e.currentTarget.style.background=LB}>−</button>
              <span style={{ width:48, height:40, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:600, color:D, borderLeft:`1px solid rgba(193,152,60,0.2)`, borderRight:`1px solid rgba(193,152,60,0.2)` }}>{qty}</span>
              <button onClick={() => setQty(q => q+1)} style={{ width:40, height:40, border:'none', background:LB, cursor:'pointer', fontSize:18, color:D, transition:'background 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='#E8D5A8'}
                onMouseLeave={e=>e.currentTarget.style.background=LB}>+</button>
            </div>
          </div>

          {/* BUTTONS */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', paddingTop:8 }}>
            <button onClick={handleAddToCart}
              style={{ flex:1, minWidth:140, padding:'14px 24px', background:`linear-gradient(135deg,${G},#D4AA50,${G})`, color:C, border:'none', borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans, boxShadow:'0 6px 20px rgba(193,152,60,0.3)', transition:'all 0.3s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 10px 28px rgba(193,152,60,0.45)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 6px 20px rgba(193,152,60,0.3)'}}>
              + Keranjang
            </button>
            <button onClick={handleBuyNow}
              style={{ flex:1, minWidth:140, padding:'14px 24px', background:D, color:C, border:'none', borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans, transition:'all 0.3s' }}
              onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
              onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
              Beli Sekarang
            </button>
          </div>

          {/* SHIPPING INFO */}
          <div style={{ background:LB, borderRadius:4, padding:'16px', border:`1px solid rgba(193,152,60,0.12)` }}>
            <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:G, marginBottom:10 }}>Info Pengiriman</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {[
                ['🚚','Zona 1 — Jawa & Bali','Gratis'],
                ['📦','Zona 2 — Sumatera, Kalimantan, Sulawesi','Rp15.000 + Rp10.000/kg'],
                ['📦','Zona 3 — NTB, NTT, Maluku','Rp25.000 + Rp15.000/kg'],
                ['📦','Zona 4 — Papua','Rp35.000 + Rp20.000/kg'],
              ].map(([icon,zone,rate]) => (
                <div key={zone} style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#7A6040', gap:8 }}>
                  <span>{icon} {zone}</span>
                  <span style={{ fontWeight:600, color:D, flexShrink:0 }}>{rate}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize:11, color:'#9A8060' }}>⚖️ Berat: {product.weight||300}g</div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <section style={{ padding:'48px 48px 80px', borderTop:`1px solid rgba(193,152,60,0.1)` }}>
          <style>{`@media(max-width:768px){.related-pad{padding:32px 24px 56px !important}}`}</style>
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:8 }}>✦ Mungkin Kamu Suka</div>
            <h2 style={{ fontSize:28, fontWeight:400, fontFamily:serif, color:D }}>Produk <span style={{ fontStyle:'italic', color:G }}>Serupa</span></h2>
          </div>
          <div className="prod-grid">
            {related.map(p => {
              const thumb = p.images?.[0] || null
              return (
                <Link key={p.id} to={`/shop/${p.slug}`} style={{ textDecoration:'none', color:'inherit', display:'block', transition:'transform 0.3s' }}
                  onMouseEnter={e=>e.currentTarget.style.transform='translateY(-5px)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                  <div className="prod-img" style={{ borderRadius:4, background:thumb?'none':(p.bg||'linear-gradient(145deg,#F0E4C8,#E8D5A8)'), display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, border:'1px solid rgba(193,152,60,0.15)', overflow:'hidden', position:'relative' }}>
                    {thumb ? <img src={thumb} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontSize:48 }}>👗</span>}
                    {p.badge && <div style={{ position:'absolute', top:10, left:10, background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, fontSize:8, padding:'3px 8px', fontFamily:sans }}>{p.badge}</div>}
                  </div>
                  <div style={{ fontSize:14, fontFamily:serif, color:D, marginBottom:2 }}>{p.name}</div>
                  <div style={{ fontSize:9, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:6 }}>{p.category}</div>
                  <div style={{ fontSize:14, fontWeight:600, fontFamily:serif, color:D }}>Rp {(p.price||0).toLocaleString('id-ID')}</div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
