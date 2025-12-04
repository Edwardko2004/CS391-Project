'use client'

import { useState, useEffect } from 'react'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    
    const html = document.documentElement
    if (newTheme === 'light') {
      html.classList.remove('dark')
    } else {
      html.classList.add('dark')
    }
    
    localStorage.setItem('theme', newTheme)
    window.dispatchEvent(new Event('themechange'))
  }

  return (
    <Button
      type="text"
      icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      className="text-white hover:text-cyan-300"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </Button>
  )
}
