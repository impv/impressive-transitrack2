import type { ExpenseInput } from "@/types/expenses";

export interface ApiError {
  message: string;
}

export interface CreateExpenseResponse {
  id: string;
  memberId: string;
  date: string;
  departure: string;
  arrival: string;
  amount: number;
  transport: string;
  createdAt: string;
  updatedAt: string;
}

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
