'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useSupabaseAuth } from '../lib/SupabaseProvider'
import { Layout, Menu } from 'antd'
import { useRouter, usePathname } from 'next/navigation';
import { MenuInfo } from 'rc-menu/lib/interface';
import UserMenu from './UserMenu';
import Image from 'next/image'
const { Header } = Layout;

// Navbar component
export default function Navbar() {
  const { user, signOut, loading } = useSupabaseAuth()            // find the current user with supabase auth

  const router = useRouter();       // router used to redirect user to other pages
  const pathname = usePathname();

  // nav items for left side (same for both logged in/out)
  const leftNavItems: { key: string; label: React.ReactNode; href: string }[] = [
    { 
      key: "0", 
      label: (
        <div 
        className="flex items-center gap-1 h-full"
      >
        <Image
          src="/assets/sparklogo-adobe.png"
          alt="Spark! Bytes Logo"
          width={56}
          height={56}
          priority
          className="object-contain"
        />
        <span className="text-base font-medium">Spark! Bytes</span>
      </div>
      ), 
      href: "/" 
    },
    { key: "1", label: "Events", href: "/events"},
    { key: "2", label: "Create", href: "/create-event" },
    { key: "3", label: "About", href: "/about" },
  ]

  // nav items for right side - changes based on auth status
  const getRightNavItems = () => {
    if (user) {
      // When logged in, only show UserMenu (handled separately)
      return []
    } else {
      return [
        { key: "4", label: "Sign up", href: "/signup" },
        { key: "5", label: "Log in", href: "/login" },
      ]
    }
  }

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
        alignItems: 'center',
        padding: '0 24px',
        background: '#001529',
        height: '64px'
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
            border: 'none',
            lineHeight: '64px'
          }}
        />

        {/* Right side - UserMenu when logged in, otherwise auth links */}
        <div className="flex items-center">
          {user ? (
            <UserMenu email={user.email || ''} />
          ) : (
            <Menu
              onClick={handleClick}
              theme="dark"
              mode="horizontal"
              selectedKeys={[selectedKey]}
              items={currentRightItems}
              style={{ 
                minWidth: 0,
                background: 'transparent',
                border: 'none',
                lineHeight: '64px'
              }}
            />
          )}
        </div>
      </Header>
    </div>
  )
}
