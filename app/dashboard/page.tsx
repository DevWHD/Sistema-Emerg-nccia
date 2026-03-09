"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { FileText, Users, Heart, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentForms } from "@/components/dashboard/recent-forms";
import { BloodTypeChart } from "@/components/dashboard/blood-type-chart";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface EmergencyForm {
  id: string;
  title: string;
  blood_type: string;
  status: string;
  created_at: string;
  form_data?: {
    tipo_atendimento?: string | string[];
    [key: string]: any;
  };
}

interface ReportData {
  total: number;
  bloodTypeDistribution: Array<{ blood_type: string; count: number }>;
  recentForms: EmergencyForm[];
  tipoAtendimentoCounts: Array<{ tipo: string; count: number }>;
}

const TIPOS_ATENDIMENTO = ["R.N.", "PUÉRPERA", "GINECOLOGIA", "OBSTETRICIA", "CM", "VVS"];

const SETORES_INTERNACAO = [
  "R.N.", "PUÉRPERA", "GINECOLOGIA", "OBSTETRICIA",
  "ABORTO", "AB. LEGAL: VVS", "AB. L:ANENCEFALIA", "AB.L: R.VIDA DA GEST.", "CM",
];

const PROCEDIMENTOS_LISTA = [
  { key: "proced_sulfato_mg", label: "Sulfato MG" },
  { key: "proced_drenagem",   label: "Drenagem" },
  { key: "proced_ctg",        label: "CTG" },
  { key: "proced_tig",        label: "TIG" },
  { key: "proced_curativo",   label: "Curativo" },
  { key: "proced_outras",     label: "Outras" },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { data: forms } = useSWR<EmergencyForm[]>(
    "/api/forms",
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: reports } = useSWR<ReportData>(
    "/api/reports",
    fetcher,
    { revalidateOnFocus: false }
  );

  // Calcula contagens por tipo direto dos dados já carregados
  const tipoAtendimentoCounts = TIPOS_ATENDIMENTO.map((tipo) => {
    const count = Array.isArray(forms)
      ? forms.filter((f: any) => {
          const t = f.form_data?.tipo_atendimento;
          if (Array.isArray(t)) return t.includes(tipo);
          if (typeof t === "string") return t === tipo;
          return false;
        }).length
      : 0;
    return { tipo, count };
  });

  // Internados por setor
  const internadoCounts = SETORES_INTERNACAO.map((setor) => {
    const count = Array.isArray(forms)
      ? forms.filter((f: any) => {
          if (f.form_data?.internado !== "Sim") return false;
          const s = f.form_data?.internado_setores;
          if (Array.isArray(s)) return s.includes(setor);
          if (typeof s === "string") return s === setor;
          return false;
        }).length
      : 0;
    return { setor, count };
  });
  const totalInternados = Array.isArray(forms)
    ? forms.filter((f: any) => f.form_data?.internado === "Sim").length
    : 0;

  // Procedimentos realizados
  const procedimentosCounts = PROCEDIMENTOS_LISTA.map(({ key, label }) => {
    const count = Array.isArray(forms)
      ? forms.filter((f: any) =>
          f.form_data?.procedimentos === "Sim" && f.form_data?.[key] === true
        ).length
      : 0;
    return { label, count };
  });
  const totalProcedimentos = Array.isArray(forms)
    ? forms.filter((f: any) => f.form_data?.procedimentos === "Sim").length
    : 0;

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={{ name: "Usuário" }} />
      
      <main className="container mx-auto py-8 px-4 space-y-8">
        {/* Título e ação */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Painel de Controle</h1>
            <p className="text-muted-foreground mt-1">
              Bem-vindo, {"usuário"}!
            </p>
          </div>
          <Link href="/forms/new">
            <Button size="lg">
              <FileText className="mr-2 h-4 w-4" />
              Criar Novo Formulário
            </Button>
          </Link>
        </div>

        {/* Cards de estatísticas + Atendimentos por tipo */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-start">
          {/* Total de Formulários */}
          <div className="lg:col-span-1">
            <StatsCard
              title="Total de Formulários"
              value={reports?.total || 0}
              description="Fichas criadas"
              icon={<FileText className="h-4 w-4" />}
            />
          </div>

          {/* Atendimentos por tipo */}
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 ml-1">Atendimentos por Tipo</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {tipoAtendimentoCounts.map(({ tipo, count }) => (
                <StatsCard
                  key={tipo}
                  title={tipo}
                  value={count}
                  description="atendimentos"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Outros cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Internações por setor */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xl font-semibold">Internações por Setor</h2>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {totalInternados} internadas no total
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {internadoCounts.map(({ setor, count }) => (
              <StatsCard key={setor} title={setor} value={count} description="internadas" />
            ))}
          </div>
        </div>

        {/* Procedimentos realizados */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xl font-semibold">Procedimentos Realizados</h2>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {totalProcedimentos} fichas com procedimentos
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {procedimentosCounts.map(({ label, count }) => (
              <StatsCard key={label} title={label} value={count} description="realizados" />
            ))}
          </div>
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
