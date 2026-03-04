"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { HeartPulse, Lock, User } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Credenciais inválidas. Tente novamente.");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch {
      toast.error("Erro ao realizar acesso. Contate o suporte.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-4">
      <div className="w-full max-w-md">
        {/* Cabeçalho institucional */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20 mb-4">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Chefia de Enfermagem
          </h1>
          <p className="text-blue-200 mt-1 text-sm">
            Sistema de Gestão de Fichas de Emergência
          </p>
        </div>

        {/* Card de login */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Acesso Restrito</h2>
            <p className="text-blue-200 text-sm mt-1">Use suas credenciais institucionais</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-blue-100">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Ex: HMFM"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-white focus:ring-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-blue-100">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-white focus:ring-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-white text-blue-900 hover:bg-blue-50 font-semibold h-11 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Entrar no Sistema"}
            </Button>
          </form>
        </div>

        <p className="text-center text-blue-300/60 text-xs mt-6">
          Acesso exclusivo para funcionários autorizados.
        </p>
      </div>
    </div>
  );
}
