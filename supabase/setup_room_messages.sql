-- ====================================================================
-- FITUR OBROLAN RUANG NABAR (JAGACUAN APP)
-- Jalankan query ini di Supabase Dashboard -> SQL Editor
-- Link: https://supabase.com/dashboard/project/cddmksbflgzxmavrddrp/sql/new
-- ====================================================================

-- 1. Buat Tabel room_messages
CREATE TABLE IF NOT EXISTS room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  avatar_url TEXT,
  message TEXT NOT NULL,
  message_type VARCHAR(20) NOT NULL DEFAULT 'text', -- 'text', 'cheer', 'system'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index performa tinggi untuk query 100 pesan terbaru per room
CREATE INDEX IF NOT EXISTS idx_room_messages_room_created 
ON room_messages (room_id, created_at DESC);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada untuk mencegah konflik
DROP POLICY IF EXISTS "Approved members can read chat" ON room_messages;
DROP POLICY IF EXISTS "Approved members can send chat" ON room_messages;
DROP POLICY IF EXISTS "Users or host can delete chat" ON room_messages;

-- 3. Policy: Hanya Host & Anggota Resmi (Approved) yang bisa membaca obrolan
CREATE POLICY "Approved members can read chat" ON room_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM room_members 
    WHERE room_members.room_id = room_messages.room_id 
      AND room_members.user_id = auth.uid() 
      AND room_members.status = 'approved'
  )
  OR EXISTS (
    SELECT 1 FROM rooms 
    WHERE rooms.id = room_messages.room_id 
      AND rooms.owner_id = auth.uid()
  )
);

-- 4. Policy: Hanya Host & Anggota Resmi (Approved) yang bisa mengirim obrolan
CREATE POLICY "Approved members can send chat" ON room_messages
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND (
    EXISTS (
      SELECT 1 FROM room_members 
      WHERE room_members.room_id = room_messages.room_id 
        AND room_members.user_id = auth.uid() 
        AND room_members.status = 'approved'
    )
    OR EXISTS (
      SELECT 1 FROM rooms 
      WHERE rooms.id = room_messages.room_id 
        AND rooms.owner_id = auth.uid()
    )
  )
);

-- 5. Policy: User bisa hapus pesan miliknya sendiri, Host bisa hapus pesan siapa pun
CREATE POLICY "Users or host can delete chat" ON room_messages
FOR DELETE USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM rooms 
    WHERE rooms.id = room_messages.room_id 
      AND rooms.owner_id = auth.uid()
  )
);

-- 6. Daftarkan tabel ke Realtime Publication Supabase
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'room_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE room_messages;
  END IF;
END $$;
