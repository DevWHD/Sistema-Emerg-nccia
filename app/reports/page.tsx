"use client";

import { useState } from "react";
import useSWR from "swr";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ReportData {
  total: number;
  bloodTypeDistribution: Array<{ blood_type: string; count: number }>;
  recentForms: Array<{ id: string; title: string; created_at: string }>;
}

const COLORS = ["#0ea5e9", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function ReportsPage() {
  const [reportType, setReportType] = useState("summary");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: reports, isLoading } = useSWR<ReportData>(
    `/api/reports?type=${reportType}${
      startDate ? `&startDate=${startDate}` : ""
    }${endDate ? `&endDate=${endDate}` : ""}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const exportCSV = () => {
    if (!reports?.bloodTypeDistribution) {
      toast.error("Nenhum dado para exportar");
      return;
    }

    const csv = [
      ["Tipo Sanguíneo", "Quantidade"],
      ...reports.bloodTypeDistribution.map((item) => [
        item.blood_type,
        item.count,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success("Relatório exportado com sucesso!");
  };

  const exportPDF = () => {
    toast.info("Funcionalidade de PDF será implementada em breve");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={{ name: "Usuário" }} />

      <main className="container mx-auto py-8 px-4 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground mt-2">
            Análise e estatísticas das suas fichas de emergência
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Customize seus relatórios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Relatório</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Resumo</SelectItem>
                    <SelectItem value="blood-types">Tipos Sanguíneos</SelectItem>
                    <SelectItem value="allergies">Alergias</SelectItem>
                    <SelectItem value="timeline">Linha do Tempo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data Inicial</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data Final</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Principais */}
        {reports && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Formulários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reports.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tipos Únicos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reports.bloodTypeDistribution?.length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Formulários Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reports.recentForms?.length || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reports.bloodTypeDistribution && (
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Tipo Sanguíneo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={reports.bloodTypeDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="blood_type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0ea5e9" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {reports.bloodTypeDistribution && (
                <Card>
                  <CardHeader>
                    <CardTitle>Proporção de Tipos Sanguíneos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={reports.bloodTypeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ blood_type, count }) =>
                            `${blood_type}: ${count}`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {reports.bloodTypeDistribution.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Ações de Export */}
            <Card>
              <CardHeader>
                <CardTitle>Exportar Relatórios</CardTitle>
                <CardDescription>
                  Baixe seus dados em diferentes formatos
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button
                  onClick={exportCSV}
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar CSV
                </Button>
                <Button
                  onClick={exportPDF}
                  variant="outline"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <p>Carregando relatórios...</p>
          </div>
        )}
      </main>
    </div>
  );
}
