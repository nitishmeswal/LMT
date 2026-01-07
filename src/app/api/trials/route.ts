import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cache the result for 30 seconds
let cachedCount: number | null = null;
let lastFetch = 0;
const CACHE_DURATION = 30 * 1000; // 30 seconds

export async function GET() {
  const now = Date.now();
  
  // Return cached result if still valid
  if (cachedCount !== null && now - lastFetch < CACHE_DURATION) {
    return NextResponse.json({ count: cachedCount, cached: true });
  }

  try {
    const { count, error } = await supabase
      .from('trip_ratings')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching trial count:', error);
      return NextResponse.json({ count: cachedCount || 420, error: true });
    }

    const remaining = Math.max(0, 420 - (count || 0));
    cachedCount = remaining;
    lastFetch = now;

    return NextResponse.json({ count: remaining, cached: false });
  } catch (error) {
    console.error('Trial count error:', error);
    return NextResponse.json({ count: cachedCount || 420, error: true });
  }
}
