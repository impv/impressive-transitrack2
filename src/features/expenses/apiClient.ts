import type { ExpenseInput } from "@/types/expenses";
import type { TransportType, TripType } from "@prisma/client";

interface ApiError {
  message: string;
}

export type ExpenseResponseItem = {
  id: string;
  memberId: string;
  date: string;
  departure: string;
  arrival: string;
  amount: number;
  transport: TransportType;
  tripType: TripType;
  createdAt: string;
  updatedAt: string;
  member?: {
    name: string;
    email: string;
  };
};

type ExpenseResponse = ExpenseResponseItem[];

export const createExpense = async (params: ExpenseInput): Promise<ExpenseResponse> => {
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

export const getExpenses = async (yearMonth?: string, memberId?: string): Promise<ExpenseResponse> => {
  const params = new URLSearchParams();
  if (yearMonth) params.set("yearMonth", yearMonth);
  if (memberId) params.set("memberId", memberId);
  const queryParams = params.toString() ? `?${params.toString()}` : "";
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
  payload: Partial<ExpenseInput> & { timezoneOffset?: number },
): Promise<ExpenseResponseItem> => {
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
