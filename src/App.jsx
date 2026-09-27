import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  ExternalLink,
  User,
  Globe,
  Search,
  Shield,
  Check,
  Phone,
  ArrowLeft,
  ArrowRight,
  X,
  Edit,
  PlusCircle,
  Sparkles,
  Folder,
  Trash2,
  Mail,
  MapPin,
  Menu,
  LogOut,
  Lock,
  GraduationCap,
  Save,
  Image as ImageIcon,
  UploadCloud,
} from "lucide-react";

/* =========================================================================
   1. KONFIGURASI SUPABASE
   Jika environment variable tidak tersedia, aplikasi otomatis fallback
   ke state lokal (in-memory) sehingga tetap berjalan tanpa error.
   ========================================================================= */
const SUPABASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || "";
const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || "";

let supabase = null;
try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn("Supabase tidak terhubung, menggunakan data lokal.", err);
  supabase = null;
}

const PRODUCTS_TABLE = "showcase_products";
const REVIEWS_TABLE = "showcase_reviews";
const DOCUMENTATION_TABLE = "showcase_documentation";
const DOCUMENTATION_ROW_ID = "main";
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/* =========================================================================
   2. PROFIL KELOMPOK / IDENTITAS SEKOLAH
   ========================================================================= */
const GROUP_PROFILE = {
  name: "ORIGINERS",
  fullName: "KELOMPOK 1 PKWU",
  tagline: "Merajut Kreativitas, Menenun Kewirausahaan",
  school: "SMA Negeri 12 Jakarta",
  className: "XII CLASSIX",
  schoolYear: "2026/2027",
  subject: "Prakarya dan Kewirausahaan (PKWU)",
  waNumber: "6285880143957",
  email: "haiklgeming@gmail.com",
  address: "Jl. Kp Jati Selatan ",
};

const BADGES = [
  { icon: "Sparkles", label: "Original Design" },
  { icon: "Check", label: "Handmade & Eco-Friendly" },
  { icon: "GraduationCap", label: "Inovasi Siswa SMA Negeri 12 Jakarta" },
];

const ADMIN_PASSWORD = "Haikal122";

/* =========================================================================
   3. DATA KATEGORI & MOCK DATA PRODUK
   ========================================================================= */
const CATEGORIES = [
  "Semua",
  "Fusion Food Nusantara",
  "Soon",
  "Soon",
  "Soon",
];

const initialProducts = [
  {
    id: "prod-001",
    name: "Tas Anyam Pandan \"Selaras\"",
    category: "",
    image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80",
    description:
      "Tas jinjing berbahan dasar daun pandan kering yang dianyam manual dengan pola tradisional Nusantara, dipadukan sentuhan desain kontemporer agar cocok dipakai sehari-hari.",
    specs:
      "Daun pandan kering pilihan, benang katun untuk penguat jahitan, kain lapis bagian dalam dari katun blacu, resleting anti karat.",
    process:
      "Proses dimulai dari pengeringan daun pandan selama 3 hari, dianyam dengan pola \"kepang tiga\" khas daerah, lalu dijahit dan dilapisi kain bagian dalam. Setiap tas membutuhkan waktu pengerjaan sekitar 2 hari.",
    documentation: [
      "https://images.unsplash.com/photo-1581091870628-518ce6a5e46f?w=900&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&q=80",
    ],
    infographic: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
      "https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=900&q=80",
    ],
  },
  {
    id: "prod-002",
    name: "Gelang Makrame \"Untaian\"",
    category: "Aksesoris & Fashion",
    image:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=900&q=80",
    description:
      "Gelang makrame dengan simpul ganda dan manik kayu alami, dirancang sebagai aksesoris unisex yang ringan namun tetap estetik untuk berbagai gaya busana.",
    specs:
      "Tali katun waxed 2mm, manik kayu jati belanda, pengunci kuningan anti karat.",
    process:
      "Menggunakan teknik simpul square knot dan spiral knot yang dirangkai berlapis. Setiap gelang diperiksa kekuatan simpulnya sebelum tahap finishing dan pengemasan.",
  },
  {
    id: "prod-003",
    name: "Vas Bunga Keramik \"Lempung\"",
    category: "Dekorasi Rumah",
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80",
    description:
      "Vas bunga dari tanah liat lokal yang dibentuk dengan teknik pilin (coil), memiliki tekstur permukaan alami yang menonjolkan kesan artisan dan hangat.",
    specs:
      "Tanah liat lokal kualitas tinggi, glasir food-safe non-toxic, dibakar pada suhu 1000°C.",
    process:
      "Dibentuk manual tanpa cetakan menggunakan teknik pilin, dikeringkan selama 5 hari, kemudian dibakar dua kali (biscuit firing dan glaze firing) agar hasil akhir kuat dan tahan lama.",
  },
  {
    id: "prod-004",
    name: "Buku Catatan \"Kertas Kembali\"",
    category: "Alat Tulis Daur Ulang",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=900&q=80",
    description:
      "Buku catatan dengan kertas daur ulang dari limbah kertas sekolah, dijilid manual menggunakan teknik jahit benang (Coptic binding) agar buku dapat dibuka rata 180 derajat.",
    specs:
      "Kertas daur ulang 100 gsm, sampul karton tebal berlapis kain linen, benang katun untuk penjilidan.",
    process:
      "Limbah kertas dipilah, dihancurkan, dan dicetak ulang menjadi lembaran baru secara manual. Proses penjilidan dilakukan dengan tangan untuk menjaga kekuatan dan tampilan estetik buku.",
    
  },
  {
    id: "prod-005",
    name: "Dompet Kulit Nabati \"Wastra\"",
    category: "Aksesoris & Fashion",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&q=80",
    description:
      "Dompet ringkas berbahan kulit nabati (vegan leather) dengan motif emboss terinspirasi wastra Nusantara, cocok untuk kebutuhan harian yang ringkas dan tahan lama.",
    specs:
      "Kulit nabati berbasis serat nanas, benang nilon jahit ganda, pelapis anti air pada bagian dalam.",
    process:
      "Pola dipotong menggunakan cetakan manual, motif emboss dicetak dengan alat press panas, lalu dijahit ganda pada tiap sisi untuk memastikan ketahanan jangka panjang.",
    
  },
  {
    id: "prod-006",
    name: "Lampu Hias \"Cahaya Bambu\"",
    category: "Dekorasi Rumah",
    image:
      "https://images.unsplash.com/photo-1543198126-b1cc0e2c4b06?w=900&q=80",
    description:
      "Lampu hias meja dari anyaman bambu tipis yang menghasilkan siluet cahaya berpola alami, cocok untuk mempercantik ruang belajar maupun ruang tamu.",
    specs:
      "Bilah bambu tipis anti rayap, dudukan kayu mahoni, kabel dan fitting lampu ber-SNI.",
    process:
      "Bambu dibelah tipis lalu dianyam mengelilingi rangka bulat, dijemur untuk mengurangi kelembapan, dan dirangkai dengan dudukan kayu serta instalasi kabel yang telah diuji keamanannya.",
  },
];

const REVIEWS = [];

/* =========================================================================
   4. DATA ANGGOTA KELOMPOK
   ========================================================================= */
