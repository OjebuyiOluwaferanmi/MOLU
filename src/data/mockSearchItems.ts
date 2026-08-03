import hdmiCable from "../assets/hdmi.jpg";
import brandOfTheDay from "../assets/brand-of-the-day.png";
import b1 from "../assets/b1.jpg";
import b2 from "../assets/b2.jpg";

/**
 * mockSearchItems.ts — the central mock product catalog
 * -----------------------------------------------------------------------
 * Single source of truth for search, landing page sections, and the
 * product detail page.
 *
 * colors / memoryOptions / specifications / whatsInTheBox / reviews are
 * generated deterministically per product (see generators at the bottom)
 * rather than hand-authored on all 25 items — swap any of those
 * generators for real backend data later without touching consumers.
 */

export interface MockProduct {
  id: string;
  name: string;
  brand: string;
  productCode: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  soldCount: number;
  image: string;
  images: string[];
  categoryId: string;
  categoryLabel: string;
  subcategoryId?: string;
  subcategoryLabel?: string;

  // Variant + detail data, generated below — optional because not every
  // category makes sense with e.g. colors (groceries) or memory (fashion).
  colors?: ProductColorOption[];
  memoryOptions?: string[];
  specifications?: ProductSpecification[];
  whatsInTheBox?: string[];
  packageItemCount?: number;
  reviews?: ProductReview[];
  reviewCount?: number;
  inStock?: boolean;
}

export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  reviewerName: string; // pre-masked for display, e.g. "Ch***ka"
  rating: number;
  comment: string;
  date: string;
}

const PLACEHOLDER_IMAGES = [hdmiCable, brandOfTheDay, b1, b2];

function pickImages(seed: number, count: number): string[] {
  return Array.from(
    { length: count },
    (_, i) => PLACEHOLDER_IMAGES[(seed + i) % PLACEHOLDER_IMAGES.length]
  );
}

