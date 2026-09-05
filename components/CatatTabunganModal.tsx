'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, X, Banknote, Menu } from 'lucide-react'
import { useAppStore, toBaseIDR, currencySymbolMap, CurrencyCode } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'

interface Props {
  isOpen: boolean
  onClose: () => void
  targetId: string
}

export default function CatatTabunganModal({ isOpen, onClose, targetId }: Props) {
  const { addTransaction, theme, currency, language } = useAppStore()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const [txType, setTxType] = useState<'setor' | 'tarik'>('setor')
  const [nominalStr, setNominalStr] = useState('10.000')
  const [keterangan, setKeterangan] = useState('')

  const quickAmountsMap: Record<CurrencyCode, number[]> = {
    IDR: [10000, 50000, 100000],
    USD: [10, 50, 100],
    EUR: [10, 50, 100],
    JPY: [1000, 5000, 10000],
    CNY: [50, 100, 500],
    THB: [100, 500, 1000],
    INR: [500, 1000, 5000],
    GBP: [10, 50, 100],
  }
  const quickAmounts = quickAmountsMap[currency] || [10000, 50000, 100000]

  const handleSave = () => {
    const enteredAmount = parseInt(nominalStr.replace(/\D/g, '')) || 0
    if (enteredAmount <= 0) return

    const baseAmount = toBaseIDR(enteredAmount, currency)
    addTransaction(targetId, txType, baseAmount, keterangan)
    onClose()
  }

  const formatNumber = (val: string) => {
    const numeric = val.replace(/\D/g, '')
    if (!numeric) return ''
    return parseInt(numeric, 10).toLocaleString('id-ID')
  }

  const bg = isDark ? '#22242B' : '#EFEADF'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const toggleBg = isDark ? '#181A20' : '#E4DCCF'
  const toggleBorder = isDark ? '#333644' : '#DDD5C7'
  const activeToggleBg = isDark ? '#3B4154' : '#FFFFFF'
  const activeToggleText = isDark ? '#FFFFFF' : '#2C2418'
  const inputBg = isDark ? '#1C1E26' : '#FAF6EF'
  const inputBorder = isDark ? '#7C8BFF' : '#2C2418'
  const subText = isDark ? '#A0A5B5' : '#7A6F60'
  const quickBtnBg = isDark ? '#1C1E26' : '#FAF6EF'
  const quickBtnBorder = isDark ? '#3B4154' : '#DDD5C7'
  const btnSaveBg = isDark ? '#8C9AFF' : '#2C2418'
  const btnSaveText = '#FFFFFF'

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(3px)',
            }}
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
              color: textColor,
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px 20px 32px',
              zIndex: 201,
            }}
          >
            <h2 style={{ fontSize: '22px', fontWeight: '700', textAlign: 'center', marginBottom: '20px' }}>
              Catat Tabungan
            </h2>

            {/* Segmented Toggle Control (+ Tambah / - Kurangi) */}
            <div
              style={{
                display: 'flex',
                backgroundColor: toggleBg,
                borderRadius: '999px',
                padding: '4px',
                marginBottom: '20px',
                border: `1px solid ${toggleBorder}`,
              }}
            >
              <button
                onClick={() => setTxType('setor')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: '999px',
                  backgroundColor: txType === 'setor' ? activeToggleBg : 'transparent',
                  color: txType === 'setor' ? activeToggleText : subText,
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                }}
              >
                <Plus size={18} /> Tambah
              </button>
              <button
                onClick={() => setTxType('tarik')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: '999px',
                  backgroundColor: txType === 'tarik' ? activeToggleBg : 'transparent',
                  color: txType === 'tarik' ? activeToggleText : subText,
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                }}
              >
                <Minus size={18} /> Kurangi
              </button>
            </div>

            {/* Floating Label Input: Nominal */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <div
                style={{
                  border: `1.5px solid ${inputBorder}`,
                  borderRadius: '14px',
                  backgroundColor: inputBg,
                  padding: '8px 14px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div
                    style={{
                      border: `1px solid ${toggleBorder}`,
                      borderRadius: '6px',
                      padding: '2px 4px',
                      color: subText,
                    }}
                  >
                    <Banknote size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', color: inputBorder, fontWeight: '600', display: 'block' }}>
                      Nominal ({currencySymbolMap[currency] || currency})
                    </label>
                    <input
                      type="text"
                      value={nominalStr}
                      onChange={(e) => setNominalStr(formatNumber(e.target.value))}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: textColor,
                        fontSize: '18px',
                        fontWeight: '700',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>

                {nominalStr && (
                  <button
                    onClick={() => setNominalStr('')}
                    style={{ background: 'none', border: 'none', color: subText, cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Amount Suggestion Pills */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setNominalStr(amt.toLocaleString('id-ID'))}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: '10px',
                    border: `1px solid ${quickBtnBorder}`,
                    backgroundColor: quickBtnBg,
                    color: textColor,
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  +{currencySymbolMap[currency] || ''}{amt.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            {/* Floating Label Input: Keterangan */}
            <div style={{ marginBottom: '28px' }}>
              <div
                style={{
                  border: `1px solid ${quickBtnBorder}`,
                  borderRadius: '14px',
                  backgroundColor: inputBg,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Menu size={18} color={subText} />
                <input
                  type="text"
                  placeholder="Keterangan"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: textColor,
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            {/* Buttons: Batal & Simpan */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: textColor,
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '12px 20px',
                  fontFamily: 'inherit',
                }}
              >
                Batal
              </button>

              <button
                onClick={handleSave}
                style={{
                  padding: '14px 44px',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: btnSaveBg,
                  color: btnSaveText,
                  fontWeight: '700',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Simpan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
