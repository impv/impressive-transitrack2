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
  deleteFavoriteRouteById,
  getFavoriteRouteById,
  updateFavoriteRouteById,
} from "@/server/favoriteRoutes/repository";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "未認証です" });
  }

  const { id } = req.query;
  const favoriteId = Array.isArray(id) ? id[0] : id;
  if (!favoriteId) {
    return res.status(400).json({ message: "ID が不正です" });
  }

  try {
    const favorite = await getFavoriteRouteById(favoriteId);
    if (!favorite) {
      return res.status(404).json({ message: "お気に入り経路が見つかりません" });
    }
    if (favorite.memberId !== session.user.id) {
      return res.status(403).json({ message: "権限がありません" });
    }

    if (req.method === "PUT") {
      const { name, departure, arrival, amount, transport, tripType } = req.body;

      const validation = validate(
        validateRequired({ departure, arrival, amount, transport, tripType }),
        validateTransportType(transport),
        validateTripType(tripType),
        validateAmount(amount),
      );
      if (validation.hasError) {
        return res.status(400).json({ message: validation.message });
      }

      const numAmount = Number(amount);

      const updated = await updateFavoriteRouteById(favoriteId, {
        name: typeof name === "string" ? name.trim() : "",
        departure,
        arrival,
        amount: numAmount,
        transport,
        tripType,
      });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      await deleteFavoriteRouteById(favoriteId);
      return res.status(204).end();
    }

    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "サーバーエラー" });
  }
}
