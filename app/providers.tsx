"use client"

import type React from "react"

import { BetsProvider } from "@/lib/hooks/use-bets"
import { UserSettingsProvider } from "@/lib/hooks/use-user-settings"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserSettingsProvider>
      <BetsProvider>{children}</BetsProvider>
    </UserSettingsProvider>
  )
}

