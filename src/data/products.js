export const CATEGORIES = ["Wide Pants","Tapered Pants","Sweat Pants","Wide Skirt","Cardigan","Knit Top","Shirt","Jaket"];

export const COLORS = [
  { name:"Cream", hex:"#F5ECD7" },
  { name:"Sage Green", hex:"#A8B59C" },
  { name:"Dusty Rose", hex:"#E8C5C8" },
  { name:"Warm Brown", hex:"#C9A882" },
  { name:"Off White", hex:"#F0EDE8" },
  { name:"Classic Black", hex:"#2B2B2B" },
  { name:"Navy", hex:"#1B2A4A" },
  { name:"Mocha", hex:"#8B6B4A" },
];

export const ZONES = [
  { value:"zona1", label:"Zona 1 — Jawa & Bali", baseRate:0, extraRate:0 },
  { value:"zona2", label:"Zona 2 — Sumatera, Kalimantan, Sulawesi", baseRate:15000, extraRate:10000 },
  { value:"zona3", label:"Zona 3 — NTB, NTT, Maluku", baseRate:25000, extraRate:15000 },
  { value:"zona4", label:"Zona 4 — Papua", baseRate:35000, extraRate:20000 },
];

export function calcShipping(zone, totalWeightGram) {
  const z = ZONES.find(z => z.value === zone);
  if (!z || z.baseRate === 0) return 0;
  const kg = Math.ceil(totalWeightGram / 1000);
  return z.baseRate + Math.max(0, kg - 1) * z.extraRate;
}

const BG = {
  "Wide Pants":"linear-gradient(145deg,#F5ECD7,#EDD9B8)",
  "Tapered Pants":"linear-gradient(145deg,#EAE0D0,#D9CBAF)",
  "Sweat Pants":"linear-gradient(145deg,#E8E0D5,#D5C8B5)",
  "Wide Skirt":"linear-gradient(145deg,#EDE8DE,#DDD4C0)",
  "Cardigan":"linear-gradient(145deg,#F0E8D8,#E0D0B8)",
  "Knit Top":"linear-gradient(145deg,#EDE0D0,#DDD0BC)",
  "Shirt":"linear-gradient(145deg,#F2EDE0,#E5D8C8)",
  "Jaket":"linear-gradient(145deg,#E8E0D0,#D8CDB8)",
};

const p = (id,slug,name,cat,price,weight,colors,sizes,desc,badge=null,stock=20) => ({
  id,slug,name,category:cat,price,weight,colors,sizes,description:desc,badge,stock,bg:BG[cat],
});

