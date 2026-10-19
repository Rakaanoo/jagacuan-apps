-- ====================================================================
-- SUPABASE STORAGE: ROOM COVERS 1-CLICK SETUP & PUBLIC POLICIES
-- Jalankan query ini di Supabase Dashboard -> SQL Editor
-- Link: https://supabase.com/dashboard/project/cddmksbflgzxmavrddrp/sql/new
-- ====================================================================

-- 1. Pastikan bucket 'room-covers' terdaftar dan berstatus PUBLIC
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-covers',
  'room-covers',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Bersihkan policy lama agar tidak duplikat atau bertabrakan
DROP POLICY IF EXISTS "Public Access Room Covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated User Upload Room Covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated User Update Room Covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated User Delete Room Covers" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Upload Room Covers" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Update Room Covers" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Delete Room Covers" ON storage.objects;
DROP POLICY IF EXISTS "Allow All Room Covers" ON storage.objects;

-- 3. Policy DOWNLOAD/BACA: Semua orang (anggota yang join, web, tamu) bebas melihat foto
CREATE POLICY "Public Access Room Covers" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'room-covers');

-- 4. Policy UPLOAD/INSERT: Pengguna aplikasi (baik anonim maupun terautentikasi) bebas upload foto target
CREATE POLICY "Allow Public Upload Room Covers" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'room-covers');

-- 5. Policy UPDATE: Bebas update foto cover jika diperlukan
CREATE POLICY "Allow Public Update Room Covers" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'room-covers');

-- 6. Policy DELETE: Bebas hapus foto cover jika diperlukan
CREATE POLICY "Allow Public Delete Room Covers" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'room-covers');
