'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Upload, Copy, Check, AlertCircle, X, ShieldCheck } from 'lucide-react'
import { useAppStore } from '@/lib/store'

interface Props {
  isOpen: boolean
  onClose: () => void
}

import { useTranslation } from '@/lib/i18n'

export default function BackupRestoreModal({ isOpen, onClose }: Props) {
  const { targets, transactions, nabarRooms, restoreData, theme, currency, language } = useAppStore()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const [activeTab, setActiveTab] = useState<'backup' | 'restore'>('backup')
  const [copied, setCopied] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (!isOpen) return null

  const getBackupData = () => {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        targets,
        transactions,
        nabarRooms,
      },
      null,
      2
    )
  }

  const handleDownloadFile = () => {
    const dataStr = getBackupData()
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `jagacuan-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setStatusMsg({ type: 'success', text: 'File cadangan JSON berhasil diunduh!' })
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(getBackupData())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setStatusMsg({ type: 'success', text: 'Kode cadangan berhasil disalin ke clipboard!' })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const parsed = JSON.parse(content)
        if (!parsed.targets || !Array.isArray(parsed.targets)) {
          throw new Error('Format file cadangan tidak valid!')
        }
        restoreData(parsed)
        setStatusMsg({ type: 'success', text: 'Data tabungan berhasil dipulihkan!' })
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: err.message || 'Gagal membaca file cadangan!' })
      }
    }
    reader.readAsText(file)
  }

  const handleRestoreText = () => {
    if (!jsonInput.trim()) {
      setStatusMsg({ type: 'error', text: 'Tempelkan kode JSON cadangan terlebih dahulu.' })
      return
    }

    try {
      const parsed = JSON.parse(jsonInput)
      if (!parsed.targets || !Array.isArray(parsed.targets)) {
        throw new Error('Format kode cadangan tidak valid!')
      }
      restoreData(parsed)
      setStatusMsg({ type: 'success', text: 'Data tabungan berhasil dipulihkan!' })
      setJsonInput('')
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Format kode JSON salah atau rusak!' })
    }
  }

  const bg = isDark ? '#1C1D22' : '#FAF6EF'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const cardBg = isDark ? '#262832' : '#EFEADF'
  const cardBorder = isDark ? '#353846' : '#E0D5C3'
  const subText = isDark ? '#A0A5B5' : '#7A6F60'
  const activeTabBg = isDark ? '#333644' : '#EFEADF'
  const inputBg = isDark ? '#191A23' : '#FFFFFF'
  const btnBg = isDark ? '#7C8BFF' : '#2C2418'
  const btnText = '#FFFFFF'

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(3px)' }}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '440px',
            backgroundColor: bg,
            color: textColor,
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            border: `1px solid ${cardBorder}`,
            zIndex: 201,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: cardBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: textColor,
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Backup & Restore</h3>
                <p style={{ fontSize: '12px', color: subText }}>Amankan atau pulihkan data tabunganmu</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: subText }}>
              <X size={22} />
            </button>
          </div>

          {/* Segmented Tabs */}
          <div
            style={{
              display: 'flex',
              backgroundColor: cardBg,
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '20px',
            }}
          >
            <button
              onClick={() => {
                setActiveTab('backup')
                setStatusMsg(null)
              }}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'backup' ? activeTabBg : 'transparent',
                color: textColor,
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Download size={16} /> Cadangkan Data
            </button>
            <button
              onClick={() => {
                setActiveTab('restore')
                setStatusMsg(null)
              }}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'restore' ? activeTabBg : 'transparent',
                color: textColor,
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Upload size={16} /> Pulihkan Data
            </button>
          </div>

          {/* Status Message Notification */}
          {statusMsg && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: statusMsg.type === 'success' ? (isDark ? '#1C382A' : '#DDE7D8') : (isDark ? '#3D2626' : '#FDE8E8'),
                color: statusMsg.type === 'success' ? (isDark ? '#48BB78' : '#2E6822') : (isDark ? '#F56565' : '#9B1C1C'),
              }}
            >
              <AlertCircle size={18} />
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Backup Tab Content */}
          {activeTab === 'backup' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '13px', color: subText, lineHeight: '1.5' }}>
                Simpan file cadangan JSON atau salin kodenya ke tempat aman (Catatan/WA) agar data tabunganmu bisa dipulihkan kapan saja.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={handleDownloadFile}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '14px',
                    borderRadius: '14px',
                    backgroundColor: btnBg,
                    color: btnText,
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <Download size={18} /> Unduh File Cadangan (.json)
                </button>

                <button
                  onClick={handleCopyJson}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '14px',
                    borderRadius: '14px',
                    backgroundColor: cardBg,
                    color: textColor,
                    border: `1px solid ${cardBorder}`,
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {copied ? <Check size={18} color="#16A34A" /> : <Copy size={18} />}
                  {copied ? 'Tersalin!' : 'Salin Teks Kode JSON'}
                </button>
              </div>

              <div style={{ fontSize: '12px', color: subText, backgroundColor: cardBg, borderRadius: '12px', padding: '12px', border: `1px solid ${cardBorder}` }}>
                <b>Ringkasan Data saat ini:</b>
                <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                  <li>{targets.length} Target celengan</li>
                  <li>{transactions.length} Catatan transaksi</li>
                  <li>{nabarRooms.length} Ruang Nabung bersama</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Restore Tab Content */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  border: `2px dashed ${cardBorder}`,
                  borderRadius: '16px',
                  backgroundColor: cardBg,
                  cursor: 'pointer',
                  textAlign: 'center',
                  gap: '8px',
                }}
              >
                <Upload size={28} color={textColor} />
                <span style={{ fontSize: '14px', fontWeight: '700' }}>Pilih File JSON Cadangan</span>
                <span style={{ fontSize: '12px', color: subText }}>Klik untuk mencari file backup dari HP/PC</span>
                <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: cardBorder }} />
                <span style={{ fontSize: '12px', color: subText, fontWeight: '600' }}>ATAU PASTE KODE</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: cardBorder }} />
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Tempelkan isi kode JSON cadangan di sini..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: inputBg,
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '12px',
                    padding: '12px',
                    color: textColor,
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'monospace',
                    resize: 'none',
                  }}
                />
                <button
                  onClick={handleRestoreText}
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: btnBg,
                    color: btnText,
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Pulihkan dari Kode Teks
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
