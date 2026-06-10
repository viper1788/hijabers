import React, { useState, useEffect } from "react";

const LOGO_SRC = "/logo.png";

const featuredProducts = [
  { id: 1, name: "Hana Pashmina", subtitle: "Daily Series", price: 89000, bg: "linear-gradient(145deg, #F5ECD7, #EDD9B8)", emoji: "🧕" },
  { id: 2, name: "Zahra Bergo", subtitle: "Premium Series", price: 125000, bg: "linear-gradient(145deg, #EAE0D0, #D9CBAF)", emoji: "✨" },
  { id: 3, name: "Siti Square", subtitle: "Formal Series", price: 75000, bg: "linear-gradient(145deg, #EDE8DE, #DDD4C0)", emoji: "🌿" },
];

const categories = [
  { name: "Pashmina", icon: "🌸", count: "24 styles" },
  { name: "Bergo", icon: "🌿", count: "18 styles" },
  { name: "Square", icon: "✦", count: "15 styles" },
  { name: "Syari", icon: "🌙", count: "12 styles" },
];

const testimonials = [
  { name: "Aisyah R.", city: "Jakarta", text: "Bahannya adem banget, cocok buat kuliah sehari-hari. Warnanya persis foto!" },
  { name: "Fatimah N.", city: "Bandung", text: "Sudah order 3x, kualitasnya konsisten. Pengiriman juga cepat!" },
  { name: "Nur Indah", city: "Surabaya", text: "Finally nemu hijab yang bener-bener premium. Love it so much 🤍" },
];

