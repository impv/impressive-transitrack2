import type { TransportType, TripType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { Card } from "@/components/elements/Card";
import { getExpenses } from "@/features/expenses/apiClient";
import { ExpenseItem } from "@/features/expenses/components/ExpenseItem";
import { useExpenseEdit } from "@/features/expenses/hooks/useExpenseEdit";
import { useSharedYearMonth } from "@/features/expenses/hooks/useSharedYearMonth";
import { normalizeExpenseRecords } from "@/features/expenses/utils/normalizeExpenseRecords";
import type { ExpenseRecord, SubmitAction } from "@/types/expenses";

// 交通費申請一覧カードコンポーネント
interface ExpenseListProps {
  /**
   * 交通費データ再取得用トリガー
   */
  refreshTrigger: number;
  /**
   * 交通費の更新・削除成功時のコールバック
   */
  onSuccess: (action: SubmitAction) => void;
  /**
   * 初期表示月（YYYY-MM形式）。未指定の場合は当月
   */
  initialYearMonth?: string;
  /**
   * フィルタリングするメンバーID（管理者が特定メンバーの申請を見る場合）
   */
  memberId?: string;
  /**
   * 表示するメンバー名（管理者ビューでデータがない場合にも名前を表示するために使用）
   */
  memberName?: string;
}

export const ExpensesList = ({
  refreshTrigger,
  onSuccess,
  initialYearMonth,
  memberId,
  memberName,
}: ExpenseListProps) => {
  const { data: session } = useSession();

  const [listYearMonth, setListYearMonth] = useSharedYearMonth(initialYearMonth);
  const [listExpenses, setListExpenses] = useState<ExpenseRecord[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // リストの初期表示件数
  const INITIAL_DISPLAY_COUNT = 4;
  const visibleExpenses = isExpanded ? listExpenses : listExpenses.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = listExpenses.length > INITIAL_DISPLAY_COUNT;

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
    errors: editErrors,
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
      setSelectedExpenseId(null);
      onSuccess("save");
    },
    onDeleteSuccess: (deletedId: string) => {
      setListExpenses((prev) => prev.filter((expense) => expense.id !== deletedId));
      onSuccess("delete");
    },
  });

  return (
    <Card className="mt-4">
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
        <>
          {memberId && memberName && (
            <p className="mb-3 text-base font-semibold text-gray-800">{memberName}</p>
          )}
          <p className="text-sm text-gray-600">選択した期間に交通費申請がありません。</p>
        </>
      ) : (
        <>
          {memberId && (memberName ?? listExpenses[0]?.member?.name) && (
            <p className="mb-3 text-base font-semibold text-gray-800">
              {memberName ?? listExpenses[0]?.member?.name}
            </p>
          )}
          <ul className="space-y-3">
            {visibleExpenses.map((expense, idx) => (
              <li key={expense.id}>
                <ExpenseItem
                  expense={expense}
                  idx={idx}
                  selectedExpenseId={selectedExpenseId}
                  expenseEditForm={expenseEditForm}
                  isUpdating={isEditUpdating}
                  errors={editErrors}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                  onFormChange={setExpenseEditForm}
                  onSubmitUpdate={submitUpdate}
                />
              </li>
            ))}
          </ul>
        </>
      )}
      {hasMore && (
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="mt-3 flex w-full items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <>
              <MdExpandLess size={20} />
              閉じる
            </>
          ) : (
            <>
              <MdExpandMore size={20} />他 {listExpenses.length - INITIAL_DISPLAY_COUNT} 件を表示
            </>
          )}
        </button>
      )}
    </Card>
  );
};
