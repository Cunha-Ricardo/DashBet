import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { BetTypeDistribution } from "@/components/dashboard/bet-type-distribution"
import { RecentBets } from "@/components/dashboard/recent-bets"
import { ProfitLossChart } from "@/components/dashboard/profit-loss-chart"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Visualize seu desempenho de apostas e estatísticas." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardStats />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ProfitLossChart />
        <BetTypeDistribution />
      </div>
      <RecentBets />
      {/* O componente EmptyState será exibido condicionalmente dentro dos componentes acima quando não houver apostas */}
    </DashboardShell>
  )
}

