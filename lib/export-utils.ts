import type { Bet } from "./hooks/use-bets"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

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

// Função para exportar apostas para PDF
export function exportToPDF() {
  try {
    // Obter apostas do localStorage
    const storedBets = localStorage.getItem("bets")
    if (!storedBets) {
      console.error("Nenhuma aposta encontrada para exportar")
      return false
    }

    const bets: Bet[] = JSON.parse(storedBets)

    // Criar novo documento PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Adicionar logo e título
    doc.setFillColor(41, 128, 185) // Azul
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F")

    doc.setTextColor(255, 255, 255) // Branco
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.text("BetTrack", 14, 15)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Relatório de Apostas", 14, 22)

    // Adicionar data de geração
    doc.setTextColor(100, 100, 100) // Cinza
    doc.setFontSize(10)
    doc.text(
      `Gerado em: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`,
      doc.internal.pageSize.getWidth() - 14,
      38,
      { align: "right" },
    )

    // Adicionar resumo estatístico
    doc.setTextColor(0, 0, 0) // Preto
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Resumo Estatístico", 14, 45)

    // Calcular estatísticas
    const totalBets = bets.length
    const totalWagered = bets.reduce((acc, bet) => acc + bet.amount, 0)
    const totalWins = bets.filter((bet) => bet.result === "win").length
    const totalLosses = bets.filter((bet) => bet.result === "loss").length
    const winRate = totalBets > 0 ? (totalWins / totalBets) * 100 : 0

    let totalProfit = 0
    bets.forEach((bet) => {
      if (bet.result === "win") {
        totalProfit += bet.amount * bet.odds - bet.amount
      } else {
        totalProfit -= bet.amount
      }
    })

    const roi = totalWagered > 0 ? (totalProfit / totalWagered) * 100 : 0

    // Tabela de estatísticas gerais
    const statsData = [
      ["Total de Apostas", totalBets.toString()],
      ["Apostas Ganhas", totalWins.toString()],
      ["Apostas Perdidas", totalLosses.toString()],
      ["Total Apostado", `R$ ${totalWagered.toFixed(2)}`],
      ["Lucro/Prejuízo Total", `R$ ${totalProfit.toFixed(2)}`],
      ["Taxa de Vitória", `${winRate.toFixed(2)}%`],
      ["ROI", `${roi.toFixed(2)}%`],
    ]

    // Adicionar tabela de estatísticas
    ;(doc as any).autoTable({
      startY: 50,
      body: statsData,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 5,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      columnStyles: {
        0: {
          fontStyle: "bold",
          fillColor: [240, 240, 240],
          cellWidth: 80,
        },
        1: {
          cellWidth: 60,
          cellCreator: (data: any) => {
            if (data.row.index === 4) {
              // Lucro/Prejuízo Total
              const value = Number.parseFloat(data.cell.raw.replace("R$ ", ""))
              if (value >= 0) {
                data.cell.styles.textColor = [46, 125, 50] // Verde para valores positivos
              } else {
                data.cell.styles.textColor = [198, 40, 40] // Vermelho para valores negativos
              }
            }
            return data
          },
        },
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
    })

    // Adicionar gráfico de desempenho por tipo
    const currentY = (doc as any).lastAutoTable.finalY + 15
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Desempenho por Tipo de Aposta", 14, currentY)

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
    const typeStatsData = []
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

      typeStatsData.push([type, count.toString(), `${typeWinRate.toFixed(1)}%`, `R$ ${typeProfit.toFixed(2)}`])
    }

    // Ordenar por lucro (decrescente)
    typeStatsData.sort((a, b) => {
      const profitA = Number.parseFloat(a[3].replace("R$ ", ""))
      const profitB = Number.parseFloat(b[3].replace("R$ ", ""))
      return profitB - profitA
    })

    // Adicionar tabela de desempenho por tipo
    ;(doc as any).autoTable({
      head: [["Tipo", "Apostas", "Taxa de Vitória", "Lucro/Prejuízo"]],
      body: typeStatsData,
      startY: currentY + 5,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 5,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        3: {
          halign: "right",
          cellCreator: (data: any) => {
            const value = Number.parseFloat(data.cell.raw.replace("R$ ", ""))
            if (value >= 0) {
              data.cell.styles.textColor = [46, 125, 50] // Verde para valores positivos
            } else {
              data.cell.styles.textColor = [198, 40, 40] // Vermelho para valores negativos
            }
            return data
          },
        },
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    })

    // Adicionar tabela de apostas
    const apostasY = (doc as any).lastAutoTable.finalY + 15
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Histórico de Apostas", 14, apostasY)

    // Preparar colunas para a tabela
    const tableColumn = ["Data", "Tipo", "Valor (R$)", "Odd", "Resultado", "Lucro/Perda (R$)"]

    // Preparar dados para a tabela
    const tableRows = []

    for (const bet of bets) {
      const profit = bet.result === "win" ? bet.amount * bet.odds - bet.amount : -bet.amount

      tableRows.push([
        new Date(bet.date).toLocaleDateString(),
        bet.type,
        bet.amount.toFixed(2),
        bet.odds.toFixed(2),
        bet.result === "win" ? "Ganhou" : "Perdeu",
        profit.toFixed(2),
      ])
    }
    // Adicionar tabela ao PDF
    ;(doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: apostasY + 5,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Data
        1: { cellWidth: 30 }, // Tipo
        2: { cellWidth: 25 }, // Valor
        3: { cellWidth: 20 }, // Odd
        4: {
          cellWidth: 25,
          cellCreator: (data: any) => {
            if (data.cell.raw === "Ganhou") {
              data.cell.styles.textColor = [46, 125, 50] // Verde
            } else {
              data.cell.styles.textColor = [198, 40, 40] // Vermelho
            }
            return data
          },
        }, // Resultado
        5: {
          cellWidth: 30,
          halign: "right",
          cellCreator: (data: any) => {
            const value = Number.parseFloat(data.cell.raw)
            if (value >= 0) {
              data.cell.styles.textColor = [46, 125, 50] // Verde para valores positivos
            } else {
              data.cell.styles.textColor = [198, 40, 40] // Vermelho para valores negativos
            }
            return data
          },
        }, // Lucro/Perda
      },
    })

    // Adicionar rodapé
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)

      // Adicionar linha de rodapé
      doc.setDrawColor(200, 200, 200)
      doc.line(
        14,
        doc.internal.pageSize.getHeight() - 20,
        doc.internal.pageSize.getWidth() - 14,
        doc.internal.pageSize.getHeight() - 20,
      )

      // Adicionar texto de rodapé
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(
        `BetTrack - Relatório de Apostas - Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" },
      )
    }

    // Salvar o PDF
    doc.save(`bettrack_relatorio_${new Date().toISOString().split("T")[0]}.pdf`)

    return true
  } catch (error) {
    console.error("Erro ao exportar para PDF:", error)
    return false
  }
}

