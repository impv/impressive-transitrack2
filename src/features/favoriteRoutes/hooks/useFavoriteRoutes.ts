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
  favorites: FavoriteRouteResponseItem[];
  isLoading: boolean;
  fetchError: string | null;

  favoriteForm: FavoriteRouteInput;
  setFavoriteForm: Dispatch<SetStateAction<FavoriteRouteInput>>;
  editingFavoriteId: string | null;

  handleSaveFavorite: () => Promise<void>;
  handleEditFavorite: (id: string) => void;
  handleDeleteFavorite: (id: string) => Promise<void>;
  handleCancelEdit: () => void;
  isSaving: boolean;
  saveError: string | null;

  saveFromExpenseForm: (input: Omit<FavoriteRouteInput, "name">) => Promise<void>;
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
      setFetchError(
        error instanceof Error ? error.message : "お気に入り経路の取得に失敗しました",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

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

  const handleDeleteFavorite = useCallback(async (id: string) => {
    if (!window.confirm("このお気に入り経路を削除してよろしいですか？")) return;
    try {
      await deleteFavoriteRoute(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("お気に入り経路の削除に失敗しました:", error);
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingFavoriteId(null);
    setFavoriteForm(INITIAL_FORM_STATE);
    setSaveError(null);
  }, []);

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
    setFavoriteForm,
    editingFavoriteId,
    handleSaveFavorite,
    handleEditFavorite,
    handleDeleteFavorite,
    handleCancelEdit,
    isSaving,
    saveError,
    saveFromExpenseForm,
    refetch: fetchFavorites,
  };
};
