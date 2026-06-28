// app/page.tsx
// Linkora Landing Page
// Stack: Next.js + Tailwind CSS + GSAP + AOS
// Created by Belhart Rajesky Pasaribu

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── AOS + GSAP loaded via CDN in layout.tsx / _document.tsx ───
   But for client component we'll do it inline via useEffect        */

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES = [
  {
    title: "Choose a Template",
    desc: "Browse modern templates designed for developers, designers, students, and creators.",
    cta: "Browse Templates",
    ctaHref: "#templates",
    img: "right",
    icon: "🖼️",
    illustrationKey: "template",
  },
  {
    title: "Customize Your Portfolio",
    desc: "Personalize colors, fonts, sections, and layouts to match your own unique style.",
    cta: null,
    img: "left",
    icon: "🎨",
    illustrationKey: "customize",
  },
  {
    title: "Add Your Content",
    desc: "Showcase your projects, experience, skills, and social profiles with an intuitive editor.",
    cta: null,
    img: "right",
    icon: "✏️",
    illustrationKey: "content",
  },
  {
    title: "Publish & Share",
    desc: "Deploy your portfolio instantly and share your unique link with employers, clients, or anyone you want.",
    cta: null,
    img: "left",
    icon: "🚀",
    illustrationKey: "publish",
  },
];

const FAQS = [
  {
    q: "Apakah Linkora gratis digunakan?",
    a: "Ya! Linkora menyediakan paket gratis yang sudah cukup untuk membuat portfolio profesional. Untuk fitur lanjutan seperti custom domain, kamu bisa upgrade ke paket premium kapan saja.",
  },
  {
    q: "Apakah saya perlu keahlian coding?",
    a: "Tidak sama sekali. Linkora dirancang untuk siapa saja — kamu cukup pilih template, isi konten, dan publish. Semua proses teknis sudah kami tangani.",
  },
  {
    q: "Bisakah saya menggunakan domain sendiri?",
    a: "Tentu! Dengan paket premium, kamu bisa menghubungkan custom domain milikmu ke portfolio Linkora. Prosesnya mudah dan terdokumentasi dengan baik.",
  },
  {
    q: "Seberapa cepat portfolio saya bisa online?",
    a: "Kurang dari 5 menit. Pilih template, isi informasimu, klik publish — dan portfolio kamu langsung bisa diakses siapa saja.",
  },
  {
    q: "Apakah portfolio saya mobile-friendly?",
    a: "Semua template Linkora dirancang responsive dan telah dioptimalkan untuk tampil sempurna di desktop, tablet, maupun smartphone.",
  },
  {
    q: "Bagaimana jika saya ingin mengganti template?",
    a: "Kamu bisa ganti template kapan saja tanpa kehilangan konten. Cukup pilih template baru dan kontenmu akan otomatis menyesuaikan.",
  },
];

