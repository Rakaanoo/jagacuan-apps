'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, CheckCircle2, Sparkles, X, Banknote } from 'lucide-react'
import { useAppStore, formatRupiah } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function StatisticsModal({ isOpen, onClose }: Props) {
  const { targets, transactions, theme, currency, language } = useAppStore()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  if (!isOpen) return null

  const totalSaved = targets.reduce((sum, t) => sum + t.currentAmount, 0)
  const totalTargetGoal = targets.reduce((sum, t) => sum + t.targetAmount, 0)
  const completedTargetsCount = targets.filter((t) => t.isFinished).length
  const activeTargetsCount = targets.filter((t) => !t.isFinished).length

  const overallProgressPct = totalTargetGoal > 0 ? Math.min(100, Math.round((totalSaved / totalTargetGoal) * 100)) : 0
  const depositTxCount = transactions.filter((tx) => tx.type === 'setor').length

  const getSmartInsight = () => {
    if (targets.length === 0) {
      return 'Buat celengan pertamamu sekarang untuk mulai melihat statistik dan estimasi pencapaian impianmu!'
    }
    const highestTarget = [...targets].sort((a, b) => (b.targetAmount - b.currentAmount) - (a.targetAmount - a.currentAmount))[0]
    if (highestTarget && highestTarget.targetAmount > highestTarget.currentAmount) {
      const remaining = highestTarget.targetAmount - highestTarget.currentAmount
      return `Jika kamu rutin menabung Rp 20.000 setiap hari, target "${highestTarget.title}" akan selesai dalam ${Math.ceil(remaining / 20000)} hari lagi!`
    }
    return 'Luar biasa! Semua target celengan kamu saat ini sudah berhasil tercapai!'
  }

  const bg = isDark ? '#1C1D22' : '#FAF6EF'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const cardBg = isDark ? '#262832' : '#EFEADF'
  const cardBorder = isDark ? '#353846' : '#E0D5C3'
  const subText = isDark ? '#A0A5B5' : '#7A6F60'
  const bannerBg = isDark ? '#282A34' : '#2C2418'
  const bannerText = '#FFFFFF'
  const metricCardBg = isDark ? '#232530' : '#FFFFFF'

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
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: cardBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart size={24} color={textColor} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Statistik & Insight</h3>
                <p style={{ fontSize: '12px', color: subText }}>Ringkasan kemajuan tabungan kamu</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: subText }}>
              <X size={20} />
            </button>
          </div>

          {/* Overall Saved Big Banner */}
          <div style={{ backgroundColor: bannerBg, color: bannerText, borderRadius: '20px', padding: '20px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px' }}>Total Uang Terkumpul</div>
            <div style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>{formatRupiah(totalSaved)}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px', opacity: '0.9' }}>
              <span>Dari total target: {formatRupiah(totalTargetGoal)}</span>
              <span style={{ fontWeight: '700', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '999px' }}>
                {overallProgressPct}%
              </span>
            </div>
            {/* Progress bar inside card */}
            <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${overallProgressPct}%`, backgroundColor: isDark ? '#7C8BFF' : '#FDE047', borderRadius: '999px' }} />
            </div>
          </div>

          {/* Smart Insight Card */}
          <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '16px', marginBottom: '16px', border: `1px solid ${cardBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: textColor, fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>
              <Sparkles size={18} color={isDark ? '#7C8BFF' : '#D97706'} />
              <span>Smart Insight</span>
            </div>
            <p style={{ fontSize: '13px', color: textColor, lineHeight: 1.5, margin: 0 }}>
              {getSmartInsight()}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ backgroundColor: metricCardBg, padding: '14px', borderRadius: '16px', border: `1px solid ${cardBorder}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDark ? '#7C8BFF' : '#D97706', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                <Banknote size={16} />
                <span>Frekuensi Menabung</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: textColor }}>{depositTxCount} Kali</div>
              <div style={{ fontSize: '11px', color: subText, marginTop: '2px' }}>Total catatan setoran</div>
            </div>

            <div style={{ backgroundColor: metricCardBg, padding: '14px', borderRadius: '16px', border: `1px solid ${cardBorder}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                <CheckCircle2 size={16} />
                <span>Target Selesai</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: textColor }}>{completedTargetsCount} Target</div>
              <div style={{ fontSize: '11px', color: subText, marginTop: '2px' }}>{activeTargetsCount} target masih aktif</div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
