import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query, queryMany } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const forms = await queryMany(
      `SELECT id, COALESCE(notes, 'Ficha #' || id) as title, blood_type, status, created_at, updated_at, form_data
       FROM emergency_forms 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [session.user.id]
    );

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Erro ao buscar formulários" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { form_data } = body;
    const nome = form_data?.nome || null;

    const result = await query(
      `INSERT INTO emergency_forms 
       (user_id, notes, status, form_data, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *, COALESCE(notes, 'Ficha #' || id) as title`,
      [
        session.user.id,
        nome,
        "active",
        JSON.stringify(form_data || {}),
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "Erro ao criar formulário" },
      { status: 500 }
    );
  }
}
