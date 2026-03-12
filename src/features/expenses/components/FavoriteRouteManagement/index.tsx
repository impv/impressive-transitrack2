import type { Dispatch, SetStateAction } from "react";
import type { FavoriteRouteResponseItem } from "@/features/expenses/favoriteRoutesApiClient";
import type { FavoriteRouteInput } from "@/types/favoriteRoutes";
import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/Input";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import {
  MdAdd,
  MdArrowRightAlt,
  MdDirectionsBus,
  MdError,
  MdStar,
  MdSyncAlt,
  MdTrain,
} from "react-icons/md";
import { twMerge } from "tailwind-merge";

const TRANSPORT_OPTIONS = [
  { value: "TRAIN" as const, label: "電車", Icon: MdTrain },
  { value: "BUS" as const, label: "バス", Icon: MdDirectionsBus },
];

const TRIP_TYPE_OPTIONS = [
  { value: "ONEWAY" as const, label: "片道", Icon: MdArrowRightAlt },
  { value: "ROUNDTRIP" as const, label: "往復", Icon: MdSyncAlt },
];

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
   * 新規作成モードかどうか
   */
  isCreating: boolean;
  /**
   * 新規作成モードを開始する関数
   */
  handleStartCreate: () => void;
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
  isCreating,
  isFavoriteSaving,
  favoriteSaveError,
  setFavoriteForm,
  handleSaveFavorite,
  handleEditFavorite,
  handleDeleteFavorite,
  handleCancelEdit,
  handleStartCreate,
}: FavoriteRouteManagementProps) => {
  const showForm = isCreating || !!editingFavoriteId;
  return (
    <>
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
          <MdStar className="text-blue-600" size={18} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl" id="favorite">
          お気に入り経路
        </h2>
      </div>

      {/* 新規登録ボタン（フォーム非表示時のみ表示） */}
      {!showForm && (
        <button
          type="button"
          onClick={handleStartCreate}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-100"
        >
          <MdAdd size={18} />
          新規登録
        </button>
      )}

      {/* 編集・新規作成フォーム */}
      {showForm && (
        <div className="mb-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">
            {editingFavoriteId ? "お気に入り経路を編集" : "お気に入り経路を新規登録"}
          </h3>

          {/* 名前 */}
          <div>
            <label
              htmlFor="favName"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
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

          {/* 経路 */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700">経路</p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-stretch gap-3">
                {/* 路線インジケーター */}
                <div className="flex flex-col items-center mt-7">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 ring-2 ring-blue-200 shrink-0" />
                  <div className="flex-1 w-px bg-gradient-to-b from-blue-300 to-blue-500 min-h-10 my-1" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-300 shrink-0" />
                </div>
                {/* 入力フィールド */}
                <div className="flex-1 space-y-3">
                  <div>
                    <label
                      htmlFor="favDeparture"
                      className="mb-1 block text-[10px] font-semibold text-blue-500 uppercase tracking-wide"
                    >
                      出発
                    </label>
                    <Input
                      id="favDeparture"
                      type="text"
                      value={favoriteForm.departure}
                      onChange={(e) =>
                        setFavoriteForm({ ...favoriteForm, departure: e.target.value })
                      }
                      placeholder="例: 東京駅"
                      className="bg-white/80"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="favArrival"
                      className="mb-1 block text-[10px] font-semibold text-blue-700 uppercase tracking-wide"
                    >
                      到着
                    </label>
                    <Input
                      id="favArrival"
                      type="text"
                      value={favoriteForm.arrival}
                      onChange={(e) =>
                        setFavoriteForm({ ...favoriteForm, arrival: e.target.value })
                      }
                      placeholder="例: 渋谷駅"
                      className="bg-white/80"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 運賃 */}
          <div>
            <label htmlFor="favAmount" className="mb-1.5 block text-sm font-medium text-gray-700">
              運賃
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none select-none">
                ¥
              </span>
              <Input
                id="favAmount"
                type="text"
                value={favoriteForm.amount || ""}
                onChange={(e) =>
                  setFavoriteForm({ ...favoriteForm, amount: Number(e.target.value) })
                }
                placeholder="例: 200"
                className="pl-7"
                required
              />
            </div>
          </div>

          {/* 交通手段 & 区間種別 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 交通手段 */}
            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-gray-700">交通手段</legend>
              <div className="grid grid-cols-2 gap-1.5">
                {TRANSPORT_OPTIONS.map(({ value, label, Icon }) => (
                  <label
                    key={value}
                    className={twMerge(
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all cursor-pointer",
                      favoriteForm.transport === value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50",
                    )}
                  >
                    <input
                      type="radio"
                      name="favTransport"
                      value={value}
                      checked={favoriteForm.transport === value}
                      onChange={(e) =>
                        setFavoriteForm({
                          ...favoriteForm,
                          transport: e.target.value as "TRAIN" | "BUS",
                        })
                      }
                      className="sr-only"
                    />
                    <Icon size={20} />
                    <span className="text-xs font-semibold">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* 区間種別 */}
            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-gray-700">区間種別</legend>
              <div className="grid grid-cols-2 gap-1.5">
                {TRIP_TYPE_OPTIONS.map(({ value, label, Icon }) => (
                  <label
                    key={value}
                    className={twMerge(
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all cursor-pointer",
                      favoriteForm.tripType === value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50",
                    )}
                  >
                    <input
                      type="radio"
                      name="favTripType"
                      value={value}
                      checked={favoriteForm.tripType === value}
                      onChange={(e) =>
                        setFavoriteForm({
                          ...favoriteForm,
                          tripType: e.target.value as "ONEWAY" | "ROUNDTRIP",
                        })
                      }
                      className="sr-only"
                    />
                    <Icon size={20} />
                    <span className="text-xs font-semibold">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {/* エラーメッセージ */}
          {favoriteSaveError && (
            <div className="flex gap-2.5 rounded-xl bg-red-50 p-3.5 border border-red-100">
              <MdError className="text-red-400 shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-red-700">{favoriteSaveError}</p>
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleSaveFavorite}
              disabled={isFavoriteSaving}
            >
              {isFavoriteSaving ? "保存中..." : editingFavoriteId ? "更新する" : "登録する"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={handleCancelEdit}
            >
              キャンセル
            </Button>
          </div>
        </div>
      )}

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
                <Button variant="ghost" size="sm" className="rounded-md  md:text-lg text-xl">
                  <AiOutlineEdit
                    className="text-blue-500"
                    onClick={() => handleEditFavorite(fav.id)}
                  />
                </Button>
                <Button variant="danger" size="sm" className="rounded-md md:text-lg text-xl">
                  <AiOutlineDelete
                    className="text-red-500"
                    onClick={() => handleDeleteFavorite(fav.id)}
                  />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
