import type { FC } from "react";
import { useEffect } from "react";
import { useExpenseForm } from "@/features/expenses/hooks/useExpenseForm";
import { Input } from "@/components/elements/Input";

// 交通費申請フォームカードコンポーネント
interface ExpenseFormProps {
  /**
   * 申請の作成/更新が成功したタイミングで呼ばれるコールバック
   * （親側でトースト表示やリストの再取得トリガーを行う用途）
   */
  onSuccess?: () => void;
}

export const ExpenseForm: FC<ExpenseFormProps> = ({ onSuccess }) => {
  const {
    expenseForm,
    isSubmitting,
    submitError,
    submitSuccess,
    setExpenseForm,
    handleSubmitExpense,
  } = useExpenseForm();

  // 成功状態になったタイミングで親へ通知（例: リスト再取得やトースト表示）
  useEffect(() => {
    if (submitSuccess) {
      onSuccess?.();
    }
  }, [submitSuccess, onSuccess]);

  return (
    <>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl" id="form">
        交通費申請
      </h2>

      {/* エラーメッセージ */}
      {submitError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{submitError}</div>
      )}

      {/* 成功メッセージ */}
      {submitSuccess && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
          交通費申請が正常に送信されました
        </div>
      )}

      <form onSubmit={handleSubmitExpense} className="space-y-4">
        {/* 日付 */}
        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
            日付
          </label>
          <input
            id="date"
            type="date"
            value={expenseForm.date}
            onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* 出発駅 */}
        <div>
          <label htmlFor="departure" className="mb-1 block text-sm font-medium text-gray-700">
            出発駅
          </label>
          <Input
            id="departure"
            type="text"
            value={expenseForm.departure}
            onChange={(e) => setExpenseForm({ ...expenseForm, departure: e.target.value })}
            placeholder="例: 東京駅"
            required
          />
        </div>

        {/* 到着駅 */}
        <div>
          <label htmlFor="arrival" className="mb-1 block text-sm font-medium text-gray-700">
            到着駅
          </label>
          <Input
            id="arrival"
            type="text"
            value={expenseForm.arrival}
            onChange={(e) => setExpenseForm({ ...expenseForm, arrival: e.target.value })}
            placeholder="例: 新宿駅"
            required
          />
        </div>

        {/* 運賃 */}
        <div>
          <label htmlFor="fare" className="mb-1 block text-sm font-medium text-gray-700">
            運賃（円）
          </label>
          <Input
            id="fare"
            type="number"
            value={expenseForm.amount}
            onChange={(e) =>
              setExpenseForm({
                ...expenseForm,
                amount: Number(e.target.value),
              })
            }
            placeholder="例: 200"
            min="1"
            step="1"
            required
          />
        </div>

        {/* 交通手段 */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-gray-700">交通手段</legend>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <Input
                type="radio"
                name="transportation"
                value="TRAIN"
                checked={expenseForm.transport === "TRAIN"}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    transport: e.target.value as "TRAIN" | "BUS",
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">電車</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <Input
                type="radio"
                name="transportation"
                value="BUS"
                checked={expenseForm.transport === "BUS"}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    transport: e.target.value as "TRAIN" | "BUS",
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">バス</span>
            </label>
          </div>
        </fieldset>

        {/* 片道/往復 */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-gray-700">片道/往復</legend>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <Input
                type="radio"
                name="tripType"
                value="ONEWAY"
                checked={expenseForm.tripType === "ONEWAY"}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    tripType: e.target.value as "ONEWAY" | "ROUNDTRIP",
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">片道</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <Input
                type="radio"
                name="tripType"
                value="ROUNDTRIP"
                checked={expenseForm.tripType === "ROUNDTRIP"}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    tripType: e.target.value as "ONEWAY" | "ROUNDTRIP",
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">往復</span>
            </label>
          </div>
          {expenseForm.tripType === "ROUNDTRIP" && (
            <p className="mt-2 text-xs text-gray-600">
              ※往復を選択すると、行き（出発駅→到着駅）と帰り（到着駅→出発駅）の2つの申請が自動的に作成されます。運賃には片道分の金額を入力してください。
            </p>
          )}
        </fieldset>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-blue-400 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? "送信中..." : "申請する"}
        </button>
      </form>
    </>
  );
};
