"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

// Define user settings type
export type UserSettings = {
  name: string
  email: string
  monthlyGoal: string
  darkMode: boolean
  notifications: boolean
}

// Default settings
const defaultSettings: UserSettings = {
  name: "Usuário",
  email: "usuario@exemplo.com",
  monthlyGoal: "1000",
  darkMode: true,
  notifications: true,
}

// Create context
type UserSettingsContextType = {
  settings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => void
  toggleDarkMode: () => void
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined)

// Provider component
export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem("userSettings")
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    }

    // Apply dark mode if it's set
    const savedSettings = storedSettings ? JSON.parse(storedSettings) : defaultSettings
    if (savedSettings.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(settings))

    // Apply dark mode when settings change
    if (settings.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [settings])

  // Update settings
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))
  }

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings, toggleDarkMode }}>
      {children}
    </UserSettingsContext.Provider>
  )
}

// Hook to use the user settings context
export function useUserSettings() {
  const context = useContext(UserSettingsContext)
  if (context === undefined) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider")
  }
  return context
}

