import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getTranslator } from '@/lib/i18n'

export interface TargetItem {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  startDate: string
  deadlineDate?: string
  deadlineType?: 'tetap' | 'fleksibel'
  note?: string
  coverImage?: string
  isFinished: boolean
  createdAt: string
  type: 'nabung' | 'berkala'
}

export interface TransactionRecord {
  id: string
  targetId: string
  type: 'setor' | 'tarik'
  amount: number
  keterangan?: string
  date: string
}

export interface NabarRoom {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  startDate?: string
  deadlineDate?: string
  note?: string
  coverImage?: string
  membersCount: number
  members: { name: string; avatarBg: string }[]
  pendingMembers?: string[]
  recentActivities: { name: string; action: string; amount: number; isIncome: boolean; timeAgo: string }[]
}

export type CurrencyCode = 'IDR' | 'USD' | 'EUR' | 'JPY' | 'CNY' | 'THB' | 'INR' | 'GBP'

export interface ToastData {
  message: string
  submessage?: string
  type?: 'success' | 'info'
}

interface AppState {
  targets: TargetItem[]
  transactions: TransactionRecord[]
  nabarRooms: NabarRoom[]
  theme: 'dark' | 'cream'
  language: 'id' | 'en' | 'de' | 'fr' | 'it' | 'es' | 'ja' | 'zh' | 'th' | 'hi'
  currency: CurrencyCode
  activeToast: ToastData | null

