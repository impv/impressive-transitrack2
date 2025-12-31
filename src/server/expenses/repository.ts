/** 交通費のテーブルを作成。
 * 往復の場合、行きと帰りの2つのレコードを自動的に作成する。
 */

import { prisma } from "@/server/prisma";
import type { TransportType, TripType } from "@prisma/client";

export const createExpense = async (params: {
  memberId: string;
  date: Date;
  departureStation: string;
  arrivalStation: string;
  amount: number;
  transport: TransportType;
  tripType: TripType;
}) => {
  const { memberId, date, departureStation, arrivalStation, amount, transport, tripType } = params;

  // 片道の場合は1つのレコードを作成
  if (tripType === "ONEWAY") {
    return prisma.expense.create({
      data: {
        memberId,
        date,
        departureStation,
        arrivalStation,
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
        departureStation,
        arrivalStation,
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
        departureStation: arrivalStation,
        arrivalStation: departureStation,
        amount,
        transport,
        tripType,
      },
    });

    return { outbound, inbound };
  });
};
