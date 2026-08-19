'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Archive, Globe, RefreshCw, Palette, ArrowUpDown, Info, Star, X, Sun, Moon } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'

interface Props {
  isOpen: boolean
  onClose: () => void
  onOpenBackup: () => void
}

export default function SidebarDrawer({ isOpen, onClose, onOpenBackup }: Props) {
  const { theme, toggleTheme, showToast, language, setLanguage } = useAppStore()
  const { t } = useTranslation()
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const menuItems = [
    { id: 'arsip', label: t('sidebar.archive'), icon: <Archive size={22} />, desc: t('sidebar.archive_desc') },
    { id: 'bahasa', label: t('sidebar.language'), icon: <Globe size={22} />, desc: t('sidebar.language_desc', { lang: t('lang.' + language) }) },
    { id: 'mata_uang', label: t('sidebar.currency'), icon: <RefreshCw size={22} />, desc: t('sidebar.currency_desc') },
    {
      id: 'tema',
      label: t('sidebar.theme', { mode: t(theme === 'dark' ? 'sidebar.theme_dark' : 'sidebar.theme_cream') }),
      icon: theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />,
      desc: t('sidebar.theme_desc'),
    },
    { id: 'backup', label: t('sidebar.backup'), icon: <ArrowUpDown size={22} />, desc: t('sidebar.backup_desc') },
    { id: 'info', label: t('sidebar.info'), icon: <Info size={22} />, desc: t('sidebar.info_desc') },
    { id: 'rating', label: t('sidebar.rating'), icon: <Star size={22} />, desc: t('sidebar.rating_desc') },
  ]

  const handleMenuClick = (id: string) => {
    if (id === 'backup') {
      onClose()
      onOpenBackup()
    } else if (id === 'tema') {
      toggleTheme()
      const newThemeStr = t(theme === 'dark' ? 'sidebar.theme_cream' : 'sidebar.theme_dark')
      showToast(t('toast.theme_changed', { theme: newThemeStr }), '', 'info')
    } else if (id === 'bahasa') {
      const newLang = language === 'id' ? 'en' : 'id'
      setLanguage(newLang)
      showToast(newLang === 'en' ? 'Language changed to English' : 'Bahasa diubah ke Bahasa Indonesia', '', 'info')
    } else {
      setActiveModal(id)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '82%',
              maxWidth: '360px',
              backgroundColor: theme === 'dark' ? '#1C1D22' : '#EFEADF',
              color: theme === 'dark' ? '#FFFFFF' : '#2C2418',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 101,
            }}
          >
            {/* Header */}
            <div
              style={{
                fontSize: '22px',
                fontWeight: '700',
                paddingBottom: '16px',
                borderBottom: `1.5px solid ${theme === 'dark' ? '#2A2C35' : '#D8CFBE'}`,
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{t('sidebar.menu')}</span>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} color={theme === 'dark' ? '#A0A5B5' : '#2C2418'} />
              </button>
            </div>

            {/* Menu List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 12px',
                    borderRadius: '12px',
                    backgroundColor: item.id === 'tema' ? (theme === 'dark' ? '#282A34' : '#E4DCCF') : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: theme === 'dark' ? '#FFFFFF' : '#2C2418',
                    fontFamily: 'inherit',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{ color: theme === 'dark' ? '#8C9AFF' : '#2C2418', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: '600', flex: 1 }}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Simple Popup Sub-Modal for Sidebar Items */}
            <AnimatePresence>
              {activeModal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '20px',
                    right: '20px',
                    backgroundColor: theme === 'dark' ? '#262832' : '#FAF6EF',
                    borderRadius: '16px',
                    padding: '18px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                    border: `1px solid ${theme === 'dark' ? '#353846' : '#E0D5C3'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ fontWeight: '700', fontSize: '15px' }}>
                      {menuItems.find((m) => m.id === activeModal)?.label}
                    </h4>
                    <button
                      onClick={() => setActiveModal(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <X size={16} color={theme === 'dark' ? '#A0A5B5' : '#7A6F60'} />
                    </button>
                  </div>
                  <p style={{ fontSize: '13px', color: theme === 'dark' ? '#A0A5B5' : '#7A6F60', lineHeight: 1.4 }}>
                    {menuItems.find((m) => m.id === activeModal)?.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
