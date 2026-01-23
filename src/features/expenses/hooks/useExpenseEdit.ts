import { useState } from "react";
import { deleteExpense, updateExpense } from "@/features/expenses/apiClient";
import type { ExpenseInput, ExpenseRecord } from "@/types/expenses";

interface UseExpenseEditorOptions {
  onSuccess?: (updated: ExpenseRecord) => void;
  onDeleteSuccess?: (deletedId: string) => void;
  expenses: ExpenseRecord[];
}

export const useExpenseEditor = (opts: UseExpenseEditorOptions) => {
  const [expenseEditForm, setExpenseEditForm] = useState<ExpenseInput>({
    date: "",
    departure: "",
    arrival: "",
    amount: 0,
    transport: "TRAIN",
    tripType: "ONEWAY",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  const openEditor = (expense: ExpenseRecord) => {
    setExpenseEditForm({
      date: expense.date.split("T")[0],
      departure: expense.departure,
      arrival: expense.arrival,
      amount: expense.amount,
      transport: expense.transport,
      tripType: expense.tripType,
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
      tripType: "ONEWAY",
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
    setIsUpdating(true);
    setError(null);
    try {
      const payload = {
        date: expenseEditForm.date,
        departure: expenseEditForm.departure,
        arrival: expenseEditForm.arrival,
        amount: expenseEditForm.amount,
        transport: expenseEditForm.transport,
        tripType: expenseEditForm.tripType,
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
      setError(errorMessage);
      throw e;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    expenseEditForm,
    isUpdating,
    error,
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
