"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, FileText, BarChart3 } from "lucide-react";

interface DashboardHeaderProps {
  user?: {
    name?: string;
    email?: string;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">+</span>
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:inline">Fichas de Emergência</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent/10 transition-colors"
            >
              <FileText className="inline h-4 w-4 mr-2" />
              Formulários
            </Link>
            <Link
              href="/reports"
              className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent/10 transition-colors"
            >
              <BarChart3 className="inline h-4 w-4 mr-2" />
              Relatórios
            </Link>
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-accent/10">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
