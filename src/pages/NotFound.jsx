import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const G = "#B8975A", D = "#2B2926", C = "#FAFAF8", LB = "#F2F0EC"
const serif = "'Cormorant Garamond',serif"
const sans = "'Didact Gothic',sans-serif"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily:sans, minHeight:'100vh', background:'linear-gradient(160deg,#FAFAF8 0%,#F4F2EE 55%,#EAE7E1 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', textAlign:'center' }}>
      <div style={{ maxWidth:480 }}>
        {/* Logo */}
        <img src="/logo.png" alt="h" style={{ width:64, height:64, objectFit:'contain', marginBottom:24, opacity:0.7 }} />

        {/* 404 */}
        <div style={{ fontSize:96, fontWeight:300, fontFamily:serif, background:`linear-gradient(135deg,${G},#CDB07A,#9C7C3E)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1, marginBottom:8 }}>
          404
        </div>

        {/* Title */}
        <h1 style={{ fontSize:28, fontWeight:400, fontFamily:serif, color:D, marginBottom:12, lineHeight:1.2 }}>
          Halaman <span style={{ fontStyle:'italic', color:G }}>Tidak Ditemukan</span>
        </h1>

        {/* Desc */}
        <p style={{ fontSize:13, color:'#6B6862', lineHeight:1.85, marginBottom:32, fontWeight:300 }}>
          Sepertinya halaman yang kamu cari tidak ada atau telah dipindahkan. Jangan khawatir, koleksi kami masih lengkap untukmu! 🌿
        </p>

        {/* Decorative line */}
        <div style={{ display:'flex', alignItems:'center', gap:12, justifyContent:'center', marginBottom:32 }}>
          <div style={{ height:1, width:48, background:`rgba(184,151,90,0.3)` }} />
          <span style={{ fontSize:12, color:G, letterSpacing:'0.3em', textTransform:'uppercase' }}>✦</span>
          <div style={{ height:1, width:48, background:`rgba(184,151,90,0.3)` }} />
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => navigate(-1)}
            style={{ padding:'13px 28px', background:'transparent', color:D, border:'1px solid rgba(43,41,38,0.25)', borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:sans, transition:'all 0.3s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=G;e.currentTarget.style.color=G}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(43,41,38,0.25)';e.currentTarget.style.color=D}}>
            ← Kembali
          </button>
          <Link to="/" style={{ padding:'13px 28px', background:`linear-gradient(135deg,${G},#CDB07A,${G})`, color:C, borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', textDecoration:'none', fontFamily:sans, boxShadow:'0 6px 20px rgba(184,151,90,0.3)' }}>
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
