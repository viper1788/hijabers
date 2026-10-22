import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllProducts } from '../lib/api.js'
import { products as localProducts, CATEGORIES } from '../data/products.js'
import { rp, seriesQty, unitPrice, TIER2_MIN, TIER3_MIN } from '../lib/pricing.js'

const G="#B8975A", D="#2B2926", C="#FAFAF8", LB="#F2F0EC"
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
      <section className="hero-grid" style={{ background:'linear-gradient(160deg,#FAFAF8 0%,#F4F2EE 55%,#EAE7E1 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'5%', right:'5%', width:400, height:400, background:'radial-gradient(circle,rgba(184,151,90,0.08) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

        {/* Mobile hero image */}
        <div className="hero-right-mobile">
          <div style={{ width:200, height:260, borderRadius:'100px 100px 70px 70px', overflow:'hidden', position:'relative', zIndex:2, boxShadow:'0 20px 60px rgba(184,151,90,0.25)', border:'1px solid rgba(184,151,90,0.2)', animation:'float 6s ease infinite' }}>
            <img src="https://hijabers.id/uploads/products/hero/1.jpg" alt="Hijabers Collective" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <img src="/logo.png" alt="h" style={{ position:'absolute', bottom:10, right:10, width:32, height:32, objectFit:'contain', opacity:0.85, filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} />
          </div>
          <div style={{ position:'absolute', top:20, right:'12%', background:'rgba(250,250,248,0.95)', backdropFilter:'blur(12px)', border:'1px solid rgba(184,151,90,0.2)', borderRadius:10, padding:'8px 14px', boxShadow:'0 4px 16px rgba(43,41,38,0.08)', zIndex:3 }}>
            <div style={{ fontSize:12, fontFamily:serif, color:D }}>Produksi Sendiri</div>
            <div style={{ fontSize:7, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginTop:2 }}>Konveksi</div>
          </div>
          <div style={{ position:'absolute', bottom:20, left:'8%', background:'rgba(250,250,248,0.95)', backdropFilter:'blur(12px)', border:'1px solid rgba(184,151,90,0.2)', borderRadius:10, padding:'8px 14px', boxShadow:'0 4px 16px rgba(43,41,38,0.08)', zIndex:3 }}>
            <div style={{ fontSize:12, fontFamily:serif, color:D }}>Harga Grosir 🏷️</div>
            <div style={{ fontSize:7, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginTop:2 }}>3 Tier Harga</div>
          </div>
        </div>

        {/* Hero Text */}
        <div style={{ display:'flex', flexDirection:'column', gap:24, zIndex:2, animation:'fadeUp 0.8s ease forwards' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:28, height:1, background:G }} />
            <span style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, fontFamily:sans }}>Konveksi &amp; Supplier Baju Muslim</span>
          </div>
          <h1 className="hero-title" style={{ fontWeight:400, lineHeight:1.05, letterSpacing:'-0.02em', fontFamily:serif, color:D }}>
            Grosir Baju<br />
            <span style={{ fontStyle:'italic', background:'linear-gradient(135deg,#B8975A,#CDB07A,#9C7C3E)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Muslim Langsung Konveksi.</span>
          </h1>
          <p style={{ fontSize:14, lineHeight:1.85, color:'#6B6862', maxWidth:400, fontWeight:300 }}>
            Harga pabrik untuk reseller &amp; toko. Sistem order per seri (semua warna), makin banyak belanja makin murah.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <button onClick={() => navigate('/shop')}
              style={{ background:`linear-gradient(135deg,${G},#CDB07A,${G})`, color:C, border:'none', cursor:'pointer', padding:'13px 32px', borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', fontFamily:sans, boxShadow:'0 6px 20px rgba(184,151,90,0.3)', transition:'all 0.3s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 10px 28px rgba(184,151,90,0.45)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 6px 20px rgba(184,151,90,0.3)'}}>
              Lihat Katalog
            </button>
            <button onClick={() => catRef.current?.scrollIntoView({behavior:'smooth'})}
              style={{ background:'transparent', color:D, border:'1px solid rgba(43,41,38,0.25)', cursor:'pointer', padding:'13px 32px', borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', fontFamily:sans, transition:'all 0.3s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.color=G}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(43,41,38,0.25)';e.currentTarget.style.color=D}}>
              Cara Order
            </button>
          </div>
          <div className="stats" style={{ paddingTop:24, borderTop:'1px solid rgba(184,151,90,0.2)', marginTop:4 }}>
            {[["Per Seri","Min. Order"],[`${products.length||0}`,"Model"],["3 Tier","Harga Grosir"]].map(([num,lbl]) => (
              <div key={lbl}>
                <div style={{ fontSize:24, fontWeight:600, fontFamily:serif, background:'linear-gradient(135deg,#B8975A,#CDB07A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{num}</div>
                <div style={{ fontSize:9, color:'#8A8680', letterSpacing:'0.2em', textTransform:'uppercase', marginTop:4 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Hero Right */}
        <div className="hero-right">
          <div style={{ width:320, height:460, borderRadius:'160px 160px 100px 100px', overflow:'hidden', position:'relative', zIndex:2, boxShadow:'0 32px 80px rgba(184,151,90,0.2)', border:'1px solid rgba(184,151,90,0.2)', animation:'float 6s ease infinite' }}>
            <img src="https://hijabers.id/uploads/products/hero/1.jpg" alt="Hijabers Collective" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <img src="/logo.png" alt="h" style={{ position:'absolute', bottom:18, right:18, width:48, height:48, objectFit:'contain', opacity:0.9, filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
          </div>
          <div style={{ position:'absolute', top:70, right:-10, zIndex:3, background:'rgba(250,250,248,0.95)', backdropFilter:'blur(12px)', border:'1px solid rgba(184,151,90,0.2)', borderRadius:12, padding:'12px 16px', boxShadow:'0 8px 32px rgba(43,41,38,0.08)' }}>
            <div style={{ fontSize:14, fontFamily:serif, color:D }}>Produksi Sendiri</div>
            <div style={{ fontSize:8, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginTop:3 }}>Konveksi</div>
          </div>
          <div style={{ position:'absolute', bottom:80, left:-20, zIndex:3, background:'rgba(250,250,248,0.95)', backdropFilter:'blur(12px)', border:'1px solid rgba(184,151,90,0.2)', borderRadius:12, padding:'12px 16px', boxShadow:'0 8px 32px rgba(43,41,38,0.08)' }}>
            <div style={{ fontSize:14, fontFamily:serif, color:D }}>Harga Grosir 🏷️</div>
            <div style={{ fontSize:8, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginTop:3 }}>3 Tier Harga</div>
          </div>
          <div style={{ position:'absolute', width:360, height:480, borderRadius:'180px 180px 120px 120px', border:'1px solid rgba(184,151,90,0.12)', zIndex:1 }} />
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background:`linear-gradient(135deg,${G},#CDB07A,${G})`, padding:'12px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', animation:'marquee 28s linear infinite', whiteSpace:'nowrap' }}>
          {[...Array(6)].map((_,i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:20, marginRight:20, fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:C, fontFamily:sans }}>
              {["✦ Konveksi & Supplier Baju Muslim","✦ Order Per Seri, Semua Warna","✦ Di Atas Rp 5 Jt Harga Turun","✦ Di Atas Rp 10 Jt Harga Terendah"].map(t=>(
                <span key={t}>{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section" ref={catRef}>
        <div style={{ marginBottom:36 }}>
          <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>✦ Kategori</div>
          <h2 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D }}>Katalog <span style={{ fontStyle:'italic', color:G }}>Grosir</span></h2>
        </div>
        <div className="cat-grid">
          {activeCategories.map(cat => {
            const catImg = categoryImages[cat] || null
            return (
              <div key={cat} onClick={() => navigate(`/shop?category=${encodeURIComponent(cat)}`)}
                style={{ background:LB, borderRadius:4, cursor:'pointer', transition:'all 0.3s', border:'1px solid rgba(184,151,90,0.1)', overflow:'hidden' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(184,151,90,0.15)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
                {/* Category image or icon */}
                {catImg ? (
                  <div style={{ height:120, overflow:'hidden', position:'relative' }}>
                    <img src={catImg} alt={cat} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }}
                      onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                      onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'} />
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(43,41,38,0.3) 0%, transparent 60%)' }} />
                  </div>
                ) : (
                  <div style={{ height:80, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, background:'linear-gradient(145deg,#ECE9E4,#E2DED7)' }}>
                    {CAT_ICONS[cat]||'👗'}
                  </div>
                )}
                <div style={{ padding:'12px 16px' }}>
                  <div style={{ fontSize:14, fontWeight:500, fontFamily:serif, color:D, marginBottom:2 }}>{cat}</div>
                  <div style={{ fontSize:9, color:G, letterSpacing:'0.2em', textTransform:'uppercase' }}>Lihat Model →</div>
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
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:10 }}>✦ Model Unggulan</div>
            <h2 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D }}>Paling <span style={{ fontStyle:'italic', color:G }}>Laris</span></h2>
          </div>
          <Link to="/shop" style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:G, borderBottom:`1px solid ${G}`, paddingBottom:2, whiteSpace:'nowrap' }}>Lihat Semua →</Link>
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:48 }}>
            <div style={{ width:28, height:28, border:`3px solid rgba(184,151,90,0.2)`, borderTop:`3px solid ${G}`, borderRadius:'50%', animation:'spin 1s linear infinite' }} />
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
                  <div className="prod-img-tall" style={{ borderRadius:4, background: thumb?'none':(p.bg||'linear-gradient(145deg,#ECE9E4,#E2DED7)'), display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', marginBottom:14, border:'1px solid rgba(184,151,90,0.15)', boxShadow:'0 4px 16px rgba(43,41,38,0.06)' }}>
                    {thumb
                      ? <img src={thumb} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <>
                          <img src="/logo.png" alt="" style={{ position:'absolute', width:50, height:50, objectFit:'contain', opacity:0.07, bottom:8, right:8 }} />
                          <span style={{ fontSize:56, zIndex:2 }}>{CAT_ICONS[p.category]||'👗'}</span>
                        </>
                    }
                    {p.badge && <div style={{ position:'absolute', top:12, left:12, background:`linear-gradient(135deg,${G},#CDB07A)`, color:C, fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', padding:'3px 8px' }}>{p.badge}</div>}
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
                    <span style={{ fontSize:15, fontWeight:600, fontFamily:serif, color:D }}>{rp(unitPrice(p,1))}<span style={{ fontSize:10, color:'#8A8680', fontWeight:400 }}> /pcs</span></span>
                    <span style={{ fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:G, borderBottom:`1px solid ${G}` }}>Seri {seriesQty(p)} pcs →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* TIER HARGA */}
      <section className="section" style={{ background:LB }} ref={catRef}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:10 }}>✦ Harga Bertingkat</div>
          <h2 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D }}>Makin Banyak, <span style={{ fontStyle:'italic', color:G }}>Makin Murah</span></h2>
          <p style={{ fontSize:13, color:'#6B6862', marginTop:10 }}>Harga di keranjang otomatis menyesuaikan total belanja.</p>
        </div>
        <div className="prod-grid" style={{ maxWidth:900, margin:'0 auto' }}>
          {[["Tier 1","Harga normal","Belanja s/d Rp 5 jt"],["Tier 2","Lebih murah","Belanja di atas "+rp(TIER2_MIN)],["Tier 3","Harga terendah","Belanja di atas "+rp(TIER3_MIN)]].map(([t,d,c],i)=>(
            <div key={t} style={{ background:C, border:`1px solid ${i===2?G:'rgba(184,151,90,0.2)'}`, borderRadius:4, padding:'28px 20px', textAlign:'center' }}>
              <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:8 }}>{t}</div>
              <div style={{ fontSize:22, fontFamily:serif, color:D, marginBottom:8 }}>{d}</div>
              <div style={{ fontSize:12, color:'#6B6862' }}>{c}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CARA ORDER */}
      <section className="section">
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:10 }}>✦ Cara Order</div>
          <h2 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D }}>Mudah &amp; <span style={{ fontStyle:'italic', color:G }}>Cepat</span></h2>
        </div>
        <div className="prod-grid-4" style={{ maxWidth:1000, margin:'0 auto' }}>
          {[["1","Pilih model","Order per seri (4 atau 6 pcs, semua warna)."],["2","Masukkan keranjang","Harga tier otomatis menyesuaikan total."],["3","Kirim pesanan","Pesanan terkirim ke WhatsApp kami."],["4","Konfirmasi ongkir","Kami konfirmasi ongkir &amp; pembayaran."]].map(([n,t,d])=>(
            <div key={n} style={{ textAlign:'center', padding:'8px 12px' }}>
              <div style={{ width:40, height:40, borderRadius:'50%', border:`1px solid ${G}`, color:G, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontFamily:serif, fontSize:18 }}>{n}</div>
              <div style={{ fontSize:16, fontFamily:serif, color:D, marginBottom:6 }}>{t}</div>
              <div style={{ fontSize:12, color:'#6B6862', lineHeight:1.7 }} dangerouslySetInnerHTML={{__html:d}} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
