import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_premium: boolean;
  premium_tier: 'basic' | 'premium_plus' | 'professional' | null;
  premium_expires_at: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GlobalTrial {
  id: string;
  dose_id: string;
  trials_remaining: number;
  total_claims: number;
  created_at: string;
  updated_at: string;
}

export interface JournalEntryDB {
  id: string;
  user_id: string;
  dose_id: string;
  dose_name: string;
  mood: string[];
  intensity: number;
  notes: string | null;
  duration: number | null;
  created_at: string;
}

// API functions
export async function getTrialsRemaining(doseId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_trials_remaining', { p_dose_id: doseId });
  
  if (error) {
    console.error('Error getting trials:', error);
    return 420;
  }
  
  return data ?? 420;
}

export async function claimTrial(doseId: string, userId: string): Promise<{ success: boolean; trials_remaining?: number; error?: string }> {
  const { data, error } = await supabase
    .rpc('claim_trial', { 
      p_dose_id: doseId, 
      p_user_id: userId,
      p_ip: null 
    });
  
  if (error) {
    console.error('Error claiming trial:', error);
    return { success: false, error: error.message };
  }
  
  return data;
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error getting profile:', error);
    return null;
  }
  
  return data;
}

export async function saveJournalEntry(entry: Omit<JournalEntryDB, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await supabase
    .from('journal_entries')
    .insert(entry);
  
  if (error) {
    console.error('Error saving journal:', error);
    return false;
  }
  
  return true;
}

export interface Testimonial {
  id: string;
  user_id: string | null;
  name: string;
  content: string;
  rating: number;
  dose_id: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface TripRating {
  id: string;
  user_id: string;
  dose_id: string;
  rating: number;
  feedback: string | null;
  would_recommend: boolean | null;
  created_at: string;
}

// Submit testimonial
export async function submitTestimonial(
  userId: string | null,
  name: string,
  content: string,
  rating: number = 5,
  doseId?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('testimonials')
    .insert({
      user_id: userId || null,
      name,
      content,
      rating,
      dose_id: doseId || null,
    });

  if (error) {
    console.error('Error submitting testimonial:', error);
    return false;
  }
  return true;
}

// Get approved testimonials
export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error getting testimonials:', error);
    return [];
  }
  return data || [];
}

// Submit trip rating
export async function submitTripRating(
  userId: string,
  doseId: string,
  rating: number,
  feedback?: string,
  wouldRecommend?: boolean
): Promise<boolean> {
  const { error } = await supabase
    .from('trip_ratings')
    .insert({
      user_id: userId,
      dose_id: doseId,
      rating,
      feedback,
      would_recommend: wouldRecommend,
    });

  if (error) {
    console.error('Error submitting rating:', error);
    return false;
  }
  return true;
}

// Get real-time trial count from database
export async function getGlobalTrialCount(doseId: string): Promise<number> {
  const { data, error } = await supabase
    .from('global_trials')
    .select('trials_remaining')
    .eq('dose_id', doseId)
    .single();

  if (error || !data) {
    return 420; // Default
  }
  return data.trials_remaining;
}

// Claim a trial (atomic decrement)
export async function claimGlobalTrial(doseId: string, userId: string): Promise<{ success: boolean; remaining?: number; error?: string }> {
  const { data, error } = await supabase.rpc('claim_trial', {
    p_dose_id: doseId,
    p_user_id: userId,
    p_ip: null
  });

  if (error) {
    console.error('Error claiming trial:', error);
    return { success: false, error: error.message };
  }

  return data;
}

// Submit suggestion
export async function submitSuggestion(
  userId: string | null,
  type: 'drug' | 'visual',
  content: string,
  category?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('suggestions')
    .insert({
      user_id: userId || null,
      type,
      content,
      category: category || null,
    });

  if (error) {
    console.error('Error submitting suggestion:', error);
    return false;
  }
  return true;
}

// Sync journal entry to database
export async function syncJournalEntry(
  userId: string,
  entry: {
    doseId: string;
    doseName: string;
    mood: string[];
    intensity: number;
    notes: string;
    duration: number;
  }
): Promise<boolean> {
  const { error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      dose_id: entry.doseId,
      dose_name: entry.doseName,
      mood: entry.mood,
      intensity: entry.intensity,
      notes: entry.notes,
      duration: entry.duration,
    });

  if (error) {
    console.error('Error syncing journal entry:', error);
    return false;
  }
  return true;
}

// Submit early exit feedback
export async function submitExitFeedback(
  userId: string | null,
  doseId: string,
  doseName: string,
  elapsedSeconds: number,
  reason: string,
  feedback?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('exit_feedback')
    .insert({
      user_id: userId || null,
      dose_id: doseId,
      dose_name: doseName,
      elapsed_seconds: elapsedSeconds,
      reason,
      feedback: feedback || null,
    });

  if (error) {
    console.error('Error submitting exit feedback:', error);
    return false;
  }
  return true;
}

// Submit support request
export async function submitSupportRequest(
  userId: string | null,
  email: string,
  message: string,
  category: string = 'general'
): Promise<boolean> {
  const { error } = await supabase
    .from('support_requests')
    .insert({
      user_id: userId || null,
      email,
      message,
      category,
    });

  if (error) {
    console.error('Error submitting support request:', error);
    return false;
  }
  return true;
}

export async function getUserJournalEntries(userId: string): Promise<JournalEntryDB[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting journal entries:', error);
    return [];
  }
  
  return data ?? [];
}
