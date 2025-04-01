"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBets } from "@/lib/hooks/use-bets"
import { useState } from "react"

export function BetsTableFilters() {
  const { bets } = useBets()
  const [period, setPeriod] = useState("all")
  const [type, setType] = useState("all")

  // Get unique bet types
  const betTypes = Array.from(new Set(bets.map((bet) => bet.type)))

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="grid gap-2">
            <label htmlFor="period" className="text-sm font-medium">
              Período
            </label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="period" className="w-full md:w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="7days">Últimos 7 dias</SelectItem>
                <SelectItem value="30days">Últimos 30 dias</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="type" className="text-sm font-medium">
              Tipo de Aposta
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type" className="w-full md:w-[180px]">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {betTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end ml-auto">
            <Button variant="outline">Limpar Filtros</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

