import { NextResponse } from "next/server";

async function handler({ type, rarity }) {
  try {
    // ダミーデータを返す（DBが未接続の場合）
    const dummyItems = [
      { id: 1, name: "幸運のお守り", type: "アイテム", rarity: "レア", description: "運気を高めるアイテム" },
      { id: 2, name: "元気のドリンク", type: "消耗品", rarity: "ノーマル", description: "体力を回復する" },
      { id: 3, name: "魔法の杖", type: "武器", rarity: "レジェンド", description: "強力な魔力を秘めている" }
    ];

    let items = dummyItems;

    if (type) {
      items = items.filter(item => item.type === type);
    }

    if (rarity) {
      items = items.filter(item => item.rarity === rarity);
    }

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "アイテムの取得に失敗しました" }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const rarity = searchParams.get("rarity");
  
  return handler({ type, rarity });
}

export async function POST(request) {
  const body = await request.json();
  return handler(body);
}
