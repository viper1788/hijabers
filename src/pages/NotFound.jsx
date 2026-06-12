import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const G = "#C1983C", D = "#2A1F0E", C = "#FDFBF7", LB = "#F7F2E8"
const serif = "'Cormorant Garamond',serif"
const sans = "'Didact Gothic',sans-serif"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily:sans, minHeight:'100vh', background:'linear-gradient(160deg,#FDFBF7 0%,#F5EDD8 55%,#EDE0C4 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', textAlign:'center' }}>
      <div style={{ maxWidth:480 }}>
        {/* Logo */}
        <img src="/logo.png" alt="h" style={{ width:64, height:64, objectFit:'contain', marginBottom:24, opacity:0.7 }} />

        {/* 404 */}
        <div style={{ fontSize:96, fontWeight:300, fontFamily:serif, background:`linear-gradient(135deg,${G},#D4AA50,#B8891E)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1, marginBottom:8 }}>
          404
        </div>

        {/* Title */}
        <h1 style={{ fontSize:28, fontWeight:400, fontFamily:serif, color:D, marginBottom:12, lineHeight:1.2 }}>
          Halaman <span style={{ fontStyle:'italic', color:G }}>Tidak Ditemukan</span>
        </h1>

        {/* Desc */}
        <p style={{ fontSize:13, color:'#7A6040', lineHeight:1.85, marginBottom:32, fontWeight:300 }}>
          Sepertinya halaman yang kamu cari tidak ada atau telah dipindahkan. Jangan khawatir, koleksi kami masih lengkap untukmu! 🌿
        </p>

        {/* Decorative line */}
        <div style={{ display:'flex', alignItems:'center', gap:12, justifyContent:'center', marginBottom:32 }}>
          <div style={{ height:1, width:48, background:`rgba(193,152,60,0.3)` }} />
          <span style={{ fontSize:12, color:G, letterSpacing:'0.3em', textTransform:'uppercase' }}>✦</span>
          <div style={{ height:1, width:48, background:`rgba(193,152,60,0.3)` }} />
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => navigate(-1)}
            style={{ padding:'13px 28px', background:'transparent', color:D, border:'1px solid rgba(42,31,14,0.25)', borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans, transition:'all 0.3s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.color=G}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(42,31,14,0.25)';e.currentTarget.style.color=D}}>
            ← Kembali
          </button>
          <Link to="/" style={{ padding:'13px 28px', background:`linear-gradient(135deg,${G},#D4AA50,${G})`, color:C, borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', fontFamily:sans, boxShadow:'0 6px 20px rgba(193,152,60,0.3)' }}>
            Home
          </Link>
          <Link to="/shop" style={{ padding:'13px 28px', background:D, color:C, borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', fontFamily:sans }}>
            Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
