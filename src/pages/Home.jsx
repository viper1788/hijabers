import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllProducts } from '../lib/api.js'
import { products as localProducts, CATEGORIES } from '../data/products.js'

const G="#C1983C", D="#2A1F0E", C="#FDFBF7", LB="#F7F2E8"
const serif = "'Cormorant Garamond',serif"
const sans = "'Didact Gothic',sans-serif"

const CAT_ICONS = {
  "Wide Pants":"👖","Tapered Pants":"🩱","Sweat Pants":"🩲","Wide Skirt":"👗",
  "Cardigan":"🧥","Knit Top":"👚","Shirt":"👔","Jaket":"🧣"
}

const testimonials = [
  { name:"Aisyah R.", city:"Jakarta", text:"Bahannya adem banget, cocok buat kuliah sehari-hari. Warnanya persis foto!" },
  { name:"Fatimah N.", city:"Bandung", text:"Sudah order 3x, kualitasnya konsisten. Pengiriman cepat dan packaging rapi!" },
  { name:"Nur Indah", city:"Surabaya", text:"Finally nemu modest wear yang bener-bener campus to career vibes. Love it! 🤍" },
]

export default function Home() {
  const [activeTesti, setActiveTesti] = useState(0)
  const [products, setProducts] = useState([])
  const [categoryImages, setCategoryImages] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const catRef = useRef(null)
  const shopRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setActiveTesti(p => (p+1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { window.scrollTo(0,0); loadProducts() }, [])

  async function loadProducts() {
    try {
      const data = await getAllProducts()
      const prods = data && data.length > 0 ? data : localProducts
      setProducts(prods)
      // Build category images map
      const catImgs = {}
      CATEGORIES.forEach(cat => {
        const catProds = prods.filter(p => p.category === cat)
        const withImg = catProds.find(p => p.images?.[0])
        if (withImg) catImgs[cat] = withImg.images[0]
      })
      setCategoryImages(catImgs)
    } catch {
      setProducts(localProducts)
    } finally { setLoading(false) }
  }

  const featured = products.filter(p => p.badge).slice(0, 3)
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 3)

  // Only show categories that have at least 1 product
  const activeCategories = CATEGORIES.filter(cat => products.some(p => p.category === cat))

  return (
    <div style={{ fontFamily:sans }}>

      {/* HERO */}
      <section className="hero-grid" style={{ background:'linear-gradient(160deg,#FDFBF7 0%,#F5EDD8 55%,#EDE0C4 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'5%', right:'5%', width:400, height:400, background:'radial-gradient(circle,rgba(193,152,60,0.08) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

        {/* Mobile hero image */}
        <div className="hero-right-mobile">
          <div style={{ width:200, height:260, borderRadius:'100px 100px 70px 70px', overflow:'hidden', position:'relative', zIndex:2, boxShadow:'0 20px 60px rgba(193,152,60,0.25)', border:'1px solid rgba(193,152,60,0.2)', animation:'float 6s ease infinite' }}>
            <img src="https://hijabers.id/uploads/products/hero/1.jpg" alt="Hijabers Collective" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <img src="/logo.png" alt="h" style={{ position:'absolute', bottom:10, right:10, width:32, height:32, objectFit:'contain', opacity:0.85, filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} />
          </div>
          <div style={{ position:'absolute', top:20, right:'12%', background:'rgba(253,251,247,0.95)', backdropFilter:'blur(12px)', border:'1px solid rgba(193,152,60,0.2)', borderRadius:10, padding:'8px 14px', boxShadow:'0 4px 16px rgba(42,31,14,0.08)', zIndex:3 }}>
            <div style={{ fontSize:12, fontFamily:serif, color:D }}>New In 🌸</div>
            <div style={{ fontSize:7, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginTop:2 }}>Koleksi Terbaru</div>
          </div>
          <div style={{ position:'absolute', bottom:20, left:'8%', background:'rgba(253,251,247,0.95)', backdropFilter:'blur(12px)', border:'1px solid rgba(193,152,60,0.2)', borderRadius:10, padding:'8px 14px', boxShadow:'0 4px 16px rgba(42,31,14,0.08)', zIndex:3 }}>
            <div style={{ fontSize:12, fontFamily:serif, color:D }}>Free Ongkir 🚚</div>
            <div style={{ fontSize:7, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginTop:2 }}>Jawa & Bali</div>
          </div>
        </div>

        {/* Hero Text */}
        <div style={{ display:'flex', flexDirection:'column', gap:24, zIndex:2, animation:'fadeUp 0.8s ease forwards' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:28, height:1, background:G }} />
            <span style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, fontFamily:sans }}>New Collection 2026</span>
          </div>
          <h1 className="hero-title" style={{ fontWeight:400, lineHeight:1.05, letterSpacing:'-0.02em', fontFamily:serif, color:D }}>
            Modest is<br />
            <span style={{ fontStyle:'italic', background:'linear-gradient(135deg,#C1983C,#D4AA50,#B8891E)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Beautiful.</span>
          </h1>
          <p style={{ fontSize:14, lineHeight:1.85, color:'#7A6040', maxWidth:400, fontWeight:300 }}>
            <em>Modest wear for campus to career</em> — koleksi premium yang nyaman dari kuliah hingga kerja, setiap hari.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <button onClick={() => shopRef.current?.scrollIntoView({behavior:'smooth'})}
              style={{ background:`linear-gradient(135deg,${G},#D4AA50,${G})`, color:C, border:'none', cursor:'pointer', padding:'13px 32px', borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', fontFamily:sans, boxShadow:'0 6px 20px rgba(193,152,60,0.3)', transition:'all 0.3s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 10px 28px rgba(193,152,60,0.45)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 6px 20px rgba(193,152,60,0.3)'}}>
              Shop Now
            </button>
            <button onClick={() => catRef.current?.scrollIntoView({behavior:'smooth'})}
              style={{ background:'transparent', color:D, border:'1px solid rgba(42,31,14,0.25)', cursor:'pointer', padding:'13px 32px', borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', fontFamily:sans, transition:'all 0.3s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.color=G}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(42,31,14,0.25)';e.currentTarget.style.color=D}}>
              Lihat Koleksi
            </button>
          </div>
          <div className="stats" style={{ paddingTop:24, borderTop:'1px solid rgba(193,152,60,0.2)', marginTop:4 }}>
            {[["500+","Happy Customers"],[`${products.length||24}`,"Koleksi"],["4.9★","Rating"]].map(([num,lbl]) => (
              <div key={lbl}>
                <div style={{ fontSize:24, fontWeight:600, fontFamily:serif, background:'linear-gradient(135deg,#C1983C,#D4AA50)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{num}</div>
                <div style={{ fontSize:9, color:'#9A8060', letterSpacing:'0.2em', textTransform:'uppercase', marginTop:4 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Hero Right */}
        <div className="hero-right">
          <div style={{ width:320, height:460, borderRadius:'160px 160px 100px 100px', overflow:'hidden', position:'relative', zIndex:2, boxShadow:'0 32px 80px rgba(193,152,60,0.2)', border:'1px solid rgba(193,152,60,0.2)', animation:'float 6s ease infinite' }}>
            <img src="https://hijabers.id/uploads/products/hero/1.jpg" alt="Hijabers Collective" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <img src="/logo.png" alt="h" style={{ position:'absolute', bottom:18, right:18, width:48, height:48, objectFit:'contain', opacity:0.9, filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
          </div>
          <div style={{ position:'absolute', top:70, right:-10, zIndex:3, background:'rgba(253,251,247,0.95)', backdropFilter:'blur(12px)', border:'1px solid rgba(193,152,60,0.2)', borderRadius:12, padding:'12px 16px', boxShadow:'0 8px 32px rgba(42,31,14,0.08)' }}>
            <div style={{ fontSize:14, fontFamily:serif, color:D }}>New In 🌸</div>
            <div style={{ fontSize:8, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginTop:3 }}>Koleksi Terbaru</div>
          </div>
          <div style={{ position:'absolute', bottom:80, left:-20, zIndex:3, background:'rgba(253,251,247,0.95)', backdropFilter:'blur(12px)', border:'1px solid rgba(193,152,60,0.2)', borderRadius:12, padding:'12px 16px', boxShadow:'0 8px 32px rgba(42,31,14,0.08)' }}>
            <div style={{ fontSize:14, fontFamily:serif, color:D }}>Free Ongkir 🚚</div>
            <div style={{ fontSize:8, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginTop:3 }}>Jawa & Bali</div>
          </div>
          <div style={{ position:'absolute', width:360, height:480, borderRadius:'180px 180px 120px 120px', border:'1px solid rgba(193,152,60,0.12)', zIndex:1 }} />
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background:`linear-gradient(135deg,${G},#D4AA50,${G})`, padding:'12px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', animation:'marquee 28s linear infinite', whiteSpace:'nowrap' }}>
          {[...Array(6)].map((_,i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:20, marginRight:20, fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:C, fontFamily:sans }}>
              {["✦ Modest wear for campus to career","✦ Free Ongkir Jawa & Bali","✦ Premium Quality","✦ Mon–Sat 08.00–17.00 WIB"].map(t=>(
                <span key={t}>{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section" ref={catRef}>
        <div style={{ marginBottom:36 }}>
          <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>✦ Browse by Style</div>
          <h2 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D }}>Temukan <span style={{ fontStyle:'italic', color:G }}>Gayamu</span></h2>
        </div>
        <div className="cat-grid">
          {activeCategories.map(cat => {
            const catImg = categoryImages[cat] || null
            return (
              <div key={cat} onClick={() => navigate(`/shop?category=${encodeURIComponent(cat)}`)}
                style={{ background:LB, borderRadius:4, cursor:'pointer', transition:'all 0.3s', border:'1px solid rgba(193,152,60,0.1)', overflow:'hidden' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(193,152,60,0.15)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
                {/* Category image or icon */}
                {catImg ? (
                  <div style={{ height:120, overflow:'hidden', position:'relative' }}>
                    <img src={catImg} alt={cat} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }}
                      onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                      onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'} />
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(42,31,14,0.3) 0%, transparent 60%)' }} />
                  </div>
                ) : (
                  <div style={{ height:80, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, background:'linear-gradient(145deg,#F0E4C8,#E8D5A8)' }}>
                    {CAT_ICONS[cat]||'👗'}
                  </div>
                )}
                <div style={{ padding:'12px 16px' }}>
                  <div style={{ fontSize:14, fontWeight:500, fontFamily:serif, color:D, marginBottom:2 }}>{cat}</div>
                  <div style={{ fontSize:9, color:G, letterSpacing:'0.2em', textTransform:'uppercase' }}>Shop Now →</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section style={{ padding:'0 48px 80px' }} ref={shopRef}>
        <style>{`@media(max-width:768px){.home-prod-section{padding:0 24px 56px !important}}`}</style>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36, flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:10 }}>✦ Pilihan Editor</div>
            <h2 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D }}>Best <span style={{ fontStyle:'italic', color:G }}>Sellers</span></h2>
          </div>
          <Link to="/shop" style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:G, borderBottom:`1px solid ${G}`, paddingBottom:2, whiteSpace:'nowrap' }}>Lihat Semua →</Link>
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:48 }}>
            <div style={{ width:28, height:28, border:`3px solid rgba(193,152,60,0.2)`, borderTop:`3px solid ${G}`, borderRadius:'50%', animation:'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div className="prod-grid">
            {displayProducts.map((p,i) => {
              const thumb = p.images?.[0] || null
              const colorList = p.color_images?.length > 0 ? p.color_images : []
              return (
                <Link key={p.id} to={`/shop/${p.slug}`} style={{ textDecoration:'none', color:'inherit', display:'block', transition:'transform 0.3s' }}
                  onMouseEnter={e=>e.currentTarget.style.transform='translateY(-6px)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                  <div className="prod-img-tall" style={{ borderRadius:4, background: thumb?'none':(p.bg||'linear-gradient(145deg,#F0E4C8,#E8D5A8)'), display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', marginBottom:14, border:'1px solid rgba(193,152,60,0.15)', boxShadow:'0 4px 16px rgba(42,31,14,0.06)' }}>
                    {thumb
                      ? <img src={thumb} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <>
                          <img src="/logo.png" alt="" style={{ position:'absolute', width:50, height:50, objectFit:'contain', opacity:0.07, bottom:8, right:8 }} />
                          <span style={{ fontSize:56, zIndex:2 }}>{CAT_ICONS[p.category]||'👗'}</span>
                        </>
                    }
                    {p.badge && <div style={{ position:'absolute', top:12, left:12, background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', padding:'3px 8px' }}>{p.badge}</div>}
                    {colorList.length > 0 && (
                      <div style={{ position:'absolute', bottom:10, left:10, display:'flex', gap:3 }}>
                        {colorList.slice(0,5).map(c => (
                          <div key={c.name} title={c.name} style={{ width:10, height:10, borderRadius:'50%', background:c.hex||'#ccc', border:'1.5px solid rgba(255,255,255,0.7)' }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize:15, fontWeight:500, fontFamily:serif, color:D, marginBottom:2 }}>{p.name}</div>
                  <div style={{ fontSize:9, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:8 }}>{p.category}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:15, fontWeight:600, fontFamily:serif, color:D }}>Rp {(p.price||0).toLocaleString('id-ID')}</span>
                    <span style={{ fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:G, borderBottom:`1px solid ${G}` }}>Add →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* PROMO BANNER */}
      <div className="banner-margin" style={{ background:'linear-gradient(135deg,#F0E4C8 0%,#E8D5A8 50%,#DEC88A 100%)', borderRadius:4, border:'1px solid rgba(193,152,60,0.2)', overflow:'hidden' }}>
        <div className="banner-grid">
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <span style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#9A6E1A' }}>✦ Special Offer</span>
            <h2 style={{ fontSize:38, fontWeight:400, fontFamily:serif, color:D, lineHeight:1.1 }}>Free Ongkir<br /><span style={{ fontStyle:'italic', color:'#9A6E1A' }}>Jawa & Bali</span></h2>
            <p style={{ fontSize:13, color:'#6A5030', lineHeight:1.8, fontWeight:300 }}>Semua order ke Jawa dan Bali gratis ongkir, tanpa minimum pembelian.</p>
            <Link to="/shop" style={{ display:'inline-block', background:D, color:'#F0E4C8', padding:'13px 32px', borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', fontFamily:sans, alignSelf:'flex-start', boxShadow:'0 6px 20px rgba(42,31,14,0.2)', transition:'all 0.3s' }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='none'}>
              Shop Now →
            </Link>
          </div>
          <div className="banner-logo">
            <img src="/logo.png" alt="h" style={{ width:150, height:150, objectFit:'contain', opacity:0.4 }} />
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section className="section" style={{ background:LB }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:10 }}>✦ Customer Stories</div>
          <h2 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D }}>Kata <span style={{ fontStyle:'italic', color:G }}>Mereka</span></h2>
        </div>
        <div style={{ maxWidth:560, margin:'0 auto', textAlign:'center', padding:'0 16px' }}>
          <div style={{ fontSize:16, color:G, marginBottom:20, letterSpacing:6 }}>★★★★★</div>
          <p style={{ fontSize:20, fontStyle:'italic', fontFamily:serif, lineHeight:1.65, marginBottom:24, color:D }}>"{testimonials[activeTesti].text}"</p>
          <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9A8060' }}>
            — {testimonials[activeTesti].name}, {testimonials[activeTesti].city}
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:32 }}>
            {testimonials.map((_,i) => (
              <div key={i} onClick={() => setActiveTesti(i)} style={{ width:i===activeTesti?24:6, height:6, borderRadius:3, background:i===activeTesti?G:'#D4C4A8', transition:'all 0.3s', cursor:'pointer' }} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
