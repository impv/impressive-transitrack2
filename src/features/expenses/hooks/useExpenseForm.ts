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
import type { ExpenseInput, SubmitAction } from "@/types/expenses";

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
  isSubmitting: boolean;
  submitErrors: string[];
  submitSuccess: boolean;
  setExpenseForm: Dispatch<SetStateAction<ExpenseInput>>;
  handleSubmitExpense: (event: FormEvent) => Promise<void>;
  submitExpense: () => Promise<void>;
  validateAndShowErrors: () => boolean;
  resetForm: () => void;
}

export const useExpenseForm = (onSuccess: (action: SubmitAction) => void): UseExpenseFormResult => {
  const [expenseForm, setExpenseForm] = useState<ExpenseInput>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const validateAndShowErrors = useCallback(() => {
    setSubmitErrors([]);
    setSubmitSuccess(false);

    const errors = validate(
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

    if (errors.length > 0) {
      setSubmitErrors(errors);
      return false;
    }
    return true;
  }, [expenseForm]);

  const submitExpense = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await createExpense(expenseForm);
      setSubmitSuccess(true);
      setExpenseForm(INITIAL_FORM_STATE);
      onSuccess("save");

      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      successTimeoutRef.current = setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("交通費申請の送信に失敗しました", error);
      setSubmitErrors([error instanceof Error ? error.message : "交通費申請の送信に失敗しました"]);
    } finally {
      setIsSubmitting(false);
    }
  }, [expenseForm, onSuccess]);

  const handleSubmitExpense = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!validateAndShowErrors()) return;
      await submitExpense();
    },
    [validateAndShowErrors, submitExpense],
  );

  const resetForm = () => {
    setExpenseForm(INITIAL_FORM_STATE);
    setSubmitErrors([]);
    setSubmitSuccess(false);
  };

  return {
    expenseForm,
    isSubmitting,
    submitErrors,
    submitSuccess,
    setExpenseForm,
    handleSubmitExpense,
    submitExpense,
    validateAndShowErrors,
    resetForm,
  };
};
