import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { queryMany } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

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
    const params: any[] = [session.user.id];

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

    return NextResponse.json({
      total: totalForms[0]?.count || 0,
      bloodTypeDistribution,
      recentForms,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Erro ao buscar relatórios" },
      { status: 500 }
    );
  }
}
