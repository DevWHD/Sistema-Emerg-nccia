import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { queryOne } from "./db";
import { authConfig } from "./auth.config";

// Estender tipos de sessão do NextAuth
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Busca o usuário no banco de dados
          const user = await queryOne<{
            id: string;
            email: string;
            full_name: string;
            password_hash: string;
            role: string;
          }>(
            "SELECT id, email, full_name, password_hash, role FROM users WHERE email = $1",
            [credentials.email as string]
          );

          if (!user) {
            return null;
          }

          // Valida a senha
          const isPasswordValid = await bcryptjs.compare(
            credentials.password as string,
            user.password_hash
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
});
