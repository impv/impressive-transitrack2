import { prisma } from "@/lib/prisma";
import type { FavoriteRoute } from "@/types/favoriteRoutes";

/** 指定したユーザーのお気に入り経路一覧を取得 */
export const getFavoriteRoutesByMemberId = async (memberId: string) => {
  return prisma.favoriteRoute.findMany({
    where: { memberId },
    orderBy: { createdAt: "desc" },
  });
};

/** お気に入り経路を作成 */
export const createFavoriteRoute = async (params: FavoriteRoute) => {
  const { memberId, name, departure, arrival, amount, transport, tripType } = params;
  return prisma.favoriteRoute.create({
    data: { memberId, name, departure, arrival, amount, transport, tripType },
  });
};

/** 指定したIDのお気に入り経路を更新 */
export const updateFavoriteRouteById = async (id: string, data: Partial<FavoriteRoute>) => {
  return prisma.favoriteRoute.update({
    where: { id },
    data,
  });
};

/** 指定したIDのお気に入り経路を削除 */
export const deleteFavoriteRouteById = async (id: string) => {
  return prisma.favoriteRoute.delete({
    where: { id },
  });
};

/** 指定したIDのお気に入り経路を取得 */
export const getFavoriteRouteById = async (id: string) => {
  return prisma.favoriteRoute.findUnique({
    where: { id },
  });
};
