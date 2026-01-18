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

export interface ExpenseRecord extends Expense {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseInput = Omit<Expense, "memberId">;
