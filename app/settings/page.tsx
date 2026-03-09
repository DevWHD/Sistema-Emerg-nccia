"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { LogOut } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={{ name: "Usuário" }} />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground mt-2">
              Gereneie suas preferências e conta
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>
                Detalhes sobre sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nome
                </label>
                <p className="text-lg mt-1">Usuário</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-lg mt-1">usuario@emergencia.com</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Opções de segurança e privacidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                disabled
              >
                Alterar Senha
              </Button>
              <p className="text-sm text-muted-foreground">
                Funcionalidade indisponível no momento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sair da Conta</CardTitle>
              <CardDescription>
                Encerre sua sessão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                disabled
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair da Conta
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Sessão sem autenticação - não disponível
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
