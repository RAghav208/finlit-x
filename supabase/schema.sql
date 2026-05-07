-- ============================================================
-- FinLit-X Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Survey Responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Demographics (all anonymous)
  age TEXT,
  gender TEXT,
  program TEXT,
  study_year TEXT,
  monthly_allowance TEXT,
  prior_finlit_app BOOLEAN,
  confidence_before INTEGER CHECK (confidence_before BETWEEN 1 AND 5),

  -- Quiz answers stored as JSON
  pre_quiz_answers JSONB,
  post_quiz_answers JSONB,

  -- Scores computed server-side
  pre_quiz_score INTEGER,
  post_quiz_score INTEGER,
  score_improvement INTEGER,

  -- Satisfaction ratings stored as JSON
  satisfaction_ratings JSONB,

  -- Meta
  completed BOOLEAN DEFAULT FALSE,
  time_taken_seconds INTEGER,
  qualitative_feedback TEXT,
  device_info TEXT,
  study_group TEXT DEFAULT 'experimental' -- 'experimental' or 'control'
);

-- 2. Individual quiz answers (finer grain for analysis)
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_code TEXT NOT NULL,
  quiz_type TEXT NOT NULL CHECK (quiz_type IN ('pre', 'post')),
  section TEXT NOT NULL,
  question_index INTEGER NOT NULL,
  selected_option INTEGER,
  is_correct BOOLEAN,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (participant_code) REFERENCES survey_responses(participant_code) ON DELETE CASCADE
);

-- 3. Module interactions (experimental group)
CREATE TABLE IF NOT EXISTS module_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_code TEXT NOT NULL,
  module_id TEXT NOT NULL,
  module_type TEXT NOT NULL,
  time_spent_seconds INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  interaction_data JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (participant_code) REFERENCES survey_responses(participant_code) ON DELETE CASCADE
);

-- 4. Analytics aggregates (updated via triggers)
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date DATE NOT NULL UNIQUE,
  total_participants INTEGER DEFAULT 0,
  completed_participants INTEGER DEFAULT 0,
  avg_pre_score DECIMAL(4,2),
  avg_post_score DECIMAL(4,2),
  avg_improvement DECIMAL(4,2),
  avg_satisfaction DECIMAL(3,2),
  section_breakdown JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous survey submission)
-- Only authenticated admins can read/view all data
CREATE POLICY "Anyone can submit survey responses"
  ON survey_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can submit quiz answers"
  ON quiz_answers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can submit module interactions"
  ON module_interactions FOR INSERT
  WITH CHECK (true);

-- Read policies for authenticated users (researchers)
CREATE POLICY "Authenticated users can read responses"
  ON survey_responses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read quiz answers"
  ON quiz_answers FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- Functions for computing scores
-- ============================================================

CREATE OR REPLACE FUNCTION compute_quiz_score(answers JSONB)
RETURNS INTEGER AS $$
DECLARE
  correct_answers INTEGER[] := ARRAY[2, 0, 1, 2, 1, 2, 2, 3, 1, 2, 1, 1, 2, 2, 1];
  score INTEGER := 0;
  answer_data JSONB;
BEGIN
  FOR i IN 1..15 LOOP
    answer_data := answers->>(i-1);
    IF answer_data->>'selected' IS NOT NULL THEN
      IF (answer_data->>'selected')::INTEGER = correct_answers[i] THEN
        score := score + 1;
      END IF;
    END IF;
  END LOOP;
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Auto-update analytics snapshot
-- ============================================================

CREATE OR REPLACE FUNCTION update_analytics_snapshot()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO analytics_snapshots (snapshot_date, total_participants, completed_participants, avg_pre_score, avg_post_score, avg_improvement)
  VALUES (
    CURRENT_DATE,
    (SELECT COUNT(*) FROM survey_responses),
    (SELECT COUNT(*) FROM survey_responses WHERE completed = TRUE),
    (SELECT AVG(pre_quiz_score) FROM survey_responses WHERE pre_quiz_score IS NOT NULL),
    (SELECT AVG(post_quiz_score) FROM survey_responses WHERE post_quiz_score IS NOT NULL),
    (SELECT AVG(score_improvement) FROM survey_responses WHERE score_improvement IS NOT NULL)
  )
  ON CONFLICT (snapshot_date) DO UPDATE SET
    total_participants = EXCLUDED.total_participants,
    completed_participants = EXCLUDED.completed_participants,
    avg_pre_score = EXCLUDED.avg_pre_score,
    avg_post_score = EXCLUDED.avg_post_score,
    avg_improvement = EXCLUDED.avg_improvement;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_survey_response_change
AFTER INSERT OR UPDATE ON survey_responses
FOR EACH STATEMENT EXECUTE FUNCTION update_analytics_snapshot();
