import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { deleteExpenseById, getExpenseById, updateExpenseById } from "@/server/expenses/repository";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "未認証です" });
  }

  const { id } = req.query;
  const expenseId = Array.isArray(id) ? id[0] : id;
  if (!expenseId) {
    return res.status(400).json({ message: "ID が不正です" });
  }

  try {
    if (req.method === "GET") {
      const expense = await getExpenseById(expenseId);
      if (!expense) {
        return res.status(404).json({ message: "対象の申請が見つかりません" });
      }
      if (expense.memberId !== session.user.id) {
        return res.status(403).json({ message: "この申請を閲覧する権限がありません" });
      }
      // Prisma の Date は JSON 化で ISO 文字列になるため、そのまま返して OK
      return res.status(200).json(expense);
    }

    if (req.method === "DELETE") {
      const expense = await getExpenseById(expenseId);
      if (!expense) {
        return res.status(404).json({ message: "対象の申請が見つかりません" });
      }
      if (expense.memberId !== session.user.id) {
        return res.status(403).json({ message: "この申請を削除する権限がありません" });
      }
      await deleteExpenseById(expenseId);
      return res.status(204).end();
    }

    if (req.method === "PUT") {
      const { date, departure, arrival, amount, transport, tripType } = req.body;

      // 基本的なバリデーション
      if (!date || !departure || !arrival || !amount || !transport || !tripType) {
        return res.status(400).json({ message: "必須項目が不足しています" });
      }

      const expense = await getExpenseById(expenseId);
      if (!expense) return res.status(404).json({ message: "対象が見つかりません" });
      if (expense.memberId !== session.user.id)
        return res.status(403).json({ message: "権限なし" });

      const validTransports = ["TRAIN", "BUS"];
      const validTripTypes = ["ONEWAY", "ROUNDTRIP"];
      if (!validTransports.includes(transport))
        return res.status(400).json({ message: "transport の値が不正です" });
      if (!validTripTypes.includes(tripType))
        return res.status(400).json({ message: "tripType の値が不正です" });

      const numAmount = Number(amount);
      if (Number.isNaN(numAmount) || numAmount <= 0 || !Number.isInteger(numAmount)) {
        return res
          .status(400)
          .json({ message: "金額は整数（円単位）の正の数である必要があります" });
      }

      const selectedDate = new Date(date);
      if (Number.isNaN(selectedDate.getTime())) {
        return res.status(400).json({ message: "有効な日付を入力してください" });
      }

      const updated = await updateExpenseById(expenseId, {
        // Date を string 型に変換して保存するため ISO 文字列に変換
        date: selectedDate.toISOString(),
        departure,
        arrival,
        amount: numAmount,
        transport,
        tripType,
      });
      return res.status(200).json(updated);
    }

    res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
    return res.status(405).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
}
