"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBets } from "@/lib/hooks/use-bets"
import { useEffect, useRef, useState } from "react"

export function BetTypeDistribution() {
  const { bets } = useBets()
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [isEmpty, setIsEmpty] = useState(true)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: "" })
  const [activeSlice, setActiveSlice] = useState<number | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const animationRef = useRef<number | null>(null)

  // Processar dados para o gráfico
  useEffect(() => {
    if (bets.length > 0) {
      const data = processBetTypeData(bets)
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

  // Cores para o gráfico - Paleta moderna
  const COLORS = [
    "#3b82f6", // Azul
    "#10b981", // Verde
    "#f59e0b", // Amarelo
    "#ef4444", // Vermelho
    "#8b5cf6", // Roxo
    "#ec4899", // Rosa
    "#06b6d4", // Ciano
    "#14b8a6", // Teal
    "#f97316", // Laranja
    "#6366f1", // Indigo
  ]

  // Desenhar o gráfico de pizza usando canvas
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
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 60 // Reduzir o raio para dar mais espaço

    // Calcular o total
    const total = chartData.reduce((sum, item) => sum + item.value, 0)

    // Desenhar a pizza
    let startAngle = -Math.PI / 2 // Começar do topo
    let endAngle = -Math.PI / 2
    const sliceInfo = []

    // Adicionar um fundo circular suave
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(200, 200, 200, 0.1)"
    ctx.fill()

    for (let i = 0; i < chartData.length; i++) {
      const item = chartData[i]
      // Aplicar animação ao ângulo da fatia
      const sliceAngle = (item.value / total) * 2 * Math.PI * animationProgress

      endAngle = startAngle + sliceAngle

      // Verificar se esta fatia está ativa (hover)
      const isActive = activeSlice === i

      // Se ativa, desenhar a fatia ligeiramente para fora
      const offset = isActive ? 15 : 0
      const sliceRadius = radius + offset

      // Calcular o ponto médio da fatia para o offset
      const midAngle = startAngle + sliceAngle / 2
      const offsetX = offset * Math.cos(midAngle)
      const offsetY = offset * Math.sin(midAngle)

      // Desenhar sombra para dar profundidade
      if (isActive) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
      } else {
        ctx.shadowColor = "transparent"
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      }

      ctx.beginPath()
      ctx.moveTo(centerX + offsetX, centerY + offsetY)
      ctx.arc(centerX + offsetX, centerY + offsetY, sliceRadius, startAngle, endAngle)
      ctx.closePath()

      // Criar gradiente para cada fatia
      const gradient = ctx.createRadialGradient(
        centerX + offsetX,
        centerY + offsetY,
        0,
        centerX + offsetX,
        centerY + offsetY,
        sliceRadius,
      )
      const baseColor = COLORS[i % COLORS.length]
      gradient.addColorStop(0, lightenColor(baseColor, 20))
      gradient.addColorStop(1, baseColor)

      ctx.fillStyle = gradient
      ctx.fill()

      // Adicionar borda
      ctx.lineWidth = 2
      ctx.strokeStyle = "#fff"
      ctx.stroke()

      // Calcular posição para o texto
      const labelRadius = sliceRadius * 0.7
      const labelX = centerX + offsetX + labelRadius * Math.cos(midAngle)
      const labelY = centerY + offsetY + labelRadius * Math.sin(midAngle)

      // Desenhar texto
      ctx.fillStyle = "#fff"
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 3
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1

      const percent = Math.round((item.value / total) * 100)
      if (percent > 5) {
        // Só mostrar texto se o segmento for grande o suficiente
        ctx.fillText(`${percent}%`, labelX, labelY)
      }

      // Resetar sombra
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // Armazenar informações da fatia para interatividade
      sliceInfo.push({
        startAngle,
        endAngle,
        midAngle,
        item,
        percent,
      })

      startAngle = endAngle
    }

    // Desenhar legenda moderna
    const legendX = 20
    let legendY = height - 20 - chartData.length * 25 // Mais espaço entre itens

    // Fundo da legenda
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    ctx.fillRect(legendX - 10, legendY - 15, 200, chartData.length * 25 + 10)
    ctx.strokeStyle = "rgba(200, 200, 200, 0.3)"
    ctx.strokeRect(legendX - 10, legendY - 15, 200, chartData.length * 25 + 10)

    for (let i = 0; i < chartData.length; i++) {
      const item = chartData[i]

      // Destacar a legenda se a fatia estiver ativa
      const isActive = activeSlice === i

      // Desenhar indicador colorido moderno
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.beginPath()
      ctx.roundRect(legendX, legendY - 8, 16, 16, 4) // Retângulo arredondado
      ctx.fill()

      if (isActive) {
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Desenhar texto
      ctx.fillStyle = isActive ? "#fff" : "rgba(255, 255, 255, 0.8)"
      ctx.font = isActive ? "bold 12px Arial" : "12px Arial"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"

      const percent = Math.round((item.value / total) * 100)
      ctx.fillText(`${item.name} (${item.value}) - ${percent}%`, legendX + 24, legendY)

      legendY += 25
    }

    // Adicionar event listener para detectar hover
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Converter para coordenadas relativas ao centro
      const x = mouseX - centerX
      const y = mouseY - centerY

      // Calcular distância do centro
      const distance = Math.sqrt(x * x + y * y)

      // Verificar se está dentro do raio da pizza
      if (distance <= radius + 15) {
        // +15 para melhor detecção nas bordas
        // Calcular ângulo
        let angle = Math.atan2(y, x)
        if (angle < -Math.PI / 2) angle += 2 * Math.PI // Ajustar para o início no topo

        // Verificar em qual fatia o mouse está
        for (let i = 0; i < sliceInfo.length; i++) {
          const { startAngle, endAngle, item, percent } = sliceInfo[i]
          if (angle >= startAngle && angle <= endAngle) {
            setActiveSlice(i)
            setTooltip({
              visible: true,
              x: mouseX,
              y: mouseY,
              content: `<strong>${item.name}</strong><br>Quantidade: ${item.value}<br>Percentual: ${percent}%`,
            })
            return
          }
        }
      } else {
        // Verificar se está sobre a legenda
        if (mouseX >= legendX - 10 && mouseX <= legendX + 190) {
          const index = Math.floor((mouseY - (height - 20 - chartData.length * 25 - 15)) / 25)
          if (index >= 0 && index < chartData.length) {
            setActiveSlice(index)
            return
          }
        }

        setActiveSlice(null)
        setTooltip((prev) => ({ ...prev, visible: false }))
      }
    }

    const handleMouseLeave = () => {
      setActiveSlice(null)
      setTooltip((prev) => ({ ...prev, visible: false }))
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [chartData, activeSlice, animationProgress])

  // Renderizar estado vazio ou o gráfico
  if (isEmpty) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Distribuição por Tipo</CardTitle>
          <CardDescription>Distribuição das suas apostas por categoria</CardDescription>
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
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Distribuição por Tipo</CardTitle>
        <CardDescription>Distribuição das suas apostas por categoria</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] relative">
        <canvas ref={chartRef} width={800} height={400} className="w-full h-full" />
        {tooltip.visible && (
          <div
            className="absolute bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border text-sm z-10 transition-all duration-200"
            style={{
              left: `${tooltip.x + 10}px`,
              top: `${tooltip.y + 10}px`,
              opacity: tooltip.visible ? 1 : 0,
            }}
            dangerouslySetInnerHTML={{ __html: tooltip.content }}
          />
        )}
      </CardContent>
    </Card>
  )
}

// Função auxiliar para clarear cores
function lightenColor(color: string, percent: number) {
  const num = Number.parseInt(color.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = ((num >> 8) & 0x00ff) + amt
  const B = (num & 0x0000ff) + amt

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`
}

function processBetTypeData(bets: any[]) {
  // Count bets by type
  const betTypeCount = bets.reduce(
    (acc, bet) => {
      if (!acc[bet.type]) {
        acc[bet.type] = 0
      }
      acc[bet.type]++
      return acc
    },
    {} as Record<string, number>,
  )

  // Format for pie chart
  return Object.entries(betTypeCount).map(([name, value]) => ({
    name,
    value,
  }))
}

