'use client'

import { useEffect } from 'react'

export default function ThemeScript() {
  useEffect(() => {
    // Function to apply theme
    const applyTheme = (theme) => {
      const html = document.documentElement
      const body = document.body
      
      if (theme === 'light') {
        html.classList.remove('dark')
        html.style.setProperty('--background', '#ffffff')
        html.style.setProperty('--foreground', '#171717')
        body.style.backgroundColor = '#ffffff'
        body.style.color = '#171717'
      } else {
        html.classList.add('dark')
        html.style.setProperty('--background', '#141510')
        html.style.setProperty('--foreground', '#ededed')
        body.style.backgroundColor = '#141510'
        body.style.color = '#ededed'
      }
    }

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme')
    const defaultTheme = savedTheme || 'dark'
    applyTheme(defaultTheme)

    // Listen for theme changes
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        applyTheme(e.newValue || 'dark')
        window.dispatchEvent(new Event('themechange'))
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also check periodically (for same-tab changes)
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem('theme')
      const htmlTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      if (currentTheme !== htmlTheme) {
        applyTheme(currentTheme || 'dark')
      }
    }, 100)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return null
}
