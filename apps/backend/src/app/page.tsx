import Link from "next/link";
import { Star, Sparkles, Heart, Briefcase, Coins, Users } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "恋愛運",
    description: "運命の出会いや恋の行方を占います",
  },
  {
    icon: Briefcase,
    title: "仕事運",
    description: "キャリアアップや転職のタイミングを見極めます",
  },
  {
    icon: Coins,
    title: "金運",
    description: "財運アップの秘訣をお伝えします",
  },
];

const fortunes = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop",
    title: "恋愛運アップの秘訣",
    teller: "星野美咲",
    category: "恋愛",
    categoryColor: "bg-pink-500",
    price: 500,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=300&fit=crop",
    title: "仕事運上昇のアドバイス",
    teller: "月宮葵",
    category: "仕事",
    categoryColor: "bg-blue-500",
    price: 800,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
    title: "金運アップの方法",
    teller: "天野蓮",
    category: "金運",
    categoryColor: "bg-yellow-500",
    price: 600,
  },
];

const testimonials = [
  {
    name: "田中さん",
    age: "30代女性",
    text: "星野先生の鑑定で人生が変わりました！恋愛運が上がって、素敵な出会いがありました。",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    name: "山田さん",
    age: "40代男性",
    text: "仕事で悩んでいた時に的確なアドバイスをいただき、転職に成功しました。",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    name: "佐藤さん",
    age: "20代女性",
    text: "金運占いのおかげで投資のタイミングがわかり、資産が増えました！",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-violet-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
              Hoshino Fortune
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-violet-600 transition-colors">
              特徴
            </Link>
            <Link href="#fortunes" className="text-gray-600 hover:text-violet-600 transition-colors">
              占いメニュー
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-violet-600 transition-colors">
              お客様の声
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-violet-600 transition-colors">
              料金
            </Link>
          </nav>
          <Link
            href="/login"
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            ログイン
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-purple-800" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-48 h-48 bg-pink-300 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-violet-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 text-center text-white">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-12 h-12 text-yellow-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            あなたの運命を
            <br />
            <span className="text-yellow-300">星が照らす</span>
          </h1>
          <p className="text-lg md:text-xl text-violet-100 mb-8 max-w-2xl mx-auto">
            経験豊富な占い師があなたの未来を導きます。
            <br />
            恋愛、仕事、金運など、あらゆる悩みに寄り添います。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#fortunes"
              className="px-8 py-4 bg-white text-violet-700 rounded-full font-bold text-lg hover:bg-violet-50 transition-colors"
            >
              占いを見る
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hoshino Fortuneの特徴
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              厳選された占い師による本格的な鑑定をお手軽に
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fortunes Section */}
      <section id="fortunes" className="py-20 bg-gradient-to-b from-violet-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              人気の占いメニュー
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              あなたにぴったりの占いを見つけてください
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {fortunes.map((fortune) => (
              <div
                key={fortune.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={fortune.image}
                    alt={fortune.title}
                    className="w-full h-48 object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 ${fortune.categoryColor} text-white text-xs font-medium rounded-full`}
                  >
                    {fortune.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{fortune.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">占い師: {fortune.teller}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-violet-600">
                      ¥{fortune.price.toLocaleString()}
                    </span>
                    <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                      詳細を見る
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/fortunes"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-violet-600 text-violet-600 rounded-full font-medium hover:bg-violet-50 transition-colors"
            >
              すべての占いを見る
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              お客様の声
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hoshino Fortuneをご利用いただいたお客様からの声
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.age}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-violet-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              料金プラン
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              シンプルで分かりやすい料金体系
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">無料プラン</h3>
              <p className="text-gray-500 mb-6">お試しに最適</p>
              <p className="text-4xl font-bold text-gray-900 mb-6">
                ¥0<span className="text-lg font-normal text-gray-500">/月</span>
              </p>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-violet-600">✓</span> 毎日の運勢チェック
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-600">✓</span> 基本的な占い閲覧
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-400">×</span> 個別鑑定
                </li>
              </ul>
              <button className="w-full py-3 border-2 border-violet-600 text-violet-600 rounded-full font-medium hover:bg-violet-50 transition-colors">
                無料で始める
              </button>
            </div>

            {/* Standard Plan */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-white relative hover:shadow-xl transition-shadow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                人気
              </div>
              <h3 className="text-xl font-bold mb-2">スタンダード</h3>
              <p className="text-violet-200 mb-6">個人利用におすすめ</p>
              <p className="text-4xl font-bold mb-6">
                ¥980<span className="text-lg font-normal text-violet-200">/月</span>
              </p>
              <ul className="space-y-3 mb-8 text-violet-100">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span> 無料プランの全機能
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span> 月3回の個別鑑定
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-300">✓</span> 占い師への質問
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-violet-700 rounded-full font-bold hover:bg-violet-50 transition-colors">
                今すぐ始める
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">プレミアム</h3>
              <p className="text-gray-500 mb-6">本格的に使いたい方</p>
              <p className="text-4xl font-bold text-gray-900 mb-6">
                ¥2,980<span className="text-lg font-normal text-gray-500">/月</span>
              </p>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-violet-600">✓</span> スタンダードの全機能
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-600">✓</span> 無制限の個別鑑定
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-600">✓</span> 優先サポート
                </li>
              </ul>
              <button className="w-full py-3 border-2 border-violet-600 text-violet-600 rounded-full font-medium hover:bg-violet-50 transition-colors">
                プレミアムを選ぶ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 via-purple-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            今すぐ運命の扉を開きましょう
          </h2>
          <p className="text-violet-100 mb-8 text-lg">
            無料登録で今日の運勢をチェック
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-violet-700 rounded-full font-bold text-lg hover:bg-violet-50 transition-colors"
          >
            無料で始める
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold">Hoshino Fortune</span>
              </div>
              <p className="text-sm">
                あなたの運命を星が照らす、
                <br />
                本格占いサービス
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">サービス</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">占いメニュー</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">占い師一覧</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">料金プラン</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">サポート</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">よくある質問</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">お問い合わせ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">利用ガイド</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">法的情報</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">利用規約</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">特定商取引法</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2026 Hoshino Fortune. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
