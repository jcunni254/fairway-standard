-- Caddie vetting: add vetting_status to caddies and create responses table
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

ALTER TABLE caddies
ADD COLUMN IF NOT EXISTS vetting_status text NOT NULL DEFAULT 'pending';

CREATE TABLE IF NOT EXISTS caddie_vetting_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caddie_id text NOT NULL REFERENCES caddies(id) ON DELETE CASCADE,
  experience_level text NOT NULL,
  club_selection_answer text NOT NULL,
  course_familiarity text NOT NULL,
  etiquette_answer text NOT NULL,
  motivation_and_people_skills text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (caddie_id)
);

CREATE INDEX IF NOT EXISTS idx_caddie_vetting_caddie_id
ON caddie_vetting_responses(caddie_id);
