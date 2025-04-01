"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useBets } from "@/lib/hooks/use-bets"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function NewBetForm() {
  const { addBet } = useBets()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "",
    amount: "",
    odds: "",
    result: "loss",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.type || !formData.amount || !formData.odds) {
      toast({
        title: "Erro ao adicionar aposta",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    // Add bet
    addBet({
      id: crypto.randomUUID(),
      date: formData.date,
      type: formData.type,
      amount: Number.parseFloat(formData.amount),
      odds: Number.parseFloat(formData.odds),
      result: formData.result as "win" | "loss",
    })

    toast({
      title: "Aposta adicionada",
      description: "A aposta foi adicionada com sucesso.",
    })

    // Redirect to bets page
    router.push("/bets")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Aposta</CardTitle>
          <CardDescription>Preencha os detalhes da sua aposta para registrá-la.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Data da Aposta</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Aposta</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="escanteios">Escanteios</SelectItem>
                  <SelectItem value="cartoes">Cartões</SelectItem>
                  <SelectItem value="gols">Gols</SelectItem>
                  <SelectItem value="resultado">Resultado</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor Apostado</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="odds">Odd da Aposta</Label>
              <Input
                id="odds"
                name="odds"
                type="number"
                step="0.01"
                placeholder="1.50"
                value={formData.odds}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Resultado da Aposta</Label>
            <RadioGroup
              value={formData.result}
              onValueChange={(value) => handleSelectChange("result", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="win" id="win" />
                <Label htmlFor="win">Ganhou</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="loss" id="loss" />
                <Label htmlFor="loss">Perdeu</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit">Adicionar Aposta</Button>
        </CardFooter>
      </Card>
    </form>
  )
}