const members = [
  {
    id: "mem-01",
    name: "Haikal",
    role: "Role",
    photo: "https://poefwswblrjmhvfvtiiu.supabase.co/storage/v1/object/public/product-images/products/1790520376945-WhatsApp-Image-2026-09-27-at-21.45.42.jpeg",
    personalWebsite: "https://kall-portfolioi.vercel.app/",
  },
  {
    id: "mem-02",
    name: "Wapa",
    role: "Role",
    photo: "https://poefwswblrjmhvfvtiiu.supabase.co/storage/v1/object/public/product-images/products/1790521815400-WhatsApp-Image-2026-09-27-at-22.08.48-1.jpeg",
    personalWebsite: "https://biodata-wafa.vercel.app/",
  },
  {
    id: "mem-03",
    name: "Lita",
    role: "Role",
    photo: "https://poefwswblrjmhvfvtiiu.supabase.co/storage/v1/object/public/product-images/products/1790520376945-WhatsApp-Image-2026-09-27-at-21.45.42.jpeg",
    personalWebsite: "https://biodata-diah.vercel.app/",
  },
  {
    id: "mem-04",
    name: "Rian",
    role: "Role",
    photo: "https://poefwswblrjmhvfvtiiu.supabase.co/storage/v1/object/public/product-images/products/1790521784128-WhatsApp-Image-2026-09-27-at-22.08.48.jpeg",
    personalWebsite: "https://mpihlupi.carrd.co/#",
  },
  {
    id: "mem-05",
    name: "Angela",
    role: "Role",
    photo: "https://poefwswblrjmhvfvtiiu.supabase.co/storage/v1/object/public/product-images/products/1790520376945-WhatsApp-Image-2026-09-27-at-21.45.42.jpeg",
    personalWebsite: "https://biodata-nabila.vercel.app/",
  },
  {
    id: "mem-06",
    name: "Ilham",
    role: "Role",
    photo: "https://poefwswblrjmhvfvtiiu.supabase.co/storage/v1/object/public/product-images/products/1790520376945-WhatsApp-Image-2026-09-27-at-21.45.42.jpeg",
    personalWebsite: "https://biodata-siswa-rose.vercel.app/",
  },
];

const NAV_ITEMS = [
  { id: "beranda", label: "Beranda" },
  { id: "katalog", label: "Katalog Produk" },
  { id: "ulasan", label: "Ulasan" },
  { id: "dokumentasi", label: "Dokumentasi" },
  { id: "anggota", label: "Anggota & Web Personal" },
  { id: "kontak", label: "Kontak" },
];

/* =========================================================================
   5. ADMIN CONTEXT
   ========================================================================= */
const AdminContext = createContext(null);

function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin harus dipakai di dalam AdminProvider");
  return ctx;
}

/* =========================================================================
   6. KOMPONEN KECIL / UTILITAS
   ========================================================================= */
function SectionEyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
      <Folder size={13} />
      {children}
    </span>
  );
}

function normalizeImageList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function CategoryBadge({ children }) {
  return (
    <span className="inline-block text-[11px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-3 py-1">
      {children}
    </span>
  );
}

function PrimaryButton({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={
        "inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-900/10 transition hover:bg-emerald-800 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 " +
        className
      }
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={
        "inline-flex items-center justify-center gap-2 rounded-full border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 " +
        className
      }
    >
      {children}
    </button>
  );
}

/* =========================================================================
   7. HEADER & NAVIGASI
   ========================================================================= */
function Header({ activeSection, onNavigate, onOpenAdminLogin }) {
  const { isAdmin, logout } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/5 bg-[#FBFAF6]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <button
          onClick={() => handleNav("beranda")}
          className="flex items-center gap-3 text-left"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm">
            <Sparkles size={20} />
          </span>
          <span className="leading-tight">
            <span
              className="block text-lg font-bold text-emerald-950"
              style={{ fontFamily: "'Fraunces', 'Georgia', serif" }}
            >
              {GROUP_PROFILE.name}
            </span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-emerald-700">
              Showcase Produk PKWU
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={
                "rounded-full px-4 py-2 text-sm font-medium transition " +
                (activeSection === item.id
                  ? "bg-emerald-700 text-white"
                  : "text-emerald-950 hover:bg-emerald-50")
              }
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAdmin ? (
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              <LogOut size={16} />
              Keluar Admin
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              <Shield size={16} />
              Admin
            </button>
          )}
        </div>

        <button
          className="rounded-full border border-stone-300 p-2 text-emerald-900 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Buka menu navigasi"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-emerald-900/5 bg-[#FBFAF6] px-5 pb-5 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={
                  "rounded-xl px-4 py-3 text-left text-sm font-medium transition " +
                  (activeSection === item.id
                    ? "bg-emerald-700 text-white"
                    : "text-emerald-950 hover:bg-emerald-50")
                }
              >
                {item.label}
              </button>
            ))}
            {isAdmin ? (
              <button
                onClick={logout}
                className="mt-2 inline-flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700"
              >
                <LogOut size={16} />
                Keluar Admin
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAdminLogin();
                  setMobileOpen(false);
                }}
                className="mt-2 inline-flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700"
              >
                <Shield size={16} />
                Masuk sebagai Admin
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* =========================================================================
   8. HERO SECTION
   ========================================================================= */
const BADGE_ICONS = { Sparkles, Check, GraduationCap };

