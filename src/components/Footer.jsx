import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, products as localProducts } from '../data/products.js';
import { getAllProducts } from '../lib/api.js';

const G = "#B8975A", D = "#2B2926", C = "#FAFAF8";

export default function Footer() {
  const [activeCategories, setActiveCategories] = useState(CATEGORIES);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getAllProducts();
        const prods = data && data.length > 0 ? data : localProducts;
        setActiveCategories(CATEGORIES.filter(cat => prods.some(p => p.category === cat)));
      } catch {
        setActiveCategories(CATEGORIES.filter(cat => localProducts.some(p => p.category === cat)));
      }
    }
    loadCategories();
  }, []);

  return (
    <footer style={{ background:D, color:C, padding:'56px 48px 28px', marginTop:'auto' }}>
      <style>{`@media(max-width:768px){.footer-inner{padding:40px 24px 20px !important}}`}</style>
      <div className="footer-grid" style={{ marginBottom:40, paddingBottom:40, borderBottom:'1px solid rgba(184,151,90,0.15)' }}>
        {/* Brand */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <img src="/logo.png" alt="h" style={{ width:34, height:34, objectFit:'contain' }} />
            <div>
              <div style={{ fontSize:14, fontWeight:700, letterSpacing:'0.22em', fontFamily:"'Cormorant Garamond',serif", lineHeight:1 }}>HIJABERS</div>
              <div style={{ fontSize:7, letterSpacing:'0.45em', color:G, textTransform:'uppercase', marginTop:3 }}>COLLECTIVE</div>
            </div>
          </div>
          <p style={{ fontSize:12, color:'rgba(250,250,248,0.45)', lineHeight:1.85, fontWeight:300, marginBottom:16 }}>
            Konveksi &amp; Supplier Baju Muslim Grosir.<br />Order per seri, harga bertingkat untuk reseller &amp; toko.
          </p>
          <div style={{ fontSize:11, color:'rgba(250,250,248,0.35)', lineHeight:2 }}>
            <div>📍 Duri Selatan 1 No.27C, Tambora, Jakarta Barat</div>
            <div>⏰ Senin–Sabtu, 08.00–17.00 WIB</div>
            <div>📧 hijaberslabel@gmail.com</div>
          </div>
        </div>

        {/* Shop — only active categories */}
        <div>
          <div style={{ fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:16 }}>Katalog</div>
          {activeCategories.length === 0 ? (
            <Link to="/shop" style={{ fontSize:12, color:'rgba(250,250,248,0.45)', display:'block' }}>Lihat Semua Produk</Link>
          ) : activeCategories.map(cat => (
            <Link key={cat} to={`/shop?category=${encodeURIComponent(cat)}`} style={{ fontSize:12, color:'rgba(250,250,248,0.45)', marginBottom:8, cursor:'pointer', display:'block', transition:'color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.color=G}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(250,250,248,0.45)'}>
              {cat}
            </Link>
          ))}
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:16 }}>Info</div>
          {[{to:'/about',label:'Tentang Kami'},{to:'/shop',label:'Katalog'},{to:'/cart',label:'Keranjang Order'}].map(l=>(
            <Link key={l.to} to={l.to} style={{ fontSize:12, color:'rgba(250,250,248,0.45)', marginBottom:8, cursor:'pointer', display:'block', transition:'color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.color=G}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(250,250,248,0.45)'}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Social */}
        <div>
          <div style={{ fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:16 }}>Kontak</div>
          {[
            { label:'📱 WA 1', href:'https://wa.me/6208561010367' },
            { label:'📱 WA 2', href:'https://wa.me/6208561010368' },
            { label:'📸 Instagram', href:'https://instagram.com/hijabers.id' },
            { label:'🎵 TikTok', href:'https://tiktok.com/@hijabersoutfit' },
            { label:'🛍️ Shopee', href:'https://shopee.co.id/hijabersid' },
          ].map(l=>(
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{ fontSize:12, color:'rgba(250,250,248,0.45)', marginBottom:8, cursor:'pointer', display:'block', transition:'color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.color=G}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(250,250,248,0.45)'}>
              {l.label}
            </a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span style={{ fontSize:10, color:'rgba(250,250,248,0.25)' }}>© 2026 Hijabers Collective — All rights reserved</span>
        <span style={{ fontSize:10, color:'rgba(250,250,248,0.25)' }}>Konveksi Jakarta</span>
      </div>
    </footer>
  );
}
