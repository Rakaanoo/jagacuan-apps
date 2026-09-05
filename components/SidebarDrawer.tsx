'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Archive, Globe, RefreshCw, ArrowUpDown, Info, Star, X, Sun, Moon, LogIn, CheckCircle2, User } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/supabase/nabar'

interface Props {
  isOpen: boolean
  onClose: () => void
  onOpenBackup: () => void
}

export default function SidebarDrawer({ isOpen, onClose, onOpenBackup }: Props) {
  const { theme, toggleTheme, showToast, language, setLanguage, currency, setCurrency } = useAppStore()
  const { t } = useTranslation()
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      getCurrentUser()
        .then((usr) => setCurrentUser(usr))
        .catch(() => setCurrentUser(null))
    }
  }, [isOpen])

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

  const languagesList = [
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', currency: 'IDR' },
    { code: 'en', name: 'English (US)', flag: '🇺🇸', currency: 'USD' },
    { code: 'de', name: 'Deutsch (Jerman)', flag: '🇩🇪', currency: 'EUR' },
    { code: 'fr', name: 'Français (Prancis)', flag: '🇫🇷', currency: 'EUR' },
    { code: 'it', name: 'Italiano (Italia)', flag: '🇮🇹', currency: 'EUR' },
    { code: 'es', name: 'Español (Spanyol)', flag: '🇪🇸', currency: 'EUR' },
    { code: 'ja', name: '日本語 (Jepang)', flag: '🇯🇵', currency: 'JPY' },
    { code: 'zh', name: '中文 (China)', flag: '🇨🇳', currency: 'CNY' },
    { code: 'th', name: 'ไทย (Thailand)', flag: '🇹🇭', currency: 'THB' },
    { code: 'hi', name: 'हिन्दी (India)', flag: '🇮🇳', currency: 'INR' },
  ] as const

  const currenciesList = [
    { code: 'IDR', name: 'Rupiah (Rp)', flag: '🇮🇩' },
    { code: 'USD', name: 'US Dollar ($)', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro (€)', flag: '🇪🇺' },
    { code: 'JPY', name: 'Yen (¥)', flag: '🇯🇵' },
    { code: 'CNY', name: 'Yuan (¥)', flag: '🇨🇳' },
    { code: 'THB', name: 'Baht (฿)', flag: '🇹🇭' },
    { code: 'INR', name: 'Rupee (₹)', flag: '🇮🇳' },
    { code: 'GBP', name: 'Pound (£)', flag: '🇬🇧' },
  ] as const

  const handleMenuClick = (id: string) => {
    if (id === 'backup') {
      onClose()
      onOpenBackup()
    } else if (id === 'tema') {
      toggleTheme()
      const newThemeStr = t(theme === 'dark' ? 'sidebar.theme_cream' : 'sidebar.theme_dark')
      showToast(t('toast.theme_changed', { theme: newThemeStr }), '', 'info')
    } else {
      setActiveModal(id)
    }
  }

  const isDark = theme === 'dark'
  const cardBg = isDark ? '#262832' : '#FAF6EF'
  const cardBorder = isDark ? '#353846' : '#E0D5C3'

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
              backgroundColor: isDark ? '#1C1D22' : '#EFEADF',
              color: isDark ? '#FFFFFF' : '#2C2418',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 101,
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div
              style={{
                fontSize: '22px',
                fontWeight: '700',
                paddingBottom: '16px',
                borderBottom: `1.5px solid ${isDark ? '#2A2C35' : '#D8CFBE'}`,
                marginBottom: '16px',
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
                <X size={22} color={isDark ? '#A0A5B5' : '#2C2418'} />
              </button>
            </div>

            {/* Google Account Status Badge */}
            <div
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: '14px',
                padding: '12px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#333644' : '#E0D5C3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#FFFFFF' : '#2C2418',
                  flexShrink: 0,
                }}
              >
                {currentUser?.user_metadata?.avatar_url ? (
                  <img
                    src={currentUser.user_metadata.avatar_url}
                    alt="User"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={18} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {currentUser ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
                      </span>
                      <CheckCircle2 size={13} color="#16A34A" />
                    </div>
                    <p style={{ fontSize: '11px', color: isDark ? '#A0A5B5' : '#7A6F60', margin: 0 }}>
                      Google Terhubung (Ruang Nabar)
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: '13px', fontWeight: '700', margin: 0 }}>Google Belum Terhubung</p>
                    <p style={{ fontSize: '11px', color: isDark ? '#A0A5B5' : '#7A6F60', margin: 0 }}>
                      Hanya diperlukan untuk Ruang Nabar
                    </p>
                  </>
                )}
              </div>
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
                    backgroundColor: item.id === 'tema' ? (isDark ? '#282A34' : '#E4DCCF') : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: isDark ? '#FFFFFF' : '#2C2418',
                    fontFamily: 'inherit',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{ color: isDark ? '#8C9AFF' : '#2C2418', display: 'flex', alignItems: 'center' }}>
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
                    backgroundColor: isDark ? '#262832' : '#FAF6EF',
                    borderRadius: '16px',
                    padding: '18px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                    border: `1px solid ${isDark ? '#353846' : '#E0D5C3'}`,
                    maxHeight: '340px',
                    overflowY: 'auto',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ fontWeight: '700', fontSize: '15px' }}>
                      {menuItems.find((m) => m.id === activeModal)?.label}
                    </h4>
                    <button
                      onClick={() => setActiveModal(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <X size={16} color={isDark ? '#A0A5B5' : '#7A6F60'} />
                    </button>
                  </div>

                  {activeModal === 'bahasa' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {languagesList.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            setLanguage(l.code as any)
                            setCurrency(l.currency as any)
                            setActiveModal(null)
                            showToast(`Bahasa: ${l.name} • Mata Uang: ${l.currency}`, '', 'info')
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            backgroundColor: language === l.code ? (isDark ? '#7C8BFF' : '#2C2418') : 'transparent',
                            color: language === l.code ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#2C2418'),
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            textAlign: 'left',
                          }}
                        >
                          <span>{l.flag}</span>
                          <span style={{ flex: 1 }}>{l.name}</span>
                          <span style={{ fontSize: '11px', opacity: 0.75 }}>({l.currency})</span>
                        </button>
                      ))}
                    </div>
                  ) : activeModal === 'mata_uang' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {currenciesList.map((c) => {
                        const isSel = currency === c.code
                        return (
                          <button
                            key={c.code}
                            onClick={() => {
                              setCurrency(c.code as any)
                              setActiveModal(null)
                              showToast(`Mata Uang diubah ke ${c.code} (${c.name})`, '', 'info')
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 12px',
                              borderRadius: '10px',
                              backgroundColor: isSel ? (isDark ? '#7C8BFF' : '#2C2418') : 'transparent',
                              color: isSel ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#2C2418'),
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '600',
                            }}
                          >
                            <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span>{c.flag}</span>
                              <span>{c.code}</span>
                            </span>
                            <span style={{ fontSize: '12px', opacity: 0.8 }}>{c.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: isDark ? '#A0A5B5' : '#7A6F60', lineHeight: 1.4 }}>
                      {menuItems.find((m) => m.id === activeModal)?.desc}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

