import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/elements/Button";
import { getExpenses } from "@/features/expenses/apiClient";
import { useCsvDownload } from "@/features/expenses/hooks/useCsvDownload";
import type { ExpenseRecord } from "@/types/expenses";
import { getCurrentYearMonth } from "@/features/expenses/utils/getCurrentYearMonth";
import { normalizeExpenseRecords } from "@/features/expenses/utils/normalizeExpenseRecords";

// 交通費合計カードコンポーネント

interface SummaryExpensesProps {
  /**
   * 交通費データ再取得用トリガー
   */
  refreshTrigger?: number;
}

export const SummaryExpenses = ({ refreshTrigger }: SummaryExpensesProps) => {
  const { data: session } = useSession();
  const [summaryYearMonth, setSummaryYearMonth] = useState<string>(getCurrentYearMonth());
  const [summaryExpenses, setSummaryExpenses] = useState<ExpenseRecord[]>([]);

  // 交通費合計用のデータ取得
  // biome-ignore lint/correctness/useExhaustiveDependencies: 申請が成功した時のリフレッシュトリガーを追加
  useEffect(() => {
    const fetchSummaryExpenses = async () => {
      try {
        const response = await getExpenses(summaryYearMonth);
        const normalizedExpenses = normalizeExpenseRecords(response);
        setSummaryExpenses(normalizedExpenses);
      } catch (error) {
        console.error("交通費合計の取得に失敗しました:", error);
      }
    };

    fetchSummaryExpenses();
  }, [summaryYearMonth, refreshTrigger]);

  const { downloadCsv } = useCsvDownload();

  const handleDownloadCsv = () => {
    downloadCsv(summaryExpenses, session?.user ?? {}, summaryYearMonth);
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl" id="summary">
          交通費合計
        </h2>
        <div className="flex items-center gap-2">
          <label htmlFor="summaryYearMonthInput" className="text-sm font-medium text-gray-700">
            表示期間:
          </label>
          <input
            id="summaryYearMonthInput"
            type="month"
            value={summaryYearMonth}
            onChange={(e) => setSummaryYearMonth(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          <Button variant="secondary" size="md" onClick={handleDownloadCsv}>
            CSVダウンロード
          </Button>
        </div>
      </div>
      {session?.user?.isAdmin ? (
        (() => {
          const memberSummary = summaryExpenses.reduce(
            (acc, expense) => {
              const key = expense.memberId;
              if (!acc[key]) {
                acc[key] = {
                  name: expense.member?.name ?? "不明",
                  email: expense.member?.email ?? "",
                  totalAmount: 0,
                };
              }
              acc[key].totalAmount += expense.amount;
              return acc;
            },
            {} as Record<string, { name: string; email: string; totalAmount: number }>,
          );
          const summaryList = Object.entries(memberSummary);

          return summaryList.length === 0 ? (
            <p className="text-sm text-gray-600">選択した期間にデータがありません。</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">名前</th>
                    <th className="px-4 py-3">メールアドレス</th>
                    <th className="px-4 py-3 text-right">合計金額</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {summaryList.map(([memberId, data]) => (
                    <tr key={memberId} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{data.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-500">{data.email}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {data.totalAmount.toLocaleString("ja-JP")}円
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()
      ) : (
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div>
            <p className="text-sm font-medium text-gray-500">合計金額</p>
            <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {summaryExpenses
                .reduce((sum, expense) => sum + expense.amount, 0)
                .toLocaleString("ja-JP")}
              <span className="ml-1 text-lg font-normal text-gray-600">円</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
