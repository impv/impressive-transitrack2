import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useExpenseForm } from "@/features/expenses/hooks/useExpenseForm";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  const {
    expenseForm,
    setExpenseForm,
    handleSubmitExpense,
    isSubmitting,
    submitError,
    submitSuccess,
  } = useExpenseForm();

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
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="arrival" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="fare" className="block text-sm font-medium text-gray-700 mb-1">
                運賃（円）
              </label>
              <input
                id="fare"
                type="number"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                placeholder="例: 200"
                min="1"
                step="1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* 交通手段 */}
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">交通手段</legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
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
                <label className="flex items-center gap-2 cursor-pointer">
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
              <legend className="block text-sm font-medium text-gray-700 mb-2">片道/往復</legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
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
                <label className="flex items-center gap-2 cursor-pointer">
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
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isSubmitting ? "送信中..." : "申請する"}
            </button>
          </form>
        </div>

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
