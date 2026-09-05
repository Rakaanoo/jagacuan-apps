'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Trash2, X, Image as ImageIcon } from 'lucide-react'
import { useAppStore, TargetItem, fromBaseIDR, toBaseIDR } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'

interface Props {
  isOpen: boolean
  onClose: () => void
  target: TargetItem | null
}

export default function EditTargetModal({ isOpen, onClose, target }: Props) {
  const { updateTarget, theme, currency, language } = useAppStore()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const [title, setTitle] = useState('')
  const [targetAmountStr, setTargetAmountStr] = useState('')
  const [startDate, setStartDate] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [deadlineType, setDeadlineType] = useState<'tetap' | 'fleksibel'>('fleksibel')
  const [note, setNote] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [imageSizeStr, setImageSizeStr] = useState<string>('Custom Upload')

  useEffect(() => {
    if (target) {
      setTitle(target.title)
      const convertedVal = Math.round(fromBaseIDR(target.targetAmount, currency))
      setTargetAmountStr(convertedVal.toLocaleString('id-ID'))
      setStartDate(target.startDate || new Date().toISOString().split('T')[0])
      setDeadlineDate(target.deadlineDate || '')
      setDeadlineType(target.deadlineType || 'fleksibel')
      setNote(target.note || '')
      setCoverImage(target.coverImage || null)
    }
  }, [target, currency])

  if (!target) return null

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

    updateTarget(target.id, {
      title,
      targetAmount: baseAmount,
      startDate,
      deadlineDate: deadlineDate || undefined,
      deadlineType,
      note,
      coverImage: coverImage || undefined,
    })

    onClose()
  }

  const formatNumberInput = (val: string) => {
    const numeric = val.replace(/\D/g, '')
    if (!numeric) return ''
    return parseInt(numeric, 10).toLocaleString('id-ID')
  }

  const bg = isDark ? '#191B21' : '#EFEADF'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const inputBg = isDark ? '#131419' : '#FAF6EF'
  const borderCol = isDark ? '#333644' : '#DDD5C7'
  const accentCol = isDark ? '#8C9AFF' : '#2C2418'
  const subText = isDark ? '#A0A5B5' : '#7A6F60'
  const btnCancelBorder = isDark ? '#333644' : '#C8BFB0'
  const btnSaveBg = isDark ? '#7C8BFF' : '#2C2418'

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'flex-end' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
              zIndex: 301,
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

            {/* Header cover image section */}
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
                    Tambah / Ubah gambar barang impian
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: textColor }}>Edit Target Tabungan</h2>
              <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: subText, cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              {/* Form Input: Title */}
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
                    Nama Target / Barang Impian
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Misal: Beli PS5, Liburan Bali..."
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

              {/* Form Input: Target Amount */}
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
                    Jumlah Target (Rp)
                  </label>
                  <input
                    type="text"
                    value={targetAmountStr}
                    onChange={(e) => setTargetAmountStr(formatNumberInput(e.target.value))}
                    placeholder="0"
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

              {/* Tanggal Mulai */}
              <div>
                <label style={{ fontSize: '13px', color: subText, marginBottom: '6px', display: 'block' }}>
                  Tanggal Mulai
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

              {/* Deadline Date & Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: subText, marginBottom: '6px', display: 'block' }}>
                    Deadline (opsional)
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
                <div>
                  <label style={{ fontSize: '13px', color: subText, marginBottom: '6px', display: 'block' }}>
                    Tipe Deadline
                  </label>
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '14px',
                      backgroundColor: inputBg,
                      border: `1px solid ${borderCol}`,
                    }}
                  >
                    <select
                      value={deadlineType}
                      onChange={(e) => setDeadlineType(e.target.value as 'tetap' | 'fleksibel')}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: textColor,
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="fleksibel" style={{ background: inputBg, color: textColor }}>Fleksibel</option>
                      <option value="tetap" style={{ background: inputBg, color: textColor }}>Tetap (Kaku)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Catatan */}
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

            <div style={{ display: 'flex', gap: '12px' }}>
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
                Batal
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
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Simpan Perubahan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
