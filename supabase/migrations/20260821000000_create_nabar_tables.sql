-- Migration: Create Ruang/Nabar Tables, Triggers, RLS, & Realtime

-- 1. Create rooms table
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

-- 2. Create room_members table
CREATE TABLE IF NOT EXISTS room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT,
  avatar_url TEXT,
  status TEXT CHECK (status IN ('pending', 'approved')) NOT NULL DEFAULT 'pending',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id)
);

-- 3. Create room_transactions table
CREATE TABLE IF NOT EXISTS room_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT,
  avatar_url TEXT,
  amount NUMERIC NOT NULL,
  is_income BOOLEAN NOT NULL,
  action_label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create Postgres Trigger & Function to update rooms.current_amount atomically
CREATE OR REPLACE FUNCTION update_room_current_amount()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE rooms
  SET current_amount = GREATEST(0, current_amount + (CASE WHEN NEW.is_income THEN NEW.amount ELSE -NEW.amount END))
  WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_room_transaction_inserted ON room_transactions;
CREATE TRIGGER on_room_transaction_inserted
AFTER INSERT ON room_transactions
FOR EACH ROW
EXECUTE FUNCTION update_room_current_amount();

-- 5. Row Level Security (RLS) setup
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_transactions ENABLE ROW LEVEL SECURITY;

-- Non-recursive Policies for 'rooms'
DROP POLICY IF EXISTS "Select rooms" ON rooms;
CREATE POLICY "Select rooms" ON rooms
  FOR SELECT USING (owner_id = auth.uid() OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Insert rooms" ON rooms;
CREATE POLICY "Insert rooms" ON rooms
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Update rooms" ON rooms;
CREATE POLICY "Update rooms" ON rooms
  FOR UPDATE USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Delete rooms" ON rooms;
CREATE POLICY "Delete rooms" ON rooms
  FOR DELETE USING (owner_id = auth.uid());

-- Policies for 'room_members'
DROP POLICY IF EXISTS "Select room members" ON room_members;
CREATE POLICY "Select room members" ON room_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_members.room_id AND rooms.owner_id = auth.uid()) OR
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Insert room members" ON room_members;
CREATE POLICY "Insert room members" ON room_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Update room members" ON room_members;
CREATE POLICY "Update room members" ON room_members
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_members.room_id AND rooms.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Delete room members" ON room_members;
CREATE POLICY "Delete room members" ON room_members
  FOR DELETE USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_members.room_id AND rooms.owner_id = auth.uid())
  );

-- Policies for 'room_transactions'
DROP POLICY IF EXISTS "Select room transactions" ON room_transactions;
CREATE POLICY "Select room transactions" ON room_transactions
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_transactions.room_id AND rooms.owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM room_members WHERE room_members.room_id = room_transactions.room_id AND room_members.user_id = auth.uid() AND room_members.status = 'approved')
  );

DROP POLICY IF EXISTS "Insert room transactions" ON room_transactions;
CREATE POLICY "Insert room transactions" ON room_transactions
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (SELECT 1 FROM rooms WHERE rooms.id = room_transactions.room_id AND rooms.owner_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM room_members WHERE room_members.room_id = room_transactions.room_id AND room_members.user_id = auth.uid() AND room_members.status = 'approved')
    )
  );

-- 6. Enable Realtime on tables
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
