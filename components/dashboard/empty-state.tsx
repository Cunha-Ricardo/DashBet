import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export function EmptyState() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Bem-vindo ao BetTrack</CardTitle>
        <CardDescription>Comece a rastrear suas apostas para ver estatísticas e análises detalhadas</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Você ainda não tem nenhuma aposta registrada.</p>
          <p className="text-muted-foreground">
            Adicione sua primeira aposta para começar a ver estatísticas e gráficos.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href="/bets/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Primeira Aposta
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

