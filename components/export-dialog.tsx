"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { exportToCSV, exportToPDF } from "@/lib/export-utils"
import { useToast } from "@/hooks/use-toast"

interface ExportDialogProps {
  exportType: "csv" | "pdf"
}

export function ExportDialog({ exportType }: ExportDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState({
    includeId: false,
    includeDate: true,
    includeType: true,
    includeAmount: true,
    includeOdds: true,
    includeResult: true,
    includeProfit: true,
    includeStats: true,
    includeWinRate: true,
    includeROI: true,
  })

  const handleExport = () => {
    try {
      if (exportType === "csv") {
        exportToCSV(options)
      } else {
        exportToPDF(options)
      }

      toast({
        title: `Dados exportados como ${exportType.toUpperCase()}`,
        description: `Seus dados foram exportados com sucesso no formato ${exportType.toUpperCase()}.`,
      })

      setOpen(false)
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      toast({
        title: "Erro ao exportar dados",
        description: "Ocorreu um erro ao exportar seus dados. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setOptions((prev) => ({
      ...prev,
      [id]: checked,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Exportar como {exportType.toUpperCase()}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exportar dados como {exportType.toUpperCase()}</DialogTitle>
          <DialogDescription>Selecione quais informações você deseja incluir na exportação.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Dados das apostas</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeId"
                  checked={options.includeId}
                  onCheckedChange={(checked) => handleCheckboxChange("includeId", checked as boolean)}
                />
                <Label htmlFor="includeId">ID</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeDate"
                  checked={options.includeDate}
                  onCheckedChange={(checked) => handleCheckboxChange("includeDate", checked as boolean)}
                />
                <Label htmlFor="includeDate">Data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeType"
                  checked={options.includeType}
                  onCheckedChange={(checked) => handleCheckboxChange("includeType", checked as boolean)}
                />
                <Label htmlFor="includeType">Tipo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeAmount"
                  checked={options.includeAmount}
                  onCheckedChange={(checked) => handleCheckboxChange("includeAmount", checked as boolean)}
                />
                <Label htmlFor="includeAmount">Valor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeOdds"
                  checked={options.includeOdds}
                  onCheckedChange={(checked) => handleCheckboxChange("includeOdds", checked as boolean)}
                />
                <Label htmlFor="includeOdds">Odds</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeResult"
                  checked={options.includeResult}
                  onCheckedChange={(checked) => handleCheckboxChange("includeResult", checked as boolean)}
                />
                <Label htmlFor="includeResult">Resultado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeProfit"
                  checked={options.includeProfit}
                  onCheckedChange={(checked) => handleCheckboxChange("includeProfit", checked as boolean)}
                />
                <Label htmlFor="includeProfit">Lucro/Perda</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeStats"
                  checked={options.includeStats}
                  onCheckedChange={(checked) => handleCheckboxChange("includeStats", checked as boolean)}
                />
                <Label htmlFor="includeStats">Resumo geral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeWinRate"
                  checked={options.includeWinRate}
                  onCheckedChange={(checked) => handleCheckboxChange("includeWinRate", checked as boolean)}
                />
                <Label htmlFor="includeWinRate">Taxa de vitória</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeROI"
                  checked={options.includeROI}
                  onCheckedChange={(checked) => handleCheckboxChange("includeROI", checked as boolean)}
                />
                <Label htmlFor="includeROI">ROI</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleExport}>
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

