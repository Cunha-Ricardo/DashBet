"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBets } from "@/lib/hooks/use-bets"
import { formatCurrency } from "@/lib/utils"

export function DashboardStats() {
  const { bets } = useBets()

  // Se não houver apostas, mostrar estado vazio
  if (bets.length === 0) {
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">Adicione apostas para ver estatísticas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Vitória</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0,0%</div>
            <p className="text-xs text-muted-foreground">Adicione apostas para ver estatísticas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Apostado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">Adicione apostas para ver estatísticas</p>
          </CardContent>
        </Card>
      </>
    )
  }

  // Calculate total profit/loss
  const totalProfit = bets.reduce((acc, bet) => {
    if (bet.result === "win") {
      return acc + (bet.amount * bet.odds - bet.amount)
    } else {
      return acc - bet.amount
    }
  }, 0)

  // Calculate win rate
  const winRate = bets.length > 0 ? (bets.filter((bet) => bet.result === "win").length / bets.length) * 100 : 0

  // Calculate total wagered
  const totalWagered = bets.reduce((acc, bet) => acc + bet.amount, 0)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
            {formatCurrency(totalProfit)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Vitória</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Apostado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalWagered)}</div>
        </CardContent>
      </Card>
    </>
  )
}

