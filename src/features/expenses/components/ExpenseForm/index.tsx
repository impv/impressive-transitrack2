import type { FC, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  MdArrowRightAlt,
  MdCalendarToday,
  MdCheckCircle,
  MdDirectionsBus,
  MdError,
  MdFormatListBulleted,
  MdStar,
  MdSyncAlt,
  MdTrain,
  MdBorderColor,
} from "react-icons/md";

import { twMerge } from "tailwind-merge";
import { useExpenseForm } from "@/features/expenses/hooks/useExpenseForm";
import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/Input";
import { FavoriteRouteConfirmDialog } from "@/features/expenses/components/FavoriteRouteConfirmDialog";
import type { FavoriteRouteResponseItem } from "@/features/expenses/favoriteRoutesApiClient";
import type { FavoriteRouteInput } from "@/types/favoriteRoutes";
import type { SubmitAction } from "@/types/expenses";

// 交通費申請フォームカードコンポーネント
interface ExpenseFormProps {
  /**
   * お気に入り経路一覧
   */
  favorites: FavoriteRouteResponseItem[];
  /**
   * お気に入り経路保存中フラグ
   */
  isFavoriteSaving: boolean;
  /**
   * 申請の作成/更新が成功したタイミングで呼ばれるコールバック
   * （親側でトースト表示やリストの再取得トリガーを行う用途）
   */
  onSuccess: (action: SubmitAction) => void;
  /**
   * 交通費申請フォームの内容からお気に入り経路を保存する関数
   */
  saveFromExpenseForm: (input: Omit<FavoriteRouteInput, "name">) => Promise<void>;
}

const TRANSPORT_OPTIONS = [
  { value: "TRAIN" as const, label: "電車", Icon: MdTrain },
  { value: "BUS" as const, label: "バス", Icon: MdDirectionsBus },
];

const TRIP_TYPE_OPTIONS = [
  { value: "ONEWAY" as const, label: "片道", Icon: MdArrowRightAlt },
  { value: "ROUNDTRIP" as const, label: "往復", Icon: MdSyncAlt },
];

