-- Migration: Drop all old policies dynamically and apply non-recursive policies

-- 1. Drop ALL existing policies on rooms, room_members, room_transactions
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

-- 2. Non-recursive Policies for 'rooms'
CREATE POLICY "Select rooms" ON rooms
  FOR SELECT USING (
    owner_id = auth.uid() OR
    auth.role() = 'authenticated'
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

-- 3. Policies for 'room_members'
CREATE POLICY "Select room members" ON room_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = room_members.room_id
        AND rooms.owner_id = auth.uid()
    ) OR
    auth.role() = 'authenticated'
  );

CREATE POLICY "Insert room members" ON room_members
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Update room members" ON room_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = room_members.room_id
        AND rooms.owner_id = auth.uid()
    )
  );

CREATE POLICY "Delete room members" ON room_members
  FOR DELETE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = room_members.room_id
        AND rooms.owner_id = auth.uid()
    )
  );

-- 4. Policies for 'room_transactions'
CREATE POLICY "Select room transactions" ON room_transactions
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = room_transactions.room_id
        AND rooms.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = room_transactions.room_id
        AND room_members.user_id = auth.uid()
        AND room_members.status = 'approved'
    )
  );

CREATE POLICY "Insert room transactions" ON room_transactions
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND (
      EXISTS (
        SELECT 1 FROM rooms
        WHERE rooms.id = room_transactions.room_id
          AND rooms.owner_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM room_members
        WHERE room_members.room_id = room_transactions.room_id
          AND room_members.user_id = auth.uid()
          AND room_members.status = 'approved'
      )
    )
  );
