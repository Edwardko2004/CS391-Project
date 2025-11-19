'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useSupabaseAuth } from '../lib/SupabaseProvider'
import { Layout, Menu } from 'antd'
import { useRouter, usePathname } from 'next/navigation';
import { MenuInfo } from 'rc-menu/lib/interface';
const { Header } = Layout;

// nav items split into two groups
const leftNavItems: { key: string; label: string; href: string }[] = [
  { key: "0", label: "Home", href: "/" },
  { key: "1", label: "About", href: "/about" },
  { key: "2", label: "Create", href: "/create-event" },
]

const rightNavItems: { key: string; label: string; href: string }[] = [
  { key: "3", label: "Sign up", href: "/signup" },
  { key: "4", label: "Log in", href: "/login" },
]

export default function Navbar() {
  const { user, signOut, loading } = useSupabaseAuth()
  const [firstName, setFirstName] = useState<string | null>(null)

  const router = useRouter();
  const pathname = usePathname();

  // find selected key
  const selectedKey = [...leftNavItems, ...rightNavItems]
    .findIndex((item) => item.href === pathname)
    .toString();

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

  const handleClick = (e: MenuInfo) => {
    const allItems = [...leftNavItems, ...rightNavItems]
    const key = parseInt(e.key);
    if (key < 0 || key >= allItems.length) return;
    router.push(allItems[key].href);
  }

  return (
    <div className="border-b border-gray-800">
      <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side menu */}
        <Menu
          onClick={handleClick}
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          defaultSelectedKeys={['0']}
          items={leftNavItems}
          style={{ flex: 1, minWidth: 0 }}
        />

        {/* Right side menu */}
        <Menu
          onClick={handleClick}
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={rightNavItems}
          style={{ minWidth: 0 }}
        />
      </Header>
    </div>
  )
}
