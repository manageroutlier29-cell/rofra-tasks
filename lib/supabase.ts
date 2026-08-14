import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = (rawUrl && rawUrl.startsWith('http')) 
  ? rawUrl 
  : 'https://tebkhzmijudgdzhroznq.supabase.co';

const supabaseAnonKey = rawKey || 'Sb_publishable_BhqUb2pYljolVucyHdvY-A_LzjfUpNQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
