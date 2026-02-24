import type { TransportType, TripType } from "@prisma/client";

export interface Expense {
  /**
   * メンバーのID
   */
  memberId: string;
  /**
   * 日付
   */
  date: string;
  /**
   * 出発地
   */
  departure: string;
  /**
   * 到着地
   */
  arrival: string;
  /**
   * 金額
   */
  amount: number;
  /**
   * 交通手段
   * TRAIN: 電車
   * BUS: バス
   */
  transport: TransportType;
  /**
   * 片道、往復
   * ONEWAY: 片道
   * ROUNDTRIP: 往復
   */
  tripType: TripType;
}

export interface ExpenseRecord extends Expense {
  id: string;
  createdAt: string;
  updatedAt: string;
  member?: {
    name: string;
    email: string;
  };
}

export type ExpenseInput = Omit<Expense, "memberId">;

/**
 * 申請の編集タイプ
 * save: 新規作成、更新
 * delete: 削除
 */
export type SubmitAction = "save" | "delete";
