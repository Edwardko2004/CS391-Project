'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useSupabaseAuth } from '../lib/SupabaseProvider'
import { Layout, Menu } from 'antd'
import { useRouter, usePathname } from 'next/navigation';
import { MenuInfo } from 'rc-menu/lib/interface';
const { Header } = Layout;

export default function Navbar() {
  const { user, signOut, loading } = useSupabaseAuth()
  const [firstName, setFirstName] = useState<string | null>(null)

  const router = useRouter();
  const pathname = usePathname();

  // nav items for left side (same for both logged in/out)
  const leftNavItems: { key: string; label: string; href: string }[] = [
    { key: "0", label: "Home", href: "/" },
    { key: "1", label: "Events", href: "/events"},
    { key: "2", label: "Create", href: "/create-event" },
    { key: "3", label: "About", href: "/about" },
  ]

  // nav items for right side - changes based on auth status
  const getRightNavItems = () => {
    if (user) {
      return [
        { key: "4", label: "Log Out", href: "/logout" },
      ]
    } else {
      return [
        { key: "4", label: "Sign up", href: "/signup" },
        { key: "5", label: "Log in", href: "/login" },
      ]
    }
  }

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  }

  const handleClick = (e: MenuInfo) => {
    const allItems = [...leftNavItems, ...getRightNavItems()]
    const key = parseInt(e.key);
    
    // Handle logout separately <- this is not a great solution imo, change maybe?
    if (user && key === 4) {
      handleLogout();
      return;
    }
    
    if (key < 0 || key >= allItems.length) return;
    router.push(allItems[key].href);
  }

  // Get current nav items for selected key calculation
  const currentRightItems = getRightNavItems();
  const allItems = [...leftNavItems, ...currentRightItems];
  
  // find selected key
  const selectedKey = allItems
    .findIndex((item) => item.href === pathname)
    .toString();

  return (
    <div className="border-b border-gray-800 bg-[#001529]">
      <Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        padding: '0',
        background: '#001529',
        lineHeight: '64px'
      }}>
        {/* Left side menu */}
        <Menu
          onClick={handleClick}
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          defaultSelectedKeys={['0']}
          items={leftNavItems}
          style={{ 
            flex: 1, 
            minWidth: 0,
            background: 'transparent',
            border: 'none'
          }}
        />

        {/* Right side menu */}
        <Menu
          onClick={handleClick}
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={currentRightItems}
          style={{ 
            minWidth: 0,
            background: 'transparent',
            border: 'none'
          }}
        />
      </Header>
    </div>
  )
}
