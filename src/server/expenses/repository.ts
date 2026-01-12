import { prisma } from "@/server/prisma";
import type { Expense } from "@/types/expenses";

/** 交通費のテーブルを作成。
 * 往復の場合、行きと帰りの2つのレコードを自動的に作成する。
 */
export const createExpense = async (params: Expense) => {
  const { memberId, date, departure, arrival, amount, transport, tripType } = params;

  // 片道の場合は1つのレコードを作成
  if (tripType === "ONEWAY") {
    return prisma.expense.create({
      data: {
        memberId,
        date,
        departure,
        arrival,
        amount,
        transport,
        tripType,
      },
    });
  }

  // 往復の場合は2つのレコードを作成（片道分の金額をそのまま使用）
  return prisma.$transaction(async (tx) => {
    // 行き（出発駅 → 到着駅）
    const outbound = await tx.expense.create({
      data: {
        memberId,
        date,
        departure,
        arrival,
        amount,
        transport,
        tripType,
      },
    });

    // 帰り（到着駅 → 出発駅）
    const inbound = await tx.expense.create({
      data: {
        memberId,
        date,
        departure: arrival,
        arrival: departure,
        amount,
        transport,
        tripType,
      },
    });

    return { outbound, inbound };
  });
};
