'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, ArrowUp, Plus, X, Target, Share2, UserPlus, Users } from 'lucide-react'
import { useAppStore, formatRupiah } from '@/lib/store'
import CreateNabarModal from './CreateNabarModal'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function NabarRoomModal({ isOpen, onClose }: Props) {
  const { nabarRooms, showToast, addNabarTransaction, approveNabarMember, rejectNabarMember, theme } = useAppStore()
  const isDark = theme === 'dark'

  const [showCreateNabar, setShowCreateNabar] = useState(false)
  const [showQuickSetor, setShowQuickSetor] = useState(false)
  const [setorAmountStr, setSetorAmountStr] = useState('50.000')

  const activeRoom = nabarRooms[0]

  const handleShareLink = () => {
    if (!activeRoom) return
    const inviteUrl = `https://jagacuan.app/room/${activeRoom.id}?invite=true`
    navigator.clipboard.writeText(inviteUrl)
    showToast('Link Undangan Disalin!', 'Bagikan ke teman/keluarga untuk gabung', 'success')
  }

  const handleQuickSetor = () => {
    const amt = parseInt(setorAmountStr.replace(/\D/g, '')) || 0
    if (!activeRoom || amt <= 0) return

    addNabarTransaction(activeRoom.id, amt, true, 'Saya', 'Saya menabung')
    setShowQuickSetor(false)
  }

  const bg = isDark ? '#181920' : '#FAF7F2'
  const textColor = isDark ? '#FFFFFF' : '#2C2418'
  const cardBg = isDark ? '#262934' : '#FAF6EF'
  const cardBorder = isDark ? '#383C4D' : '#E0D5C3'
  const subText = isDark ? '#8E94A5' : '#7A6F60'
  const accentIcon = isDark ? '#8C9AFF' : '#2C2418'
  const btnBg = isDark ? '#7C8BFF' : '#2C2418'
  const btnText = '#FFFFFF'

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'center' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    backgroundColor: isDark ? '#8C9AFF' : '#2C2418',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Users size={22} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Ruang Nabung</h2>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  onClick={handleShareLink}
                  title="Bagikan Link Undangan Room"
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
                    color: accentIcon,
                  }}
                >
                  <Share2 size={18} />
                </button>
                <button
                  onClick={onClose}
                  style={{ background: 'none', border: 'none', color: subText, cursor: 'pointer', padding: '4px' }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Main Content Body */}
            <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {activeRoom ? (
                <>
                  {/* Goal Card */}
                  <div
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: '24px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      border: `1px solid ${cardBorder}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '20px',
                          backgroundColor: btnBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                        }}
                      >
                        <Target size={32} />
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', color: subText, marginBottom: '2px' }}>Tujuan aktif</p>
                        <h3 style={{ fontSize: '20px', fontWeight: '700' }}>{activeRoom.title}</h3>
                      </div>
                    </div>

                    <div>
                      <p style={{ fontSize: '13px', color: subText, marginBottom: '4px' }}>Saldo terkumpul</p>
                      <h1 style={{ fontSize: '28px', fontWeight: '800' }}>
                        {formatRupiah(activeRoom.currentAmount)}
                      </h1>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div
                        style={{
                          height: '8px',
                          borderRadius: '999px',
                          backgroundColor: isDark ? '#383C4D' : '#EFEADF',
                          overflow: 'hidden',
                          marginBottom: '8px',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.round((activeRoom.currentAmount / activeRoom.targetAmount) * 100)}%`,
                            backgroundColor: isDark ? '#A0ABFF' : '#2C2418',
                            borderRadius: '999px',
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: subText }}>
                        <span>dari {formatRupiah(activeRoom.targetAmount)}</span>
                        <span style={{ fontWeight: '700', color: isDark ? '#A0ABFF' : '#2C2418' }}>
                          {Math.round((activeRoom.currentAmount / activeRoom.targetAmount) * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Action Bar inside Goal Card */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <button
                        onClick={() => setShowQuickSetor(!showQuickSetor)}
                        style={{
                          flex: 1,
                          padding: '10px',
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
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: `1px solid ${cardBorder}`,
                          backgroundColor: isDark ? '#1E2028' : '#EFEADF',
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

                    {/* Quick Setor Form Toggle */}
                    {showQuickSetor && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          padding: '12px',
                          backgroundColor: isDark ? '#1E2028' : '#EFEADF',
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
                            backgroundColor: isDark ? '#131419' : '#FFFFFF',
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
                          style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            backgroundColor: '#16A34A',
                            color: 'white',
                            fontWeight: '700',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          Kirim
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* Member Avatars Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', marginLeft: '6px' }}>
                        {activeRoom.members.map((mem, idx) => (
                          <div
                            key={idx}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: mem.avatarBg,
                              color: '#FFFFFF',
                              fontWeight: '700',
                              fontSize: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `2px solid ${bg}`,
                              marginLeft: idx > 0 ? '-10px' : 0,
                            }}
                          >
                            {mem.name[0]}
                          </div>
                        ))}
                      </div>
                      <span style={{ fontSize: '13px', color: subText }}>
                        {activeRoom.membersCount} orang ikut menabung
                      </span>
                    </div>
                  </div>

                  {/* Pending Member Approval List */}
                  {activeRoom.pendingMembers && activeRoom.pendingMembers.length > 0 && (
                    <div
                      style={{
                        backgroundColor: cardBg,
                        border: `1px dashed ${btnBg}`,
                        borderRadius: '20px',
                        padding: '16px',
                      }}
                    >
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: isDark ? '#7C8BFF' : '#2C2418', marginBottom: '10px' }}>
                        Permintaan Join (Owner Approval)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {activeRoom.pendingMembers.map((name) => (
                          <div
                            key={name}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: bg,
                              padding: '10px 12px',
                              borderRadius: '12px',
                            }}
                          >
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>{name}</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => approveNabarMember(activeRoom.id, name)}
                                style={{
                                  padding: '4px 10px',
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
                                onClick={() => rejectNabarMember(activeRoom.id, name)}
                                style={{
                                  padding: '4px 10px',
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
                      borderRadius: '24px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      border: `1px solid ${cardBorder}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '700' }}>Aktivitas terbaru</h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {activeRoom.recentActivities.map((act, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '14px',
                                backgroundColor: act.isIncome ? (isDark ? '#1C382A' : '#DDE7D8') : (isDark ? '#3D2626' : '#FDE8E8'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: act.isIncome ? '#16A34A' : '#DC2626',
                              }}
                            >
                              {act.isIncome ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
                            </div>
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: '600' }}>{act.action}</p>
                              <p style={{ fontSize: '11px', color: subText }}>{act.timeAgo}</p>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: '15px',
                              fontWeight: '700',
                              color: act.isIncome ? '#16A34A' : '#DC2626',
                            }}
                          >
                            {act.isIncome ? '+' : '-'}{formatRupiah(act.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: subText }}>
                  <p>Belum ada room nabung kolaborasi.</p>
                </div>
              )}

              {/* Add Room Button */}
              <button
                onClick={() => setShowCreateNabar(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
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
                }}
              >
                <Plus size={18} /> Buat Room Kolaborasi Baru
              </button>
            </div>

            {/* Create Nabar Modal */}
            <CreateNabarModal isOpen={showCreateNabar} onClose={() => setShowCreateNabar(false)} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
