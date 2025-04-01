"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

// Define bet type
export type Bet = {
  id: string
  date: string
  type: string
  amount: number
  odds: number
  result: "win" | "loss"
}

// Create context
type BetsContextType = {
  bets: Bet[]
  addBet: (bet: Bet) => void
  updateBet: (id: string, bet: Partial<Bet>) => void
  deleteBet: (id: string) => void
}

const BetsContext = createContext<BetsContextType | undefined>(undefined)

// Sample data
const sampleBets: Bet[] = [
  {
    id: "1",
    date: "2023-06-01",
    type: "escanteios",
    amount: 100,
    odds: 1.85,
    result: "win",
  },
  {
    id: "2",
    date: "2023-06-02",
    type: "cartoes",
    amount: 50,
    odds: 2.1,
    result: "loss",
  },
  {
    id: "3",
    date: "2023-06-03",
    type: "gols",
    amount: 75,
    odds: 1.95,
    result: "win",
  },
  {
    id: "4",
    date: "2023-06-04",
    type: "resultado",
    amount: 120,
    odds: 2.5,
    result: "loss",
  },
  {
    id: "5",
    date: "2023-06-05",
    type: "escanteios",
    amount: 80,
    odds: 1.75,
    result: "win",
  },
  {
    id: "6",
    date: "2023-06-06",
    type: "cartoes",
    amount: 60,
    odds: 2.2,
    result: "win",
  },
  {
    id: "7",
    date: "2023-06-07",
    type: "gols",
    amount: 90,
    odds: 1.9,
    result: "loss",
  },
  {
    id: "8",
    date: "2023-06-08",
    type: "resultado",
    amount: 150,
    odds: 3.0,
    result: "win",
  },
]

// Provider component
export function BetsProvider({ children }: { children: React.ReactNode }) {
  const [bets, setBets] = useState<Bet[]>([])

  // Load bets from localStorage on mount
  useEffect(() => {
    const storedBets = localStorage.getItem("bets")
    if (storedBets) {
      setBets(JSON.parse(storedBets))
    } else {
      // Carregar dados de exemplo se não houver dados no localStorage
      setBets(sampleBets)
      localStorage.setItem("bets", JSON.stringify(sampleBets))
    }
  }, [])

  // Save bets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bets", JSON.stringify(bets))
  }, [bets])

  // Add a new bet
  const addBet = (bet: Bet) => {
    setBets((prev) => [...prev, bet])
  }

  // Update an existing bet
  const updateBet = (id: string, updatedBet: Partial<Bet>) => {
    setBets((prev) => prev.map((bet) => (bet.id === id ? { ...bet, ...updatedBet } : bet)))
  }

  // Delete a bet
  const deleteBet = (id: string) => {
    setBets((prev) => prev.filter((bet) => bet.id !== id))
  }

  return <BetsContext.Provider value={{ bets, addBet, updateBet, deleteBet }}>{children}</BetsContext.Provider>
}

// Hook to use the bets context
export function useBets() {
  const context = useContext(BetsContext)
  if (context === undefined) {
    throw new Error("useBets must be used within a BetsProvider")
  }
  return context
}

