'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, ArrowUp, Plus, X, Share2, UserPlus, Users, Download, Loader2, CheckCircle2, LogOut } from 'lucide-react'
import { useAppStore, formatRupiah } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import {
  getCurrentUser,
  getUserRooms,
  getRoomById,
  addRoomTransaction,
  approveMember,
  rejectMember,
  subscribeToRoom,
  SupabaseNabarRoom,
} from '@/lib/supabase/nabar'
import CreateNabarModal from './CreateNabarModal'
import GoogleSignInPrompt from './GoogleSignInPrompt'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function NabarRoomModal({ isOpen, onClose }: Props) {
  const { showToast, theme } = useAppStore()
  const isDark = theme === 'dark'

  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [rooms, setRooms] = useState<SupabaseNabarRoom[]>([])
  const [activeRoomIndex, setActiveRoomIndex] = useState(0)

  const [showCreateNabar, setShowCreateNabar] = useState(false)
  const [showQuickSetor, setShowQuickSetor] = useState(false)
  const [setorAmountStr, setSetorAmountStr] = useState('50.000')
  const [submittingSetor, setSubmittingSetor] = useState(false)

  const activeRoom = rooms[activeRoomIndex] || null

  const fetchNabarData = useCallback(async () => {
    if (!isOpen) return
    try {
      const usr = await getCurrentUser()
      setCurrentUser(usr)

      if (usr) {
        const userRooms = await getUserRooms()
        setRooms(userRooms)
      } else {
        setRooms([])
      }
    } catch (err) {
      console.error('Error fetching Nabar rooms:', err)
    } finally {
      setLoading(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      fetchNabarData()
    }
  }, [isOpen, fetchNabarData])

  // Realtime subscription setup
  useEffect(() => {
    if (!isOpen || !activeRoom) return

    const channel = subscribeToRoom(activeRoom.id, () => {
      getRoomById(activeRoom.id).then((updatedRoom) => {
        if (updatedRoom) {
          setRooms((prev) =>
            prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
          )
        }
      })
    })

    return () => {
      if (channel) channel.unsubscribe()
    }
  }, [isOpen, activeRoom?.id])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setCurrentUser(null)
    setRooms([])
    showToast('Berhasil Keluar', 'Akun Google telah terputus.', 'info')
  }

  const handleShareLink = () => {
    if (!activeRoom) return
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jagacuan.app'
    const inviteUrl = `${origin}/room/${activeRoom.id}?invite=true`
    navigator.clipboard.writeText(inviteUrl)
    showToast('Link Undangan Disalin!', 'Bagikan ke teman atau keluarga untuk bergabung', 'success')
  }

  const handleQuickSetor = async () => {
    const amt = parseInt(setorAmountStr.replace(/\D/g, ''), 10) || 0
    if (!activeRoom || amt <= 0) return

    setSubmittingSetor(true)
    try {
      await addRoomTransaction(activeRoom.id, amt, true, 'Setoran tabungan')
      setShowQuickSetor(false)
      showToast('Setoran berhasil!', `${formatRupiah(amt)} telah ditambahkan ke room.`, 'success')

      const updated = await getRoomById(activeRoom.id)
      if (updated) {
        setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      }
    } catch (err: any) {
      showToast('Gagal melakukan setoran:', err.message || 'Terjadi kesalahan', 'info')
    } finally {
      setSubmittingSetor(false)
    }
  }

  const handleApproveMember = async (memberUserId: string, name: string) => {
    if (!activeRoom) return
    try {
      await approveMember(activeRoom.id, memberUserId)
      showToast('Anggota disetujui!', `${name} resmi menjadi anggota ruang.`, 'success')

      const updated = await getRoomById(activeRoom.id)
      if (updated) {
        setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      }
    } catch (err: any) {
      showToast('Gagal menyetujui:', err.message, 'info')
    }
  }

  const handleRejectMember = async (memberUserId: string, name: string) => {
    if (!activeRoom) return
    try {
      await rejectMember(activeRoom.id, memberUserId)
      showToast('Permintaan ditolak', `Permintaan dari ${name} telah ditolak.`, 'info')

      const updated = await getRoomById(activeRoom.id)
      if (updated) {
        setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      }
    } catch (err: any) {
      showToast('Gagal menolak:', err.message, 'info')
    }
  }

  const exportCurrentData = () => {
    if (!activeRoom) return
    const data = {
      roomId: activeRoom.id,
      roomTitle: activeRoom.title,
      members: activeRoom.members.map((m) => ({ name: m.name, userId: m.userId })),
      transactions: activeRoom.recentActivities || [],
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jagacuan-room-${activeRoom.id}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Data berhasil diexport!', 'File JSON data room telah diunduh.', 'success')
  }

  const bg = isDark ? '#16171B' : '#FAF7F2'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const cardBg = isDark ? '#23242A' : '#FAF6EF'
  const cardBorder = isDark ? '#333644' : '#E0D5C3'
  const subText = isDark ? '#A0A5B5' : '#7A6F60'
  const accentCol = isDark ? '#7C8BFF' : '#2C2418'
  const btnBg = isDark ? '#7C8BFF' : '#2C2418'
  const btnText = '#FFFFFF'

  const userAvatarUrl = currentUser?.user_metadata?.avatar_url || currentUser?.user_metadata?.picture
  const userFullName = currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || 'Pengguna Google'

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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
              zIndex: 201,
            }}
          >
            {/* Top Bar Header */}
            <div
              style={{
                padding: '20px 20px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${cardBorder}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={22} color={accentCol} />
                <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.3px', margin: 0 }}>
                  Ruang Nabung
                </h2>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {activeRoom && (
                  <button
                    onClick={handleShareLink}
                    title="Bagikan Link Undangan"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      backgroundColor: cardBg,
                      border: `1px solid ${cardBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: accentCol,
                    }}
                  >
                    <Share2 size={18} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Tutup"
                  style={{ background: 'none', border: 'none', color: subText, cursor: 'pointer', padding: '4px' }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Main Content Body */}
            <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                  <Loader2 size={30} className="animate-spin" color={accentCol} />
                </div>
              ) : !currentUser ? (
                /* Auth prompt for non-logged-in users */
                <GoogleSignInPrompt
                  title="Tautkan Akun Google"
                  description="Untuk mengakses atau membuat Ruang Nabung (Nabar), silakan tautkan akun Google Anda terlebih dahulu."
                  onSuccess={fetchNabarData}
                />
              ) : (
                <>
                  {/* Google Account Profile Link Bar */}
                  <div
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: '16px',
                      padding: '12px 16px',
                      border: `1px solid ${cardBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: accentCol,
                          color: '#FFFFFF',
                          fontWeight: '700',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: `2px solid ${isDark ? '#333644' : '#E0D5C3'}`,
                        }}
                      >
                        {userAvatarUrl ? (
                          <img src={userAvatarUrl} alt={userFullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          userFullName[0]?.toUpperCase()
                        )}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '700' }}>{userFullName}</span>
                          <span
                            style={{
                              fontSize: '10px',
                              backgroundColor: '#16A34A',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '999px',
                              fontWeight: '600',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <CheckCircle2 size={10} /> Google
                          </span>
                        </div>
                        <p style={{ fontSize: '11px', color: subText, margin: 0 }}>{currentUser.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleSignOut}
                      title="Keluar / Putuskan Akun Google"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: subText,
                        cursor: 'pointer',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                      }}
                    >
                      <LogOut size={16} />
                    </button>
                  </div>

                  {rooms.length > 0 && activeRoom ? (
                    <>
                      {/* Room Switcher Tabs */}
                      {rooms.length > 1 && (
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                          {rooms.map((r, idx) => (
                            <button
                              key={r.id}
                              onClick={() => setActiveRoomIndex(idx)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '999px',
                                backgroundColor: activeRoomIndex === idx ? accentCol : cardBg,
                                color: activeRoomIndex === idx ? '#FFF' : textColor,
                                border: `1px solid ${cardBorder}`,
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {r.title}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Goal Card */}
                      <div
                        style={{
                          backgroundColor: cardBg,
                          borderRadius: '20px',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                          border: `1px solid ${cardBorder}`,
                          boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.04)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{ fontSize: '12px', color: subText, marginBottom: '2px', fontWeight: '500' }}>Target Kolaborasi</p>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{activeRoom.title}</h3>
                          </div>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '800',
                              color: accentCol,
                              backgroundColor: isDark ? '#1C1D22' : '#EFEADF',
                              padding: '4px 10px',
                              borderRadius: '999px',
                            }}
                          >
                            {Math.round((activeRoom.currentAmount / activeRoom.targetAmount) * 100)}%
                          </span>
                        </div>

                        <div>
                          <p style={{ fontSize: '13px', color: subText, marginBottom: '4px' }}>Total Saldo Terkumpul</p>
                          <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0 }}>
                            {formatRupiah(activeRoom.currentAmount)}
                          </h1>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div
                            style={{
                              height: '8px',
                              borderRadius: '999px',
                              backgroundColor: isDark ? '#1C1D22' : '#EFEADF',
                              overflow: 'hidden',
                              marginBottom: '8px',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${Math.round((activeRoom.currentAmount / activeRoom.targetAmount) * 100)}%`,
                                backgroundColor: accentCol,
                                borderRadius: '999px',
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: subText }}>
                            <span>Target: {formatRupiah(activeRoom.targetAmount)}</span>
                            <span>Sisa: {formatRupiah(Math.max(0, activeRoom.targetAmount - activeRoom.currentAmount))}</span>
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                          <button
                            onClick={() => setShowQuickSetor(!showQuickSetor)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              borderRadius: '12px',
                              border: 'none',
                              backgroundColor: btnBg,
                              color: btnText,
                              fontWeight: '700',
                              fontSize: '13px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              fontFamily: 'inherit',
                            }}
                          >
                            <Plus size={16} /> Setor ke Room
                          </button>

                          <button
                            onClick={handleShareLink}
                            style={{
                              padding: '12px 16px',
                              borderRadius: '12px',
                              border: `1px solid ${cardBorder}`,
                              backgroundColor: isDark ? '#1C1D22' : '#EFEADF',
                              color: textColor,
                              fontWeight: '600',
                              fontSize: '13px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontFamily: 'inherit',
                            }}
                          >
                            <UserPlus size={16} /> Undang
                          </button>
                        </div>

                        {/* Quick Setor Form */}
                        {showQuickSetor && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                              padding: '12px',
                              backgroundColor: isDark ? '#1C1D22' : '#EFEADF',
                              borderRadius: '14px',
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'center',
                            }}
                          >
                            <input
                              type="text"
                              value={setorAmountStr}
                              onChange={(e) => setSetorAmountStr(e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'))}
                              placeholder="Nominal Rp"
                              style={{
                                flex: 1,
                                backgroundColor: isDark ? '#23242A' : '#FFFFFF',
                                border: `1px solid ${cardBorder}`,
                                borderRadius: '10px',
                                padding: '8px 12px',
                                color: textColor,
                                fontSize: '14px',
                                outline: 'none',
                                fontFamily: 'inherit',
                              }}
                            />
                            <button
                              onClick={handleQuickSetor}
                              disabled={submittingSetor}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '10px',
                                backgroundColor: '#16A34A',
                                color: 'white',
                                fontWeight: '700',
                                border: 'none',
                                cursor: submittingSetor ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              {submittingSetor ? <Loader2 size={16} className="animate-spin" /> : 'Kirim'}
                            </button>
                          </motion.div>
                        )}
                      </div>

                      {/* Member Avatars & List with Google Profile Picture (PP) */}
                      <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '18px', border: `1px solid ${cardBorder}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>
                            Anggota ({activeRoom.membersCount})
                          </h4>
                          <button
                            onClick={handleShareLink}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              backgroundColor: isDark ? '#1C1D22' : '#EFEADF',
                              border: `1px solid ${cardBorder}`,
                              color: textColor,
                              fontSize: '11px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            + Undang
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {activeRoom.members.map((mem) => (
                            <div
                              key={mem.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: isDark ? '#1C1D22' : '#EFEADF',
                                padding: '6px 12px 6px 6px',
                                borderRadius: '999px',
                              }}
                            >
                              <div
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  backgroundColor: mem.avatarBg,
                                  color: 'white',
                                  fontWeight: '700',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  overflow: 'hidden',
                                  flexShrink: 0,
                                }}
                              >
                                {mem.avatarUrl ? (
                                  <img src={mem.avatarUrl} alt={mem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  mem.name[0]?.toUpperCase()
                                )}
                              </div>
                              <span style={{ fontSize: '13px', fontWeight: '600' }}>{mem.name}</span>
                              <span
                                style={{
                                  fontSize: '10px',
                                  backgroundColor: '#16A34A',
                                  color: 'white',
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                }}
                              >
                                Approved
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pending Member Approval List (for Owner) */}
                      {activeRoom.userStatus === 'owner' && activeRoom.pendingMembers.length > 0 && (
                        <div
                          style={{
                            backgroundColor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            borderRadius: '18px',
                            padding: '16px',
                          }}
                        >
                          <h4 style={{ fontSize: '14px', fontWeight: '700', color: textColor, marginBottom: '10px' }}>
                            Permintaan Bergabung ({activeRoom.pendingMembers.length})
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {activeRoom.pendingMembers.map((mem) => (
                              <div
                                key={mem.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  backgroundColor: isDark ? '#1C1D22' : '#EFEADF',
                                  padding: '10px 12px',
                                  borderRadius: '12px',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '50%',
                                      backgroundColor: mem.avatarBg,
                                      color: 'white',
                                      fontWeight: '700',
                                      fontSize: '12px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      overflow: 'hidden',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {mem.avatarUrl ? (
                                      <img src={mem.avatarUrl} alt={mem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      mem.name[0]?.toUpperCase()
                                    )}
                                  </div>
                                  <div>
                                    <span style={{ fontSize: '14px', fontWeight: '600', display: 'block' }}>{mem.name}</span>
                                    <span style={{ fontSize: '10px', backgroundColor: '#D97706', color: 'white', padding: '2px 6px', borderRadius: '6px' }}>
                                      Pending
                                    </span>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button
                                    onClick={() => handleApproveMember(mem.userId, mem.name)}
                                    style={{
                                      padding: '5px 12px',
                                      borderRadius: '8px',
                                      backgroundColor: '#16A34A',
                                      color: 'white',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      border: 'none',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Terima
                                  </button>
                                  <button
                                    onClick={() => handleRejectMember(mem.userId, mem.name)}
                                    style={{
                                      padding: '5px 12px',
                                      borderRadius: '8px',
                                      backgroundColor: '#DC2626',
                                      color: 'white',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      border: 'none',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Tolak
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Aktivitas Terbaru */}
                      <div
                        style={{
                          backgroundColor: cardBg,
                          borderRadius: '20px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                          border: `1px solid ${cardBorder}`,
                          boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.04)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0 }}>Aktivitas Terbaru</h4>
                        </div>

                        {activeRoom.recentActivities.length === 0 ? (
                          <p style={{ fontSize: '13px', color: subText }}>Belum ada aktivitas di room ini.</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {activeRoom.recentActivities.map((act) => (
                              <div key={act.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div
                                    style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '12px',
                                      backgroundColor: act.isIncome ? (isDark ? '#1C382A' : '#DDE7D8') : (isDark ? '#3D2626' : '#FDE8E8'),
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: act.isIncome ? '#16A34A' : '#DC2626',
                                      overflow: 'hidden',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {act.avatarUrl ? (
                                      <img src={act.avatarUrl} alt={act.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : act.isIncome ? (
                                      <ArrowDown size={18} />
                                    ) : (
                                      <ArrowUp size={18} />
                                    )}
                                  </div>
                                  <div>
                                    <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>{act.name} - {act.action}</p>
                                    <p style={{ fontSize: '11px', color: subText, margin: 0, marginTop: '2px' }}>{act.timeAgo}</p>
                                  </div>
                                </div>
                                <span
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    color: act.isIncome ? '#16A34A' : '#DC2626',
                                  }}
                                >
                                  {act.isIncome ? '+' : '-'}{formatRupiah(act.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Export Bar */}
                      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <button
                          onClick={exportCurrentData}
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '12px',
                            border: `1px solid ${cardBorder}`,
                            backgroundColor: cardBg,
                            color: textColor,
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <Download size={14} /> Export Data Room
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: subText }}>
                      <p style={{ fontSize: '14px', fontWeight: '500' }}>Belum ada room nabung kolaborasi.</p>
                    </div>
                  )}

                  {/* Add Room Button */}
                  <button
                    onClick={() => setShowCreateNabar(true)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: btnBg,
                      color: btnText,
                      fontWeight: '700',
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      marginTop: '10px',
                      fontFamily: 'inherit',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <Plus size={18} /> Buat Room Kolaborasi Baru
                  </button>
                </>
              )}
            </div>

            {/* Create Nabar Modal */}
            <CreateNabarModal
              isOpen={showCreateNabar}
              onClose={() => setShowCreateNabar(false)}
              onRoomCreated={fetchNabarData}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
