'use client'

import { use, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Smartphone, Download } from 'lucide-react'
import DribbbleLoading, { DribbbleLoadingPhase } from '@/components/DribbbleLoading'

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const roomId = resolvedParams.id

  const [loadingPhase, setLoadingPhase] = useState<DribbbleLoadingPhase>('spinning')
  const [showFallbackActions, setShowFallbackActions] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const urlParams = new URLSearchParams(window.location.search)
    const noRedirect = urlParams.get('no_redirect') === '1'
    const isAndroid = /Android/i.test(navigator.userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)

    if (!noRedirect) {
      if (isAndroid) {
        const fallbackUrl = `${window.location.origin}/room/${roomId}?no_redirect=1`
        window.location.href = `intent://room/${roomId}#Intent;scheme=jagacuan;package=com.jagacuan.jagacuan_app;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`
      } else if (isIOS) {
        window.location.href = `jagacuan://room/${roomId}`
      }
    }

    const checkTimer = setTimeout(() => {
      setLoadingPhase('success')
    }, 1200)

    const fallbackTimer = setTimeout(() => {
      setShowFallbackActions(true)
    }, noRedirect ? 400 : 2200)

    return () => {
      clearTimeout(checkTimer)
      clearTimeout(fallbackTimer)
    }
  }, [roomId])

  const handleOpenApp = () => {
    if (typeof window === 'undefined') return
    const fallbackUrl = `${window.location.origin}/room/${roomId}?no_redirect=1`
    if (/Android/i.test(navigator.userAgent)) {
      window.location.href = `intent://room/${roomId}#Intent;scheme=jagacuan;package=com.jagacuan.jagacuan_app;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`
    } else {
      window.location.href = `jagacuan://room/${roomId}`
    }
  }

  return (
    <div className="min-h-screen bg-[#12141B] text-white font-sans relative overflow-hidden">
      <DribbbleLoading
        phase={loadingPhase}
        label={
          showFallbackActions
            ? 'Mengarahkan ke aplikasi JagaCuan'
            : 'Membuka ruang Nabung Bareng...'
        }
        sublabel={
          showFallbackActions
            ? 'Jika aplikasi belum terbuka otomatis, ketuk tombol di bawah.'
            : 'Mohon tunggu sebentar'
        }
      />

      {showFallbackActions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] w-full max-w-[300px] px-5 flex flex-col gap-2.5"
        >
          <button
            type="button"
            onClick={handleOpenApp}
            className="w-full py-3 px-4 rounded-xl bg-[#7C8BFF] hover:bg-[#6E7DF5] text-[#0F1118] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Smartphone size={15} />
            <span>Buka di Aplikasi JagaCuan</span>
          </button>

          <Link
            href="/#unduh"
            className="w-full py-3 px-4 rounded-xl border border-[#2E3344] bg-[#1A1D26] hover:bg-[#222633] text-white/90 font-semibold text-xs flex items-center justify-center gap-2 transition-colors no-underline"
          >
            <Download size={14} />
            <span>Belum punya aplikasi? Unduh</span>
          </Link>
        </motion.div>
      )}
    </div>
  )
}
