// 申請内容がお気に入り経路に登録されていない場合に表示されるダイアログ。申請処理等は全て実装済み

// 残タスク：フォーム内でお気に入り経路を選択した場合に、フィールドを固定テキストに変更して編集できないようにする。
// 残タスク２：ダッシュボードからお気に入り経路カードを無くして、別ページとして遷移させる？

import type { FC } from "react";
import { MdDirectionsBus, MdStar, MdSwapVert, MdSyncAlt, MdTrain } from "react-icons/md";
import { Button } from "@/components/elements/Button";
import { Dialog } from "@/components/elements/Dialog";
import type { ExpenseInput } from "@/types/expenses";

interface FavoriteRouteConfirmDialogProps {
  /**
   * ダイアログの開閉
   */
  isVisible: boolean;
  /**
   * フォームの申請内容
   */
  formData: Pick<ExpenseInput, "departure" | "arrival" | "amount" | "transport" | "tripType">;
  /**
   * 申請処理中フラグ
   */
  isSubmitting: boolean;
  /**
   * 申請/お気に入り登録を行うハンドラ
   * @param shouldRegisterFavorite 申請をお気に入りに登録するかどうか
   */
  onConfirmDialogSubmit: (shouldRegisterFavorite: boolean) => void;
  /**
   * ダイアログを閉じるハンドラ
   */
  onClose: () => void;
}

export const FavoriteRouteConfirmDialog: FC<FavoriteRouteConfirmDialogProps> = ({
  isVisible,
  formData,
  isSubmitting,
  onConfirmDialogSubmit,
  onClose,
}) => {
  const isTrain = formData.transport === "TRAIN";
  const isOneWay = formData.tripType === "ONEWAY";
  const TransportIcon = isTrain ? MdTrain : MdDirectionsBus;
  const TripTypeIcon = isOneWay ? MdSwapVert : MdSyncAlt;

  return (
    <Dialog
      title="お気に入り経路に登録"
      content={
        <div className="space-y-4">
          {/* サブタイトル */}
          <div className="flex items-center gap-1.5 -mt-1 pb-3 border-b border-gray-100">
            <MdStar className="text-amber-400 shrink-0" size={15} />
            <p className="text-sm text-gray-500">次回からの申請を便利にしましょう</p>
          </div>

          {/* 経路カード */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-stretch gap-3">
              {/* 路線インジケーター */}
              <div className="flex flex-col items-center gap-1 pt-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 ring-2 ring-blue-200" />
                <div className="flex-1 w-px bg-gradient-to-b from-blue-300 to-blue-500 min-h-6" />
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-300" />
              </div>
              {/* 出発・到着 */}
              <div className="flex flex-col justify-between flex-1 gap-2">
                <div>
                  <p className="text-[10px] font-medium text-blue-400 uppercase tracking-wide">出発</p>
                  <p className="text-sm font-semibold text-gray-800">{formData.departure}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wide">到着</p>
                  <p className="text-sm font-semibold text-gray-800">{formData.arrival}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 詳細グリッド */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <TransportIcon className="text-gray-400" size={20} />
              <p className="text-[10px] text-gray-400">交通手段</p>
              <p className="text-xs font-semibold text-gray-700">{isTrain ? "電車" : "バス"}</p>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <TripTypeIcon className="text-gray-400" size={20} />
              <p className="text-[10px] text-gray-400">区間種別</p>
              <p className="text-xs font-semibold text-gray-700">{isOneWay ? "片道" : "往復"}</p>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-gray-400 text-base font-bold leading-5">¥</span>
              <p className="text-[10px] text-gray-400">申請金額</p>
              <p className="text-xs font-semibold text-gray-700">{formData.amount.toLocaleString("ja-JP")}円</p>
            </div>
          </div>

          {/* 注記 */}
          <p className="text-[11px] text-gray-400 text-center">
            登録した経路は次回以降の申請フォームで選択できます
          </p>
        </div>
      }
      footer={
        <div className="flex flex-col gap-2 mt-2">
          <Button
            fullWidth
            size="lg"
            onClick={() => onConfirmDialogSubmit(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "送信中..." : "登録して申請する"}
          </Button>
          <Button
            fullWidth
            size="lg"
            variant="ghost"
            onClick={() => onConfirmDialogSubmit(false)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "送信中..." : "登録せずに申請する"}
          </Button>
        </div>
      }
      isVisible={isVisible}
      onClose={onClose}
    />
  );
};
