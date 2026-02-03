import { Card, CardContent } from "@/components/ui/card";
import { Eye, Ban, CheckCircle } from "lucide-react";

const users = [
  {
    id: "#0001",
    name: "山田 花子",
    email: "yamada@example.com",
    registeredAt: "2026/01/15",
    purchaseCount: 5,
    totalAmount: "¥3,200",
    status: "active",
  },
  {
    id: "#0002",
    name: "田中 太郎",
    email: "tanaka@example.com",
    registeredAt: "2026/01/10",
    purchaseCount: 12,
    totalAmount: "¥8,900",
    status: "active",
  },
  {
    id: "#0003",
    name: "佐藤 美咲",
    email: "sato@example.com",
    registeredAt: "2026/01/20",
    purchaseCount: 3,
    totalAmount: "¥1,500",
    status: "active",
  },
  {
    id: "#0004",
    name: "鈴木 健一",
    email: "suzuki@example.com",
    registeredAt: "2025/12/28",
    purchaseCount: 8,
    totalAmount: "¥5,600",
    status: "suspended",
  },
  {
    id: "#0005",
    name: "高橋 愛",
    email: "takahashi@example.com",
    registeredAt: "2026/01/25",
    purchaseCount: 1,
    totalAmount: "¥500",
    status: "active",
  },
];

const stats = [
  { label: "総ユーザー数", value: "5人", color: "text-primary" },
  { label: "アクティブユーザー", value: "4人", color: "text-green-600" },
  { label: "停止中", value: "1人", color: "text-red-500" },
  { label: "今月の新規登録", value: "4人", color: "text-primary" },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ユーザー管理</h1>
        <p className="text-muted-foreground">ユーザー情報の確認と管理</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="py-4">
            <CardContent>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-4 border-b">
            <input
              type="text"
              placeholder="名前またはメールアドレスで検索..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                全て
              </button>
              <button className="px-4 py-2 bg-white border rounded-lg hover:bg-muted">
                アクティブ
              </button>
              <button className="px-4 py-2 bg-white border rounded-lg hover:bg-muted">
                停止中
              </button>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">名前</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">メールアドレス</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">登録日</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">購入回数</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">累計購入金額</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ステータス</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">アクション</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground">{user.id}</td>
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.registeredAt}</td>
                  <td className="px-4 py-3">{user.purchaseCount}回</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{user.totalAmount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status === "active" ? "アクティブ" : "停止中"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      {user.status === "active" ? (
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Ban className="w-4 h-4 text-red-500" />
                        </button>
                      ) : (
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </button>
                      )}
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
