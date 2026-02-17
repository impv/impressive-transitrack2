import { TransportType, TripType } from "@prisma/client";
import type { ExpenseResponseItem } from "../apiClient";
import type { ExpenseRecord } from "@/types/expenses";

const VALID_TRANSPORTS = Object.values(TransportType) as string[];
const VALID_TRIP_TYPES = Object.values(TripType) as string[];

export const normalizeExpenseRecords = (expenses: ExpenseResponseItem[]): ExpenseRecord[] => {
  return expenses.map((expense) => {
    if (!VALID_TRANSPORTS.includes(expense.transport)) {
      throw new Error("不正な transport");
    }
    if (!VALID_TRIP_TYPES.includes(expense.tripType)) {
      throw new Error("不正な tripType");
    }

    return {
      ...expense,
      transport: expense.transport as TransportType,
      tripType: expense.tripType as TripType,
      member: expense.member,
    };
  });
};