export const products = [
  // WIDE PANTS
  p(1,"linen-wide-pants","Linen Wide Pants","Wide Pants",189000,300,["Cream","Sage Green","Classic Black"],["S","M","L","XL"],"Wide pants premium berbahan linen breathable, nyaman dipakai seharian. Potongan wide yang modern cocok untuk campus dan kerja.","Best Seller"),
  p(2,"cotton-wide-pants","Cotton Wide Pants","Wide Pants",175000,280,["Off White","Warm Brown","Navy"],["S","M","L","XL"],"Wide pants katun premium dengan potongan longgar yang elegan. Bahan ringan dan nyaman untuk hari panjang."),
  p(3,"pleated-wide-pants","Pleated Wide Pants","Wide Pants",210000,320,["Cream","Mocha","Classic Black"],["S","M","L","XL"],"Pleated wide pants dengan detail lipit yang anggun. Perfect untuk tampilan formal dan semi-formal."),

  // TAPERED PANTS
  p(4,"tapered-chino","Tapered Chino","Tapered Pants",195000,290,["Warm Brown","Sage Green","Classic Black"],["S","M","L","XL"],"Celana chino tapered dengan cut yang modern. Bahan twill premium, nyaman seharian.","Best Seller"),
  p(5,"slim-tapered-pants","Slim Tapered Pants","Tapered Pants",185000,270,["Cream","Navy","Mocha"],["S","M","L","XL"],"Tapered pants dengan siluet slim yang clean. Cocok untuk tampilan smart casual sehari-hari."),
  p(6,"tapered-twill","Tapered Twill Pants","Tapered Pants",199000,295,["Off White","Dusty Rose","Classic Black"],["S","M","L","XL"],"Celana twill tapered dengan texture subtle. Versatile untuk berbagai kesempatan."),

  // SWEAT PANTS
  p(7,"fleece-sweat-pants","Fleece Sweat Pants","Sweat Pants",165000,350,["Cream","Sage Green","Classic Black"],["S","M","L","XL"],"Sweat pants fleece premium, lembut dan hangat. Perfect untuk hari santai dan belajar.","New"),
  p(8,"jogger-pants","Jogger Pants","Sweat Pants",155000,330,["Off White","Mocha","Navy"],["S","M","L","XL"],"Jogger pants dengan elastic waist dan cuffed ankle. Sporty yet modest untuk aktivitas harian."),
  p(9,"cozy-sweat-pants","Cozy Sweat Pants","Sweat Pants",175000,360,["Warm Brown","Dusty Rose","Cream"],["S","M","L","XL"],"Super soft sweat pants untuk hari-hari santai. Bahan cotton fleece premium yang mewah."),

  // WIDE SKIRT
  p(10,"midi-wide-skirt","Midi Wide Skirt","Wide Skirt",185000,280,["Cream","Sage Green","Dusty Rose"],["S","M","L","XL"],"Midi skirt dengan potongan wide yang anggun. Panjang selutut ke bawah, cocok untuk campus dan kerja.","Best Seller"),
  p(11,"maxi-flow-skirt","Maxi Flow Skirt","Wide Skirt",199000,310,["Off White","Warm Brown","Classic Black"],["S","M","L","XL"],"Maxi skirt dengan siluet flowing yang elegan. Bahan ringan dan breathable untuk tampilan anggun."),
  p(12,"aline-wide-skirt","A-Line Wide Skirt","Wide Skirt",175000,260,["Dusty Rose","Navy","Cream"],["S","M","L","XL"],"A-line skirt dengan potongan wide yang flattering. Perfect untuk everyday modest look."),

  // CARDIGAN
  p(13,"knit-cardigan","Knit Cardigan","Cardigan",225000,350,["Cream","Sage Green","Warm Brown"],["S","M","L","XL"],"Cardigan rajut premium dengan texture halus. Cocok dilayer di atas outfit apapun.","Best Seller"),
  p(14,"button-cardigan","Button-Down Cardigan","Cardigan",235000,360,["Off White","Dusty Rose","Classic Black"],["S","M","L","XL"],"Cardigan dengan button detail yang chic. Versatile dan elegant untuk berbagai kesempatan."),
  p(15,"oversized-cardigan","Oversized Cardigan","Cardigan",249000,380,["Cream","Mocha","Sage Green"],["S","M","L","XL"],"Oversized cardigan yang cozy dan stylish. Perfect untuk layering look yang trendy.","New"),

  // KNIT TOP
  p(16,"ribbed-knit-top","Ribbed Knit Top","Knit Top",145000,220,["Cream","Dusty Rose","Classic Black"],["S","M","L","XL"],"Ribbed knit top dengan texture bergaris halus. Stretch dan nyaman untuk aktivitas harian.","Best Seller"),
  p(17,"stripe-knit-top","Stripe Knit Top","Knit Top",155000,230,["Cream","Sage Green","Navy"],["S","M","L","XL"],"Knit top dengan motif stripe subtle. Casually elegant untuk hari-hari kuliah."),
  p(18,"sleeveless-knit","Sleeveless Knit Top","Knit Top",135000,200,["Off White","Warm Brown","Dusty Rose"],["S","M","L","XL"],"Sleeveless knit top untuk layering. Pair dengan cardigan untuk tampilan sempurna."),

  // SHIRT
  p(19,"linen-shirt","Linen Oversized Shirt","Shirt",199000,270,["Off White","Sage Green","Classic Black"],["S","M","L","XL"],"Linen shirt dengan cut oversized yang modern. Breathable dan nyaman untuk hari panas.","Best Seller"),
  p(20,"oxford-shirt","Oxford Button Shirt","Shirt",215000,280,["Cream","Navy","Classic Black"],["S","M","L","XL"],"Oxford shirt klasik dengan kualitas premium. Clean dan profesional untuk tampilan kerja."),
  p(21,"oversized-shirt","Oversized Cotton Shirt","Shirt",189000,265,["Off White","Dusty Rose","Mocha"],["S","M","L","XL"],"Cotton shirt oversized yang casual dan stylish. Easy to style untuk berbagai look."),

  // JAKET
  p(22,"windbreaker-jaket","Windbreaker Jaket","Jaket",285000,400,["Sage Green","Classic Black","Navy"],["S","M","L","XL"],"Windbreaker ringan dengan bahan water-resistant. Sporty dan fungsional untuk aktivitas outdoor.","New"),
  p(23,"bomber-jaket","Bomber Jaket","Jaket",320000,450,["Classic Black","Cream","Warm Brown"],["S","M","L","XL"],"Bomber jaket dengan siluet klasik yang timeless. Premium quality, cocok untuk daily look."),
  p(24,"fleece-jaket","Fleece Zip Jaket","Jaket",299000,420,["Cream","Sage Green","Mocha"],["S","M","L","XL"],"Fleece jaket dengan zip detail. Hangat dan cozy untuk musim hujan.","Best Seller"),
];

export const getFeatured = () => products.filter(p => p.badge).slice(0,6);
export const getByCategory = (cat) => products.filter(p => p.category === cat);
export const getBySlug = (slug) => products.find(p => p.slug === slug);
export const getRelated = (product) => products.filter(p => p.category === product.category && p.id !== product.id).slice(0,3);
export const searchProducts = (query) => products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()));
