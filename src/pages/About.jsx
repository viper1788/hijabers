import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const G = "#B8975A", D = "#2B2926", C = "#FAFAF8", LB = "#F2F0EC"
const serif = "'Cormorant Garamond',serif"
const sans = "'Didact Gothic',sans-serif"

const points = [
  ["Produksi Sendiri", "Kami konveksi: model, bahan, dan jahitan kami kontrol langsung, jadi kualitas konsisten di setiap seri."],
  ["Order Per Seri", "Satu seri berisi 4 atau 6 pcs sesuai model, mencakup semua warna. Cocok untuk reseller dan toko."],
  ["Harga Bertingkat", "Tier 1 harga normal, Tier 2 di atas Rp 5 juta, Tier 3 di atas Rp 10 juta. Otomatis di keranjang."],
  ["Khusus Baju Muslim", "Wide pants, tapered pants, sweat pants, wide skirt, cardigan, knit top, shirt, dan jaket."],
]

export default function About() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <div style={{ fontFamily: sans, paddingTop: 88 }}>
      <section className="section" style={{ background: LB, textAlign: 'center' }}>
        <img src="/logo.png" alt="Hijabers" style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 20 }} />
        <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: G, marginBottom: 12 }}>✦ Tentang Kami</div>
        <h1 style={{ fontSize: 44, fontWeight: 400, fontFamily: serif, color: D, lineHeight: 1.1 }}>
          Hijabers Collective<br /><span style={{ fontStyle: 'italic', color: G }}>Konveksi &amp; Supplier Baju Muslim</span>
        </h1>
        <p style={{ maxWidth: 560, margin: '20px auto 0', fontSize: 14, lineHeight: 1.9, color: '#6B6862' }}>
          Kami memproduksi dan menyuplai baju muslim grosir untuk reseller, toko, dan pedagang di seluruh Indonesia.
        </p>
      </section>

      <section className="section">
        <div className="prod-grid-4" style={{ maxWidth: 1000, margin: '0 auto' }}>
          {points.map(([t, d]) => (
            <div key={t} style={{ border: '1px solid rgba(184,151,90,0.25)', borderRadius: 4, padding: '24px 20px', background: C }}>
              <div style={{ fontSize: 18, fontFamily: serif, color: D, marginBottom: 8 }}>{t}</div>
              <div style={{ fontSize: 12, lineHeight: 1.8, color: '#6B6862' }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: LB, textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 400, fontFamily: serif, color: D, marginBottom: 12 }}>Hubungi <span style={{ fontStyle: 'italic', color: G }}>Kami</span></h2>
        <div style={{ fontSize: 13, color: '#6B6862', lineHeight: 2 }}>
          <div>📍 Duri Selatan 1 No.27C, Tambora, Jakarta Barat</div>
          <div>⏰ Senin–Sabtu, 08.00–17.00 WIB</div>
          <div>📧 hijaberslabel@gmail.com</div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <a href="https://wa.me/6208561010367" target="_blank" rel="noreferrer" className="btn-gold" style={{ padding: '13px 28px', borderRadius: 2, fontSize: 11 }}>WhatsApp</a>
          <Link to="/shop" className="btn-outline" style={{ padding: '13px 28px', borderRadius: 2, fontSize: 11 }}>Lihat Katalog</Link>
        </div>
      </section>
    </div>
  )
}
