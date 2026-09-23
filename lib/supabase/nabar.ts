import { createClient } from './client'

export interface NabarMember {
  id: string
  userId: string
  name: string
  avatarBg: string
  avatarUrl?: string
  status: 'pending' | 'approved'
  joinedAt: string
}

export interface NabarActivity {
  id: string
  userId: string
  name: string
  avatarUrl?: string
  action: string
  amount: number
  isIncome: boolean
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  timeAgo: string
}

export interface SupabaseNabarRoom {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  startDate?: string
  deadlineDate?: string
  note?: string
  coverImage?: string
  ownerId: string
  membersCount: number
  members: NabarMember[]
  pendingMembers: NabarMember[]
  recentActivities: NabarActivity[]
  pendingActivities: NabarActivity[]
  userStatus?: 'owner' | 'approved' | 'pending' | 'none'
}

const AVATAR_COLORS = ['#93C5FD', '#86EFAC', '#FDE047', '#FCA5A5', '#FDBA74', '#C084FC', '#E879F9']

function getDeterministicColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}

export function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffMinutes < 2) return 'Baru saja'
  if (diffMinutes < 60) return `${diffMinutes}m lalu`
  if (diffHours < 24) return `${diffHours}j lalu`
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export function getUserProfileInfo(user: any) {
  if (!user) return { name: 'Pengguna', avatarUrl: undefined }
  const meta = user.user_metadata || {}
  const identityData = user.identities?.[0]?.identity_data || {}
  const name =
    meta.full_name ||
    meta.name ||
    identityData.full_name ||
    identityData.name ||
    user.email?.split('@')[0] ||
    'Pengguna'
  const avatarUrl =
    meta.avatar_url ||
    meta.picture ||
    identityData.avatar_url ||
    identityData.picture ||
    undefined
  return { name, avatarUrl }
}

export async function createRoom(data: {
  title: string
  targetAmount: number
  startDate?: string
  deadlineDate?: string
  note?: string
  coverImage?: string
}) {
  const supabase = createClient()
  const user = await getCurrentUser()
  if (!user) throw new Error('Pengguna belum terautentikasi')

  const profile = getUserProfileInfo(user)

  // 1. Create room
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .insert({
      title: data.title,
      target_amount: data.targetAmount,
      start_date: data.startDate || null,
      deadline_date: data.deadlineDate || null,
      note: data.note || null,
      cover_image: data.coverImage || null,
      owner_id: user.id,
    })
    .select()
    .single()

  if (roomError) throw new Error(roomError.message)

  // 2. Add owner as approved member
  const { error: memberError } = await supabase
    .from('room_members')
    .insert({
      room_id: room.id,
      user_id: user.id,
      user_name: profile.name,
      avatar_url: profile.avatarUrl || null,
      status: 'approved',
    })

  if (memberError) console.error('Gagal menambahkan owner ke room_members:', memberError)

  return room
}

export async function getUserRooms(): Promise<SupabaseNabarRoom[]> {
  const supabase = createClient()
  const user = await getCurrentUser()
  if (!user) return []

  try {
    const { data: memberRows, error: memberErr } = await supabase
      .from('room_members')
      .select('room_id')
      .eq('user_id', user.id)

    if (memberErr) console.error('Error fetching member rows:', memberErr)

    const memberRoomIds = memberRows ? memberRows.map((r) => r.room_id).filter(Boolean) : []

    let query = supabase.from('rooms').select('*')
    if (memberRoomIds.length > 0) {
      query = query.or(`owner_id.eq.${user.id},id.in.(${memberRoomIds.join(',')})`)
    } else {
      query = query.eq('owner_id', user.id)
    }

    const { data: rooms, error } = await query.order('created_at', { ascending: false })

    if (error || !rooms) return []

    const detailedRooms = await Promise.all(rooms.map((r) => getRoomById(r.id, user)))
    return detailedRooms.filter((r): r is SupabaseNabarRoom => r !== null)
  } catch (err) {
    console.error('Error in getUserRooms:', err)
    return []
  }
}

