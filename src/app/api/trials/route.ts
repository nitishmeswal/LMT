import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface TrialData {
  [doseId: string]: number;
}

let cachedTrials: TrialData | null = null;
let lastFetch = 0;
const CACHE_DURATION = 15 * 1000;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', trials: cachedTrials || {} },
      { status: 429 }
    );
  }

  const now = Date.now();
  const doseId = request.nextUrl.searchParams.get('doseId');
  
  if (cachedTrials !== null && now - lastFetch < CACHE_DURATION) {
    if (doseId) {
      return NextResponse.json({ 
        count: cachedTrials[doseId] ?? 420, 
        doseId,
        cached: true 
      });
    }
    return NextResponse.json({ trials: cachedTrials, cached: true });
  }

  try {
    const { data, error } = await supabase
      .from('global_trials')
      .select('dose_id, trials_remaining');

    if (error) {
      console.error('Error fetching trial counts:', error);
      return NextResponse.json({ 
        trials: cachedTrials || {}, 
        error: true 
      });
    }

    const trials: TrialData = {};
    if (data) {
      data.forEach((row: { dose_id: string; trials_remaining: number }) => {
        trials[row.dose_id] = row.trials_remaining;
      });
    }

    cachedTrials = trials;
    lastFetch = now;

    if (doseId) {
      return NextResponse.json({ 
        count: trials[doseId] ?? 420, 
        doseId,
        cached: false 
      });
    }
    
    return NextResponse.json({ trials, cached: false });
  } catch (error) {
    console.error('Trial count error:', error);
    return NextResponse.json({ 
      trials: cachedTrials || {}, 
      error: true 
    });
  }
}
