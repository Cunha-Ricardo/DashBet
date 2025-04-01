"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBets } from "@/lib/hooks/use-bets"
import { useEffect, useRef, useState } from "react"

export function ROIChart() {
  const { bets } = useBets()
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [isEmpty, setIsEmpty] = useState(true)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: "" })
  const [animationProgress, setAnimationProgress] = useState(0)
  const animationRef = useRef<number | null>(null)

  // Processar dados para o gráfico
  useEffect(() => {
    if (bets.length > 0) {
      const data = processROIChartData(bets)
      setChartData(data)
      setIsEmpty(data.length === 0)
      // Iniciar animação quando os dados mudam
      setAnimationProgress(0)
    } else {
      setChartData([])
      setIsEmpty(true)
    }
  }, [bets])

  // Animação
  useEffect(() => {
    if (isEmpty || animationProgress >= 1) return

    const animate = () => {
      setAnimationProgress((prev) => {
        const newProgress = prev + 0.03
        return newProgress > 1 ? 1 : newProgress
      })
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animationProgress, isEmpty])

  // Desenhar o gráfico usando canvas
  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return

    const canvas = chartRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Definir dimensões
    const width = canvas.width
    const height = canvas.height
    const padding = 40
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    // Encontrar valores mínimos e máximos
    const values = chartData.map((d) => d.roi)
    const maxValue = Math.max(...values, 0)
    const minValue = Math.min(...values, 0)
    const valueRange = maxValue - minValue

    // Desenhar fundo com gradiente
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
    bgGradient.addColorStop(0, "rgba(16, 185, 129, 0.05)")
    bgGradient.addColorStop(1, "rgba(16, 185, 129, 0)")
    ctx.fillStyle = bgGradient
    ctx.fillRect(padding, padding, chartWidth, chartHeight)

    // Desenhar eixos
    ctx.beginPath()
    ctx.strokeStyle = "rgba(200, 200, 200, 0.5)"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Desenhar linhas de grade horizontais
    const gridLines = 5
    ctx.textAlign = "right"
    ctx.font = "10px Arial"
    ctx.fillStyle = "#666"

    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i
      const value = maxValue - (valueRange / gridLines) * i

      ctx.beginPath()
      ctx.strokeStyle = "rgba(200, 200, 200, 0.3)"
      ctx.setLineDash([5, 5])
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillText(`${value.toFixed(1)}%`, padding - 5, y + 3)
    }

    // Desenhar datas no eixo X
    ctx.textAlign = "center"
    ctx.fillStyle = "#666"
    const step = Math.max(1, Math.floor(chartData.length / 6))
    for (let i = 0; i < chartData.length; i += step) {
      const x = padding + (chartWidth / (chartData.length - 1)) * i
      ctx.fillText(chartData[i].date, x, height - padding + 15)
    }

    // Função para converter valor para coordenada Y
    const getY = (value: number) => {
      return padding + chartHeight - ((value - minValue) / valueRange) * chartHeight
    }

    // Calcular pontos para a animação
    const animatedPoints = chartData.map((data, i) => {
      const x = padding + (chartWidth / (chartData.length - 1)) * i
      const targetY = getY(data.roi)
      const baseY = height - padding // Linha de base

      // Interpolar entre a linha de base e o valor final
      const y = baseY - (baseY - targetY) * animationProgress

      return { x, y, data }
    })

    // Desenhar área sob a linha
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)

    for (let i = 0; i < animatedPoints.length; i++) {
      const { x, y } = animatedPoints[i]
      ctx.lineTo(x, y)
    }

    ctx.lineTo(padding + chartWidth, height - padding)
    ctx.closePath()

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.3)")
    gradient.addColorStop(1, "rgba(16, 185, 129, 0.05)")
    ctx.fillStyle = gradient
    ctx.fill()

    // Desenhar linha do gráfico
    ctx.beginPath()
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 3
    ctx.lineJoin = "round"

    for (let i = 0; i < animatedPoints.length; i++) {
      const { x, y } = animatedPoints[i]

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()

    // Desenhar pontos
    for (let i = 0; i < animatedPoints.length; i++) {
      const { x, y } = animatedPoints[i]

      // Desenhar sombra
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(16, 185, 129, 0.3)"
      ctx.fill()

      // Desenhar ponto
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#10b981"
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // Adicionar event listener para mostrar tooltip
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Verificar se o mouse está sobre algum ponto
      let isOverPoint = false
      for (const point of animatedPoints) {
        const distance = Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2))
        if (distance < 15) {
          // Raio de detecção
          setTooltip({
            visible: true,
            x: point.x,
            y: point.y,
            content: `<strong>Data:</strong> ${point.data.date}<br><strong>ROI:</strong> ${point.data.roi.toFixed(2)}%`,
          })
          isOverPoint = true
          break
        }
      }

      if (!isOverPoint) {
        setTooltip((prev) => ({ ...prev, visible: false }))
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [chartData, animationProgress])

  // Renderizar estado vazio ou o gráfico
  if (isEmpty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ROI ao Longo do Tempo</CardTitle>
          <CardDescription>Evolução do seu retorno sobre investimento</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Sem dados para exibir</p>
            <p className="text-sm text-muted-foreground">Adicione apostas para ver o gráfico</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ROI ao Longo do Tempo</CardTitle>
        <CardDescription>Evolução do seu retorno sobre investimento</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] relative">
        <canvas ref={chartRef} width={800} height={400} className="w-full h-full" />
        {tooltip.visible && (
          <div
            className="absolute bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border text-sm z-10 transition-all duration-200"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 40}px`,
              transform: "translateX(-50%)",
              opacity: tooltip.visible ? 1 : 0,
            }}
            dangerouslySetInnerHTML={{ __html: tooltip.content }}
          />
        )}
      </CardContent>
    </Card>
  )
}

function processROIChartData(bets: any[]) {
  if (bets.length === 0) return []

  // Sort bets by date
  const sortedBets = [...bets].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Group by date
  const groupedByDate = sortedBets.reduce(
    (acc, bet) => {
      const date = new Date(bet.date).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(bet)
      return acc
    },
    {} as Record<string, any[]>,
  )

  let cumulativeWagered = 0
  let cumulativeProfit = 0
  const data = []

  // Calculate ROI for each date
  for (const [date, dateBets] of Object.entries(groupedByDate)) {
    let dailyWagered = 0
    let dailyProfit = 0

    for (const bet of dateBets) {
      dailyWagered += bet.amount

      if (bet.result === "win") {
        dailyProfit += bet.amount * bet.odds - bet.amount
      } else {
        dailyProfit -= bet.amount
      }
    }

    cumulativeWagered += dailyWagered
    cumulativeProfit += dailyProfit

    const roi = cumulativeWagered > 0 ? (cumulativeProfit / cumulativeWagered) * 100 : 0

    data.push({
      date,
      roi: Number.parseFloat(roi.toFixed(2)),
    })
  }

  return data
}

