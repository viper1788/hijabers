import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const G = "#C1983C", D = "#2A1F0E", C = "#FDFBF7", LB = "#F7F2E8"
const serif = "'Cormorant Garamond',serif"
const sans = "'Didact Gothic',sans-serif"

const values = [
  { icon:"🌿", title:"Quality First", desc:"Setiap produk kami dipilih dengan teliti — bahan premium yang nyaman dipakai seharian tanpa mengorbankan gaya." },
  { icon:"✨", title:"Modest & Modern", desc:"Kami percaya modest wear bukan batasan, tapi pilihan. Desain kami membuktikan bahwa tampil tertutup bisa tetap stylish dan relevan." },
  { icon:"🎓", title:"Campus to Career", desc:"Dari ruang kuliah hingga ruang rapat, koleksi kami dirancang untuk menemani perjalanan wanita Indonesia yang aktif dan ambisius." },
  { icon:"🤍", title:"Local Pride", desc:"Hijabers Collective lahir di Jakarta dan bangga mendukung industri fashion lokal Indonesia dengan kualitas yang bersaing di level internasional." },
]

const team = [
  { name:"Weta Novinie", role:"Founder & Creative Director", emoji:"👩‍💼" },
  { name:"Tim Hijabers", role:"Design & Production", emoji:"✂️" },
  { name:"Customer Service", role:"Mon–Sat, 08.00–17.00 WIB", emoji:"💬" },
]

