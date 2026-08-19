'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Trash2, X, Image as ImageIcon } from 'lucide-react'
import { useAppStore, TargetItem } from '@/lib/store'

interface Props {
  isOpen: boolean
  onClose: () => void
  target: TargetItem | null
}

export default function EditTargetModal({ isOpen, onClose, target }: Props) {
  const { updateTarget, theme } = useAppStore()
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
      setTargetAmountStr(target.targetAmount.toLocaleString('id-ID'))
      setStartDate(target.startDate || new Date().toISOString().split('T')[0])
      setDeadlineDate(target.deadlineDate || '')
      setDeadlineType(target.deadlineType || 'fleksibel')
      setNote(target.note || '')
      setCoverImage(target.coverImage || null)
    }
  }, [target])

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
    const amount = parseInt(targetAmountStr.replace(/\D/g, '')) || 0
    if (!title || amount <= 0) return

    updateTarget(target.id, {
      title,
      targetAmount: amount,
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
              padding: '24px 20px 32px',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 301,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Edit Target Tabungan</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: subText, cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {/* Form Input: Title */}
              <div>
                <label style={{ fontSize: '12px', color: accentCol, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Nama Target / Barang Impian
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: iPhone 15 Pro, Motor"
                  style={{
                    width: '100%',
                    backgroundColor: inputBg,
                    border: `1px solid ${borderCol}`,
                    borderRadius: '12px',
                    padding: '12px 14px',
                    color: textColor,
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Form Input: Target Amount */}
              <div>
                <label style={{ fontSize: '12px', color: accentCol, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Nominal Target (Rp)
                </label>
                <input
                  type="text"
                  value={targetAmountStr}
                  onChange={(e) => setTargetAmountStr(formatNumberInput(e.target.value))}
                  placeholder="10.000.000"
                  style={{
                    width: '100%',
                    backgroundColor: inputBg,
                    border: `1px solid ${borderCol}`,
                    borderRadius: '12px',
                    padding: '12px 14px',
                    color: textColor,
                    fontSize: '16px',
                    fontWeight: '700',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Deadline Date & Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: accentCol, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Target Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: inputBg,
                      border: `1px solid ${borderCol}`,
                      borderRadius: '12px',
                      padding: '10px 12px',
                      color: textColor,
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: accentCol, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Tipe Deadline
                  </label>
                  <select
                    value={deadlineType}
                    onChange={(e) => setDeadlineType(e.target.value as 'tetap' | 'fleksibel')}
                    style={{
                      width: '100%',
                      backgroundColor: inputBg,
                      border: `1px solid ${borderCol}`,
                      borderRadius: '12px',
                      padding: '11px 12px',
                      color: textColor,
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="fleksibel">Fleksibel</option>
                    <option value="tetap">Tetap (Kaku)</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label style={{ fontSize: '12px', color: accentCol, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Foto Sampul (Opsional)
                </label>
                <div
                  style={{
                    border: `1px dashed ${borderCol}`,
                    borderRadius: '14px',
                    padding: '14px',
                    backgroundColor: inputBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {coverImage ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={coverImage} alt="Cover" style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }} />
                      <span style={{ fontSize: '13px', color: subText }}>Foto terpasang ({imageSizeStr})</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: subText }}>
                      <ImageIcon size={20} />
                      <span style={{ fontSize: '13px' }}>Upload Foto Barang</span>
                    </div>
                  )}

                  <label
                    style={{
                      backgroundColor: isDark ? '#262934' : '#EFEADF',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: accentCol,
                      cursor: 'pointer',
                    }}
                  >
                    Pilih File
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '999px',
                  border: `1px solid ${btnCancelBorder}`,
                  backgroundColor: 'transparent',
                  color: textColor,
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Batal
              </button>

              <button
                onClick={handleSave}
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '999px',
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
