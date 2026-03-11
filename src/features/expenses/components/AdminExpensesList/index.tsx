import type { TransportType, TripType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { Card } from "@/components/elements/Card";
import { ExpenseItem } from "@/features/expenses/components/ExpenseItem";
import { useExpenseEdit } from "@/features/expenses/hooks/useExpenseEdit";
import type { ExpenseRecord, SubmitAction } from "@/types/expenses";
import { getExpenses } from "../../apiClient";
import { normalizeExpenseRecords } from "../../utils/normalizeExpenseRecords";

interface AdminExpensesListProps {
  /**
   * 交通費データ再取得用トリガー
   */
  refreshTrigger: number;

  /**
   * 初期表示月（YYYY-MM形式）。未指定の場合は当月
   */
  initialYearMonth?: string;
  /**
   * フィルタリングするメンバーID（管理者が特定メンバーの申請を見る場合）
   */
  initialMemberId?: string;
  /**
   * 交通費の更新・削除成功時のコールバック
   */
  onSuccess: (action: SubmitAction) => void;
}

/**
 * 当月に申請したメンバーのみリスト化
 * 　　　　↓
 * メンバーをクリックするとそのメンバーの申請一覧が表示
 */
export const AdminExpensesList = ({
  refreshTrigger,
  initialYearMonth,
  initialMemberId,
  onSuccess,
}: AdminExpensesListProps) => {
  const { data: session } = useSession();
  const [listYearMonth, setListYearMonth] = useState(initialYearMonth);
  const [listExpenses, setListExpenses] = useState<ExpenseRecord[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState(initialMemberId);
  const [isExpanded, setIsExpanded] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshTrigger を依存配列に含めると無限ループになるため除外
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

  const submittedMembers = [
    ...new Map(
      listExpenses
        .filter((expense) => expense.member)
        .map((expense) => [
          expense.memberId,
          {
            id: expense.memberId,
            name: expense.member?.name ?? expense.memberId,
          },
        ]),
    ).values(),
  ];

  const displayedMemberExpenses = listExpenses.filter(
    (expense) => expense.memberId === selectedMemberId,
  );

  // リストの初期表示件数
  const INITIAL_DISPLAY_COUNT = 4;
  const visibleExpenses = isExpanded
    ? displayedMemberExpenses
    : displayedMemberExpenses.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = displayedMemberExpenses.length > INITIAL_DISPLAY_COUNT;

  const selectedMember = submittedMembers.find((m) => m.id === selectedMemberId);

  return (
    <Card className="mt-4">
      {/* ヘッダー */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      {/* メインコンテンツ */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* メンバーリスト（サイドバー） */}
        <div className="md:w-48 md:shrink-0">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            申請メンバー
          </p>
          {submittedMembers.length === 0 ? (
            <p className="text-sm text-gray-500">申請がありません</p>
          ) : (
            <ul className="space-y-1">
              {submittedMembers.map((member) => {
                const isSelected = member.id === selectedMemberId;
                return (
                  <li key={member.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMemberId(member.id);
                        setIsExpanded(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                        isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="truncate">{member.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 区切り線（デスクトップ） */}
        <div className="hidden w-px bg-gray-200 md:block" />

        {/* 申請一覧 */}
        <div className="flex-1 min-w-0">
          {!selectedMemberId ? (
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-300">
              <p className="text-sm text-gray-400">← メンバーを選択してください</p>
            </div>
          ) : displayedMemberExpenses.length === 0 ? (
            <>
              {selectedMember && (
                <p className="mb-3 text-base font-semibold text-gray-800">{selectedMember.name}</p>
              )}
              <p className="text-sm text-gray-500">選択した期間に申請がありません。</p>
            </>
          ) : (
            <>
              {selectedMember && (
                <p className="mb-3 text-base font-semibold text-gray-800">{selectedMember.name}</p>
              )}
              <ul className="space-y-3">
                {visibleExpenses.map((expense, idx) => (
                  <li key={expense.id}>
                    <ExpenseItem
                      expense={expense}
                      idx={idx}
                      idPrefix="admin-expense"
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
                      <MdExpandMore size={20} />他{" "}
                      {displayedMemberExpenses.length - INITIAL_DISPLAY_COUNT} 件を表示
                    </>
                  )}
                </button>
              )}
              {/* 合計 */}
              <div className="mt-4 flex justify-end">
                <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm">
                  <span className="font-medium text-gray-600">合計: </span>
                  <span className="font-bold text-blue-700">
                    {displayedMemberExpenses
                      .reduce((sum, e) => sum + e.amount, 0)
                      .toLocaleString("ja-JP")}
                    円
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
