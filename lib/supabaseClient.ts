import { createClient } from '@supabase/supabase-js';

// Configuration fournie par l'utilisateur
const supabaseUrl = 'https://gbqjekahlmkbwhmnvzwj.supabase.co';
const supabaseKey = 'sb_publishable_52tqBasu8TPKXftsGb2Zyg_LoD3TaUe';

export const supabase = createClient(supabaseUrl, supabaseKey);