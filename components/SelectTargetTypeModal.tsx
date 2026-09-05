'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Flag, Trophy, Users } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelectType: (type: 'nabung' | 'berkala' | 'nabar') => void
}

export default function SelectTargetTypeModal({ isOpen, onClose, onSelectType }: Props) {
  const { theme, currency, language } = useAppStore()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const bg = isDark ? '#1C1D22' : '#EFEADF'
  const cardBg = isDark ? '#23242A' : '#FAF6EF'
  const cardBorder = isDark ? '#333644' : '#DDD5C7'
  const iconBg = isDark ? '#2D2F3A' : '#EAE1D1'
  const titleColor = isDark ? '#FFFFFF' : '#2C2418'
  const subColor = isDark ? '#A0A5B5' : '#7A6F60'
  const iconColor = isDark ? '#8C9AFF' : '#2C2418'
  const cancelBorder = isDark ? '#3A3F50' : '#C8BFB0'
  const cancelColor = isDark ? '#FFFFFF' : '#2C2418'

  const options = [
    { type: 'nabung' as const, icon: <Flag size={24} />, title: t('select_type.nabung'), desc: t('select_type.nabung_desc') },
    { type: 'berkala' as const, icon: <Trophy size={24} />, title: t('select_type.berkala'), desc: t('select_type.berkala_desc') },
    { type: 'nabar' as const, icon: <Users size={24} />, title: t('select_type.nabar'), desc: t('select_type.nabar_desc') },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(2px)' }}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto',
              backgroundColor: bg,
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px 20px 36px',
              zIndex: 101,
            }}
          >
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: titleColor, marginBottom: '20px' }}>
              {t('select_type.title')}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {options.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => onSelectType(opt.type)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: '20px',
                    border: `1.5px solid ${cardBorder}`,
                    backgroundColor: cardBg,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, border-color 0.15s ease',
                  }}
                >
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    backgroundColor: iconBg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: iconColor,
                    flexShrink: 0,
                  }}>
                    {opt.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: titleColor, marginBottom: '4px' }}>
                      {opt.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: subColor }}>{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  border: `1.5px solid ${cancelBorder}`,
                  backgroundColor: 'transparent',
                  color: cancelColor,
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {t('common.cancel')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
