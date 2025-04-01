import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NewBetForm } from "@/components/bets/new-bet-form"

export default function NewBetPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Nova Aposta" text="Adicione uma nova aposta ao seu histórico." />
      <NewBetForm />
    </DashboardShell>
  )
}

