import type { TransportType, TripType } from "@prisma/client";

/**
 * お気に入り経路の型定義
 * memberId: メンバーのID
 * name: お気に入り経路の名前
 * departure: 出発地
 * arrival: 到着地
 * amount: 金額
 * transport: 交通手段
 * tripType: 片道、往復
 */
export interface FavoriteRoute {
  memberId: string;
  name: string;
  departure: string;
  arrival: string;
  amount: number;
  transport: TransportType;
  tripType: TripType;
}

/**
 * お気に入り経路の入力型定義（memberIdを除く）
 */
export type FavoriteRouteInput = Omit<FavoriteRoute, "memberId">;
