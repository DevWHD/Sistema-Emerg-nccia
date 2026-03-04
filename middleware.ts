import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const protectedRoutes = [
  "/dashboard",
  "/forms",
  "/reports",
  "/settings",
  "/api/forms",
  "/api/reports",
];

const authRoutes = ["/auth/signin"];

// /auth/signup é bloqueado — sistema interno, sem auto-cadastro

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  // Se o usuário está tentando acessar uma rota protegida sem autenticação
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Se o usuário está logado e tenta acessar rotas de auth
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png).*)",
  ],
};
