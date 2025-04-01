import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BetsTable } from "@/components/bets/bets-table"
import { BetsTableFilters } from "@/components/bets/bets-table-filters"

export default function BetsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Histórico de Apostas" text="Visualize e gerencie todas as suas apostas." />
      <BetsTableFilters />
      <BetsTable />
    </DashboardShell>
  )
}