// -----------------------------------------------------------------------
// Raw catalog — unchanged from before, just typed as MockProduct so the
// generated fields below can be spread on without a second interface.
// -----------------------------------------------------------------------
const RAW_ITEMS: MockProduct[] = [
  {
    id: "1",
    name: "iPhone 14 Pro Max",
    brand: "Apple",
    productCode: "IP14PM-256",
    description:
      "Apple's flagship smartphone with the A16 Bionic chip, Super Retina XDR display, and a pro-grade camera system.",
    price: 850000,
    originalPrice: 950000,
    discountPercent: 11,
    rating: 4.5,
    soldCount: 230,
    image: pickImages(1, 4)[0],
    images: pickImages(1, 4),
    categoryId: "phones-tablets",
    categoryLabel: "Phones & Tablets",
    subcategoryId: "ios",
    subcategoryLabel: "iOS Phones",
  },
  {
    id: "2",
    name: "Samsung Galaxy S23 Ultra",
    brand: "Samsung",
    productCode: "SGS23U-512",
    description:
      "A powerhouse Android flagship with a 200MP camera, S Pen support, and a stunning Dynamic AMOLED display.",
    price: 780000,
    originalPrice: 900000,
    discountPercent: 13,
    rating: 4.6,
    soldCount: 198,
    image: pickImages(2, 3)[0],
    images: pickImages(2, 3),
    categoryId: "phones-tablets",
    categoryLabel: "Phones & Tablets",
    subcategoryId: "android",
    subcategoryLabel: "Android Phones",
  },
  {
    id: "3",
    name: "iPad Air 5th Generation",
    brand: "Apple",
    productCode: "IPADAIR5-64",
    description:
      "Powered by the M1 chip, the iPad Air 5th Gen delivers pro-level performance in a slim, lightweight design.",
    price: 420000,
    originalPrice: 480000,
    discountPercent: 12,
    rating: 4.4,
    soldCount: 120,
    image: pickImages(3, 4)[0],
    images: pickImages(3, 4),
    categoryId: "phones-tablets",
    categoryLabel: "Phones & Tablets",
    subcategoryId: "tablets",
    subcategoryLabel: "Tablets",
  },
  {
    id: "4",
    name: "Original HDMI Cable 1080p High Speed",
    brand: "Generic",
    productCode: "HDMI-1080-2M",
    description:
      "A reliable high-speed HDMI cable supporting 1080p resolution for TVs, monitors, laptops, and gaming consoles.",
    price: 5000,
    originalPrice: 9500,
    discountPercent: 15,
    rating: 3.5,
    soldCount: 14,
    image: pickImages(4, 3)[0],
    images: pickImages(4, 3),
    categoryId: "electronics",
    categoryLabel: "Electronics",
  },
  {
    id: "5",
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    productCode: "SNY-WH1000XM5",
    description:
      "Industry-leading noise cancellation with exceptional sound quality and up to 30 hours of battery life.",
    price: 210000,
    originalPrice: 250000,
    discountPercent: 16,
    rating: 4.7,
    soldCount: 340,
    image: pickImages(5, 4)[0],
    images: pickImages(5, 4),
    categoryId: "electronics",
    categoryLabel: "Electronics",
  },
  {
    id: "6",
    name: "JBL Bluetooth Speaker",
    brand: "JBL",
    productCode: "JBL-FLIP6",
    description:
      "Portable, waterproof Bluetooth speaker delivering bold, punchy sound wherever you take it.",
    price: 45000,
    originalPrice: 60000,
    discountPercent: 25,
    rating: 4.2,
    soldCount: 512,
    image: pickImages(6, 3)[0],
    images: pickImages(6, 3),
    categoryId: "electronics",
    categoryLabel: "Electronics",
  },
  {
    id: "7",
    name: "HP Pavilion Laptop 15-inch",
    brand: "HP",
    productCode: "HP-PAV15-i5",
    description:
      "A dependable everyday laptop with a 15-inch Full HD display, ideal for work, study, and streaming.",
    price: 480000,
    originalPrice: 550000,
    discountPercent: 13,
    rating: 4.3,
    soldCount: 76,
    image: pickImages(7, 4)[0],
    images: pickImages(7, 4),
    categoryId: "computing",
    categoryLabel: "Computing",
  },
  {
    id: "8",
    name: "Logitech Wireless Mouse",
    brand: "Logitech",
    productCode: "LOG-M185",
    description:
      "A comfortable, reliable wireless mouse with plug-and-play setup and long battery life.",
    price: 12000,
    originalPrice: 16000,
    discountPercent: 25,
    rating: 4.5,
    soldCount: 890,
    image: pickImages(8, 3)[0],
    images: pickImages(8, 3),
    categoryId: "computing",
    categoryLabel: "Computing",
  },
  {
    id: "9",
    name: "Mechanical Gaming Keyboard",
    brand: "Redragon",
    productCode: "RDG-K552",
    description:
      "RGB backlit mechanical keyboard built for fast, responsive gaming and typing.",
    price: 35000,
    originalPrice: 45000,
    discountPercent: 22,
    rating: 4.4,
    soldCount: 265,
    image: pickImages(9, 4)[0],
    images: pickImages(9, 4),
    categoryId: "computing",
    categoryLabel: "Computing",
  },
  {
    id: "10",
    name: "Nike Air Max 270",
    brand: "Nike",
    productCode: "NK-AM270",
    description:
      "Iconic Nike silhouette with a large Air unit for all-day comfort and standout street style.",
    price: 65000,
    originalPrice: 85000,
    discountPercent: 24,
    rating: 4.6,
    soldCount: 410,
    image: pickImages(10, 3)[0],
    images: pickImages(10, 3),
    categoryId: "fashion",
    categoryLabel: "Fashion",
    subcategoryId: "footwear",
    subcategoryLabel: "Footwear",
  },
  {
    id: "11",
    name: "Adidas Ultraboost Running Shoes",
    brand: "Adidas",
    productCode: "ADS-UB22",
    description:
      "Responsive Boost cushioning built for long runs and everyday comfort.",
    price: 72000,
    originalPrice: 95000,
    discountPercent: 24,
    rating: 4.5,
    soldCount: 322,
    image: pickImages(11, 4)[0],
    images: pickImages(11, 4),
    categoryId: "fashion",
    categoryLabel: "Fashion",
    subcategoryId: "footwear",
    subcategoryLabel: "Footwear",
  },
  {
    id: "12",
    name: "Ankara Print Dress",
    brand: "Local Fashion",
    productCode: "AFR-DRS-01",
    description:
      "A vibrant, well-tailored Ankara print dress perfect for both casual and formal occasions.",
    price: 18000,
    originalPrice: 25000,
    discountPercent: 28,
    rating: 4.3,
    soldCount: 150,
    image: pickImages(12, 3)[0],
    images: pickImages(12, 3),
    categoryId: "fashion",
    categoryLabel: "Fashion",
    subcategoryId: "womenswear",
    subcategoryLabel: "Womenswear",
  },
  {
    id: "13",
    name: "Men's Slim Fit Denim Jeans",
    brand: "Denim Co.",
    productCode: "DNM-SLM-32",
    description:
      "Classic slim-fit jeans made from durable stretch denim for everyday comfort.",
    price: 14000,
    originalPrice: 20000,
    discountPercent: 30,
    rating: 4.1,
    soldCount: 540,
    image: pickImages(13, 4)[0],
    images: pickImages(13, 4),
    categoryId: "fashion",
    categoryLabel: "Fashion",
    subcategoryId: "menswear",
    subcategoryLabel: "Menswear",
  },
  {
    id: "14",
    name: "Vitamin C Serum",
    brand: "SkinPure",
    productCode: "SKP-VITC30",
    description:
      "A brightening facial serum formulated to even skin tone and boost radiance.",
    price: 8500,
    originalPrice: 12000,
    discountPercent: 29,
    rating: 4.6,
    soldCount: 670,
    image: pickImages(14, 3)[0],
    images: pickImages(14, 3),
    categoryId: "health",
    categoryLabel: "Health",
  },
  {
    id: "15",
    name: "Electric Toothbrush",
    brand: "Oral-B",
    productCode: "ORB-ELC-PRO2",
    description:
      "Rechargeable electric toothbrush with pressure-sensing technology for a deeper, gentler clean.",
    price: 15000,
    originalPrice: 20000,
    discountPercent: 25,
    rating: 4.3,
    soldCount: 210,
    image: pickImages(15, 4)[0],
    images: pickImages(15, 4),
    categoryId: "health",
    categoryLabel: "Health",
  },
  {
    id: "16",
    name: "Blood Pressure Monitor",
    brand: "Omron",
    productCode: "OMR-BP-M2",
    description:
      "Easy-to-use digital blood pressure monitor for accurate home health tracking.",
    price: 22000,
    originalPrice: 28000,
    discountPercent: 21,
    rating: 4.5,
    soldCount: 95,
    image: pickImages(16, 3)[0],
    images: pickImages(16, 3),
    categoryId: "health",
    categoryLabel: "Health",
  },
  {
    id: "17",
    name: "Non-Stick Cooking Pot Set",
    brand: "KitchenPro",
    productCode: "KTP-SET5",
    description:
      "A 5-piece non-stick cookware set built for even heating and effortless cleanup.",
    price: 28000,
    originalPrice: 38000,
    discountPercent: 26,
    rating: 4.4,
    soldCount: 187,
    image: pickImages(17, 4)[0],
    images: pickImages(17, 4),
    categoryId: "home-office",
    categoryLabel: "Home & Office",
  },
  {
    id: "18",
    name: "Office Study Table",
    brand: "HomeDesk",
    productCode: "HDK-DSK120",
    description:
      "A sturdy, spacious study/office desk with a clean modern finish.",
    price: 55000,
    originalPrice: 70000,
    discountPercent: 21,
    rating: 4.2,
    soldCount: 63,
    image: pickImages(18, 3)[0],
    images: pickImages(18, 3),
    categoryId: "home-office",
    categoryLabel: "Home & Office",
  },
  {
    id: "19",
    name: "LED Desk Lamp",
    brand: "LightUp",
    productCode: "LTU-LED12",
    description:
      "Adjustable LED desk lamp with multiple brightness settings, ideal for late work sessions.",
    price: 9500,
    originalPrice: 13000,
    discountPercent: 27,
    rating: 4.5,
    soldCount: 340,
    image: pickImages(19, 4)[0],
    images: pickImages(19, 4),
    categoryId: "home-office",
    categoryLabel: "Home & Office",
  },
  {
    id: "20",
    name: "Basmati Rice 50kg Bag",
    brand: "Royal Grain",
    productCode: "RGR-BAS50",
    description:
      "Premium long-grain basmati rice, sold in a bulk 50kg bag for households and businesses.",
    price: 78000,
    originalPrice: 85000,
    discountPercent: 8,
    rating: 4.7,
    soldCount: 430,
    image: pickImages(20, 3)[0],
    images: pickImages(20, 3),
    categoryId: "groceries",
    categoryLabel: "Groceries",
  },
  {
    id: "21",
    name: "Vegetable Oil 5 Litres",
    brand: "PureGold",
    productCode: "PGD-VOIL5",
    description:
      "Pure, cholesterol-free vegetable oil, perfect for everyday cooking and frying.",
    price: 12500,
    originalPrice: 14500,
    discountPercent: 14,
    rating: 4.6,
    soldCount: 690,
    image: pickImages(21, 4)[0],
    images: pickImages(21, 4),
    categoryId: "groceries",
    categoryLabel: "Groceries",
  },
  {
    id: "22",
    name: "Baby Diapers Size 3 (Pack of 50)",
    brand: "Pampers",
    productCode: "PMP-DIA-S3",
    description:
      "Soft, absorbent diapers designed to keep babies dry and comfortable all day.",
    price: 9500,
    originalPrice: 12000,
    discountPercent: 21,
    rating: 4.7,
    soldCount: 520,
    image: pickImages(22, 3)[0],
    images: pickImages(22, 3),
    categoryId: "baby-products",
    categoryLabel: "Baby Products",
  },
  {
    id: "23",
    name: "Infant Baby Stroller",
    brand: "Chicco",
    productCode: "CHC-STR-LT",
    description:
      "A lightweight, foldable stroller with a smooth ride and reclining seat for infants.",
    price: 65000,
    originalPrice: 85000,
    discountPercent: 24,
    rating: 4.4,
    soldCount: 78,
    image: pickImages(23, 4)[0],
    images: pickImages(23, 4),
    categoryId: "baby-products",
    categoryLabel: "Baby Products",
  },
  {
    id: "24",
    name: "Car Dashboard Camera",
    brand: "VanTop",
    productCode: "VTP-DASH-4K",
    description:
      "4K dash cam with night vision and loop recording for reliable on-road footage.",
    price: 32000,
    originalPrice: 42000,
    discountPercent: 24,
    rating: 4.3,
    soldCount: 165,
    image: pickImages(24, 3)[0],
    images: pickImages(24, 3),
    categoryId: "automotive",
    categoryLabel: "Automotive",
  },
  {
    id: "25",
    name: "Yoga Mat Non-Slip",
    brand: "FitLife",
    productCode: "FTL-YGA-6MM",
    description:
      "Extra-thick, non-slip yoga mat offering great cushioning for workouts of any intensity.",
    price: 8000,
    originalPrice: 11000,
    discountPercent: 27,
    rating: 4.5,
    soldCount: 380,
    image: pickImages(25, 4)[0],
    images: pickImages(25, 4),
    categoryId: "sporting-goods",
    categoryLabel: "Sporting Goods",
  },
];

