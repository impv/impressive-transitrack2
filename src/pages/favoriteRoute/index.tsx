import { Card } from "@/components/elements/Card";
import { FavoriteRouteManagement } from "@/features/expenses/components/FavoriteRouteManagement";
import { useFavoriteRoutes } from "@/features/expenses/hooks/useFavoriteRoutes";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

const FavoriteRoutePage = () => {
  const {
    favorites,
    isLoading: isFavoritesLoading,
    favoriteForm,
    editingFavoriteId,
    isCreating,
    isSaving: isFavoriteSaving,
    saveError: favoriteSaveError,
    setFavoriteForm,
    handleSaveFavorite,
    handleEditFavorite,
    handleDeleteFavorite,
    handleCancelEdit,
    handleStartCreate,
  } = useFavoriteRoutes();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full px-4 py-3 text-xl font-medium shadow-lg bg-white hover:bg-gray-100"
            aria-label="ダッシュボードに戻る"
          >
            <IoArrowBack size={20} />
          </Link>
        </div>
        <Card className="mt-6 sm:mt-8">
          <FavoriteRouteManagement
            favorites={favorites}
            isFavoritesLoading={isFavoritesLoading}
            favoriteForm={favoriteForm}
            editingFavoriteId={editingFavoriteId}
            isCreating={isCreating}
            isFavoriteSaving={isFavoriteSaving}
            favoriteSaveError={favoriteSaveError}
            setFavoriteForm={setFavoriteForm}
            handleSaveFavorite={handleSaveFavorite}
            handleEditFavorite={handleEditFavorite}
            handleDeleteFavorite={handleDeleteFavorite}
            handleCancelEdit={handleCancelEdit}
            handleStartCreate={handleStartCreate}
          />
        </Card>
      </div>
    </div>
  );
};

export default FavoriteRoutePage;

// お気に入り経路をページとして作成し、フォーム内から遷移できるようボタンを配置 / 各カードのタイトルにアイコンを配置したものをコミット
// TODO: お気に入り経路のページをリファクタリング
// TODO: お気に入り経路のページで新規作成できるようにする？
