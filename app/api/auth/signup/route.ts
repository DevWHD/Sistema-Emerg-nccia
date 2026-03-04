import { NextResponse } from "next/server";

// Rota desabilitada — sistema interno hospitalar.
// Novos usuários devem ser criados pelo administrador.
export async function POST() {
  return NextResponse.json(
    { error: "Cadastro de usuários desabilitado. Contate o administrador do sistema." },
    { status: 403 }
  );
}

