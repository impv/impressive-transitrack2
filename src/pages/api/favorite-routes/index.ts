import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  createFavoriteRoute,
  getFavoriteRoutesByMemberId,
} from "@/server/favoriteRoutes/repository";
import { TransportType, TripType } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "未認証です" });
  }

  if (req.method === "GET") {
    try {
      const favorites = await getFavoriteRoutesByMemberId(session.user.id);
      return res.status(200).json(favorites);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "サーバーエラー" });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, departure, arrival, amount, transport, tripType } = req.body;

      if (!departure || !arrival || !amount || !transport || !tripType) {
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

      const favorite = await createFavoriteRoute({
        memberId: session.user.id,
        name: typeof name === "string" ? name.trim() : "",
        departure,
        arrival,
        amount: numAmount,
        transport,
        tripType,
      });
      return res.status(201).json(favorite);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "サーバーエラー" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end();
}