export default function HijabersID() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [cartCount] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "'Didact Gothic', sans-serif", background: "#FDFBF7", color: "#2A1F0E", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Didact+Gothic&display=swap');
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes float { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-8px) } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? "12px 48px" : "22px 48px",
        background: scrolled ? "rgba(253,251,247,0.97)" : "rgba(253,251,247,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(193,152,60,0.15)" : "1px solid transparent",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.4s ease",
        boxShadow: scrolled ? "0 2px 24px rgba(42,31,14,0.06)" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={LOGO_SRC} alt="Hijabers" style={{ height: 42, width: 42, objectFit: "contain" }} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.22em", fontFamily: "'Cormorant Garamond', serif", color: "#2A1F0E", lineHeight: 1 }}>HIJABERS</div>
            <div style={{ fontSize: 7.5, letterSpacing: "0.45em", color: "#C1983C", textTransform: "uppercase", fontFamily: "'Didact Gothic', sans-serif", marginTop: 3 }}>COLLECTIVE</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Koleksi", "About", "Care Guide", "Blog"].map(link => (
            <span key={link} style={{ fontSize: 11, letterSpacing: "0.18em", color: "#5C4A2A", cursor: "pointer", textTransform: "uppercase", fontFamily: "'Didact Gothic', sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#C1983C"}
              onMouseLeave={e => e.currentTarget.style.color = "#5C4A2A"}>
              {link}
            </span>
          ))}
        </div>

        <button style={{
          background: "linear-gradient(135deg, #C1983C, #D4AA50, #C1983C)",
          color: "#FDFBF7", border: "none", cursor: "pointer",
          padding: "10px 24px", borderRadius: 2,
          fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
          fontFamily: "'Didact Gothic', sans-serif",
          boxShadow: "0 4px 16px rgba(193,152,60,0.25)",
          transition: "all 0.3s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(193,152,60,0.4)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(193,152,60,0.25)"; e.currentTarget.style.transform = "none"; }}>
          🛒 Keranjang {cartCount > 0 && `(${cartCount})`}
        </button>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FDFBF7 0%, #F5EDD8 50%, #EDE0C4 100%)",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        alignItems: "center", padding: "0 48px", paddingTop: 88, gap: 48,
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "5%", right: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(193,152,60,0.08) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "0%", width: 300, height: 300, background: "radial-gradient(circle, rgba(193,152,60,0.05) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28, zIndex: 2, animation: "fadeUp 0.8s ease forwards" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 1, background: "#C1983C" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C1983C", fontFamily: "'Didact Gothic', sans-serif" }}>New Collection 2025</span>
          </div>

          <h1 style={{ fontSize: 64, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", fontFamily: "'Cormorant Garamond', serif", color: "#2A1F0E" }}>
            Modest is<br />
            <span style={{ fontStyle: "italic", background: "linear-gradient(135deg, #C1983C, #D4AA50, #B8891E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Beautiful.</span>
          </h1>

          <p style={{ fontSize: 14, lineHeight: 1.85, color: "#7A6040", maxWidth: 400, fontFamily: "'Didact Gothic', sans-serif", fontWeight: 300 }}>
            Temukan koleksi hijab premium dengan bahan pilihan — nyaman dipakai seharian, tetap tampil elegan di setiap momen.
          </p>

          <div style={{ display: "flex", gap: 16 }}>
            <button style={{
              background: "linear-gradient(135deg, #C1983C, #D4AA50, #C1983C)",
              color: "#FDFBF7", border: "none", cursor: "pointer",
              padding: "14px 40px", borderRadius: 2,
              fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
              fontFamily: "'Didact Gothic', sans-serif",
              boxShadow: "0 6px 20px rgba(193,152,60,0.3)",
            }}>Shop Now</button>
            <button style={{
              background: "transparent", color: "#2A1F0E",
              border: "1px solid rgba(42,31,14,0.25)", cursor: "pointer",
              padding: "14px 40px", borderRadius: 2,
              fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
              fontFamily: "'Didact Gothic', sans-serif",
            }}>Lihat Koleksi</button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 40, paddingTop: 28, borderTop: "1px solid rgba(193,152,60,0.2)", marginTop: 8 }}>
            {[["500+", "Happy Customers"], ["50+", "Koleksi"], ["4.9★", "Rating"]].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontSize: 26, fontWeight: 600, fontFamily: "'Cormorant Garamond', serif", background: "linear-gradient(135deg, #C1983C, #D4AA50)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{num}</div>
                <div style={{ fontSize: 9, color: "#9A8060", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Didact Gothic', sans-serif", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", height: 580 }}>
          {/* Main shape */}
          <div style={{
            width: 340, height: 460,
            background: "linear-gradient(145deg, #F0E4C8, #E8D5A8)",
            borderRadius: "170px 170px 110px 110px",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", zIndex: 2,
            boxShadow: "0 32px 80px rgba(193,152,60,0.2), 0 8px 32px rgba(42,31,14,0.08)",
            border: "1px solid rgba(193,152,60,0.2)",
            animation: "float 6s ease infinite",
          }}>
            <img src={LOGO_SRC} alt="h" style={{ width: 160, height: 160, objectFit: "contain", opacity: 0.9 }} />
          </div>

          {/* Floating cards */}
          <div style={{
            position: "absolute", top: 70, right: -10, zIndex: 3,
            background: "rgba(253,251,247,0.95)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(193,152,60,0.2)", borderRadius: 12,
            padding: "14px 18px",
            boxShadow: "0 8px 32px rgba(42,31,14,0.08)",
          }}>
            <div style={{ fontSize: 15, fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", color: "#2A1F0E" }}>New In 🌸</div>
            <div style={{ fontSize: 9, color: "#C1983C", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Didact Gothic', sans-serif", marginTop: 4 }}>Koleksi Terbaru</div>
          </div>

          <div style={{
            position: "absolute", bottom: 90, left: -20, zIndex: 3,
            background: "rgba(253,251,247,0.95)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(193,152,60,0.2)", borderRadius: 12,
            padding: "14px 18px",
            boxShadow: "0 8px 32px rgba(42,31,14,0.08)",
          }}>
            <div style={{ fontSize: 15, fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", color: "#2A1F0E" }}>Free Ongkir 🚚</div>
            <div style={{ fontSize: 9, color: "#C1983C", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Didact Gothic', sans-serif", marginTop: 4 }}>Jawa & Bali</div>
          </div>

          {/* Outer ring */}
          <div style={{ position: "absolute", width: 400, height: 520, borderRadius: "200px 200px 130px 130px", border: "1px solid rgba(193,152,60,0.15)", zIndex: 1 }} />
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: "linear-gradient(135deg, #C1983C, #D4AA50, #C1983C)", padding: "13px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", animation: "marquee 25s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 20, marginRight: 20, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#FDFBF7", fontFamily: "'Didact Gothic', sans-serif" }}>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(253,251,247,0.5)", display: "inline-block" }} />
              Premium Quality
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(253,251,247,0.5)", display: "inline-block" }} />
              Free Ongkir Jawa & Bali
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(253,251,247,0.5)", display: "inline-block" }} />
              100% Original
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(253,251,247,0.5)", display: "inline-block" }} />
              Easy Returns
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section style={{ padding: "88px 48px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C1983C", fontFamily: "'Didact Gothic', sans-serif", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <span>✦</span> Browse by Style
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 400, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em", lineHeight: 1.2, color: "#2A1F0E" }}>
              Temukan <span style={{ fontStyle: "italic", color: "#C1983C" }}>Gayamu</span>
            </h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {categories.map(cat => (
            <div key={cat.name}
              onMouseEnter={() => setHoveredCat(cat.name)}
              onMouseLeave={() => setHoveredCat(null)}
              style={{
                background: hoveredCat === cat.name ? "linear-gradient(145deg, #F0E4C8, #E8D5A8)" : "#F7F2E8",
                borderRadius: 4, padding: "32px 24px", cursor: "pointer",
                transition: "all 0.3s ease",
                border: hoveredCat === cat.name ? "1px solid rgba(193,152,60,0.35)" : "1px solid rgba(193,152,60,0.1)",
                boxShadow: hoveredCat === cat.name ? "0 8px 32px rgba(193,152,60,0.15)" : "none",
                transform: hoveredCat === cat.name ? "translateY(-3px)" : "none",
              }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{cat.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", color: "#2A1F0E", marginBottom: 6 }}>{cat.name}</div>
              <div style={{ fontSize: 9, color: "#C1983C", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Didact Gothic', sans-serif" }}>{cat.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: "0 48px 88px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C1983C", fontFamily: "'Didact Gothic', sans-serif", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <span>✦</span> Pilihan Editor
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 400, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em", lineHeight: 1.2, color: "#2A1F0E" }}>
              Best <span style={{ fontStyle: "italic", color: "#C1983C" }}>Sellers</span>
            </h2>
          </div>
          <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C1983C", cursor: "pointer", fontFamily: "'Didact Gothic', sans-serif", borderBottom: "1px solid #C1983C", paddingBottom: 2 }}>Lihat Semua →</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {featuredProducts.map((product, i) => (
            <div key={product.id}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{ cursor: "pointer", transition: "all 0.3s ease", transform: hoveredProduct === product.id ? "translateY(-6px)" : "none" }}>
              <div style={{
                height: 320, borderRadius: 4, background: product.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden", marginBottom: 18,
                border: "1px solid rgba(193,152,60,0.15)",
                boxShadow: hoveredProduct === product.id ? "0 20px 60px rgba(193,152,60,0.2)" : "0 4px 16px rgba(42,31,14,0.06)",
                transition: "box-shadow 0.3s ease",
              }}>
                <img src={LOGO_SRC} alt="" style={{ position: "absolute", width: 70, height: 70, objectFit: "contain", opacity: 0.07, bottom: 12, right: 12 }} />
                <span style={{ fontSize: 72, zIndex: 2 }}>{product.emoji}</span>
                {i === 0 && <div style={{ position: "absolute", top: 14, left: 14, background: "linear-gradient(135deg, #C1983C, #D4AA50)", color: "#FDFBF7", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", padding: "4px 10px", fontFamily: "'Didact Gothic', sans-serif" }}>Best Seller</div>}
                {i === 1 && <div style={{ position: "absolute", top: 14, left: 14, background: "#2A1F0E", color: "#C1983C", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", padding: "4px 10px", fontFamily: "'Didact Gothic', sans-serif", border: "1px solid rgba(193,152,60,0.3)" }}>New</div>}
              </div>
              <div style={{ fontSize: 17, fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", marginBottom: 4, color: "#2A1F0E" }}>{product.name}</div>
              <div style={{ fontSize: 9, color: "#C1983C", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Didact Gothic', sans-serif", marginBottom: 10 }}>{product.subtitle}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Cormorant Garamond', serif", color: "#2A1F0E" }}>Rp {product.price.toLocaleString("id-ID")}</span>
                <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C1983C", cursor: "pointer", fontFamily: "'Didact Gothic', sans-serif", borderBottom: "1px solid #C1983C" }}>Add to Cart →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <div style={{ margin: "0 48px", background: "linear-gradient(135deg, #F0E4C8 0%, #E8D5A8 50%, #DEC88A 100%)", borderRadius: 4, padding: "72px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 48, position: "relative", overflow: "hidden", border: "1px solid rgba(193,152,60,0.2)" }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 280, height: 280, background: "radial-gradient(circle, rgba(193,152,60,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, zIndex: 2 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9A6E1A", fontFamily: "'Didact Gothic', sans-serif" }}>✦ Special Offer</span>
          <h2 style={{ fontSize: 48, fontWeight: 400, fontFamily: "'Cormorant Garamond', serif", color: "#2A1F0E", lineHeight: 1.1 }}>
            Free Ongkir<br /><span style={{ fontStyle: "italic", color: "#9A6E1A" }}>Jawa & Bali</span>
          </h2>
          <p style={{ fontSize: 14, color: "#6A5030", lineHeight: 1.8, fontFamily: "'Didact Gothic', sans-serif", fontWeight: 300 }}>
            Semua order ke Jawa dan Bali gratis ongkir, tanpa minimum pembelian. Nikmati kemudahan belanja hijab premium langsung ke pintumu.
          </p>
          <button style={{ background: "#2A1F0E", color: "#F0E4C8", border: "none", padding: "14px 36px", borderRadius: 2, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Didact Gothic', sans-serif", alignSelf: "flex-start", boxShadow: "0 6px 20px rgba(42,31,14,0.2)" }}>
            Shop Now →
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
          <img src={LOGO_SRC} alt="h" style={{ width: 180, height: 180, objectFit: "contain", opacity: 0.5 }} />
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section style={{ padding: "88px 48px", background: "#F7F2E8" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C1983C", fontFamily: "'Didact Gothic', sans-serif", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span>✦</span> Customer Stories
          </div>
          <h2 style={{ fontSize: 42, fontWeight: 400, fontFamily: "'Cormorant Garamond', serif", color: "#2A1F0E" }}>
            Kata <span style={{ fontStyle: "italic", color: "#C1983C" }}>Mereka</span>
          </h2>
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 18, color: "#C1983C", marginBottom: 24, letterSpacing: 6 }}>★★★★★</div>
          <p style={{ fontSize: 22, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.65, marginBottom: 28, color: "#2A1F0E", transition: "all 0.5s ease" }}>
            "{testimonials[activeTestimonial].text}"
          </p>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9A8060", fontFamily: "'Didact Gothic', sans-serif" }}>
            — {testimonials[activeTestimonial].name}, {testimonials[activeTestimonial].city}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
            {testimonials.map((_, i) => (
              <div key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? 28 : 6, height: 6, borderRadius: 3, background: i === activeTestimonial ? "#C1983C" : "#D4C4A8", transition: "all 0.3s ease", cursor: "pointer" }} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#2A1F0E", color: "#FDFBF7", padding: "64px 48px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid rgba(193,152,60,0.15)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <img src={LOGO_SRC} alt="h" style={{ width: 38, height: 38, objectFit: "contain" }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.22em", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>HIJABERS</div>
                <div style={{ fontSize: 7, letterSpacing: "0.45em", color: "#C1983C", textTransform: "uppercase", fontFamily: "'Didact Gothic', sans-serif", marginTop: 3 }}>COLLECTIVE</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(253,251,247,0.45)", lineHeight: 1.8, fontFamily: "'Didact Gothic', sans-serif", fontWeight: 300 }}>
              Modest wear untuk wanita modern Indonesia. Kualitas premium, harga terjangkau, dikirim ke seluruh nusantara.
            </p>
          </div>
          {[
            { title: "Shop", links: ["Pashmina", "Bergo", "Square", "Syari", "New Arrivals"] },
            { title: "Info", links: ["Tentang Kami", "Care Guide", "Shipping Info", "Returns", "Blog"] },
            { title: "Kontak", links: ["📱 WhatsApp", "📧 Email", "📸 Instagram", "🎵 TikTok"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C1983C", marginBottom: 18, fontFamily: "'Didact Gothic', sans-serif" }}>{col.title}</div>
              {col.links.map(link => (
                <div key={link} style={{ fontSize: 12, color: "rgba(253,251,247,0.45)", marginBottom: 10, cursor: "pointer", fontFamily: "'Didact Gothic', sans-serif", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#C1983C"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(253,251,247,0.45)"}>
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "rgba(253,251,247,0.25)", fontFamily: "'Didact Gothic', sans-serif", letterSpacing: "0.1em" }}>© 2025 Hijabers.id — All rights reserved</span>
          <span style={{ fontSize: 10, color: "rgba(253,251,247,0.25)", fontFamily: "'Didact Gothic', sans-serif", letterSpacing: "0.1em" }}>Made with 🤍 in Indonesia</span>
        </div>
      </footer>
    </div>
  );
}