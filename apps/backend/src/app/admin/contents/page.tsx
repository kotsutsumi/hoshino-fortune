import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

const contents = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=100&h=100&fit=crop",
    title: "恋愛運アップの秘訣",
    teller: "星野美咲",
    category: "恋愛",
    categoryColor: "bg-pink-100 text-pink-700",
    price: "¥500",
    isPublic: true,
    createdAt: "2026/01/15",
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=100&h=100&fit=crop",
    title: "仕事運上昇のアドバイス",
    teller: "月宮葵",
    category: "仕事",
    categoryColor: "bg-blue-100 text-blue-700",
    price: "¥800",
    isPublic: true,
    createdAt: "2026/01/20",
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop",
    title: "金運アップの方法",
    teller: "天野蓮",
    category: "金運",
    categoryColor: "bg-yellow-100 text-yellow-700",
    price: "¥600",
    isPublic: false,
    createdAt: "2026/01/25",
  },
];

export default function ContentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">コンテンツ管理</h1>
          <p className="text-muted-foreground">占いコンテンツの作成・編集・削除</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          新規作成
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-4 border-b">
            <input
              type="text"
              placeholder="タイトルで検索..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option>全てのカテゴリ</option>
              <option>恋愛</option>
              <option>仕事</option>
              <option>金運</option>
              <option>健康</option>
              <option>総合</option>
            </select>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">サムネイル</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">タイトル</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">占い師</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">カテゴリ</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">価格</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">公開状態</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">作成日</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">アクション</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((content) => (
                <tr key={content.id} className="border-b hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{content.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{content.teller}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${content.categoryColor}`}>
                      {content.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-primary font-medium">{content.price}</td>
                  <td className="px-4 py-3">
                    <button
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        content.isPublic ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          content.isPublic ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{content.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Pencil className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
