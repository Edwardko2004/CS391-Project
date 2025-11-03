'use client'

import { useAuth } from '../lib/session'
import Link from 'next/link'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="flex justify-between bg-[#0BA698] p-10 text-2xl font-bold">
      <div className="left text-[#CFDACC]">
        <Link href="/">Home</Link>
        <a className="m-5">Create</a>
      </div>
      <div className="text-[#CFDACC]">
        {user ? (
          <>
            <span className="m-5">Welcome, {user.name}</span>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link href="/auth/signup" className="m-5">Sign up</Link>
            <Link href="/auth/signin">Log in</Link>
          </>
        )}
      </div>
    </nav>
  )
}
