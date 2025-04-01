"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBets } from "@/lib/hooks/use-bets"
import { formatCurrency } from "@/lib/utils"

export function BestWorstOdds() {
  const { bets } = useBets()

  // Find best winning odd
  const winningBets = bets.filter((bet) => bet.result === "win")
  const bestOdd =
    winningBets.length > 0
      ? winningBets.reduce((best, bet) => (bet.odds > best.odds ? bet : best), winningBets[0])
      : null

  // Find worst losing odd
  const losingBets = bets.filter((bet) => bet.result === "loss")
  const worstOdd =
    losingBets.length > 0
      ? losingBets.reduce((worst, bet) => (bet.odds < worst.odds ? bet : worst), losingBets[0])
      : null

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Melhor Odd Vencida</CardTitle>
          <CardDescription>A aposta com a maior odd que você ganhou</CardDescription>
        </CardHeader>
        <CardContent>
          {bestOdd ? (
            <div className="space-y-2">
              <div className="text-3xl font-bold">{bestOdd.odds.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">
                {bestOdd.type} - {new Date(bestOdd.date).toLocaleDateString()}
              </div>
              <div className="text-sm">Valor apostado: {formatCurrency(bestOdd.amount)}</div>
              <div className="text-sm text-green-500">
                Ganho: {formatCurrency(bestOdd.amount * bestOdd.odds - bestOdd.amount)}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Nenhuma aposta vencedora registrada.</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pior Odd Perdida</CardTitle>
          <CardDescription>A aposta com a menor odd que você perdeu</CardDescription>
        </CardHeader>
        <CardContent>
          {worstOdd ? (
            <div className="space-y-2">
              <div className="text-3xl font-bold">{worstOdd.odds.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">
                {worstOdd.type} - {new Date(worstOdd.date).toLocaleDateString()}
              </div>
              <div className="text-sm">Valor apostado: {formatCurrency(worstOdd.amount)}</div>
              <div className="text-sm text-red-500">Perda: {formatCurrency(worstOdd.amount)}</div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Nenhuma aposta perdedora registrada.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

