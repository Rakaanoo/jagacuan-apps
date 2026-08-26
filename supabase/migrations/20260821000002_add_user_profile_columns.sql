-- Migration: Add user_name and avatar_url to room_members and room_transactions for Google Profile sync

ALTER TABLE room_members ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE room_members ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE room_transactions ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE room_transactions ADD COLUMN IF NOT EXISTS avatar_url TEXT;
