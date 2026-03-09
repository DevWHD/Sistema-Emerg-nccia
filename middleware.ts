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
  // Sem autenticação necessária - acesso livre
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png).*)",
  ],
};
