import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const G = "#C1983C", D = "#2A1F0E", C = "#FDFBF7";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const links = [
    { to: '/shop', label: 'Koleksi' },
    { to: '/about', label: 'About' },
  ];

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    padding: scrolled ? '12px 48px' : '20px 48px',
    background: scrolled ? 'rgba(253,251,247,0.97)' : 'rgba(253,251,247,0.88)',
    backdropFilter: 'blur(16px)',
    borderBottom: scrolled ? '1px solid rgba(193,152,60,0.15)' : '1px solid transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    transition: 'all 0.4s ease',
    boxShadow: scrolled ? '0 2px 24px rgba(42,31,14,0.06)' : 'none',
  };

  return (
    <>
      <nav style={navStyle}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <img src="/logo.png" alt="Hijabers" style={{ height:38, width:38, objectFit:'contain' }} />
          <div>
            <div style={{ fontSize:16, fontWeight:700, letterSpacing:'0.22em', fontFamily:"'Cormorant Garamond',serif", color:D, lineHeight:1 }}>HIJABERS</div>
            <div style={{ fontSize:7, letterSpacing:'0.45em', color:G, textTransform:'uppercase', marginTop:3 }}>COLLECTIVE</div>
          </div>
        </Link>

        <div className="nav-links">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{ fontSize:11, letterSpacing:'0.18em', color:location.pathname === l.to ? G : '#5C4A2A', cursor:'pointer', textTransform:'uppercase', fontFamily:"'Didact Gothic',sans-serif", transition:'color 0.2s', borderBottom: location.pathname === l.to ? `1px solid ${G}` : 'none', paddingBottom:2 }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Link to="/cart" style={{ background:`linear-gradient(135deg,${G},#D4AA50,${G})`, color:C, border:'none', cursor:'pointer', padding:'9px 20px', borderRadius:2, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', fontFamily:"'Didact Gothic',sans-serif", boxShadow:'0 4px 16px rgba(193,152,60,0.25)', transition:'all 0.3s', display:'flex', alignItems:'center', gap:6, textDecoration:'none' }}>
            🛒 {cartCount > 0 ? <span style={{ background:D, color:G, borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700 }}>{cartCount}</span> : 'Keranjang'}
          </Link>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ fontSize:22, background:'none', border:'none', cursor:'pointer', color:D }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {links.map(l => (
            <Link key={l.to} to={l.to} className="mobile-menu-item" onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
          <Link to="/cart" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>🛒 Keranjang {cartCount > 0 && `(${cartCount})`}</Link>
        </div>
      )}
    </>
  );
}
