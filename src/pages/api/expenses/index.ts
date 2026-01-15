import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { createExpense } from "@/server/expenses/repository";
import { TransportType, TripType } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "未認証です" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  try {
    const { date, departure, arrival, amount, transport, tripType } = req.body;

    if (!date || !departure || !arrival || !amount || !transport || !tripType) {
      return res.status(400).json({ message: "必須項目が不足しています" });
    }

    if (!Object.values(TransportType).includes(transport)) {
      return res.status(400).json({ message: "transport の値が不正です" });
    }

    if (!Object.values(TripType).includes(tripType)) {
      return res.status(400).json({ message: "tripType の値が不正です" });
    }

    const expenses = await createExpense({
      memberId: session.user.id,
      date,
      departure,
      arrival,
      amount: Number(amount),
      transport,
      tripType,
    });

    return res.status(201).json(expenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
}
