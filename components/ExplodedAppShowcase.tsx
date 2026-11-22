'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Target,
  Users,
  Cloud,
  Link2,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Wallet,
  BellRing,
} from 'lucide-react'

type ModuleId = 'pribadi' | 'cloud' | 'nabar' | 'link'

const MODULE_META: Record<
  ModuleId,
  {
    label: string
    tag: string
    summary: string
    accent: string
  }
> = {
  pribadi: {
    label: 'Tabungan Pribadi',
    tag: 'Offline-First',
    summary:
      'Catat celengan harian dengan nominal target, deadline, dan progres real-time tanpa perlu koneksi internet.',
    accent: '#10B981',
  },
  cloud: {
    label: 'Backup Cloud',
    tag: 'Sinkronisasi Aman',
    summary:
      'Tautkan akun Google agar seluruh riwayat tabungan dan targetmu aman tercadang saat ganti perangkat.',
    accent: '#7C8BFF',
  },
  nabar: {
    label: 'Nabung Bareng (Nabar)',
    tag: 'Real-Time',
    summary:
      'Patungan bersama teman, pasangan, atau keluarga dalam satu ruang dengan catatan setoran tiap anggota yang transparan.',
    accent: '#7C8BFF',
  },
  link: {
    label: 'Link Undangan Nabar',
    tag: 'Deep Link 1-Klik',
    summary:
      'Bagikan tautan ruang lewat WhatsApp atau media sosial. Teman cukup klik link untuk langsung masuk ke ruang tabungan.',
    accent: '#10B981',
  },
}

