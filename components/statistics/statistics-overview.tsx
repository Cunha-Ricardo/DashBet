"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBets } from "@/lib/hooks/use-bets"
import { formatCurrency } from "@/lib/utils"

export function StatisticsOverview() {
  const { bets } = useBets()

  // Calculate statistics
  const totalBets = bets.length
  const totalWagered = bets.reduce((acc, bet) => acc + bet.amount, 0)

  const winningBets = bets.filter((bet) => bet.result === "win")
  const totalWins = winningBets.length
  const totalWinnings = winningBets.reduce((acc, bet) => acc + bet.amount * bet.odds, 0)

  const losingBets = bets.filter((bet) => bet.result === "loss")
  const totalLosses = losingBets.length
  const totalLost = losingBets.reduce((acc, bet) => acc + bet.amount, 0)

  const netProfit = totalWinnings - totalWagered
  const roi = totalWagered > 0 ? (netProfit / totalWagered) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Apostado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalWagered)}</div>
          <p className="text-xs text-muted-foreground">Em {totalBets} apostas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ganho</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(totalWinnings)}</div>
          <p className="text-xs text-muted-foreground">Em {totalWins} apostas vencedoras</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Perdido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(totalLost)}</div>
          <p className="text-xs text-muted-foreground">Em {totalLosses} apostas perdidas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ROI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${roi >= 0 ? "text-green-500" : "text-red-500"}`}>{roi.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground">Retorno sobre investimento</p>
        </CardContent>
      </Card>
    </div>
  )
}

