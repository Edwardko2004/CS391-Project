'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useSupabaseAuth } from '../lib/SupabaseProvider'
import { Layout, Menu } from 'antd'
import { useRouter, usePathname } from 'next/navigation';
import { MenuInfo } from 'rc-menu/lib/interface';
const { Header } = Layout;

// the list of nav items
const navItems: { key: string; label: string; href: string }[] = [
  {key: "0", label: "Home", href: "/"},
  {key: "1", label: "Create", href: "/create-event"},
  {key: "2", label: "Sign up", href: "/signup"},
  {key: "3", label: "Log in", href: "/login"},
]

export default function Navbar() {
  const { user, signOut, loading } = useSupabaseAuth()
  const [firstName, setFirstName] = useState<string | null>(null)

  const router = useRouter();
  const pathname = usePathname();
  const selectedKey = navItems.findIndex((item) => item.href === pathname).toString();

  // Fetch profile once user is logged in
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single()

        if (error) console.error('Error fetching profile:', error)
        else setFirstName(data?.first_name || null)
      } else {
        setFirstName(null)
      }
    }

    fetchProfile()
  }, [user])

  // handle clicking new nav link
  const handleClick = (e: MenuInfo) => {
    const key = parseInt(e.key);
    if (key < 0 || key >= navItems.length) return;
    router.push(navItems[key].href);
  }

  return (
    <div className="border-b border-gray-800">
      <Header>
        <Menu
          onClick={handleClick}
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          defaultSelectedKeys={['0']}
          items={navItems}
          style={{flex:1, minWidth:0}}
        />
      </Header>
    </div>
  )
}