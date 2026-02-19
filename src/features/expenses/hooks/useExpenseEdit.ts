import { useState } from "react";
import { deleteExpense, updateExpense } from "@/features/expenses/apiClient";
import {
  validate,
  validateAmount,
  validateDate,
  validateNotFutureDate,
  validateRequired,
} from "@/lib/validation";
import type { ExpenseInput, ExpenseRecord } from "@/types/expenses";

type ExpenseEditFormState = Omit<ExpenseInput, "tripType">;

interface UseExpenseEditorOptions {
  onSuccess?: (updated: ExpenseRecord) => void;
  onDeleteSuccess?: (deletedId: string) => void;
  expenses: ExpenseRecord[];
}

export const useExpenseEdit = (opts: UseExpenseEditorOptions) => {
  const [expenseEditForm, setExpenseEditForm] = useState<ExpenseEditFormState>({
    date: "",
    departure: "",
    arrival: "",
    amount: 0,
    transport: "TRAIN",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  const openEditor = (expense: ExpenseRecord) => {
    setExpenseEditForm({
      date: expense.date.split("T")[0],
      departure: expense.departure,
      arrival: expense.arrival,
      amount: expense.amount,
      transport: expense.transport,
    });
  };

  const closeEditor = () => {
    setSelectedExpenseId(null);
    setExpenseEditForm({
      date: "",
      departure: "",
      arrival: "",
      amount: 0,
      transport: "TRAIN",
    });
  };

  const handleDeleteClick = async (expenseId: string) => {
    const confirmed = window.confirm(
      "この申請を削除してよろしいですか？ この操作は取り消せません。",
    );
    if (!confirmed) return;

    try {
      await deleteExpense(expenseId);
      opts.onDeleteSuccess?.(expenseId);
    } catch (error) {
      console.error("交通費の削除に失敗しました:", error);
      alert("削除に失敗しました。時間をおいて再度お試しください。");
    }
  };

  const handleEditClick = (expenseId: string) => {
    if (selectedExpenseId === expenseId) {
      closeEditor();
      return;
    }
    const target = opts.expenses.find((e) => e.id === expenseId);
    if (target) {
      openEditor(target);
    }
    setSelectedExpenseId(expenseId);
  };

  const submitUpdate = async (expenseId: string) => {
    setErrors([]);

    const validationErrors = validate(
      validateRequired({
        date: expenseEditForm.date,
        departure: expenseEditForm.departure,
        arrival: expenseEditForm.arrival,
        amount: expenseEditForm.amount,
      }),
      validateAmount(expenseEditForm.amount),
      validateDate(expenseEditForm.date),
      validateNotFutureDate(expenseEditForm.date),
    );
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsUpdating(true);
    try {
      const payload: Partial<ExpenseInput> & { timezoneOffset: number } = {
        date: expenseEditForm.date,
        departure: expenseEditForm.departure,
        arrival: expenseEditForm.arrival,
        amount: expenseEditForm.amount,
        transport: expenseEditForm.transport,
        timezoneOffset: new Date().getTimezoneOffset(),
      };
      const response = await updateExpense(expenseId, payload);
      const updatedExpense = {
        ...response,
        transport: response.transport,
        tripType: response.tripType,
      } as ExpenseRecord;
      opts.onSuccess?.(updatedExpense);
      return updatedExpense;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "更新に失敗しました";
      setErrors([errorMessage]);
      throw e;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    expenseEditForm,
    isUpdating,
    errors,
    selectedExpenseId,
    setExpenseEditForm,
    openEditor,
    closeEditor,
    submitUpdate,
    setSelectedExpenseId,
    handleEditClick,
    handleDeleteClick,
  };
};