export default function ExplodedAppShowcase() {
  const [selected, setSelected] = useState<ModuleId>('nabar')
  const exploded = true

  const activeMeta = MODULE_META[selected]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.18 }}
      className="mt-12 sm:mt-14 rounded-[28px] border border-[#2B2F3D] bg-[#161820] px-5 pt-5 pb-3.5 sm:px-7 sm:pt-7 sm:pb-4 overflow-hidden"
    >
      {/* EXPLODED CANVAS */}
      <div className="relative">
        {/* Subtle technical dot-grid background (clean drafting aesthetic, zero glow) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-35"
          style={{
            backgroundImage:
              'radial-gradient(#2F3548 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Desktop Connector Lines SVG (behind cards, visible on lg+) */}
        <svg
          className="pointer-events-none hidden lg:block absolute inset-0 w-full h-full z-0"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Top-Left connector: Tabungan Pribadi -> Center Phone */}
          <path
            d="M 315 125 L 385 125 L 420 185"
            fill="none"
            stroke={selected === 'pribadi' ? '#10B981' : '#30364A'}
            strokeWidth={selected === 'pribadi' ? '1.8' : '1.2'}
            strokeDasharray={selected === 'pribadi' ? '0' : '4 4'}
          />
          <circle
            cx="420"
            cy="185"
            r="3.5"
            fill={selected === 'pribadi' ? '#10B981' : '#454D66'}
          />

          {/* Bottom-Left connector: Backup Cloud -> Center Phone */}
          <path
            d="M 315 375 L 385 375 L 420 325"
            fill="none"
            stroke={selected === 'cloud' ? '#7C8BFF' : '#30364A'}
            strokeWidth={selected === 'cloud' ? '1.8' : '1.2'}
            strokeDasharray={selected === 'cloud' ? '0' : '4 4'}
          />
          <circle
            cx="420"
            cy="325"
            r="3.5"
            fill={selected === 'cloud' ? '#7C8BFF' : '#454D66'}
          />

          {/* Top-Right connector: Nabung Bareng -> Center Phone */}
          <path
            d="M 685 125 L 615 125 L 580 185"
            fill="none"
            stroke={selected === 'nabar' ? '#7C8BFF' : '#30364A'}
            strokeWidth={selected === 'nabar' ? '1.8' : '1.2'}
            strokeDasharray={selected === 'nabar' ? '0' : '4 4'}
          />
          <circle
            cx="580"
            cy="185"
            r="3.5"
            fill={selected === 'nabar' ? '#7C8BFF' : '#454D66'}
          />

          {/* Bottom-Right connector: Link Nabar -> Center Phone */}
          <path
            d="M 685 375 L 615 375 L 580 325"
            fill="none"
            stroke={selected === 'link' ? '#10B981' : '#30364A'}
            strokeWidth={selected === 'link' ? '1.8' : '1.2'}
            strokeDasharray={selected === 'link' ? '0' : '4 4'}
          />
          <circle
            cx="580"
            cy="325"
            r="3.5"
            fill={selected === 'link' ? '#10B981' : '#454D66'}
          />
        </svg>

        {/* 3-Column Exploded Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-4 items-center py-3 sm:py-5">
          {/* LEFT COLUMN: Tabungan Pribadi + Backup Cloud */}
          <div
            className={`lg:col-span-4 flex flex-col gap-5 transition-transform duration-300 ${
              exploded ? 'lg:-translate-x-2' : 'lg:translate-x-2'
            }`}
          >
            {/* EXPLODED CARD 1: TABUNGAN PRIBADI */}
            <button
              type="button"
              onClick={() => setSelected('pribadi')}
              onMouseEnter={() => setSelected('pribadi')}
              className={`text-left rounded-2xl border p-4 transition-all cursor-pointer shadow-[0_18px_40px_rgba(0,0,0,0.4)] ${
                selected === 'pribadi'
                  ? 'bg-[#1D212D] border-[#10B981]'
                  : 'bg-[#1A1D26] border-[#2C3040] hover:border-[#3E455C]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                    <Target size={14} />
                  </div>
                  <span className="text-xs font-bold text-white">
                    Tabungan Pribadi
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#12141C] border border-[#2A2E3D] text-[#10B981]">
                  Offline-First
                </span>
              </div>

              <div className="rounded-xl bg-[#13151D] border border-[#262A38] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-white">
                    Dana Darurat 2026
                  </span>
                  <span className="text-[11px] font-extrabold text-[#10B981]">
                    68%
                  </span>
                </div>
                <p className="text-[10px] text-[#9BA2B5] mb-2">
                  Rp 6.800.000 / Rp 10.000.000
                </p>
                <div className="w-full h-1.5 rounded-full bg-[#262A37] overflow-hidden">
                  <div className="w-[68%] h-full rounded-full bg-[#10B981]" />
                </div>
              </div>

              <p className="text-[10.5px] text-[#8D95AB] mt-2.5 flex items-center gap-1.5">
                <Wallet size={11} className="text-[#10B981] shrink-0" />
                <span>Simpan lokal instan, bisa dipakai tanpa login</span>
              </p>
            </button>

            {/* EXPLODED CARD 2: BACKUP CLOUD */}
            <button
              type="button"
              onClick={() => setSelected('cloud')}
              onMouseEnter={() => setSelected('cloud')}
              className={`text-left rounded-2xl border p-4 transition-all cursor-pointer shadow-[0_18px_40px_rgba(0,0,0,0.4)] ${
                selected === 'cloud'
                  ? 'bg-[#1D212D] border-[#7C8BFF]'
                  : 'bg-[#1A1D26] border-[#2C3040] hover:border-[#3E455C]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#7C8BFF]/15 text-[#7C8BFF] flex items-center justify-center shrink-0">
                    <Cloud size={14} />
                  </div>
                  <span className="text-xs font-bold text-white">
                    Backup Cloud
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#12141C] border border-[#2A2E3D] text-[#7C8BFF]">
                  Auto Sync
                </span>
              </div>

              <div className="rounded-xl bg-[#13151D] border border-[#262A38] p-3 space-y-2">
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#10B981]" />
                    Akun Google Tertaut
                  </span>
                  <span className="text-[#7E869B] font-mono text-[9.5px]">
                    2 mnt lalu
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#9BA2B5]">
                  <span>4 target &amp; 38 transaksi</span>
                  <span className="text-[#10B981] font-semibold">Aman</span>
                </div>
              </div>

              <p className="text-[10.5px] text-[#8D95AB] mt-2.5 flex items-center gap-1.5">
                <ShieldCheck size={11} className="text-[#7C8BFF] shrink-0" />
                <span>Pulihkan semua data otomatis saat ganti HP</span>
              </p>
            </button>
          </div>

          {/* CENTER COLUMN: CORE APP LAYERED DEVICE */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center py-2">
            <div className="relative">
              {/* Subtle stacked depth layers behind core phone when Exploded */}
              <div
                className={`hidden sm:block absolute inset-0 rounded-[36px] border border-[#2C3142] bg-[#141720] transition-transform duration-300 ${
                  exploded
                    ? 'translate-x-3 translate-y-3 opacity-80'
                    : 'translate-x-0 translate-y-0 opacity-0'
                }`}
              />
              <div
                className={`hidden sm:block absolute inset-0 rounded-[36px] border border-[#262B3A] bg-[#11131B] transition-transform duration-300 ${
                  exploded
                    ? '-translate-x-3 -translate-y-2 opacity-70'
                    : 'translate-x-0 translate-y-0 opacity-0'
                }`}
              />

              {/* Core Device Chassis */}
              <div className="relative z-10 w-[224px] rounded-[36px] p-[2px] bg-[linear-gradient(145deg,#5a6072_0%,#252833_28%,#181a22_60%,#3f4455_100%)] shadow-[0_28px_60px_rgba(0,0,0,0.75)]">
                <div className="rounded-[34px] bg-[#070709] p-[6px]">
                  <div className="rounded-[28px] bg-[#16171B] overflow-hidden border border-[#272B38] p-3.5 flex flex-col justify-between h-[360px]">
                    {/* Top Dynamic Island */}
                    <div>
                      <div className="flex justify-center mb-3">
                        <div className="w-16 h-4 rounded-full bg-black" />
                      </div>

                      {/* Brand Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <img
                            src="/icons/jagacuan-brand.png"
                            alt="JagaCuan"
                            width={22}
                            height={22}
                            className="w-5.5 h-5.5 rounded-md object-cover block"
                          />
                          <span className="text-xs font-extrabold text-white">
                            JagaCuan Core
                          </span>
                        </div>
                        <span className="text-[9px] font-semibold text-[#10B981]">
                          Online
                        </span>
                      </div>

                      {/* Interactive Layer Highlight inside Phone */}
                      <div className="rounded-xl bg-[#1D202A] border border-[#2C3040] p-3 mb-2.5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9.5px] font-semibold text-[#9BA2B5]">
                            Lapisan Aktif
                          </span>
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#14161E]"
                            style={{ color: activeMeta.accent }}
                          >
                            {activeMeta.tag}
                          </span>
                        </div>
                        <p className="text-xs font-extrabold text-white mb-1">
                          {activeMeta.label}
                        </p>
                        <p className="text-[9.5px] leading-relaxed text-[#9BA2B5]">
                          {activeMeta.summary}
                        </p>
                      </div>

                      {/* Module Quick Status Rows */}
                      <div className="space-y-1.5">
                        {(
                          [
                            { id: 'pribadi', name: 'Tabungan Pribadi', dot: '#10B981' },
                            { id: 'nabar', name: 'Nabung Bareng', dot: '#7C8BFF' },
                            { id: 'cloud', name: 'Backup Cloud', dot: '#7C8BFF' },
                            { id: 'link', name: 'Link Undangan', dot: '#10B981' },
                          ] as const
                        ).map((row) => {
                          const isCurrent = selected === row.id
                          return (
                            <button
                              key={row.id}
                              type="button"
                              onClick={() => setSelected(row.id)}
                              className={`w-full px-2.5 py-1.5 rounded-lg border flex items-center justify-between text-[10px] font-semibold transition-colors cursor-pointer ${
                                isCurrent
                                  ? 'bg-[#232736] border-[#3F4660] text-white'
                                  : 'bg-[#191B23] border-[#252834] text-[#8D95AB] hover:text-white'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: row.dot }}
                                />
                                {row.name}
                              </span>
                              <span className="text-[9px] opacity-70">
                                {isCurrent ? 'Aktif' : 'Lihat'}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Bottom Reminder Strip */}
                    <div className="pt-2 border-t border-[#242836] flex items-center justify-between text-[9px] text-[#8D95AB]">
                      <span className="inline-flex items-center gap-1">
                        <BellRing size={10} className="text-[#7C8BFF]" />
                        Pengingat 12:00
                      </span>
                      <span className="font-mono text-white/70">v1.0.32</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Nabung Bareng (Nabar) + Link Undangan Nabar */}
          <div
            className={`lg:col-span-4 flex flex-col gap-5 transition-transform duration-300 ${
              exploded ? 'lg:translate-x-2' : 'lg:-translate-x-2'
            }`}
          >
            {/* EXPLODED CARD 3: NABUNG BARENG (NABAR) */}
            <button
              type="button"
              onClick={() => setSelected('nabar')}
              onMouseEnter={() => setSelected('nabar')}
              className={`text-left rounded-2xl border p-4 transition-all cursor-pointer shadow-[0_18px_40px_rgba(0,0,0,0.4)] ${
                selected === 'nabar'
                  ? 'bg-[#1D212D] border-[#7C8BFF]'
                  : 'bg-[#1A1D26] border-[#2C3040] hover:border-[#3E455C]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#7C8BFF]/15 text-[#7C8BFF] flex items-center justify-center shrink-0">
                    <Users size={14} />
                  </div>
                  <span className="text-xs font-bold text-white">
                    Nabung Bareng (Nabar)
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#12141C] border border-[#2A2E3D] text-[#7C8BFF]">
                  4 Anggota
                </span>
              </div>

              <div className="rounded-xl bg-[#13151D] border border-[#262A38] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-white">
                    Trip Bandung Bareng
                  </span>
                  <span className="text-[11px] font-extrabold text-[#10B981]">
                    72%
                  </span>
                </div>
                <p className="text-[10px] text-[#9BA2B5] mb-2.5">
                  Rp 3.600.000 / Rp 5.000.000
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {['R', 'D', 'B', 'S'].map((initial, idx) => (
                      <span
                        key={initial}
                        className={`w-6 h-6 rounded-full border border-[#13151D] text-[9.5px] font-bold flex items-center justify-center ${
                          idx % 2 === 0
                            ? 'bg-[#7C8BFF] text-[#0F1118]'
                            : 'bg-[#10B981] text-[#0F1118]'
                        }`}
                      >
                        {initial}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-[#10B981]">
                    Transparan &amp; Live
                  </span>
                </div>
              </div>

              <p className="text-[10.5px] text-[#8D95AB] mt-2.5 flex items-center gap-1.5">
                <Users size={11} className="text-[#7C8BFF] shrink-0" />
                <span>Pantau kontribusi tiap anggota secara langsung</span>
              </p>
            </button>

            {/* EXPLODED CARD 4: LINK UNDANGAN NABAR */}
            <button
              type="button"
              onClick={() => setSelected('link')}
              onMouseEnter={() => setSelected('link')}
              className={`text-left rounded-2xl border p-4 transition-all cursor-pointer shadow-[0_18px_40px_rgba(0,0,0,0.4)] ${
                selected === 'link'
                  ? 'bg-[#1D212D] border-[#10B981]'
                  : 'bg-[#1A1D26] border-[#2C3040] hover:border-[#3E455C]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                    <Link2 size={14} />
                  </div>
                  <span className="text-xs font-bold text-white">
                    Link Undangan Nabar
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#12141C] border border-[#2A2E3D] text-[#10B981]">
                  1-Klik Gabung
                </span>
              </div>

              <div className="rounded-xl bg-[#13151D] border border-[#262A38] p-3 space-y-2">
                <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-[#1A1D28] border border-[#2B3042]">
                  <span className="font-mono text-[10px] text-[#C5CCDF] truncate">
                    jagacuan-app.vercel.app/room/trip-bdg
                  </span>
                  <Copy size={11} className="text-[#7C8BFF] shrink-0" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#9BA2B5]">
                  <span>Otomatis buka di aplikasi</span>
                  <span className="text-[#10B981] font-semibold">Aktif</span>
                </div>
              </div>

              <p className="text-[10.5px] text-[#8D95AB] mt-2.5 flex items-center gap-1.5">
                <Link2 size={11} className="text-[#10B981] shrink-0" />
                <span>Tinggal kirim ke WhatsApp, langsung gabung ruang</span>
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Brand Logo tucked snug at the bottom */}
      <div className="mt-2 pt-2.5 border-t border-[#232734] flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg overflow-hidden border border-[#32374A] shrink-0">
          <img
            src="/icons/jagacuan-brand.png"
            alt="Logo JagaCuan"
            width={24}
            height={24}
            className="w-full h-full object-cover block"
          />
        </div>
        <span className="text-xs font-bold text-white/85">JagaCuan</span>
      </div>
    </motion.div>
  )
}
