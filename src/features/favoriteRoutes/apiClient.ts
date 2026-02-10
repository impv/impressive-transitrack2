import type { FavoriteRouteInput } from "@/types/favoriteRoutes";
import type { TransportType, TripType } from "@prisma/client";

interface ApiError {
  message: string;
}

export type FavoriteRouteResponseItem = {
  id: string;
  memberId: string;
  name: string;
  departure: string;
  arrival: string;
  amount: number;
  transport: TransportType;
  tripType: TripType;
  createdAt: string;
  updatedAt: string;
};

export const getFavoriteRoutes = async (): Promise<FavoriteRouteResponseItem[]> => {
  const res = await fetch("/api/favorite-routes", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errorData: ApiError = await res
      .json()
      .catch(() => ({ message: "不明なエラーが発生しました" }));
    throw new Error(errorData.message || "お気に入り経路の取得に失敗しました");
  }
  return res.json();
};

export const createFavoriteRoute = async (
  params: FavoriteRouteInput,
): Promise<FavoriteRouteResponseItem> => {
  const res = await fetch("/api/favorite-routes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData: ApiError = await res
      .json()
      .catch(() => ({ message: "不明なエラーが発生しました" }));
    throw new Error(errorData.message || "お気に入り経路の作成に失敗しました");
  }
  return res.json();
};

export const updateFavoriteRoute = async (
  id: string,
  params: FavoriteRouteInput,
): Promise<FavoriteRouteResponseItem> => {
  const res = await fetch(`/api/favorite-routes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData: ApiError = await res
      .json()
      .catch(() => ({ message: "不明なエラーが発生しました" }));
    throw new Error(errorData.message || "お気に入り経路の更新に失敗しました");
  }
  return res.json();
};

export const deleteFavoriteRoute = async (id: string): Promise<void> => {
  const res = await fetch(`/api/favorite-routes/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errorData: ApiError = await res
      .json()
      .catch(() => ({ message: "不明なエラーが発生しました" }));
    throw new Error(errorData.message || "お気に入り経路の削除に失敗しました");
  }
};
