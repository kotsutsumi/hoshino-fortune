import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

const fortuneTellers = [
  {
    id: 1,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    name: "星野美咲",
    specialties: ["恋愛", "人間関係"],
    contentCount: 12,
    isActive: true,
    registeredAt: "2025/12/01",
  },
  {
    id: 2,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    name: "月宮葵",
    specialties: ["仕事", "金運"],
    contentCount: 8,
    isActive: true,
    registeredAt: "2025/12/15",
  },
  {
    id: 3,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    name: "天野蓮",
    specialties: ["総合", "健康"],
    contentCount: 15,
    isActive: false,
    registeredAt: "2025/11/20",
  },
];

const stats = [
  { label: "登録占い師数", value: "3名", color: "text-primary" },
  { label: "アクティブ占い師", value: "2名", color: "text-green-600" },
  { label: "総コンテンツ数", value: "35件", color: "text-primary" },
];

export default function FortuneTellersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">占い師管理</h1>
          <p className="text-muted-foreground">占い師プロフィールの登録・編集・削除</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          新規登録
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">アバター</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">名前</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">得意分野</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">コンテンツ数</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">アクティブ</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">登録日</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">アクション</th>
              </tr>
            </thead>
            <tbody>
              {fortuneTellers.map((teller) => (
                <tr key={teller.id} className="border-b hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <img
                      src={teller.avatar}
                      alt={teller.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{teller.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {teller.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">{teller.contentCount}件</td>
                  <td className="px-4 py-3">
                    <button
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        teller.isActive ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          teller.isActive ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{teller.registeredAt}</td>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="py-4">
            <CardContent>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
