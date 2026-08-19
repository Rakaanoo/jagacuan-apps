'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Image as ImageIcon } from 'lucide-react'
import { useAppStore } from '@/lib/store'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function CreateNabarModal({ isOpen, onClose }: Props) {
  const { addNabarRoom, theme } = useAppStore()
  const isDark = theme === 'dark'

  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [note, setNote] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setCoverImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCreate = () => {
    if (!title) return
    addNabarRoom({
      title,
      targetAmount: 8000000,
      startDate: startDate || undefined,
      deadlineDate: deadlineDate || undefined,
      note,
      coverImage: coverImage || undefined,
    })

    setTitle('')
    setNote('')
    setCoverImage(null)
    onClose()
  }

  const bg = isDark ? '#1B1D24' : '#EFEADF'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const cardBg = isDark ? '#262934' : '#FAF6EF'
  const cardBorder = isDark ? '#363A48' : '#DDD5C7'
  const subText = isDark ? '#9DA2B3' : '#7A6F60'
  const btnBg = isDark ? '#A0ABFF' : '#2C2418'
  const btnText = isDark ? '#16171B' : '#FFFFFF'

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 220, display: 'flex', alignItems: 'flex-end' }}>
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
              padding: '24px 20px 36px',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 221,
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'none',
                  border: 'none',
                  color: subText,
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
                Buat room kolaborasi
              </h2>
              <p style={{ fontSize: '13px', color: subText, lineHeight: 1.4 }}>
                Buat tabungan bersama, pilih foto cover, lalu kirim tautan undangan ke teman.
              </p>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Foto room (opsional) */}
              <div>
                <label style={{ fontSize: '13px', color: textColor, marginBottom: '8px', display: 'block', fontWeight: '600' }}>
                  Foto room (opsional)
                </label>
                {coverImage ? (
                  <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '140px' }}>
                    <img src={coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => setCoverImage(null)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '24px',
                      borderRadius: '16px',
                      border: `1.5px solid ${cardBorder}`,
                      backgroundColor: cardBg,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: '600', color: textColor }}>
                      Tambah foto cover
                    </span>
                    <span style={{ fontSize: '12px', color: subText }}>
                      Opsional — pilih foto untuk room kamu
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: isDark ? '#8C9AFF' : '#2C2418', marginTop: '4px' }}>
                      Pilih foto
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                )}
              </div>

              {/* Nama tabungan kolaborasi */}
              <div>
                <label style={{ fontSize: '13px', color: textColor, marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                  Nama tabungan kolaborasi
                </label>
                <div
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '12px',
                    padding: '12px 14px',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Contoh: Liburan Bali 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: textColor,
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              {/* Tanggal mulai */}
              <div>
                <label style={{ fontSize: '13px', color: textColor, marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                  Tanggal mulai
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '12px',
                    padding: '12px 14px',
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
                    }}
                  />
                  <Calendar size={18} color={subText} />
                </div>
              </div>

              {/* Deadline (opsional) */}
              <div>
                <label style={{ fontSize: '13px', color: textColor, marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                  Deadline (opsional)
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '12px',
                    padding: '12px 14px',
                  }}
                >
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: textColor,
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      width: '100%',
                    }}
                  />
                  <Calendar size={18} color={subText} />
                </div>
              </div>

              {/* Keterangan tujuan menabung */}
              <div>
                <label style={{ fontSize: '13px', color: textColor, marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                  Keterangan tujuan menabung
                </label>
                <div
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '12px',
                    padding: '12px 14px',
                  }}
                >
                  <textarea
                    rows={3}
                    placeholder="Contoh: Nabung bareng untuk liburan akhir tahun."
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
              </div>

              {/* Tautan undangan */}
              <div>
                <label style={{ fontSize: '13px', color: textColor, marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                  Tautan undangan
                </label>
                <div
                  style={{
                    backgroundColor: cardBg,
                    border: `1px dashed ${cardBorder}`,
                    borderRadius: '12px',
                    padding: '12px 14px',
                    color: subText,
                    fontSize: '13px',
                  }}
                >
                  Tautan akan dibuat otomatis setelah room disimpan
                </div>
              </div>
            </div>

            {/* Button: Buat room & generate link */}
            <div style={{ marginTop: '28px', textAlign: 'center' }}>
              <button
                onClick={handleCreate}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: btnBg,
                  color: btnText,
                  fontWeight: '700',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Buat room & generate link
              </button>
              <p style={{ fontSize: '11px', color: subText, marginTop: '10px' }}>
                Setelah dibuat, salin tautan untuk mengundang anggota ke room ini.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
