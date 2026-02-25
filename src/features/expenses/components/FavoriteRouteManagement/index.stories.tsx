import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FavoriteRouteManagement } from "@/features/expenses/components/FavoriteRouteManagement";
import { mockFavorites } from "@/features/expenses/mocks";

const emptyForm = {
  name: "",
  departure: "",
  arrival: "",
  amount: 0,
  transport: "TRAIN" as const,
  tripType: "ONEWAY" as const,
};

const meta = {
  component: FavoriteRouteManagement,
} satisfies Meta<typeof FavoriteRouteManagement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    favorites: mockFavorites,
    isFavoritesLoading: false,
    favoriteForm: emptyForm,
    editingFavoriteId: null,
    isFavoriteSaving: false,
    favoriteSaveError: null,
    setFavoriteForm: () => {},
    handleSaveFavorite: async () => {},
    handleEditFavorite: () => {},
    handleDeleteFavorite: async () => {},
    handleCancelEdit: () => {},
  },
};

export const WithError: Story = {
  args: {
    favorites: mockFavorites,
    isFavoritesLoading: false,
    favoriteForm: emptyForm,
    editingFavoriteId: null,
    isFavoriteSaving: false,
    favoriteSaveError: "保存に失敗しました。入力内容を確認してください。",
    setFavoriteForm: () => {},
    handleSaveFavorite: async () => {},
    handleEditFavorite: () => {},
    handleDeleteFavorite: async () => {},
    handleCancelEdit: () => {},
  },
};
