"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChartIcon as ChartBar, CreditCard, Home, ListChecks, Settings } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <CreditCard className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">BetTrack</span>
      </Link>
      <nav className="flex items-center space-x-4 lg:space-x-6">
        <Button
          variant="ghost"
          className={cn("h-8 w-8 p-0 lg:h-auto lg:w-auto lg:px-3 lg:py-2", pathname === "/dashboard" && "bg-muted")}
          asChild
        >
          <Link href="/dashboard">
            <Home className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline-block">Dashboard</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className={cn("h-8 w-8 p-0 lg:h-auto lg:w-auto lg:px-3 lg:py-2", pathname === "/bets" && "bg-muted")}
          asChild
        >
          <Link href="/bets">
            <ListChecks className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline-block">Apostas</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className={cn("h-8 w-8 p-0 lg:h-auto lg:w-auto lg:px-3 lg:py-2", pathname === "/statistics" && "bg-muted")}
          asChild
        >
          <Link href="/statistics">
            <ChartBar className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline-block">Estatísticas</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          className={cn("h-8 w-8 p-0 lg:h-auto lg:w-auto lg:px-3 lg:py-2", pathname === "/settings" && "bg-muted")}
          asChild
        >
          <Link href="/settings">
            <Settings className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline-block">Configurações</span>
          </Link>
        </Button>
      </nav>
    </div>
  )
}

