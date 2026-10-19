'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart2,
  Clock,
  ArrowUpDown,
  Sparkles,
  X,
} from 'lucide-react'
import { useAppStore, formatRupiah, TargetItem, TransactionRecord } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'

interface Props {
  isOpen: boolean
  onClose: () => void
}

type StatPeriod = 'week' | 'month' | 'year'

export default function StatisticsModal({ isOpen, onClose }: Props) {
  const { targets, transactions, theme, currency, language } = useAppStore()
  const { t } = useTranslation()
  const isDark = theme === 'dark'

  const [period, setPeriod] = useState<StatPeriod>('week')

  if (!isOpen) return null

  const now = new Date()

  // Locale mapping for date formatting
  const localeMap: Record<string, string> = {
    id: 'id-ID',
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    it: 'it-IT',
    es: 'es-ES',
    ja: 'ja-JP',
    zh: 'zh-CN',
    th: 'th-TH',
    hi: 'hi-IN',
  }
  const currentLocale = localeMap[language] || 'id-ID'

  // 1. Filter transaksi sesuai periode
  let periodRangeText = ''
  let barLabels: string[] = []
  let barDepositCounts: number[] = []
  let barDepositAmounts: number[] = []
  let filteredTx: TransactionRecord[] = []

  if (period === 'week') {
    // 7 Hari Terakhir
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
    const startMonthStr = new Intl.DateTimeFormat(currentLocale, { month: 'short' }).format(startOfWeek)
    const endMonthStr = new Intl.DateTimeFormat(currentLocale, { month: 'short' }).format(now)

    periodRangeText = `${startOfWeek.getDate()} ${startMonthStr} - ${now.getDate()} ${endMonthStr} ${now.getFullYear()}`

    barLabels = []
    barDepositCounts = Array(7).fill(0)
    barDepositAmounts = Array(7).fill(0)

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i)
      const dayStr = new Intl.DateTimeFormat(currentLocale, { weekday: 'short' }).format(d)
      barLabels.push(dayStr)
    }

    filteredTx = transactions.filter((tx) => {
      const txDate = new Date(tx.date)
      return txDate >= startOfWeek && txDate <= new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    })

    filteredTx.forEach((tx) => {
      if (tx.type === 'setor') {
        const txDate = new Date(tx.date)
        const dDiff = Math.floor((txDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24))
        if (dDiff >= 0 && dDiff < 7) {
          barDepositCounts[dDiff]++
          barDepositAmounts[dDiff] += tx.amount
        }
      }
    })
  } else if (period === 'month') {
    // 1 Bulan (4-5 Minggu)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const monthStr = new Intl.DateTimeFormat(currentLocale, { month: 'short' }).format(now)
    periodRangeText = `1 ${monthStr} - ${endOfMonth.getDate()} ${monthStr} ${now.getFullYear()}`

    const prefix = language === 'id' ? 'M' : 'W'
    barLabels = [`${prefix}1`, `${prefix}2`, `${prefix}3`, `${prefix}4`, `${prefix}5`]
    barDepositCounts = Array(5).fill(0)
    barDepositAmounts = Array(5).fill(0)

    filteredTx = transactions.filter((tx) => {
      const txDate = new Date(tx.date)
      return txDate >= startOfMonth && txDate <= endOfMonth
    })

    filteredTx.forEach((tx) => {
      if (tx.type === 'setor') {
        const day = new Date(tx.date).getDate()
        const wIdx = Math.min(4, Math.floor((day - 1) / 7))
        barDepositCounts[wIdx]++
        barDepositAmounts[wIdx] += tx.amount
      }
    })
  } else {
    // 1 Tahun (12 Bulan)
    periodRangeText = t('stats.year_range', { year: now.getFullYear() })
    barLabels = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), i, 1)
      const mStr = new Intl.DateTimeFormat(currentLocale, { month: 'short' }).format(d)
      return (language === 'ja' || language === 'zh' || language === 'th') ? mStr : mStr.charAt(0)
    })
    barDepositCounts = Array(12).fill(0)
    barDepositAmounts = Array(12).fill(0)

    filteredTx = transactions.filter((tx) => {
      return new Date(tx.date).getFullYear() === now.getFullYear()
    })

    filteredTx.forEach((tx) => {
      if (tx.type === 'setor') {
        const mIdx = new Date(tx.date).getMonth()
        if (mIdx >= 0 && mIdx < 12) {
          barDepositCounts[mIdx]++
          barDepositAmounts[mIdx] += tx.amount
        }
      }
    })
  }

  // Hitung Metrik Batang
  const totalDeposits = filteredTx.filter((t) => t.type === 'setor').length
  const totalDepositAmount = filteredTx
    .filter((t) => t.type === 'setor')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalWithdrawals = filteredTx.filter((t) => t.type === 'tarik').length
  const totalWithdrawAmount = filteredTx
    .filter((t) => t.type === 'tarik')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalTx = totalDeposits + totalWithdrawals
  const activeSlots = barDepositCounts.filter((c) => c > 0).length
  const totalSlots = barDepositCounts.length
  const disciplinePct = totalSlots > 0 ? Math.min(100, Math.round((activeSlots / totalSlots) * 100)) : 0
  const avgPerSlot = totalSlots > 0 ? (totalDeposits / totalSlots).toFixed(1) : '0.0'
  const maxVal = Math.max(3, ...barDepositCounts)

  // Half-circle SVG math
  const depositRatio = totalTx > 0 ? totalDeposits / totalTx : 1.0
  const arcLength = Math.PI * 90 // half circumference = ~282.74
  const strokeDeposit = arcLength * depositRatio
  const strokeWithdraw = arcLength * (1 - depositRatio)

  // Theme Tokens
  const bg = isDark ? '#16171B' : '#FAF7F2'
  const cardBg = isDark ? '#23242A' : '#FAF6EF'
  const innerSurface = isDark ? '#1C1D22' : '#EFEADF'
  const cardBorder = isDark ? '#333644' : '#E0D5C3'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'

  // AI Insights
  const periodLabel =
    period === 'week'
      ? t('stats.period_1_week')
      : period === 'month'
      ? t('stats.period_1_month')
      : t('stats.period_1_year')

  // Find Peak Slot
  let peakSlot = ''
  let maxCount = 0
  for (let i = 0; i < barDepositCounts.length; i++) {
    if (barDepositCounts[i] > maxCount) {
      maxCount = barDepositCounts[i]
      peakSlot = barLabels[i]
    }
  }

  const aiInsights = [
    {
      icon: totalDeposits === 0 ? '📊' : disciplinePct >= 70 ? '🔥' : '📈',
      title:
        totalDeposits === 0
          ? t('stats.ai_discipline_title', { period: periodLabel })
          : disciplinePct >= 70
          ? t('stats.ai_high_discipline_title')
          : t('stats.ai_improve_title'),
      desc:
        totalDeposits === 0
          ? t('stats.ai_no_deposits')
          : disciplinePct >= 70
          ? t('stats.ai_high_discipline_desc', {
              active: activeSlots,
              total: totalSlots,
              percent: disciplinePct,
              peak: peakSlot,
              count: maxCount,
            })
          : t('stats.ai_improve_desc', {
              active: activeSlots,
              total: totalSlots,
              percent: disciplinePct,
              empty: totalSlots - activeSlots,
            }),
    },
    {
      icon: '🎯',
      title: (() => {
        if (targets.length === 0) return t('stats.ai_empty_title')
        const active = targets.filter((t) => !t.isFinished)
        if (active.length === 0) return t('stats.ai_all_done_title')
        const top = [...active].sort(
          (a, b) => b.targetAmount - b.currentAmount - (a.targetAmount - a.currentAmount)
        )[0]
        return t('stats.ai_priority_title', { title: top.title })
      })(),
      desc: (() => {
        if (targets.length === 0) return t('stats.ai_empty_desc')
        const active = targets.filter((t) => !t.isFinished)
        if (active.length === 0) return t('stats.ai_all_done_desc')
        const top = [...active].sort(
          (a, b) => b.targetAmount - b.currentAmount - (a.targetAmount - a.currentAmount)
        )[0]
        const sisa = Math.max(0, top.targetAmount - top.currentAmount)
        const dailyNeeded = Math.ceil(sisa / 30)
        return t('stats.ai_priority_desc', {
          remaining: formatRupiah(sisa),
          daily: formatRupiah(dailyNeeded),
        })
      })(),
    },
    {
      icon: totalWithdrawals > 0 ? '⚠️' : '✨',
      title: totalWithdrawals > 0 ? t('stats.ai_withdraw_title') : t('stats.ai_intact_title'),
      desc:
        totalWithdrawals > 0
          ? t('stats.ai_withdraw_desc', {
              count: totalWithdrawals,
              percent: Math.round((totalWithdrawals / totalTx) * 100),
            })
          : t('stats.ai_intact_desc'),
    },
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          className="relative w-full max-w-md rounded-3xl p-5 shadow-2xl border z-10 max-h-[90vh] overflow-y-auto"
          style={{
            backgroundColor: bg,
            borderColor: cardBorder,
            color: textColor,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border"
                style={{ backgroundColor: cardBg, borderColor: cardBorder }}
              >
                <BarChart2 size={20} className="text-[#10B981]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {t('stats.title')}
                </h3>
                <p className="text-[11px] text-white/50">
                  {t('stats.subtitle_new')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Period Selector Tabs */}
          <div
            className="flex p-1 rounded-2xl border mb-4"
            style={{ backgroundColor: innerSurface, borderColor: cardBorder }}
          >
            {(['week', 'month', 'year'] as StatPeriod[]).map((p) => {
              const label =
                p === 'week'
                  ? t('stats.period_1_week')
                  : p === 'month'
                  ? t('stats.period_1_month')
                  : t('stats.period_1_year')
              const active = period === p
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active ? 'bg-[#10B981] text-white shadow-sm' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* ======================================================== */}
          {/* CARD 1: KEDISIPLINAN MENABUNG (BAR CHART)               */}
          {/* ======================================================== */}
          <div
            className="p-4 rounded-3xl border mb-4"
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#7C8BFF]" />
                <span className="text-xs font-bold text-white">
                  {t('stats.discipline_title')}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-white/50 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                {period === 'week'
                  ? t('stats.badge_weekly')
                  : period === 'month'
                  ? t('stats.badge_monthly')
                  : t('stats.badge_yearly')}
              </span>
            </div>

            {/* Big Stat Value */}
            <div className="flex items-baseline justify-between mt-3 mb-1">
              <div>
                <p className="text-[11px] text-white/50">
                  {t('stats.total_deposit_label')}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">{totalDeposits}</span>
                  <span className="text-xs text-white/50 font-semibold">
                    {t('stats.times_deposit')}
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-[#10B981]">
                {formatRupiah(totalDepositAmount)}
              </span>
            </div>
            <p className="text-[10px] text-white/40 mb-4">{periodRangeText}</p>

            {/* Vertical Bar Chart */}
            <div className="relative h-36 flex flex-col justify-end pb-6">
              {/* Average Line */}
              {Number(avgPerSlot) > 0 && (
                <div
                  className="absolute left-0 right-7 border-t border-dashed border-[#7C8BFF]/40 flex items-center justify-end"
                  style={{
                    bottom: `${24 + (Number(avgPerSlot) / maxVal) * 100}px`,
                  }}
                >
                  <span className="text-[9px] font-bold text-[#7C8BFF] translate-y-[-10px] pr-1">
                    {avgPerSlot} avg
                  </span>
                </div>
              )}

              {/* Y-axis Ticks */}
              <div className="absolute right-0 top-0 bottom-6 flex flex-col justify-between text-[9px] text-white/40 font-mono">
                <span>{maxVal}</span>
                <span>{Math.round(maxVal / 2)}</span>
                <span>0</span>
              </div>

              {/* Bars Row */}
              <div className="flex items-end justify-between pr-7 gap-1.5 h-full">
                {barLabels.map((lbl, idx) => {
                  const cnt = barDepositCounts[idx]
                  const ratio = Math.max(0.06, cnt / maxVal)
                  const isPeak = cnt > 0 && cnt === Math.max(...barDepositCounts)

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isPeak
                            ? 'bg-gradient-to-t from-[#10B981] to-[#7C8BFF]'
                            : cnt > 0
                            ? 'bg-[#10B981]/50'
                            : 'bg-white/5'
                        }`}
                        style={{ height: `${ratio * 100}%` }}
                      />
                      <span
                        className={`text-[10px] mt-2 font-semibold ${
                          isPeak ? 'text-[#10B981] font-bold' : 'text-white/50'
                        }`}
                      >
                        {lbl}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 3 Metric Columns: Rutin, Rata-rata, Disiplin */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center sm:text-left">
              <div>
                <p className="text-[10px] text-white/40">{t('stats.metric_routine')}</p>
                <p className="text-xs font-bold text-white mt-0.5">
                  {t('stats.metric_days', { active: activeSlots, total: totalSlots })}
                </p>
                <p className="text-[9px] text-white/40">{t('stats.metric_active_days')}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40">{t('stats.metric_average')}</p>
                <p className="text-xs font-bold text-white mt-0.5">{avgPerSlot}x</p>
                <p className="text-[9px] text-white/40">{t('stats.metric_per_slot')}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40">{t('stats.metric_discipline')}</p>
                <p className="text-xs font-bold text-[#10B981] mt-0.5">{disciplinePct}%</p>
                <p className="text-[9px] text-white/40">{t('stats.metric_compliance')}</p>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 2: AKTIVITAS TRANSAKSI (SETENGAH BOLA / GAUGE)      */}
          {/* ======================================================== */}
          <div
            className="p-4 rounded-3xl border mb-4"
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-[#10B981]" />
                <span className="text-xs font-bold text-white">
                  {t('stats.activity_title')}
                </span>
              </div>
              <span className="text-[10px] text-white/50">{periodRangeText}</span>
            </div>

            {/* Setengah Bola Arc (SVG) */}
            <div className="flex flex-col items-center justify-center py-2 relative">
              <svg width="220" height="115" viewBox="0 0 220 115" className="overflow-visible">
                {/* Background Full Track Arc (180deg) */}
                <path
                  d="M 20 110 A 90 90 0 0 1 200 110"
                  fill="none"
                  stroke={isDark ? '#333644' : '#E0D5C3'}
                  strokeWidth="18"
                  strokeLinecap="round"
                />

                {/* Deposit Arc (Green) */}
                {totalTx > 0 && strokeDeposit > 0 && (
                  <path
                    d="M 20 110 A 90 90 0 0 1 200 110"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="18"
                    strokeDasharray={`${strokeDeposit} ${arcLength}`}
                    strokeLinecap="round"
                  />
                )}

                {/* Withdraw Arc (Red) */}
                {totalTx > 0 && strokeWithdraw > 0 && (
                  <path
                    d="M 20 110 A 90 90 0 0 1 200 110"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="18"
                    strokeDasharray={`${strokeWithdraw} ${arcLength}`}
                    strokeDashoffset={`-${strokeDeposit}`}
                    strokeLinecap="round"
                  />
                )}
              </svg>

              {/* Center Counter */}
              <div className="absolute bottom-2 flex flex-col items-center">
                <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">
                  {t('stats.total_transactions_center')}
                </span>
                <span className="text-3xl font-black text-white">{totalTx}</span>
              </div>
            </div>

            {/* Left & Right Legend Counters */}
            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/5 text-center">
              {/* Kolom Kiri: Setor (Deposit) */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>{t('stats.deposit_legend')}</span>
                </div>
                <span className="text-base font-extrabold text-white mt-0.5">
                  {t('stats.times_count', { count: totalDeposits })}
                </span>
                <span className="text-[11px] font-bold text-[#10B981]">
                  {formatRupiah(totalDepositAmount)}
                </span>
              </div>

              {/* Kolom Kanan: Tarik (Withdraw) */}
              <div className="flex flex-col items-center border-l border-white/5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <span>{t('stats.withdraw_legend')}</span>
                </div>
                <span className="text-base font-extrabold text-white mt-0.5">
                  {t('stats.times_count', { count: totalWithdrawals })}
                </span>
                <span className="text-[11px] font-bold text-[#EF4444]">
                  {formatRupiah(totalWithdrawAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 3: AI SMART FINANCIAL INSIGHTS & REMINDER          */}
          {/* ======================================================== */}
          <div
            className="p-4 rounded-3xl border space-y-2.5"
            style={{
              backgroundColor: isDark ? '#1C1914' : '#FEF7E0',
              borderColor: 'rgba(245, 158, 11, 0.35)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#F59E0B]" />
                <span className="text-xs font-bold text-[#F59E0B]">
                  {t('stats.ai_title')}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/15 px-2 py-0.5 rounded-full">
                {t('stats.ai_synced')}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {aiInsights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                  <span className="text-sm shrink-0">{item.icon}</span>
                  <p className="text-white/80">
                    <strong className="text-[#F59E0B] font-bold">{item.title}:</strong> {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
