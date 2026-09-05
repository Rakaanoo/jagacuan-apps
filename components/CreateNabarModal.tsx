'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { getCurrentUser, createRoom } from '@/lib/supabase/nabar'
import GoogleSignInPrompt from '@/components/GoogleSignInPrompt'

interface Props {
  isOpen: boolean
  onClose: () => void
  onRoomCreated?: (roomId: string) => void
}

import { useTranslation } from '@/lib/i18n'

export default function CreateNabarModal({ isOpen, onClose, onRoomCreated }: Props) {
  const { theme, showToast, currency, language } = useAppStore()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [title, setTitle] = useState('')
  const [targetAmountStr, setTargetAmountStr] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [deadlineDate, setDeadlineDate] = useState('')
  const [note, setNote] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setLoadingUser(true)
      getCurrentUser()
        .then((usr) => setUser(usr))
        .catch(() => setUser(null))
        .finally(() => setLoadingUser(false))
    }
  }, [isOpen])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setCoverImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCreate = async () => {
    const amount = parseInt(targetAmountStr.replace(/\D/g, ''), 10) || 8000000
    if (!title.trim()) return

    setSubmitting(true)

    try {
      const room = await createRoom({
        title,
        targetAmount: amount,
        startDate: startDate || undefined,
        deadlineDate: deadlineDate || undefined,
        note,
        coverImage: coverImage || undefined,
      })

      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jagacuan.app'
      const inviteUrl = `${origin}/room/${room.id}?invite=true`
      navigator.clipboard.writeText(inviteUrl)

      showToast('Ruang Nabung Berhasil Dibuat!', 'Link undangan telah disalin ke clipboard.', 'success')

      setTitle('')
      setTargetAmountStr('')
      setNote('')
      setCoverImage(null)

      if (onRoomCreated) onRoomCreated(room.id)
      onClose()
    } catch (err: any) {
      showToast('Gagal membuat ruang:', err.message || 'Terjadi kesalahan', 'info')
    } finally {
      setSubmitting(false)
    }
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
  const btnSaveBg = isDark ? '#7C8BFF' : '#2C2418'

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
                aria-label="Tutup"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'none',
                  border: 'none',
                  color: subText,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
                Buat Ruang Nabung Bareng
              </h2>
              <p style={{ fontSize: '13px', color: subText }}>
                Buat tabungan kolaborasi dan undang teman atau keluarga.
              </p>
            </div>

            {loadingUser ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <Loader2 size={24} className="animate-spin" color={accentCol} />
              </div>
            ) : !user ? (
              <GoogleSignInPrompt
                title="Login Diperlukan"
                description="Untuk membuat Ruang Nabung dan mengundang teman, silakan login dengan akun Google Anda."
              />
            ) : (
              <>
                {/* Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Foto Cover (Opsional) */}
                  <div>
                    <label style={{ fontSize: '13px', color: textColor, marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                      Foto Cover (opsional)
                    </label>
                    {coverImage ? (
                      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '130px' }}>
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px 16px',
                          borderRadius: '14px',
                          border: `1.5px dashed ${borderCol}`,
                          backgroundColor: inputBg,
                          cursor: 'pointer',
                        }}
                      >
                        <ImageIcon size={22} color={accentCol} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: textColor }}>Pilih foto cover</p>
                          <p style={{ fontSize: '11px', color: subText }}>PNG atau JPG (maks. 5MB)</p>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>

                  {/* Nama Tabungan Kolaborasi */}
                  <div>
                    <label style={{ fontSize: '13px', color: textColor, marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                      Nama Tabungan Kolaborasi
                    </label>
                    <div
                      style={{
                        backgroundColor: inputBg,
                        border: `1px solid ${borderCol}`,
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

                  {/* Target Jumlah (Rp) */}
                  <div>
                    <label style={{ fontSize: '13px', color: textColor, marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                      Target Jumlah (Rp)
                    </label>
                    <div
                      style={{
                        backgroundColor: inputBg,
                        border: `1px solid ${borderCol}`,
                        borderRadius: '12px',
                        padding: '12px 14px',
                      }}
                    >
                      <input
                        type="text"
                        placeholder="8.000.000"
                        value={targetAmountStr}
                        onChange={(e) => setTargetAmountStr(formatNumberInput(e.target.value))}
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

                  {/* Tanggal Mulai */}
                  <div>
                    <label style={{ fontSize: '13px', color: textColor, marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                      Tanggal Mulai
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: inputBg,
                        border: `1px solid ${borderCol}`,
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

                  {/* Target Tanggal Selesai (opsional) */}
                  <div>
                    <label style={{ fontSize: '13px', color: textColor, marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                      Target Tanggal Selesai (opsional)
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: inputBg,
                        border: `1px solid ${borderCol}`,
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

                  {/* Catatan (opsional) */}
                  <div>
                    <label style={{ fontSize: '13px', color: textColor, marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                      Catatan (opsional)
                    </label>
                    <div
                      style={{
                        backgroundColor: inputBg,
                        border: `1px solid ${borderCol}`,
                        borderRadius: '12px',
                        padding: '12px 14px',
                      }}
                    >
                      <textarea
                        rows={3}
                        placeholder="Tulis motivasi atau catatan bersama..."
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
                </div>

                {/* Submit Button */}
                <div style={{ marginTop: '24px' }}>
                  <button
                    onClick={handleCreate}
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: btnSaveBg,
                      color: '#FFFFFF',
                      fontWeight: '700',
                      fontSize: '15px',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Membuat Room...</span>
                      </>
                    ) : (
                      <span>Buat Room & Salin Link</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
