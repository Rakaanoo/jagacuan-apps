'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Trash2, X, Image as ImageIcon } from 'lucide-react'
import { useAppStore, toBaseIDR, currencySymbolMap } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'

interface Props {
  isOpen: boolean
  onClose: () => void
  targetType: 'nabung' | 'berkala'
}

export default function CreateTargetModal({ isOpen, onClose, targetType }: Props) {
  const { addTarget, theme, currency, language } = useAppStore()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const [title, setTitle] = useState('')
  const [targetAmountStr, setTargetAmountStr] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [deadlineDate, setDeadlineDate] = useState('')
  const [note, setNote] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [imageSizeStr, setImageSizeStr] = useState<string>('115.1 KB')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const sizeInKb = (file.size / 1024).toFixed(1)
    setImageSizeStr(`${sizeInKb} KB`)

    const reader = new FileReader()
    reader.onload = (event) => {
      setCoverImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    const enteredAmount = parseInt(targetAmountStr.replace(/\D/g, '')) || 0
    if (!title || enteredAmount <= 0) return

    const baseAmount = toBaseIDR(enteredAmount, currency)

    addTarget({
      title,
      targetAmount: baseAmount,
      startDate,
      deadlineDate: deadlineDate || undefined,
      note,
      coverImage: coverImage || undefined,
      type: targetType,
    })

    // Reset & close
    setTitle('')
    setTargetAmountStr('')
    setNote('')
    setCoverImage(null)
    onClose()
  }

  const formatNumberInput = (val: string) => {
    const numeric = val.replace(/\D/g, '')
    if (!numeric) return ''
    return parseInt(numeric, 10).toLocaleString('id-ID')
  }

  const bg = isDark ? '#191B21' : '#EFEADF'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const inputBg = isDark ? '#20232D' : '#FAF6EF'
  const borderCol = isDark ? '#2E3342' : '#DDD5C7'
  const accentCol = isDark ? '#7C8BFF' : '#2C2418'
  const subText = isDark ? '#9499A8' : '#7A6F60'
  const btnCancelBorder = isDark ? '#3A3F50' : '#C8BFB0'
  const btnSaveBg = isDark ? '#7C8BFF' : '#2C2418'
  const btnSaveText = '#FFFFFF'

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
              padding: '16px 20px 32px',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 101,
            }}
          >
            {/* Top Drag Handle Indicator */}
            <div
              style={{
                width: '40px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: isDark ? '#3D4354' : '#C8BFB0',
                margin: '0 auto 16px',
              }}
            />

            {/* Header cover image upload section */}
            <div style={{ marginBottom: '18px' }}>
              {coverImage ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={coverImage}
                    alt="Cover"
                    style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover',
                      borderRadius: '16px',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '8px',
                      fontSize: '13px',
                      color: subText,
                    }}
                  >
                    <span>{imageSizeStr}</span>
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: accentCol,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      <Trash2 size={16} /> Hapus gambar
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '28px 16px',
                    borderRadius: '16px',
                    border: isDark ? '1px dashed #3D4354' : '1px dashed #CBD5E1',
                    backgroundColor: isDark ? 'rgba(32, 35, 45, 0.4)' : 'rgba(250, 246, 239, 0.6)',
                    cursor: 'pointer',
                    color: accentCol,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ImageIcon size={36} color={accentCol} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: accentCol }}>
                    Tambah gambar barang impian
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              )}
            </div>

            {/* Title */}
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: textColor }}>
              {targetType === 'berkala' ? t('create.title_berkala') : t('create.title_nabung')}
            </h2>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Field: Judul / Nama Target */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    border: `1.5px solid ${accentCol}`,
                    borderRadius: '14px',
                    backgroundColor: inputBg,
                    padding: '10px 14px',
                  }}
                >
                  <label style={{ fontSize: '11px', color: accentCol, fontWeight: '600', display: 'block', marginBottom: '2px' }}>
                    {t('create.name_label')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('create.name_placeholder')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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

              {/* Field: Jumlah Target (Rp) */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    border: `1px solid ${borderCol}`,
                    borderRadius: '14px',
                    backgroundColor: inputBg,
                    padding: '10px 14px',
                  }}
                >
                  <label style={{ fontSize: '11px', color: subText, fontWeight: '500', display: 'block', marginBottom: '2px' }}>
                    {t('create.amount_label')}
                  </label>
                  <input
                    type="text"
                    placeholder="0"
                    value={targetAmountStr}
                    onChange={(e) => setTargetAmountStr(formatNumberInput(e.target.value))}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: textColor,
                      fontSize: '16px',
                      fontWeight: '700',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              {/* Field: Tanggal Mulai */}
              <div>
                <label style={{ fontSize: '13px', color: subText, marginBottom: '6px', display: 'block' }}>
                  {t('create.start_date')}
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    backgroundColor: inputBg,
                    border: `1px solid ${borderCol}`,
                    position: 'relative',
                  }}
                >
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: textColor,
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      width: '100%',
                      cursor: 'pointer',
                      colorScheme: isDark ? 'dark' : 'light',
                    }}
                  />
                  <Calendar size={18} color={subText} style={{ pointerEvents: 'none', marginLeft: '8px', flexShrink: 0 }} />
                </div>
              </div>

              {/* Field: Deadline (opsional) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', color: subText }}>
                    Deadline (opsional)
                  </label>
                  {deadlineDate && (
                    <button
                      type="button"
                      onClick={() => setDeadlineDate('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: subText, padding: 0 }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    backgroundColor: inputBg,
                    border: `1px solid ${borderCol}`,
                    position: 'relative',
                  }}
                >
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    placeholder="mm / dd / yyyy"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: textColor,
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      width: '100%',
                      cursor: 'pointer',
                      colorScheme: isDark ? 'dark' : 'light',
                    }}
                  />
                  <Calendar size={18} color={subText} style={{ pointerEvents: 'none', marginLeft: '8px', flexShrink: 0 }} />
                </div>
              </div>

              {/* Field: Catatan */}
              <div>
                <div
                  style={{
                    border: `1px solid ${borderCol}`,
                    borderRadius: '14px',
                    backgroundColor: inputBg,
                    padding: '10px 14px',
                  }}
                >
                  <label style={{ fontSize: '11px', color: subText, fontWeight: '500', display: 'block', marginBottom: '4px' }}>
                    Catatan
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tulis catatan pendukung..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: textColor,
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'none',
                    }}
                  />
                </div>
                <p style={{ fontSize: '11px', color: isDark ? '#757B8D' : '#8A8275', marginTop: '6px' }}>
                  Gambar catatan (dioptimalkan otomatis, maks. 1MB)
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '14px',
                  border: `1.5px solid ${btnCancelBorder}`,
                  backgroundColor: 'transparent',
                  color: textColor,
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: btnSaveBg,
                  color: btnSaveText,
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {t('create.button_save')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
