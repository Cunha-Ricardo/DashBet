"use client"

import { useBets } from "@/lib/hooks/use-bets"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { EmptyState } from "@/components/dashboard/empty-state"

export function BetsTable() {
  const { bets, deleteBet } = useBets()
  const { toast } = useToast()
  const [filter, setFilter] = useState({
    period: "all",
    type: "all",
  })

  // Se não houver apostas, mostrar estado vazio
  if (bets.length === 0) {
    return <EmptyState />
  }

  // Apply filters
  const filteredBets = bets
    .filter((bet) => {
      if (filter.period === "all") return true
      if (filter.period === "7days") {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        return new Date(bet.date) >= sevenDaysAgo
      }
      if (filter.period === "30days") {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return new Date(bet.date) >= thirtyDaysAgo
      }
      return true
    })
    .filter((bet) => {
      if (filter.type === "all") return true
      return bet.type === filter.type
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleDelete = (id: string) => {
    deleteBet(id)
    toast({
      title: "Aposta excluída",
      description: "A aposta foi excluída com sucesso.",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Odd</TableHead>
            <TableHead>Resultado</TableHead>
            <TableHead>Lucro/Perda</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBets.length > 0 ? (
            filteredBets.map((bet) => (
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
                <TableCell>
                  <span className={bet.result === "win" ? "text-green-500" : "text-red-500"}>
                    {bet.result === "win"
                      ? formatCurrency(bet.amount * bet.odds - bet.amount)
                      : formatCurrency(-bet.amount)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(bet.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Nenhuma aposta encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

