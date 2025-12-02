// components/Navbar.tsx
// the header of the website, used to navigate and log in/out and sign up

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useSupabaseAuth } from '../lib/SupabaseProvider'
import { Layout, Menu } from 'antd'
import { useRouter, usePathname } from 'next/navigation';
import { MenuInfo } from 'rc-menu/lib/interface';
const { Header } = Layout;

// Navbar component
export default function Navbar() {
  const { user, signOut, loading } = useSupabaseAuth()            // find the current user with supabase auth
  const [firstName, setFirstName] = useState<string | null>(null) // the first name of the user

  const router = useRouter();       // router used to redirect user to other pages
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

  // initial API call to find the profile (or specifically the first name) of the user
  useEffect(() => {
    const fetchProfile = async () => {
      // make API call only when there is currently a user
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

  // handles the logout nav
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  }

  // handles the link routing for the navbar
  const handleClick = (e: MenuInfo) => {
    const allItems = [...leftNavItems, ...getRightNavItems()]
    const key = parseInt(e.key);
    
    // Handle logout separately <- this is not a great solution imo, change maybe?
    if (user && key === 4) {
      handleLogout();
      return;
    }
    
    // make sure a given key is valid before we route
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

  // return the final component
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
