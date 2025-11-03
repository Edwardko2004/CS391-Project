import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export async function signUp(email: string, password: string, name: string) {
  try {
    console.log('Signup attempt for:', email)
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists:', email)
      return { error: 'User already exists' }
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('Password hashed, creating user...')
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    console.log('User created successfully:', user.id)
    return { user: { id: user.id, email: user.email, name: user.name } }
  } catch (error: any) {
    console.log('Signup error:', error)
    return { error: error.message || 'Internal server error' }
  }
}

export async function signIn(email: string, password: string) {
  try {
    console.log('Signin attempt for:', email)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('User not found:', email)
      return { error: 'Invalid credentials' }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      console.log('Password mismatch for:', email)
      return { error: 'Invalid credentials' }
    }

    console.log('Signin successful:', user.id)
    return { user: { id: user.id, email: user.email, name: user.name } }
  } catch (error: any) {
    console.log('Signin error:', error)
    return { error: error.message || 'Internal server error' }
  }
}
