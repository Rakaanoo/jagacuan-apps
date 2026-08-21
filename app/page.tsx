'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, DollarSign, Check, Plus, Users, Calendar as CalendarIcon, PieChart, Search } from 'lucide-react'
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
    document.documentElement.style.backgroundColor = bg
    document.body.style.backgroundColor = bg
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
      style={{
        minHeight: '100vh',
        position: 'relative',
        paddingBottom: '90px',
        backgroundColor: isDark ? '#16171B' : '#FAF7F2',
        color: isDark ? '#FFFFFF' : '#2C2418',
        transition: 'background-color 0.25s ease, color 0.25s ease',
      }}
    >
      <ToastNotification />

      {/* Background Decorative Blobs */}
      <div
        className="bg-blob"
        style={{
          width: '220px',
          height: '220px',
          top: '-60px',
          right: '-60px',
          opacity: isDark ? 0.2 : 0.6,
        }}
      />
      <div
        className="bg-blob"
        style={{
          width: '180px',
          height: '180px',
          top: '240px',
          left: '-80px',
          opacity: isDark ? 0.15 : 0.5,
        }}
      />

      {/* Top Header Bar */}
      <header
        style={{
          padding: '24px 20px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '10px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setShowSidebar(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
        >
          <Menu size={26} color={isDark ? '#FFFFFF' : '#2C2418'} />
        </button>

        <h1 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.3px', margin: 0 }}>
          Jagacuan
        </h1>
      </header>

      {/* Quick Action Bar (Kalender, Statistik, Ruang) */}
      <div style={{ padding: '0 20px 12px', display: 'flex', gap: '8px', justifyContent: 'flex-end', position: 'relative', zIndex: 10 }}>
        <button
          onClick={() => setShowCalendarModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: isDark ? '#23242A' : '#FAF6EF',
            border: `1px solid ${isDark ? '#333644' : '#DDD5C7'}`,
            borderRadius: '999px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600',
            color: isDark ? '#FFFFFF' : '#2C2418',
            cursor: 'pointer',
          }}
        >
          <CalendarIcon size={14} color="#D97706" />
          <span>{t('page.calendar')}</span>
        </button>

        <button
          onClick={() => setShowStatsModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: isDark ? '#23242A' : '#FAF6EF',
            border: `1px solid ${isDark ? '#333644' : '#DDD5C7'}`,
            borderRadius: '999px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600',
            color: isDark ? '#FFFFFF' : '#2C2418',
            cursor: 'pointer',
          }}
        >
          <PieChart size={14} color="#16A34A" />
          <span>{t('page.statistics')}</span>
        </button>

        <button
          onClick={() => setShowNabarModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: isDark ? '#23242A' : '#FAF6EF',
            border: `1px solid ${isDark ? '#333644' : '#DDD5C7'}`,
            borderRadius: '999px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600',
            color: isDark ? '#FFFFFF' : '#2C2418',
            cursor: 'pointer',
          }}
        >
          <Users size={14} color="#7C8BFF" />
          <span>{t('page.rooms')}</span>
        </button>
      </div>

      {/* Search & Sort Controls */}
      {targets.length > 0 && (
        <div style={{ padding: '0 20px 14px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: isDark ? '#23242A' : '#FFFFFF',
              border: `1px solid ${isDark ? '#333644' : '#E0D5C3'}`,
              borderRadius: '14px',
              padding: '8px 14px',
            }}
          >
            <Search size={16} color={isDark ? '#A0A5B5' : '#7A6F60'} />
            <input
              type="text"
              placeholder={t('page.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: isDark ? 'white' : '#2C2418',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              onClick={() => setSortBy('terbaru')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: sortBy === 'terbaru' ? '#7C8BFF' : isDark ? '#23242A' : '#EFEADF',
                color: sortBy === 'terbaru' ? 'white' : isDark ? '#A0A5B5' : '#2C2418',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {t('page.sort_newest')}
            </button>
            <button
              onClick={() => setSortBy('progres')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: sortBy === 'progres' ? '#7C8BFF' : isDark ? '#23242A' : '#EFEADF',
                color: sortBy === 'progres' ? 'white' : isDark ? '#A0A5B5' : '#2C2418',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {t('page.sort_progress')}
            </button>
            <button
              onClick={() => setSortBy('deadline')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: sortBy === 'deadline' ? '#7C8BFF' : isDark ? '#23242A' : '#EFEADF',
                color: sortBy === 'deadline' ? 'white' : isDark ? '#A0A5B5' : '#2C2418',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {t('page.sort_deadline')}
            </button>
          </div>
        </div>
      )}

      {/* Finished Pill Banner */}
      {activeTab === 'selesai' && (
        <div style={{ padding: '0 20px 14px', position: 'relative', zIndex: 10 }}>
          <div
            style={{
              backgroundColor: isDark ? '#1C382A' : '#DDE7D8',
              border: `1px solid ${isDark ? '#27523C' : '#C2D4BB'}`,
              borderRadius: '14px',
              padding: '12px 16px',
              color: isDark ? '#48BB78' : '#2E6822',
              fontSize: '15px',
              fontWeight: '700',
            }}
          >
            {t('page.finished_count', { count: finishedTargets.length })}
          </div>
        </div>
      )}

      {/* Main Body Content */}
      <div style={{ padding: '0 20px', position: 'relative', zIndex: 10 }}>
        {displayedList.length === 0 ? (
          activeTab === 'berjalan' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0 40px', textAlign: 'center' }}>
              <img
                src={isDark ? '/jagacuan-logo-dark.png' : '/jagacuan-logo-light.png'}
                alt="Jagacuan"
                style={{
                  height: '44px',
                  width: 'auto',
                  objectFit: 'contain',
                  marginBottom: '24px',
                }}
              />

              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: isDark ? '#FFFFFF' : '#2C2418' }}>
                {t('page.no_active')}
              </h3>
              <p
                style={{ fontSize: '14px', color: isDark ? '#A0A5B5' : '#7A6F60', maxWidth: '240px', lineHeight: '1.5' }}
                dangerouslySetInnerHTML={{ __html: t('page.no_active_hint') }}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: isDark ? '#A0A5B5' : '#7A6F60' }}>
              <p style={{ fontSize: '15px', fontWeight: '600' }}>{t('page.no_finished')}</p>
            </div>
          )
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {displayedList.map((target) => {
              const pct = Math.min(100, Math.round((target.currentAmount / target.targetAmount) * 100))

              return (
                <motion.div
                  key={target.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveDetailTarget(target)}
                  style={{
                    backgroundColor: isDark ? '#23242A' : '#FAF6EF',
                    borderRadius: '20px',
                    padding: '16px',
                    border: `1px solid ${isDark ? '#333644' : '#E0D5C3'}`,
                    boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: isDark ? '#1C1D22' : '#EFEADF', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {target.coverImage ? (
                        <img src={target.coverImage} alt={target.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <DollarSign size={28} color={isDark ? '#8C9AFF' : '#2C2418'} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {target.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: isDark ? '#A0A5B5' : '#7A6F60' }}>
                        {formatRupiah(target.currentAmount)} / {formatRupiah(target.targetAmount)}
                      </p>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '800' }}>
                      {pct}%
                    </div>
                  </div>
                  <div style={{ height: '8px', backgroundColor: isDark ? '#1C1D22' : '#EFEADF', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: target.isFinished ? '#16A34A' : isDark ? '#7C8BFF' : '#2C2418', borderRadius: '999px' }} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSelectTypeModal(true)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: 'max(24px, calc((100vw - 480px) / 2 + 24px))',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          backgroundColor: isDark ? '#7C8BFF' : '#2C2418',
          color: '#FFF',
          border: 'none',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 40,
        }}
      >
        <Plus size={30} />
      </motion.button>

      <nav
        className="bottom-nav"
        style={{
          background: isDark ? 'rgba(22, 23, 27, 0.95)' : 'rgba(250, 247, 242, 0.95)',
          borderColor: isDark ? '#2D2F3A' : '#E8E1D5',
        }}
      >
        <button
          className={`bottom-nav-tab ${activeTab === 'berjalan' ? 'active' : ''}`}
          onClick={() => setActiveTab('berjalan')}
          style={{
            color: activeTab === 'berjalan' ? (isDark ? '#FFFFFF' : '#2C2418') : (isDark ? '#A0A5B5' : '#6E655B'),
            backgroundColor: activeTab === 'berjalan' ? (isDark ? '#2D2F3A' : '#EFEADF') : 'transparent',
          }}
        >
          <DollarSign size={22} />
          <span>{t('page.tab_active')}</span>
        </button>
        <button
          className={`bottom-nav-tab ${activeTab === 'selesai' ? 'active' : ''}`}
          onClick={() => setActiveTab('selesai')}
          style={{
            color: activeTab === 'selesai' ? (isDark ? '#FFFFFF' : '#2C2418') : (isDark ? '#A0A5B5' : '#6E655B'),
            backgroundColor: activeTab === 'selesai' ? (isDark ? '#2D2F3A' : '#EFEADF') : 'transparent',
          }}
        >
          <Check size={22} />
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
