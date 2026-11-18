'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Smartphone, ShieldCheck, Shield, CheckCircle2 } from 'lucide-react'
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
    latest_version: '1.0.28',
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

    // Dribbble Loading sequence: spinning (1.5s) -> checkmark (0.75s) -> download page
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

  const versionLabel = versionInfo.latest_version ?? '1.0.25'
  const sizeLabel = (versionInfo.apk_size_mb ?? 59.0).toFixed(0)

  return (
    <div className="min-h-screen bg-[#0E1117] text-white font-sans relative overflow-hidden flex items-center justify-center p-5 selection:bg-[#7C8BFF] selection:text-white">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <DribbbleLoading key="home-loading" phase={loadingPhase} />
        ) : (
          <motion.main
            key="download-page"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-[390px] relative z-10 flex flex-col items-center"
          >
            {/* Top Header Row above Card */}
            <div className="w-full flex items-center justify-between px-2 mb-3.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/75">
                <ShieldCheck size={15} className="text-[#34D399]" />
                <span>Distribusi Resmi</span>
              </div>
              <span className="text-xs font-mono text-white/50">
                v{versionLabel}
              </span>
            </div>

            {/* Main Card Container */}
            <div className="w-full rounded-[28px] bg-[#161923] border border-white/[0.08] p-7 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
              {/* Subtle top inner glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-36 bg-[#7C8BFF]/10 blur-3xl pointer-events-none" />

              {/* App Icon */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shadow-lg mb-5 relative z-10">
                <img
                  src="/icons/icon-512.png"
                  alt="Logo JagaCuan"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#222738] border border-white/10 text-white/85 text-xs font-semibold mb-4 relative z-10">
                <Shield size={13} className="text-[#7C8BFF]" />
                <span>Android APK • v{versionLabel}</span>
              </div>

              {/* Title & Description */}
              <h1 className="text-[26px] font-extrabold tracking-tight text-white mb-2 relative z-10">
                JagaCuan
              </h1>
              <p className="text-[13px] text-[#94A3B8] leading-relaxed max-w-[290px] mb-6 relative z-10">
                Aplikasi pencatat tabungan pribadi &amp; nabung bareng teman.
                Unduh dan pasang aplikasi Android resminya di bawah ini.
              </p>

              {downloaded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full mb-4 px-3.5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 relative z-10"
                >
                  <CheckCircle2 size={15} />
                  <span>Mengunduh APK JagaCuan...</span>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="w-full space-y-3 relative z-10">
                <a
                  href={versionInfo.apk_url ?? '/download/jagacuan.apk'}
                  download="jagacuan.apk"
                  onClick={() => setDownloaded(true)}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#7C8BFF] hover:bg-[#8A98FF] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-[0_0_28px_rgba(124,139,255,0.4)] no-underline transition-all"
                >
                  <Download size={17} />
                  <span>Download APK ({sizeLabel} MB)</span>
                </a>

                <button
                  type="button"
                  onClick={handleOpenApp}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#1D212E] hover:bg-[#242938] active:scale-[0.98] border border-white/10 text-white/90 font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Smartphone size={15} className="text-white/65" />
                  <span>Sudah Pasang? Buka Aplikasi</span>
                </button>
              </div>

              {/* Divider & File Instruction */}
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

            {/* Bottom Copyright Footer */}
            <p className="mt-5 text-[11px] text-white/35 text-center">
              © 2026 JagaCuan • Keuangan Terarah &amp; Aman
            </p>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}
