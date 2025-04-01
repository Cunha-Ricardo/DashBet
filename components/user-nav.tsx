"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserSettings } from "@/lib/hooks/use-user-settings"
import { useRouter } from "next/navigation"
import { useMemo } from "react"

export function UserNav() {
  const router = useRouter()
  const userSettings = useUserSettings()
  const settings = useMemo(() => {
    try {
      return userSettings.settings
    } catch (error) {
      // Fallback to default settings if the context is not available
      console.log("UserSettings context not available yet, using defaults")
      return { name: "U", email: "user@example.com" }
    }
  }, [userSettings])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="@user" />
            <AvatarFallback>{settings.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{settings.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{settings.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/settings")}>Configurações</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/bets/new")}>Nova Aposta</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/login")}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

