"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { FileText, Users, Heart, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentForms } from "@/components/dashboard/recent-forms";
import { BloodTypeChart } from "@/components/dashboard/blood-type-chart";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface EmergencyForm {
  id: string;
  title: string;
  blood_type: string;
  status: string;
  created_at: string;
}

interface ReportData {
  total: number;
  bloodTypeDistribution: Array<{ blood_type: string; count: number }>;
  recentForms: EmergencyForm[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { data: forms } = useSWR<EmergencyForm[]>(
    status === "authenticated" ? "/api/forms" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: reports } = useSWR<ReportData>(
    status === "authenticated" ? "/api/reports" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else {
      setIsLoading(false);
    }
  }, [status, router]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session.user} />
      
      <main className="container mx-auto py-8 px-4 space-y-8">
        {/* Título e ação */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Painel de Controle</h1>
            <p className="text-muted-foreground mt-1">
              Bem-vindo, {session.user?.name || "usuário"}!
            </p>
          </div>
          <Link href="/forms/new">
            <Button size="lg">
              <FileText className="mr-2 h-4 w-4" />
              Criar Novo Formulário
            </Button>
          </Link>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Formulários"
            value={reports?.total || 0}
            description="Fichas de emergência criadas"
            icon={<FileText className="h-4 w-4" />}
          />
          <StatsCard
            title="Contatos de Emergência"
            value="-"
            description="Contatos cadastrados"
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Informações Médicas"
            value="-"
            description="Formulários com dados"
            icon={<Heart className="h-4 w-4" />}
          />
          <StatsCard
            title="Alertas de Saúde"
            value="0"
            description="Avisos importantes"
            icon={<AlertCircle className="h-4 w-4" />}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports?.bloodTypeDistribution && (
            <BloodTypeChart data={reports.bloodTypeDistribution} />
          )}
          
          {/* Placeholder para outro gráfico */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-semibold mb-2">Próximos Passos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Criar sua primeira ficha de emergência</li>
              <li>• Adicionar contatos de emergência</li>
              <li>• Registrar informações médicas importantes</li>
              <li>• Gerar relatórios de saúde</li>
            </ul>
          </div>
        </div>

        {/* Formulários recentes */}
        {Array.isArray(forms) && <RecentForms forms={forms} />}
      </main>
    </div>
  );
}