  // Actions
  toggleTheme: () => void
  setLanguage: (lang: 'id' | 'en' | 'de' | 'fr' | 'it' | 'es' | 'ja' | 'zh' | 'th' | 'hi') => void
  setCurrency: (cur: CurrencyCode) => void
  showToast: (message: string, submessage?: string, type?: 'success' | 'info') => void
  clearToast: () => void
  addTarget: (target: Omit<TargetItem, 'id' | 'createdAt' | 'currentAmount' | 'isFinished'>) => void
  updateTarget: (id: string, updated: Partial<TargetItem>) => void
  deleteTarget: (id: string) => void
  addTransaction: (targetId: string, type: 'setor' | 'tarik', amount: number, keterangan?: string) => void
  undoTransaction: (transactionId: string) => void
  addNabarRoom: (room: Omit<NabarRoom, 'id' | 'currentAmount' | 'membersCount' | 'members' | 'recentActivities'>) => void
  addNabarTransaction: (roomId: string, amount: number, isIncome: boolean, name: string, action: string) => void
  joinNabarRoom: (roomId: string, name: string) => void
  approveNabarMember: (roomId: string, memberName: string) => void
  rejectNabarMember: (roomId: string, memberName: string) => void
  restoreData: (data: { targets?: TargetItem[]; transactions?: TransactionRecord[]; nabarRooms?: NabarRoom[] }) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      targets: [],
      transactions: [],
      nabarRooms: [
        {
          id: 'demo-nabar-1',
          title: 'Liburan Bali',
          targetAmount: 8000000,
          currentAmount: 4850000,
          startDate: '2026-08-01',
          deadlineDate: '2026-12-31',
          membersCount: 3,
          members: [
            { name: 'Saya', avatarBg: '#93C5FD' },
            { name: 'Nadia', avatarBg: '#86EFAC' },
            { name: 'Rafi', avatarBg: '#FDE047' },
          ],
          pendingMembers: ['Budi', 'Siti'],
          recentActivities: [
            { name: 'Nadia', action: 'Nadia menabung', amount: 250000, isIncome: true, timeAgo: 'Hari ini, 09.42' },
            { name: 'Rafi', action: 'Rafi beli tiket', amount: 180000, isIncome: false, timeAgo: 'Kemarin, 18.10' },
          ],
        },
      ],
      theme: 'dark',
      language: 'id',
      currency: 'IDR',
      activeToast: null,

      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'cream' : 'dark' })),
      setLanguage: (lang) => set({ language: lang }),
      setCurrency: (cur) => set({ currency: cur }),
      showToast: (message, submessage = '', type = 'success') =>
        set({ activeToast: { message, submessage, type } }),
      clearToast: () => set({ activeToast: null }),

      addTarget: (target) => {
        const id = 'target-' + Date.now()
        const newTarget: TargetItem = {
          ...target,
          id,
          currentAmount: 0,
          isFinished: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ targets: [newTarget, ...state.targets] }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.target_created'), target.title, 'success')
      },

      updateTarget: (id, updated) => {
        set((state) => ({
          targets: state.targets.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.target_updated'), '', 'success')
      },

      deleteTarget: (id) => {
        set((state) => ({
          targets: state.targets.filter((t) => t.id !== id),
          transactions: state.transactions.filter((tx) => tx.targetId !== id),
        }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.target_deleted'), '', 'info')
      },

      addTransaction: (targetId, type, amount, keterangan = '') => {
        const id = 'tx-' + Date.now()
        const newTx: TransactionRecord = {
          id,
          targetId,
          type,
          amount,
          keterangan,
          date: new Date().toISOString(),
        }
        set((state) => {
          const updatedTargets = state.targets.map((t) => {
            if (t.id === targetId) {
              const newAmount =
                type === 'setor'
                  ? t.currentAmount + amount
                  : Math.max(0, t.currentAmount - amount)
              const isFinished = newAmount >= t.targetAmount
              return { ...t, currentAmount: newAmount, isFinished }
            }
            return t
          })
          return {
            transactions: [newTx, ...state.transactions],
            targets: updatedTargets,
          }
        })
        const target = get().targets.find((t) => t.id === targetId)
        const t = getTranslator(get().language)
        if (target && target.currentAmount >= target.targetAmount) {
          get().showToast(t('toast.target_achieved'), t('toast.target_achieved_sub', { title: target.title }), 'success')
        } else if (type === 'setor') {
          get().showToast(t('toast.deposit_success'), t('toast.deposit_sub', { amount: formatCurrency(amount, get().currency) }), 'success')
        } else {
          get().showToast(t('toast.withdraw_success'), t('toast.withdraw_sub', { amount: formatCurrency(amount, get().currency) }), 'info')
        }
      },

      undoTransaction: (transactionId) => {
        const tx = get().transactions.find((t) => t.id === transactionId)
        if (!tx) return
        set((state) => {
          const updatedTargets = state.targets.map((t) => {
            if (t.id === tx.targetId) {
              const newAmount =
                tx.type === 'setor'
                  ? Math.max(0, t.currentAmount - tx.amount)
                  : t.currentAmount + tx.amount
              const isFinished = newAmount >= t.targetAmount
              return { ...t, currentAmount: newAmount, isFinished }
            }
            return t
          })
          return {
            transactions: state.transactions.filter((t) => t.id !== transactionId),
            targets: updatedTargets,
          }
        })
        const t = getTranslator(get().language)
        get().showToast(t('toast.undo_success'), '', 'info')
      },

      addNabarRoom: (room) => {
        const id = 'nabar-' + Date.now()
        const newRoom: NabarRoom = {
          ...room,
          id,
          currentAmount: 0,
          membersCount: 1,
          members: [{ name: 'Saya (Owner)', avatarBg: '#93C5FD' }],
          recentActivities: [],
        }
        set((state) => ({ nabarRooms: [newRoom, ...state.nabarRooms] }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.nabar_created'), room.title, 'success')
      },

      addNabarTransaction: (roomId, amount, isIncome, name, action) => {
        const timeAgoStr = 'Baru saja'
        set((state) => ({
          nabarRooms: state.nabarRooms.map((r) => {
            if (r.id === roomId) {
              const newAmount = isIncome
                ? r.currentAmount + amount
                : Math.max(0, r.currentAmount - amount)
              return {
                ...r,
                currentAmount: newAmount,
                recentActivities: [
                  { name, action, amount, isIncome, timeAgo: timeAgoStr },
                  ...r.recentActivities,
                ],
              }
            }
            return r
          }),
        }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.nabar_activity'), t('toast.nabar_activity_sub', { name, amount: formatCurrency(amount, get().currency) }), 'success')
      },

      joinNabarRoom: (roomId, name) => {
        set((state) => ({
          nabarRooms: state.nabarRooms.map((r) => {
            if (r.id === roomId) {
              const pending = r.pendingMembers || []
              if (!pending.includes(name)) {
                return { ...r, pendingMembers: [...pending, name] }
              }
            }
            return r
          }),
        }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.join_sent'), t('toast.join_sent_sub'), 'info')
      },

      approveNabarMember: (roomId, memberName) => {
        const colors = ['#FCA5A5', '#FDBA74', '#FDE047', '#86EFAC', '#93C5FD', '#C084FC']
        const randomBg = colors[Math.floor(Math.random() * colors.length)]

        set((state) => ({
          nabarRooms: state.nabarRooms.map((r) => {
            if (r.id === roomId) {
              const pending = (r.pendingMembers || []).filter((m) => m !== memberName)
              return {
                ...r,
                membersCount: r.membersCount + 1,
                members: [...r.members, { name: memberName, avatarBg: randomBg }],
                pendingMembers: pending,
              }
            }
            return r
          }),
        }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.member_approved'), t('toast.member_approved_sub', { name: memberName }), 'success')
      },

      rejectNabarMember: (roomId, memberName) => {
        set((state) => ({
          nabarRooms: state.nabarRooms.map((r) => {
            if (r.id === roomId) {
              const pending = (r.pendingMembers || []).filter((m) => m !== memberName)
              return { ...r, pendingMembers: pending }
            }
            return r
          }),
        }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.member_rejected'), t('toast.member_rejected_sub', { name: memberName }), 'info')
      },

      restoreData: (data) => {
        set((state) => ({
          targets: data.targets || state.targets,
          transactions: data.transactions || state.transactions,
          nabarRooms: data.nabarRooms || state.nabarRooms,
        }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.data_restored'), '', 'success')
      },
    }),
    { name: 'jagacuan-store-v4' }
  )
)

export const exchangeRates: Record<CurrencyCode, number> = {
  IDR: 1,
  USD: 1 / 15500, // 1 USD = 15.500 IDR
  EUR: 1 / 17000, // 1 EUR = 17.000 IDR
  JPY: 1 / 105,   // 1 JPY = 105 IDR
  CNY: 1 / 2150,  // 1 CNY = 2.150 IDR
  THB: 1 / 450,   // 1 THB = 450 IDR
  INR: 1 / 185,   // 1 INR = 185 IDR
  GBP: 1 / 20000, // 1 GBP = 20.000 IDR
}

export const currencySymbolMap: Record<CurrencyCode, string> = {
  IDR: 'Rp',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  CNY: '¥',
  THB: '฿',
  INR: '₹',
  GBP: '£',
}

// Convert user input entered in `activeCurrency` into base IDR amount
export const toBaseIDR = (amountInActiveCurrency: number, currency: CurrencyCode = 'IDR'): number => {
  const rate = exchangeRates[currency] || 1
  return Math.round(amountInActiveCurrency / rate)
}

// Convert base IDR amount into active currency amount (numeric)
export const fromBaseIDR = (baseAmountIDR: number, currency: CurrencyCode = 'IDR'): number => {
  const rate = exchangeRates[currency] || 1
  return baseAmountIDR * rate
}

export const formatCurrency = (val: number, currency: CurrencyCode = 'IDR') => {
  const localeMap: Record<CurrencyCode, string> = {
    IDR: 'id-ID',
    USD: 'en-US',
    EUR: 'de-DE',
    JPY: 'ja-JP',
    CNY: 'zh-CN',
    THB: 'th-TH',
    INR: 'hi-IN',
    GBP: 'en-GB',
  }
  const rate = exchangeRates[currency] || 1
  const converted = val * rate
  const locale = localeMap[currency] || 'id-ID'

  const maxDecimals = currency === 'IDR' || currency === 'JPY' ? 0 : 2

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  }).format(converted)
}

export const formatRupiah = (val: number) => {
  const currentCurrency = useAppStore.getState().currency || 'IDR'
  return formatCurrency(val, currentCurrency)
}


