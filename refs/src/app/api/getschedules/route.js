async function handler({ year, month }) {
  if (!year || !month) {
    return { error: "年と月は必須です" };
  }

  const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
  const endDate = `${year}-${month.toString().padStart(2, "0")}-31`;

  try {
    const schedules = await sql`
      SELECT * FROM schedules 
      WHERE date >= ${startDate} 
      AND date <= ${endDate}
      ORDER BY date ASC, time ASC
    `;

    return { schedules };
  } catch (error) {
    return { error: "予定の取得に失敗しました" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}