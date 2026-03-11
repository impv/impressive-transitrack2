import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getExpenses } from "@/features/expenses/apiClient";
import { useCsvDownload } from "@/features/expenses/hooks/useCsvDownload";
import type { ExpenseRecord } from "@/types/expenses";
import { normalizeExpenseRecords } from "@/features/expenses/utils/normalizeExpenseRecords";
import { useSharedYearMonth } from "@/features/expenses/hooks/useSharedYearMonth";
import { MdDownload, MdArrowForward } from "react-icons/md";

interface SummaryExpensesProps {
  /**
   * 交通費データ再取得用トリガー
   */
  refreshTrigger?: number;
}

interface MemberSummaryItem {
  name: string;
  email: string;
  totalAmount: number;
}

const buildMemberSummary = (expenses: ExpenseRecord[]): [string, MemberSummaryItem][] => {
  const summary = expenses.reduce(
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
    {} as Record<string, MemberSummaryItem>,
  );
  return Object.entries(summary);
};

export const SummaryExpenses = ({ refreshTrigger }: SummaryExpensesProps) => {
  const { data: session } = useSession();
  const [summaryYearMonth, setSummaryYearMonth] = useSharedYearMonth();
  const [summaryExpenses, setSummaryExpenses] = useState<ExpenseRecord[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 申請が成功した時のリフレッシュトリガーを追加
  useEffect(() => {
    const fetchSummaryExpenses = async () => {
      try {
        const response = await getExpenses(summaryYearMonth);
        setSummaryExpenses(normalizeExpenseRecords(response));
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
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          <button
            type="button"
            className="text-2xl"
            title="CSVをダウンロード"
            onClick={handleDownloadCsv}
          >
            <MdDownload />
          </button>
        </div>
      </div>
      <AdminSummary expenses={summaryExpenses} yearMonth={summaryYearMonth} />
    </>
  );
};

const AdminSummary = ({
  expenses,
  yearMonth,
}: {
  expenses: ExpenseRecord[];
  yearMonth: string;
}) => {
  const router = useRouter();
  const summaryList = buildMemberSummary(expenses);

  if (summaryList.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-gray-300">
        <p className="text-sm text-gray-400">選択した期間にデータがありません。</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">名前</th>
            <th className="hidden px-4 py-3 sm:table-cell">メールアドレス</th>
            <th className="px-4 py-3 text-right">合計金額</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {summaryList.map(([memberId, data]) => (
            <tr
              key={memberId}
              className="group cursor-pointer transition-colors hover:bg-blue-50"
              onClick={() =>
                router.push(
                  `/expenses?month=${yearMonth}&memberId=${memberId}&memberName=${encodeURIComponent(data.name)}`,
                )
              }
            >
              <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{data.name}</span>
                </div>
              </td>
              <td className="hidden px-4 py-3.5 sm:table-cell">
                <span className="text-xs text-gray-500">{data.email}</span>
              </td>
              <td className="px-4 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-semibold text-blue-700">
                    {data.totalAmount.toLocaleString("ja-JP")}円
                  </span>
                  <MdArrowForward className="text-sm text-blue-300 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
