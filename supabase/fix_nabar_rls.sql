-- ====================================================================
-- FIX SUPABASE NABAR ROOMS & RLS POLICIES (JAGACUAN APP)
-- Jalankan query ini di Supabase Dashboard -> SQL Editor
-- Link: https://supabase.com/dashboard/project/cddmksbflgzxmavrddrp/sql/new
-- ====================================================================

-- 1. Pastikan tabel rooms ada dengan struktur kolom yang benar
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  current_amount NUMERIC NOT NULL DEFAULT 0,
  start_date DATE,
  deadline_date DATE,
  note TEXT,
  cover_image TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Pastikan tabel room_members memiliki kolom user_name & avatar_url
CREATE TABLE IF NOT EXISTS room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT,
  avatar_url TEXT,
  status TEXT CHECK (status IN ('pending', 'approved')) NOT NULL DEFAULT 'approved',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id)
);

ALTER TABLE room_members ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE room_members ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE room_members ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';

-- 3. Pastikan tabel room_transactions memiliki kolom user_name, avatar_url, & status
CREATE TABLE IF NOT EXISTS room_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT,
  avatar_url TEXT,
  amount NUMERIC NOT NULL,
  is_income BOOLEAN NOT NULL,
  action_label TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE room_transactions ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE room_transactions ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE room_transactions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved';

-- 4. HAPUS SEMUA POLICY RLS LAMA UNTUK MEMPERBAIKI ERROR REKURSIF (42P17 / INFINITE RECURSION)
DO $$ 
DECLARE 
  pol RECORD;
BEGIN 
  FOR pol IN (
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename IN ('rooms', 'room_members', 'room_transactions')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policy bersih tanpa rekursi untuk 'rooms'
CREATE POLICY "Select rooms" ON rooms
  FOR SELECT USING (
    owner_id = auth.uid() OR auth.role() = 'authenticated'
  );

CREATE POLICY "Insert rooms" ON rooms
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id
  );

CREATE POLICY "Update rooms" ON rooms
  FOR UPDATE USING (
    owner_id = auth.uid()
  );

CREATE POLICY "Delete rooms" ON rooms
  FOR DELETE USING (
    owner_id = auth.uid()
  );

-- RLS Policy bersih tanpa rekursi untuk 'room_members'
CREATE POLICY "Select room members" ON room_members
  FOR SELECT USING (
    user_id = auth.uid() OR auth.role() = 'authenticated'
  );

CREATE POLICY "Insert room members" ON room_members
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Update room members" ON room_members
  FOR UPDATE USING (
    auth.role() = 'authenticated'
  );

CREATE POLICY "Delete room members" ON room_members
  FOR DELETE USING (
    user_id = auth.uid() OR auth.role() = 'authenticated'
  );

-- RLS Policy bersih tanpa rekursi untuk 'room_transactions'
CREATE POLICY "Select room transactions" ON room_transactions
  FOR SELECT USING (
    user_id = auth.uid() OR auth.role() = 'authenticated'
  );

CREATE POLICY "Insert room transactions" ON room_transactions
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND auth.role() = 'authenticated'
  );

CREATE POLICY "Update room transactions" ON room_transactions
  FOR UPDATE USING (
    auth.role() = 'authenticated'
  );

-- 5. Trigger otomatis untuk menghitung saldo current_amount di room
CREATE OR REPLACE FUNCTION update_room_current_amount()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE rooms
  SET current_amount = COALESCE((
    SELECT SUM(
      CASE 
        WHEN is_income = TRUE THEN amount 
        ELSE -amount 
      END
    )
    FROM room_transactions
    WHERE room_id = COALESCE(NEW.room_id, OLD.room_id)
      AND status = 'approved'
  ), 0)
  WHERE id = COALESCE(NEW.room_id, OLD.room_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_room_current_amount ON room_transactions;

CREATE TRIGGER trigger_update_room_current_amount
AFTER INSERT OR UPDATE OR DELETE ON room_transactions
FOR EACH ROW
EXECUTE FUNCTION update_room_current_amount();

-- 6. Aktifkan Realtime di Supabase
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'rooms') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'room_members') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE room_members;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'room_transactions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE room_transactions;
  END IF;
END $$;
