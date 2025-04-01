"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBets } from "@/lib/hooks/use-bets"
import { formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function BetTypePerformance() {
  const { bets } = useBets()

  // Calculate performance by bet type
  const betTypePerformance = calculateBetTypePerformance(bets)

  // Sort by profit (descending)
  const sortedPerformance = [...betTypePerformance].sort((a, b) => b.profit - a.profit)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho por Tipo</CardTitle>
        <CardDescription>Análise de lucro/prejuízo por tipo de aposta</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Apostas</TableHead>
              <TableHead>Taxa de Vitória</TableHead>
              <TableHead className="text-right">Lucro/Prejuízo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPerformance.map((item) => (
              <TableRow key={item.type}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell>{item.winRate.toFixed(1)}%</TableCell>
                <TableCell className="text-right">
                  <span className={item.profit >= 0 ? "text-green-500" : "text-red-500"}>
                    {formatCurrency(item.profit)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function calculateBetTypePerformance(bets: any[]) {
  // Group bets by type
  const betsByType = bets.reduce(
    (acc, bet) => {
      if (!acc[bet.type]) {
        acc[bet.type] = []
      }
      acc[bet.type].push(bet)
      return acc
    },
    {} as Record<string, any[]>,
  )

  // Calculate performance for each type
  return Object.entries(betsByType).map(([type, typeBets]) => {
    const count = typeBets.length
    const wins = typeBets.filter((bet) => bet.result === "win").length
    const winRate = (wins / count) * 100

    let profit = 0
    for (const bet of typeBets) {
      if (bet.result === "win") {
        profit += bet.amount * bet.odds - bet.amount
      } else {
        profit -= bet.amount
      }
    }

    return {
      type,
      count,
      wins,
      winRate,
      profit,
    }
  })
}

