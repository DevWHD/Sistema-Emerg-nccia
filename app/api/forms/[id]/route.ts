import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const form = await queryOne(
      `SELECT *, COALESCE(notes, 'Ficha #' || id) as title FROM emergency_forms 
       WHERE id = $1 AND user_id = $2`,
      [id, session.user.id]
    );

    if (!form) {
      return NextResponse.json(
        { error: "Formulário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Erro ao buscar formulário" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { form_data } = body;
    const nome = form_data?.nome || null;

    const result = await query(
      `UPDATE emergency_forms 
       SET notes = $1, form_data = $2, updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING *, COALESCE(notes, 'Ficha #' || id) as title`,
      [
        nome,
        JSON.stringify(form_data || {}),
        id,
        session.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Formulário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar formulário" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const result = await query(
      `DELETE FROM emergency_forms 
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, session.user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Formulário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Formulário deletado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json(
      { error: "Erro ao deletar formulário" },
      { status: 500 }
    );
  }
}
