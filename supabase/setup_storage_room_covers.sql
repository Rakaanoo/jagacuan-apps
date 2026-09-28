-- ====================================================================
-- SUPABASE STORAGE: ROOM COVERS BUCKET & POLICIES
-- Jalankan query ini di Supabase Dashboard -> SQL Editor
-- Link: https://supabase.com/dashboard/project/cddmksbflgzxmavrddrp/sql/new
-- ====================================================================

-- 1. Buat bucket 'room-covers' sebagai bucket publik jika belum ada
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

-- 2. Hapus policy lama agar tidak duplikat
DROP POLICY IF EXISTS "Public Access Room Covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated User Upload Room Covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated User Update Room Covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated User Delete Room Covers" ON storage.objects;

-- 3. Policy agar SEMUA ORANG (publik) bisa melihat dan mendownload foto cover
CREATE POLICY "Public Access Room Covers" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'room-covers');

-- 4. Policy agar pengguna yang sudah login bisa upload foto cover
CREATE POLICY "Authenticated User Upload Room Covers" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'room-covers' 
    AND auth.role() = 'authenticated'
  );

-- 5. Policy agar pengguna bisa update foto cover yang mereka upload
CREATE POLICY "Authenticated User Update Room Covers" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'room-covers' 
    AND auth.role() = 'authenticated'
  );

-- 6. Policy agar pengguna bisa delete foto cover jika diperlukan
CREATE POLICY "Authenticated User Delete Room Covers" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'room-covers' 
    AND auth.role() = 'authenticated'
  );
