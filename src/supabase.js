import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan Key dari dashboard Supabase Anda
const supabaseUrl = 'https://cgncngwniqqnllbzsfdv.supabase.co';
const supabaseKey = 'sb_publishable_y1kKilT5HxXysJntaM3SvA_R2R0H9W4';

export const supabase = createClient(supabaseUrl, supabaseKey);