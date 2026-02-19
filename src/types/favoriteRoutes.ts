import type { TransportType, TripType } from "@prisma/client";

export interface FavoriteRoute {
  /**
   * メンバーのID
   */
  memberId: string;
  /**
   * お気に入り経路の名前
   */
  name: string;
  /**
   * 出発地
   */
  departure: string;
  /**
   * 到着地
   */
  arrival: string;
  /**
   * 金額
   */
  amount: number;
  /**
   * 交通手段
   * TRAIN: 電車
   * BUS: バス
   */
  transport: TransportType;
  /**
   * 片道、往復
   * ONEWAY: 片道
   * ROUNDTRIP: 往復
   */
  tripType: TripType;
}

/**
 * お気に入り経路の入力型定義（memberIdを除く）
 */
export type FavoriteRouteInput = Omit<FavoriteRoute, "memberId">;
