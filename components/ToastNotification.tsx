'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Info, X } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function ToastNotification() {
  const { activeToast, clearToast, theme } = useAppStore()

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        clearToast()
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [activeToast, clearToast])

  if (!activeToast) return null

  const isDark = theme === 'dark'

  const getIcon = () => {
    if (activeToast.type === 'info') return <Info size={22} color={isDark ? '#8C9AFF' : '#6366F1'} />
    return <CheckCircle2 size={22} color={isDark ? '#48BB78' : '#16A34A'} />
  }

  const getBorderColor = () => {
    if (activeToast.type === 'info') return isDark ? '#4F5699' : '#C7D2FE'
    return isDark ? '#27523C' : '#BBF7D0'
  }

  return (
    <AnimatePresence>
      {activeToast && (
        <div
          style={{
            position: 'fixed',
            top: 'max(16px, env(safe-area-inset-top) + 12px)',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 10000,
            pointerEvents: 'none',
            padding: '0 16px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              pointerEvents: 'auto',
              width: '100%',
              maxWidth: '440px',
              backgroundColor: isDark ? '#23242A' : '#FFFFFF',
              color: isDark ? '#FFFFFF' : '#2C2418',
              border: `1.5px solid ${getBorderColor()}`,
              borderRadius: '16px',
              padding: '12px 16px',
              boxShadow: isDark
                ? '0 10px 30px rgba(0, 0, 0, 0.5)'
                : '0 10px 30px rgba(44, 36, 24, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: isDark ? '#1C1D22' : '#F3EFE6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {getIcon()}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: isDark ? '#FFFFFF' : '#2C2418',
                    lineHeight: 1.3,
                    margin: 0,
                    wordBreak: 'break-word',
                  }}
                >
                  {activeToast.message}
                </h4>
                {activeToast.submessage && (
                  <p
                    style={{
                      fontSize: '12px',
                      color: isDark ? '#A0A5B5' : '#7A6F60',
                      marginTop: '2px',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {activeToast.submessage}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={clearToast}
              aria-label="Tutup Notifikasi"
              style={{
                background: 'none',
                border: 'none',
                color: isDark ? '#A0A5B5' : '#7A6F60',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <X size={18} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
