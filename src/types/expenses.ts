import type { TransportType, TripType } from "@prisma/client";

export interface Expense {
  memberId: string;
  date: string;
  departure: string;
  arrival: string;
  amount: number;
  transport: TransportType;
  tripType: TripType;
}

export type ExpenseInput = Omit<Expense, "memberId">;
