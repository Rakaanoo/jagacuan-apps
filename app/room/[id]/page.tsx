'use client'

import { use, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Smartphone,
  Download,
  Copy,
  Check,
  Shield,
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

      if (isMobile) {
        window.location.href = `intent://room/${roomId}#Intent;scheme=jagacuan;package=com.jagacuan.jagacuan_app;end`
        setTimeout(() => {
          window.location.href = `jagacuan://room/${roomId}`
        }, 500)
      }
    }

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
    <div className="min-h-screen bg-[#0E1117] text-white font-sans relative overflow-x-hidden selection:bg-[#7C8BFF] selection:text-white flex justify-center items-center p-5">
      <div className="w-full max-w-[390px] relative z-10 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {detecting ? (
            <DribbbleLoading key="room-loading" phase={loadingPhase} />
          ) : !isMobileDevice ? (
            <motion.div
              key="desktop-notice"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center"
            >
              <div className="w-full flex items-center justify-between px-2 mb-3.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/75">
                  <ShieldCheck size={15} className="text-[#34D399]" />
                  <span>Distribusi Resmi</span>
                </div>
                <span className="text-xs font-mono text-white/50">APK</span>
              </div>

              <div className="w-full p-7 rounded-[28px] bg-[#161923] border border-white/[0.08] shadow-2xl text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#222738] border border-white/10 flex items-center justify-center mb-4 text-[#7C8BFF]">
                  <Laptop size={28} />
                </div>

                <h3 className="text-xl font-extrabold text-white mb-1.5">
                  Aplikasi Khusus Android
                </h3>
                <p className="text-xs text-[#94A3B8] mb-5 leading-relaxed">
                  Fitur Nabung Bareng (Nabar) berjalan di aplikasi Android JagaCuan. Unduh file APK resmi untuk dipasang di HP Anda.
                </p>

                {room && (
                  <div className="w-full p-3.5 rounded-2xl bg-[#1D212E] border border-white/10 text-left mb-5">
                    <span className="text-[10px] font-bold uppercase text-[#7C8BFF] tracking-wider block mb-0.5">
                      Ruang Dituju
                    </span>
                    <p className="text-sm font-bold text-white truncate">{room.title}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">
                      Target:{' '}
                      <span className="text-[#34D399] font-bold">
                        {formatRupiah(room.targetAmount)}
                      </span>
                    </p>
                  </div>
                )}

                <a
                  href="/download/jagacuan.apk"
                  download="jagacuan.apk"
                  onClick={handleDownloadApk}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#7C8BFF] hover:bg-[#8A98FF] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_28px_rgba(124,139,255,0.4)] no-underline transition-all"
                >
                  <Download size={16} />
                  <span>Download APK (59 MB)</span>
                </a>
              </div>

              <p className="mt-5 text-[11px] text-white/35 text-center">
                © 2026 JagaCuan • Keuangan Terarah &amp; Aman
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="mobile-install-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              {/* Top Header Row above Card */}
              <div className="w-full flex items-center justify-between px-2 mb-3.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/75">
                  <ShieldCheck size={15} className="text-[#34D399]" />
                  <span>Distribusi Resmi</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-xs font-mono text-white/55 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={11} />
                  <span>Salin Kode</span>
                </button>
              </div>

              {/* Main Card */}
              <div className="w-full p-7 rounded-[28px] bg-[#161923] border border-white/[0.08] shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-36 bg-[#7C8BFF]/10 blur-3xl pointer-events-none" />

                <div className="w-18 h-18 rounded-2xl overflow-hidden border border-white/10 shadow-lg mb-4 relative z-10">
                  <img
                    src="/icons/icon-512.png"
                    alt="Logo JagaCuan"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#222738] border border-white/10 text-white/85 text-xs font-semibold mb-3.5 relative z-10">
                  <Shield size={13} className="text-[#7C8BFF]" />
                  <span>Undangan Nabung Bareng</span>
                </div>

                <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1.5 relative z-10">
                  JagaCuan
                </h2>
                <p className="text-xs text-[#94A3B8] mb-5 max-w-[280px] leading-relaxed relative z-10">
                  Unduh APK resmi untuk langsung bergabung ke ruang tabungan bersama.
                </p>

                {room ? (
                  <div className="w-full p-4 rounded-2xl bg-[#1D212E] border border-white/10 mb-5 text-left relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase text-[#7C8BFF] tracking-wider">
                        Ruang Nabar
                      </span>
                      {room.membersCount > 0 && (
                        <span className="text-[10px] text-white/65 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
                          <Users size={11} className="text-[#34D399]" />
                          <span>{room.membersCount} Anggota</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white truncate mb-1">
                      {room.title}
                    </h3>

                    <div className="text-xs text-[#94A3B8] flex items-center justify-between pt-2 border-t border-white/[0.07]">
                      <span>Target Tabungan:</span>
                      <span className="text-sm font-black text-[#34D399]">
                        {formatRupiah(room.targetAmount)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full p-3 rounded-xl bg-[#1D212E] border border-white/10 text-center mb-5 relative z-10">
                    <span className="text-xs font-mono text-white/55 tracking-wider">
                      Kode: {roomId.slice(0, 8)}...
                    </span>
                  </div>
                )}

                {copied && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full mb-3.5 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[#34D399] text-xs font-semibold flex items-center justify-center gap-1.5 relative z-10"
                  >
                    <Check size={14} />
                    <span>Kode ruang disalin otomatis ke clipboard!</span>
                  </motion.div>
                )}

                <div className="w-full space-y-3 relative z-10">
                  <a
                    href="/download/jagacuan.apk"
                    download="jagacuan.apk"
                    onClick={handleDownloadApk}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#7C8BFF] hover:bg-[#8A98FF] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_28px_rgba(124,139,255,0.4)] no-underline transition-all text-center cursor-pointer"
                  >
                    <Download size={17} />
                    <span>Download APK (59 MB)</span>
                  </a>

                  <button
                    onClick={handleOpenApp}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#1D212E] hover:bg-[#242938] active:scale-[0.98] border border-white/10 text-white/90 font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Smartphone size={15} className="text-white/65" />
                    <span>Sudah Pasang? Buka Aplikasi</span>
                  </button>
                </div>

                <div className="w-full mt-6 pt-5 border-t border-white/[0.07] text-xs text-[#94A3B8] leading-relaxed relative z-10">
                  <p>
                    Setelah selesai mengunduh, buka file{' '}
                    <code className="px-2 py-0.5 mx-0.5 rounded-md bg-[#222634] border border-white/10 font-mono text-[11px] text-white/90">
                      jagacuan.apk
                    </code>{' '}
                    untuk menginstal.
                  </p>
                </div>
              </div>

              <p className="mt-5 text-[11px] text-white/35 text-center">
                © 2026 JagaCuan • Keuangan Terarah &amp; Aman
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
