async function handler({ date, title, description, time }) {
  if (!date || !title) {
    return { error: "日付とタイトルは必須です" };
  }

  try {
    const result = await sql`
      INSERT INTO schedules (date, title, description, time)
      VALUES (${date}, ${title}, ${description}, ${time})
      RETURNING *
    `;

    return { schedule: result[0] };
  } catch (error) {
    return { error: "予定の追加に失敗しました" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}