const TEMPLATES = [
  { name: "Minimal Dark", tag: "Developer", color: "from-zinc-900 to-zinc-700" },
  { name: "Creative Studio", tag: "Designer", color: "from-violet-900 to-purple-700" },
  { name: "Clean Resume", tag: "Student", color: "from-blue-900 to-blue-700" },
  { name: "Bold Creator", tag: "Creator", color: "from-rose-900 to-pink-700" },
  { name: "Glass Morph", tag: "All Roles", color: "from-teal-900 to-cyan-700" },
  { name: "Modern Pro", tag: "Professional", color: "from-amber-900 to-orange-700" },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroCTARef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Dynamically load GSAP + AOS
    const loadScripts = async () => {
      // GSAP
      if (!(window as any).gsap) {
        await new Promise<void>((resolve) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
          s.onload = () => resolve();
          document.head.appendChild(s);
        });
      }
      // AOS
      if (!(window as any).AOS) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/aos@2.3.4/dist/aos.css";
        document.head.appendChild(link);

        await new Promise<void>((resolve) => {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/aos@2.3.4/dist/aos.js";
          s.onload = () => resolve();
          document.head.appendChild(s);
        });
      }

      const gsap = (window as any).gsap;
      const AOS = (window as any).AOS;

      // Init AOS
      AOS.init({
        duration: 700,
        easing: "ease-out-cubic",
        once: true,
        offset: 60,
      });

      // GSAP Hero animation
      if (heroTitleRef.current && heroCTARef.current) {
        gsap.from(heroTitleRef.current.children, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        });
        gsap.from(heroCTARef.current, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.8,
        });
      }

      // GSAP floating hero illustration
      const heroImg = document.getElementById("hero-illustration");
      if (heroImg) {
        gsap.to(heroImg, {
          y: -16,
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.from(heroImg, {
          x: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.4,
        });
      }
    };

    loadScripts();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      {/* ─── NAVBAR ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="Linkora logo">
              <rect width="28" height="28" rx="7" fill="#7C3AED" />
              <path d="M8 14h4m4 0h4M14 8v4m0 4v4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-gray-900">linkora</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="text-sm font-semibold px-5 py-2 rounded-full border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white transition-all duration-200"
            >
              Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          } bg-white border-b border-gray-100`}
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="text-sm font-semibold px-5 py-2.5 rounded-full border-2 border-violet-600 text-violet-600 text-center hover:bg-violet-600 hover:text-white transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center pt-20 pb-16 px-6 max-w-6xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Text */}
          <div>
            <h1
              ref={heroTitleRef}
              className="text-5xl sm:text-6xl font-extrabold leading-tight text-gray-900 mb-8"
              style={{ overflow: "hidden" }}
            >
              <span className="block">Choose a Template.</span>
              <span className="block">Add Your Content.</span>
              <span className="block text-violet-600">Publish Your Portfolio</span>
              <span className="block text-violet-600">Instantly</span>
            </h1>
            <div ref={heroCTARef} className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-violet-600 text-white font-semibold rounded-full hover:bg-violet-700 active:scale-95 transition-all duration-200 shadow-lg shadow-violet-200"
              >
                Get Started — Free
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-gray-600 font-medium rounded-full border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-all duration-200"
              >
                See how it works
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="flex justify-center md:justify-end">
            <div
              id="hero-illustration"
              className="relative w-full max-w-md"
            >
              {/* Mock portfolio card */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden p-6">
                {/* Mock browser bar */}
                <div className="flex items-center gap-1.5 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-3 flex-1 bg-gray-100 rounded-full h-5 px-3 flex items-center">
                    <span className="text-xs text-gray-400">linkora.id/carol</span>
                  </div>
                </div>
                {/* Mock portfolio content */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">C</div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Hello, I'm Carol!</div>
                    <div className="text-sm text-gray-500 mt-0.5">UI/UX Designer · Jakarta</div>
                    <div className="flex gap-2 mt-2">
                      {["💼", "🐦", "💻"].map((e, i) => (
                        <span key={i} className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-sm">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Figma", "React", "Branding", "Motion"].map((s) => (
                    <span key={s} className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-full border border-violet-100">{s}</span>
                  ))}
                </div>
                {/* Project cards */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { title: "Portfolio v3", color: "from-violet-500 to-purple-600" },
                    { title: "Brand Kit", color: "from-pink-500 to-rose-500" },
                  ].map((p) => (
                    <div key={p.title} className={`rounded-xl bg-gradient-to-br ${p.color} p-3 text-white`}>
                      <div className="text-xs font-semibold mb-1">{p.title}</div>
                      <div className="h-8 bg-white/20 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-2 flex items-center gap-2">
                <span className="text-green-500 text-lg">●</span>
                <span className="text-xs font-semibold text-gray-700">Published!</span>
              </div>
              <div className="absolute -bottom-3 -left-4 bg-violet-600 text-white rounded-2xl shadow-lg px-4 py-2 text-xs font-semibold">
                ✨ 2.4k views this week
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-sm font-semibold text-violet-600 uppercase tracking-widest">How it works</span>
            <h2 className="mt-3 text-4xl font-extrabold text-gray-900">Build your portfolio in 4 easy steps</h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto text-lg">Dari pilih template sampai portfolio online — semuanya bisa kamu lakukan dalam hitungan menit.</p>
          </div>

          <div className="space-y-28">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`grid md:grid-cols-2 gap-12 items-center ${f.img === "left" ? "md:flex-row-reverse" : ""}`}
                data-aos={f.img === "right" ? "fade-right" : "fade-left"}
                data-aos-delay="100"
              >
                {/* Text side */}
                <div className={f.img === "left" ? "md:order-2" : ""}>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-4 py-1.5 rounded-full mb-4">
                    <span className="text-base">{f.icon}</span>
                    Step {i + 1}
                  </div>
                  <h3 className="text-3xl font-extrabold text-gray-900 mb-4">{f.title}</h3>
                  <p className="text-lg text-gray-500 leading-relaxed max-w-md">{f.desc}</p>
                  {f.cta && (
                    <Link
                      href={f.ctaHref || "#"}
                      className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-violet-600 transition-all duration-200"
                    >
                      {f.cta}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  )}
                </div>

                {/* Illustration side */}
                <div className={`flex justify-center ${f.img === "left" ? "md:order-1" : ""}`}>
                  <FeatureIllustration type={f.illustrationKey} index={i} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEMPLATES ─── */}
      <section id="templates" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="text-sm font-semibold text-violet-600 uppercase tracking-widest">Templates</span>
            <h2 className="mt-3 text-4xl font-extrabold text-gray-900">Pick your perfect template</h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto text-lg">Setiap template dirancang khusus dan dapat dikustomisasi sepenuhnya.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((t, i) => (
              <div
                key={t.name}
                className="group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <div className={`h-48 bg-gradient-to-br ${t.color} relative`}>
                  {/* Mock content in template card */}
                  <div className="absolute inset-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 flex flex-col justify-end p-4">
                    <div className="w-8 h-8 rounded-full bg-white/30 mb-2" />
                    <div className="w-24 h-2.5 bg-white/60 rounded mb-1" />
                    <div className="w-16 h-2 bg-white/30 rounded" />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/20 transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white text-violet-700 font-semibold text-sm px-4 py-2 rounded-full shadow-lg transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      Preview Template
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{t.tag}</div>
                  </div>
                  <span className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-full">Free</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center" data-aos="fade-up">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 text-white font-semibold rounded-full hover:bg-violet-700 transition-all duration-200 shadow-lg shadow-violet-100"
            >
              Mulai Gratis Sekarang
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS BANNER ─── */}
      <section className="py-16 px-6 bg-violet-600 text-white" data-aos="fade-up">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "10k+", label: "Portfolio dibuat" },
            { num: "50+", label: "Template tersedia" },
            { num: "98%", label: "User puas" },
            { num: "<5min", label: "Waktu setup" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-extrabold mb-1">{s.num}</div>
              <div className="text-violet-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="text-sm font-semibold text-violet-600 uppercase tracking-widest">FAQ</span>
            <h2 className="mt-3 text-4xl font-extrabold text-gray-900">Pertanyaan yang sering ditanya</h2>
            <p className="mt-4 text-gray-500 text-lg">Masih ada yang belum jelas? Cek dulu di sini.</p>
          </div>

          <div className="space-y-3" data-aos="fade-up" data-aos-delay="100">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                  openFaq === i ? "border-violet-200 shadow-md shadow-violet-50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className={`font-semibold text-base transition-colors ${openFaq === i ? "text-violet-600" : "text-gray-800"}`}>
                    {faq.q}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180 text-violet-600" : "text-gray-400"
                    }`}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-300 ease-out overflow-hidden ${
                    openFaq === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 pb-5 text-gray-500 text-base leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 px-6 bg-gray-950 text-white" data-aos="fade-up">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-5">
            Portfolio kamu hanya <span className="text-violet-400">5 menit</span> lagi
          </h2>
          <p className="text-gray-400 text-lg mb-10">Daftar gratis, pilih template favorit, dan publish. Sesederhana itu.</p>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 text-white font-semibold rounded-full hover:bg-violet-500 transition-all duration-200 text-lg shadow-2xl shadow-violet-900/30"
          >
            Mulai Sekarang — Gratis
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-gray-950 border-t border-white/5 text-gray-400 py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect width="28" height="28" rx="7" fill="#7C3AED" />
                  <path d="M8 14h4m4 0h4M14 8v4m0 4v4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span className="text-white text-xl font-bold">linkora</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Platform portfolio online untuk developer, designer, student, dan creator. Buat, customise, dan publish dalam hitungan menit.
              </p>
            </div>

            {/* Links */}
            <div>
              <div className="text-white font-semibold text-sm mb-4">Produk</div>
              <ul className="space-y-2 text-sm">
                {["Features", "Templates", "Pricing", "Changelog"].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-white font-semibold text-sm mb-4">Dukungan</div>
              <ul className="space-y-2 text-sm">
                {["FAQ", "Dokumentasi", "Kontak", "Status"].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <span>© {new Date().getFullYear()} Linkora. All rights reserved.</span>
            <span>
              Created with{" "}
              <span className="text-violet-400">♥</span>
              {" "}by{" "}
              <span className="text-gray-400 font-semibold">Belhart Rajesky Pasaribu</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Feature Illustration Component ─── */
function FeatureIllustration({ type, index }: { type: string; index: number }) {
  const colors = [
    { bg: "from-violet-50 to-purple-100", accent: "bg-violet-500", light: "bg-violet-100", border: "border-violet-200" },
    { bg: "from-blue-50 to-cyan-100", accent: "bg-blue-500", light: "bg-blue-100", border: "border-blue-200" },
    { bg: "from-rose-50 to-pink-100", accent: "bg-rose-500", light: "bg-rose-100", border: "border-rose-200" },
    { bg: "from-amber-50 to-orange-100", accent: "bg-amber-500", light: "bg-amber-100", border: "border-amber-200" },
  ];
  const c = colors[index % colors.length];

  const illustrations: Record<string, React.ReactNode> = {
    template: (
      <div className={`w-full max-w-sm bg-gradient-to-br ${c.bg} rounded-3xl p-8 relative overflow-hidden border ${c.border}`}>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`rounded-2xl ${i === 0 ? c.accent : "bg-white"} h-28 shadow-sm flex flex-col justify-end p-3`}>
              <div className={`h-2 rounded ${i === 0 ? "bg-white/60" : c.light} w-3/4 mb-1`} />
              <div className={`h-1.5 rounded ${i === 0 ? "bg-white/40" : "bg-gray-100"} w-1/2`} />
            </div>
          ))}
        </div>
        <div className={`absolute top-3 right-3 text-xs font-semibold ${c.accent} text-white px-3 py-1 rounded-full`}>50+ templates</div>
      </div>
    ),
    customize: (
      <div className={`w-full max-w-sm bg-gradient-to-br ${c.bg} rounded-3xl p-8 border ${c.border}`}>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Customize</div>
          {/* Color picker */}
          <div className="flex gap-2 mb-4">
            {["#7C3AED","#2563EB","#DC2626","#059669","#D97706"].map((hex) => (
              <div key={hex} className="w-7 h-7 rounded-full border-2 border-white shadow cursor-pointer hover:scale-110 transition-transform" style={{background: hex}} />
            ))}
          </div>
          {/* Font selector mock */}
          <div className="rounded-lg border border-gray-100 p-2.5 text-sm text-gray-500 mb-3 flex justify-between">
            <span>Satoshi Regular</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
          </div>
          {/* Layout toggle */}
          <div className="flex gap-2">
            {["Grid","List","Card"].map((l, i) => (
              <div key={l} className={`flex-1 text-center text-xs py-2 rounded-lg font-medium ${i === 0 ? `${c.accent} text-white` : "bg-gray-50 text-gray-500"}`}>{l}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    content: (
      <div className={`w-full max-w-sm bg-gradient-to-br ${c.bg} rounded-3xl p-8 border ${c.border}`}>
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Content</div>
          {[
            { label: "Projects", icon: "💼", count: "12 items" },
            { label: "Skills", icon: "⚡", count: "8 added" },
            { label: "Experience", icon: "📋", count: "3 roles" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer group">
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-400">{item.count}</div>
              </div>
              <div className={`w-2 h-2 rounded-full ${c.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
          <div className={`w-full py-2.5 rounded-xl text-xs font-semibold text-white text-center ${c.accent} cursor-pointer`}>+ Add Section</div>
        </div>
      </div>
    ),
    publish: (
      <div className={`w-full max-w-sm bg-gradient-to-br ${c.bg} rounded-3xl p-8 border ${c.border} relative`}>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${c.accent} flex items-center justify-center text-white text-lg`}>🚀</div>
            <div>
              <div className="font-bold text-sm text-gray-900">Portfolio Live!</div>
              <div className="text-xs text-gray-400">linkora.id/yourname</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 mb-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              linkora.id/yourname
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[{ v: "247", l: "Views" }, { v: "14", l: "Clicks" }, { v: "3", l: "Offers" }].map((s) => (
              <div key={s.l} className="bg-gray-50 rounded-lg py-2">
                <div className="font-bold text-sm text-gray-900">{s.v}</div>
                <div className="text-xs text-gray-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">✓ Live</div>
      </div>
    ),
  };

  return illustrations[type] || <div />;
}
