'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, CheckCircle2, Info, X } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function ToastNotification() {
  const { activeToast, clearToast } = useAppStore()

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        clearToast()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [activeToast, clearToast])

  if (!activeToast) return null

  const getIcon = () => {
    if (activeToast.type === 'info') return <Info size={24} color="#7C8BFF" />
    return <CheckCircle2 size={24} color="#48BB78" />
  }

  const getBg = () => {
    return '#1E2028'
  }

  const getBorder = () => {
    if (activeToast.type === 'info') return '#7C8BFF'
    return '#48BB78'
  }

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 40px)',
            maxWidth: '440px',
            zIndex: 9999,
            background: getBg(),
            border: `1.5px solid ${getBorder()}`,
            borderRadius: '18px',
            padding: '14px 16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {getIcon()}
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>
                {activeToast.message}
              </h4>
              {activeToast.submessage && (
                <p style={{ fontSize: '12px', color: '#A0A5B5', marginTop: '2px' }}>
                  {activeToast.submessage}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={clearToast}
            style={{ background: 'none', border: 'none', color: '#A0A5B5', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
