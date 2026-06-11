import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getAllProducts, getFeaturedProducts } from '../lib/api.js'
import { products as localProducts, getFeatured } from '../data/products.js'
import { CATEGORIES } from '../data/products.js'

const G = "#C1983C", D = "#2A1F0E", C = "#FDFBF7", LB = "#F7F2E8"
const serif = "'Cormorant Garamond',serif"
const sans = "'Didact Gothic',sans-serif"

const COLORS_MAP = {
  "Cream":"#F5ECD7","Sage Green":"#A8B59C","Dusty Rose":"#E8C5C8",
  "Warm Brown":"#C9A882","Off White":"#F0EDE8","Classic Black":"#2B2B2B",
  "Navy":"#1B2A4A","Mocha":"#8B6B4A"
}

const SORT_OPTIONS = [
  { value:"default", label:"Default" },
  { value:"price-asc", label:"Harga: Terendah" },
  { value:"price-desc", label:"Harga: Tertinggi" },
  { value:"name-asc", label:"Nama: A-Z" },
]

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link to={`/shop/${product.slug}`} style={{ textDecoration:'none', color:'inherit', display:'block', transition:'all 0.3s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div style={{ transform: hovered ? 'translateY(-5px)' : 'none', transition:'transform 0.3s' }}>
        <div className="prod-img" style={{ borderRadius:4, background:product.bg || 'linear-gradient(145deg,#F0E4C8,#E8D5A8)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', marginBottom:12, border:'1px solid rgba(193,152,60,0.15)', boxShadow: hovered ? '0 12px 40px rgba(193,152,60,0.2)' : '0 4px 16px rgba(42,31,14,0.06)', transition:'box-shadow 0.3s' }}>
          <img src="/logo.png" alt="" style={{ position:'absolute', width:48, height:48, objectFit:'contain', opacity:0.07, bottom:8, right:8 }} />
          <span style={{ fontSize:48, zIndex:2 }}>👗</span>
          {product.badge && (
            <div style={{ position:'absolute', top:10, left:10, background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', padding:'3px 8px', fontFamily:sans }}>
              {product.badge}
            </div>
          )}
          {/* Color dots */}
          <div style={{ position:'absolute', bottom:8, left:8, display:'flex', gap:3 }}>
            {(product.colors || []).slice(0,4).map(cn => (
              <div key={cn} style={{ width:9, height:9, borderRadius:'50%', background:COLORS_MAP[cn]||'#ccc', border:'1.5px solid rgba(255,255,255,0.7)' }} />
            ))}
          </div>
        </div>
        <div style={{ fontSize:14, fontWeight:500, fontFamily:serif, color:D, marginBottom:2 }}>{product.name}</div>
        <div style={{ fontSize:9, color:G, letterSpacing:'0.18em', textTransform:'uppercase', fontFamily:sans, marginBottom:8 }}>{product.category}</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:14, fontWeight:600, fontFamily:serif, color:D }}>Rp {(product.price||0).toLocaleString('id-ID')}</span>
          <span style={{ fontSize:9, color:G, borderBottom:`1px solid ${G}`, paddingBottom:1 }}>Lihat →</span>
        </div>
        {/* Sizes */}
        <div style={{ display:'flex', gap:3, marginTop:6, flexWrap:'wrap' }}>
          {(product.sizes || []).map(s => (
            <span key={s} style={{ fontSize:8, padding:'2px 6px', border:'1px solid rgba(193,152,60,0.2)', borderRadius:2, color:'#7A6040', fontFamily:sans }}>{s}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const activeCategory = searchParams.get('category') || 'Semua'

  useEffect(() => {
    window.scrollTo(0, 0)
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const data = await getAllProducts()
      setProducts(data && data.length > 0 ? data : localProducts)
    } catch {
      setProducts(localProducts)
    } finally {
      setLoading(false)
    }
  }

  const setCategory = (cat) => {
    if (cat === 'Semua') {
      setSearchParams({})
    } else {
      setSearchParams({ category: cat })
    }
    setMobileFilterOpen(false)
  }

  const filtered = products
    .filter(p => activeCategory === 'Semua' || p.category === activeCategory)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'name-asc') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div style={{ fontFamily:sans, paddingTop:72 }}>

      {/* HEADER */}
      <div style={{ background:`linear-gradient(135deg,#F5EDD8,#EDE0C4)`, padding:'40px 48px 32px', borderBottom:`1px solid rgba(193,152,60,0.15)` }}>
        <style>{`@media(max-width:768px){.shop-header{padding:28px 24px 20px !important}}`}</style>
        <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:8 }}>✦ Koleksi</div>
        <h1 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D, marginBottom:12 }}>
          {activeCategory === 'Semua' ? <>Semua <span style={{ fontStyle:'italic', color:G }}>Koleksi</span></> : <span style={{ fontStyle:'italic', color:G }}>{activeCategory}</span>}
        </h1>
        <p style={{ fontSize:13, color:'#7A6040', fontWeight:300 }}>
          {filtered.length} produk {activeCategory !== 'Semua' && `dalam kategori ${activeCategory}`}
        </p>
      </div>

      {/* SEARCH + SORT BAR */}
      <div style={{ padding:'16px 48px', background:C, borderBottom:`1px solid rgba(193,152,60,0.1)`, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
        <style>{`@media(max-width:768px){.search-bar{padding:12px 24px !important}}`}</style>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Cari produk..."
          className="form-input"
          style={{ flex:1, minWidth:200, padding:'10px 14px' }}
        />
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="form-input"
          style={{ width:'auto', padding:'10px 14px', cursor:'pointer' }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {/* Mobile filter toggle */}
        <button onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          style={{ display:'none', padding:'10px 16px', background:LB, border:`1px solid rgba(193,152,60,0.2)`, borderRadius:4, cursor:'pointer', fontSize:11, fontFamily:sans, color:D }}
          className="mobile-filter-btn">
          🗂️ Kategori
        </button>
        <style>{`@media(max-width:768px){.mobile-filter-btn{display:block !important}}`}</style>
      </div>

      {/* MOBILE FILTER DROPDOWN */}
      {mobileFilterOpen && (
        <div style={{ background:C, borderBottom:`1px solid rgba(193,152,60,0.1)`, padding:'12px 24px', display:'flex', gap:8, flexWrap:'wrap' }}>
          {['Semua', ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ padding:'6px 14px', borderRadius:20, border:`1px solid`, borderColor: activeCategory === cat ? D : 'rgba(193,152,60,0.2)', background: activeCategory === cat ? D : 'transparent', color: activeCategory === cat ? C : D, fontSize:11, cursor:'pointer', fontFamily:sans, transition:'all 0.2s' }}>
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="shop-layout">
        {/* SIDEBAR FILTER — Desktop */}
        <aside className="filter-sidebar">
          <div style={{ background:C, borderRadius:4, border:`1px solid rgba(193,152,60,0.12)`, overflow:'hidden' }}>
            <div style={{ padding:'16px 20px', borderBottom:`1px solid rgba(193,152,60,0.1)`, fontSize:9, letterSpacing:'0.25em', textTransform:'uppercase', color:G, fontFamily:sans }}>
              Kategori
            </div>
            {['Semua', ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ width:'100%', textAlign:'left', padding:'12px 20px', border:'none', borderBottom:`1px solid rgba(193,152,60,0.06)`, background: activeCategory === cat ? `linear-gradient(135deg,rgba(193,152,60,0.08),rgba(193,152,60,0.04))` : 'transparent', color: activeCategory === cat ? G : '#5C4A2A', fontSize:12, cursor:'pointer', fontFamily:sans, transition:'all 0.2s', fontWeight: activeCategory === cat ? 700 : 400, borderLeft: activeCategory === cat ? `2px solid ${G}` : '2px solid transparent' }}>
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div>
          {loading ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, flexDirection:'column', gap:16 }}>
              <div style={{ width:32, height:32, border:`3px solid rgba(193,152,60,0.2)`, borderTop:`3px solid ${G}`, borderRadius:'50%', animation:'spin 1s linear infinite' }} />
              <span style={{ fontSize:12, color:'#9A8060' }}>Memuat produk...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'64px 24px', color:'#9A8060' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
              <p style={{ fontSize:14, fontFamily:serif, fontStyle:'italic' }}>Produk tidak ditemukan</p>
              <button onClick={() => { setSearch(''); setCategory('Semua') }}
                style={{ marginTop:16, padding:'10px 24px', background:G, color:C, border:'none', borderRadius:2, fontSize:11, cursor:'pointer', fontFamily:sans, letterSpacing:'0.15em', textTransform:'uppercase' }}>
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="prod-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
