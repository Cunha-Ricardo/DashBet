"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useUserSettings } from "@/lib/hooks/use-user-settings"
import { useState, useEffect } from "react"
import { exportToCSV, exportToPDF } from "@/lib/export-utils"

export function SettingsForm() {
  const { toast } = useToast()
  const { settings, updateSettings } = useUserSettings()
  const [formData, setFormData] = useState(settings)
  const [isExporting, setIsExporting] = useState(false)

  // Update form data when settings change
  useEffect(() => {
    setFormData(settings)
  }, [settings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Save settings
    updateSettings(formData)

    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso.",
    })
  }

  // Modificar a função handleExportData para lidar melhor com erros
  const handleExportData = async (format: "csv" | "pdf") => {
    try {
      setIsExporting(true)

      // Export data
      if (format === "csv") {
        exportToCSV()
        toast({
          title: `Dados exportados como CSV`,
          description: `Seus dados foram exportados com sucesso no formato CSV.`,
        })
      } else {
        try {
          exportToPDF()
          toast({
            title: `Dados exportados como PDF`,
            description: `Seus dados foram exportados com sucesso no formato PDF.`,
          })
        } catch (error) {
          console.error("Erro ao exportar PDF:", error)
          toast({
            title: "Erro ao exportar PDF",
            description: "Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      toast({
        title: "Erro ao exportar dados",
        description: "Ocorreu um erro ao exportar seus dados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Gerencie suas informações de perfil.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Salvar Alterações</Button>
          </CardFooter>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Metas</CardTitle>
          <CardDescription>Defina suas metas de lucro mensais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyGoal">Meta de Lucro Mensal</Label>
            <Input
              id="monthlyGoal"
              name="monthlyGoal"
              type="number"
              value={formData.monthlyGoal}
              onChange={handleChange}
              prefix="R$"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={handleSubmit}>
            Salvar Meta
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
          <CardDescription>Personalize sua experiência no aplicativo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">Modo Escuro</Label>
            <Switch
              id="darkMode"
              checked={formData.darkMode}
              onCheckedChange={(checked) => handleSwitchChange("darkMode", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notificações</Label>
            <Switch
              id="notifications"
              checked={formData.notifications}
              onCheckedChange={(checked) => handleSwitchChange("notifications", checked)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={handleSubmit}>
            Salvar Preferências
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exportar Dados</CardTitle>
          <CardDescription>Exporte seus dados para backup ou análise.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Exporte todos os seus dados de apostas para análise ou backup. Os relatórios incluem estatísticas detalhadas
            e análises de desempenho.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="button" onClick={() => handleExportData("csv")} disabled={isExporting}>
              {isExporting ? "Exportando..." : "Exportar como CSV"}
            </Button>
            <Button type="button" onClick={() => handleExportData("pdf")} disabled={isExporting}>
              {isExporting ? "Exportando..." : "Exportar como PDF"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

