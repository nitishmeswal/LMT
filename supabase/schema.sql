-- ============================================
-- NEURONIRVANA DATABASE SCHEMA
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_tier TEXT CHECK (premium_tier IN ('basic', 'premium_plus', 'professional')),
  premium_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- GLOBAL TRIALS TABLE (420 per dose globally)
-- ============================================
CREATE TABLE public.global_trials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  dose_id TEXT UNIQUE NOT NULL,
  trials_remaining INTEGER DEFAULT 420 NOT NULL,
  total_claims INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (public read, restricted write)
ALTER TABLE public.global_trials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view trial counts" ON public.global_trials
  FOR SELECT USING (true);

-- ============================================
-- USER TRIAL CLAIMS (track who claimed)
-- ============================================
CREATE TABLE public.user_trial_claims (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  dose_id TEXT NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  UNIQUE(user_id, dose_id)
);

-- Enable RLS
ALTER TABLE public.user_trial_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own claims" ON public.user_trial_claims
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own claims" ON public.user_trial_claims
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- JOURNAL ENTRIES
-- ============================================
CREATE TABLE public.journal_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  dose_id TEXT NOT NULL,
  dose_name TEXT NOT NULL,
  mood TEXT[] DEFAULT '{}',
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  notes TEXT,
  duration INTEGER, -- seconds
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own journal" ON public.journal_entries
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- CUSTOM TRIPS (Premium feature)
-- ============================================
CREATE TABLE public.custom_trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL, -- seconds
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  frequencies JSONB NOT NULL,
  visual_type TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.custom_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own trips" ON public.custom_trips
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public trips visible to all" ON public.custom_trips
  FOR SELECT USING (is_public = true);

-- ============================================
-- SUBSCRIPTIONS (Stripe integration)
-- ============================================
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to decrement global trial (atomic)
CREATE OR REPLACE FUNCTION claim_trial(p_dose_id TEXT, p_user_id UUID, p_ip INET)
RETURNS JSONB AS $$
DECLARE
  v_remaining INTEGER;
  v_result JSONB;
BEGIN
  -- Check if user already claimed this dose
  IF EXISTS (SELECT 1 FROM public.user_trial_claims WHERE user_id = p_user_id AND dose_id = p_dose_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Already claimed');
  END IF;

  -- Atomically decrement trial count
  UPDATE public.global_trials
  SET 
    trials_remaining = trials_remaining - 1,
    total_claims = total_claims + 1,
    updated_at = NOW()
  WHERE dose_id = p_dose_id AND trials_remaining > 0
  RETURNING trials_remaining INTO v_remaining;

  IF NOT FOUND THEN
    -- Insert if doesn't exist, or no trials left
    INSERT INTO public.global_trials (dose_id, trials_remaining, total_claims)
    VALUES (p_dose_id, 419, 1)
    ON CONFLICT (dose_id) DO NOTHING
    RETURNING trials_remaining INTO v_remaining;
    
    IF v_remaining IS NULL THEN
      RETURN jsonb_build_object('success', false, 'error', 'No trials remaining');
    END IF;
  END IF;

  -- Record the claim
  INSERT INTO public.user_trial_claims (user_id, dose_id, ip_address)
  VALUES (p_user_id, p_dose_id, p_ip);

  RETURN jsonb_build_object(
    'success', true,
    'trials_remaining', v_remaining
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trials remaining for a dose
CREATE OR REPLACE FUNCTION get_trials_remaining(p_dose_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  v_remaining INTEGER;
BEGIN
  SELECT trials_remaining INTO v_remaining
  FROM public.global_trials
  WHERE dose_id = p_dose_id;
  
  IF NOT FOUND THEN
    RETURN 420; -- Default if never claimed
  END IF;
  
  RETURN v_remaining;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA (Initialize trial counts)
-- ============================================
INSERT INTO public.global_trials (dose_id, trials_remaining) VALUES
  ('psilocybin', 420),
  ('dmt', 420),
  ('lsd', 420),
  ('mdma', 420),
  ('cannabis', 420),
  ('ketamine', 420),
  ('mescaline', 420),
  ('ayahuasca', 420),
  ('salvia', 420),
  ('2cb', 420),
  ('nitrous', 420),
  ('adderall', 420),
  ('ambien', 420),
  ('ghb', 420),
  ('kratom', 420),
  ('dxm', 420),
  ('caffeine', 420),
  ('meditation', 420),
  ('runners-high', 420),
  ('lean', 420)
ON CONFLICT (dose_id) DO NOTHING;

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
CREATE TABLE public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  dose_id TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials
  FOR SELECT USING (is_approved = true);

-- Allow anyone to submit testimonials (even anonymous users)
CREATE POLICY "Anyone can submit testimonials" ON public.testimonials
  FOR INSERT WITH CHECK (true);

-- ============================================
-- TRIP RATINGS TABLE
-- ============================================
CREATE TABLE public.trip_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  dose_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  feedback TEXT,
  would_recommend BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, dose_id, created_at)
);

-- Enable RLS
ALTER TABLE public.trip_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own ratings" ON public.trip_ratings
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- SUGGESTIONS TABLE
-- ============================================
CREATE TABLE public.suggestions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('drug', 'visual')),
  content TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit suggestions" ON public.suggestions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own suggestions" ON public.suggestions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- EARLY EXIT FEEDBACK TABLE
-- ============================================
CREATE TABLE public.exit_feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  dose_id TEXT NOT NULL,
  dose_name TEXT NOT NULL,
  elapsed_seconds INTEGER NOT NULL,
  reason TEXT NOT NULL,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.exit_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit exit feedback" ON public.exit_feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own feedback" ON public.exit_feedback
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- SUPPORT REQUESTS TABLE
-- ============================================
CREATE TABLE public.support_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit support requests" ON public.support_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own requests" ON public.support_requests
  FOR SELECT USING (auth.uid() = user_id);
