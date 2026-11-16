'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react'
import DribbbleLoading, { DribbbleLoadingPhase } from '@/components/DribbbleLoading'

interface VersionMeta {
  latest_version?: string
  apk_size_mb?: number
  apk_url?: string
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingPhase, setLoadingPhase] = useState<DribbbleLoadingPhase>('spinning')
  const [versionInfo, setVersionInfo] = useState<VersionMeta>({
    latest_version: '1.0.25',
    apk_size_mb: 59.0,
    apk_url: '/download/jagacuan.apk',
  })
  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    // Handle OAuth Google callback redirect on mobile if any
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      if (code) {
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.href = `io.supabase.jagacuan://login-callback?code=${code}`
        }
      } else if (/Android/i.test(navigator.userAgent)) {
        // Attempt to open installed app quietly while loading animation plays
        window.location.href =
          'intent://open#Intent;scheme=jagacuan;package=com.jagacuan.jagacuan_app;end'
      }
    }

    // Fetch latest version metadata from /version.json
    fetch('/version.json', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data === 'object') {
          setVersionInfo({
            latest_version: data.latest_version ?? '1.0.25',
            apk_size_mb: data.apk_size_mb ?? 59.0,
            apk_url: '/download/jagacuan.apk',
          })
        }
      })
      .catch(() => {})

    // Dribbble Loading sequence: spinning (1.5s) -> checkmark (0.7s) -> download page
    const checkTimer = setTimeout(() => {
      setLoadingPhase('success')
    }, 1500)

    const doneTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2250)

    return () => {
      clearTimeout(checkTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  const handleOpenApp = () => {
    if (typeof window !== 'undefined') {
      window.location.href =
        'intent://open#Intent;scheme=jagacuan;package=com.jagacuan.jagacuan_app;end'
      setTimeout(() => {
        window.location.href = 'jagacuan://open'
      }, 500)
    }
  }

  return (
    <div className="min-h-screen bg-[#030637] text-white font-sans relative overflow-hidden flex items-center justify-center p-5 selection:bg-[#1CA0FF] selection:text-white">
      {/* Subtle Ambient Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[320px] bg-[#1CA0FF]/12 blur-[140px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <DribbbleLoading key="home-loading" phase={loadingPhase} />
        ) : (
          <motion.main
            key="download-page"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-sm relative z-10"
          >
            <div className="w-full rounded-3xl bg-[#0A0F4D]/80 backdrop-blur-xl border border-white/10 p-7 shadow-2xl flex flex-col items-center text-center">
              {/* App Logo */}
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3 mb-5 shadow-inner">
                <img
                  src="/piggy-center.png"
                  alt="Logo JagaCuan"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Version Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1CA0FF]/15 border border-[#1CA0FF]/30 text-[#60C3FF] text-[11px] font-bold mb-3">
                <ShieldCheck size={13} />
                <span>
                  Android APK • v{versionInfo.latest_version ?? '1.0.25'}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1.5">
                JagaCuan
              </h1>
              <p className="text-xs text-white/65 leading-relaxed max-w-[260px] mb-6">
                Aplikasi pencatat tabungan pribadi &amp; nabung bareng teman.
                Unduh dan pasang aplikasi Android resminya di bawah ini.
              </p>

              {downloaded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full mb-4 px-3.5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={15} />
                  <span>Mengunduh APK JagaCuan...</span>
                </motion.div>
              )}

              {/* Primary CTA: Download APK */}
              <div className="w-full space-y-2.5">
                <a
                  href={versionInfo.apk_url ?? '/download/jagacuan.apk'}
                  download="jagacuan.apk"
                  onClick={() => setDownloaded(true)}
                  className="w-full py-4 px-5 rounded-2xl bg-[#1CA0FF] hover:bg-[#33ADFF] active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-[#1CA0FF]/30 no-underline transition-all"
                >
                  <Download size={18} />
                  <span>
                    Download APK (
                    {(versionInfo.apk_size_mb ?? 59.0).toFixed(0)} MB)
                  </span>
                </a>

                {/* Secondary CTA: Open App */}
                <button
                  type="button"
                  onClick={handleOpenApp}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 text-white/80 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Smartphone size={14} className="text-[#1CA0FF]" />
                  <span>Sudah Pasang? Buka Aplikasi</span>
                </button>
              </div>

              <p className="mt-5 pt-4 border-t border-white/10 w-full text-[11px] text-white/40">
                Setelah selesai mengunduh, buka file{' '}
                <span className="text-white/70 font-medium">jagacuan.apk</span>{' '}
                untuk menginstal.
              </p>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}
