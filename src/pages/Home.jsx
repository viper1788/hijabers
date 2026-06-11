import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeatured, CATEGORIES } from '../data/products.js';

const G="#C1983C", D="#2A1F0E", C="#FDFBF7", LB="#F7F2E8";
const serif = "'Cormorant Garamond',serif";
const sans = "'Didact Gothic',sans-serif";

const catIcons = {"Wide Pants":"👖","Tapered Pants":"🩱","Sweat Pants":"🩲","Wide Skirt":"👗","Cardigan":"🧥","Knit Top":"👚","Shirt":"👔","Jaket":"🧣"};

const testimonials = [
  { name:"Aisyah R.", city:"Jakarta", text:"Bahannya adem banget, cocok buat kuliah sehari-hari. Warnanya persis foto!" },
  { name:"Fatimah N.", city:"Bandung", text:"Sudah order 3x, kualitasnya konsisten. Pengiriman cepat dan packaging rapi!" },
  { name:"Nur Indah", city:"Surabaya", text:"Finally nemu modest wear yang bener-bener campus to career vibes. Love it! 🤍" },
];

export default function Home() {
  const [activeTesti, setActiveTesti] = useState(0);
  const featured = getFeatured();
  const navigate = useNavigate();
  const catRef = useRef(null);
  const shopRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setActiveTesti(p => (p+1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { window.scrollTo(0,0); }, []);

  return (
    <div style={{ fontFamily:sans }}>

      {/* HERO */}
      <section className="hero-grid" style={{ background:'linear-gradient(160deg,#FDFBF7 0%,#F5EDD8 55%,#EDE0C4 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'5%', right:'5%', width:400, height:400, background:'radial-gradient(circle,rgba(193,152,60,0.08) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

        {/* Mobile hero image */}
        <div className="hero-right-mobile">
          <div style={{ width:180, height:220, background:'linear-gradient(145deg,#F0E4C8,#E8D5A8)', borderRadius:'90px 90px 70px 70px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:2, boxShadow:'0 20px 60px rgba(193,152,60,0.25)', border:'1px solid rgba(193,152,60,0.2)', animation:'float 6s ease infinite' }}>
            <img src="/logo.png" alt="h" style={{ width:90, height:90, objectFit:'contain', opacity:0.9 }} />
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
            <button onClick={() => shopRef.current?.scrollIntoView({behavior:'smooth'})} className="btn-gold" style={{ padding:'13px 32px', borderRadius:2, fontSize:11, boxShadow:'0 6px 20px rgba(193,152,60,0.3)' }}>
              Shop Now
            </button>
            <button onClick={() => catRef.current?.scrollIntoView({behavior:'smooth'})} className="btn-outline" style={{ padding:'13px 32px', borderRadius:2, fontSize:11 }}>
              Lihat Koleksi
            </button>
          </div>
          <div className="stats" style={{ paddingTop:24, borderTop:'1px solid rgba(193,152,60,0.2)', marginTop:4 }}>
            {[["500+","Happy Customers"],["24","Koleksi"],["4.9★","Rating"]].map(([num,lbl]) => (
              <div key={lbl}>
                <div style={{ fontSize:24, fontWeight:600, fontFamily:serif, background:'linear-gradient(135deg,#C1983C,#D4AA50)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{num}</div>
                <div style={{ fontSize:9, color:'#9A8060', letterSpacing:'0.2em', textTransform:'uppercase', marginTop:4 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Hero Right */}
        <div className="hero-right">
          <div style={{ width:300, height:420, background:'linear-gradient(145deg,#F0E4C8,#E8D5A8)', borderRadius:'150px 150px 100px 100px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:2, boxShadow:'0 32px 80px rgba(193,152,60,0.2)', border:'1px solid rgba(193,152,60,0.2)', animation:'float 6s ease infinite' }}>
            <img src="/logo.png" alt="h" style={{ width:140, height:140, objectFit:'contain', opacity:0.9 }} />
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
              <span style={{ width:3, height:3, borderRadius:'50%', background:'rgba(253,251,247,0.5)', display:'inline-block' }} />
              Modest wear for campus to career
              <span style={{ width:3, height:3, borderRadius:'50%', background:'rgba(253,251,247,0.5)', display:'inline-block' }} />
              Free Ongkir Jawa & Bali
              <span style={{ width:3, height:3, borderRadius:'50%', background:'rgba(253,251,247,0.5)', display:'inline-block' }} />
              Premium Quality
              <span style={{ width:3, height:3, borderRadius:'50%', background:'rgba(253,251,247,0.5)', display:'inline-block' }} />
              Mon–Sat 08.00–17.00 WIB
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
          {CATEGORIES.map(cat => (
            <div key={cat} onClick={() => navigate(`/shop?category=${encodeURIComponent(cat)}`)}
              style={{ background:LB, borderRadius:4, padding:'22px 18px', cursor:'pointer', transition:'all 0.3s', border:'1px solid rgba(193,152,60,0.1)' }}
              onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(145deg,#F0E4C8,#E8D5A8)';e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(193,152,60,0.15)'}}
              onMouseLeave={e=>{e.currentTarget.style.background=LB;e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
              <div style={{ fontSize:24, marginBottom:10 }}>{catIcons[cat] || '👗'}</div>
              <div style={{ fontSize:15, fontWeight:500, fontFamily:serif, color:D, marginBottom:3 }}>{cat}</div>
              <div style={{ fontSize:9, color:G, letterSpacing:'0.2em', textTransform:'uppercase' }}>Shop Now →</div>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section style={{ padding:'0 48px 80px' }} ref={shopRef}>
        <style>{`@media(max-width:768px){.prod-section-home{padding:0 24px 56px !important}}`}</style>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36, flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:10 }}>✦ Pilihan Editor</div>
            <h2 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D }}>Best <span style={{ fontStyle:'italic', color:G }}>Sellers</span></h2>
          </div>
          <Link to="/shop" style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:G, borderBottom:`1px solid ${G}`, paddingBottom:2, whiteSpace:'nowrap' }}>Lihat Semua →</Link>
        </div>
        <div className="prod-grid">
          {featured.slice(0,3).map((p,i) => (
            <Link key={p.id} to={`/shop/${p.slug}`} style={{ textDecoration:'none', color:'inherit', transition:'all 0.3s', display:'block' }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-6px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='none'}>
              <div className="prod-img-tall" style={{ borderRadius:4, background:p.bg, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', marginBottom:14, border:'1px solid rgba(193,152,60,0.15)', boxShadow:'0 4px 16px rgba(42,31,14,0.06)' }}>
                <img src="/logo.png" alt="" style={{ position:'absolute', width:50, height:50, objectFit:'contain', opacity:0.07, bottom:8, right:8 }} />
                <span style={{ fontSize:56, zIndex:2 }}>{p.bg.includes('F5ECD7') ? '👖' : p.bg.includes('EAE0D0') ? '👗' : '🧥'}</span>
                {p.badge && <div style={{ position:'absolute', top:12, left:12, background:`linear-gradient(135deg,${G},#D4AA50)`, color:C, fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', padding:'3px 8px' }}>{p.badge}</div>}
                <div style={{ position:'absolute', bottom:10, left:10, display:'flex', gap:4 }}>
                  {p.colors.slice(0,3).map(cn => {
                    const colObj = {Cream:'#F5ECD7','Sage Green':'#A8B59C','Classic Black':'#2B2B2B','Off White':'#F0EDE8','Warm Brown':'#C9A882','Navy':'#1B2A4A','Mocha':'#8B6B4A','Dusty Rose':'#E8C5C8'};
                    return <div key={cn} style={{ width:10, height:10, borderRadius:'50%', background:colObj[cn]||'#ccc', border:'1.5px solid rgba(255,255,255,0.6)' }} />;
                  })}
                </div>
              </div>
              <div style={{ fontSize:15, fontWeight:500, fontFamily:serif, color:D, marginBottom:2 }}>{p.name}</div>
              <div style={{ fontSize:9, color:G, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:8 }}>{p.category}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:15, fontWeight:600, fontFamily:serif, color:D }}>Rp {p.price.toLocaleString('id-ID')}</span>
                <span style={{ fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:G, borderBottom:`1px solid ${G}` }}>Add →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <div className="banner-margin" style={{ background:'linear-gradient(135deg,#F0E4C8 0%,#E8D5A8 50%,#DEC88A 100%)', borderRadius:4, border:'1px solid rgba(193,152,60,0.2)', overflow:'hidden' }}>
        <div className="banner-grid">
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <span style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#9A6E1A' }}>✦ Special Offer</span>
            <h2 style={{ fontSize:38, fontWeight:400, fontFamily:serif, color:D, lineHeight:1.1 }}>Free Ongkir<br /><span style={{ fontStyle:'italic', color:'#9A6E1A' }}>Jawa & Bali</span></h2>
            <p style={{ fontSize:13, color:'#6A5030', lineHeight:1.8, fontWeight:300 }}>Semua order ke Jawa dan Bali gratis ongkir, tanpa minimum pembelian.</p>
            <Link to="/shop" className="btn-gold" style={{ padding:'13px 32px', borderRadius:2, fontSize:11, alignSelf:'flex-start', display:'inline-block', boxShadow:'0 6px 20px rgba(42,31,14,0.2)' }}>Shop Now →</Link>
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
          <p style={{ fontSize:20, fontStyle:'italic', fontFamily:serif, lineHeight:1.65, marginBottom:24, color:D }}>" {testimonials[activeTesti].text} "</p>
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
  );
}
