// Harga grosir 3 tier. Semua harga di database dalam Rupiah PER PCS.
export const TIER2_MIN = 5000000;   // total di atas 5 jt -> Tier 2
export const TIER3_MIN = 10000000;  // total di atas 10 jt -> Tier 3

export const rp = (n) => 'Rp ' + Math.round(n || 0).toLocaleString('id-ID');

export const seriesQty = (p) => Number(p.series_qty) || 4;

// Harga per pcs sesuai tier (fallback ke tier sebelumnya bila kosong)
export function unitPrice(p, tier) {
  const t1 = Number(p.price_tier1 ?? p.price) || 0;
  const t2 = Number(p.price_tier2) || t1;
  const t3 = Number(p.price_tier3) || t2;
  return tier === 3 ? t3 : tier === 2 ? t2 : t1;
}

// Tier ditentukan dari total memakai harga NORMAL (Tier 1) agar stabil, tidak berputar-putar.
export function getTier(items) {
  const base = items.reduce((s, i) => s + unitPrice(i.product, 1) * seriesQty(i.product) * i.qty, 0);
  return base > TIER3_MIN ? 3 : base > TIER2_MIN ? 2 : 1;
}
