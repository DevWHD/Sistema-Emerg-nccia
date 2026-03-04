"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardHeader } from "@/components/dashboard/header";
import { FormEditor, FormData } from "@/components/forms/form-editor";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function FormDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [defaultValues, setDefaultValues] = useState<Partial<FormData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    if (!id) return;
    fetch(`/api/forms/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setDefaultValues(data.form_data || {});
      })
      .catch(() => {
        toast.error("Erro ao carregar ficha");
        router.push("/dashboard");
      })
      .finally(() => setIsLoading(false));
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta ficha?")) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/forms/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      toast.success("Ficha excluída com sucesso!");
      router.push("/dashboard");
    } catch {
      toast.error("Erro ao excluir ficha");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader user={session?.user} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Carregando ficha...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session?.user} />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Editar Ficha</h1>
                <p className="text-sm text-muted-foreground">Atualize os dados do atendimento</p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Excluindo..." : "Excluir Ficha"}
            </Button>
          </div>

          <FormEditor mode="edit" formId={id} defaultValues={defaultValues ?? {}} />
        </div>
      </main>
    </div>
  );
}

  id: string;
  title: string;
  blood_type: string;
  allergies: string;
  medications: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function FormDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    if (!id) return;

    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${id}`);
        if (!response.ok) {
          throw new Error("Formulário não encontrado");
        }
        const data = await response.json();
        setForm(data);
      } catch (error) {
        toast.error("Erro ao carregar formulário");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar este formulário?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/forms/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar formulário");
      }

      toast.success("Formulário deletado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Erro ao deletar formulário");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader user={session?.user} />
        <div className="flex items-center justify-center min-h-screen">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader user={session?.user} />
        <div className="flex items-center justify-center min-h-screen">
          <p>Formulário não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session?.user} />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{form.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Criado em {new Date(form.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Ficha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tipo Sanguíneo
                </label>
                <p className="text-lg mt-1">{form.blood_type || "-"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Alergias
                </label>
                <p className="text-sm mt-1 whitespace-pre-wrap">
                  {form.allergies || "Nenhuma alergia registrada"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Medicamentos em Uso
                </label>
                <p className="text-sm mt-1 whitespace-pre-wrap">
                  {form.medications || "Nenhum medicamento registrado"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <p className="text-sm mt-1">
                  {form.status === "active" ? "Ativo" : "Inativo"}
                </p>
              </div>

              <div className="pt-4 flex gap-2">
                <Button variant="outline" disabled>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? "Deletando..." : "Deletar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
