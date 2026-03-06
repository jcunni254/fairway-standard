-- Add hometown and home_golf_course to caddies for profile display.
-- Run this in Supabase → SQL Editor (one-time) if you're not using Supabase CLI migrations.

ALTER TABLE caddies
  ADD COLUMN IF NOT EXISTS hometown text,
  ADD COLUMN IF NOT EXISTS home_golf_course text;

COMMENT ON COLUMN caddies.hometown IS 'Caddie’s hometown for profile display';
COMMENT ON COLUMN caddies.home_golf_course IS 'Home golf course name for profile display';
