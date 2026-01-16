import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createExpense } from "@/features/expenses/apiClient";
import type { ExpenseInput } from "@/types/expenses";

const INITIAL_FORM_STATE: ExpenseInput = {
  date: "",
  departure: "",
  arrival: "",
  amount: 0,
  transport: "TRAIN",
  tripType: "ONEWAY",
};

interface UseExpenseFormResult {
  expenseForm: ExpenseInput;
  setExpenseForm: Dispatch<SetStateAction<ExpenseInput>>;
  handleSubmitExpense: (event: FormEvent) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

export const useExpenseForm = (): UseExpenseFormResult => {
  const [expenseForm, setExpenseForm] = useState<ExpenseInput>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmitExpense = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setSubmitError(null);
      setSubmitSuccess(false);

      if (
        !expenseForm.date ||
        !expenseForm.departure ||
        !expenseForm.arrival ||
        !expenseForm.amount
      ) {
        setSubmitError("全ての項目を入力してください");
        return;
      }

      const numAmount = Number(expenseForm.amount);
      if (!Number.isFinite(numAmount) || numAmount <= 0) {
        setSubmitError("金額は正の数値である必要があります");
        return;
      }

      if (!Number.isInteger(numAmount)) {
        setSubmitError("金額は整数（円単位）で入力してください");
        return;
      }

      const selectedDate = new Date(expenseForm.date);
      if (Number.isNaN(selectedDate.getTime())) {
        setSubmitError("有効な日付を入力してください");
        return;
      }

      const today = new Date();
      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        setSubmitError("未来の日付は選択できません");
        return;
      }

      setIsSubmitting(true);

      try {
        await createExpense(expenseForm);
        setSubmitSuccess(true);
        setExpenseForm(INITIAL_FORM_STATE);

        if (successTimeoutRef.current) {
          clearTimeout(successTimeoutRef.current);
        }
        successTimeoutRef.current = setTimeout(() => setSubmitSuccess(false), 3000);
      } catch (error) {
        console.error("交通費申請の送信に失敗しました", error);
        setSubmitError(error instanceof Error ? error.message : "交通費申請の送信に失敗しました");
      } finally {
        setIsSubmitting(false);
      }
    },
    [expenseForm],
  );

  return {
    expenseForm,
    setExpenseForm,
    handleSubmitExpense,
    isSubmitting,
    submitError,
    submitSuccess,
  };
};
