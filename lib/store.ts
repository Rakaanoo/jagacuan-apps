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
  language: 'id' | 'en'
  activeToast: ToastData | null

  // Actions
  toggleTheme: () => void
  setLanguage: (lang: 'id' | 'en') => void
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
      activeToast: null,

      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'cream' : 'dark' })),
      setLanguage: (lang) => set({ language: lang }),
      showToast: (message, submessage, type = 'success') => set({ activeToast: { message, submessage, type } }),
      clearToast: () => set({ activeToast: null }),

      addTarget: (data) => {
        const newTarget: TargetItem = {
          ...data,
          id: crypto.randomUUID(),
          currentAmount: 0,
          isFinished: false,
          createdAt: new Date().toISOString(),
          deadlineType: data.deadlineType || 'fleksibel',
        }
        set((state) => ({ targets: [newTarget, ...state.targets] }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.target_created'), data.title, 'success')
      },

      updateTarget: (id, updated) => {
        set((state) => ({
          targets: state.targets.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.target_updated'), '', 'info')
      },

      deleteTarget: (id) => {
        set((state) => ({
          targets: state.targets.filter((t) => t.id !== id),
          transactions: state.transactions.filter((tx) => tx.targetId !== id),
        }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.target_deleted'), '', 'info')
      },

      addTransaction: (targetId, type, amount, keterangan) => {
        const newTx: TransactionRecord = {
          id: crypto.randomUUID(),
          targetId,
          type,
          amount,
          keterangan,
          date: new Date().toISOString(),
        }

        set((state) => {
          const updatedTargets = state.targets.map((target) => {
            if (target.id === targetId) {
              const delta = type === 'setor' ? amount : -amount
              const newCurrent = Math.max(0, target.currentAmount + delta)
              const isNowFinished = newCurrent >= target.targetAmount
              return { ...target, currentAmount: newCurrent, isFinished: isNowFinished }
            }
            return target
          })

          return {
            transactions: [newTx, ...state.transactions],
            targets: updatedTargets,
          }
        })

        const t = getTranslator(get().language)
        const currentTarget = get().targets.find((tgt) => tgt.id === targetId)
        if (type === 'setor') {
          if (currentTarget?.isFinished) {
            get().showToast(t('toast.target_achieved'), t('toast.target_achieved_sub', { title: currentTarget.title }), 'success')
          } else {
            get().showToast(t('toast.deposit_success'), t('toast.deposit_sub', { amount: formatRupiah(amount) }), 'success')
          }
        } else {
          get().showToast(t('toast.withdraw_success'), t('toast.withdraw_sub', { amount: formatRupiah(amount) }), 'info')
        }
      },

      undoTransaction: (transactionId) => {
        set((state) => {
          const tx = state.transactions.find((t) => t.id === transactionId)
          if (!tx) return state

          const updatedTargets = state.targets.map((target) => {
            if (target.id === tx.targetId) {
              const delta = tx.type === 'setor' ? -tx.amount : tx.amount
              const newCurrent = Math.max(0, target.currentAmount + delta)
              const isFinished = newCurrent >= target.targetAmount
              return { ...target, currentAmount: newCurrent, isFinished }
            }
            return target
          })

          return {
            transactions: state.transactions.filter((t) => t.id !== transactionId),
            targets: updatedTargets,
          }
        })
        const t = getTranslator(get().language)
        get().showToast(t('toast.undo_success'), '', 'info')
      },

      addNabarRoom: (roomData) => {
        const newRoom: NabarRoom = {
          ...roomData,
          id: crypto.randomUUID(),
          currentAmount: 0,
          membersCount: 1,
          members: [{ name: 'Saya', avatarBg: '#93C5FD' }],
          pendingMembers: [],
          recentActivities: [],
        }
        set((state) => ({ nabarRooms: [newRoom, ...state.nabarRooms] }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.nabar_created'), roomData.title, 'success')
      },

      addNabarTransaction: (roomId, amount, isIncome, name, action) => {
        set((state) => ({
          nabarRooms: state.nabarRooms.map((r) => {
            if (r.id === roomId) {
              const newCurrent = Math.max(0, r.currentAmount + (isIncome ? amount : -amount))
              return {
                ...r,
                currentAmount: newCurrent,
                recentActivities: [
                  { name, action, amount, isIncome, timeAgo: 'Baru saja' },
                  ...r.recentActivities,
                ],
              }
            }
            return r
          }),
        }))
        const t = getTranslator(get().language)
        get().showToast(t('toast.nabar_activity'), t('toast.nabar_activity_sub', { name, amount: formatRupiah(amount) }), 'success')
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

export const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val)
}