export async function getRoomById(roomIdParam: string, currentUserParam?: any): Promise<SupabaseNabarRoom | null> {
  if (!roomIdParam || roomIdParam === 'demo_room') return null

  const supabase = createClient()
  const user = currentUserParam !== undefined ? currentUserParam : await getCurrentUser()
  const cleanId = roomIdParam.trim()

  // 1. Fetch room details (supports UUID, exact 6-char code, and case-insensitive code)
  let { data: room } = await supabase
    .from('rooms')
    .select('*')
    .or(`id.eq.${cleanId},id.ilike.${cleanId}`)
    .maybeSingle()

  if (!room) {
    const { data: roomByPrefix } = await supabase
      .from('rooms')
      .select('*')
      .ilike('id', `${cleanId}%`)
      .maybeSingle()
    room = roomByPrefix
  }

  if (!room) return null

  const roomId = room.id

  // 2. Fetch room members
  const { data: rawMembers } = await supabase
    .from('room_members')
    .select('*')
    .eq('room_id', roomId)

  // 3. Fetch transactions
  const { data: rawTx } = await supabase
    .from('room_transactions')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(40)

  // Auto-sync current user's Google profile info to room_members table
  if (user) {
    const currentUserProfile = getUserProfileInfo(user)
    const currentMember = rawMembers?.find((m) => m.user_id === user.id)
    if (
      currentMember &&
      (currentMember.avatar_url !== (currentUserProfile.avatarUrl || null) ||
        currentMember.user_name !== currentUserProfile.name)
    ) {
      supabase
        .from('room_members')
        .update({
          user_name: currentUserProfile.name,
          avatar_url: currentUserProfile.avatarUrl || null,
        })
        .match({ room_id: roomId, user_id: user.id })
        .then(({ error }) => {
          if (error) console.error('Gagal memperbarui foto profil di room_members:', error)
        })
    }
  }

  const allMembers: NabarMember[] = (rawMembers || []).map((m) => {
    const isCurrentUser = user && m.user_id === user.id
    const currentUserProfile = isCurrentUser ? getUserProfileInfo(user) : null

    const displayName =
      currentUserProfile?.name ||
      m.user_name ||
      `User ${m.user_id.slice(0, 4)}`

    const avatarUrl =
      currentUserProfile?.avatarUrl ||
      m.avatar_url ||
      undefined

    return {
      id: m.id,
      userId: m.user_id,
      name: displayName,
      avatarUrl,
      avatarBg: getDeterministicColor(m.user_id),
      status: m.status as 'pending' | 'approved',
      joinedAt: m.joined_at,
    }
  })

  const approvedMembers = allMembers.filter((m) => m.status === 'approved')
  const pendingMembers = allMembers.filter((m) => m.status === 'pending')

  const allActivities: NabarActivity[] = (rawTx || []).map((tx) => {
    const isCurrentUser = user && tx.user_id === user.id
    const currentUserProfile = isCurrentUser ? getUserProfileInfo(user) : null
    const memberObj = allMembers.find((m) => m.userId === tx.user_id)

    const name =
      currentUserProfile?.name ||
      tx.user_name ||
      memberObj?.name ||
      'Anggota'

    const avatarUrl =
      currentUserProfile?.avatarUrl ||
      tx.avatar_url ||
      memberObj?.avatarUrl ||
      undefined

    return {
      id: tx.id,
      userId: tx.user_id,
      name,
      avatarUrl,
      action: tx.action_label,
      amount: Number(tx.amount),
      isIncome: tx.is_income,
      status: (tx.status || 'approved') as 'pending' | 'approved' | 'rejected',
      createdAt: tx.created_at,
      timeAgo: formatTimeAgo(tx.created_at),
    }
  })

  const recentActivities = allActivities.filter((a) => a.status === 'approved')
  const pendingActivities = allActivities.filter((a) => a.status === 'pending')

  let userStatus: 'owner' | 'approved' | 'pending' | 'none' = 'none'
  if (user) {
    if (room.owner_id === user.id) {
      userStatus = 'owner'
    } else {
      const userMember = allMembers.find((m) => m.userId === user.id)
      if (userMember) {
        userStatus = userMember.status
      }
    }
  }

  return {
    id: room.id,
    title: room.title,
    targetAmount: Number(room.target_amount),
    currentAmount: Number(room.current_amount),
    startDate: room.start_date || undefined,
    deadlineDate: room.deadline_date || undefined,
    note: room.note || undefined,
    coverImage: room.cover_image || undefined,
    ownerId: room.owner_id,
    membersCount: approvedMembers.length,
    members: approvedMembers,
    pendingMembers,
    recentActivities,
    pendingActivities,
    userStatus,
  }
}

export async function requestJoinRoom(roomId: string) {
  const supabase = createClient()
  const user = await getCurrentUser()
  if (!user) throw new Error('Pengguna belum terautentikasi')

  const profile = getUserProfileInfo(user)

  const { error } = await supabase
    .from('room_members')
    .insert({
      room_id: roomId,
      user_id: user.id,
      user_name: profile.name,
      avatar_url: profile.avatarUrl || null,
      status: 'pending',
    })

  if (error) {
    if (error.code === '23505') throw new Error('Anda sudah mengajukan bergabung di room ini')
    throw new Error(error.message)
  }
}

export async function approveMember(roomId: string, memberUserId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('room_members')
    .update({ status: 'approved' })
    .match({ room_id: roomId, user_id: memberUserId })

  if (error) throw new Error(error.message)
}

export async function rejectMember(roomId: string, memberUserId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('room_members')
    .delete()
    .match({ room_id: roomId, user_id: memberUserId })

  if (error) throw new Error(error.message)
}

export async function addRoomTransaction(
  roomId: string,
  amount: number,
  isIncome: boolean,
  actionLabel: string
) {
  const supabase = createClient()
  const user = await getCurrentUser()
  if (!user) throw new Error('Pengguna belum terautentikasi')

  const profile = getUserProfileInfo(user)

  // Check if current user is room owner
  const { data: room } = await supabase
    .from('rooms')
    .select('owner_id')
    .eq('id', roomId)
    .single()

  const isOwner = room && room.owner_id === user.id
  const txStatus = isOwner ? 'approved' : 'pending'

  const { error } = await supabase
    .from('room_transactions')
    .insert({
      room_id: roomId,
      user_id: user.id,
      user_name: profile.name,
      avatar_url: profile.avatarUrl || null,
      amount,
      is_income: isIncome,
      action_label: actionLabel,
      status: txStatus,
    })

  if (error) throw new Error(error.message)
  return txStatus
}

export async function approveRoomTransaction(transactionId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('room_transactions')
    .update({ status: 'approved' })
    .eq('id', transactionId)

  if (error) throw new Error(error.message)
}

export async function rejectRoomTransaction(transactionId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('room_transactions')
    .update({ status: 'rejected' })
    .eq('id', transactionId)

  if (error) throw new Error(error.message)
}

export function subscribeToRoom(roomId: string, onUpdate: () => void) {
  const supabase = createClient()

  const channel = supabase
    .channel(`room-realtime-${roomId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
      () => onUpdate()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'room_members', filter: `room_id=eq.${roomId}` },
      () => onUpdate()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'room_transactions', filter: `room_id=eq.${roomId}` },
      () => onUpdate()
    )
    .subscribe()

  return channel
}
