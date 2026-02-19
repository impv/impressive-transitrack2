import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import {
  validate,
  validateAmount,
  validateDate,
  validateNotFutureDateWithOffset,
  validateRequired,
  validateTransportType,
  validateTripType,
} from "@/lib/validation";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { createExpense, getAllExpenses, getExpensesByMemberId } from "@/server/expenses/repository";

const YEAR_MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "未認証です" });
  }

  if (req.method === "GET") {
    try {
      const { yearMonth } = req.query;
      const yearMonthStr = Array.isArray(yearMonth) ? yearMonth[0] : yearMonth;

      if (yearMonthStr && !YEAR_MONTH_PATTERN.test(yearMonthStr)) {
        return res.status(400).json({ message: "yearMonth は YYYY-MM 形式で指定してください" });
      }

      // yearMonth が指定されている場合はフィルタリング、未指定の場合は全件取得
      const options = yearMonthStr ? { yearMonth: yearMonthStr } : undefined;

      // 管理者の場合は全メンバーの申請を取得、それ以外は自分の申請のみ
      const expenses = session.user.isAdmin
        ? await getAllExpenses(options)
        : await getExpensesByMemberId(session.user.id, options);
      return res.status(200).json(expenses);
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message === "yearMonth must be in YYYY-MM format") {
        return res.status(400).json({ message: "yearMonth は YYYY-MM 形式で指定してください" });
      }
      return res.status(500).json({ message: "サーバーエラー" });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end();
  }

  try {
    const { date, departure, arrival, amount, transport, tripType, timezoneOffset } = req.body;

    const errors = validate(
      validateRequired({ date, departure, arrival, amount, transport, tripType }),
      validateTransportType(transport),
      validateTripType(tripType),
      validateAmount(amount),
      validateDate(date),
      validateNotFutureDateWithOffset(date, timezoneOffset),
    );
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join("、") });
    }

    const numAmount = Number(amount);

    const expenses = await createExpense({
      memberId: session.user.id,
      date,
      departure,
      arrival,
      amount: numAmount,
      transport,
      tripType,
    });

    return res.status(201).json(expenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
}
