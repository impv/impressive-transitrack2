import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import {
  validate,
  validateAmount,
  validateRequired,
  validateTransportType,
  validateTripType,
} from "@/lib/validation";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  createFavoriteRoute,
  getFavoriteRoutesByMemberId,
} from "@/server/favoriteRoutes/repository";

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

      const errors = validate(
        validateRequired({ departure, arrival, amount, transport, tripType }),
        validateTransportType(transport),
        validateTripType(tripType),
        validateAmount(amount),
      );
      if (errors.length > 0) {
        return res.status(400).json({ message: errors.join("、") });
      }

      const numAmount = Number(amount);

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
