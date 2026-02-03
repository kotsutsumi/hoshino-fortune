import {
  TrendingUp,
  ShoppingCart,
  Users,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const kpiData = [
  {
    title: "今月の売上",
    value: "¥123,456",
    change: "+12.5%",
    icon: TrendingUp,
    positive: true,
  },
  {
    title: "今月の購入数",
    value: "256件",
    change: "+8.3%",
    icon: ShoppingCart,
    positive: true,
  },
  {
    title: "アクティブユーザー",
    value: "1,234人",
    change: "+15.2%",
    icon: Users,
    positive: true,
  },
  {
    title: "新規登録数",
    value: "89人",
    change: "+22.1%",
    icon: UserPlus,
    positive: true,
  },
];

const rankingData = [
  { rank: 1, title: "恋愛運アップの秘訣", count: 89, revenue: "¥44,500" },
  { rank: 2, title: "仕事運上昇のアドバイス", count: 76, revenue: "¥60,800" },
  { rank: 3, title: "金運アップの方法", count: 65, revenue: "¥39,000" },
  { rank: 4, title: "今週の運勢", count: 54, revenue: "¥16,200" },
  { rank: 5, title: "総合運勢鑑定", count: 48, revenue: "¥57,600" },
];

const recentPurchases = [
  { date: "2026/01/30 14:23", title: "恋愛運アップの秘訣", user: "user123@example.com", amount: "¥500" },
  { date: "2026/01/30 13:45", title: "仕事運上昇のアドバイス", user: "yamada@example.com", amount: "¥800" },
  { date: "2026/01/30 12:30", title: "金運アップの方法", user: "tanaka@example.com", amount: "¥600" },
  { date: "2026/01/30 11:15", title: "今週の運勢", user: "sato@example.com", amount: "¥300" },
  { date: "2026/01/30 10:00", title: "総合運勢鑑定", user: "suzuki@example.com", amount: "¥1,200" },
];

const chartData = [
  { date: "1/24", value: 12000 },
  { date: "1/25", value: 15000 },
  { date: "1/26", value: 11000 },
  { date: "1/27", value: 17500 },
  { date: "1/28", value: 16000 },
  { date: "1/29", value: 21000 },
  { date: "1/30", value: 18500 },
];

export default function AdminDashboard() {
  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ダッシュボード</h1>
        <p className="text-muted-foreground">売上と利用状況の概要</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="py-4">
              <CardContent className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    kpi.positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpi.change}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>売上推移</CardTitle>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground">
              過去7日間
            </button>
            <button className="px-3 py-1.5 text-sm rounded-lg bg-white border text-foreground hover:bg-muted">
              過去30日間
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-1">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between h-full text-xs text-muted-foreground pr-2">
              <span>22000</span>
              <span>16500</span>
              <span>11000</span>
              <span>5500</span>
              <span>0</span>
            </div>
            {/* Chart area */}
            <div className="flex-1 h-full flex items-end">
              <svg className="w-full h-full" viewBox="0 0 700 250" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="0" x2="700" y2="0" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="62.5" x2="700" y2="62.5" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="125" x2="700" y2="125" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="187.5" x2="700" y2="187.5" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="250" x2="700" y2="250" stroke="#e5e7eb" strokeWidth="1" />

                {/* Line chart */}
                <polyline
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartData
                    .map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 680 + 10;
                      const y = 250 - (d.value / 22000) * 250;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />

                {/* Data points */}
                {chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 680 + 10;
                  const y = 250 - (d.value / 22000) * 250;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="6"
                      fill="#7C3AED"
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-muted-foreground pl-10">
            {chartData.map((d) => (
              <span key={d.date}>{d.date}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>人気占いランキング</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rankingData.map((item) => (
              <div key={item.rank} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    item.rank === 1
                      ? "bg-primary"
                      : item.rank === 2
                      ? "bg-primary/80"
                      : item.rank === 3
                      ? "bg-primary/60"
                      : "bg-primary/40"
                  }`}
                >
                  {item.rank}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.count}件 | {item.revenue}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Purchases */}
        <Card>
          <CardHeader>
            <CardTitle>最近の購入履歴</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPurchases.map((purchase, i) => (
              <div
                key={i}
                className="flex items-start justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-xs text-muted-foreground">{purchase.date}</p>
                  <p className="font-medium text-sm">{purchase.title}</p>
                  <p className="text-xs text-muted-foreground">{purchase.user}</p>
                </div>
                <span className="text-sm font-bold text-primary">
                  {purchase.amount}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
