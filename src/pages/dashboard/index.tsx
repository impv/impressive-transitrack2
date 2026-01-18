import type { TransportType, TripType } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { getExpenses } from "@/features/expenses/apiClient";
import useExpenseEditor from "@/features/expenses/hooks/useExpenseEdit";
import { useExpenseForm } from "@/features/expenses/hooks/useExpenseForm";
import type { ExpenseRecord } from "@/types/expenses";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await getExpenses();
        const expenses: ExpenseRecord[] = response.map((r) => {
          if (!Object.values(["TRAIN", "BUS"]).includes(r.transport)) {
            throw new Error("不正な transport");
          }
          if (!Object.values(["ONEWAY", "ROUNDTRIP"]).includes(r.tripType)) {
            throw new Error("不正な tripType");
          }
          return {
            ...r,
            transport: r.transport as TransportType,
            tripType: r.tripType as TripType,
          };
        });
        setExpenses(expenses);
      } catch (error) {
        console.error("交通費の取得に失敗しました:", error);
      }
    };

    if (session?.user?.id) {
      fetchExpenses();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  const {
    expenseForm,
    isSubmitting,
    submitError,
    submitSuccess,
    setExpenseForm,
    handleSubmitExpense,
  } = useExpenseForm();

  // トースト表示用
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const {
    expenseEditForm,
    selectedExpenseId,
    isUpdating: isEditUpdating,
    setExpenseEditForm,
    submitUpdate,
    setSelectedExpenseId,
    handleEditClick,
    handleDeleteClick,
  } = useExpenseEditor({
    expenses,
    onSuccess: (updated) => {
      setExpenses((prev) =>
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
      setToastMessage("申請を更新しました");
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = window.setTimeout(() => setToastMessage(null), 3000);
      setSelectedExpenseId(null);
    },
    onDeleteSuccess: (deletedId) => {
      setExpenses((prev) => prev.filter((expense) => expense.id !== deletedId));
      setToastMessage("申請を削除しました");
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = window.setTimeout(() => setToastMessage(null), 3000);
    },
  });

  // 未ログイン時はリダイレクト中の表示
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">リダイレクト中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* ヘッダー */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-lg sm:mb-8 sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">TransiTrack 2</h1>
              <p className="mt-1 text-sm text-gray-600 sm:text-base">
                ようこそ、{session.user?.name}さん
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none sm:w-auto"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* ユーザー情報カード */}
        <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">ユーザー情報</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>User icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-gray-500 sm:text-sm">名前</span>
                <p className="truncate text-sm text-gray-900 sm:text-base">
                  {session.user?.name} {session.user?.isAdmin ? "(管理者)" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Email icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-gray-500 sm:text-sm">メール</span>
                <p className="truncate text-sm text-gray-900 sm:text-base">{session.user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 交通費申請リストカード */}
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-lg sm:mt-8 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">交通費申請一覧</h2>
          <ul className="space-y-3">
            {expenses.map((expense, idx) => {
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
                    <header className="flex flex-wrap items-center justify-between gap-2">
                      <p id={titleId} className="text-sm font-semibold text-gray-900">
                        {formattedDate}
                      </p>
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
                    </header>
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
                    <footer className="mt-4 flex flex-wrap items-center justify-end gap-2">
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
                    </footer>
                    {/* 編集用アコーディオン */}
                    {selectedExpenseId === expense.id && (
                      <div className="mt-4 rounded-lg border-t pt-4">
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                              await submitUpdate(expense.id);
                              // onSuccess handler already updates local state and toast
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
                              <input
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
                              <input
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
                              <input
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
        </div>

        {/* 交通費申請フォームカード */}
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-lg sm:mt-8 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">交通費申請</h2>

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
              <input
                id="departure"
                type="text"
                value={expenseForm.departure}
                onChange={(e) => setExpenseForm({ ...expenseForm, departure: e.target.value })}
                placeholder="例: 東京駅"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* 到着駅 */}
            <div>
              <label htmlFor="arrival" className="mb-1 block text-sm font-medium text-gray-700">
                到着駅
              </label>
              <input
                id="arrival"
                type="text"
                value={expenseForm.arrival}
                onChange={(e) => setExpenseForm({ ...expenseForm, arrival: e.target.value })}
                placeholder="例: 新宿駅"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* 運賃 */}
            <div>
              <label htmlFor="fare" className="mb-1 block text-sm font-medium text-gray-700">
                運賃（円）
              </label>
              <input
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* 交通手段 */}
            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-gray-700">交通手段</legend>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
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
                  <input
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
                  <input
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
                  <input
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
        </div>

        {/* トースト */}
        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50">
            <div className="rounded-lg bg-black/90 px-4 py-2 text-sm text-white">
              {toastMessage}
            </div>
          </div>
        )}

        {/* お知らせカード */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 shadow-lg sm:mt-6 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <svg
              className="h-5 w-5 shrink-0 text-white sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Info icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-white sm:text-base">お知らせ</h3>
              <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                交通費申請が可能になりました！上記フォームからご申請ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
