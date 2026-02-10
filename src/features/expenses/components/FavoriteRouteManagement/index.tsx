import type { Dispatch, SetStateAction } from "react";
import type { FavoriteRouteResponseItem } from "@/features/favoriteRoutes/apiClient";
import type { FavoriteRouteInput } from "@/types/favoriteRoutes";
import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/Input";

interface FavoriteRouteManagementProps {
  /**
   * お気に入り経路一覧
   */
  favorites: FavoriteRouteResponseItem[];
  /**
   * 読み込み中フラグ
   */
  isFavoritesLoading: boolean;
  /**
   * お気に入り経路フォームの状態
   */
  favoriteForm: FavoriteRouteInput;
  /**
   * 編集中のお気に入り経路ID（新規作成時はnull）
   */
  editingFavoriteId: string | null;
  /**
   * 保存中フラグ
   */
  isFavoriteSaving: boolean;
  /**
   * 保存エラーメッセージ
   */
  favoriteSaveError: string | null;
  /**
   * お気に入り経路フォームの状態を更新する関数
   */
  setFavoriteForm: Dispatch<SetStateAction<FavoriteRouteInput>>;
  /**
   * お気に入り経路を保存する関数（新規作成・編集両対応）
   */
  handleSaveFavorite: () => Promise<void>;
  /**
   * お気に入り経路を編集モードにする関数
   */
  handleEditFavorite: (id: string) => void;
  /**
   * お気に入り経路を削除する関数
   */
  handleDeleteFavorite: (id: string) => Promise<void>;
  /**
   * 編集キャンセル関数
   */
  handleCancelEdit: () => void;
}

export const FavoriteRouteManagement = ({
  favorites,
  isFavoritesLoading,
  favoriteForm,
  editingFavoriteId,
  isFavoriteSaving,
  favoriteSaveError,
  setFavoriteForm,
  handleSaveFavorite,
  handleEditFavorite,
  handleDeleteFavorite,
  handleCancelEdit,
}: FavoriteRouteManagementProps) => {
  return (
    <>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl" id="favorite">
        お気に入り経路
      </h2>

      {/* 登録/編集フォーム */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-800">
          {editingFavoriteId ? "お気に入り経路を編集" : "お気に入り経路を登録"}
        </h3>
        <div className="space-y-3">
          <div>
            <label htmlFor="favName" className="mb-1 block text-xs font-medium text-gray-600">
              名前（任意）
            </label>
            <Input
              id="favName"
              type="text"
              value={favoriteForm.name}
              onChange={(e) => setFavoriteForm({ ...favoriteForm, name: e.target.value })}
              placeholder="例: よく使う経路（東京駅↔︎渋谷駅）"
            />
          </div>
          <div>
            <label htmlFor="favDeparture" className="mb-1 block text-xs font-medium text-gray-600">
              出発
            </label>
            <Input
              id="favDeparture"
              type="text"
              value={favoriteForm.departure}
              onChange={(e) => setFavoriteForm({ ...favoriteForm, departure: e.target.value })}
              placeholder="例: 東京駅"
              required
            />
          </div>
          <div>
            <label htmlFor="favArrival" className="mb-1 block text-xs font-medium text-gray-600">
              到着
            </label>
            <Input
              id="favArrival"
              type="text"
              value={favoriteForm.arrival}
              onChange={(e) => setFavoriteForm({ ...favoriteForm, arrival: e.target.value })}
              placeholder="例: 渋谷駅"
              required
            />
          </div>
          <div>
            <label htmlFor="favAmount" className="mb-1 block text-xs font-medium text-gray-600">
              運賃（円）
            </label>
            <Input
              id="favAmount"
              type="number"
              value={favoriteForm.amount}
              onChange={(e) => setFavoriteForm({ ...favoriteForm, amount: Number(e.target.value) })}
              min="1"
              step="1"
              required
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="favTransport"
                value="TRAIN"
                checked={favoriteForm.transport === "TRAIN"}
                onChange={(e) =>
                  setFavoriteForm({
                    ...favoriteForm,
                    transport: e.target.value as "TRAIN" | "BUS",
                  })
                }
              />
              電車
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="favTransport"
                value="BUS"
                checked={favoriteForm.transport === "BUS"}
                onChange={(e) =>
                  setFavoriteForm({
                    ...favoriteForm,
                    transport: e.target.value as "TRAIN" | "BUS",
                  })
                }
              />
              バス
            </label>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="favTripType"
                value="ONEWAY"
                checked={favoriteForm.tripType === "ONEWAY"}
                onChange={(e) =>
                  setFavoriteForm({
                    ...favoriteForm,
                    tripType: e.target.value as "ONEWAY" | "ROUNDTRIP",
                  })
                }
              />
              片道
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="favTripType"
                value="ROUNDTRIP"
                checked={favoriteForm.tripType === "ROUNDTRIP"}
                onChange={(e) =>
                  setFavoriteForm({
                    ...favoriteForm,
                    tripType: e.target.value as "ONEWAY" | "ROUNDTRIP",
                  })
                }
              />
              往復
            </label>
          </div>
          {favoriteSaveError && (
            <div className="rounded-lg bg-red-50 p-2 text-xs text-red-800">{favoriteSaveError}</div>
          )}
          <div className="flex gap-2">
            {editingFavoriteId && (
              <Button
                variant="secondary"
                size="md"
                onClick={handleCancelEdit}
                className="rounded-md border-gray-200 text-gray-600 shadow-none hover:bg-gray-100 hover:shadow-none"
              >
                キャンセル
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveFavorite}
              disabled={isFavoriteSaving}
              className="rounded-md px-4"
            >
              {isFavoriteSaving ? "保存中..." : editingFavoriteId ? "更新する" : "登録する"}
            </Button>
          </div>
        </div>
      </div>

      {/* お気に入り一覧 */}
      {isFavoritesLoading ? (
        <p className="text-sm text-gray-500">読み込み中...</p>
      ) : favorites.length === 0 ? (
        <p className="text-sm text-gray-600">お気に入り経路がまだ登録されていません。</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((fav) => (
            <li
              key={fav.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {fav.name || `${fav.departure} → ${fav.arrival}`}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {fav.departure} → {fav.arrival}
                  {fav.amount.toLocaleString("ja-JP")}円
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                    {fav.transport === "TRAIN" ? "電車" : "バス"}
                  </span>
                  <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700">
                    {fav.tripType === "ROUNDTRIP" ? "往復" : "片道"}
                  </span>
                </p>
              </div>
              <div className="ml-3 flex shrink-0 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditFavorite(fav.id)}
                  className="rounded-md"
                >
                  編集
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteFavorite(fav.id)}
                  className="rounded-md"
                >
                  削除
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