export default function About() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ fontFamily:sans, paddingTop:72 }}>

      {/* HERO */}
      <section style={{ background:'linear-gradient(160deg,#FDFBF7 0%,#F5EDD8 55%,#EDE0C4 100%)', padding:'80px 48px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <style>{`@media(max-width:768px){.about-hero{padding:56px 24px !important}}`}</style>
        <div style={{ position:'absolute', top:'10%', left:'5%', width:300, height:300, background:'radial-gradient(circle,rgba(193,152,60,0.08) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'10%', right:'5%', width:200, height:200, background:'radial-gradient(circle,rgba(193,152,60,0.06) 0%,transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:2 }}>
          <img src="/logo.png" alt="h" style={{ width:80, height:80, objectFit:'contain', marginBottom:24, opacity:0.9 }} />
          <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:12 }}>✦ Our Story</div>
          <h1 style={{ fontSize:48, fontWeight:400, fontFamily:serif, color:D, lineHeight:1.1, marginBottom:20 }}>
            Modest wear for<br /><span style={{ fontStyle:'italic', color:G }}>campus to career</span>
          </h1>
          <p style={{ fontSize:15, lineHeight:1.85, color:'#7A6040', maxWidth:560, margin:'0 auto', fontWeight:300 }}>
            Hijabers Collective hadir sebagai jawaban atas kebutuhan wanita Indonesia yang ingin tampil modest, stylish, dan percaya diri — dari bangku kuliah hingga meja kerja.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="section" style={{ background:C }}>
        <style>{`@media(max-width:768px){.story-grid{grid-template-columns:1fr !important}}`}</style>
        <div className="story-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:12 }}>✦ Cerita Kami</div>
            <h2 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D, marginBottom:20, lineHeight:1.2 }}>
              Lahir dari<br /><span style={{ fontStyle:'italic', color:G }}>kebutuhan nyata</span>
            </h2>
            <p style={{ fontSize:14, lineHeight:1.9, color:'#7A6040', marginBottom:16, fontWeight:300 }}>
              Hijabers Collective dimulai dari sebuah pertanyaan sederhana: mengapa susah menemukan pakaian modest yang benar-benar nyaman untuk aktivitas sehari-hari?
            </p>
            <p style={{ fontSize:14, lineHeight:1.9, color:'#7A6040', marginBottom:16, fontWeight:300 }}>
              Berangkat dari Jakarta, kami membangun koleksi yang menggabungkan kenyamanan premium dengan estetika modern — pilihan yang tepat untuk wanita Indonesia yang aktif dan ambisius.
            </p>
            <p style={{ fontSize:14, lineHeight:1.9, color:'#7A6040', fontWeight:300 }}>
              Setiap produk kami dirancang dengan mempertimbangkan kebutuhan nyata: kuliah pagi, presentasi siang, hangout sore — semua bisa dilakukan tanpa ganti baju.
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ width:280, height:360, background:'linear-gradient(145deg,#F0E4C8,#E8D5A8)', borderRadius:'140px 140px 100px 100px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 32px 80px rgba(193,152,60,0.2)', border:'1px solid rgba(193,152,60,0.2)' }}>
              <img src="/logo.png" alt="h" style={{ width:120, height:120, objectFit:'contain', opacity:0.85 }} />
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section" style={{ background:LB }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:12 }}>✦ What We Stand For</div>
          <h2 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D }}>
            Nilai <span style={{ fontStyle:'italic', color:G }}>Kami</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20 }}>
          {values.map(v => (
            <div key={v.title} style={{ background:C, borderRadius:4, padding:'28px 24px', border:'1px solid rgba(193,152,60,0.12)', transition:'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(193,152,60,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}>
              <div style={{ fontSize:32, marginBottom:16 }}>{v.icon}</div>
              <div style={{ fontSize:16, fontWeight:500, fontFamily:serif, color:D, marginBottom:8 }}>{v.title}</div>
              <p style={{ fontSize:12, lineHeight:1.8, color:'#7A6040', fontWeight:300 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="section" style={{ background:C }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:G, marginBottom:12 }}>✦ The People</div>
          <h2 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D }}>
            Di Balik <span style={{ fontStyle:'italic', color:G }}>Hijabers</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20, maxWidth:700, margin:'0 auto' }}>
          {team.map(t => (
            <div key={t.name} style={{ textAlign:'center', padding:'32px 20px', background:LB, borderRadius:4, border:'1px solid rgba(193,152,60,0.1)' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>{t.emoji}</div>
              <div style={{ fontSize:16, fontWeight:500, fontFamily:serif, color:D, marginBottom:4 }}>{t.name}</div>
              <div style={{ fontSize:10, color:G, letterSpacing:'0.15em', textTransform:'uppercase' }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" style={{ background:'linear-gradient(135deg,#F0E4C8,#E8D5A8)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'start' }}>
          <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr !important}}`}</style>
          <div className="contact-grid">
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#9A6E1A', marginBottom:12 }}>✦ Hubungi Kami</div>
            <h2 style={{ fontSize:36, fontWeight:400, fontFamily:serif, color:D, marginBottom:20, lineHeight:1.2 }}>
              Ada pertanyaan?<br /><span style={{ fontStyle:'italic', color:'#9A6E1A' }}>Kami siap membantu</span>
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { icon:'📍', label:'Alamat', value:'Duri Selatan 1 No.27C, Tambora, Jakarta Barat' },
                { icon:'⏰', label:'Jam Operasional', value:'Senin–Sabtu, 08.00–17.00 WIB' },
                { icon:'📧', label:'Email', value:'hijaberslabel@gmail.com' },
              ].map(item => (
                <div key={item.label} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize:9, color:'#9A6E1A', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:2 }}>{item.label}</div>
                    <div style={{ fontSize:13, color:D }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#9A6E1A', marginBottom:16 }}>✦ Temukan Kami</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { icon:'📱', label:'WhatsApp 1', href:'https://wa.me/6208561010367', value:'0856-1010-367' },
                { icon:'📱', label:'WhatsApp 2', href:'https://wa.me/6208561010368', value:'0856-1010-368' },
                { icon:'📸', label:'Instagram', href:'https://instagram.com/hijabers.id', value:'@hijabers.id' },
                { icon:'🎵', label:'TikTok', href:'https://tiktok.com/@hijabersoutfit', value:'@hijabersoutfit' },
                { icon:'🛍️', label:'Shopee', href:'https://shopee.co.id/hijabersid', value:'hijabersid' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'rgba(253,251,247,0.7)', borderRadius:4, textDecoration:'none', border:'1px solid rgba(193,152,60,0.15)', transition:'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(253,251,247,0.95)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(253,251,247,0.7)'}>
                  <span style={{ fontSize:18 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize:9, color:'#9A6E1A', letterSpacing:'0.12em', textTransform:'uppercase' }}>{s.label}</div>
                    <div style={{ fontSize:12, color:D, fontWeight:600 }}>{s.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:D, padding:'64px 48px', textAlign:'center' }}>
        <img src="/logo.png" alt="h" style={{ width:48, height:48, objectFit:'contain', marginBottom:20, opacity:0.8 }} />
        <h2 style={{ fontSize:32, fontWeight:400, fontFamily:serif, color:C, marginBottom:12 }}>
          Siap tampil <span style={{ fontStyle:'italic', color:G }}>modest & stylish?</span>
        </h2>
        <p style={{ fontSize:13, color:'rgba(253,251,247,0.5)', marginBottom:28, fontWeight:300 }}>
          Temukan koleksi terbaru kami dan jadilah bagian dari komunitas Hijabers Collective.
        </p>
        <Link to="/shop" style={{ display:'inline-block', background:`linear-gradient(135deg,${G},#D4AA50,${G})`, color:C, padding:'14px 40px', borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', boxShadow:'0 6px 20px rgba(193,152,60,0.3)' }}>
          Shop Now →
        </Link>
      </section>
    </div>
  )
}
