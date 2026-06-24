import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lqwbgilymqkxszjwinls.supabase.co'
const SUPABASE_KEY = 'sb_publishable_5fvrUPSnmx-T-h9-g_XCcQ_XFKCDeRU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})
