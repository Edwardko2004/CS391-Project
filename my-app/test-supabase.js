// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('URL:', supabaseUrl)
console.log('Key exists:', !!supabaseKey)

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  try {
    console.log('Testing Supabase connection...')
    
    const { data, error } = await supabase.from('events').select('*').limit(2)
    
    if (error) {
      console.log('ERROR:', error)
    } else {
      console.log('SUCCESS! Found events:', data)
    }
    
  } catch (err) {
    console.log('EXCEPTION:', err)
  }
}

test()
