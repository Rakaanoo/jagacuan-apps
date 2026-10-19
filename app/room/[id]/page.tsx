'use client'

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Smartphone,
  Download,
  Copy,
  Check,
  Share2,
  AlertCircle,
  Users,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Laptop,
} from 'lucide-react'
import { getRoomById, SupabaseNabarRoom } from '@/lib/supabase/nabar'

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const roomId = resolvedParams.id

  const [detecting, setDetecting] = useState(true)
  const [room, setRoom] = useState<SupabaseNabarRoom | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(true)
  const [apkDownloaded, setApkDownloaded] = useState(false)

  const fetchRoomData = useCallback(async () => {
    try {
      const roomData = await getRoomById(roomId)
      setRoom(roomData)
    } catch (err) {
      console.error('Error fetching room details:', err)
    }
  }, [roomId])

  useEffect(() => {
    fetchRoomData()

    if (typeof window !== 'undefined') {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      setIsMobileDevice(isMobile)

      // Jika pada ponsel, coba luncurkan aplikasi Jagacuan secara otomatis di background
      if (isMobile) {
        window.location.href = `intent://room/${roomId}#Intent;scheme=jagacuan;package=com.jagacuan.jagacuan_app;end`
        setTimeout(() => {
          window.location.href = `jagacuan://room/${roomId}`
        }, 500)
      }
    }

    // Tampilkan hanya loading lingkaran muter selama 1.8 detik sebelum menampilkan peringatan belum install
    const timer = setTimeout(() => {
      setDetecting(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [roomId, fetchRoomData])

  const handleOpenApp = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `intent://room/${roomId}#Intent;scheme=jagacuan;package=com.jagacuan.jagacuan_app;end`
      setTimeout(() => {
        window.location.href = `jagacuan://room/${roomId}`
      }, 600)
    }
  }

  const handleCopyCode = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleDownloadApk = () => {
    if (typeof window !== 'undefined') {
      // Otomatis salin kode ruangan ke clipboard agar saat buka app langsung terdeteksi
      navigator.clipboard.writeText(roomId)
      setCopied(true)
      setApkDownloaded(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#FFFFFF] font-sans relative overflow-x-hidden selection:bg-[#7C8BFF] selection:text-white flex justify-center items-center p-4">
      {/* Background Ambient Glows */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#7C8BFF]/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-[350px] h-[250px] bg-[#10B981]/8 blur-[130px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-sm relative z-10 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {detecting ? (
            /* ======================================================== */
            /* 1. LAYAR BERSIH: HANYA LOGO & LINGKARAN MUTER (SPINNER)  */
            /* ======================================================== */
            <motion.div
              key="clean-spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center text-center py-12"
            >
              {/* Spinner Lingkaran Elegan */}
              <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                {/* Outer Rotating Glowing Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-3 border-transparent border-t-[#7C8BFF] border-r-[#10B981] shadow-lg shadow-[#7C8BFF]/20"
                />

                {/* Inner Static Pulse Ring */}
                <div className="w-14 h-14 rounded-full bg-[#16171B] border border-white/10 flex items-center justify-center shadow-inner">
                  <span className="font-black text-xl text-white tracking-wider bg-gradient-to-br from-[#7C8BFF] to-[#10B981] bg-clip-text text-transparent">
                    J
                  </span>
                </div>
              </div>

              <h2 className="text-base font-bold text-white tracking-tight mb-1">
                Menghubungkan ke Jagacuan...
              </h2>
              <p className="text-xs text-white/50 max-w-[240px] leading-relaxed">
                Membuka ruang nabung otomatis di ponsel Anda.
              </p>
            </motion.div>
          ) : !isMobileDevice ? (
            /* ======================================================== */
            /* 2. KHUSUS LAPTOP / PC: HANYA PEMBERITAHUAN KHUSUS HP    */
            /* ======================================================== */
            <motion.div
              key="desktop-notice"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-6 rounded-3xl bg-[#16171B] border border-white/10 shadow-2xl text-center flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#7C8BFF]/15 border border-[#7C8BFF]/25 flex items-center justify-center mb-4 text-[#7C8BFF]">
                <Laptop size={26} />
              </div>

              <h3 className="text-lg font-extrabold text-white mb-1.5">
                Aplikasi Khusus Android
              </h3>
              <p className="text-xs text-white/60 mb-5 leading-relaxed">
                Fitur Nabung Bareng (Nabar) ini dioptimalkan untuk aplikasi Jagacuan di ponsel Android. Silakan unduh file APK resmi untuk dipasang di HP Anda.
              </p>

              {room && (
                <div className="w-full p-3.5 rounded-2xl bg-[#23242A] border border-[#333644] text-left mb-5">
                  <span className="text-[10px] font-bold uppercase text-[#7C8BFF] tracking-wider block mb-0.5">
                    Ruang Dituju
                  </span>
                  <p className="text-sm font-bold text-white truncate">{room.title}</p>
                  <p className="text-xs text-white/60 mt-0.5 font-medium">
                    Target: <span className="text-[#10B981] font-bold">{formatRupiah(room.targetAmount)}</span>
                  </p>
                </div>
              )}

              <a
                href="/download/jagacuan.apk"
                download="jagacuan.apk"
                onClick={handleDownloadApk}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7C8BFF] to-[#6366F1] hover:brightness-110 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#7C8BFF]/25 no-underline transition-all"
              >
                <Download size={15} />
                <span>Unduh APK Jagacuan (59 MB)</span>
              </a>
            </motion.div>
          ) : (
            /* ======================================================== */
            /* 3. PONSEL: PERINGATAN BELUM DOWNLOAD + TOMBOL UNDUH APK */
            /* ======================================================== */
            <motion.div
              key="mobile-install-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full p-6 rounded-3xl bg-[#16171B] border border-white/10 shadow-2xl flex flex-col items-center"
            >
              {/* Badge Peringatan */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[11px] font-bold mb-4">
                <AlertCircle size={13} />
                <span>Aplikasi Belum Terpasang</span>
              </div>

              <h2 className="text-xl font-black text-white text-center tracking-tight mb-1.5">
                Yuk Gabung di Aplikasi
              </h2>
              <p className="text-xs text-white/60 text-center mb-5 max-w-[280px] leading-relaxed">
                Kamu belum memiliki aplikasi Jagacuan di perangkat ini. Unduh APK resmi untuk langsung ikut menabung bersama.
              </p>

              {/* Pratinjau Ruangan Ringkas */}
              {room ? (
                <div className="w-full p-4 rounded-2xl bg-[#23242A] border border-[#333644] mb-5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase text-[#7C8BFF] tracking-wider">
                      Undangan Nabar
                    </span>
                    {room.membersCount > 0 && (
                      <span className="text-[10px] text-white/60 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                        <Users size={11} className="text-[#10B981]" />
                        <span>{room.membersCount} Anggota</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white truncate mb-1">
                    {room.title}
                  </h3>

                  <div className="text-xs text-white/60 flex items-center justify-between pt-2 border-t border-white/5">
                    <span>Target Tabungan:</span>
                    <span className="text-sm font-black text-[#10B981]">
                      {formatRupiah(room.targetAmount)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center mb-5">
                  <span className="text-xs font-mono text-white/50 tracking-wider">
                    Kode: {roomId.slice(0, 8)}...
                  </span>
                </div>
              )}

              {/* Status Notifikasi Salin Otomatis */}
              {copied && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full mb-3 px-3 py-2 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Kode ruang disalin otomatis ke clipboard!</span>
                </motion.div>
              )}

              {/* Tombol Utama: Unduh APK */}
              <div className="w-full space-y-2.5">
                <a
                  href="/download/jagacuan.apk"
                  download="jagacuan.apk"
                  onClick={handleDownloadApk}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#7C8BFF] to-[#6366F1] hover:brightness-110 active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#7C8BFF]/25 no-underline transition-all text-center cursor-pointer"
                >
                  <Download size={18} />
                  <span>Unduh Aplikasi Jagacuan (APK)</span>
                </a>

                {/* Tombol Sekunder Cadangan: Buka di Aplikasi */}
                <button
                  onClick={handleOpenApp}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 text-white/80 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Smartphone size={14} className="text-[#10B981]" />
                  <span>Sudah Pasang? Buka di Aplikasi</span>
                </button>
              </div>

              {/* Info Panduan Cepat */}
              <div className="w-full mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#10B981]" />
                  APK Resmi • 59 MB
                </span>
                <button
                  onClick={handleCopyCode}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Copy size={11} />
                  <span>Salin Kode</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
