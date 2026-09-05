'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Edit2, Trash2, Bell, Edit3, Target, Undo2, Check, Clock } from 'lucide-react'
import { TargetItem, useAppStore, formatRupiah } from '@/lib/store'
import CatatTabunganModal from './CatatTabunganModal'
import EditTargetModal from './EditTargetModal'

interface Props {
  target: TargetItem | null
  onClose: () => void
}

/* Custom Circular Clock Dial Time Picker Component */
function CircularClockPicker({
  value,
  onChange,
  isDark,
}: {
  value: string
  onChange: (val: string) => void
  isDark: boolean
}) {
  const [mode, setMode] = useState<'hour' | 'minute'>('hour')

  const parts = value.split(':')
  const rawHour = parseInt(parts[0] || '12', 10)
  const rawMin = parseInt(parts[1] || '00', 10)

  const hour12 = rawHour % 12 === 0 ? 12 : rawHour % 12
  const isPm = rawHour >= 12

  const minRounded = Math.round(rawMin / 5) * 5

  const hoursList = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const minsList = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

  const handleSelectHour = (h: number) => {
    let newH = h
    if (isPm) {
      newH = h === 12 ? 12 : h + 12
    } else {
      newH = h === 12 ? 0 : h
    }
    const formatted = `${String(newH).padStart(2, '0')}:${String(rawMin).padStart(2, '0')}`
    onChange(formatted)
    setMode('minute') // Switch to minutes after selecting hour
  }

  const handleSelectMinute = (m: number) => {
    const formatted = `${String(rawHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    onChange(formatted)
  }

  const toggleAmPm = () => {
    let newH = rawHour
    if (isPm) {
      newH = rawHour - 12
    } else {
      newH = rawHour + 12
    }
    const formatted = `${String(newH).padStart(2, '0')}:${String(rawMin).padStart(2, '0')}`
    onChange(formatted)
  }

  const selectedIndex = mode === 'hour'
    ? hoursList.indexOf(hour12)
    : minsList.indexOf(minRounded % 60)

  const rotationDeg = selectedIndex >= 0 ? selectedIndex * 30 : 0

  const dialBg = isDark ? '#1E2028' : '#FAF6EF'
  const dialBorder = isDark ? '#333644' : '#E0D5C3'
  const accentColor = isDark ? '#7C8BFF' : '#2C2418'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const subText = isDark ? '#A0A5B5' : '#7A6F60'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '10px 0' }}>
      {/* Digital Display + Mode Switches + AM/PM */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: dialBg, padding: '6px 14px', borderRadius: '16px', border: `1px solid ${dialBorder}` }}>
          <button
            type="button"
            onClick={() => setMode('hour')}
            style={{
              background: mode === 'hour' ? accentColor : 'transparent',
              color: mode === 'hour' ? '#FFFFFF' : textColor,
              border: 'none',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '24px',
              fontWeight: '800',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            {String(hour12).padStart(2, '0')}
          </button>
          <span style={{ fontSize: '24px', fontWeight: '800', color: textColor }}>:</span>
          <button
            type="button"
            onClick={() => setMode('minute')}
            style={{
              background: mode === 'minute' ? accentColor : 'transparent',
              color: mode === 'minute' ? '#FFFFFF' : textColor,
              border: 'none',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '24px',
              fontWeight: '800',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            {String(rawMin).padStart(2, '0')}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            type="button"
            onClick={toggleAmPm}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              border: !isPm ? 'none' : `1px solid ${dialBorder}`,
              backgroundColor: !isPm ? accentColor : dialBg,
              color: !isPm ? '#FFFFFF' : subText,
              cursor: 'pointer',
            }}
          >
            AM
          </button>
          <button
            type="button"
            onClick={toggleAmPm}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              border: isPm ? 'none' : `1px solid ${dialBorder}`,
              backgroundColor: isPm ? accentColor : dialBg,
              color: isPm ? '#FFFFFF' : subText,
              cursor: 'pointer',
            }}
          >
            PM
          </button>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: subText, fontWeight: '600' }}>
        Putar/Pilih {mode === 'hour' ? 'Jam' : 'Menit'} pada jam bundar:
      </div>

      {/* Circular Clock Face Dial */}
      <div
        style={{
          width: '210px',
          height: '210px',
          borderRadius: '50%',
          backgroundColor: dialBg,
          border: `2px solid ${dialBorder}`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.06)',
          userSelect: 'none',
        }}
      >
        {/* Center Pivot Point */}
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: accentColor,
            position: 'absolute',
            zIndex: 10,
          }}
        />

        {/* Clock Hand Pointer */}
        <div
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '2px',
            height: '72px',
            marginLeft: '-1px',
            backgroundColor: accentColor,
            transformOrigin: 'bottom center',
            transform: `rotate(${rotationDeg}deg)`,
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          {/* Glowing knob at the tip of clock hand */}
          <div
            style={{
              position: 'absolute',
              top: '-16px',
              left: '-15px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              opacity: 0.35,
            }}
          />
        </div>

        {/* Dial Numbers */}
        {(mode === 'hour' ? hoursList : minsList).map((num, i) => {
          const angleRad = (i * 30 - 90) * (Math.PI / 180)
          const radius = 72
          const x = radius * Math.cos(angleRad)
          const y = radius * Math.sin(angleRad)
          const isSelected = mode === 'hour' ? hour12 === num : minRounded === num

          return (
            <button
              key={i}
              type="button"
              onClick={() => (mode === 'hour' ? handleSelectHour(num as number) : handleSelectMinute(num as number))}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}px - 16px)`,
                top: `calc(50% + ${y}px - 16px)`,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: isSelected ? accentColor : 'transparent',
                color: isSelected ? '#FFFFFF' : textColor,
                fontSize: '13px',
                fontWeight: isSelected ? '800' : '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 12,
                transition: 'all 0.15s ease',
              }}
            >
              {mode === 'hour' ? num : String(num).padStart(2, '0')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

import { useTranslation } from '@/lib/i18n'

export default function TargetDetailModal({ target, onClose }: Props) {
  const { deleteTarget, transactions, theme, showToast, currency, language } = useAppStore()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const [showCatatModal, setShowCatatModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Alarm settings state
  const [alarmEnabled, setAlarmEnabled] = useState(false)
  const [alarmTime, setAlarmTime] = useState('12:00')
  const [alarmDay, setAlarmDay] = useState('Minggu')
  const [isEditingAlarm, setIsEditingAlarm] = useState(false)

  if (!target) return null

  const targetTxList = transactions.filter((tx) => tx.targetId === target.id)
  const progressPct = Math.min(100, Math.round((target.currentAmount / target.targetAmount) * 100))
  const remaining = Math.max(0, target.targetAmount - target.currentAmount)

  // Calculate days remaining & rate per day
  let daysRemainingStr = '-'
  let ratePerDayStr = `${formatRupiah(0)} / ${t('detail.per_day') || 'day'}`
  if (target.deadlineDate) {
    const now = new Date()
    const deadline = new Date(target.deadlineDate)
    const diffMs = deadline.getTime() - now.getTime()
    const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
    daysRemainingStr = t('detail.days_remaining', { days: diffDays })

    if (remaining > 0) {
      const dailyRate = Math.ceil(remaining / diffDays)
      ratePerDayStr = `${formatRupiah(dailyRate)} / ${t('detail.per_day') || 'day'}`
    } else {
      ratePerDayStr = t('toast.target_achieved')
    }
  }

  const handleDelete = () => {
    deleteTarget(target.id)
    onClose()
  }

  const handleToggleAlarm = () => {
    const newState = !alarmEnabled
    setAlarmEnabled(newState)
    if (newState) {
      showToast('Pengingat Diaktifkan!', `Setiap ${alarmDay} jam ${alarmTime}`, 'info')
    } else {
      showToast('Pengingat Dinonaktifkan', '', 'info')
    }
  }

  const bg = isDark ? '#16171B' : '#FAF7F2'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const cardBg = isDark ? '#23242A' : '#FAF6EF'
  const cardBorder = isDark ? '#333644' : '#E0D5C3'
  const subText = isDark ? '#A0A5B5' : '#7A6F60'
  const accentIcon = isDark ? '#7C8BFF' : '#2C2418'
  const dividerBg = isDark ? '#32343E' : '#E0D5C3'

  const daysList = ['Setiap Hari', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: bg,
            color: textColor,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflowY: 'auto',
            zIndex: 101,
          }}
        >
          {/* Top Bar Header */}
          <div
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: bg,
              position: 'sticky',
              top: 0,
              zIndex: 10,
              borderBottom: `1px solid ${cardBorder}`,
            }}
          >
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: textColor, cursor: 'pointer', padding: '4px' }}
            >
              <ChevronLeft size={26} />
            </button>
            <h3
              style={{
                fontSize: '17px',
                fontWeight: '600',
                maxWidth: '220px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {target.title}
            </h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={() => setShowEditModal(true)}
                title="Edit Target Ini"
                style={{ background: 'none', border: 'none', color: accentIcon, cursor: 'pointer' }}
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={handleDelete}
                style={{ background: 'none', border: 'none', color: accentIcon, cursor: 'pointer' }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* Main Content Body */}
          <div style={{ padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Cover Photo */}
            <div
              style={{
                width: '100%',
                height: '240px',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
              }}
            >
              {target.coverImage ? (
                <img src={target.coverImage} alt={target.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: subText,
                    backgroundColor: cardBg,
                  }}
                >
                  <Target size={48} />
                </div>
              )}
            </div>

            {/* Card 1: Amount & Calculator Info */}
            <div
              style={{
                backgroundColor: cardBg,
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                border: `1px solid ${cardBorder}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
                    {formatRupiah(target.targetAmount)}
                  </h1>
                  <p style={{ fontSize: '14px', color: subText }}>{ratePerDayStr}</p>
                </div>
                {/* Progress Circle Badge */}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: `3px solid ${cardBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: subText,
                  }}
                >
                  {progressPct}%
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: dividerBg, margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <div>
                  <p style={{ color: subText, fontSize: '12px', marginBottom: '2px' }}>{t('detail.created_date') || 'Tanggal Dibuat'}</p>
                  <p style={{ fontWeight: '500' }}>
                    {new Date(target.startDate).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: subText, fontSize: '12px', marginBottom: '2px' }}>{t('detail.estimation') || 'Estimasi'}</p>
                  <p style={{ fontWeight: '500' }}>{daysRemainingStr}</p>
                </div>
              </div>
            </div>

            {/* Card 2: Interactive Alarm Setting Switch */}
            <div
              style={{
                backgroundColor: cardBg,
                borderRadius: '20px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                border: `1px solid ${cardBorder}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  onClick={() => setIsEditingAlarm(!isEditingAlarm)}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: isDark ? '#2D2F38' : '#EFEADF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: alarmEnabled ? accentIcon : subText,
                    }}
                  >
                    <Bell size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '700' }}>{alarmTime}</h4>
                      <Clock size={14} color={subText} />
                    </div>
                    <p style={{ fontSize: '12px', color: subText }}>{alarmDay} • Klik untuk atur waktu & hari</p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={handleToggleAlarm}
                  style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '999px',
                    backgroundColor: alarmEnabled ? (isDark ? '#7C8BFF' : '#2C2418') : (isDark ? '#3A3D4A' : '#DDD5C7'),
                    border: 'none',
                    position: 'relative',
                    cursor: 'pointer',
                    padding: '2px',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <motion.div
                    animate={{ x: alarmEnabled ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </button>
              </div>

              {/* Inline Editor with Circular Clock Picker & Day Pills */}
              {isEditingAlarm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    paddingTop: '14px',
                    borderTop: `1px solid ${dividerBg}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {/* Custom Circular Clock Dial Picker (Jam Bundar) */}
                  <CircularClockPicker
                    value={alarmTime}
                    onChange={(newVal) => setAlarmTime(newVal)}
                    isDark={isDark}
                  />

                  {/* Hari Pengingat (Pill Selector matching App UI) */}
                  <div>
                    <label style={{ fontSize: '12px', color: subText, marginBottom: '8px', display: 'block', fontWeight: '600' }}>
                      Hari Pengingat
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {daysList.map((d) => {
                        const isSelected = alarmDay === d
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setAlarmDay(d)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: isSelected ? '700' : '500',
                              border: isSelected ? 'none' : `1px solid ${cardBorder}`,
                              backgroundColor: isSelected ? (isDark ? '#7C8BFF' : '#2C2418') : (isDark ? '#191A23' : '#FAF6EF'),
                              color: isSelected ? '#FFFFFF' : subText,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              fontFamily: 'inherit',
                            }}
                          >
                            {d}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button
                      onClick={() => {
                        setIsEditingAlarm(false)
                        showToast('Waktu Pengingat Disimpan!', `Jam ${alarmTime} (${alarmDay})`, 'success')
                      }}
                      style={{
                        padding: '10px 22px',
                        borderRadius: '999px',
                        backgroundColor: isDark ? '#7C8BFF' : '#2C2418',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <Check size={16} /> Simpan Waktu
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Card 3: Terkumpul & Kekurangan & History List */}
            <div
              style={{
                backgroundColor: cardBg,
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                border: `1px solid ${cardBorder}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12px', color: subText, marginBottom: '4px' }}>{t('detail.collected')}</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#16A34A' }}>
                    {formatRupiah(target.currentAmount)}
                  </p>
                </div>
                <div style={{ width: '1px', backgroundColor: dividerBg }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12px', color: subText, marginBottom: '4px' }}>{t('detail.shortage')}</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#DC2626' }}>
                    {formatRupiah(remaining)}
                  </p>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: dividerBg }} />

              {/* Transactions List */}
              <div>
                {targetTxList.length === 0 ? (
                  <p style={{ textAlign: 'center', fontSize: '13px', color: subText, padding: '16px 0' }}>
                    {t('detail.no_transactions')}
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {targetTxList.map((tx) => (
                      <div
                        key={tx.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          borderRadius: '12px',
                          backgroundColor: isDark ? '#1E1F25' : '#EFEADF',
                        }}
                      >
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '600' }}>
                            {tx.type === 'setor' ? t('detail.deposit_label') : t('detail.withdraw_label')}
                          </p>
                          {tx.keterangan && (
                            <p style={{ fontSize: '11px', color: subText }}>{tx.keterangan}</p>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <p
                            style={{
                              fontSize: '14px',
                              fontWeight: '700',
                              color: tx.type === 'setor' ? '#16A34A' : '#DC2626',
                            }}
                          >
                            {tx.type === 'setor' ? '+' : '-'}{formatRupiah(tx.amount)}
                          </p>
                          {/* Undo button with curved arrow icon pointing left */}
                          <button
                            onClick={() => useAppStore.getState().undoTransaction(tx.id)}
                            title="Undo Transaksi Ini"
                            style={{
                              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                              border: 'none',
                              color: subText,
                              padding: '6px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Undo2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Floating Pencil Button */}
          <button
            onClick={() => setShowCatatModal(true)}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: 'max(20px, calc((100vw - 480px) / 2 + 20px))',
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: isDark ? '#7C8BFF' : '#2C2418',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              zIndex: 110,
            }}
          >
            <Edit3 size={24} />
          </button>

          {/* Catat Tabungan Modal */}
          <CatatTabunganModal
            isOpen={showCatatModal}
            onClose={() => setShowCatatModal(false)}
            targetId={target.id}
          />

          {/* Edit Target Modal */}
          <EditTargetModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            target={target}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
