import { NextRequest, NextResponse } from "next/server";
import { queryMany } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Sem autenticação necessária
    const userId = "default-user"; // Usar um usuário padrão

    const searchParams = request.nextUrl.searchParams;
    const reportType = searchParams.get("type") || "summary";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = `
      SELECT 
        ef.blood_type, 
        COUNT(*) as count 
      FROM emergency_forms ef 
      WHERE ef.user_id = $1
    `;
    const params: any[] = [userId];

    if (reportType === "blood-types") {
      query += " AND ef.blood_type IS NOT NULL GROUP BY ef.blood_type";
      const bloodTypes = await queryMany(query, params);
      return NextResponse.json({ bloodTypes });
    }

    if (reportType === "allergies") {
      query = `
        SELECT 
          ef.allergies, 
          COUNT(*) as count 
        FROM emergency_forms ef 
        WHERE ef.user_id = $1 
        AND ef.allergies IS NOT NULL
        GROUP BY ef.allergies
      `;
      const allergies = await queryMany(query, params);
      return NextResponse.json({ allergies });
    }

    if (reportType === "timeline") {
      query = `
        SELECT 
          DATE(ef.created_at) as date, 
          COUNT(*) as count 
        FROM emergency_forms ef 
        WHERE ef.user_id = $1
      `;

      if (startDate && endDate) {
        query += ` AND ef.created_at BETWEEN $2 AND $3`;
        params.push(startDate, endDate);
      }

      query += " GROUP BY DATE(ef.created_at) ORDER BY date DESC";
      const timeline = await queryMany(query, params);
      return NextResponse.json({ timeline });
    }

    // Relatório de resumo padrão
    const totalForms = await queryMany(
      `SELECT COUNT(*) as count FROM emergency_forms WHERE user_id = $1`,
      params
    );

    const bloodTypeDistribution = await queryMany(
      `SELECT blood_type, COUNT(*) as count 
       FROM emergency_forms 
       WHERE user_id = $1 AND blood_type IS NOT NULL
       GROUP BY blood_type`,
      params
    );

    const recentForms = await queryMany(
      `SELECT id, COALESCE(notes, 'Ficha #' || id) as title, blood_type, status, created_at 
       FROM emergency_forms 
       WHERE user_id = $1
       ORDER BY created_at DESC 
       LIMIT 5`,
      params
    );

    // Distribuição por tipo de atendimento (suporta array e string no form_data)
    const TIPOS_ATENDIMENTO = ["R.N.", "PUÉRPERA", "GINECOLOGIA", "OBSTETRICIA", "CM", "VVS"];
    const tipoAtendimentoDistribution = await queryMany(
      `SELECT tipo, COUNT(*) as count
       FROM emergency_forms,
         jsonb_array_elements_text(
           CASE
             WHEN jsonb_typeof(form_data->'tipo_atendimento') = 'array'
               THEN form_data->'tipo_atendimento'
             WHEN form_data->>'tipo_atendimento' IS NOT NULL
               THEN jsonb_build_array(form_data->>'tipo_atendimento')
             ELSE '[]'::jsonb
           END
         ) AS tipo
       WHERE user_id = $1
         AND form_data->>'tipo_atendimento' IS NOT NULL
         AND form_data->>'tipo_atendimento' != ''
         AND form_data->>'tipo_atendimento' != '[]'
       GROUP BY tipo`,
      params
    );

    // Garante que todos os tipos aparecem, mesmo com count 0
    const tipoMap = new Map(tipoAtendimentoDistribution.map((r: any) => [r.tipo, Number(r.count)]));
    const tipoAtendimentoCounts = TIPOS_ATENDIMENTO.map((tipo) => ({
      tipo,
      count: tipoMap.get(tipo) || 0,
    }));

    return NextResponse.json({
      total: totalForms[0]?.count || 0,
      bloodTypeDistribution,
      recentForms,
      tipoAtendimentoCounts,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Erro ao buscar relatórios" },
      { status: 500 }
    );
  }
}
