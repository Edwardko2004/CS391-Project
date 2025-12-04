// Test script to verify Supabase auth updates work
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Check your .env file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuthUpdate() {
  console.log('Testing Supabase auth update...')
  
  // First, sign in with test credentials (you'll need to change these)
  const email = 'test@example.com' // Change to your test user email
  const password = 'password123'   // Change to your test user password
  
  console.log(`Signing in as ${email}...`)
  
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (signInError) {
    console.error('Sign in error:', signInError.message)
    return
  }
  
  console.log('Signed in successfully!')
  
  // Test updating user metadata
  console.log('Updating user metadata...')
  const { data: updateData, error: updateError } = await supabase.auth.updateUser({
    data: {
      first_name: 'TestFirstName',
      last_name: 'TestLastName'
    }
  })
  
  if (updateError) {
    console.error('Update error:', updateError.message)
  } else {
    console.log('Update successful!')
    console.log('Updated user:', JSON.stringify(updateData.user, null, 2))
  }
  
  // Sign out
  await supabase.auth.signOut()
  console.log('Signed out.')
}

testAuthUpdate()
