import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FavoriteRouteManagement } from "@/features/expenses/components/FavoriteRouteManagement";

const emptyForm = {
  name: "",
  departure: "",
  arrival: "",
  amount: 0,
  transport: "TRAIN" as const,
  tripType: "ONEWAY" as const,
};

const mockFavorites = [
  {
    id: "fav-1",
    memberId: "member-1",
    name: "よく使う経路",
    departure: "東京駅",
    arrival: "渋谷駅",
    amount: 200,
    transport: "TRAIN" as const,
    tripType: "ONEWAY" as const,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "fav-2",
    memberId: "member-1",
    name: "",
    departure: "新宿駅",
    arrival: "品川駅",
    amount: 320,
    transport: "TRAIN" as const,
    tripType: "ROUNDTRIP" as const,
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
];

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
