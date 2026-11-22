'use client'

import { motion } from 'framer-motion'
import {
  Menu,
  CalendarDays,
  PieChart,
  Users,
  Search,
  Target,
  Plus,
  DollarSign,
  Check,
  Wallet,
} from 'lucide-react'

function IosStatusBar({ time = '16:42' }: { time?: string }) {
  return (
    <div className="relative z-20 px-5 pt-2.5 pb-1.5 flex items-center justify-between text-[10.5px] font-semibold tracking-tight text-white select-none">
      <span className="w-10">{time}</span>

      {/* Dynamic Island with realistic subtle camera lens */}
      <div className="w-[78px] h-[22px] rounded-full bg-black flex items-center justify-end pr-2 shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        <span className="w-[8px] h-[8px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#2b3a67,#090b14_70%)] ring-1 ring-white/10" />
      </div>

      {/* Real iOS cellular + wifi + battery micro SVGs */}
      <div className="w-12 flex items-center justify-end gap-1 text-white">
        <svg width="13" height="9" viewBox="0 0 13 9" fill="currentColor" aria-hidden="true">
          <rect x="0" y="6" width="2.2" height="3" rx="0.6" />
          <rect x="3.4" y="4.2" width="2.2" height="4.8" rx="0.6" />
          <rect x="6.8" y="2.2" width="2.2" height="6.8" rx="0.6" />
          <rect x="10.2" y="0" width="2.2" height="9" rx="0.6" />
        </svg>
        <svg width="12" height="9" viewBox="0 0 14 10" fill="none" aria-hidden="true">
          <path
            d="M1.2 3.4C4.4 0.7 9.6 0.7 12.8 3.4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M3.4 5.8C5.4 4.1 8.6 4.1 10.6 5.8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="7" cy="8.4" r="1.15" fill="currentColor" />
        </svg>
        <svg width="19" height="9" viewBox="0 0 22 11" fill="none" aria-hidden="true">
          <rect
            x="0.7"
            y="0.7"
            width="18.2"
            height="9.6"
            rx="2.6"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.1"
          />
          <rect x="2.2" y="2.2" width="13.5" height="6.6" rx="1.4" fill="currentColor" />
          <path
            d="M20.3 3.7V7.3"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}

function CircularRing({
  percent,
  color,
}: {
  percent: number
  color: string
}) {
  const radius = 14
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (percent / 100) * circumference

  return (
    <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
      <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="#2A2E3B"
          strokeWidth="2.6"
        />
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2.6"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute text-[8.5px] font-bold"
        style={{ color }}
      >
        {percent}%
      </span>
    </div>
  )
}

function RealisticIphoneFrame({
  children,
  tiltClass,
}: {
  children: React.ReactNode
  tiltClass: string
}) {
  return (
    <div
      className={`relative w-[256px] sm:w-[268px] transition-transform duration-300 hover:rotate-0 ${tiltClass}`}
    >
      {/* Left physical titanium buttons (Action + Volume Up + Volume Down) */}
      <span className="absolute -left-[2.5px] top-[92px] w-[2.5px] h-[22px] rounded-l-sm bg-gradient-to-b from-[#666C7D] via-[#3A3E4C] to-[#232630]" />
      <span className="absolute -left-[2.5px] top-[130px] w-[2.5px] h-[42px] rounded-l-sm bg-gradient-to-b from-[#666C7D] via-[#3A3E4C] to-[#232630]" />
      <span className="absolute -left-[2.5px] top-[182px] w-[2.5px] h-[42px] rounded-l-sm bg-gradient-to-b from-[#666C7D] via-[#3A3E4C] to-[#232630]" />

      {/* Right physical titanium power button */}
      <span className="absolute -right-[2.5px] top-[146px] w-[2.5px] h-[64px] rounded-r-sm bg-gradient-to-b from-[#666C7D] via-[#3A3E4C] to-[#232630]" />

      {/* Outer machined brushed dark titanium chassis */}
      <div className="rounded-[48px] p-[2.5px] bg-[linear-gradient(145deg,#5a6072_0%,#252833_22%,#171920_52%,#424758_82%,#1b1e26_100%)] shadow-[0_32px_70px_-15px_rgba(0,0,0,0.88),0_12px_24px_-8px_rgba(0,0,0,0.65)]">
        {/* Pure black OLED glass bezel */}
        <div className="rounded-[45.5px] bg-[#050507] p-[7.5px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
          {/* OLED Screen viewport */}
          <div className="relative rounded-[38px] overflow-hidden h-[524px] flex flex-col bg-[#16171B]">
            {children}

            {/* Subtle glass edge sheen (realistic reflection, zero neon glow) */}
            <div className="pointer-events-none absolute inset-0 rounded-[38px] bg-[linear-gradient(128deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_30%)] ring-1 ring-inset ring-white/[0.06]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HeroPhoneMockups() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-7 sm:gap-9 mb-12 sm:mb-14"
    >
      {/* DUMMY IPHONE 1: REAL JAGACUAN SPLASH SCREEN */}
      <RealisticIphoneFrame tiltClass="sm:-rotate-[2.5deg]">
        <div
          className="flex-1 flex flex-col justify-between relative"
          style={{
            background:
              'radial-gradient(circle at 50% 42%, #262C44 0%, #141724 55%, #0A0C13 100%)',
          }}
        >
          <IosStatusBar time="16:42" />

          {/* Center Mascot & Brand Typography (Exact SplashScreenView match) */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center -mt-3">
            <div className="relative flex flex-col items-center mb-6">
              <img
                src="/icons/pig-silhouette.png"
                alt="Maskot JagaCuan"
                width={108}
                height={93}
                className="w-[106px] h-auto brightness-0 invert select-none relative z-10"
              />
              {/* Soft ground oval shadow matching Flutter splash */}
              <div className="w-[96px] h-[10px] rounded-full bg-black/55 blur-[6px] -mt-1" />
            </div>

            <h2 className="text-[22px] font-extrabold tracking-[0.04em] text-white leading-none mb-2">
              JagaCuan
            </h2>
            <p className="text-[10.5px] font-medium text-[#94A3B8] tracking-[0.02em]">
              Nabung Cerdas &amp; Wujudkan Impian
            </p>
          </div>

          {/* Bottom Progress Pill & Status Text (Exact SplashScreenView match) */}
          <div className="px-8 pb-3 flex flex-col items-center">
            <div className="w-[116px] h-[3.5px] rounded-full bg-white/10 overflow-hidden mb-2.5">
              <div className="w-[86%] h-full rounded-full bg-gradient-to-r from-[#7C8BFF] to-[#10B981]" />
            </div>
            <span className="text-[9.5px] font-medium text-[#64748B] tracking-[0.02em] mb-5">
              Siap menabung!
            </span>
            <div className="w-24 h-[4px] rounded-full bg-white/25" />
          </div>
        </div>
      </RealisticIphoneFrame>

      {/* DUMMY IPHONE 2: REAL JAGACUAN BERANDA (HOME) */}
      <RealisticIphoneFrame tiltClass="sm:rotate-[2.5deg]">
        <div className="flex-1 flex flex-col bg-[#16171B] relative">
          <IosStatusBar time="16:42" />

          {/* Main Beranda Body */}
          <div className="px-3.5 pt-2 pb-2 flex-1 flex flex-col overflow-hidden">
            {/* App Bar */}
            <div className="flex items-center gap-2.5 mb-3">
              <Menu size={16} className="text-white/90" />
              <span className="text-[15px] font-extrabold tracking-tight text-white">
                Jagacuan
              </span>
            </div>

            {/* 3 Quick Action Pills (Exact match to Flutter Beranda) */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              <div className="py-1.5 px-1.5 rounded-full bg-[#1C1E26] border border-[#2B2E3B] flex items-center justify-center gap-1 text-[9.5px] font-semibold text-white/90">
                <CalendarDays size={11} className="text-[#F59E0B] shrink-0" />
                <span>Kalender</span>
              </div>
              <div className="py-1.5 px-1.5 rounded-full bg-[#1C1E26] border border-[#2B2E3B] flex items-center justify-center gap-1 text-[9.5px] font-semibold text-white/90">
                <PieChart size={11} className="text-[#10B981] shrink-0" />
                <span>Statistik</span>
              </div>
              <div className="py-1.5 px-1.5 rounded-full bg-[#1C1E26] border border-[#2B2E3B] flex items-center justify-center gap-1 text-[9.5px] font-semibold text-white/90">
                <Users size={11} className="text-[#7C8BFF] shrink-0" />
                <span>Ruang</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-3 py-2 rounded-full bg-[#1C1E26] border border-[#2B2E3B] flex items-center gap-2 text-[9.5px] text-[#7E8599] mb-3">
              <Search size={11} className="shrink-0" />
              <span>Cari target celengan...</span>
            </div>

            {/* Sort Filter Chips */}
            <div className="flex items-center gap-1.5 mb-3 overflow-hidden">
              <span className="px-3 py-1.5 rounded-full bg-[#7C8BFF] text-white text-[9.5px] font-bold shrink-0">
                Terbaru
              </span>
              <span className="px-2.5 py-1.5 rounded-full bg-[#1C1E26] border border-[#2B2E3B] text-[#9BA2B5] text-[9.5px] font-medium shrink-0">
                Progres Tertinggi
              </span>
              <span className="px-2.5 py-1.5 rounded-full bg-[#1C1E26] border border-[#2B2E3B] text-[#9BA2B5] text-[9.5px] font-medium shrink-0">
                Deadline
              </span>
            </div>

            {/* Target List Cards (Exact match to Waydroid screenshot) */}
            <div className="space-y-2.5 flex-1">
              {/* Card 1 */}
              <div className="rounded-[18px] bg-[#1D1F27] border border-[#2A2D39] p-3">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#262936] flex items-center justify-center text-[#10B981] shrink-0">
                      <Target size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">
                        Dana Darurat
                      </p>
                      <p className="text-[9px] text-[#9BA2B5] truncate">
                        Rp 6.800.000 / Rp 10.000.000
                      </p>
                    </div>
                  </div>
                  <CircularRing percent={68} color="#10B981" />
                </div>
                <div className="w-full h-[5px] rounded-full bg-[#292D3A] overflow-hidden">
                  <div className="w-[68%] h-full rounded-full bg-[#10B981]" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-[18px] bg-[#1D1F27] border border-[#2A2D39] p-3">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#262936] flex items-center justify-center text-[#7C8BFF] shrink-0">
                      <Users size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">
                        Trip Bandung (Nabar)
                      </p>
                      <p className="text-[9px] text-[#9BA2B5] truncate">
                        Rp 3.600.000 / Rp 5.000.000
                      </p>
                    </div>
                  </div>
                  <CircularRing percent={72} color="#10B981" />
                </div>
                <div className="w-full h-[5px] rounded-full bg-[#292D3A] overflow-hidden">
                  <div className="w-[72%] h-full rounded-full bg-[#10B981]" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="rounded-[18px] bg-[#1D1F27] border border-[#2A2D39] p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#262936] flex items-center justify-center text-[#9BA2B5] shrink-0">
                      <Wallet size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">
                        Upgrade Laptop
                      </p>
                      <p className="text-[9px] text-[#9BA2B5] truncate">
                        Rp 4.500.000 / Rp 12.000.000
                      </p>
                    </div>
                  </div>
                  <CircularRing percent={38} color="#10B981" />
                </div>
                <div className="w-full h-[5px] rounded-full bg-[#292D3A] overflow-hidden">
                  <div className="w-[38%] h-full rounded-full bg-[#10B981]" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating + FAB */}
          <div className="absolute right-3.5 bottom-[54px] w-10 h-10 rounded-full bg-[#7C8BFF] text-white flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.45)]">
            <Plus size={19} strokeWidth={2.5} />
          </div>

          {/* Bottom Navigation Bar (Berjalan / Selesai) */}
          <div className="px-6 pt-2 pb-1.5 border-t border-[#242733] bg-[#16171B] flex items-center justify-around">
            <div className="flex flex-col items-center gap-0.5 text-white">
              <DollarSign size={12} />
              <span className="text-[8.5px] font-semibold">Berjalan</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-[#6F768A]">
              <Check size={12} />
              <span className="text-[8.5px] font-medium">Selesai</span>
            </div>
          </div>
          <div className="pb-2.5 flex justify-center bg-[#16171B]">
            <div className="w-24 h-[4px] rounded-full bg-white/25" />
          </div>
        </div>
      </RealisticIphoneFrame>
    </motion.div>
  )
}
