'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  Smartphone,
  CheckCircle2,
  Users,
  BarChart3,
  CalendarDays,
  BellRing,
  Target,
  ArrowUpRight,
  Wallet,
  Check,
  Menu,
  X,
} from 'lucide-react'
import HeroPhoneMockups from '@/components/HeroPhoneMockups'
import ExplodedAppShowcase from '@/components/ExplodedAppShowcase'

interface VersionMeta {
  latest_version?: string
  apk_size_mb?: number
  apk_url?: string
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [versionInfo, setVersionInfo] = useState<VersionMeta>({
    latest_version: '1.0.32',
    apk_size_mb: 60.3,
    apk_url: '/download/jagacuan.apk',
  })

  useEffect(() => {
    // Handle OAuth Google callback redirect on mobile if any
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      if (code && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = `io.supabase.jagacuan://login-callback?code=${code}`
      }
    }

    // Fetch latest version metadata from /version.json
    fetch('/version.json', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data === 'object') {
          setVersionInfo({
            latest_version: data.latest_version ?? '1.0.32',
            apk_size_mb: data.apk_size_mb ?? 60.3,
            apk_url: '/download/jagacuan.apk',
          })
        }
      })
      .catch(() => {})
  }, [])

  const handleOpenApp = () => {
    if (typeof window !== 'undefined') {
      const fallbackUrl = `${window.location.origin}/?no_redirect=1#unduh`
      window.location.href = `intent://open#Intent;scheme=jagacuan;package=com.jagacuan.jagacuan_app;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`
      setTimeout(() => {
        window.location.href = 'jagacuan://open'
      }, 500)
    }
  }

  const versionLabel = versionInfo.latest_version ?? '1.0.32'
  const sizeLabel = (versionInfo.apk_size_mb ?? 60.3).toFixed(0)

  return (
    <div className="min-h-screen bg-[#12141B] text-white">
      {/* Sticky Minimal Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#242836] bg-[#12141B]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 no-underline shrink-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#2F3447] shrink-0">
              <img
                src="/icons/jagacuan-brand.png"
                alt="Logo JagaCuan"
                width={36}
                height={36}
                className="w-full h-full object-cover block"
              />
            </div>
            <span className="text-[17px] font-extrabold tracking-tight text-white">
              JagaCuan
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#9BA2B5]">
            <a href="#fitur" className="hover:text-white transition-colors">
              Fitur
            </a>
            <a href="#tampilan" className="hover:text-white transition-colors">
              Tampilan
            </a>
            <a href="#cara-kerja" className="hover:text-white transition-colors">
              Cara Kerja
            </a>
            <a href="#unduh" className="hover:text-white transition-colors">
              Unduh
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <a
              href="#unduh"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#7C8BFF] hover:bg-[#6E7DF5] text-[#0F1118] transition-colors no-underline"
            >
              <Download size={14} />
              <span>Unduh v{versionLabel}</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Buka menu navigasi"
              className="md:hidden w-9 h-9 rounded-xl border border-[#2C3040] bg-[#1A1D26] text-white flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#242836] bg-[#12141B] px-5 py-4 flex flex-col gap-3 text-sm font-medium text-[#9BA2B5]">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              Fitur
            </a>
            <a
              href="#tampilan"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              Tampilan
            </a>
            <a
              href="#cara-kerja"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              Cara Kerja
            </a>
            <a
              href="#unduh"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#7C8BFF] text-[#0F1118] no-underline"
            >
              <Download size={14} />
              <span>Unduh APK v{versionLabel}</span>
            </a>
          </div>
        )}
      </header>

      <main>
        {/* HERO SECTION: Dual Realistic iPhone Dummy Frames (Splash + Beranda) ABOVE Hero Headline */}
        <section className="max-w-6xl mx-auto px-5 sm:px-6 pt-10 pb-16 sm:pt-14 sm:pb-24">
          <HeroPhoneMockups />

          {/* HERO TEXT BLOCK (Directly below the 2 iPhone dummies, without the pill badge) */}
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white mb-5"
            >
              Atur target tabungan pribadi &amp; nabung bareng lebih terarah.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.14 }}
              className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-[#9BA2B5]"
            >
              JagaCuan membantu kamu mencatat celengan harian, memantau
              kedisiplinan menabung lewat statistik, hingga patungan transparan
              bersama teman, pasangan, atau keluarga.
            </motion.p>
          </div>

          {/* EXPLODED VIEW SHOWCASE */}
          <ExplodedAppShowcase />
        </section>

        {/* HIGHLIGHTS STRIP */}
        <section className="border-y border-[#242836] bg-[#151821]">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: '2 Mode Tabungan',
                desc: 'Pribadi (offline-first) & Nabung Bareng (real-time).',
              },
              {
                title: 'Statistik Disiplin',
                desc: 'Pantau konsistensi mingguan, bulanan, dan tahunan.',
              },
              {
                title: 'Pengingat Jam 12:00',
                desc: 'Notifikasi terjadwal agar target tidak pernah lupa.',
              },
              {
                title: 'Tema Adaptif',
                desc: 'Mendukung Mode Gelap & Mode Terang di aplikasi.',
              },
            ].map((item) => (
              <div key={item.title}>
                <p className="text-sm font-bold text-white mb-1">{item.title}</p>
                <p className="text-xs leading-relaxed text-[#9BA2B5]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CORE FEATURES BENTO GRID */}
        <section
          id="fitur"
          className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-24"
        >
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7C8BFF] mb-2">
              Fitur Utama
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.025em] text-white mb-3">
              Semua yang kamu butuhkan untuk konsisten menabung.
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#9BA2B5]">
              Dirancang ringkas seperti celengan harian, namun punya alat
              pantau lengkap untuk target pribadi maupun patungan bersama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Feature 1 (Large) */}
            <div className="md:col-span-7 rounded-3xl border border-[#2B2F3D] bg-[#1A1D26] p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl border border-[#2E3344] bg-[#212531] flex items-center justify-center mb-4">
                  <Target size={19} className="text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Tabungan Pribadi yang Terstruktur
                </h3>
                <p className="text-sm leading-relaxed mb-6 text-[#9BA2B5]">
                  Tentukan nominal target, tenggat waktu, pilih ikon atau foto
                  impianmu, lalu catat setoran dan penarikan kapan saja, tetap
                  jalan penuh meski tanpa koneksi internet.
                </p>
              </div>

              <div className="rounded-2xl border border-[#2C3040] bg-[#14161E] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                      <Wallet size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        Beli Kamera Mirrorless
                      </p>
                      <p className="text-[11px] text-[#9BA2B5]">
                        Target 30 Nov • Estimasi Rp 50.000/hari
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#10B981]">
                    74%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-[#282C39]">
                  <div
                    className="h-full rounded-full bg-[#10B981]"
                    style={{ width: '74%' }}
                  />
                </div>
              </div>
            </div>

            {/* Feature 2 (Medium) */}
            <div className="md:col-span-5 rounded-3xl border border-[#2B2F3D] bg-[#1A1D26] p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl border border-[#2E3344] bg-[#212531] flex items-center justify-center mb-4">
                  <Users size={19} className="text-[#7C8BFF]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Nabung Bareng (Nabar) Real-Time
                </h3>
                <p className="text-sm leading-relaxed mb-6 text-[#9BA2B5]">
                  Buat ruang patungan bersama teman, pasangan, atau keluarga.
                  Cukup kirim tautan undangan, semua setoran anggota tercatat
                  transparan secara langsung.
                </p>
              </div>

              <div className="rounded-2xl border border-[#2C3040] bg-[#14161E] p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">
                    Link Undangan Ruang
                  </span>
                  <span className="text-[#7C8BFF] font-semibold inline-flex items-center gap-1">
                    Siap Dibagikan <ArrowUpRight size={13} />
                  </span>
                </div>
                <div className="px-3 py-2 rounded-xl border border-[#2C3040] bg-[#1B1E28] font-mono text-[11px] truncate text-[#9BA2B5]">
                  jagacuan-app.vercel.app/room/liburan-2026
                </div>
              </div>
            </div>

            {/* Feature 3 (Medium) */}
            <div className="md:col-span-5 rounded-3xl border border-[#2B2F3D] bg-[#1A1D26] p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl border border-[#2E3344] bg-[#212531] flex items-center justify-center mb-4">
                  <BarChart3 size={19} className="text-[#7C8BFF]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Statistik &amp; Kedisiplinan
                </h3>
                <p className="text-sm leading-relaxed mb-6 text-[#9BA2B5]">
                  Lihat tren mingguan, bulanan, dan tahunan lengkap dengan
                  aktivitas transaksi sehingga kamu tahu seberapa konsisten
                  ritme menabungmu.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: 'Mingguan', val: '6/7 Hr' },
                  { label: 'Rata-rata', val: 'Rp 74rb' },
                  { label: 'Disiplin', val: '86%' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-[#2C3040] bg-[#14161E] p-3 text-center"
                  >
                    <p className="text-[10px] font-medium text-[#9BA2B5]">
                      {stat.label}
                    </p>
                    <p className="text-sm font-extrabold text-white mt-0.5">
                      {stat.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 4 (Large) */}
            <div className="md:col-span-7 rounded-3xl border border-[#2B2F3D] bg-[#1A1D26] p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl border border-[#2E3344] bg-[#212531] flex items-center justify-center mb-4">
                  <CalendarDays size={19} className="text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Kalender Target &amp; Pengingat Otomatis
                </h3>
                <p className="text-sm leading-relaxed mb-6 text-[#9BA2B5]">
                  Pantau seluruh tenggat tabungan di tampilan kalender dan
                  nyalakan pengingat harian atau mingguan tepat pukul 12:00
                  siang. Bisa dinyalakan atau dimatikan per target kapan saja.
                </p>
              </div>

              <div className="rounded-2xl border border-[#2C3040] bg-[#14161E] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7C8BFF]/15 text-[#7C8BFF] flex items-center justify-center shrink-0">
                    <BellRing size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      Pengingat Harian • 12:00 WIB
                    </p>
                    <p className="text-[11px] text-[#9BA2B5]">
                      Aktif untuk Tabungan Pribadi &amp; Nabung Bareng
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] text-[11px] font-bold self-start sm:self-auto">
                  <Check size={12} /> Aktif
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* VISUAL SHOWCASE GALLERY */}
        <section id="tampilan" className="border-y border-[#242836] bg-[#151821]">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2">
                  Tampilan Aplikasi
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.025em] text-white mb-2">
                  Dirancang bersih, fokus, dan mudah dipahami.
                </h2>
                <p className="text-sm sm:text-base text-[#9BA2B5]">
                  Dari beranda celengan, grafik kedisiplinan, hingga ruang
                  nabung bareng, setiap layar dibuat intuitif untuk dipakai
                  sehari-hari.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 rounded-3xl border border-[#2B2F3D] bg-[#1A1D26] overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-[#262A37] flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Pratinjau Layar Utama &amp; Fitur
                    </p>
                    <p className="text-xs text-[#9BA2B5]">
                      Beranda, Statistik Kedisiplinan, Ruang Nabung, dan Pilih
                      Target
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[#2C3040] bg-[#14161E] text-[#C8CEE0]">
                    Mode Gelap
                  </span>
                </div>
                <div className="bg-[#12141B] p-3 sm:p-4">
                  <img
                    src="/images/mockup-screens.jpg"
                    alt="Mockup layar aplikasi JagaCuan"
                    className="w-full h-auto rounded-2xl block object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 rounded-3xl border border-[#2B2F3D] bg-[#1A1D26] overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-[#262A37] flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Alur Fitur &amp; Sistem Desain
                    </p>
                    <p className="text-xs text-[#9BA2B5]">
                      Kalender target, palet warna, dan komponen antarmuka
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[#2C3040] bg-[#14161E] text-[#C8CEE0]">
                    Showcase
                  </span>
                </div>
                <div className="p-3 sm:p-4 bg-[#12141B]">
                  <img
                    src="/images/mockup-showcase.jpg"
                    alt="Showcase desain dan alur aplikasi JagaCuan"
                    className="w-full h-auto rounded-2xl block object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="cara-kerja"
          className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-24"
        >
          <div className="max-w-xl mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7C8BFF] mb-2">
              Cara Mulai
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.025em] text-white">
              Mulai menabung dalam 3 langkah sederhana.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                title: 'Unduh & Pasang APK',
                desc: 'Unduh file jagacuan.apk resmi langsung dari halaman ini, lalu pasang di perangkat Android kamu.',
              },
              {
                step: '02',
                title: 'Pilih Jenis Target',
                desc: 'Buat Tabungan Pribadi secara instan tanpa login, atau tautkan akun Google untuk Ruang Nabung Bareng.',
              },
              {
                step: '03',
                title: 'Catat & Pantau Progres',
                desc: 'Masukkan setoran rutin, nyalakan pengingat jam 12:00, dan lihat progres targetmu tumbuh setiap hari.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-[#2B2F3D] bg-[#1A1D26] p-6"
              >
                <span className="inline-block text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-[#2E3344] bg-[#212531] text-[#7C8BFF] mb-4">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#9BA2B5]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DEDICATED DOWNLOAD SECTION */}
        <section id="unduh" className="max-w-6xl mx-auto px-5 sm:px-6 pb-20">
          <div className="rounded-[32px] border border-[#2B2F3D] bg-[#1A1D26] p-7 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#32374A] mb-5">
                  <img
                    src="/icons/jagacuan-brand.png"
                    alt="Logo JagaCuan"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover block"
                  />
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                  Unduh JagaCuan Sekarang!
                </h2>
                <p className="text-sm sm:text-base leading-relaxed mb-5 text-[#9BA2B5]">
                  Ayo Nabung Cerdas dan Wujudkan Impian!
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#9BA2B5]">
                  <span>Versi: v{versionLabel}</span>
                  <span>Ukuran: ~{sizeLabel} MB</span>
                  <span>Platform: Android 8.0+</span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-3">
                {downloaded && (
                  <div className="px-4 py-2.5 rounded-xl bg-[#10B981]/12 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold flex items-center justify-center gap-2">
                    <CheckCircle2 size={15} />
                    <span>Mengunduh jagacuan.apk...</span>
                  </div>
                )}

                <a
                  href={versionInfo.apk_url ?? '/download/jagacuan.apk'}
                  download="jagacuan.apk"
                  onClick={() => setDownloaded(true)}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 bg-[#7C8BFF] hover:bg-[#6E7DF5] text-[#0F1118] transition-colors no-underline"
                >
                  <Download size={18} />
                  <span>Download APK ({sizeLabel} MB)</span>
                </a>

                <button
                  type="button"
                  onClick={handleOpenApp}
                  className="w-full py-3.5 px-5 rounded-2xl border border-[#2E3344] bg-[#212531] hover:bg-[#282D3B] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Smartphone size={16} />
                  <span>Sudah Pasang? Buka Aplikasi</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* CLEAN MINIMAL FOOTER */}
      <footer className="border-t border-[#242836]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#2F3447] shrink-0">
              <img
                src="/icons/jagacuan-brand.png"
                alt="Logo JagaCuan"
                width={28}
                height={28}
                className="w-full h-full object-cover block"
              />
            </div>
            <span className="text-sm font-bold text-white">JagaCuan</span>
            <span className="text-xs text-[#7E869B]">• v{versionLabel}</span>
          </div>

          <p className="text-xs text-center sm:text-right text-[#9BA2B5]">
            © 2026 JagaCuan • Celengan Pintar, Capai Impianmu
          </p>
        </div>
      </footer>
    </div>
  )
}
