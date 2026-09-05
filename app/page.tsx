"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, DollarSign, Check, Plus, Users, Calendar as CalendarIcon, PieChart, Search } from "lucide-react"
import { useAppStore, formatRupiah, TargetItem } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

import SidebarDrawer from "@/components/SidebarDrawer"
import SelectTargetTypeModal from "@/components/SelectTargetTypeModal"
import CreateTargetModal from "@/components/CreateTargetModal"
import TargetDetailModal from "@/components/TargetDetailModal"
import NabarRoomModal from "@/components/NabarRoomModal"
import BackupRestoreModal from "@/components/BackupRestoreModal"
import CalendarModal from "@/components/CalendarModal"
import StatisticsModal from "@/components/StatisticsModal"
import ToastNotification from "@/components/ToastNotification"

type TabType = 'berjalan' | 'selesai'
type SortType = 'terbaru' | 'progres' | 'deadline'

export default function Home() {
  const { targets, theme, language, currency } = useAppStore()
  const { t } = useTranslation()

  const isDark = theme === 'dark'

  useEffect(() => {
    const bg = isDark ? '--app-dark-bg' : '--app-cream-bg'
    document.documentElement.style.setProperty('--app-bg', bg)
  }, [isDark])

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
    rawList = rawList.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  // Sort list
  const displayedList = [...rawList].sort((a, b) => {
    if (sortBy === 'progres') {
      const pctA = a.currentAmount / a.targetAmount
      const pctB = b.currentAmount / b.targetAmount
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

  return (
    <main
      className="bg-figma min-h-screen"
      style={{
        paddingBottom: '90px',
        color: isDark ? '--app-dark-text' : '--app-cream-text',
        transition: 'background-color 0.25s ease, color 0.25s ease',
      }}
    >
      <ToastNotification />

      {/* Background Decorative Blobs */}
      <div
        className="absolute top-0 right-0 w-24 h-24 -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{
          background: isDark ? 'rgba(35, 36, 52, 0.3)' : 'rgba(250, 247, 242, 0.5)',
          borderRadius: '50%',
        }}
      />
      <div
        className="absolute bottom-left w-20 h-20 -translate-y-1/2 opacity-15"
        style={{
          background: isDark ? 'rgba(35, 36, 52, 0.3)' : 'rgba(250, 247, 242, 0.5)',
          borderRadius: '50%',
        }}
      />

      {/* Top Header Bar - Figma style */}
      <header className="phone-status-bar bg-panel-bg border-b border-panel-border flex items-center justify-between px-4 py-3 z-10">
        <button
          onClick={() => setShowSidebar(true)}
          className="p-2 rounded-md hover:bg-opacity-20 transition-colors"
          style={{ flexShrink: 0 }}
        >
          <Menu size={24} color={isDark ? 'white' : '#2C2418'} />
        </button>

        <h1 className="text-xl font-bold tracking-tight" style={{ margin: 0, color: 'var(--app-cream-text)' }}>
          Jagacuan
        </h1>
      </header>

      {/* Quick Action Bar */}
      <div className="px-4 pb-2 flex items-end justify-end gap-2" style={{ position: 'relative', zIndex: 10 }}>
        <button
          onClick={() => setShowCalendarModal(true)}
          className="relative inline-flex items-center gap-2 rounded-lg border border-panel-border px-3 py-1.5 text-sm font-medium transition-colors"
          style={{ background: isDark ? '#23242A' : '#FAF6EF', color: isDark ? 'white' : '#2C2418' }}
        >
          <CalendarIcon size={12} color="#D97706" />
          <span>{t('page.calendar')}</span>
        </button>

        <button
          onClick={() => setShowStatsModal(true)}
          className="relative inline-flex items-center gap-2 rounded-lg border border-panel-border px-3 py-1.5 text-sm font-medium transition-colors"
          style={{ background: isDark ? '#23242A' : '#FAF6EF', color: isDark ? 'white' : '#2C2418' }}
        >
          <PieChart size={12} color="#16A34A" />
          <span>{t('page.statistics')}</span>
        </button>

        <button
          onClick={() => setShowNabarModal(true)}
          className="relative inline-flex items-center gap-2 rounded-lg border border-panel-border px-3 py-1.5 text-sm font-medium transition-colors"
          style={{ background: isDark ? '#23242A' : '#FAF6EF', color: isDark ? 'white' : '#2C2418' }}
        >
          <Users size={12} color="#7C8BFF" />
          <span>{t('page.rooms')}</span>
        </button>
      </div>

      {/* Search & Sort */}
      {targets.length > 0 && (
        <div className="px-4 pb-2" style={{ position: 'relative', zIndex: 10 }}>
          <div className="rounded-2xl border bg-[--app-cream-card] px-3 py-2 flex items-center gap-2 transition-colors hover:bg-opacity-50" style={{ color: isDark ? 'var(--app-dark-text)' : 'var(--app-cream-text)' }}>
            <Search size={14} color={isDark ? '#A0A5B5' : '#7A6F60'} />
            <input
              type="text"
              placeholder={t('page.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', background: 'none', border: 'none', color: isDark ? 'white' : '#2C2418', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>

          <div className="mt-1 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSortBy('terbaru')}
              className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
              style={{ background: sortBy === 'terbaru' ? '--app-dark-accent' : isDark ? '#23242A' : '#EFEADF', color: sortBy === 'terbaru' ? 'white' : isDark ? '#A0A5B5' : '#2C2418', border: 'none' }}
            >
              {t('page.sort_newest')}
            </button>
            <button
              onClick={() => setSortBy('progres')}
              className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
              style={{ background: sortBy === 'progres' ? '--app-accent-green' : isDark ? '#23242A' : '#EFEADF', color: sortBy === 'progres' ? 'white' : isDark ? '#A0A5B5' : '#2C2418', border: 'none' }}
            >
              {t('page.sort_progress')}
            </button>
            <button
              onClick={() => setSortBy('deadline')}
              className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
              style={{ background: sortBy === 'deadline' ? '--app-accent-red' : isDark ? '#23242A' : '#EFEADF', color: sortBy === 'deadline' ? 'white' : isDark ? '#A0A5B5' : '#2C2418', border: 'none' }}
            >
              {t('page.sort_deadline')}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 pb-4" style={{ position: "relative", zIndex: 10 }}>
        {displayedList.length === 0 ? (
          activeTab === 'berjalan' ? (
            <div className="empty-state flex-1 flex flex-col items-center justify-center py-24 text-center"
                style={{ color: isDark ? 'var(--app-dark-text)' : 'var(--app-cream-text)' }}>
              <div className="mb-4"
                  style={{ height: '44px', width: 'auto', objectFit: 'contain', marginBottom: '24px' }}>
                <img
                  src={isDark ? '/jagacuan-logo-dark.png' : '/jagacuan-logo-light.png'}
                  alt="Jagacuan"
                />
              </div>
              <h3 className="text-lg font-bold mb-2"
                  style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'currentColor' }}>
                {t('page.no_active')}
              </h3>
              <p className="text-sm"
                  style={{ fontSize: '14px', color: isDark ? '#A0A5B5' : '#7A6F60', maxWidth: '240px', lineHeight: '1.5' }}
                  dangerouslySetInnerHTML={{ __html: t('page.no_active_hint') }} />
            </div>
          ) : (
            <div className="text-center py-24"
                style={{ color: isDark ? '#A0A5B5' : '#7A6F60' }}>
              <p style={{ fontSize: '15px', fontWeight: '600' }}>{t('page.no_finished')}</p>
            </div>
          )
        ) : (
          <div className="space-y-2"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayedList.map((target) => {
              const pct = Math.min(100, Math.round((target.currentAmount / target.targetAmount) * 100))

              return (
                <div
                  key={target.id}
                  className="goal-card-ui flex items-start gap-2 rounded-2xl border border-panel-border p-4 cursor-pointer transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                  style={{
                    background: isDark ? '--app-dark-card' : '--app-cream-card',
                    borderColor: isDark ? '--app-dark-border' : '--app-cream-border',
                  }}
                >
                  <div className="flex items-start gap-3 w-14 h-14 rounded-xl flex-shrink-0"
                      style={{
                    background: isDark ? '--app-dark-input' : '--app-cream-card',
                    overflow: 'hidden',
                  }}>
                    {target.coverImage ? (
                      <img
                        src={target.coverImage}
                        alt={target.title}
                        className="w-full h-full object-cover"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <DollarSign size={24} color={isDark ? '#8C9AFF' : '#2C2418'} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0"
                      style={{ flex: 1 }}>
                    <h4 className="font-bold truncate"
                        style={{ fontSize: '15px', fontWeight: '700', marginBottom: '2px', color: 'currentColor' }}>
                      {target.title}
                    </h4>
                    <p className="text-sm"
                        style={{ fontSize: '12px', color: isDark ? '#A0A5B5' : '#7A6F60' }}>
                      {formatRupiah(target.currentAmount)} / {formatRupiah(target.targetAmount)}
                    </p>
                  </div>
                  <div className="text-right flex-1"
                      style={{ textAlign: 'right', minWidth: 0 }}>
                    <span className="font-semibold"
                        style={{ fontSize: '15px', color: 'currentColor' }}>
                      {pct}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSelectTypeModal(true)}
        className="fixed bottom-[100px] right-[max(24px,calc((100vw-480px)/2+24px)]"
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: isDark ? '--app-dark-accent' : '--app-cream-text',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 30,
        }}
      >
        <Plus size={24} />
      </motion.div>

      <nav
        className="bottom-nav"
        style={{
          background: isDark ? 'rgba(25, 26, 35, 0.95)' : 'rgba(250, 247, 242, 0.95)',
          borderTop: `1px solid ${isDark ? '--app-dark-border' : '--app-cream-border'}`,
        }}
      >
        <button
          className={`bottom-nav-tab ${activeTab === 'berjalan' ? 'active' : ''}`}
          onClick={() => setActiveTab('berjalan')}
          style={{
            color: activeTab === 'berjalan' ? (isDark ? 'white' : '#2C2418') : (isDark ? '#A0A5B5' : '#6E655B'),
            backgroundColor: activeTab === 'berjalan' ? (isDark ? '#2D3043' : '#EFEADF') : 'transparent',
          }}
        >
          <DollarSign size={20} />
          <span>{t('page.tab_active')}</span>
        </button>
        <button
          className={`bottom-nav-tab ${activeTab === 'selesai' ? 'active' : ''}`}
          onClick={() => setActiveTab('selesai')}
          style={{
            color: activeTab === 'selesai' ? (isDark ? 'white' : '#2C2418') : (isDark ? '#A0A5B5' : '#6E655B'),
            backgroundColor: activeTab === 'selesai' ? (isDark ? '#2D3043' : '#EFEADF') : 'transparent',
          }}
        >
          <Check size={20} />
          <span>{t('page.tab_finished')}</span>
        </button>
      </nav>

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
    </main>
  )
}