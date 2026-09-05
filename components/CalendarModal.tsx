'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Plus } from 'lucide-react'
import { useAppStore, formatRupiah } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'

interface Props {
  isOpen: boolean
  onClose: () => void
  onOpenCreate: () => void
}

export default function CalendarModal({ isOpen, onClose, onOpenCreate }: Props) {
  const { targets, theme, currency, language } = useAppStore()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate())

  if (!isOpen) return null

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay()

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }

  // Find targets with deadlines in this month/year
  const getTargetsForDay = (day: number) => {
    const formattedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return targets.filter((t) => t.deadlineDate && t.deadlineDate.startsWith(formattedDateStr))
  }

  const selectedTargets = selectedDay ? getTargetsForDay(selectedDay) : []

  const bg = isDark ? '#1C1D22' : '#FAF6EF'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const cardBg = isDark ? '#262832' : '#EFEADF'
  const cardBorder = isDark ? '#353846' : '#E0D5C3'
  const subText = isDark ? '#A0A5B5' : '#7A6F60'
  const dayBg = isDark ? '#282A34' : '#FFFFFF'
  const todayBg = isDark ? '#373A4B' : '#FFE8C4'
  const selectedDayBg = isDark ? '#7C8BFF' : '#2C2418'
  const selectedDayText = '#FFFFFF'

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        {/* Backdrop */}
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

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '460px',
            backgroundColor: bg,
            color: textColor,
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
            border: `1px solid ${cardBorder}`,
            zIndex: 111,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {/* Top Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: cardBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarIcon size={24} color={textColor} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Kalender Target & Acara</h3>
                <p style={{ fontSize: '12px', color: subText }}>Pantau deadline & estimasi nabung</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: subText }}>
              <X size={20} />
            </button>
          </div>

          {/* Month Navigator Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: cardBg, borderRadius: '14px', marginBottom: '16px' }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: textColor }}>
              <ChevronLeft size={20} />
            </button>
            <span style={{ fontSize: '16px', fontWeight: '700' }}>
              {monthNames[month]} {year}
            </span>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: textColor }}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Days of week */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
            {dayNames.map((day) => (
              <span key={day} style={{ fontSize: '12px', fontWeight: '600', color: subText }}>
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '20px' }}>
            {/* Empty slots for previous month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: '42px' }} />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayTargets = getTargetsForDay(day)
              const hasTarget = dayTargets.length > 0
              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year
              const isSelected = selectedDay === day

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    height: '44px',
                    borderRadius: '12px',
                    border: isSelected ? `2px solid ${textColor}` : `1px solid ${cardBorder}`,
                    backgroundColor: isSelected ? selectedDayBg : isToday ? todayBg : dayBg,
                    color: isSelected ? selectedDayText : textColor,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: isToday || isSelected ? '700' : '500',
                    cursor: 'pointer',
                    position: 'relative',
                    fontFamily: 'inherit',
                  }}
                >
                  <span>{day}</span>
                  {hasTarget && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#FDE047' : '#EF4444',
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Selected Date Target Information */}
          {selectedDay !== null && (
            <div style={{ borderTop: `1.5px solid ${cardBorder}`, paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700' }}>
                  Target Tanggal {selectedDay} {monthNames[month]} {year}
                </h4>
                <button
                  onClick={onOpenCreate}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: cardBg,
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: textColor,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <Plus size={14} />
                  <span>Tambah</span>
                </button>
              </div>

              {selectedTargets.length === 0 ? (
                <div style={{ backgroundColor: cardBg, borderRadius: '14px', padding: '16px', textAlign: 'center', color: subText, fontSize: '13px' }}>
                  Tidak ada deadline target di tanggal ini.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedTargets.map((target) => {
                    const remaining = Math.max(0, target.targetAmount - target.currentAmount)
                    const isTetap = target.deadlineType === 'tetap'

                    return (
                      <div
                        key={target.id}
                        style={{
                          backgroundColor: dayBg,
                          borderRadius: '16px',
                          padding: '14px',
                          border: `1px solid ${cardBorder}`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '15px', fontWeight: '700' }}>{target.title}</span>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '3px 8px',
                              borderRadius: '999px',
                              fontWeight: '600',
                              backgroundColor: isTetap ? (isDark ? '#3D2626' : '#FEE2E2') : (isDark ? '#232A45' : '#E0E7FF'),
                              color: isTetap ? (isDark ? '#F56565' : '#991B1B') : (isDark ? '#8C9AFF' : '#3730A3'),
                            }}
                          >
                            {isTetap ? 'Deadline Tetap' : 'Fleksibel'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: subText }}>
                          <span>Target: {formatRupiah(target.targetAmount)}</span>
                          <span style={{ color: remaining === 0 ? '#16A34A' : textColor, fontWeight: '600' }}>
                            {remaining === 0 ? 'Tercapai' : `Sisa ${formatRupiah(remaining)}`}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
