import type { Bet } from "./hooks/use-bets"
import { jsPDF } from "jspdf"
// Importar o plugin autotable de forma explícita
import autoTable from "jspdf-autotable"

// Função para exportar apostas para CSV
export function exportToCSV() {
  // Obter apostas do localStorage
  const storedBets = localStorage.getItem("bets")
  if (!storedBets) {
    console.error("Nenhuma aposta encontrada para exportar")
    return
  }

  const bets: Bet[] = JSON.parse(storedBets)

  // Criar cabeçalho CSV
  const headers = ["Data", "Tipo", "Valor (R$)", "Odd", "Resultado", "Lucro/Perda (R$)"]

  // Criar linhas de dados
  const rows = bets.map((bet) => {
    const profit = bet.result === "win" ? bet.amount * bet.odds - bet.amount : -bet.amount

    return [
      new Date(bet.date).toLocaleDateString(),
      bet.type,
      bet.amount.toFixed(2),
      bet.odds.toFixed(2),
      bet.result === "win" ? "Ganhou" : "Perdeu",
      profit.toFixed(2),
    ]
  })

  // Calcular estatísticas
  const totalBets = bets.length
  const totalWins = bets.filter((bet) => bet.result === "win").length
  const totalLosses = bets.filter((bet) => bet.result === "loss").length
  const winRate = totalBets > 0 ? (totalWins / totalBets) * 100 : 0

  let totalWagered = 0
  let totalProfit = 0

  bets.forEach((bet) => {
    totalWagered += bet.amount
    if (bet.result === "win") {
      totalProfit += bet.amount * bet.odds - bet.amount
    } else {
      totalProfit -= bet.amount
    }
  })

  const roi = totalWagered > 0 ? (totalProfit / totalWagered) * 100 : 0

  // Adicionar estatísticas
  rows.push([]) // Linha em branco
  rows.push(["ESTATÍSTICAS"])
  rows.push(["Total de Apostas", totalBets.toString()])
  rows.push(["Apostas Ganhas", totalWins.toString()])
  rows.push(["Apostas Perdidas", totalLosses.toString()])
  rows.push(["Total Apostado", totalWagered.toFixed(2)])
  rows.push(["Lucro/Prejuízo Total", totalProfit.toFixed(2)])
  rows.push(["Taxa de Vitória", `${winRate.toFixed(2)}%`])
  rows.push(["ROI", `${roi.toFixed(2)}%`])

  // Adicionar estatísticas por tipo de aposta
  rows.push([]) // Linha em branco
  rows.push(["DESEMPENHO POR TIPO DE APOSTA"])
  rows.push(["Tipo", "Apostas", "Taxa de Vitória", "Lucro/Prejuízo"])

  // Agrupar apostas por tipo
  const betsByType = bets.reduce(
    (acc, bet) => {
      if (!acc[bet.type]) {
        acc[bet.type] = []
      }
      acc[bet.type].push(bet)
      return acc
    },
    {} as Record<string, Bet[]>,
  )

  // Calcular estatísticas por tipo
  for (const [type, typeBets] of Object.entries(betsByType)) {
    const count = typeBets.length
    const wins = typeBets.filter((bet) => bet.result === "win").length
    const typeWinRate = (wins / count) * 100

    let typeProfit = 0
    for (const bet of typeBets) {
      if (bet.result === "win") {
        typeProfit += bet.amount * bet.odds - bet.amount
      } else {
        typeProfit -= bet.amount
      }
    }

    rows.push([type, count.toString(), `${typeWinRate.toFixed(1)}%`, typeProfit.toFixed(2)])
  }

  // Combinar cabeçalho e linhas
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  // Criar blob e link para download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `bettrack_apostas_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Função para exportar apostas para PDF - versão simplificada e mais robusta
export function exportToPDF() {
  try {
    console.log("Iniciando exportação para PDF...")

    // Obter apostas do localStorage
    const storedBets = localStorage.getItem("bets")
    if (!storedBets) {
      console.error("Nenhuma aposta encontrada para exportar")
      return false
    }

    const bets: Bet[] = JSON.parse(storedBets)
    console.log(`Dados carregados: ${bets.length} apostas encontradas`)

    // Criar novo documento PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    console.log("Documento PDF criado")

    // Verificar se o plugin autoTable está disponível
    if (typeof doc.autoTable !== "function") {
      // Adicionar o plugin manualmente se não estiver disponível
      ;(doc as any).autoTable = autoTable
      console.log("Plugin autoTable adicionado manualmente")
    }

    // Adicionar cabeçalho
    doc.setFillColor(41, 128, 185)
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("BetTrack", 14, 15)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Relatório de Apostas", 14, 22)

    console.log("Cabeçalho adicionado")

    // Adicionar data de geração
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() - 14, 38, {
      align: "right",
    })

    // Calcular estatísticas básicas
    const totalBets = bets.length
    const totalWins = bets.filter((bet) => bet.result === "win").length
    const totalLosses = bets.filter((bet) => bet.result === "loss").length

    let totalWagered = 0
    let totalProfit = 0

    bets.forEach((bet) => {
      totalWagered += bet.amount
      if (bet.result === "win") {
        totalProfit += bet.amount * bet.odds - bet.amount
      } else {
        totalProfit -= bet.amount
      }
    })

    const winRate = totalBets > 0 ? (totalWins / totalBets) * 100 : 0
    const roi = totalWagered > 0 ? (totalProfit / totalWagered) * 100 : 0

    console.log("Estatísticas calculadas")

    // Adicionar título da seção de estatísticas
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Resumo Estatístico", 14, 45)

    // Preparar dados para a tabela de estatísticas
    const statsData = [
      ["Total de Apostas", totalBets.toString()],
      ["Apostas Ganhas", totalWins.toString()],
      ["Apostas Perdidas", totalLosses.toString()],
      ["Total Apostado", `R$ ${totalWagered.toFixed(2)}`],
      ["Lucro/Prejuízo Total", `R$ ${totalProfit.toFixed(2)}`],
      ["Taxa de Vitória", `${winRate.toFixed(2)}%`],
      ["ROI", `${roi.toFixed(2)}%`],
    ]

    console.log("Dados da tabela de estatísticas preparados")

    // Adicionar tabela de estatísticas
    try {
      ;(doc as any).autoTable({
        startY: 50,
        body: statsData,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 80 },
          1: { cellWidth: 60 },
        },
      })
      console.log("Tabela de estatísticas adicionada com sucesso")
    } catch (error) {
      console.error("Erro ao adicionar tabela de estatísticas:", error)
      throw new Error("Falha ao adicionar tabela de estatísticas")
    }

    // Preparar dados para a tabela de apostas
    const tableColumn = ["Data", "Tipo", "Valor (R$)", "Odd", "Resultado", "Lucro/Perda (R$)"]
    const tableRows = bets.map((bet) => {
      const profit = bet.result === "win" ? bet.amount * bet.odds - bet.amount : -bet.amount
      return [
        new Date(bet.date).toLocaleDateString(),
        bet.type,
        bet.amount.toFixed(2),
        bet.odds.toFixed(2),
        bet.result === "win" ? "Ganhou" : "Perdeu",
        profit.toFixed(2),
      ]
    })

    console.log("Dados da tabela de apostas preparados")

    // Adicionar título da seção de apostas
    const currentY = (doc as any).lastAutoTable?.finalY + 15 || 120
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Histórico de Apostas", 14, currentY)

    // Adicionar tabela de apostas
    try {
      ;(doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: currentY + 5,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      })
      console.log("Tabela de apostas adicionada com sucesso")
    } catch (error) {
      console.error("Erro ao adicionar tabela de apostas:", error)
      throw new Error("Falha ao adicionar tabela de apostas")
    }

    // Adicionar rodapé
    try {
      const pageCount = (doc as any).internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text(
          `BetTrack - Relatório de Apostas - Página ${i} de ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" },
        )
      }
      console.log("Rodapé adicionado com sucesso")
    } catch (error) {
      console.error("Erro ao adicionar rodapé:", error)
      // Continuar mesmo se o rodapé falhar
    }

    // Salvar o PDF
    try {
      doc.save(`bettrack_relatorio_${new Date().toISOString().split("T")[0]}.pdf`)
      console.log("PDF salvo com sucesso")
      return true
    } catch (error) {
      console.error("Erro ao salvar o PDF:", error)
      throw new Error("Falha ao salvar o PDF")
    }
  } catch (error) {
    console.error("Erro ao exportar para PDF:", error)
    return false
  }
}

