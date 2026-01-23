import type { ExpenseInput } from "@/types/expenses";

interface ApiError {
  message: string;
}

type CreateExpenseResponse = Array<{
  id: string;
  memberId: string;
  date: string;
  departure: string;
  arrival: string;
  amount: number;
  transport: string;
  tripType: string;
  createdAt: string;
  updatedAt: string;
}>;

export const createExpense = async (params: ExpenseInput): Promise<CreateExpenseResponse> => {
  const { date, departure, arrival, amount, transport, tripType } = params;

  const res = await fetch("/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date,
      departure,
      arrival,
      amount,
      transport,
      tripType,
      timezoneOffset: new Date().getTimezoneOffset(), // ユーザーのタイムゾーンオフセット（分単位）
    }),
  });

  if (!res.ok) {
    const errorData: ApiError = await res
      .json()
      .catch(() => ({ message: "不明なエラーが発生しました" }));
    throw new Error(errorData.message || "交通費申請の作成に失敗しました");
  }

  return res.json();
};

export const getExpenses = async (yearMonth?: string): Promise<CreateExpenseResponse> => {
  const queryParams = yearMonth ? `?yearMonth=${encodeURIComponent(yearMonth)}` : "";
  const res = await fetch(`/api/expenses${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData: ApiError = await res
      .json()
      .catch(() => ({ message: "不明なエラーが発生しました" }));
    throw new Error(errorData.message || "交通費申請の取得に失敗しました");
  }

  return res.json();
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  const res = await fetch(`/api/expenses/${expenseId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData: ApiError = await res
      .json()
      .catch(() => ({ message: "不明なエラーが発生しました" }));
    throw new Error(errorData.message || "交通費申請の削除に失敗しました");
  }
};

export const updateExpense = async (
  expenseId: string,
  payload: Partial<ExpenseInput>,
): Promise<{
  id: string;
  memberId: string;
  date: string;
  departure: string;
  arrival: string;
  amount: number;
  transport: string;
  tripType: string;
  createdAt: string;
  updatedAt: string;
}> => {
  const res = await fetch(`/api/expenses/${expenseId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "不明なエラー" }));
    throw new Error(err.message || "更新に失敗しました");
  }
  return res.json();
};
