import { useToast } from "@/hooks/useToast";
import type { ExpenseRecord } from "@/types/expenses";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useExpenseEdit } from "@/features/expenses/hooks/useExpenseEdit";
import type { TransportType, TripType } from "@prisma/client";
import { getExpenses } from "@/features/expenses/apiClient";
import { getCurrentYearMonth } from "@/features/expenses/utils/getCurrentYearMonth";
import { normalizeExpenseRecords } from "@/features/expenses/utils/normalizeExpenseRecords";
import { Input } from "@/components/elements/Input";

// 交通費申請一覧カードコンポーネント
interface ExpenseListProps {
  /**
   * 交通費データ再取得用トリガー
   */
  refreshTrigger: number;
}

export const ExpensesList = ({ refreshTrigger }: ExpenseListProps) => {
  const { data: session } = useSession();
  const { showToast } = useToast();

  const [listYearMonth, setListYearMonth] = useState<string>(getCurrentYearMonth());
  const [listExpenses, setListExpenses] = useState<ExpenseRecord[]>([]);

  // 交通費一覧用のデータ取得
  // biome-ignore lint/correctness/useExhaustiveDependencies: 申請が成功した時のリフレッシュトリガーを追加
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchListExpenses = async () => {
      try {
        const response = await getExpenses(listYearMonth);
        setListExpenses(normalizeExpenseRecords(response));
      } catch (error) {
        console.error("交通費一覧の取得に失敗しました:", error);
      }
    };

    fetchListExpenses();
  }, [session?.user?.id, listYearMonth, refreshTrigger]);

  const {
    expenseEditForm,
    selectedExpenseId,
    isUpdating: isEditUpdating,
    setExpenseEditForm,
    submitUpdate,
    setSelectedExpenseId,
    handleEditClick,
    handleDeleteClick,
  } = useExpenseEdit({
    expenses: listExpenses,
    onSuccess: (updated: ExpenseRecord) => {
      setListExpenses((prev) =>
        prev.map((p) =>
          p.id === updated.id
            ? {
                ...updated,
                transport: updated.transport as TransportType,
                tripType: updated.tripType as TripType,
              }
            : p,
        ),
      );

      showToast("申請を更新しました");
      setSelectedExpenseId(null);
    },
    onDeleteSuccess: (deletedId: string) => {
      setListExpenses((prev) => prev.filter((expense) => expense.id !== deletedId));
      showToast("申請を削除しました");
    },
  });

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl" id="list">
          交通費申請一覧
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="yearMonthInput" className="text-sm font-medium text-gray-700">
            表示期間:
          </label>
          <input
            id="yearMonthInput"
            type="month"
            value={listYearMonth}
            onChange={(e) => setListYearMonth(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      {listExpenses.length === 0 ? (
        <p className="text-sm text-gray-600">選択した期間に交通費申請がありません。</p>
      ) : (
        <ul className="space-y-3">
          {listExpenses.map((expense, idx) => {
            const dateObject = new Date(expense.date);
            const formattedDate = Number.isNaN(dateObject.getTime())
              ? "日付不明"
              : dateObject.toLocaleDateString("ja-JP", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
            const amountLabel = expense.amount.toLocaleString("ja-JP");
            const transportLabel = expense.transport === "TRAIN" ? "電車" : "バス";
            const tripTypeLabel = expense.tripType === "ROUNDTRIP" ? "往復" : "片道";
            const tripTypeBadgeClass =
              expense.tripType === "ROUNDTRIP"
                ? "bg-purple-100 text-purple-700"
                : "bg-emerald-100 text-emerald-700";
            const titleId = `expense-${idx}-title`;

            return (
              <li
                key={expense.id}
                className="transition-transform duration-200 hover:-translate-y-0.5"
              >
                <article
                  aria-labelledby={titleId}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p id={titleId} className="text-sm font-semibold text-gray-900">
                        {formattedDate}
                      </p>
                      {expense.member && (
                        <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                          {expense.member.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        {transportLabel}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${tripTypeBadgeClass}`}
                      >
                        {tripTypeLabel}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
                      <div className="flex items-baseline gap-2">
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          出発
                        </dt>
                        <dd className="text-gray-900">{expense.departure}</dd>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          到着
                        </dt>
                        <dd className="text-gray-900">{expense.arrival}</dd>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          申請金額
                        </dt>
                        <dd className="text-gray-900">{amountLabel}円</dd>
                      </div>
                    </dl>
                    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditClick(expense.id)}
                        className="cursor-pointer rounded-md border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
                      >
                        編集する
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(expense.id)}
                        className="cursor-pointer rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
                      >
                        削除する
                      </button>
                    </div>
                  </div>
                  {/* 編集用アコーディオン */}
                  {selectedExpenseId === expense.id && (
                    <div className="mt-4 rounded-lg border-t pt-4">
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          try {
                            await submitUpdate(expense.id);
                          } catch (err) {
                            console.error("更新に失敗しました:", err);
                            alert("更新に失敗しました。入力内容を確認してください。");
                          }
                        }}
                        className="mt-3 space-y-3"
                      >
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label
                              htmlFor={`edit-date-${expense.id}`}
                              className="mb-1 block text-xs font-medium text-gray-600"
                            >
                              日付
                            </label>
                            <input
                              id={`edit-date-${expense.id}`}
                              type="date"
                              value={expenseEditForm.date}
                              onChange={(e) =>
                                setExpenseEditForm({ ...expenseEditForm, date: e.target.value })
                              }
                              className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`edit-departure-${expense.id}`}
                              className="mb-1 block text-xs font-medium text-gray-600"
                            >
                              出発
                            </label>
                            <Input
                              id={`edit-departure-${expense.id}`}
                              type="text"
                              value={expenseEditForm.departure}
                              onChange={(e) =>
                                setExpenseEditForm({
                                  ...expenseEditForm,
                                  departure: e.target.value,
                                })
                              }
                              className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`edit-arrival-${expense.id}`}
                              className="mb-1 block text-xs font-medium text-gray-600"
                            >
                              到着
                            </label>
                            <Input
                              id={`edit-arrival-${expense.id}`}
                              type="text"
                              value={expenseEditForm.arrival}
                              onChange={(e) =>
                                setExpenseEditForm({
                                  ...expenseEditForm,
                                  arrival: e.target.value,
                                })
                              }
                              className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`edit-fare-${expense.id}`}
                              className="mb-1 block text-xs font-medium text-gray-600"
                            >
                              運賃（円）
                            </label>
                            <Input
                              id={`edit-fare-${expense.id}`}
                              type="number"
                              value={expenseEditForm.amount}
                              onChange={(e) =>
                                setExpenseEditForm({
                                  ...expenseEditForm,
                                  amount: Number(e.target.value),
                                })
                              }
                              className="w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
                              min={1}
                              step={1}
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="radio"
                                name={`transport-${expense.id}`}
                                value="TRAIN"
                                checked={expenseEditForm.transport === "TRAIN"}
                                onChange={(e) =>
                                  setExpenseEditForm({
                                    ...expenseEditForm,
                                    transport: e.target.value as TransportType,
                                  })
                                }
                              />
                              電車
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="radio"
                                name={`transport-${expense.id}`}
                                value="BUS"
                                checked={expenseEditForm.transport === "BUS"}
                                onChange={(e) =>
                                  setExpenseEditForm({
                                    ...expenseEditForm,
                                    transport: e.target.value as TransportType,
                                  })
                                }
                              />
                              バス
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditClick(expense.id)}
                            className="rounded-md border border-gray-200 px-3 py-1 text-sm"
                          >
                            キャンセル
                          </button>
                          <button
                            type="submit"
                            disabled={isEditUpdating}
                            className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white"
                          >
                            {isEditUpdating ? "更新中..." : "更新する"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};
