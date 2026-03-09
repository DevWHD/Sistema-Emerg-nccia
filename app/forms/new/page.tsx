"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { FormEditor } from "@/components/forms/form-editor";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewFormPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={{ name: "Usuário" }} />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Nova Ficha de Emergência</h1>
              <p className="text-sm text-muted-foreground">Preencha os dados do atendimento</p>
            </div>
          </div>

          <FormEditor mode="create" />
        </div>
      </main>
    </div>
  );
}