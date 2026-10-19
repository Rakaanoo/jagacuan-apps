'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  DollarSign,
  Check,
  Plus,
  Users,
  Calendar as CalendarIcon,
  PieChart,
  Search,
  Download,
  X,
  Target,
} from 'lucide-react'
import { useAppStore, formatRupiah, TargetItem } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'

import SidebarDrawer from '@/components/SidebarDrawer'
import SelectTargetTypeModal from '@/components/SelectTargetTypeModal'
import CreateTargetModal from '@/components/CreateTargetModal'
import TargetDetailModal from '@/components/TargetDetailModal'
import NabarRoomModal from '@/components/NabarRoomModal'
import BackupRestoreModal from '@/components/BackupRestoreModal'
import CalendarModal from '@/components/CalendarModal'
import StatisticsModal from '@/components/StatisticsModal'
import ToastNotification from '@/components/ToastNotification'

type TabType = 'berjalan' | 'selesai'
type SortType = 'terbaru' | 'progres' | 'deadline'

export default function Home() {
  const { targets, theme } = useAppStore()
  const { t } = useTranslation()

  const isDark = theme === 'dark'

  useEffect(() => {
    const bg = isDark ? '#16171B' : '#FAF7F2'
    document.documentElement.style.setProperty('--app-bg', bg)
  }, [isDark])

  // Supabase Auth Code Callback (OAuth Google)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      if (code) {
        import('@/lib/supabase/client').then(({ createClient }) => {
          const supabase = createClient()
          supabase.auth.exchangeCodeForSession(code).then(() => {
            window.history.replaceState({}, document.title, window.location.pathname)
          })
        })
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.href = `io.supabase.jagacuan://login-callback?code=${code}`
        }
      }
    }
  }, [])

  const [activeTab, setActiveTab] = useState<TabType>('berjalan')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortType>('terbaru')

  // Modals state
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSelectTypeModal, setShowSelectTypeModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTargetType, setSelectedTargetType] = useState<'nabung' | 'berkala'>('nabung')
  const [activeDetailTarget, setActiveDetailTarget] = useState<TargetItem | null>(null)
  const [showNabarModal, setShowNabarModal] = useState(false)
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)

  const activeTargets = targets.filter((t) => !t.isFinished)
  const finishedTargets = targets.filter((t) => t.isFinished)

  let rawList = activeTab === 'berjalan' ? activeTargets : finishedTargets

  // Filter by search query
  if (searchQuery.trim()) {
    rawList = rawList.filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Sort list
  const displayedList = [...rawList].sort((a, b) => {
    if (sortBy === 'progres') {
      const pctA = a.targetAmount > 0 ? a.currentAmount / a.targetAmount : 0
      const pctB = b.targetAmount > 0 ? b.currentAmount / b.targetAmount : 0
      return pctB - pctA
    }
    if (sortBy === 'deadline') {
      if (!a.deadlineDate) return 1
      if (!b.deadlineDate) return -1
      return new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime()
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const handleSelectType = (type: 'nabung' | 'berkala' | 'nabar') => {
    setShowSelectTypeModal(false)
    if (type === 'nabar') {
      setShowNabarModal(true)
    } else {
      setSelectedTargetType(type)
      setShowCreateModal(true)
    }
  }

  // Theme-aware color palette
  const bgColor = isDark ? '#16171B' : '#FAF7F2'
  const cardBg = isDark ? '#23242A' : '#FAF6EF'
  const cardBorder = isDark ? '#333644' : '#E0D5C3'
  const textPrimary = isDark ? '#FFFFFF' : '#2C2418'
  const textMuted = isDark ? '#A0A5B5' : '#7A6F60'
  const inputBg = isDark ? '#1C1D22' : '#EFEADF'

  return (
    <div className="min-h-screen bg-[#0B0C10] flex justify-center text-white selection:bg-[#7C8BFF] selection:text-white">
      {/* Toast Notification Container */}
      <ToastNotification />

      {/* Main Mobile App Frame */}
      <div
        className="w-full max-w-md min-h-screen relative flex flex-col justify-between shadow-2xl overflow-x-hidden border-x border-white/5"
        style={{
          backgroundColor: bgColor,
          color: textPrimary,
        }}
      >
        {/* Top Header Bar */}
        <header
          className="sticky top-0 z-30 px-4 pt-3 pb-3 border-b backdrop-blur-md"
          style={{
            backgroundColor: isDark ? 'rgba(22, 23, 27, 0.95)' : 'rgba(250, 247, 242, 0.95)',
            borderColor: cardBorder,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 rounded-xl transition-colors hover:bg-white/10"
                style={{ color: textPrimary }}
                aria-label="Menu"
              >
                <Menu size={22} />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight" style={{ color: textPrimary }}>
                  Jagacuan
                </span>
              </div>
            </div>

            {/* Quick Action Buttons & Unduh APK */}
            <div className="flex items-center gap-1.5">
              <a
                href="/download/jagacuan.apk"
                download="jagacuan.apk"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#7C8BFF] to-[#6366F1] hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-[#7C8BFF]/25 no-underline"
                title="Unduh APK Resmi"
              >
                <Download size={13} />
                <span className="hidden sm:inline">APK</span>
              </a>

              <button
                onClick={() => setShowCalendarModal(true)}
                className="p-2 rounded-xl transition-colors hover:bg-white/10"
                style={{ color: '#E67E22' }}
                title={t('page.calendar')}
              >
                <CalendarIcon size={20} />
              </button>

              <button
                onClick={() => setShowStatsModal(true)}
                className="p-2 rounded-xl transition-colors hover:bg-white/10"
                style={{ color: '#22C55E' }}
                title={t('page.statistics')}
              >
                <PieChart size={20} />
              </button>

              <button
                onClick={() => setShowNabarModal(true)}
                className="p-2 rounded-xl transition-colors hover:bg-white/10"
                style={{ color: '#818CF8' }}
                title={t('page.rooms')}
              >
                <Users size={20} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3 relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: textMuted }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('page.search_placeholder') || 'Cari target tabungan...'}
              className="w-full pl-10 pr-9 py-2 rounded-xl text-xs font-medium outline-none transition-all border"
              style={{
                backgroundColor: inputBg,
                borderColor: cardBorder,
                color: textPrimary,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Chips */}
          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              onClick={() => setSortBy('terbaru')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                sortBy === 'terbaru'
                  ? 'bg-[#7C8BFF] text-white border-transparent shadow-sm'
                  : 'border-white/10 hover:border-white/20'
              }`}
              style={{
                backgroundColor: sortBy === 'terbaru' ? '#7C8BFF' : inputBg,
                color: sortBy === 'terbaru' ? '#FFFFFF' : textMuted,
                borderColor: sortBy === 'terbaru' ? 'transparent' : cardBorder,
              }}
            >
              {t('page.sort_latest')}
            </button>
            <button
              onClick={() => setSortBy('progres')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                sortBy === 'progres'
                  ? 'bg-[#10B981] text-white border-transparent shadow-sm'
                  : 'border-white/10 hover:border-white/20'
              }`}
              style={{
                backgroundColor: sortBy === 'progres' ? '#10B981' : inputBg,
                color: sortBy === 'progres' ? '#FFFFFF' : textMuted,
                borderColor: sortBy === 'progres' ? 'transparent' : cardBorder,
              }}
            >
              {t('page.sort_progress')}
            </button>
            <button
              onClick={() => setSortBy('deadline')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                sortBy === 'deadline'
                  ? 'bg-[#DC2626] text-white border-transparent shadow-sm'
                  : 'border-white/10 hover:border-white/20'
              }`}
              style={{
                backgroundColor: sortBy === 'deadline' ? '#DC2626' : inputBg,
                color: sortBy === 'deadline' ? '#FFFFFF' : textMuted,
                borderColor: sortBy === 'deadline' ? 'transparent' : cardBorder,
              }}
            >
              {t('page.sort_deadline')}
            </button>
          </div>
        </header>

        {/* Target List Container */}
        <main className="flex-1 px-4 py-3 pb-28 overflow-y-auto">
          {displayedList.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#7C8BFF]">
                <Target size={32} />
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: textPrimary }}>
                {activeTab === 'berjalan' ? t('page.no_active') : t('page.no_finished')}
              </h3>
              <p
                className="text-xs max-w-xs leading-relaxed"
                style={{ color: textMuted }}
                dangerouslySetInnerHTML={{
                  __html:
                    activeTab === 'berjalan'
                      ? t('page.no_active_hint') || 'Belum ada celengan aktif. Tekan tombol (+) untuk membuat baru.'
                      : 'Belum ada tabungan yang selesai.',
                }}
              />
            </div>
          ) : (
            /* Card List */
            <div className="space-y-3">
              {displayedList.map((target) => {
                const pct =
                  target.targetAmount > 0
                    ? Math.min(100, Math.round((target.currentAmount / target.targetAmount) * 100))
                    : 0

                return (
                  <motion.div
                    key={target.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      if (target.type === 'nabar') {
                        setShowNabarModal(true)
                      } else {
                        setActiveDetailTarget(target)
                      }
                    }}
                    className="p-3.5 rounded-2xl border transition-all cursor-pointer shadow-md flex items-center gap-3.5"
                    style={{
                      backgroundColor: cardBg,
                      borderColor: cardBorder,
                    }}
                  >
                    {/* Cover or Icon */}
                    <div
                      className="w-13 h-13 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5"
                      style={{ backgroundColor: inputBg }}
                    >
                      {target.coverImage ? (
                        <img
                          src={target.coverImage}
                          alt={target.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <DollarSign size={22} style={{ color: '#7C8BFF' }} />
                      )}
                    </div>

                    {/* Target Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className="font-bold text-sm truncate" style={{ color: textPrimary }}>
                          {target.title}
                        </h4>
                        {target.type === 'nabar' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#818CF8]/15 text-[#818CF8] border border-[#818CF8]/25">
                            Nabar
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold" style={{ color: textMuted }}>
                        {formatRupiah(target.currentAmount)}{' '}
                        <span className="text-white/40 font-normal">/ {formatRupiah(target.targetAmount)}</span>
                      </p>

                      {/* Mini Progress Bar */}
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: pct >= 100 ? '#10B981' : '#7C8BFF',
                          }}
                        />
                      </div>
                    </div>

                    {/* Percentage */}
                    <div className="text-right flex-shrink-0">
                      <span
                        className="text-sm font-extrabold"
                        style={{ color: pct >= 100 ? '#10B981' : textPrimary }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </main>

        {/* Floating Action Button (+) */}
        <div className="fixed bottom-22 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none px-5 z-40 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowSelectTypeModal(true)}
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#7C8BFF] to-[#6366F1] text-white flex items-center justify-center shadow-xl shadow-[#7C8BFF]/30 pointer-events-auto cursor-pointer border border-white/20"
            aria-label="Tambah Target"
          >
            <Plus size={26} />
          </motion.button>
        </div>

        {/* Fixed Bottom Navigation Bar */}
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 px-4 py-2 border-t backdrop-blur-xl flex items-center justify-around"
          style={{
            backgroundColor: isDark ? 'rgba(22, 23, 27, 0.96)' : 'rgba(250, 247, 242, 0.96)',
            borderColor: cardBorder,
          }}
        >
          {/* Tab 1: Berjalan */}
          <button
            onClick={() => setActiveTab('berjalan')}
            className={`flex-1 py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'berjalan'
                ? 'font-bold'
                : 'opacity-65 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'berjalan' ? (isDark ? '#23242A' : '#EFEADF') : 'transparent',
              color: activeTab === 'berjalan' ? '#7C8BFF' : textMuted,
            }}
          >
            <DollarSign size={20} />
            <span className="text-[11px] tracking-wide">
              {t('page.tab_active')} ({activeTargets.length})
            </span>
          </button>

          {/* Tab 2: Selesai */}
          <button
            onClick={() => setActiveTab('selesai')}
            className={`flex-1 py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'selesai'
                ? 'font-bold'
                : 'opacity-65 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'selesai' ? (isDark ? '#23242A' : '#EFEADF') : 'transparent',
              color: activeTab === 'selesai' ? '#10B981' : textMuted,
            }}
          >
            <Check size={20} />
            <span className="text-[11px] tracking-wide">
              {t('page.tab_finished')} ({finishedTargets.length})
            </span>
          </button>
        </nav>

        {/* Modals & Drawers */}
        <SidebarDrawer
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          onOpenBackup={() => setShowBackupModal(true)}
        />

        <SelectTargetTypeModal
          isOpen={showSelectTypeModal}
          onClose={() => setShowSelectTypeModal(false)}
          onSelectType={handleSelectType}
        />

        <CreateTargetModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          targetType={selectedTargetType}
        />

        <TargetDetailModal
          target={activeDetailTarget}
          onClose={() => setActiveDetailTarget(null)}
        />

        <NabarRoomModal
          isOpen={showNabarModal}
          onClose={() => setShowNabarModal(false)}
        />

        <BackupRestoreModal
          isOpen={showBackupModal}
          onClose={() => setShowBackupModal(false)}
        />

        <CalendarModal
          isOpen={showCalendarModal}
          onClose={() => setShowCalendarModal(false)}
          onOpenCreate={() => {
            setShowCalendarModal(false)
            setShowSelectTypeModal(true)
          }}
        />

        <StatisticsModal
          isOpen={showStatsModal}
          onClose={() => setShowStatsModal(false)}
        />
      </div>
    </div>
  )
}