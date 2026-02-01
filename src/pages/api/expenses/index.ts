import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { createExpense, getExpensesByMemberId, getAllExpenses } from "@/server/expenses/repository";
import { TransportType, TripType } from "@prisma/client";

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

    if (!date || !departure || !arrival || !amount || !transport || !tripType) {
      return res.status(400).json({ message: "必須項目が不足しています" });
    }

    if (!Object.values(TransportType).includes(transport)) {
      return res.status(400).json({ message: "transport の値が不正です" });
    }

    if (!Object.values(TripType).includes(tripType)) {
      return res.status(400).json({ message: "tripType の値が不正です" });
    }

    const numAmount = Number(amount);
    if (Number.isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: "金額は正の数値である必要があります" });
    }

    if (!Number.isInteger(numAmount)) {
      return res.status(400).json({ message: "金額は整数（円単位）で入力してください" });
    }

    const selectedDate = new Date(date);
    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "有効な日付を入力してください" });
    }

    // ユーザーのタイムゾーンを考慮した日付チェック
    const now = new Date();
    const userTimezoneOffset = typeof timezoneOffset === "number" ? timezoneOffset : 0;
    // ユーザーのローカル時刻を計算（timezoneOffsetは分単位、符号が逆なので引く）
    const userLocalTime = new Date(now.getTime() - userTimezoneOffset * 60 * 1000);
    const todayInUserTZ = userLocalTime.toISOString().split("T")[0];

    if (date > todayInUserTZ) {
      return res.status(400).json({ message: "未来の日付は選択できません" });
    }

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
