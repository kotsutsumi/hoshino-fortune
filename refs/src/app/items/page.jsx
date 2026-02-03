"use client";
import React, { useState, useCallback, useEffect } from "react";
import Footer from "../../components/Footer";

function MainComponent() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState({ type: "", rarity: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filter),
      });

      if (!response.ok) {
        throw new Error("アイテムの取得に失敗しました");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setItems(data.items);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const itemTypes = [
    { value: "weapon", label: "武器", icon: "fa-sword" },
    { value: "armor", label: "防具", icon: "fa-shield" },
    { value: "potion", label: "ポーション", icon: "fa-flask" },
    { value: "scroll", label: "巻物", icon: "fa-scroll" },
  ];

  const rarityLevels = [
    { value: "1", label: "ノーマル", color: "gray" },
    { value: "2", label: "レア", color: "blue" },
    { value: "3", label: "エピック", color: "purple" },
    { value: "4", label: "レジェンド", color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F8] text-gray-800 font-crimson-text">
      <div className="container mx-auto px-4 py-6 pb-24">
        {/* メインコンテンツエリア */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
          <h2 className="text-2xl font-bold mb-4 text-[#FF9494]">
            アイテム一覧
          </h2>

          {/* フィルターボタン */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() =>
                setActivePanel(activePanel === "type" ? null : "type")
              }
              className={`flex-1 py-3 px-4 rounded-full ${
                activePanel === "type"
                  ? "bg-[#FF9494] text-white"
                  : "bg-[#FFE4E4] text-[#FF9494]"
              }`}
            >
              タイプ
            </button>
            <button
              onClick={() =>
                setActivePanel(activePanel === "rarity" ? null : "rarity")
              }
              className={`flex-1 py-3 px-4 rounded-full ${
                activePanel === "rarity"
                  ? "bg-[#FF9494] text-white"
                  : "bg-[#FFE4E4] text-[#FF9494]"
              }`}
            >
              レアリティ
            </button>
          </div>

          {/* アイテムグリッド */}
          {error ? (
            <div className="text-red-500 bg-red-500/10 rounded-lg p-4">
              {error}
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-[#FF9494] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-[#FFE4E4] rounded-2xl p-4 cursor-pointer transform transition-all duration-200 hover:scale-105"
                >
                  <div className="aspect-square rounded-xl bg-white mb-3 flex items-center justify-center">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <i
                        className={`fas ${
                          itemTypes.find((t) => t.value === item.type)?.icon ||
                          "fa-box"
                        } text-4xl text-[#FF9494]`}
                      ></i>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-[#FF9494] mb-1">
                      {item.name}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {
                        rarityLevels.find(
                          (r) => r.value === item.rarity.toString()
                        )?.label
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* フィルターパネル */}
      {activePanel && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setActivePanel(null)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#FF9494]">
                {activePanel === "type" ? "アイテムタイプ" : "レアリティ"}
              </h3>
              <button
                onClick={() => setActivePanel(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FFE4E4] text-[#FF9494]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {activePanel === "type" ? (
                <>
                  <button
                    onClick={() => {
                      setFilter({ ...filter, type: "" });
                      setActivePanel(null);
                    }}
                    className={`w-full py-3 px-4 rounded-full ${
                      !filter.type
                        ? "bg-[#FF9494] text-white"
                        : "bg-[#FFE4E4] text-[#FF9494]"
                    }`}
                  >
                    すべて
                  </button>
                  {itemTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setFilter({ ...filter, type: type.value });
                        setActivePanel(null);
                      }}
                      className={`w-full py-3 px-4 rounded-full ${
                        filter.type === type.value
                          ? "bg-[#FF9494] text-white"
                          : "bg-[#FFE4E4] text-[#FF9494]"
                      }`}
                    >
                      <i className={`fas ${type.icon} mr-2`}></i>
                      {type.label}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setFilter({ ...filter, rarity: "" });
                      setActivePanel(null);
                    }}
                    className={`w-full py-3 px-4 rounded-full ${
                      !filter.rarity
                        ? "bg-[#FF9494] text-white"
                        : "bg-[#FFE4E4] text-[#FF9494]"
                    }`}
                  >
                    すべて
                  </button>
                  {rarityLevels.map((rarity) => (
                    <button
                      key={rarity.value}
                      onClick={() => {
                        setFilter({ ...filter, rarity: rarity.value });
                        setActivePanel(null);
                      }}
                      className={`w-full py-3 px-4 rounded-full ${
                        filter.rarity === rarity.value
                          ? "bg-[#FF9494] text-white"
                          : "bg-[#FFE4E4] text-[#FF9494]"
                      }`}
                    >
                      {rarity.label}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* アイテム詳細モーダル */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-[#FF9494]">
                {selectedItem.name}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FFE4E4] text-[#FF9494]"
              >
                ✕
              </button>
            </div>

            <div className="aspect-square rounded-2xl bg-[#FFE4E4] mb-6 flex items-center justify-center p-8">
              {selectedItem.image_url ? (
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <i
                  className={`fas ${
                    itemTypes.find((t) => t.value === selectedItem.type)
                      ?.icon || "fa-box"
                  } text-6xl text-[#FF9494]`}
                ></i>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">タイプ:</span>
                <span className="font-medium text-[#FF9494]">
                  {itemTypes.find((t) => t.value === selectedItem.type)
                    ?.label || "不明"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">レアリティ:</span>
                <span className="font-medium text-[#FF9494]">
                  {
                    rarityLevels.find(
                      (r) => r.value === selectedItem.rarity.toString()
                    )?.label
                  }
                </span>
              </div>

              {selectedItem.description && (
                <div>
                  <span className="text-gray-600 block mb-2">説明:</span>
                  <p className="bg-[#FFE4E4] rounded-xl p-3 text-sm leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer activePage="game" />
    </div>
  );
}

export default MainComponent;