// -----------------------------------------------------------------------
// Generators — deterministic per-product "variation" so the detail page
// has real-looking colors, memory sizes, specs, box contents, and reviews
// without hand-authoring them for all 25 items. Swap for real API data
// (variant options, review endpoint, etc.) later — consumers only care
// about the fields on MockProduct, not how they were produced.
// -----------------------------------------------------------------------

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash += id.charCodeAt(i) * (i + 1);
  return hash;
}

const COLOR_PALETTE: ProductColorOption[] = [
  { name: "Black", hex: "#111111" },
  { name: "Blue", hex: "#3654D6" },
  { name: "Silver", hex: "#C7CBD1" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Red", hex: "#DC2626" },
  { name: "Green", hex: "#16A34A" },
];

// Categories where a color swatch doesn't make sense.
const NO_COLOR_CATEGORIES = new Set(["groceries", "health"]);

function generateColors(categoryId: string, seed: number): ProductColorOption[] | undefined {
  if (NO_COLOR_CATEGORIES.has(categoryId)) return undefined;
  const start = seed % COLOR_PALETTE.length;
  const count = 2 + (seed % 3); // 2-4 colors
  return Array.from(
    { length: count },
    (_, i) => COLOR_PALETTE[(start + i) % COLOR_PALETTE.length]
  );
}

const MEMORY_SIZES = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const MEMORY_CATEGORIES = new Set(["phones-tablets", "computing"]);

function generateMemoryOptions(categoryId: string, seed: number): string[] | undefined {
  if (!MEMORY_CATEGORIES.has(categoryId)) return undefined;
  const start = seed % 2;
  return MEMORY_SIZES.slice(start, start + 4);
}

function generateSpecifications(item: MockProduct): ProductSpecification[] {
  return [
    { label: "Brand", value: item.brand },
    { label: "Model", value: item.name },
    { label: "Category", value: item.categoryLabel },
    { label: "Product Code", value: item.productCode },
    { label: "Warranty", value: "1 Year Manufacturer Warranty" },
  ];
}

function generateBoxContents(item: MockProduct): string[] {
  switch (item.categoryId) {
    case "phones-tablets":
      return [item.name, "USB-C Charging Cable", "Quick Start Guide", "SIM Ejector Tool"];
    case "computing":
      return [item.name, "Power Adapter", "User Manual"];
    case "electronics":
      return [item.name, "User Manual", "Warranty Card"];
    case "fashion":
      return [item.name, "Dust Bag"];
    default:
      return [item.name, "User Manual"];
  }
}

const REVIEWER_NAMES = [
  "Ch***ka", "Ad***ol", "Ib***im", "Ng***zi",
  "Ol***mi", "Am***ka", "Ta***wo", "Bl***ng",
];

const REVIEW_COMMENTS = [
  "Really happy with this purchase — works exactly as described and arrived well packaged.",
  "Great quality for the price. Delivery was fast and everything was in perfect condition.",
  "Exceeded my expectations. Would definitely recommend this to a friend.",
  "Good value overall, though it took a little longer to arrive than expected.",
  "Solid product, does what it says. Happy with the purchase so far.",
];

function generateReviews(item: MockProduct): ProductReview[] {
  const seed = hashId(item.id);
  return Array.from({ length: 3 }).map((_, i) => {
    const nameIndex = (seed + i * 3) % REVIEWER_NAMES.length;
    const commentIndex = (seed + i * 7) % REVIEW_COMMENTS.length;
    const ratingOffset = ((seed + i) % 3) * 0.5 - 0.5; // -0.5, 0, +0.5
    const rating = Math.min(5, Math.max(3, Math.round((item.rating + ratingOffset) * 2) / 2));
    return {
      id: `${item.id}-review-${i + 1}`,
      reviewerName: REVIEWER_NAMES[nameIndex],
      rating,
      comment: REVIEW_COMMENTS[commentIndex],
      date: "12-07-2026",
    };
  });
}

function generateReviewCount(soldCount: number): number {
  return Math.max(8, Math.round(soldCount / 8));
}

export const MOCK_SEARCH_ITEMS: MockProduct[] = RAW_ITEMS.map((item) => {
  const seed = hashId(item.id);
  const whatsInTheBox = generateBoxContents(item);
  return {
    ...item,
    colors: generateColors(item.categoryId, seed),
    memoryOptions: generateMemoryOptions(item.categoryId, seed),
    specifications: generateSpecifications(item),
    whatsInTheBox,
    packageItemCount: whatsInTheBox.length,
    reviews: generateReviews(item),
    reviewCount: generateReviewCount(item.soldCount),
    inStock: true,
  };
});

/** Look up a single product by id. */
export function getProductById(id: string): MockProduct | undefined {
  return MOCK_SEARCH_ITEMS.find((item) => item.id === id);
}