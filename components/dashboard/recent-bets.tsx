"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBets } from "@/lib/hooks/use-bets"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EmptyState } from "./empty-state"

export function RecentBets() {
  const { bets } = useBets()

  // Se não houver apostas, mostrar estado vazio
  if (bets.length === 0) {
    return <EmptyState />
  }

  // Get the 5 most recent bets
  const recentBets = [...bets].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Apostas Recentes</CardTitle>
          <CardDescription>Suas apostas mais recentes</CardDescription>
        </div>
        <Button asChild className="ml-auto">
          <Link href="/bets/new">Nova Aposta</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Odd</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead className="text-right">Lucro/Perda</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBets.length > 0 ? (
              recentBets.map((bet) => (
                <TableRow key={bet.id}>
                  <TableCell>{new Date(bet.date).toLocaleDateString()}</TableCell>
                  <TableCell>{bet.type}</TableCell>
                  <TableCell>{formatCurrency(bet.amount)}</TableCell>
                  <TableCell>{bet.odds.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={bet.result === "win" ? "success" : "destructive"}>
                      {bet.result === "win" ? "Ganhou" : "Perdeu"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={bet.result === "win" ? "text-green-500" : "text-red-500"}>
                      {bet.result === "win"
                        ? formatCurrency(bet.amount * bet.odds - bet.amount)
                        : formatCurrency(-bet.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhuma aposta registrada ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {bets.length > 5 && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" asChild>
              <Link href="/bets">Ver todas as apostas</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

