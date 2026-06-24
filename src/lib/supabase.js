import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lqwbgilymqkxszjwinls.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxd2JnaWx5bXFreHN6andpbmxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTg4NjMsImV4cCI6MjA5NjQzNDg2M30.U2LLmrthYTYkIBht8MboOrgkJbvZSo4gFhom-y3NsSo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})
