async function handler({ name, description, type, rarity, image_url }) {
  if (!name || !type) {
    return { error: "名前とタイプは必須です" };
  }

  try {
    const result = await sql`
      INSERT INTO items (name, description, type, rarity, image_url)
      VALUES (${name}, ${description}, ${type}, ${rarity || 1}, ${image_url})
      RETURNING *
    `;

    return { item: result[0] };
  } catch (error) {
    return { error: "アイテムの追加に失敗しました" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}