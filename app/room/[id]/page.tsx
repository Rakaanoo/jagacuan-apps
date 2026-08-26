'use client'

import { use, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, ArrowLeft, CheckCircle2, Clock, Plus, Share2, Loader2 } from 'lucide-react'
import { useAppStore, formatRupiah } from '@/lib/store'
import {
  getCurrentUser,
  getRoomById,
  requestJoinRoom,
  addRoomTransaction,
  approveMember,
  rejectMember,
  subscribeToRoom,
  SupabaseNabarRoom,
} from '@/lib/supabase/nabar'
import GoogleSignInPrompt from '@/components/GoogleSignInPrompt'
import ToastNotification from '@/components/ToastNotification'

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const roomId = resolvedParams.id

  const searchParams = useSearchParams()
  const isInvite = searchParams.get('invite') === 'true'

  const router = useRouter()
  const { theme, showToast } = useAppStore()
  const isDark = theme === 'dark'

  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [room, setRoom] = useState<SupabaseNabarRoom | null>(null)
  const [joining, setJoining] = useState(false)

  // Quick Setor State
  const [showQuickSetor, setShowQuickSetor] = useState(false)
  const [setorAmountStr, setSetorAmountStr] = useState('50.000')

  const fetchRoomData = useCallback(async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)

      const roomData = await getRoomById(roomId)
      setRoom(roomData)
    } catch (err) {
      console.error('Error fetching room:', err)
    } finally {
      setLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    fetchRoomData()

    // Realtime listener
    const channel = subscribeToRoom(roomId, () => {
      fetchRoomData()
    })

    return () => {
      if (channel) channel.unsubscribe()
    }
  }, [roomId, fetchRoomData])

  const handleRequestJoin = async () => {
    if (!currentUser) return
    setJoining(true)
    try {
      await requestJoinRoom(roomId)
      showToast('Permintaan bergabung terkirim!', 'Tunggu pemilik ruang menyetujui permintaan Anda.', 'success')
      await fetchRoomData()
    } catch (err: any) {
      showToast('Gagal mengajukan:', err.message || 'Terjadi kesalahan', 'info')
    } finally {
      setJoining(false)
    }
  }

  const handleQuickSetor = async () => {
    const amt = parseInt(setorAmountStr.replace(/\D/g, ''), 10) || 0
    if (!room || amt <= 0) return

    try {
      await addRoomTransaction(room.id, amt, true, 'Setoran tabungan')
      setShowQuickSetor(false)
      showToast('Setoran berhasil!', `${formatRupiah(amt)} telah ditambahkan ke room.`, 'success')
      await fetchRoomData()
    } catch (err: any) {
      showToast('Gagal melempar transaksi:', err.message, 'info')
    }
  }

  const handleApprove = async (memberUserId: string, name: string) => {
    if (!room) return
    try {
      await approveMember(room.id, memberUserId)
      showToast('Anggota disetujui!', `${name} resmi menjadi anggota ruang.`, 'success')
      await fetchRoomData()
    } catch (err: any) {
      showToast('Gagal menyetujui:', err.message, 'info')
    }
  }

  const handleReject = async (memberUserId: string, name: string) => {
    if (!room) return
    try {
      await rejectMember(room.id, memberUserId)
      showToast('Permintaan ditolak', `Permintaan dari ${name} telah ditolak.`, 'info')
      await fetchRoomData()
    } catch (err: any) {
      showToast('Gagal menolak:', err.message, 'info')
    }
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const inviteUrl = `${window.location.origin}/room/${roomId}?invite=true`
      navigator.clipboard.writeText(inviteUrl)
      showToast('Link Undangan Disalin!', 'Bagikan ke teman atau keluarga untuk bergabung', 'success')
    }
  }

  const bg = isDark ? '#16171B' : '#FAF7F2'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const cardBg = isDark ? '#23242A' : '#FAF6EF'
  const cardBorder = isDark ? '#333644' : '#E0D5C3'
  const subText = isDark ? '#A0A5B5' : '#7A6F60'
  const accentCol = isDark ? '#7C8BFF' : '#2C2418'
  const btnBg = isDark ? '#7C8BFF' : '#2C2418'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="animate-spin" color={accentCol} />
      </div>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: bg,
        color: textColor,
        maxWidth: '480px',
        margin: '0 auto',
        position: 'relative',
        paddingBottom: '40px',
      }}
    >
      <ToastNotification />

      {/* Top Bar */}
      <header
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${cardBorder}`,
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: textColor, textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
          <ArrowLeft size={20} />
          <span>Kembali ke Beranda</span>
        </Link>
        <button
          onClick={handleShare}
          style={{ background: 'none', border: 'none', color: accentCol, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Share2 size={18} />
        </button>
      </header>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {!currentUser ? (
          /* User Not Logged In */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: cardBg, border: `1px solid ${cardBorder}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Users size={32} color={accentCol} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px' }}>Undangan Ruang Nabung</h2>
              <p style={{ fontSize: '14px', color: subText }}>
                {isInvite ? 'Seseorang mengundang Anda untuk bergabung di Ruang Nabung kolaborasi.' : 'Masuk untuk mengakses Ruang Nabung.'}
              </p>
            </div>

            <GoogleSignInPrompt
              title="Login dengan Google"
              description="Masuk untuk bergabung atau melihat detail Ruang Nabung ini."
              redirectTo={`/room/${roomId}?invite=true`}
            />
          </div>
        ) : !room ? (
          /* Room Not Found */
          <div style={{ textAlign: 'center', padding: '60px 0', color: subText }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: textColor }}>Ruang tidak ditemukan</h3>
            <p style={{ fontSize: '14px', marginTop: '6px' }}>Link ruang mungkin sudah tidak berlaku atau salah.</p>
          </div>
        ) : room.userStatus === 'none' ? (
          /* Logged In, but Not a Member Yet */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            <div
              style={{
                backgroundColor: cardBg,
                borderRadius: '24px',
                padding: '24px',
                border: `1px solid ${cardBorder}`,
                textAlign: 'center',
              }}
            >
              {room.coverImage && (
                <div style={{ borderRadius: '16px', overflow: 'hidden', height: '140px', marginBottom: '16px' }}>
                  <img src={room.coverImage} alt={room.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 8px' }}>{room.title}</h2>
              <p style={{ fontSize: '13px', color: subText, marginBottom: '16px' }}>
                Target Total: <strong>{formatRupiah(room.targetAmount)}</strong>
              </p>

              {room.note && (
                <p style={{ fontSize: '13px', fontStyle: 'italic', color: subText, backgroundColor: isDark ? '#1C1D22' : '#EFEADF', padding: '10px 14px', borderRadius: '12px', marginBottom: '20px' }}>
                  "{room.note}"
                </p>
              )}

              <button
                onClick={handleRequestJoin}
                disabled={joining}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: btnBg,
                  color: '#FFF',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: joining ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                }}
              >
                {joining ? <Loader2 size={18} className="animate-spin" /> : <Users size={18} />}
                <span>Minta Bergabung ke Room</span>
              </button>
            </div>
          </div>
        ) : room.userStatus === 'pending' ? (
          /* Logged In & Pending Approval */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            <div
              style={{
                backgroundColor: cardBg,
                borderRadius: '24px',
                padding: '24px',
                border: `1px solid ${cardBorder}`,
                textAlign: 'center',
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: isDark ? '#3D331A' : '#FEF3C7', color: '#D97706', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Clock size={28} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px' }}>Menunggu Persetujuan</h3>
              <p style={{ fontSize: '14px', color: subText, lineHeight: '1.5', marginBottom: '16px' }}>
                Permintaan Anda untuk bergabung di <strong>{room.title}</strong> telah dikirim. Pemilik ruang perlu menyetujui permintaan Anda sebelum Anda bisa menyetor tabungan.
              </p>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: isDark ? '#3D331A' : '#FEF3C7',
                  color: '#D97706',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '6px 14px',
                  borderRadius: '999px',
                }}
              >
                Status: Pending Approval
              </span>
            </div>
          </div>
        ) : (
          /* Approved Member or Owner View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '12px', color: subText, marginBottom: '2px', fontWeight: '500' }}>Target Kolaborasi</p>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{room.title}</h3>
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
                  {Math.round((room.currentAmount / room.targetAmount) * 100)}%
                </span>
              </div>

              <div>
                <p style={{ fontSize: '13px', color: subText, marginBottom: '4px' }}>Total Saldo Terkumpul</p>
                <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0 }}>
                  {formatRupiah(room.currentAmount)}
                </h1>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ height: '8px', borderRadius: '999px', backgroundColor: isDark ? '#1C1D22' : '#EFEADF', overflow: 'hidden', marginBottom: '8px' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.round((room.currentAmount / room.targetAmount) * 100)}%`,
                      backgroundColor: accentCol,
                      borderRadius: '999px',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: subText }}>
                  <span>Target: {formatRupiah(room.targetAmount)}</span>
                  <span>Sisa: {formatRupiah(Math.max(0, room.targetAmount - room.currentAmount))}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowQuickSetor(!showQuickSetor)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: btnBg,
                    color: '#FFF',
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
                  onClick={handleShare}
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
                  }}
                >
                  <Share2 size={16} /> Undang
                </button>
              </div>

              {showQuickSetor && (
                <div
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
                    }}
                  />
                  <button
                    onClick={handleQuickSetor}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      backgroundColor: '#16A34A',
                      color: 'white',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Kirim
                  </button>
                </div>
              )}
            </div>

            {/* Members Section with Google PP */}
            <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '18px', border: `1px solid ${cardBorder}` }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 12px' }}>
                Anggota ({room.membersCount})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {room.members.map((mem) => (
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
                    <span style={{ fontSize: '10px', backgroundColor: '#16A34A', color: 'white', padding: '2px 6px', borderRadius: '6px' }}>
                      Approved
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approval Section (for owner) */}
            {room.userStatus === 'owner' && room.pendingMembers.length > 0 && (
              <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '18px', border: `1px solid ${cardBorder}` }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 12px' }}>
                  Permintaan Bergabung ({room.pendingMembers.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {room.pendingMembers.map((mem) => (
                    <div
                      key={mem.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isDark ? '#1C1D22' : '#EFEADF',
                        padding: '10px 14px',
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
                          onClick={() => handleApprove(mem.userId, mem.name)}
                          style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#16A34A', color: 'white', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                        >
                          Terima
                        </button>
                        <button
                          onClick={() => handleReject(mem.userId, mem.name)}
                          style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#DC2626', color: 'white', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activities */}
            <div style={{ backgroundColor: cardBg, borderRadius: '20px', padding: '18px', border: `1px solid ${cardBorder}` }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 12px' }}>Aktivitas Terbaru</h4>
              {room.recentActivities.length === 0 ? (
                <p style={{ fontSize: '13px', color: subText }}>Belum ada aktivitas di room ini.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {room.recentActivities.map((act) => (
                    <div key={act.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: isDark ? '#1C382A' : '#DDE7D8',
                            overflow: 'hidden',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {act.avatarUrl ? (
                            <img src={act.avatarUrl} alt={act.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '12px', fontWeight: '700' }}>{act.name[0]}</span>
                          )}
                        </div>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>
                            {act.name} - {act.action}
                          </p>
                          <p style={{ fontSize: '11px', color: subText, margin: '2px 0 0' }}>{act.timeAgo}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: act.isIncome ? '#16A34A' : '#DC2626' }}>
                        {act.isIncome ? '+' : '-'}{formatRupiah(act.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
