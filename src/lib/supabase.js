import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xbptifjybluzyijhrghn.supabase.co'
const supabaseKey = 'sb_publishable_ykIKnphUBM6Y-R4rR1_ddQ_-Jpqdlom'

export const supabase = createClient(supabaseUrl, supabaseKey)