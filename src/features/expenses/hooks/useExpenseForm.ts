import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createExpense } from "@/features/expenses/apiClient";
import {
  validate,
  validateAmount,
  validateDate,
  validateNotFutureDate,
  validateRequired,
} from "@/lib/validation";
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

      const validation = validate(
        validateRequired({
          date: expenseForm.date,
          departure: expenseForm.departure,
          arrival: expenseForm.arrival,
          amount: expenseForm.amount,
        }),
        validateAmount(expenseForm.amount),
        validateDate(expenseForm.date),
        validateNotFutureDate(expenseForm.date),
      );
      if (validation.hasError) {
        setSubmitError(validation.message ?? "入力内容に誤りがあります");
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
