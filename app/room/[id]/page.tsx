'use client'

import { use, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Smartphone,
  Download,
  Copy,
  Check,
  AlertCircle,
  Users,
  ShieldCheck,
  Laptop,
} from 'lucide-react'
import { getRoomById, SupabaseNabarRoom } from '@/lib/supabase/nabar'
import DribbbleLoading, { DribbbleLoadingPhase } from '@/components/DribbbleLoading'

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
  const [loadingPhase, setLoadingPhase] = useState<DribbbleLoadingPhase>('spinning')
  const [room, setRoom] = useState<SupabaseNabarRoom | null>(null)
  const [copied, setCopied] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(true)

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

      // Jika pada ponsel, coba luncurkan aplikasi JagaCuan secara otomatis di background
      if (isMobile) {
        window.location.href = `intent://room/${roomId}#Intent;scheme=jagacuan;package=com.jagacuan.jagacuan_app;end`
        setTimeout(() => {
          window.location.href = `jagacuan://room/${roomId}`
        }, 500)
      }
    }

    // Dribbble loading: spinning (1.5s) -> blue checkmark (0.75s) -> fallback download page
    const checkTimer = setTimeout(() => {
      setLoadingPhase('success')
    }, 1500)

    const doneTimer = setTimeout(() => {
      setDetecting(false)
    }, 2250)

    return () => {
      clearTimeout(checkTimer)
      clearTimeout(doneTimer)
    }
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
      navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-[#030637] text-white font-sans relative overflow-x-hidden selection:bg-[#1CA0FF] selection:text-white flex justify-center items-center p-4">
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[320px] bg-[#1CA0FF]/12 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {detecting ? (
            <DribbbleLoading key="room-loading" phase={loadingPhase} />
          ) : !isMobileDevice ? (
            <motion.div
              key="desktop-notice"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-6 rounded-3xl bg-[#0A0F4D]/80 backdrop-blur-xl border border-white/10 shadow-2xl text-center flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1CA0FF]/15 border border-[#1CA0FF]/30 flex items-center justify-center mb-4 text-[#1CA0FF]">
                <Laptop size={26} />
              </div>

              <h3 className="text-lg font-extrabold text-white mb-1.5">
                Aplikasi Khusus Android
              </h3>
              <p className="text-xs text-white/60 mb-5 leading-relaxed">
                Fitur Nabung Bareng (Nabar) hanya berjalan di aplikasi Android JagaCuan. Unduh file APK resmi untuk dipasang di HP Anda.
              </p>

              {room && (
                <div className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left mb-5">
                  <span className="text-[10px] font-bold uppercase text-[#60C3FF] tracking-wider block mb-0.5">
                    Ruang Dituju
                  </span>
                  <p className="text-sm font-bold text-white truncate">{room.title}</p>
                  <p className="text-xs text-white/60 mt-0.5 font-medium">
                    Target: <span className="text-emerald-400 font-bold">{formatRupiah(room.targetAmount)}</span>
                  </p>
                </div>
              )}

              <a
                href="/download/jagacuan.apk"
                download="jagacuan.apk"
                onClick={handleDownloadApk}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1CA0FF] hover:bg-[#33ADFF] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1CA0FF]/25 no-underline transition-all"
              >
                <Download size={15} />
                <span>Unduh APK JagaCuan (59 MB)</span>
              </a>
            </motion.div>
          ) : (
            <motion.div
              key="mobile-install-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full p-6 rounded-3xl bg-[#0A0F4D]/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[11px] font-bold mb-4">
                <AlertCircle size={13} />
                <span>Aplikasi Belum Terpasang</span>
              </div>

              <h2 className="text-xl font-black text-white text-center tracking-tight mb-1.5">
                Download JagaCuan
              </h2>
              <p className="text-xs text-white/60 text-center mb-5 max-w-[280px] leading-relaxed">
                Kamu belum memiliki aplikasi JagaCuan di perangkat ini. Unduh APK resmi untuk langsung ikut menabung bersama.
              </p>

              {room ? (
                <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 mb-5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase text-[#60C3FF] tracking-wider">
                      Undangan Nabar
                    </span>
                    {room.membersCount > 0 && (
                      <span className="text-[10px] text-white/60 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                        <Users size={11} className="text-emerald-400" />
                        <span>{room.membersCount} Anggota</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white truncate mb-1">
                    {room.title}
                  </h3>

                  <div className="text-xs text-white/60 flex items-center justify-between pt-2 border-t border-white/10">
                    <span>Target Tabungan:</span>
                    <span className="text-sm font-black text-emerald-400">
                      {formatRupiah(room.targetAmount)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-center mb-5">
                  <span className="text-xs font-mono text-white/50 tracking-wider">
                    Kode: {roomId.slice(0, 8)}...
                  </span>
                </div>
              )}

              {copied && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full mb-3 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Kode ruang disalin otomatis ke clipboard!</span>
                </motion.div>
              )}

              <div className="w-full space-y-2.5">
                <a
                  href="/download/jagacuan.apk"
                  download="jagacuan.apk"
                  onClick={handleDownloadApk}
                  className="w-full py-4 px-4 rounded-2xl bg-[#1CA0FF] hover:bg-[#33ADFF] active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#1CA0FF]/25 no-underline transition-all text-center cursor-pointer"
                >
                  <Download size={18} />
                  <span>Download APK JagaCuan</span>
                </a>

                <button
                  onClick={handleOpenApp}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 text-white/80 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Smartphone size={14} className="text-[#1CA0FF]" />
                  <span>Sudah Pasang? Buka di Aplikasi</span>
                </button>
              </div>

              <div className="w-full mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-400" />
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