export const ExpenseForm: FC<ExpenseFormProps> = ({
  favorites,
  isFavoriteSaving,
  onSuccess,
  saveFromExpenseForm,
}) => {
  const [selectedFavoriteId, setSelectedFavoriteId] = useState("");
  const isFavoriteSelected = selectedFavoriteId !== "";
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const {
    expenseForm,
    isSubmitting,
    submitErrors,
    submitSuccess,
    setExpenseForm,
    submitExpense,
    validateAndShowErrors,
    resetForm,
  } = useExpenseForm((action) => {
    setSelectedFavoriteId("");
    onSuccess(action);
  });

  /**
   * 登録されているお気に入り経路の中で、申請内容と重複しているものがあるか判別
   */
  const isAlreadyFavorite = favorites.some(
    (favorite) =>
      favorite.departure === expenseForm.departure &&
      favorite.arrival === expenseForm.arrival &&
      favorite.amount === expenseForm.amount &&
      favorite.transport === expenseForm.transport &&
      favorite.tripType === expenseForm.tripType,
  );

  /**
   * フォーム内のボタンを押下時に実行する関数
   */
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validateAndShowErrors()) return;
    if (!isAlreadyFavorite) {
      setIsConfirmDialogOpen(true);
      return;
    }
    await submitExpense();
  };

  /**
   * ダイアログ内で申請処理を行う際に実行する関数
   */
  const handleConfirmDialogSubmit = async (shouldRegisterFavorite: boolean) => {
    if (shouldRegisterFavorite) {
      await saveFromExpenseForm({
        departure: expenseForm.departure,
        arrival: expenseForm.arrival,
        amount: expenseForm.amount,
        transport: expenseForm.transport,
        tripType: expenseForm.tripType,
      });
    }
    await submitExpense();
    setIsConfirmDialogOpen(false);
  };

  return (
    <>
      <FavoriteRouteConfirmDialog
        isVisible={isConfirmDialogOpen}
        formData={expenseForm}
        isSubmitting={isSubmitting || isFavoriteSaving}
        onConfirmDialogSubmit={handleConfirmDialogSubmit}
        onClose={() => setIsConfirmDialogOpen(false)}
      />

      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
            <MdBorderColor className="text-blue-600" size={18} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl" id="form">
            交通費申請
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            href="/expenses"
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 sm:px-3 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            <MdFormatListBulleted size={16} />
            <span className="hidden sm:inline">申請一覧</span>
          </Link>
          <Link
            href="/favoriteRoute"
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 sm:px-3 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            <MdStar size={16} />
            <span className="hidden sm:inline">お気に入り経路</span>
          </Link>
        </div>
      </div>

      {/* エラーメッセージ */}
      {submitErrors.length > 0 && (
        <div className="mb-4 flex gap-2.5 rounded-xl bg-red-50 p-3.5 border border-red-100">
          <MdError className="text-red-400 shrink-0 mt-0.5" size={16} />
          <ul className="text-sm text-red-700 space-y-0.5 list-none">
            {submitErrors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 成功メッセージ */}
      {submitSuccess && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-green-50 p-3.5 border border-green-100">
          <MdCheckCircle className="text-green-500 shrink-0" size={16} />
          <p className="text-sm text-green-700">交通費申請が正常に送信されました</p>
        </div>
      )}

      {/* お気に入り経路からクイック入力 */}
      {favorites.length > 0 && (
        <div className="mb-5 p-3.5 bg-amber-50 rounded-xl border border-amber-100">
          <div className="flex items-center gap-1.5 mb-2">
            <MdStar className="text-amber-400 shrink-0" size={15} />
            <label
              htmlFor="favoriteSelect"
              className="text-xs font-semibold text-amber-700 uppercase tracking-wide"
            >
              お気に入りから入力
            </label>
          </div>
          <select
            id="favoriteSelect"
            value={selectedFavoriteId}
            onChange={(e) => {
              setSelectedFavoriteId(e.target.value);
              const selected = favorites.find((f) => f.id === e.target.value);
              if (selected) {
                setExpenseForm({
                  ...expenseForm,
                  departure: selected.departure,
                  arrival: selected.arrival,
                  amount: selected.amount,
                  transport: selected.transport,
                  tripType: selected.tripType,
                });
              } else {
                setExpenseForm((prev) => ({
                  ...prev,
                  departure: "",
                  arrival: "",
                  amount: 0,
                  transport: "TRAIN",
                  tripType: "ONEWAY",
                }));
              }
            }}
            className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-amber-400 focus:outline-none"
          >
            <option value="">-- お気に入りを選択 --</option>
            {favorites.map((fav) => (
              <option key={fav.id} value={fav.id}>
                {fav.name || `${fav.departure} → ${fav.arrival}`} (
                {fav.amount.toLocaleString("ja-JP")}円・
                {fav.transport === "TRAIN" ? "電車" : "バス"}・
                {fav.tripType === "ROUNDTRIP" ? "往復" : "片道"})
              </option>
            ))}
          </select>
        </div>
      )}

      <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
        {/* 日付 */}
        <div>
          <label
            htmlFor="date"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700"
          >
            <MdCalendarToday className="text-gray-400" size={14} />
            日付
          </label>
          <Input
            id="date"
            type="date"
            value={expenseForm.date}
            onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
            required
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
                    htmlFor="departure"
                    className="mb-1 block text-[10px] font-semibold text-blue-500 uppercase tracking-wide"
                  >
                    出発
                  </label>
                  {isFavoriteSelected ? (
                    <p className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                      {expenseForm.departure}
                    </p>
                  ) : (
                    <Input
                      id="departure"
                      type="text"
                      value={expenseForm.departure}
                      onChange={(e) =>
                        setExpenseForm({ ...expenseForm, departure: e.target.value })
                      }
                      placeholder="例: 東京駅"
                      className="bg-white/80"
                      required
                    />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="arrival"
                    className="mb-1 block text-[10px] font-semibold text-blue-700 uppercase tracking-wide"
                  >
                    到着
                  </label>
                  {isFavoriteSelected ? (
                    <p className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                      {expenseForm.arrival}
                    </p>
                  ) : (
                    <Input
                      id="arrival"
                      type="text"
                      value={expenseForm.arrival}
                      onChange={(e) => setExpenseForm({ ...expenseForm, arrival: e.target.value })}
                      placeholder="例: 新宿駅"
                      className="bg-white/80"
                      required
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 運賃 */}
        <div>
          <label htmlFor="fare" className="mb-1.5 block text-sm font-medium text-gray-700">
            運賃
          </label>
          {isFavoriteSelected ? (
            <p className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              ¥{expenseForm.amount.toLocaleString("ja-JP")}
            </p>
          ) : (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none select-none">
                ¥
              </span>
              <Input
                id="fare"
                type="text"
                value={expenseForm.amount || ""}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    amount: Number(e.target.value),
                  })
                }
                placeholder="例: 200"
                className="pl-7"
                required
              />
            </div>
          )}
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
                    "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all",
                    isFavoriteSelected
                      ? expenseForm.transport === value
                        ? "border-blue-500 bg-blue-50 text-blue-700 cursor-default"
                        : "border-gray-200 bg-gray-50 text-gray-300 cursor-default"
                      : expenseForm.transport === value
                        ? "border-blue-500 bg-blue-50 text-blue-700 cursor-pointer"
                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50 cursor-pointer",
                  )}
                >
                  <input
                    type="radio"
                    name="transportation"
                    value={value}
                    checked={expenseForm.transport === value}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        transport: e.target.value as "TRAIN" | "BUS",
                      })
                    }
                    disabled={isFavoriteSelected}
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
                    "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all",
                    isFavoriteSelected
                      ? expenseForm.tripType === value
                        ? "border-blue-500 bg-blue-50 text-blue-700 cursor-default"
                        : "border-gray-200 bg-gray-50 text-gray-300 cursor-default"
                      : expenseForm.tripType === value
                        ? "border-blue-500 bg-blue-50 text-blue-700 cursor-pointer"
                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50 cursor-pointer",
                  )}
                >
                  <input
                    type="radio"
                    name="tripType"
                    value={value}
                    checked={expenseForm.tripType === value}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        tripType: e.target.value as "ONEWAY" | "ROUNDTRIP",
                      })
                    }
                    disabled={isFavoriteSelected}
                    className="sr-only"
                  />
                  <Icon size={20} />
                  <span className="text-xs font-semibold">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* 往復注記 */}
        {expenseForm.tripType === "ROUNDTRIP" && (
          <p className="text-xs text-gray-500 bg-blue-50 rounded-lg px-3 py-2.5 border border-blue-100">
            ※往復を選択すると、行き（出発駅→到着駅）と帰り（到着駅→出発駅）の2つの申請が自動的に作成されます。運賃には片道分の金額を入力してください。
          </p>
        )}

        {/* 送信・クリアボタン */}
        <div className="flex gap-2 pt-1">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "送信中..." : "申請する"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => {
              resetForm();
              setSelectedFavoriteId("");
            }}
            disabled={isSubmitting}
          >
            クリア
          </Button>
        </div>
      </form>
    </>
  );
};
