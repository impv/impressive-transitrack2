import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/useToast";
import { SummaryExpenses } from "@/features/expenses/components/SummaryExpenses";
import { Toast } from "@/components/elements/Toast";
import { ExpenseForm } from "@/features/expenses/components/ExpenseForm";
import { Header } from "@/components/elements/Header";
import { Card } from "@/components/elements/Card";
import { useCallback, useEffect, useState } from "react";
import { FavoriteRouteManagement } from "@/features/expenses/components/FavoriteRouteManagement";
import { useFavoriteRoutes } from "@/features/expenses/hooks/useFavoriteRoutes";
import { ScrollToTopButton } from "@/components/elements/ScrollToTopButton";
import type { SubmitAction } from "@/types/expenses";

const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { data: session, status } = useSession();
  const {
    favorites,
    isLoading: isFavoritesLoading,
    favoriteForm,
    editingFavoriteId,
    isSaving: isFavoriteSaving,
    saveError: favoriteSaveError,
    setFavoriteForm,
    handleSaveFavorite,
    handleEditFavorite,
    handleDeleteFavorite,
    handleCancelEdit,
    saveFromExpenseForm,
  } = useFavoriteRoutes();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  const { toastMessage, showToast } = useToast();

  const handleSubmit = useCallback(
    (action: SubmitAction) => {
      setRefreshTrigger((v) => v + 1);
      showToast(action === "save" ? "申請を更新しました" : "申請を削除しました");
    },
    [showToast],
  );

  // 未ログイン時はリダイレクト中の表示
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">リダイレクト中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* ヘッダー */}
        <Header />

        {/* 交通費合計カード */}
        <Card className="mt-6 sm:mt-8">
          <SummaryExpenses refreshTrigger={refreshTrigger} />
        </Card>

        {/* 交通費申請フォームカード */}
        <Card className="mt-6 sm:mt-8">
          <ExpenseForm
            onSuccess={handleSubmit}
            favorites={favorites}
            isFavoriteSaving={isFavoriteSaving}
            saveFromExpenseForm={saveFromExpenseForm}
          />
        </Card>

        {/* お気に入り経路管理カード */}
        <Card className="mt-6 sm:mt-8">
          <FavoriteRouteManagement
            favorites={favorites}
            isFavoritesLoading={isFavoritesLoading}
            favoriteForm={favoriteForm}
            editingFavoriteId={editingFavoriteId}
            isFavoriteSaving={isFavoriteSaving}
            favoriteSaveError={favoriteSaveError}
            setFavoriteForm={setFavoriteForm}
            handleSaveFavorite={handleSaveFavorite}
            handleEditFavorite={handleEditFavorite}
            handleDeleteFavorite={handleDeleteFavorite}
            handleCancelEdit={handleCancelEdit}
          />
        </Card>

        {/* トースト */}
        {toastMessage && <Toast toastMessage={toastMessage} />}

        {/* ページ上部へ戻るボタン */}
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default Dashboard;