function Hero({ onNavigate, productCount }) {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-[#FBFAF6] to-[#FBFAF6]"
    >
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-5 py-16 sm:px-8 lg:flex-row lg:py-24">
        <div className="flex-1 text-center lg:text-left">
          <SectionEyebrow>{GROUP_PROFILE.subject}</SectionEyebrow>

          <h1
            className="mt-6 text-4xl font-bold leading-[1.1] text-emerald-950 sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Fraunces', 'Georgia', serif" }}
          >
            {GROUP_PROFILE.tagline}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-stone-600 lg:mx-0">
            Selamat datang di ruang pameran produk {GROUP_PROFILE.fullName}. Setiap
            produk di sini dirancang, diproduksi, dan didokumentasikan langsung
            oleh siswa {GROUP_PROFILE.className}, {GROUP_PROFILE.school}, sebagai
            hasil pembelajaran mata pelajaran {GROUP_PROFILE.subject} tahun ajaran{" "}
            {GROUP_PROFILE.schoolYear}.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <PrimaryButton onClick={() => onNavigate("katalog")}>
              Jelajahi Produk
              <ArrowRight size={16} />
            </PrimaryButton>
            <SecondaryButton onClick={() => onNavigate("anggota")}>
              Anggota Kelompok
            </SecondaryButton>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
            {BADGES.map((badge) => {
              const Icon = BADGE_ICONS[badge.icon] || Sparkles;
              return (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 shadow-sm"
                >
                  <Icon size={14} className="text-emerald-600" />
                  {badge.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="relative w-full max-w-md flex-1">
          <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-xl shadow-emerald-900/10">
            <img
              src="https://poefwswblrjmhvfvtiiu.supabase.co/storage/v1/object/public/product-images/products/1790521457071-WhatsApp-Image-2026-09-26-at-08.37.18.jpeg"
              alt={"Etalase Produk kerajinan tangan " + GROUP_PROFILE.name}
              className="h-80 w-full object-cover sm:h-96"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-lg sm:block">
            <p className="text-2xl font-bold text-emerald-800" style={{ fontFamily: "'Fraunces', serif" }}>
              {productCount}+
            </p>
            <p className="text-xs font-medium text-stone-500">Produk dipamerkan</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   9. PRODUCT CARD
   ========================================================================= */
function ProductCard({ product, onOpenDetail }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://poefwswblrjmhvfvtiiu.supabase.co/storage/v1/object/public/product-images/products/1790521457071-WhatsApp-Image-2026-09-26-at-08.37.18.jpeg";
          }}
        />
        <div className="absolute left-3 top-3">
          <CategoryBadge>{product.category}</CategoryBadge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3
            className="text-lg font-bold leading-snug text-emerald-950"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {product.name}
          </h3>

        </div>

        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-stone-600">
          {product.description}
        </p>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => onOpenDetail(product)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Lihat Detail
          </button>
          
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   10. PRODUCT DETAIL MODAL
   ========================================================================= */
function ProductModal({ product, onClose }) {
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  if (!product) return null;

  const documentationImages = normalizeImageList(product.documentation);
  const infographicImages = normalizeImageList(product.infographic);
  const allImages = [product.image, ...documentationImages, ...infographicImages].filter(Boolean);

  const openGallery = (index) => {
    setGalleryImages(allImages);
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);
  const goPrev = () => setGalleryIndex((prev) => (prev <= 0 ? galleryImages.length - 1 : prev - 1));
  const goNext = () => setGalleryIndex((prev) => (prev >= galleryImages.length - 1 ? 0 : prev + 1));

  return (
    <>
      <div
        className="fixed inset-0 z-[9990] flex items-end justify-center bg-emerald-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        onClick={onClose}
      >
        <div
          className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-stone-700 shadow-md transition hover:bg-white"
            aria-label="Tutup detail Produk"
          >
            <X size={18} />
          </button>

          <div className="overflow-y-auto">
            <button type="button" onClick={() => openGallery(0)} className="w-full">
              <img
                src={product.image}
                alt={product.name}
                className="h-64 w-full object-cover sm:h-80"
              />
            </button>

            <div className="space-y-6 p-6 sm:p-8">
              <div>
                <CategoryBadge>{product.category}</CategoryBadge>
                <h2
                  className="mt-3 text-2xl font-bold text-emerald-950 sm:text-3xl"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {product.name}
                </h2>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Deskripsi Produk
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {product.description}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                    Komposisi &amp; Spesifikasi Bahan
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {product.specs}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                    Proses Pembuatan &amp; Keunggulan
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {product.process}
                  </p>
                </div>
              </div>
              {documentationImages.length > 0 && (
                <div className="rounded-3xl border border-stone-200 bg-[#F8FBF8] p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                    Dokumentasi Produk
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {documentationImages.map((src, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => openGallery(index + 1)}
                        className="overflow-hidden rounded-3xl"
                      >
                        <img
                          src={src}
                          alt={`${product.name} dokumentasi ${index + 1}`}
                          className="h-40 w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {infographicImages.length > 0 && (
                <div className="rounded-3xl border border-stone-200 bg-[#F8FBF8] p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                    Infografis Singkat
                  </h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {infographicImages.map((src, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => openGallery(index + 1 + documentationImages.length)}
                        className="overflow-hidden rounded-3xl"
                      >
                        <img
                          src={src}
                          alt={`${product.name} infografis ${index + 1}`}
                          className="h-40 w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {galleryOpen && galleryImages.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={closeGallery}
        >
          <div className="relative max-w-5xl flex w-full flex-col items-center gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeGallery();
              }}
              className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-stone-700 shadow-md transition hover:bg-white"
            >
              <X size={20} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-stone-700 shadow-md transition hover:bg-white"
            >
              <ArrowLeft size={20} />
            </button>

            <img
              src={galleryImages[galleryIndex]}
              alt={`Gallery image ${galleryIndex + 1}`}
              className="max-h-[80vh] w-full max-w-4xl rounded-3xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 text-stone-700 shadow-md transition hover:bg-white"
            >
              <ArrowRight size={20} />
            </button>

            <div className="flex items-center gap-2 text-sm text-white">
              {galleryIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================================
   11. CATALOG SECTION (FILTER + SEARCH + GRID)
   ========================================================================= */
function CatalogSection({ products, onOpenDetail }) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = activeCategory === "Semua" || p.category === activeCategory;
      const q = query.trim().toLowerCase();
      const matchQuery =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [products, activeCategory, query]);

  return (
    <section id="katalog" className="bg-[#FBFAF6] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Katalog Produk</SectionEyebrow>
          <h2
            className="mt-4 text-3xl font-bold text-emerald-950 sm:text-4xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Etalase Hasil Produk Kelompok
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            Telusuri seluruh produk yang telah dirancang dan diproduksi oleh
            anggota kelompok. Gunakan filter kategori atau kolom pencarian untuk
            menemukan produk tertentu.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  "rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm " +
                  (activeCategory === cat
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-stone-300 bg-white text-stone-600 hover:border-emerald-300 hover:text-emerald-700")
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Cari nama, atau deskripsi..."
              className="w-full rounded-full border border-stone-300 bg-white py-2.5 pl-11 pr-4 text-sm text-stone-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400">
              <Search size={22} />
            </span>
            <p className="text-sm font-medium text-stone-600">
              Belum ada produk yang cocok dengan pencarianmu.
            </p>
            <p className="text-xs text-stone-400">
              Coba kata kunci lain atau pilih kategori "Semua".
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================================
   12. MEMBERS SECTION
   ========================================================================= */
function ReviewsSection({ reviews, onAddReview }) {
  const [form, setForm] = useState({ name: "", role: "Pengunjung", rating: 5, comment: "" });
  const [error, setError] = useState("");

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) {
      setError("Nama dan ulasan wajib diisi.");
      return;
    }

    const nextReview = {
      id: `review-${Date.now()}`,
      name: form.name.trim(),
      role: form.role.trim() || "Pengunjung",
      rating: Number(form.rating) || 5,
      comment: form.comment.trim(),
      blocked: false,
      reply: "",
    };

    onAddReview(nextReview);
    setForm({ name: "", role: "Pengunjung", rating: 5, comment: "" });
    setError("");
  };

  return (
    <section id="ulasan" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Ulasan</SectionEyebrow>
          <h2
            className="mt-4 text-3xl font-bold text-emerald-950 sm:text-4xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Pendapat Tentang Showcase Kami
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            Ulasan nyata
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-stone-200 bg-[#F8FBF8] p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-emerald-950">Tulis Ulasan Kamu</h3>
              <p className="mt-2 text-sm text-stone-600">
                Berikan komentar atau kritik singkat tentang produk dan tampilan showcase.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-stone-700">
                    Nama
                  </label>
                  <input
                    value={form.name}
                    onChange={handleChange("name")}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Nama kamu"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-stone-700">
                    Peran
                  </label>
                  <input
                    value={form.role}
                    onChange={handleChange("role")}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Contoh: Pengunjung Pameran"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-stone-700">
                      Rating
                    </label>
                    <select
                      value={form.rating}
                      onChange={handleChange("rating")}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >
                      {[5, 4, 3, 2, 1].map((score) => (
                        <option key={score} value={score}>
                          {score} bintang
                        </option>
                      ))}
                    </select>
                  </div>
                  <div />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-stone-700">
                    Ulasan
                  </label>
                  <textarea
                    value={form.comment}
                    onChange={handleChange("comment")}
                    rows={4}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Tulis pendapatmu tentang produk atau pengalaman melihat showcase..."
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Kirim Ulasan
                </button>
              </form>
            </div>
            
          </div>

          <div className="space-y-6">
            {reviews.filter((review) => !review.blocked).map((review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-stone-200 bg-[#F8FBF8] p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-emerald-950">{review.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">
                      {review.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <span key={index}>★</span>
                    ))}
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-stone-600">
                  “{review.comment}”
                </p>
                {review.reply && (
                  <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-stone-700 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Balasan Admin</p>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{review.reply}</p>
                  </div>
                )}
              </div>
            ))}
            {reviews.filter((review) => !review.blocked).length === 0 && (
              <div className="rounded-3xl border border-stone-200 bg-[#F8FBF8] p-6 text-center text-sm text-stone-500">
                Belum ada ulasan yang terlihat. Jadilah yang pertama memberikan komentar!
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MembersSection() {
  return (
    <section id="anggota" className="bg-emerald-950 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
            <User size={13} />
            Anggota Kelompok
          </span>
          <h2
            className="mt-4 text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Wajah &amp; Web Personal di Balik Setiap Produk
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-emerald-100/80 sm:text-base">
            Setiap anggota mengelola website personal masing-masing sebagai
            portofolio individu. Klik tombol di bawah untuk menjelajahinya.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center rounded-2xl border border-emerald-800 bg-emerald-900/60 p-6 text-center transition hover:border-emerald-600"
            >
              <img
                src={member.photo}
                alt={member.name}
                className="h-20 w-20 rounded-full border-4 border-emerald-700 object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80";
                }}
              />
              <h3 className="mt-4 text-lg font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                {member.name}
              </h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
                {member.role}
              </p>
              <a
                href={member.personalWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100"
              >
                <Globe size={14} />
                Buka Website Personal
              </a>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-emerald-800 bg-emerald-900/60 p-6 text-center sm:p-8">
          <GraduationCap className="mx-auto mb-3 text-amber-300" size={26} />
          <p className="text-sm text-emerald-100/90 sm:text-base">
            {GROUP_PROFILE.fullName} merupakan proyek kewirausahaan mata pelajaran{" "}
            {GROUP_PROFILE.subject} kelas <strong>{GROUP_PROFILE.className}</strong>,{" "}
            {GROUP_PROFILE.school}, tahun ajaran{" "}
            <strong>{GROUP_PROFILE.schoolYear}</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}

function DocumentationSection({ documentationData }) {
  const images = Array.isArray(documentationData.images)
    ? documentationData.images.filter(Boolean)
    : [];
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openGallery = (index) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);
  const goPrev = () => setGalleryIndex((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
  const goNext = () => setGalleryIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));

  return (
    <section id="dokumentasi" className="bg-[#FBFAF6] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Dokumentasi</SectionEyebrow>
          <h2
            className="mt-4 text-3xl font-bold text-emerald-950 sm:text-4xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Perjalanan Produk Kami
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            Dokumentasi ini membantu membuktikan bahwa setiap produk yang dipamerkan benar-benar dirancang, diproduksi, dan didokumentasikan oleh anggota kelompok.
          </p>
        </div>

        <div className="mt-12">
          {images.length === 0 ? (
            <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center text-sm text-stone-500">
              Belum ada foto dokumentasi.
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {images.map((src, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => openGallery(index)}
                    className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden bg-stone-100">
                      <img
                        src={src}
                        alt={`Dokumentasi ${index + 1}`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-4 py-3 text-left">
                      <p className="text-xs text-stone-500">Klik untuk melihat lebih jelas</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 text-right text-xs uppercase tracking-[0.22em] text-stone-500">
                Klik gambar untuk memperbesar dan navigasi.
              </div>
            </>
          )}
        </div>
      </div>

      {galleryOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 p-4"
          onClick={closeGallery}
        >
          <div className="relative w-full max-w-4xl">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeGallery();
              }}
              className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 text-stone-700 shadow-md transition hover:bg-white"
            >
              <X size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 text-stone-700 shadow-md transition hover:bg-white"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 text-stone-700 shadow-md transition hover:bg-white"
            >
              <ArrowRight size={20} />
            </button>
            <img
              src={images[galleryIndex]}
              alt={`Dokumentasi ${galleryIndex + 1}`}
              className="mx-auto max-h-[80vh] w-full rounded-3xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 flex items-center justify-between text-sm text-white">
              <span>{galleryIndex + 1} / {images.length}</span>
              <span className="text-xs text-stone-200">Tekan tombol arah atau klik di luar untuk menutup.</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================================
   13. CONTACT SECTION
   ========================================================================= */
function ContactSection() {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const buildWaMessage = () => {
    const lines = [
      "Halo " + GROUP_PROFILE.fullName + "!",
      "",
      "Nama: " + (form.name || "-"),
      "Kontak: " + (form.contact || "-"),
      "Pesan:",
      form.message || "-",
    ];
    return encodeURIComponent(lines.join("\n"));
  };

  const handleSendWa = () => {
    const url = "https://wa.me/6285880143957" + GROUP_PROFILE.waNumber + "?text=" + buildWaMessage();
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <section id="kontak" className="bg-[#FBFAF6] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Kontak &amp; Kerjasama</SectionEyebrow>
          <h2
            className="mt-4 text-3xl font-bold text-emerald-950 sm:text-4xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Diskusi &amp; Peluang Kerjasama Produk
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            Tertarik berdiskusi, memberi apresiasi, atau membuka peluang
            kerjasama pameran? Kirimkan pesan melalui form berikut.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-stone-700">
                    Nama Lengkap
                  </label>
                  <input
                    value={form.name}
                    onChange={handleChange("name")}
                    type="text"
                    placeholder="Tuliskan nama kamu"
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-stone-700">
                    Email / Nomor WhatsApp
                  </label>
                  <input
                    value={form.contact}
                    onChange={handleChange("contact")}
                    type="text"
                    placeholder="contoh@email.com atau 08xxxxxxxxxx"
                    className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-stone-700">
                    Pesan / Tanggapan
                  </label>
                  <textarea
                    value={form.message}
                    onChange={handleChange("message")}
                    rows={4}
                    placeholder="Tuliskan pesan, tanggapan, atau ajakan kerjasama..."
                    className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <PrimaryButton onClick={handleSendWa} className="w-full">
                  <Phone size={16} />
                  Kirim Pesan via WhatsApp
                </PrimaryButton>

                {sent && (
                  <p className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                    <Check size={14} />
                    Jendela WhatsApp telah dibuka di tab baru.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Informasi Kelompok
              </h3>
              <ul className="mt-4 space-y-4 text-sm text-stone-600">
                <li className="flex items-start gap-3">
                  <GraduationCap size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>
                    {GROUP_PROFILE.school}
                    <br />
                    Kelas {GROUP_PROFILE.className} &middot; T.A. {GROUP_PROFILE.schoolYear}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{GROUP_PROFILE.email}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>+{GROUP_PROFILE.waNumber}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{GROUP_PROFILE.address}</span>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <p className="text-xs leading-relaxed text-stone-500">
                Catatan: website ini merupakan ruang pameran (showcase) produk,
                bukan toko daring. Informasi harga dan mekanisme kerjasama akan
                dibahas langsung melalui percakapan WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   14. ADMIN LOGIN MODAL
   ========================================================================= */
function AdminLoginModal({ onClose, onSuccess }) {
  const { login } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(password);
    if (ok) {
      setError("");
      onSuccess();
    } else {
      setError("Kata sandi salah. Silakan coba lagi.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/60 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
            <Lock size={18} />
          </span>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <h3 className="mt-4 text-xl font-bold text-emerald-950" style={{ fontFamily: "'Fraunces', serif" }}>
          Masuk Panel Admin
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          Khusus pengelola showcase untuk mengelola data Produk.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi admin"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              autoFocus
            />
            {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
          </div>
          <PrimaryButton type="submit" className="w-full">
            <Shield size={16} />
            Masuk
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}

function getUploadErrorMessage(error) {
  const message = error?.message || "";
  const status = error?.status || error?.statusCode || "";

  if (message.includes("Bucket not found") || status === 400 || status === 404) {
    return "Bucket 'product-images' belum dibuat atau belum bisa diakses. Buka Supabase Storage, buat bucket bernama 'product-images', lalu jadikan public.";
  }

  if (message.includes("policy") || message.includes("unauthorized") || message.includes("Forbidden")) {
    return "Kebijakan Storage belum mengizinkan upload dari anon key. Periksa izin bucket di Supabase Storage > Policies.";
  }

  if (message.includes("JWT") || message.includes("token")) {
    return "Kunci anon Supabase tidak valid. Periksa VITE_SUPABASE_ANON_KEY di file .env.";
  }

  return "Gagal mengunggah gambar ke Supabase. Periksa koneksi, bucket, dan kebijakan Storage.";
}

function getSupabaseRequestErrorMessage(error) {
  const message = error?.message || "";

  if (message === "Failed to fetch" || error?.name === "TypeError") {
    return "Supabase tidak dapat dihubungi. Periksa VITE_SUPABASE_URL di file .env, koneksi internet, dan restart server Vite setelah mengubah .env.";
  }

  if (message.includes("policy") || message.includes("permission") || message.includes("Forbidden")) {
    return "Penghapusan ditolak Supabase. Jalankan policy DELETE pada supabase-schema.sql di Supabase SQL Editor.";
  }

  return message || "Supabase gagal menghapus data.";
}

function ProductImageUploader({
  previewUrl,
  selectedFileName,
  isUploading,
  errorMessage,
  onSelectFile,
  onClear,
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file) => {
    if (file) onSelectFile(file);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const file = e.dataTransfer.files?.[0];
          handleFile(file);
        }}
        className={`rounded-2xl border-2 border-dashed p-4 transition ${
          dragActive
            ? "border-emerald-500 bg-emerald-50"
            : "border-stone-300 bg-stone-50"
        }`}
      >
        <input
          id="product-image-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <label
          htmlFor="product-image-input"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-6 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <UploadCloud size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800">
              {isUploading ? "Mengunggah gambar..." : "Pilih gambar dari device"}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              JPG, PNG, WEBP, atau GIF. Maksimal 2MB.
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
            {isUploading ? "Sedang diproses" : "Pilih Gambar"}
          </span>
        </label>
      </div>

      {errorMessage && (
        <p className="text-xs font-medium text-red-600">{errorMessage}</p>
      )}

      {previewUrl && (
        <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={previewUrl}
                alt="Preview gambar produk"
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800">Preview gambar</p>
                <p className="truncate text-xs text-stone-500">
                  {selectedFileName || "Gambar siap diunggah"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="rounded-full border border-stone-200 p-2 text-stone-500 transition hover:border-red-300 hover:text-red-600"
              aria-label="Hapus preview gambar"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   15. ADMIN PANEL (CRUD PRODUK)
   ========================================================================= */
const emptyForm = {
  id: "",
  name: "",
  category: CATEGORIES[1],
  image: "",
  personalWebsite: "",
  description: "",
  specs: "",
  process: "",
  documentation: [],
  infographic: [],
};

function AdminPanel({ products, setProducts, reviews, setReviews, documentationData, setDocumentationData, onClose }) {
  const { logout } = useAdmin();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [replyTextById, setReplyTextById] = useState({});
  const [documentationUploads, setDocumentationUploads] = useState([]);
  const [infographicUploads, setInfographicUploads] = useState([]);
  const [documentationSectionUploads, setDocumentationSectionUploads] = useState([]);
  const [documentationUploadError, setDocumentationUploadError] = useState("");
  const [documentationSectionUploadError, setDocumentationSectionUploadError] = useState("");
  const [infographicUploadError, setInfographicUploadError] = useState("");

  const resetForm = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    documentationUploads.forEach((item) => {
      if (item.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
    infographicUploads.forEach((item) => {
      if (item.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setPreviewUrl("");
    setSelectedFileName("");
    setImageUploadError("");
    setDocumentationUploads([]);
    setInfographicUploads([]);
    setDocumentationSectionUploads([]);
    setDocumentationUploadError("");
    setDocumentationSectionUploadError("");
    setInfographicUploadError("");
    setNewDocumentationImageUrl("");
    setIsUploadingImage(false);
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSelectFile = (file) => {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageUploadError("Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageUploadError("Ukuran file melebihi batas 2MB. Pilih gambar yang lebih kecil.");
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageUploadError("");
    setImageFile(file);
    setSelectedFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearPreview = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl("");
    setSelectedFileName("");
    setImageUploadError("");
    setForm((prev) => ({ ...prev, image: "" }));
  };

  const handleEdit = (product) => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    documentationUploads.forEach((item) => {
      if (item.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
    infographicUploads.forEach((item) => {
      if (item.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
    setForm({
      ...product,
      documentation: normalizeImageList(product.documentation),
      infographic: normalizeImageList(product.infographic),
    });
    setEditingId(product.id);
    setStatusMessage("");
    setImageFile(null);
    setSelectedFileName("");
    setImageUploadError("");
    setDocumentationUploads([]);
    setInfographicUploads([]);
    setDocumentationUploadError("");
    setInfographicUploadError("");
    setPreviewUrl(product.image || "");
  };

  const handleDelete = async (id) => {
    if (supabase) {
      try {
        const { error } = await supabase.from(PRODUCTS_TABLE).delete().eq("id", id);
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error("Supabase delete error:", error);
        setStatusMessage("Gagal menghapus di Supabase. " + getSupabaseRequestErrorMessage(error));
        return;
      }
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setStatusMessage("Produk berhasil dihapus.");
  };

  const handleDeleteReview = async (id) => {
    if (supabase) {
      const { error } = await supabase.from(REVIEWS_TABLE).delete().eq("id", id);
      if (error) {
        console.error("Supabase delete review error:", error);
      }
    }
    setReviews((prev) => prev.filter((review) => review.id !== id));
    setStatusMessage("Ulasan berhasil dihapus.");
  };

  const handleToggleBlockReview = async (id) => {
    const nextReviews = reviews.map((review) =>
      review.id === id ? { ...review, blocked: !review.blocked } : review
    );
    setReviews(nextReviews);
    if (supabase) {
      const review = nextReviews.find((item) => item.id === id);
      const { error } = await supabase
        .from(REVIEWS_TABLE)
        .update({ blocked: review.blocked })
        .eq("id", id);
      if (error) {
        console.error("Supabase update review block error:", error);
      }
    }
    setStatusMessage("Status ulasan diperbarui.");
  };

  const handleReplyChange = (id) => (e) =>
    setReplyTextById((prev) => ({ ...prev, [id]: e.target.value }));

  const handleSubmitReply = async (id) => {
    const reply = (replyTextById[id] || "").trim();
    if (!reply) {
      setStatusMessage("Balasan tidak boleh kosong.");
      return;
    }
    const nextReviews = reviews.map((review) =>
      review.id === id ? { ...review, reply, blocked: false } : review
    );
    setReviews(nextReviews);
    setReplyTextById((prev) => ({ ...prev, [id]: "" }));
    if (supabase) {
      const { error } = await supabase
        .from(REVIEWS_TABLE)
        .update({ reply, blocked: false })
        .eq("id", id);
      if (error) {
        console.error("Supabase update review reply error:", error);
      }
    }
    setStatusMessage("Balasan berhasil disimpan.");
  };

  const addImageUploads = (field, files) => {
    const fileList = Array.from(files || []);
    if (fileList.length === 0) return;

    const entries = [];
    let errorMessage = "";

    fileList.forEach((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errorMessage = "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.";
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        errorMessage = "Ukuran file melebihi batas 2MB. Pilih gambar yang lebih kecil.";
        return;
      }
      entries.push({ file, previewUrl: URL.createObjectURL(file), name: file.name });
    });

    if (field === "documentation") {
      setDocumentationUploadError(errorMessage);
      if (entries.length > 0) {
        setDocumentationUploads((prev) => [...prev, ...entries]);
      }
      return;
    }

    if (field === "documentationSection") {
      setDocumentationSectionUploadError(errorMessage);
      if (entries.length > 0) {
        setDocumentationSectionUploads((prev) => [...prev, ...entries]);
      }
      return;
    }

    setInfographicUploadError(errorMessage);
    if (entries.length > 0) {
      setInfographicUploads((prev) => [...prev, ...entries]);
    }
  };

  const removeImageUrl = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: normalizeImageList(prev[field]).filter((_, idx) => idx !== index),
    }));
  };

  const removeUploadEntry = (field, index) => {
    if (field === "documentation") {
      setDocumentationUploads((prev) => {
        const item = prev[index];
        if (item?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(item.previewUrl);
        return prev.filter((_, idx) => idx !== index);
      });
      return;
    }
    if (field === "documentationSection") {
      setDocumentationSectionUploads((prev) => {
        const item = prev[index];
        if (item?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(item.previewUrl);
        return prev.filter((_, idx) => idx !== index);
      });
      return;
    }
    setInfographicUploads((prev) => {
      const item = prev[index];
      if (item?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const uploadAsset = async (file, folder) => {
    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "")}`;
    const filePath = `${folder}/${safeName}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (uploadError) throw uploadError;
    const { data: publicData } = supabase.storage.from("product-images").getPublicUrl(filePath);
    return publicData.publicUrl;
  };

  const handleUploadDocumentationSection = async () => {
    if (documentationSectionUploads.length === 0) {
      setDocumentationSectionUploadError("Pilih foto dokumentasi untuk diunggah.");
      return;
    }
    if (!supabase) {
      setDocumentationSectionUploadError("Supabase belum terhubung. Unggah dibatalkan.");
      return;
    }

    setDocumentationSectionUploadError("");
    setIsUploadingImage(true);
    setStatusMessage("Mengunggah foto dokumentasi section...");

    try {
      const uploadedUrls = [];
      for (const item of documentationSectionUploads) {
        const uploadedUrl = await uploadAsset(item.file, "documentation-section");
        uploadedUrls.push(uploadedUrl);
      }
      const images = [
        ...(Array.isArray(documentationData.images) ? documentationData.images : []),
        ...uploadedUrls,
      ];
      const { error } = await supabase
        .from(DOCUMENTATION_TABLE)
        .upsert({ id: DOCUMENTATION_ROW_ID, images });
      if (error) throw error;
      setDocumentationData((prev) => ({
        ...prev,
        images,
      }));
      documentationSectionUploads.forEach((item) => {
        if (item.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(item.previewUrl);
      });
      setDocumentationSectionUploads([]);
      setStatusMessage("Foto dokumentasi section berhasil diunggah.");
    } catch (err) {
      console.error("Gagal mengunggah foto dokumentasi section", err);
      const friendlyMessage = getUploadErrorMessage(err);
      setDocumentationSectionUploadError(friendlyMessage);
      setStatusMessage(friendlyMessage);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteDocumentationImage = async (index) => {
    const images = (documentationData.images || []).filter((_, imageIndex) => imageIndex !== index);
    if (supabase) {
      const { error } = await supabase
        .from(DOCUMENTATION_TABLE)
        .upsert({ id: DOCUMENTATION_ROW_ID, images });
      if (error) {
        setStatusMessage("Gagal menyimpan perubahan foto dokumentasi. " + error.message);
        return;
      }
    }
    setDocumentationData((prev) => ({ ...prev, images }));
    setStatusMessage("Foto dokumentasi berhasil dihapus.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      setStatusMessage("Nama produk wajib diisi.");
      return;
    }

    let finalImageUrl = form.image || "";

    if (imageFile) {
      if (!supabase) {
        setStatusMessage("Supabase belum aktif. Unggah gambar dibatalkan.");
        return;
      }

      setIsUploadingImage(true);
      setStatusMessage("Mengunggah gambar ke Supabase...");

      try {
        finalImageUrl = await uploadAsset(imageFile, "products");
        setForm((prev) => ({ ...prev, image: finalImageUrl }));
      } catch (err) {
        console.error("Gagal mengunggah gambar", err);
        const friendlyMessage = getUploadErrorMessage(err);
        setImageUploadError(friendlyMessage);
        setStatusMessage(friendlyMessage);
        setIsUploadingImage(false);
        return;
      } finally {
        setIsUploadingImage(false);
      }
    }

    if (!finalImageUrl) {
      setStatusMessage("Gambar wajib diisi. Silakan pilih file gambar atau isi URL gambar lama.");
      return;
    }

    let uploadedDocumentationUrls = [];
    let uploadedInfographicUrls = [];

    if ((documentationUploads.length > 0 || infographicUploads.length > 0) && !supabase) {
      setStatusMessage("Supabase belum aktif. Unggah dokumentasi/infografis dibatalkan.");
      return;
    }

    if (documentationUploads.length > 0 || infographicUploads.length > 0) {
      setIsUploadingImage(true);
      setStatusMessage("Mengunggah dokumentasi dan infografis ke Supabase...");
      try {
        for (const item of documentationUploads) {
          const uploadedUrl = await uploadAsset(item.file, "documentation");
          uploadedDocumentationUrls.push(uploadedUrl);
        }
        for (const item of infographicUploads) {
          const uploadedUrl = await uploadAsset(item.file, "infographic");
          uploadedInfographicUrls.push(uploadedUrl);
        }
      } catch (err) {
        console.error("Gagal mengunggah dokumentasi/infografis", err);
        const friendlyMessage = getUploadErrorMessage(err);
        setStatusMessage(friendlyMessage);
        setIsUploadingImage(false);
        return;
      } finally {
        setIsUploadingImage(false);
      }
    }

    const payload = {
      id: editingId || "prod-" + Date.now(),
      name: form.name,
      category: form.category,
      image_url: finalImageUrl,
      description: form.description,
      specs: form.specs,
      process: form.process,
      documentation: [...normalizeImageList(form.documentation), ...uploadedDocumentationUrls],
      infographic: [...normalizeImageList(form.infographic), ...uploadedInfographicUrls],
    };

    const displayProduct = {
      ...payload,
      image: finalImageUrl,
    };

    if (supabase) {
      if (editingId) {
        const { error } = await supabase.from(PRODUCTS_TABLE).update(payload).eq("id", editingId);
        if (error) {
          console.error("Supabase update error:", error);
          setStatusMessage("Supabase gagal update. " + error.message);
          return;
        }
      } else {
        const { error } = await supabase.from(PRODUCTS_TABLE).insert(payload);
        if (error) {
          console.error("Supabase insert error:", error);
          setStatusMessage("Supabase gagal menyimpan. " + error.message);
          return;
        }
      }
    }

    setProducts((prev) => {
      if (editingId) {
        return prev.map((p) => (p.id === editingId ? displayProduct : p));
      }
      return [displayProduct, ...prev];
    });

    setStatusMessage(editingId ? "Produk berhasil diperbarui." : "Produk baru berhasil ditambahkan.");
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-emerald-950/60 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-4xl flex-col overflow-hidden bg-[#FBFAF6] shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <Shield size={18} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-emerald-950">Dashboard Admin Showcase</h2>
              <p className="text-xs text-stone-500">
                {supabase ? "Terhubung ke Supabase" : "Mode lokal (Supabase belum terhubung)"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-100"
            >
              <LogOut size={14} />
              Keluar
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
              aria-label="Tutup panel admin"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {statusMessage && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {statusMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-stone-200 bg-white p-6"
          >
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-700">
              {editingId ? <Edit size={15} /> : <PlusCircle size={15} />}
              {editingId ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-stone-600">
                  Nama Produk
                </label>
                <input
                  value={form.name}
                  onChange={handleChange("name")}
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-stone-600">
                  Kategori
                </label>
                <select
                  value={form.category}
                  onChange={handleChange("category")}
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {CATEGORIES.filter((c) => c !== "Semua").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-stone-600">
                  Gambar Produk
                </label>
                <ProductImageUploader
                  previewUrl={previewUrl}
                  selectedFileName={selectedFileName}
                  isUploading={isUploadingImage}
                  errorMessage={imageUploadError}
                  onSelectFile={handleSelectFile}
                  onClear={handleClearPreview}
                />
                <p className="mt-2 text-xs text-stone-500">
                  Anda juga bisa mengisi URL gambar lama jika ingin mempertahankan data yang sudah ada.
                </p>
                <input
                  value={form.image}
                  onChange={handleChange("image")}
                  placeholder="https://..."
                  className="mt-3 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-stone-600">
                  Deskripsi
                </label>
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-stone-600">
                  Komposisi / Spesifikasi Bahan
                </label>
                <textarea
                  value={form.specs}
                  onChange={handleChange("specs")}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-stone-600">
                  Proses Pembuatan / Keunggulan
                </label>
                <textarea
                  value={form.process}
                  onChange={handleChange("process")}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-stone-600">
                  Dokumentasi (upload foto)
                </label>
                <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  {normalizeImageList(form.documentation).length === 0 ? (
                    <p className="text-sm text-stone-500">Belum ada foto dokumentasi.</p>
                  ) : (
                    <div className="space-y-2">
                      {normalizeImageList(form.documentation).map((url, index) => (
                        <div key={index} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3">
                          <span className="min-w-0 flex-1 truncate text-sm text-stone-700">{url}</span>
                          <button
                            type="button"
                            onClick={() => removeImageUrl("documentation", index)}
                            className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {documentationUploads.length > 0 && (
                    <div className="space-y-2 rounded-2xl border border-emerald-200 bg-white p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-emerald-800">Preview Upload Dokumentasi</p>
                        <span className="text-xs text-stone-500">{documentationUploads.length} file</span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {documentationUploads.map((item, index) => (
                          <div key={index} className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-100">
                            <img
                              src={item.previewUrl}
                              alt={item.name}
                              className="h-32 w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeUploadEntry("documentation", index)}
                              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-red-600 transition hover:bg-white"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="block rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-500 transition hover:border-emerald-500 hover:text-emerald-700">
                      Pilih file foto dokumentasi
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => addImageUploads("documentation", e.target.files)}
                      />
                    </label>
                    {documentationUploadError && (
                      <p className="text-xs font-medium text-red-600">{documentationUploadError}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-stone-600">
                  Infografis (upload foto)
                </label>
                <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  {normalizeImageList(form.infographic).length === 0 ? (
                    <p className="text-sm text-stone-500">Belum ada foto infografis.</p>
                  ) : (
                    <div className="space-y-2">
                      {normalizeImageList(form.infographic).map((url, index) => (
                        <div key={index} className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3">
                          <span className="min-w-0 flex-1 truncate text-sm text-stone-700">{url}</span>
                          <button
                            type="button"
                            onClick={() => removeImageUrl("infographic", index)}
                            className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {infographicUploads.length > 0 && (
                    <div className="space-y-2 rounded-2xl border border-emerald-200 bg-white p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-emerald-800">Preview Upload Infografis</p>
                        <span className="text-xs text-stone-500">{infographicUploads.length} file</span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {infographicUploads.map((item, index) => (
                          <div key={index} className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-100">
                            <img
                              src={item.previewUrl}
                              alt={item.name}
                              className="h-32 w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeUploadEntry("infographic", index)}
                              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-red-600 transition hover:bg-white"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="block rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-500 transition hover:border-emerald-500 hover:text-emerald-700">
                      Pilih file foto infografis
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => addImageUploads("infographic", e.target.files)}
                      />
                    </label>
                    {infographicUploadError && (
                      <p className="text-xs font-medium text-red-600">{infographicUploadError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton type="submit">
                <Save size={16} />
                {editingId ? "Simpan Perubahan" : "Tambahkan  Produk"}
              </PrimaryButton>
              {editingId && (
                <SecondaryButton type="button" onClick={resetForm}>
                  Batalkan Edit
                </SecondaryButton>
              )}
            </div>
          </form>

          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-700">
              Foto Dokumentasi Section
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Array.isArray(documentationData.images) && documentationData.images.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500">
                  Belum ada foto dokumentasi section.
                </div>
              ) : (
                (documentationData.images || []).map((src, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-100">
                    <img src={src} alt={`Dokumentasi section ${index + 1}`} className="h-32 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteDocumentationImage(index)}
                      className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-red-600 transition hover:bg-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <label className="block rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-500 transition hover:border-emerald-500 hover:text-emerald-700">
                  Pilih file foto dokumentasi
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => addImageUploads("documentationSection", e.target.files)}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleUploadDocumentationSection}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Upload Foto
                </button>
              </div>
              {documentationSectionUploadError && (
                <p className="text-xs font-medium text-red-600">{documentationSectionUploadError}</p>
              )}
              {documentationSectionUploads.length > 0 && (
                <div className="space-y-2 rounded-2xl border border-emerald-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-emerald-800">Preview Upload Dokumentasi Section</p>
                    <span className="text-xs text-stone-500">{documentationSectionUploads.length} file</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {documentationSectionUploads.map((item, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-100">
                        <img
                          src={item.previewUrl}
                          alt={item.name}
                          className="h-32 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeUploadEntry("documentationSection", index)}
                          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-red-600 transition hover:bg-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-700">
              Daftar Produk Tersimpan ({products.length})
            </h3>
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
              <div className="max-h-[420px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                    <tr>
                      <th className="px-4 py-3">Produk</th>
                      <th className="px-4 py-3 hidden sm:table-cell">Kategori</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-stone-100">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            <span className="font-medium text-stone-800">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-stone-500">
                          {product.category}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="rounded-full border border-stone-200 p-2 text-stone-500 transition hover:border-emerald-300 hover:text-emerald-700"
                              aria-label={"Edit " + product.name}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="rounded-full border border-stone-200 p-2 text-stone-500 transition hover:border-red-300 hover:text-red-600"
                              aria-label={"Hapus " + product.name}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-stone-400">
                          Belum ada data produk.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-700">
              Moderasi Ulasan ({reviews.length})
            </h3>
            <div className="space-y-4">
              {reviews.length === 0 && (
                <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500">
                  Belum ada ulasan untuk dimoderasi.
                </div>
              )}
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={`rounded-2xl border p-5 shadow-sm ${
                    review.blocked ? "border-red-300 bg-red-50" : "border-stone-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-emerald-950">{review.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">
                        {review.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-amber-500">
                        {Array.from({ length: review.rating }).map((_, index) => (
                          <span key={index}>★</span>
                        ))}
                      </span>
                      {review.blocked && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          Diblokir
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600">{review.comment}</p>
                  {review.reply && (
                    <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-stone-700">
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">
                        Balasan Admin
                      </p>
                      <p className="mt-2">{review.reply}</p>
                    </div>
                  )}
                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <textarea
                      value={replyTextById[review.id] || ""}
                      onChange={handleReplyChange(review.id)}
                      rows={3}
                      placeholder="Tulis balasan admin..."
                      className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleSubmitReply(review.id)}
                      className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                      Balas
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.id)}
                      className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleBlockReview(review.id)}
                      className="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                      {review.blocked ? "Buka Blokir" : "Blokir"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   16. FOOTER
   ========================================================================= */
function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 text-center sm:px-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
          <Sparkles size={18} />
        </span>
        <p className="text-sm font-semibold text-emerald-950">{GROUP_PROFILE.fullName}</p>
        <p className="max-w-md text-xs leading-relaxed text-stone-500">
          Showcase produk siswa {GROUP_PROFILE.subject}, {GROUP_PROFILE.school}, kelas{" "}
          {GROUP_PROFILE.className}, tahun ajaran {GROUP_PROFILE.schoolYear}.
        </p>
        <p className="text-xs text-stone-400">
          &copy; {new Date().getFullYear()} {GROUP_PROFILE.fullName}. Dibuat untuk keperluan
          pembelajaran.
        </p>
      </div>
    </footer>
  );
}

/* =========================================================================
   17. APP CONTENT (LOGIKA UTAMA)
   ========================================================================= */
function AppContent() {
  const [products, setProducts] = useState(initialProducts);
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = window.localStorage.getItem("kriya_reviews");
      if (!stored) return REVIEWS;
      const parsed = JSON.parse(stored) || [];
      return parsed.filter(
        (review) =>
          review &&
          review.id &&
          !["review-001", "review-002", "review-003"].includes(review.id) &&
          !["Siti", "Rizal", "Intan"].includes(review.name)
      );
    } catch (err) {
      return REVIEWS;
    }
  });

  const defaultDocumentationData = {
    images: [],
  };

  const [documentationData, setDocumentationData] = useState(() => {
    try {
      const stored = window.localStorage.getItem("kriya_documentation");
      if (!stored) return defaultDocumentationData;
      const parsed = JSON.parse(stored) || {};
      if (Array.isArray(parsed.images)) {
        return { images: parsed.images.filter(Boolean) };
      }
      return defaultDocumentationData;
    } catch (err) {
      return defaultDocumentationData;
    }
  });
  const [activeSection, setActiveSection] = useState("beranda");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    let isMounted = true;
    async function loadFromSupabase() {
      if (!supabase) return;
      try {
        let response = await supabase
          .from(PRODUCTS_TABLE)
          .select("*")
          .order("created_at", { ascending: false });

        if (response.error) {
          const fallback = await supabase.from(PRODUCTS_TABLE).select("*");
          if (!fallback.error && fallback.data) {
            response = fallback;
          }
        }

        const { data, error } = response;
        if (!error && data && isMounted) {
          const mappedProducts = data.map((item) => ({
            ...item,
            image: item.image_url || item.image || "",
          }));
          setProducts(mappedProducts);
        }
      } catch (err) {
        console.warn("Gagal memuat data dari Supabase, memakai mock data.", err);
      }
    }

    async function loadReviewsFromSupabase() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from(REVIEWS_TABLE)
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && isMounted) {
          setReviews(
            data.map((item) => ({
              id: item.id,
              name: item.name || "",
              role: item.role || "Pengunjung",
              rating: item.rating ?? 5,
              comment: item.comment || "",
              blocked: item.blocked ?? false,
              reply: item.reply || "",
            }))
          );
        }
      } catch (err) {
        console.warn("Gagal memuat ulasan dari Supabase", err);
      }
    }

    async function loadDocumentationFromSupabase() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from(DOCUMENTATION_TABLE)
          .select("images")
          .eq("id", DOCUMENTATION_ROW_ID)
          .maybeSingle();

        if (error) throw error;
        if (data && Array.isArray(data.images)) {
          if (isMounted) setDocumentationData({ images: data.images.filter(Boolean) });
          return;
        }

        const legacyImages = Array.isArray(documentationData.images)
          ? documentationData.images.filter(Boolean)
          : [];
        if (legacyImages.length > 0) {
          const { error: migrationError } = await supabase
            .from(DOCUMENTATION_TABLE)
            .upsert({ id: DOCUMENTATION_ROW_ID, images: legacyImages });
          if (migrationError) throw migrationError;
          if (isMounted) setDocumentationData({ images: legacyImages });
        }
      } catch (err) {
        console.warn("Gagal memuat foto dokumentasi dari Supabase", err);
      }
    }

    loadFromSupabase();
    loadReviewsFromSupabase();
    loadDocumentationFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("kriya_reviews", JSON.stringify(reviews));
    } catch (err) {
      console.warn("Gagal menyimpan ulasan di localStorage", err);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      window.localStorage.setItem("kriya_documentation", JSON.stringify(documentationData));
    } catch (err) {
      console.warn("Gagal menyimpan dokumentasi di localStorage", err);
    }
  }, [documentationData]);

  const handleAddReview = async (review) => {
    const payload = {
      ...review,
      blocked: false,
      reply: review.reply || "",
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from(REVIEWS_TABLE).insert(payload);
      if (error) {
        console.warn("Gagal menyimpan ulasan ke Supabase:", error);
      }
    }

    setReviews((prev) => [payload, ...prev]);
  };

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-stone-800 antialiased">
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdminLogin={() => setShowAdminLogin(true)}
      />

      <main>
        <Hero onNavigate={handleNavigate} productCount={products.length} />
        <CatalogSection products={products} onOpenDetail={setSelectedProduct} />
        <ReviewsSection reviews={reviews} onAddReview={handleAddReview} />
        <DocumentationSection documentationData={documentationData} />
        <MembersSection />
        <ContactSection />
      </main>

      <Footer />

      {isAdmin && !showAdminPanel && (
        <button
          onClick={() => setShowAdminPanel(true)}
          className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
        >
          <Shield size={16} />
          Kelola Produk & Ulasan
        </button>
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {showAdminLogin && !isAdmin && (
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onSuccess={() => {
            setShowAdminLogin(false);
            setShowAdminPanel(true);
          }}
        />
      )}

      {showAdminPanel && isAdmin && (
        <AdminPanel
          products={products}
          setProducts={setProducts}
          reviews={reviews}
          setReviews={setReviews}
          documentationData={documentationData}
          setDocumentationData={setDocumentationData}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  );
}

/* =========================================================================
   18. ROOT EXPORT
   ========================================================================= */
export default function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
}
