import type { TransportType } from "@prisma/client";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/Input";
import type { ExpenseInput, ExpenseRecord } from "@/types/expenses";

type ExpenseEditFormState = Omit<ExpenseInput, "tripType">;

interface ExpenseItemProps {
  expense: ExpenseRecord;
  idx: number;
  /**
   * aria-labelledby の id プレフィックス（重複を避けるため）
   */
  idPrefix?: string;
  /**
   * メンバーバッジを表示するか（ユーザー自身のリストでメンバー名を表示する場合）
   */
  selectedExpenseId: string | null;
  expenseEditForm: ExpenseEditFormState;
  isUpdating: boolean;
  errors: string[];
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
  onFormChange: (form: ExpenseEditFormState) => void;
  onSubmitUpdate: (id: string) => Promise<unknown>;
}

export const ExpenseItem = ({
  expense,
  idx,
  idPrefix = "expense",
  selectedExpenseId,
  expenseEditForm,
  isUpdating,
  errors,
  onEditClick,
  onDeleteClick,
  onFormChange,
  onSubmitUpdate,
}: ExpenseItemProps) => {
  const dateObject = new Date(expense.date);
  const formattedDate = Number.isNaN(dateObject.getTime())
    ? "日付不明"
    : dateObject.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  const amountLabel = expense.amount.toLocaleString("ja-JP");
  const transportLabel = expense.transport === "TRAIN" ? "電車" : "バス";
  const tripTypeLabel = expense.tripType === "ROUNDTRIP" ? "往復" : "片道";
  const tripTypeBadgeClass =
    expense.tripType === "ROUNDTRIP"
      ? "bg-purple-100 text-purple-700"
      : "bg-emerald-100 text-emerald-700";
  const titleId = `${idPrefix}-${idx}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm focus:outline-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p id={titleId} className="text-sm font-semibold text-gray-900">
            {formattedDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
            {transportLabel}
          </span>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${tripTypeBadgeClass}`}>
            {tripTypeLabel}
          </span>
        </div>
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
        <div className="flex items-baseline gap-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">出発</dt>
          <dd className="text-gray-900">{expense.departure}</dd>
        </div>
        <div className="flex items-baseline gap-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">到着</dt>
          <dd className="text-gray-900">{expense.arrival}</dd>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto md:items-baseline">
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">申請金額</dt>
          <dd className="text-gray-900">{amountLabel}円</dd>
          <div className="ml-auto flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="sm" className="rounded-md text-xl">
              <AiOutlineEdit className="text-blue-500" onClick={() => onEditClick(expense.id)} />
            </Button>
            <Button variant="danger" size="sm" className="rounded-md text-xl">
              <AiOutlineDelete className="text-red-500" onClick={() => onDeleteClick(expense.id)} />
            </Button>
          </div>
        </div>
      </dl>
      <div className="mt-4 hidden items-center justify-end gap-2 md:flex">
        <Button variant="ghost" size="sm" className="rounded-md text-lg">
          <AiOutlineEdit className="text-blue-500" onClick={() => onEditClick(expense.id)} />
        </Button>
        <Button variant="danger" size="sm" className="rounded-md text-lg">
          <AiOutlineDelete className="text-red-500" onClick={() => onDeleteClick(expense.id)} />
        </Button>
      </div>
      {/* 編集用アコーディオン */}
      {selectedExpenseId === expense.id && (
        <div className="mt-4 rounded-lg border-t pt-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await onSubmitUpdate(expense.id);
              } catch (err) {
                console.error("更新に失敗しました:", err);
              }
            }}
            noValidate
            className="mt-3 space-y-3"
          >
            {errors.length > 0 && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                <ul className="list-disc pl-4 space-y-1">
                  {errors.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
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
                  onChange={(e) => onFormChange({ ...expenseEditForm, date: e.target.value })}
                  className="w-full max-w-full rounded-md border border-gray-200 px-2 py-1 text-sm"
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
                  onChange={(e) => onFormChange({ ...expenseEditForm, departure: e.target.value })}
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
                  onChange={(e) => onFormChange({ ...expenseEditForm, arrival: e.target.value })}
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
                    onFormChange({ ...expenseEditForm, amount: Number(e.target.value) })
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
                      onFormChange({
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
                      onFormChange({
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
              <Button
                variant="secondary"
                size="md"
                onClick={() => onEditClick(expense.id)}
                className="rounded-md border-gray-200 shadow-none hover:shadow-none"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isUpdating}
                className="rounded-md py-1"
              >
                {isUpdating ? "更新中..." : "更新する"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
};
