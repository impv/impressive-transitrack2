import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  getFavoriteRoutes,
  createFavoriteRoute,
  updateFavoriteRoute,
  deleteFavoriteRoute,
} from "@/features/favoriteRoutes/apiClient";
import type { FavoriteRouteResponseItem } from "@/features/favoriteRoutes/apiClient";
import type { FavoriteRouteInput } from "@/types/favoriteRoutes";

const INITIAL_FORM_STATE: FavoriteRouteInput = {
  name: "",
  departure: "",
  arrival: "",
  amount: 0,
  transport: "TRAIN",
  tripType: "ONEWAY",
};

interface UseFavoriteRoutesResult {
  /**
   * お気に入り経路一覧
   */
  favorites: FavoriteRouteResponseItem[];
  /**
   * 読み込み中フラグ
   */
  isLoading: boolean;
  /**
   * 取得エラーメッセージ
   */
  fetchError: string | null;
  /**
   * お気に入り経路フォームの状態
   */
  favoriteForm: FavoriteRouteInput;
  /**
   * 編集中のお気に入り経路ID（新規作成時はnull）
   */
  editingFavoriteId: string | null;
  /**
   * 保存中フラグ
   */
  isSaving: boolean;
  /**
   * 保存エラーメッセージ
   */
  saveError: string | null;
  /**
   * お気に入り経路フォームの状態を更新する関数
   */
  setFavoriteForm: Dispatch<SetStateAction<FavoriteRouteInput>>;
  /**
   * お気に入り経路を保存する関数（新規作成・編集両対応）
   */
  handleSaveFavorite: () => Promise<void>;
  /**
   *
   * お気に入り経路を編集モードにする関数
   */
  handleEditFavorite: (id: string) => void;
  /**
   * お気に入り経路を削除する関数
   */
  handleDeleteFavorite: (id: string) => Promise<void>;
  /**
   * 編集をキャンセルする関数
   */
  handleCancelEdit: () => void;
  /**
   * 経費申請フォームからお気に入り経路を保存する関数
   */
  saveFromExpenseForm: (input: Omit<FavoriteRouteInput, "name">) => Promise<void>;
  /**
   * お気に入り経路一覧を再取得する関数
   */
  refetch: () => Promise<void>;
}

export const useFavoriteRoutes = (): UseFavoriteRoutesResult => {
  const [favorites, setFavorites] = useState<FavoriteRouteResponseItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [favoriteForm, setFavoriteForm] = useState<FavoriteRouteInput>(INITIAL_FORM_STATE);
  const [editingFavoriteId, setEditingFavoriteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await getFavoriteRoutes();
      setFavorites(data);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "お気に入り経路の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  /**
   * お気に入り経路を保存する関数（新規作成・編集両対応）
   * handleEditFavorite からeditingFavoriteIdがセットされている場合は更新処理を行い、
   * そうでない場合は新規作成処理を行う
   */
  const handleSaveFavorite = useCallback(async () => {
    setSaveError(null);
    if (!favoriteForm.departure || !favoriteForm.arrival || !favoriteForm.amount) {
      setSaveError("出発・到着・金額は必須です");
      return;
    }
    setIsSaving(true);
    try {
      if (editingFavoriteId) {
        const updated = await updateFavoriteRoute(editingFavoriteId, favoriteForm);
        setFavorites((prev) => prev.map((f) => (f.id === editingFavoriteId ? updated : f)));
      } else {
        const created = await createFavoriteRoute(favoriteForm);
        setFavorites((prev) => [created, ...prev]);
      }
      setFavoriteForm(INITIAL_FORM_STATE);
      setEditingFavoriteId(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  }, [favoriteForm, editingFavoriteId]);

  /**
   * お気に入り経路を編集モードにする関数 (編集の実行は handleSaveFavorite)
   */
  const handleEditFavorite = useCallback(
    (id: string) => {
      const target = favorites.find((f) => f.id === id);
      if (!target) return;
      setEditingFavoriteId(id);
      setFavoriteForm({
        name: target.name,
        departure: target.departure,
        arrival: target.arrival,
        amount: target.amount,
        transport: target.transport as "TRAIN" | "BUS",
        tripType: target.tripType as "ONEWAY" | "ROUNDTRIP",
      });
    },
    [favorites],
  );

  /**
   * お気に入り経路を削除する関数
   */
  const handleDeleteFavorite = useCallback(async (id: string) => {
    if (!window.confirm("このお気に入り経路を削除してよろしいですか？")) return;
    try {
      await deleteFavoriteRoute(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("お気に入り経路の削除に失敗しました:", error);
    }
  }, []);

  /**
   * 編集をキャンセルする関数
   */
  const handleCancelEdit = useCallback(() => {
    setEditingFavoriteId(null);
    setFavoriteForm(INITIAL_FORM_STATE);
    setSaveError(null);
  }, []);

  /**
   * 経費申請フォームからお気に入り経路を保存する関数
   */
  const saveFromExpenseForm = useCallback(async (input: Omit<FavoriteRouteInput, "name">) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const created = await createFavoriteRoute({ ...input, name: "" });
      setFavorites((prev) => [created, ...prev]);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    favorites,
    isLoading,
    fetchError,
    favoriteForm,
    editingFavoriteId,
    isSaving,
    saveError,
    setFavoriteForm,
    handleSaveFavorite,
    handleEditFavorite,
    handleDeleteFavorite,
    handleCancelEdit,
    saveFromExpenseForm,
    refetch: fetchFavorites,
  };
};
