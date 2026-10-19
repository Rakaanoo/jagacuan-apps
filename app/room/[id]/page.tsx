'use client'

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Smartphone,
  Download,
  Copy,
  Check,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Calendar,
  CheckCircle2,
  Home,
  Clock,
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

  const [loading, setLoading] = useState(true)
  const [detecting, setDetecting] = useState(true)
  const [room, setRoom] = useState<SupabaseNabarRoom | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const fetchRoomData = useCallback(async () => {
    try {
      const roomData = await getRoomById(roomId)
      setRoom(roomData)
    } catch (err) {
      console.error('Error fetching room details:', err)
    } finally {
      setLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    fetchRoomData()

    // Coba luncurkan aplikasi otomatis via Android Intent pada mobile
    if (typeof window !== 'undefined') {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      if (isMobile) {
        const launchedKey = `launched_${roomId}`
        if (!sessionStorage.getItem(launchedKey)) {
          sessionStorage.setItem(launchedKey, '1')
          window.location.href = `intent://room/${roomId}#Intent;scheme=jagacuan;package=com.jagacuan.jagacuan_app;end`
        }
      }
    }

    const timer = setTimeout(() => {
      setDetecting(false)
    }, 1000)

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
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  const progressPct =
    room && room.targetAmount > 0
      ? Math.min(100, Math.round((room.currentAmount / room.targetAmount) * 100))
      : 0

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#FFFFFF] font-sans relative overflow-x-hidden selection:bg-[#7C8BFF] selection:text-white flex justify-center">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[360px] bg-[#7C8BFF]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[300px] bg-[#10B981]/8 blur-[140px] rounded-full pointer-events-none" />

      {/* Main App Container */}
      <div className="w-full max-w-md min-h-screen px-5 py-6 flex flex-col justify-between relative z-10 bg-[#16171B] border-x border-white/5 shadow-2xl">
        {/* Top Navbar */}
        <header className="flex items-center justify-between pb-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5 text-white no-underline group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C8BFF] to-[#4F46E5] flex items-center justify-center shadow-lg shadow-[#7C8BFF]/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-base text-white tracking-wider">J</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white leading-none">Jagacuan</span>
              <span className="text-[10px] text-white/50 tracking-wide mt-0.5">Ruang Tunggu Nabar</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareLink}
              title="Bagikan Tautan"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/80 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check size={13} className="text-[#10B981]" /> : <Share2 size={13} />}
              <span>{copiedLink ? 'Tersalin' : 'Bagikan'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic State: Loading / Detect vs Ruang Tunggu & Install Gateway */}
        <div className="my-auto py-5">
          <AnimatePresence mode="wait">
            {detecting || loading ? (
              /* Loading & Auto-Detect State */
              <motion.div
                key="detecting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center text-center py-12 px-6 rounded-3xl bg-[#23242A]/90 border border-[#333644] backdrop-blur-xl shadow-2xl"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#7C8BFF]/15 border border-[#7C8BFF]/30 flex items-center justify-center animate-pulse">
                    <Smartphone className="w-8 h-8 text-[#7C8BFF]" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center shadow-md">
                    <Loader2 size={12} className="text-white animate-spin" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">Membuka Ruangan...</h3>
                <p className="text-xs text-[#A0A5B5] max-w-[280px] leading-relaxed">
                  Menghubungkan ke aplikasi Jagacuan di ponsel Anda. Mohon tunggu sebentar...
                </p>

                <div className="mt-6 flex items-center gap-2 text-[11px] text-[#7C8BFF] bg-[#7C8BFF]/10 px-3.5 py-1.5 rounded-full border border-[#7C8BFF]/20">
                  <Sparkles size={12} className="animate-spin text-[#10B981]" />
                  <span>Deteksi Aplikasi Jagacuan</span>
                </div>
              </motion.div>
            ) : !room ? (
              /* Room Not Found State */
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-10 px-6 rounded-3xl bg-[#23242A] border border-[#333644] shadow-2xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                  <AlertCircle size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">Ruang Tidak Ditemukan</h3>
                <p className="text-xs text-[#A0A5B5] mb-6 max-w-[280px] leading-relaxed">
                  Tautan ruang mungkin salah, telah dihapus oleh pemilik, atau masa berlakunya telah usai.
                </p>

                <div className="w-full flex flex-col gap-2.5">
                  <a
                    href="/download/jagacuan.apk"
                    download="jagacuan.apk"
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7C8BFF] to-[#6366F1] hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#7C8BFF]/20 no-underline"
                  >
                    <Download size={15} />
                    <span>Unduh APK Jagacuan</span>
                  </a>

                  <Link
                    href="/"
                    className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors no-underline"
                  >
                    <Home size={14} />
                    <span>Kembali ke Beranda</span>
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* Ruang Tunggu & Install Dashboard Gateway */
              <motion.div
                key="waiting-room"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-4"
              >
                {/* Header Tag / Status */}
                <div className="flex items-center justify-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[11px] font-semibold tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                    Undangan Nabung Bareng Aktif
                  </span>
                </div>

                {/* Room Card Preview */}
                <div className="rounded-3xl bg-[#23242A] border border-[#333644] overflow-hidden shadow-2xl relative">
                  {room.coverImage ? (
                    <div className="relative w-full h-44 overflow-hidden bg-black/40">
                      <img
                        src={room.coverImage}
                        alt={room.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#23242A] via-[#23242A]/40 to-transparent" />
                    </div>
                  ) : (
                    <div className="w-full h-24 bg-gradient-to-br from-[#7C8BFF]/20 to-[#10B981]/10 flex items-center justify-center border-b border-white/5">
                      <Users className="w-10 h-10 text-[#7C8BFF]/70" />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-[#7C8BFF]">
                        Ruang Nabar
                      </p>
                      {room.membersCount > 0 && (
                        <span className="text-[11px] text-[#A0A5B5] flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          <Users size={11} className="text-[#10B981]" />
                          <span>{room.membersCount} Anggota</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-extrabold text-white tracking-tight mb-3">
                      {room.title}
                    </h2>

                    {/* Target Amount Highlight */}
                    <div className="p-3.5 rounded-2xl bg-[#1C1D22] border border-[#333644] mb-4">
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-xs text-[#A0A5B5]">Target Tabungan</span>
                        <span className="text-xs font-bold text-[#10B981]">{progressPct}%</span>
                      </div>
                      <div className="text-2xl font-black text-white tracking-tight">
                        {formatRupiah(room.targetAmount)}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mt-2.5">
                        <div
                          className="h-full bg-gradient-to-r from-[#7C8BFF] to-[#10B981] rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      {room.currentAmount > 0 && (
                        <div className="text-[11px] text-[#A0A5B5] mt-1.5 flex justify-between">
                          <span>Terkumpul:</span>
                          <span className="font-semibold text-white/90">{formatRupiah(room.currentAmount)}</span>
                        </div>
                      )}
                    </div>

                    {room.note && (
                      <div className="mb-4 text-xs italic text-white/70 bg-[#1C1D22] border border-[#333644] rounded-xl px-3 py-2">
                        &ldquo;{room.note}&rdquo;
                      </div>
                    )}

                    {/* Kode Ruangan Bar */}
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#1C1D22] border border-[#333644] text-xs">
                      <span className="text-[#A0A5B5] text-[11px]">Kode Ruang:</span>
                      <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1.5 font-mono font-semibold text-white/90 hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="tracking-wider">{roomId.slice(0, 8)}...</span>
                        {copied ? (
                          <span className="text-[#10B981] text-[10px] font-sans font-bold flex items-center gap-0.5">
                            <Check size={12} /> Tersalin
                          </span>
                        ) : (
                          <Copy size={13} className="text-white/40" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-3 pt-1">
                  {/* Button 1: Buka di Aplikasi (Sudah Download) */}
                  <button
                    onClick={handleOpenApp}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#10B981]/25 cursor-pointer"
                  >
                    <Smartphone size={18} />
                    <span>Buka di Aplikasi Jagacuan</span>
                    <ArrowRight size={16} className="ml-auto opacity-75" />
                  </button>

                  {/* Dashboard Install Gateway (Belum Download) */}
                  <div className="p-4 rounded-2xl bg-[#23242A] border border-[#333644] space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Download size={14} className="text-[#7C8BFF]" />
                          Belum Punya Aplikasi Jagacuan?
                        </h4>
                        <p className="text-[11px] text-[#A0A5B5] mt-0.5 leading-relaxed">
                          Unduh file APK resmi Jagacuan di bawah ini untuk bergabung ke ruangan ini dan menabung bersama.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-[#7C8BFF] bg-[#7C8BFF]/15 px-2 py-0.5 rounded-full border border-[#7C8BFF]/25 whitespace-nowrap">
                        59 MB
                      </span>
                    </div>

                    <a
                      href="/download/jagacuan.apk"
                      download="jagacuan.apk"
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7C8BFF] to-[#6366F1] hover:brightness-110 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#7C8BFF]/20 no-underline text-center"
                    >
                      <Download size={14} />
                      <span>Unduh Aplikasi Jagacuan (APK)</span>
                    </a>

                    {/* Step-by-Step Instructions */}
                    <div className="pt-2 border-t border-white/5 space-y-1.5 text-[11px] text-[#A0A5B5]">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-white/10 text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0">
                          1
                        </span>
                        <span>Unduh dan instal file APK Jagacuan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-white/10 text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0">
                          2
                        </span>
                        <span>Buka aplikasi & masuk dengan Akun Google</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-white/10 text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0">
                          3
                        </span>
                        <span>Klik link ini lagi atau masukkan kode ruang di menu Nabar</span>
                      </div>
                    </div>
                  </div>

                  {/* Button 3: Buka Dashboard Web */}
                  <Link
                    href="/"
                    className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#A0A5B5] hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors no-underline text-center"
                  >
                    <Home size={14} />
                    <span>Buka Jagacuan Web Dashboard</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="pt-4 border-t border-white/5 text-center text-[11px] text-[#A0A5B5] flex items-center justify-center gap-1.5">
          <ShieldCheck size={13} className="text-[#10B981]" />
          <span>Aplikasi Tabungan Digital Jagacuan • Bebas Iklan</span>
        </footer>
      </div>
    </div>
  )
}
