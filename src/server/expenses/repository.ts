import { prisma } from "@/lib/prisma";
import type { Expense } from "@/types/expenses";

/** 交通費のテーブルを作成。
 * 往復の場合、行きと帰りの2つのレコードを自動的に作成する。
 * 戻り値は常に配列形式（片道: 1件、往復: 2件）
 */
export const createExpense = async (params: Expense) => {
  const { memberId, date, departure, arrival, amount, transport, tripType } = params;
  const dateValue = new Date(date);

  // 片道の場合は1つのレコードを作成
  if (tripType === "ONEWAY") {
    const expense = await prisma.expense.create({
      data: {
        memberId,
        date: dateValue,
        departure,
        arrival,
        amount,
        transport,
        tripType,
      },
    });
    return [expense];
  }

  // 往復の場合は2つのレコードを作成（片道分の金額をそのまま使用）
  return prisma.$transaction(async (tx) => {
    // 行き（出発駅 → 到着駅）
    const outbound = await tx.expense.create({
      data: {
        memberId,
        date: dateValue,
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
        date: dateValue,
        departure: arrival,
        arrival: departure,
        amount,
        transport,
        tripType,
      },
    });

    return [outbound, inbound];
  });
};

/** 指定したユーザーIDの交通費申請一覧を取得 */
export const getExpensesByMemberId = async (
  memberId: string,
  options?: {
    yearMonth?: string; // YYYY-MM形式
  },
) => {
  /** TODO 型を修正する */
  const where: any = { memberId };

  // 年月でフィルタリング
  if (options?.yearMonth) {
    const [year, month] = options.yearMonth.split("-");
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

    where.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  return prisma.expense.findMany({
    where,
    orderBy: { date: "desc" },
  });
};

/** 指定したIDの交通費申請を更新 */
export const updateExpenseById = async (id: string, data: Partial<Expense>) => {
  return prisma.expense.update({
    where: { id },
    data,
  });
};

/** 指定したIDの交通費申請を削除 */
export const deleteExpenseById = async (id: string) => {
  return prisma.expense.delete({
    where: { id },
  });
};

/** 指定したIDの交通費申請を取得 */
export const getExpenseById = async (id: string) => {
  return prisma.expense.findUnique({
    where: { id },
  });
};
