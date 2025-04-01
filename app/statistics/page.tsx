import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatisticsOverview } from "@/components/statistics/statistics-overview"
import { BetTypePerformance } from "@/components/statistics/bet-type-performance"
import { ROIChart } from "@/components/statistics/roi-chart"
import { BestWorstOdds } from "@/components/statistics/best-worst-odds"

export default function StatisticsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Relatórios e Estatísticas" text="Análise detalhada do seu desempenho de apostas." />
      <StatisticsOverview />
      <div className="grid gap-4 md:grid-cols-2">
        <ROIChart />
        <BetTypePerformance />
      </div>
      <BestWorstOdds />
    </DashboardShell>
  )
}

