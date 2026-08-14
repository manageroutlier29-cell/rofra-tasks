import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tebkhzmijudgdzhroznq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Sb_publishable_BhqUb2pYljolVucyHdvY-A_LzjfUpNQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
